// middleware/verifyTokenIfExists.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const verifyTokenIfExists = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return next(); // No token? Just move on

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('email role');
    if (user) {
      req.user = {
        id: user._id,
        email: user.email,
        role: user.role,
        isAdmin: user.role === 'admin',
      };
    }
  } catch (err) {
    // 🔇 Silently ignore invalid tokens
  }
  next();
};

export default verifyTokenIfExists;
