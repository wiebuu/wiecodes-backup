import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import Activity from '../models/Activity.js';

const router = express.Router();

/**
 * GET /api/notifications
 * Get only notifications for the current user
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const activities = await Activity.find({ actor: (req.user.id) })
      .sort({ createdAt: -1 })
      .limit(50); // optional: limit to latest 50

    res.json({ success: true, notifications: activities });
  } catch (err) {
    console.error('Error fetching user notifications:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
});

export default router;
