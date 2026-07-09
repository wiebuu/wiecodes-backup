import express from 'express';
import Template from '../models/Template.js';
import User from '../models/User.js';
import verifyToken from '../middleware/verifyToken.js';
import { isAdmin } from '../middleware/auth.js';

const router = express.Router();
router.use(isAdmin);

/**
 * GET /api/admin/search?q=your-query
 * Searches both templates and users
 */

router.get('/', verifyToken, isAdmin, async (req, res) => {
  const query = req.query.q?.trim();

  if (!query) {
    return res.status(400).json({ success: false, message: 'Missing search query' });
  }

  const regex = new RegExp(query, 'i'); // case-insensitive regex

  try {
    const [templates, users] = await Promise.all([
      Template.find({
        $or: [
          { title: regex },
          { description: regex },
          { category: regex },
          { tags: { $elemMatch: { $regex: regex } } },
          { techStack: { $elemMatch: { $regex: regex } } },
        ],
      }).limit(10),
      User.find({
        $or: [
          { email: regex },
          { name: regex },
          { role: regex },
        ],
      }).limit(10),
    ]);

    res.json({
      success: true,
      templates,
      users,
    });
  } catch (error) {
    console.error('Admin search error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
