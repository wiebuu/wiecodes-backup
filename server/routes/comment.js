import express from 'express';
import Template from '../models/Template.js';
import verifyToken from '../middleware/verifyToken.js';
import User from '../models/User.js';

const router = express.Router();

/**
 * GET comments for a specific template (public)
 */
router.get('/:templateId', async (req, res) => {
  try {
    const template = await Template.findById(req.params.templateId)
      .populate('comments.user', 'username')
      .select('comments');

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Sort newest first
    const sortedComments = template.comments.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json(sortedComments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/:templateId', verifyToken, async (req, res) => {
    try {
      const { text, rating } = req.body;
  
      if (!text || typeof rating !== 'number') {
        return res.status(400).json({ message: 'Text and rating are required' });
      }
  
      const template = await Template.findById(req.params.templateId);
      if (!template) {
        return res.status(404).json({ message: 'Template not found' });
      }
  
      // Fetch user from DB by req.user.id
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if user purchased/downloaded this template
      const hasPurchased = user.purchasedTemplates?.some(
        tId => tId.toString() === req.params.templateId
      );
  
      const newComment = {
        user: user._id,
        username: user.username, // username from DB
        text,
        rating,
        verifiedDownload: !!hasPurchased, // true if purchased, else false
        createdAt: new Date(),
      };
  
      template.comments.push(newComment);
  
      // Update average rating
      const allRatings = template.comments.map(c => c.rating);
      template.averageRating =
        allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length;
  
      await template.save();
  
      const populatedTemplate = await Template.findById(template._id)
        .populate('comments.user', 'username');
  
      const addedComment = populatedTemplate.comments.slice(-1)[0];
      res.status(201).json(addedComment);
  
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  

/**
 * DELETE a comment by id (protected)
 */
router.delete('/:templateId/:commentId', verifyToken, async (req, res) => {
    try {
      const { templateId, commentId } = req.params;
  
      const template = await Template.findById(templateId);
      if (!template) {
        return res.status(404).json({ message: 'Template not found' });
      }
  
      const comment = template.comments.id(commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      console.log('Comment user:', comment.user.toString());
      console.log('Logged in user:', req.user.id, 'Role:', req.user.role);
  
      // Allow comment owner or admin
      if (comment.user.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not allowed to delete this comment' });
      }
  
      // New way to remove
      comment.deleteOne(); // instead of comment.remove()
  
      await template.save();
  
      res.json({ message: 'Comment deleted successfully' });
    } catch (err) {
      console.error('Delete comment error:', err);
      res.status(500).json({ message: err.message });
    }
  });
  
  
  

export default router;
