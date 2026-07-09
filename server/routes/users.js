import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import UserModel from '../models/User.js';
import TemplateModel from '../models/Template.js';
import Activity from '../models/Activity.js';

const router = express.Router();

/**
 * @route   GET /api/users/me
 * @desc    Get current user's profile with templates
 * @access  Private
 */

router.get('/me', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await UserModel.findById(userId)
      .select('-password')
      .populate('cart.template')
      .populate('purchasedTemplates', 'title previewImageUrl estimatedPrice framework'); // ✅ Add this line

    if (!user) return res.status(404).json({ message: 'User not found' });

    const publicTemplates = await TemplateModel.find({ uploadedBy: userId, status: 'approved' }).sort({ createdAt: -1 });
    const pendingTemplates = await TemplateModel.find({ uploadedBy: userId, status: 'pending' }).sort({ createdAt: -1 });

    const userProfile = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      bio: user.bio || '',
      location: user.location || '',
      rating: user.rating || null,
      reviewCount: user.reviewCount || 0,
      joinDate: user.createdAt,
      website: user.website || '',
      twitter: user.twitter || '',
      github: user.github || '',
    
      roles: user.roles || [], // ✅ NEW
      paymentMethod: user.paymentMethod || '', // ✅ NEW
      paymentDetail: user.paymentDetail || '', // ✅ NEW
    
      earnings: user.earnings || 0,
      sales: user.sales || 0,
      freeTemplates: user.freeTemplates || 0,
    
      publicTemplates,
      pendingTemplates,
      cart: user.cart || [],
      purchasedTemplates: user.purchasedTemplates || [],
    };
    

    res.json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




router.put('/me', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;

    const allowedUpdates = [
      'username',
      'bio',
      'location',
      'website',
      'twitter',
      'github',
      'roles',
      'paymentMethod',
      'paymentDetail',
    ];

    const updates = {};
    for (const key of allowedUpdates) {
      if (key in updateData) updates[key] = updateData[key];
    }

    // Fetch current user
    const currentUser = await UserModel.findById(userId);
    if (!currentUser) return res.status(404).json({ message: 'User not found' });

    // 🔍 Username uniqueness check (if changed)
    if (
      updates.username &&
      updates.username !== currentUser.username
    ) {
      const existingUser = await UserModel.findOne({ username: updates.username });
      if (existingUser && !existingUser._id.equals(userId)) {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }

    // ✅ Apply updates
    Object.assign(currentUser, updates);
    await currentUser.save();

    const updatedUser = await UserModel.findById(userId).select('-password');
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});




/* ---------------------------------------
 * 🛒 CART ROUTES (nested inside UserModel)
 * ------------------------------------- */

/**
 * GET /api/users/cart — Get user's cart
 */
router.get('/cart', verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).populate('cart.template');
    res.json({ success: true, cart: user.cart });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch cart' });
  }
});

/**
 * POST /api/users/cart/add — Add template to cart (or increment)
 */
router.post('/cart/add', verifyToken, async (req, res) => {
  try {
    const { templateId } = req.body;
    const user = await UserModel.findById(req.user.id);

    const existing = user.cart.find(item => item.template.toString() === templateId);
    if (existing) {
      existing.quantity += 1;
    } else {
      user.cart.push({ template: templateId, quantity: 1 });
    }

    await user.save();
    await user.populate('cart.template');
    const filteredCart = user.cart.filter(item => item.template);

    res.json({ success: true, cart: filteredCart });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to add to cart' });
  }
});

/**
 * PUT /api/users/cart — Update cart item quantity directly
 */
router.put('/cart', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { templateId, quantity } = req.body;

    if (!templateId || quantity === undefined) {
      return res.status(400).json({ success: false, message: 'templateId and quantity required' });
    }

    const user = await UserModel.findById(userId);
    const item = user.cart.find(i => i.template.toString() === templateId);

    if (!item) {
      user.cart.push({ template: templateId, quantity });
    } else {
      item.quantity = Math.max(1, quantity);
    }

    await user.save();
    await user.populate('cart.template');

    return res.json({ success: true, cart: user.cart });
  } catch (err) {
    console.error('PUT /cart error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update cart quantity' });
  }
});

/**
 * PUT /api/users/cart/increment/:templateId — Increment quantity
 */
router.put('/cart/increment/:templateId', verifyToken, async (req, res) => {
  try {
    const { templateId } = req.params;
    const user = await UserModel.findById(req.user.id);

    const item = user.cart.find(i => i.template.toString() === templateId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found in cart' });

    item.quantity += 1;
    await user.save();
    await user.populate('cart.template');

    res.json({ success: true, cart: user.cart });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to increment cart item' });
  }
});

/**
 * PUT /api/users/cart/decrement/:templateId — Decrement quantity
 */
router.put('/cart/decrement/:templateId', verifyToken, async (req, res) => {
  try {
    const { templateId } = req.params;
    const user = await UserModel.findById(req.user.id);

    const item = user.cart.find(i => i.template.toString() === templateId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found in cart' });

    item.quantity = Math.max(item.quantity - 1, 1);
    await user.save();
    await user.populate('cart.template');

    res.json({ success: true, cart: user.cart });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to decrement cart item' });
  }
});

/**
 * DELETE /api/users/cart/remove/:templateId — Remove item
 */
router.delete('/cart/remove/:templateId', verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    user.cart = user.cart.filter(i => i.template.toString() !== req.params.templateId);
    await user.save();
    await user.populate('cart.template');

    res.json({ success: true, cart: user.cart });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to remove cart item' });
  }
});

/**
 * DELETE /api/users/cart/clear — Clear cart
 */
router.delete('/cart/clear', verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    user.cart = [];
    await user.save();

    res.json({ success: true, message: 'Cart cleared', cart: [] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to clear cart' });
  }
});

export default router;
