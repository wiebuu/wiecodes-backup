import express from 'express';
import Razorpay from 'razorpay';
import verifyToken from '../middleware/verifyToken.js';
import User from '../models/User.js';
import Template from '../models/Template.js';
import crypto from 'crypto';

const router = express.Router();

// Initialize Razorpay instance
const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET) {
    console.error('❌ Razorpay config missing. Set RAZORPAY_KEY_ID and RAZORPAY_SECRET.');
    return null;
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET
  });
};

// Create Razorpay order
router.post('/create-order', verifyToken, async (req, res) => {
  try {
    const { cartItems } = req.body;

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of cartItems) {
      const template = await Template.findById(item.id);
      if (!template) {
        return res.status(404).json({ success: false, message: `Template ${item.id} not found` });
      }

      if (template.isFree) continue;

      const price = template.estimatedPrice || 0;
      totalAmount += price;

      orderItems.push({
        templateId: template._id,
        title: template.title,
        price,
        quantity: item.quantity || 1
      });
    }

    if (totalAmount === 0) {
      return res.status(400).json({ success: false, message: 'No paid templates in cart' });
    }

    const razorpay = getRazorpayInstance();
    if (!razorpay) {
      return res.status(500).json({ success: false, message: 'Payment gateway not configured' });
    }

    const shortReceipt = `ord_${Date.now().toString().slice(-6)}_${req.user.id.toString().slice(-4)}`;

    const order = await razorpay.orders.create({
      amount: totalAmount * 100, // INR → paise
      currency: 'INR',
      receipt: shortReceipt, // must be ≤ 40 chars
      notes: {
        userId: req.user.id.toString(),
        orderType: 'template_purchase'
      }
    });

    res.status(200).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt
      },
      orderItems,
      totalAmount
    });
  } catch (error) {
    console.error('❌ Order creation error:', error);
    res.status(500).json({ success: false, message: 'Unable to create Razorpay order' });
  }
});

// Verify Razorpay payment
router.post('/verify-payment', verifyToken, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cartItems } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment fields' });
    }

    // Handle free orders
    if (razorpay_order_id.startsWith('free_')) {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      const templateIds = cartItems.map(item => item.id);
      const templates = await Template.find({ _id: { $in: templateIds } });

      for (const template of templates) {
        if (!user.purchasedTemplates.includes(template._id)) {
          user.purchasedTemplates.push(template._id);
        }
      }

      user.cart = [];
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Free templates added successfully',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id
      });
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid Razorpay signature' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const templateIds = cartItems.map(item => item.id);
    const templates = await Template.find({ _id: { $in: templateIds } });

    if (templates.length !== templateIds.length) {
      const found = templates.map(t => t._id.toString());
      const missing = templateIds.filter(id => !found.includes(id));
      console.error('⚠️ Missing templates:', missing);
    }

    for (const template of templates) {
      if (!user.purchasedTemplates.includes(template._id)) {
        user.purchasedTemplates.push(template._id);
      }

      if (!template.isFree) {
        template.sales = (template.sales || 0) + 1;
        await template.save();
      }
    }

    user.cart = [];
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified and templates purchased',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id
    });
  } catch (error) {
    console.error('❌ Payment verification error:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
});

// Frontend Razorpay Key
router.get('/key', verifyToken, (req, res) => {
  const key = process.env.RAZORPAY_KEY_ID;
  if (!key) {
    return res.status(500).json({ success: false, message: 'Razorpay key not configured' });
  }

  res.status(200).json({ success: true, key });
});

// Razorpay Webhook (optional)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    if (!signature) return res.status(400).json({ success: false, message: 'No webhook signature' });

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(req.body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
    }

    const event = JSON.parse(req.body);

    if (event.event === 'payment.captured') {
      console.log('✅ Webhook: Payment captured →', event.payload.payment.entity.id);
      // Optional: log or process
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({ success: false, message: 'Webhook failed' });
  }
});

export default router;
