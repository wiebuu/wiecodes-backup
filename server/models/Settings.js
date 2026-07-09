import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: 'singleton', // Only one settings doc will exist
  },
  maintenanceMode: {
    type: Boolean,
    default: false,
  },
}, {
  _id: false, // Prevent Mongoose from auto-adding another _id
  timestamps: true,
});

export default mongoose.model('Settings', settingsSchema);
