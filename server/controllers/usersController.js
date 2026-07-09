import User from '../models/User.js';
import Template from '../models/Template.js';

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id; // from verifyToken middleware

    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Fetch templates uploaded by this user
    const publicTemplates = await Template.find({ uploadedBy: userId, status: 'approved' });
    const pendingTemplates = await Template.find({ uploadedBy: userId, status: 'pending' });

    // User profile with template data
    const userProfile = {
      name: user.username,
      email: user.email,
      bio: user.bio,
      joinDate: user.createdAt,
      rating: user.rating,
      reviewCount: user.reviewCount,
      location: user.location,
      role: user.role,
      publicTemplates,
      pendingTemplates
    };

    res.json(userProfile);
  } catch (error) {
    console.error('getCurrentUser error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
