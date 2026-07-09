// routes/auth.js
import express from 'express';
import { register, login, firebaseLogin } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// 🔥 NEW: Firebase login sync route
router.post('/firebase-login', firebaseLogin);

export default router;
