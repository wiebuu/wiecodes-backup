// models/Comment.js
import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Template',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    verifiedDownload: {
      type: Boolean,
      default: false // will be set to true if backend verifies download
    }
  },
  { timestamps: true }
);

export default mongoose.model('Comment', CommentSchema);
