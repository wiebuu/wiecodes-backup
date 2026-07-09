import mongoose from 'mongoose';

// ---------------- Comment schema ----------------
const CommentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  verifiedDownload: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// ---------------- Template schema ----------------
const TemplateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  estimatedPrice: { type: Number, required: true },

  // Categorization
  category: String,
  framework: String,
  platform: String,
  theme: String,

  // Upload Info
  githubRepo: String,
  uploadType: { type: String, enum: ['github', 'affiliate'], required: true },
  previewImageUrl: String,

  // Metadata
  tags: [String],
  features: [String],
  techStack: [String],
  codePreview: String,
  liveLink: String,

  // Affiliate Info
  affiliateLink: { type: String, default: '' },

  // Quality Color Badge
  color: { 
    type: String, 
    enum: ['', '#FFD700', '#4169E1', '#50C878', '#FFA500'], 
    default: '' 
  },

  // Status
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },

  // Sales Count
  sales: { type: Number, default: 0 },

  // General ratings
  ratings: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    value: { type: Number, required: true, min: 1, max: 5 },
  }],
  averageRating: { type: Number, default: 0 },

  // Competition stars (for WIECODES_WEEKEND)
  stars: { type: Number, default: 0 },

  // Comments
  comments: [CommentSchema],

  // Featured / Free flags
  isFeatured: { type: Boolean, default: false },
  isFree: { type: Boolean, default: false },

  // Relational
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

}, { timestamps: true });

// ---------------- Helper method for ratings ----------------
TemplateSchema.methods.recalculateAverageRating = function () {
  if (!this.ratings.length) {
    this.averageRating = 0;
  } else {
    const total = this.ratings.reduce((sum, r) => sum + r.value, 0);
    this.averageRating = total / this.ratings.length; // keep exact float
  }
  return this.averageRating;
};

const Template = mongoose.model('Template', TemplateSchema);
export default Template;
