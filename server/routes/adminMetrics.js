// routes/adminMetrics.js
import express from 'express';
import Template from '../models/Template.js';
import User from '../models/User.js';

const router = express.Router();
import { isAdmin } from '../middleware/auth.js';

router.use(isAdmin);

// GET /api/admin/metrics
router.get('/metrics', async (req, res) => {
  try {
    const [totalTemplates, pendingReviews, totalUsers, activeSellers, approvedTemplates] = await Promise.all([
      Template.countDocuments({ status: { $in: ['pending', 'approved'] } }),
      Template.countDocuments({ status: 'pending' }),
      User.countDocuments(),
      User.countDocuments({ role: 'seller', status: 'active' }),
      Template.find({ status: 'approved' }),
    ]);

    const totalSales = approvedTemplates.reduce((sum, t) => sum + (parseInt(t.estimatedPrice) || 0), 0);

    res.json({
      success: true,
      data: {
        totalTemplates,
        pendingReviews,
        totalUsers,
        activeSellers,
        totalSales,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch metrics' });
  }
});

export default router;
