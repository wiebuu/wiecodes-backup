import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// 📦 Route Imports
import authRoutes from './routes/auth.js';
import protectedRoutes from './routes/protected.js';
import templateRoutes from './routes/templates.js';
import usersRoutes from './routes/users.js';
import adminRoutes from './routes/admin.js';
import purchaseRoutes from './routes/purchase.js';
import adminUserRoutes from './routes/adminUsers.js';
import adminMetrics from './routes/adminMetrics.js';
import adminActivityRoutes from './routes/adminActivity.js';
import notificationRoutes from './routes/notifications.js';
import analyticsRoutes from './routes/analytics.js';
import adminSettingsRoutes from './routes/adminSettings.js';
import githubRoutes from './routes/github.js';
import adminSearchRoutes from './routes/adminSearch.js';
import adminUsersRoutes from './routes/adminUsers.js';
import paymentRoutes from './routes/purchase.js'; // ✅ Added Razorpay payment route
import contactRoutes from './routes/contact.js';
import commentRoutes from './routes/comment.js';
import competitionsRouter from "./routes/competitions.js";

// 🔒 Middleware
import verifyToken from './middleware/verifyToken.js';
import verifyTokenIfExists from './middleware/verifyTokenIfExists.js';
import maintenanceCheck from './middleware/maintenanceCheck.js';

const app = express();
mongoose.set('debug', true);

// 🌐 Middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📁 Serve static uploads
app.use('/uploads', express.static('uploads'));

// 🌍 MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
});


// ===============================
// ✅ PUBLIC ROUTES (No auth required)
// ===============================
app.use('/api/auth', authRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/contact', contactRoutes);

// ✅ Health-check / ping route (for uptime monitors)
app.get('/ping', (req, res) => res.status(200).send('OK'));

app.get('/', (req, res) => res.send('🚀 Server is running'));


// ===============================
// 🔄 Global Middleware (for maintenance)
// ===============================
app.use(maintenanceCheck);


// ===============================
// 🔒 PROTECTED ROUTES (Login required)
// ===============================
app.use('/api/users', verifyToken, usersRoutes);
app.use('/api/protected', verifyToken, protectedRoutes);
app.use('/api/purchase', verifyToken, purchaseRoutes);
app.use('/api/notifications', verifyToken, notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/comments', commentRoutes);

// 👑 ADMIN-ONLY ROUTES
app.use('/api/admin', verifyToken, adminRoutes);
app.use('/api/admin/users', verifyToken, adminUsersRoutes);
app.use('/api/admin/users', verifyToken, adminUserRoutes);
app.use('/api/admin', verifyToken, adminMetrics);
app.use('/api/admin', verifyToken, adminActivityRoutes);
app.use('/api/admin/search', verifyToken, adminSearchRoutes);
app.use('/api/admin-settings', verifyToken, adminSettingsRoutes);

// ✅ Competitions API
app.use("/api/competitions", competitionsRouter);
// ===============================
// 🧿 Start Server
// ===============================
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`⚡ Server running on port ${PORT}`);
});
