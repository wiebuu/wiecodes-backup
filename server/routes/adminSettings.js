import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { isAdmin } from '../middleware/auth.js';
import Settings from '../models/Settings.js';

const router = express.Router();

/**
 * GET /api/settings — Get system settings (admin only)
 */
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    let settings = await Settings.findById('singleton');
    if (!settings) {
      // Create default settings if missing
      settings = await Settings.create({ _id: 'singleton' });
    }
    res.status(200).json(settings);
  } catch (err) {
    console.error('GET settings error:', err.message);
    res.status(500).json({ message: 'Failed to retrieve settings' });
  }
});

/**
 * PUT /api/settings/:key — Update a setting (admin only)
 */
router.put('/:key', verifyToken, isAdmin, async (req, res) => {
  const { key } = req.params;
  let { value } = req.body;

  try {
    const settings = await Settings.findById('singleton');
    if (!settings || !(key in settings.toObject())) {
      return res.status(400).json({ message: 'Invalid setting key' });
    }

    // Convert "true"/"false" to actual booleans if needed
    if (typeof settings[key] === 'boolean') {
      value = value === 'true' || value === true;
    }

    settings[key] = value;
    await settings.save();

    res.status(200).json({ message: 'Setting updated successfully', [key]: value });
  } catch (err) {
    console.error('PUT settings error:', err.message);
    res.status(500).json({ message: 'Failed to update setting' });
  }
});

export default router;
