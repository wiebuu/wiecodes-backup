import Template from '../models/Template.js';
import User from '../models/User.js';

export const getPendingTemplates = async (req, res) => {
  try {
    const templates = await Template.find({ status: 'pending' }).populate('uploadedBy', 'username email rating reviewCount');
    res.json({ success: true, templates });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const approveTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }

    if (template.status === 'approved') {
      return res.status(400).json({ success: false, message: 'Template already approved' });
    }

    template.status = 'approved';
    await template.save();

    // Update user's template stats
    const user = await User.findById(template.uploadedBy);
    if (user) {
      user.templates.push(template._id);
      if (template.estimatedPrice === 0) {
        user.freeTemplates += 1;
      }
      await user.save();
    }

    res.json({ success: true, message: 'Template approved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Approval failed' });
  }
};

export const rejectTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }

    template.status = 'rejected';
    await template.save();

    res.json({ success: true, message: 'Template rejected' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Rejection failed' });
  }
};
