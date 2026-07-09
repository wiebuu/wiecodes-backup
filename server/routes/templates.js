// 📜 templates.js

import express from 'express';
import multer from 'multer';
import Template from '../models/Template.js';
import Activity from '../models/Activity.js';
import verifyToken from '../middleware/verifyToken.js';
import { isAdmin, isAdminOrReviewer } from '../middleware/auth.js';
import Competition from "../models/Competition.js"; // ✅ fix

const router = express.Router();

// 1. Setup multer first
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage }); // ✅ Define upload here

// 2. Then use upload
const uploadMiddleware = upload.single('previewImage'); // ✅ Now safe to use


// 🟢 Upload New Template
router.post('/upload', verifyToken, uploadMiddleware, async (req, res) => {
  try {
    const {
      title, description, estimatedPrice, category,
      framework, platform, theme, githubRepo, uploadType,
      tags, features, techStack, codePreview, liveLink
    } = req.body;

    const previewImage = req.files?.previewImage?.[0]?.filename;

    const templateData = {
      title,
      description,
      estimatedPrice,
      category,
      framework,
      platform,
      theme,
      githubRepo,
      uploadType: uploadType || 'github', // ✅ default
      codePreview,
      liveLink,
      uploadedBy: req.user.id,
      status: 'pending',
      tags: JSON.parse(tags || '[]'),
      features: JSON.parse(features || '[]'),
      techStack: JSON.parse(techStack || '[]'),
      previewImageUrl: previewImage ? `uploads/${previewImage}` : null,
    };

    const newTemplate = new Template(templateData);
    await newTemplate.save();

    const now = new Date();

    // ✅ Find all LIVE competitions user has joined
    const liveCompetitions = await Competition.find({
      start_date: { $lte: now },
      end_date: { $gte: now },
      participants: req.user.id
    });

    for (let comp of liveCompetitions) {
      // prevent duplicates
      if (!comp.templates.includes(newTemplate._id)) {
        comp.templates.push(newTemplate._id);
        await comp.save();
      }
    }

    // ✉️ Log activity
    await Activity.create({
      description: `New template submitted: "${title}"`,
      actor: req.user._id
    });

    res.status(201).json({
      success: true,
      message: "Template uploaded successfully.",
      template: newTemplate
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while uploading template.",
      error: err.message
    });
  }
});





router.get('/', async (req, res) => {
  try {
    const templates = await Template.find({ status: 'approved' })
      .populate('uploadedBy', 'username email'); // ✅ populate uploader

    res.status(200).json(templates);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch templates.',
      error: err.message
    });
  }
});


// 🔍 Enhanced Search Route (Fixed)
router.get('/search', async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === '') {
    return res.status(400).json({ success: false, message: 'Query is required' });
  }

  try {
    const regex = new RegExp(query, 'i'); // case-insensitive

    const results = await Template.find({
      status: 'approved',
      $or: [
        { title: regex },
        { description: regex },
        { category: regex },
        { framework: regex },
        { platform: regex },
        { theme: regex },
        { tags: { $elemMatch: { $regex: regex } } },
        { features: { $elemMatch: { $regex: regex } } },
        { techStack: { $elemMatch: { $regex: regex } } },
      ]
    })
    .limit(20)
    .populate('uploadedBy', 'username email'); // ✅ populate uploader
    

    res.status(200).json(results);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to search templates',
      error: err.message
    });
  }
});

router.put('/templates/:id/reject', verifyToken, async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) return res.status(404).json({ message: 'Template not found' });

    template.status = 'rejected';
    await template.save();

    await Activity.create({
      description: `Template rejected: "${template.title}"`,
      user: req.user._id
    });

    res.json({ success: true, message: 'Template rejected' });
  } catch (err) {
    console.error('Rejection failed:', err);
    res.status(500).json({ success: false, message: 'Rejection failed', error: err.message });
  }
});

// 📸 Upload Preview Image for Existing Template
router.post(
  '/upload/preview/:id',
  verifyToken,
  upload.single('previewImage'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const previewImage = req.file?.filename;

      if (!previewImage) {
        return res.status(400).json({ success: false, message: 'No image uploaded' });
      }

      const template = await Template.findById(id);
      if (!template) {
        return res.status(404).json({ success: false, message: 'Template not found' });
      }

      // 🛡️ Authorization: Only the uploader or admin can update
      if (
        template.uploadedBy.toString() !== req.user.id &&
        !req.user.isAdmin
      ) {
        return res.status(403).json({ success: false, message: 'Forbidden: Not authorized' });
      }

      template.previewImageUrl = `uploads/${previewImage}`;
      await template.save();

      res.status(200).json({
        success: true,
        message: 'Preview image updated',
        template,
      });
    } catch (err) {
      console.error('Upload preview error:', err);
      res.status(500).json({
        success: false,
        message: 'Server error during preview upload',
        error: err.message,
      });
    }
  }
);




// 🟡 Get Template by ID
router.get('/:id', async (req, res) => {
  try {
    const template = await Template.findById(req.params.id)
      .populate('uploadedBy', 'username email'); // ✅ populate username & email

    if (!template) return res.status(404).json({ message: 'Template not found' });

    res.json(template);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// 🛠️ Update Template (Admin or Owner)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    // Capitalize each word in tag
    const capitalizeWords = str =>
      str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    const updatedData = {
      ...req.body,
      tags: Array.isArray(req.body.tags)
        ? req.body.tags
          .filter(tag => tag.trim())
          .map(tag => capitalizeWords(tag.trim()))
        : [],
      features: Array.isArray(req.body.features)
        ? req.body.features.filter(f => f.trim())
        : [],
      techStack: Array.isArray(req.body.techStack)
        ? req.body.techStack.filter(t => t.trim())
        : [],
    };

    const updated = await Template.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!updated) return res.status(404).json({ message: 'Template not found' });

    res.json({ success: true, template: updated });
  } catch (err) {
    console.error('PUT update error:', err);
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
});

// ✅ Minimal Route: Only Approve the Template
router.put('/:id/approve', verifyToken, isAdmin, async (req, res) => {
  try {
    const updated = await Template.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    await Activity.create({
      description: `Template approved: "${updated.title}"`,
      actor: req.user._id
    });

    if (!updated) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.json({ success: true, message: 'Template approved successfully', template: updated });
  } catch (err) {
    console.error('Approve template error:', err);
    res.status(500).json({ message: 'Failed to approve template', error: err.message });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deleted = await Template.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Template not found' });

    // 📝 Log activity (fixed field name)
    await Activity.create({
      description: `Template deleted: "${deleted.title}"`,
      actor: req.user?._id || null
    });

    res.json({ success: true, message: 'Template deleted' });
  } catch (err) {
    console.error('Delete failed:', err);
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
});


// 🔍 Get Suggested Templates Based on Category (priority), or Theme/Framework (fallback)
router.get('/:id/suggestions', async (req, res) => {
  try {
    const current = await Template.findById(req.params.id);
    if (!current) return res.status(404).json({ message: 'Template not found' });

    let suggestionsRaw = [];

    // 1️⃣ Try to find suggestions with the same category
    if (current.category) {
      suggestionsRaw = await Template.find({
        _id: { $ne: current._id },
        status: 'approved',
        category: current.category,
      })
        .select([
          'title',
          'previewImageUrl',
          'theme',
          'framework',
          'platform',
          'category',
          'ratings',
          'estimatedPrice',
          'tags',
          'features',
          'color',
          'isFree',
        ])
        .limit(3);
    }

    // 2️⃣ If less than 3 category matches, fallback to theme or framework
    if (suggestionsRaw.length < 3) {
      const fallbackCriteria = [
        current.theme ? { theme: current.theme } : null,
        current.framework ? { framework: current.framework } : null,
      ].filter(Boolean);

      const fallbackResults = await Template.find({
        _id: { $ne: current._id },
        status: 'approved',
        $or: fallbackCriteria.length ? fallbackCriteria : [{}],
      })
        .select([
          'title',
          'previewImageUrl',
          'theme',
          'framework',
          'platform',
          'category',
          'ratings',
          'estimatedPrice',
          'tags',
          'features',
          'color',
          'isFree',
        ])
        .limit(3 - suggestionsRaw.length); // fill remaining slots

      suggestionsRaw = [...suggestionsRaw, ...fallbackResults];
    }

    // 🟡 Calculate averageRating
    const suggestions = suggestionsRaw.map((template) => {
      const ratings = template.ratings || [];
      const averageRating = ratings.length
        ? ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length
        : 0;

      return {
        ...template.toObject(),
        averageRating: parseFloat(averageRating.toFixed(1)),
        ratingsCount: ratings.length,
      };
    });

    res.json(suggestions);
  } catch (err) {
    console.error('Suggestion route error:', err);
    res.status(500).json({ message: 'Failed to fetch suggestions', error: err.message });
  }
});


// 🔍 Get the 4 most recent free templates
router.get('/filter/free', async (req, res) => {
  try {
    const templates = await Template.find({ isFree: true, status: 'approved' })
      .sort({ createdAt: -1 }) // 🔽 Most recent first
      .limit(4);               // ✅ Only 4 items

    const free = templates.map((t) => {
      const ratings = t.ratings || [];
      const averageRating = ratings.length
        ? ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length
        : 0;

      return {
        ...t.toObject(),
        averageRating: parseFloat(averageRating.toFixed(1)),
      };
    });

    res.json(free);
  } catch (err) {
    console.error('Error fetching free templates:', err);
    res.status(500).json({ message: 'Failed to fetch free templates' });
  }
});

// 🔍 Get the 4 most recent featured templates
router.get('/filter/featured', async (req, res) => {
  try {
    const templates = await Template.find({ isFeatured: true, status: 'approved' })
      .sort({ createdAt: -1 }) // 🔽 Most recent first
      .limit(4);               // ✅ Only 4 items

    const featured = templates.map((t) => {
      const ratings = t.ratings || [];
      const averageRating = ratings.length
        ? ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length
        : 0;

      return {
        ...t.toObject(),
        averageRating: parseFloat(averageRating.toFixed(1)),
      };
    });

    res.json(featured);
  } catch (err) {
    console.error('Error fetching featured templates:', err);
    res.status(500).json({ message: 'Failed to fetch featured templates' });
  }
});



// PUT /api/admin/templates/:id/color
router.put('/templates/:id/color', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { color } = req.body;

  const colorMap = {
    yellow: '#FFD700',
    blue: '#4169E1',
    green: '#50C878',
    orange: '#FFA500',
  };

  if (!colorMap[color]) {
    return res.status(400).json({ success: false, message: 'Invalid color' });
  }

  try {
    await Template.findByIdAndUpdate(id, { color: colorMap[color] });
    res.json({ success: true, message: 'Color updated' });
  } catch (err) {
    console.error('Error updating color:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/:id/rate', verifyToken, isAdminOrReviewer, async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;
  const userId = req.user.id;

  if (!value || value < 1 || value > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    const template = await Template.findById(id);
    if (!template) return res.status(404).json({ message: 'Template not found' });

    if (template.status !== 'approved') {
      return res.status(403).json({ message: 'Only approved templates can be rated' });
    }

    const existingRating = template.ratings.find(r => r.user.toString() === userId.toString());

    if (existingRating) {
      if (existingRating.value === value) {
        return res.json({
          message: 'You already rated this template with the same value',
          averageRating: Math.round(template.averageRating * 10) / 10,
          ratingsCount: template.ratings.length,
        });
      }
      existingRating.value = value;
    } else {
      template.ratings.push({ user: userId, value });
    }

    const total = template.ratings.reduce((sum, r) => sum + r.value, 0);
    const average = total / template.ratings.length;
    template.averageRating = Math.round(average * 10) / 10; // ⬅ round to 1 decimal

    if (!['#FFD700', '#4169E1', '#50C878', '#FFA500'].includes(template.color)) {
      template.color = undefined;
    }

    await template.save();

    await Activity.create({
      actor: userId,
      description: `Rated template "${template.title}" with ${value} stars`,
    });

    res.json({
      message: 'Rating submitted',
      yourRating: value,
      averageRating: template.averageRating,
      ratingsCount: template.ratings.length,
    });

  } catch (err) {
    console.error('Rating error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});




export default router;
