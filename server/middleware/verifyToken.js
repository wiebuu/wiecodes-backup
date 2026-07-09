import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing or malformed token' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('email role');
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      isAdmin: user.role === 'admin',
    };

    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export default verifyToken;
