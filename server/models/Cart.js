// models/CartItem.js
import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  template: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  }
}, { timestamps: true });

const CartItem = mongoose.model('CartItem', CartItemSchema);
export default CartItem;
