import express from 'express';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

import verifyToken from '../middleware/verifyToken.js';
import User from '../models/User.js';
import Template from '../models/Template.js';
import Purchase from '../models/Purchase.js';
import sendEmail from '../utils/sendEmail.js';

dotenv.config();
const router = express.Router();

// 🔐 Initialize Razorpay only if credentials are available
let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  console.log('✅ Razorpay initialized successfully');
} else {
  console.log('⚠️ Razorpay credentials not found - payment routes will be disabled');
}

/* ======================================================
1️⃣ Create Razorpay Order
====================================================== */
router.post('/create-order', async (req, res) => {
  const { amount } = req.body;
  if (!amount) {
    return res.status(400).json({ success: false, message: 'Amount is required' });
  }

  if (!razorpay) {
    return res.status(503).json({ 
      success: false, 
      message: 'Payment service temporarily unavailable - Razorpay credentials not configured' 
    });
  }

  try {
    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    return res.status(200).json(order);
  } catch (error) {
    console.error('❌ Razorpay Order Error:', error);
    return res.status(500).json({ success: false, message: 'Unable to create order' });
  }
});

/* ======================================================
2️⃣ Handle Payment Success → Fulfill Purchase
====================================================== */
router.post('/purchase-success', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.template');

    if (!user || !user.cart.length) {
      return res.status(400).json({ message: 'Cart is empty or user not found' });
    }

    console.log(`🛍️ Processing ${user.cart.length} templates for ${user.email}`);

    for (const item of user.cart) {
      const template = item.template;

      if (!template) {
        console.warn(`⚠️ Skipping cart item with missing template reference.`);
        continue;
      }

      // ✅ Always add Purchase record
      await Purchase.findOneAndUpdate(
        { buyer: user._id, template: template._id },
        { buyer: user._id, template: template._id },
        { upsert: true, new: true }
      );

      // 📈 Increment template sales
      template.sales += 1;
      await template.save();

      // 💰 Update seller sales + earnings
      const seller = await User.findById(template.uploadedBy);
      if (seller) {
        seller.sales += 1;
        if (!template.isFree && template.estimatedPrice) {
          seller.earnings += template.estimatedPrice;
        }
        await seller.save();
      }

      // 🛒 Add to user's purchasedTemplates if not already added
      if (!user.purchasedTemplates.includes(template._id)) {
        user.purchasedTemplates.push(template._id);
      }

      // 📧 Email confirmation
      if (user.email) {
        await sendEmail({
          to: user.email,
          subject: `✅ Download Confirmed: ${template.title}`,
          html: `
            <h2>🎉 Thank you for purchasing <span style="color:#4f46e5;">${template.title}</span></h2>
            <p>You can download it anytime from your <a href="${process.env.FRONTEND_URL}/download">Downloads</a>.</p>
            <p>Happy coding!<br />— <strong>Wiecodes</strong> Team</p>
          `,
        });
      }
    }

    // 🧹 Clear cart
    user.cart = [];

    // ✅ Save user after updating purchasedTemplates
    user.purchasedTemplates = [...new Set(user.purchasedTemplates.map(String))];
    await user.save();

    console.log('✅ Purchase completed and cart cleared.');
    return res.status(200).json({ message: 'Purchase completed successfully' });
  } catch (err) {
    console.error('❌ Error in /purchase-success:', err);
    return res.status(500).json({ message: 'Purchase failed', error: err.message });
  }
});

/* ======================================================
3️⃣ Secure Download of Purchased/Free Templates
====================================================== */
router.post('/templates/:templateId/purchase', verifyToken, async (req, res) => {
  try {
    const { templateId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    const template = await Template.findById(templateId);
    if (!template) return res.status(404).json({ message: 'Template not found' });

    const hasAccess =
      user.purchasedTemplates.includes(templateId) ||
      template.isFree ||
      template.estimatedPrice === 0;

    if (!hasAccess) {
      return res.status(403).json({ message: 'You have not purchased this template' });
    }

    // ✅ Add template to user's purchasedTemplates if not already added
    if (!user.purchasedTemplates.includes(templateId)) {
      user.purchasedTemplates.push(templateId);
      await user.save();
    }

    // 🔐 Handle GitHub private repo download
    if (template.githubRepo) {
      const repo = template.githubRepo;

      // 1️⃣ Fetch repo details to get default branch
      const repoDetails = await fetch(`https://api.github.com/repos/${repo}`, {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'Wiecodes-Backend',
        },
      });

      if (!repoDetails.ok) {
        console.error('❌ GitHub repo fetch error:', repoDetails.status, repoDetails.statusText);
        return res.status(404).json({ message: 'Failed to fetch repo details' });
      }

      const repoData = await repoDetails.json();
      const branch = repoData.default_branch || 'main'; // fallback to main if not found

      // 2️⃣ Download repo zip using default branch
      const zipUrl = `https://api.github.com/repos/${repo}/zipball/${branch}`;
      const response = await fetch(zipUrl, {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'Wiecodes-Backend',
        },
      });

      if (!response.ok) {
        console.error('❌ GitHub fetch error:', response.status, response.statusText);
        return res.status(404).json({ message: 'Failed to download ZIP from GitHub' });
      }

      // 📈 Increment template sales
      template.sales += 1;
      await template.save();

      // 📈 Increment seller sales as well (downloads count as sales)
      const seller = await User.findById(template.uploadedBy);
      if (seller) {
        seller.sales += 1;
        await seller.save();
      }

      const sanitizedTitle = template.title
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '_')
        .trim();

      res.setHeader('Content-Type', 'application/zip');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${sanitizedTitle || 'template'}.zip"`
      );

      return response.body.pipe(res);
    }

    return res.status(404).json({ message: 'GitHub repository not linked for this template' });
  } catch (err) {
    console.error('❌ Download Error:', err);
    return res.status(500).json({ message: 'Failed to download template' });
  }
});


export default router;
