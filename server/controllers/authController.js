// controllers/authController.js
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import admin from '../firebaseAdmin.js';

/** 🔐 Standard Register (Non-Firebase) */
export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'buyer',
      status: 'active',
    });

    const { _id, username: name, email: userEmail, role: userRole, status } = newUser;
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: _id,
        username: name,
        email: userEmail,
        role: userRole,
        status,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/** 🔑 Standard Login */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(404).json({ error: 'User not found or using Firebase login' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

    if (user.status === 'banned') {
      return res.status(403).json({ error: 'Your account has been banned.' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    const { _id, username, email: userEmail, role, status } = user;
    res.status(200).json({
      token,
      user: { id: _id, username, email: userEmail, role, status },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/** 🔥 Firebase Login (Secure Token Verification + UID Sync) */
export const firebaseLogin = async (req, res) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  if (!idToken) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decoded;
    const { username } = req.body;

    if (!uid || !email) {
      return res.status(400).json({ message: 'Missing Firebase user info' });
    }

    let user = await User.findOne({ firebaseUid: uid }) || await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        username: username || name || 'Firebase User',
        firebaseUid: uid,
        photoURL: picture || '',
        role: 'buyer',
        status: 'active',
      });
    } else if (!user.firebaseUid) {
      user.firebaseUid = uid;
      await user.save();
    }

    if (user.status === 'banned') {
      return res.status(403).json({ message: 'Your account has been banned.' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    const { _id, username: nameOnly, role, status } = user;
    res.status(200).json({
      message: 'Firebase login successful',
      token,
      user: { id: _id, username: nameOnly, email, role, status },
    });
  } catch (err) {
    console.error('🔥 Firebase login error:', err);
    res.status(500).json({ message: 'Server error during Firebase login' });
  }
};