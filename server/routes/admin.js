// 🛠️ admin/templates.js

import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { isAdmin } from '../middleware/auth.js';
import Template from '../models/Template.js';
import User from '../models/User.js';

const router = express.Router();

router.use(isAdmin);

// ✅ GET: All pending uploaded templates (new uploads only)
router.get('/templates', verifyToken, isAdmin, async (req, res) => {
  try {
    const pendingUploads = await Template.find({ status: 'pending' })
      .populate('uploadedBy', 'username email');

    res.json({
      success: true,
      pendingUploads,
    });
  } catch (err) {
    console.error('Failed to fetch templates:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ Get all approved templates (used in AdminPublishedTemplatesPage)
router.get('/templates/published', verifyToken, isAdmin, async (req, res) => {
  try {
    const templates = await Template.find({ status: 'approved' })
    .select('title githubRepo framework estimatedPrice rating sales downloads createdAt uploadedBy')
    .populate('uploadedBy', 'username email');

    res.json({ success: true, templates });
  } catch (err) {
    console.error('Failed to fetch published templates:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/templates/:id/:action', verifyToken, isAdmin, async (req, res) => {
  const { id, action } = req.params;

  if (!['approve', 'reject'].includes(action)) {
    return res.status(400).json({ success: false, message: 'Invalid action' });
  }

  try {
    const template = await Template.findById(id);
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }

    // If approving, update user stats
    if (action === 'approve') {
      // Only update if it wasn't already approved before
      if (template.status !== 'approved') {
        const user = await User.findById(template.uploadedBy);
        if (user) {
          // Increase freeTemplate count if it's free
          if (template.isFree || template.estimatedPrice === 0) {
            user.freeTemplates = (user.freeTemplates || 0) + 1;
          }

          // Always increase totalTemplates on first approval
          user.templates = [...(user.templates || []), template._id];
          await user.save();
        }
      }

      template.status = 'approved';
    } else {
      template.status = 'rejected';
    }

    await template.save();

    res.json({ success: true, message: `Template ${action}d successfully` });
  } catch (err) {
    console.error('Template status update error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


export default router;
