// models/Activity.js
import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
  description: { type: String, required: true },
  actor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Optional for system actions (e.g., user deleted by admin)
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Activity = mongoose.model('Activity', ActivitySchema);
export default Activity;