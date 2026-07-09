import express from 'express';
import Template from '../models/Template.js';
import User from '../models/User.js';
import Activity from '../models/Activity.js';
import { isAdmin } from '../middleware/auth.js';

const router = express.Router();
router.use(isAdmin);

router.get('/activity', async (req, res) => {
  try {
    const activities = [];

    const [recentTemplates, recentUsers, manualActivities] = await Promise.all([
      Template.find({}).sort({ createdAt: -1 }).limit(20),
      User.find({}).sort({ createdAt: -1 }).limit(10),
      Activity.find({}).sort({ createdAt: -1 }).limit(30).populate('actor', 'email')
    ]);

    // 👤 User Activities
    recentUsers.forEach(u => {
      const desc = u.status === 'banned'
        ? `User banned: ${u.email}`
        : `New ${u.role} registered: ${u.email}`;

      activities.push({
        description: desc,
        createdAt: u.createdAt
      });
    });

    // 📝 Manual Activities from Activity model
    const manuallyLogged = new Set(
      manualActivities.map(a => a.description)
    );

    manualActivities.forEach(a => {
      activities.push({
        description: a.description,
        createdAt: a.createdAt,
        actor: a.actor?.email || 'System'
      });
    });

    // 📦 Template Activities
    recentTemplates.forEach(t => {
      let action = '';
      if (t.status === 'pending') action = 'submitted';
      else if (t.status === 'rejected') action = 'rejected';
      else if (t.status === 'approved') action = 'approved';

      const logDescription = `Template ${action}: "${t.title}"`;

      // 🛑 Skip if already logged in Activity model
      if (manuallyLogged.has(logDescription)) return;

      activities.push({
        description: logDescription,
        createdAt: t.createdAt
      });
    });

    // ⏳ Final sorted output
    activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      activities: activities.map(a => ({
        description: a.actor ? `[${a.actor}] ${a.description}` : a.description,
        createdAt: a.createdAt
      }))
    });
  } catch (error) {
    console.error('Activity fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch activity' });
  }
});

export default router;
