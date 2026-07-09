import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String }, // Optional for Firebase users
  firebaseUid: { type: String },

  role: {
    type: String,
    enum: ['buyer', 'seller', 'admin', 'reviewer'],
    default: 'buyer',
  },
  status: {
    type: String,
    enum: ['active', 'banned'],
    default: 'active',
  },

  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  website: { type: String, default: '' },
  twitter: { type: String, default: '' },
  github: { type: String, default: '' },

  roles: {
    type: [String],
    default: [],
  },

  paymentMethod: {
    type: String,
    enum: ['UPI', 'PayPal', 'Stripe', 'Other', ''],
    default: '',
  },

  paymentDetail: {
    type: String,
    default: '',
  },

  rating: { type: Number, default: 4.8 },
  reviewCount: { type: Number, default: 0 },

  cart: [
    {
      template: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Template',
        required: true,
      },
      quantity: { type: Number, default: 1 },
    },
  ],

  templates: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template'
  }],

  purchasedTemplates: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template'
  }],

  earnings: { type: Number, default: 0 },
  sales: { type: Number, default: 0 },
  freeTemplates: { type: Number, default: 0 },

  // ✅ Store competitions the user has joined
  joinedCompetitions: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Competition' }
  ]

}, { timestamps: true });

export default mongoose.model('User', UserSchema);
