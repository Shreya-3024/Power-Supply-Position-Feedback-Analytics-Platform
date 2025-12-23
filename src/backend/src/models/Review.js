import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  // User Information
  userName: {
    type: String,
    required: [true, 'User name is required'],
    trim: true,
    maxlength: [100, 'User name cannot exceed 100 characters']
  },
  userEmail: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },

  // PSU Reference
  powerSupplyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PowerSupply',
    required: [true, 'Power supply reference is required']
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },

  // Review Content
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  title: {
    type: String,
    required: [true, 'Review title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true,
    minlength: [10, 'Comment must be at least 10 characters'],
    maxlength: [2000, 'Comment cannot exceed 2000 characters']
  },

  // Detailed Ratings
  performanceRating: {
    type: Number,
    min: [0, 'Performance rating cannot be less than 0'],
    max: [100, 'Performance rating cannot exceed 100']
  },
  noiseRating: {
    type: Number,
    min: [0, 'Noise rating cannot be less than 0'],
    max: [100, 'Noise rating cannot exceed 100']
  },
  valueRating: {
    type: Number,
    min: [0, 'Value rating cannot be less than 0'],
    max: [100, 'Value rating cannot exceed 100']
  },

  // Additional Information
  purchaseDate: {
    type: Date
  },
  usageDuration: {
    type: String,
    enum: ['Less than 1 month', '1-6 months', '6-12 months', '1-2 years', 'More than 2 years']
  },
  wouldRecommend: {
    type: Boolean,
    default: true
  },

  // Review Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },

  // Helpfulness
  helpfulCount: {
    type: Number,
    default: 0,
    min: [0, 'Helpful count cannot be negative']
  },
  notHelpfulCount: {
    type: Number,
    default: 0,
    min: [0, 'Not helpful count cannot be negative']
  },

  // Images
  images: [{
    type: String
  }],

  // Admin Response
  adminResponse: {
    type: String,
    maxlength: [1000, 'Admin response cannot exceed 1000 characters']
  },
  adminResponseDate: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
reviewSchema.index({ powerSupplyId: 1, createdAt: -1 });
reviewSchema.index({ userEmail: 1 });
reviewSchema.index({ status: 1 });
reviewSchema.index({ rating: -1 });

// Virtual for helpful ratio
reviewSchema.virtual('helpfulRatio').get(function() {
  const total = this.helpfulCount + this.notHelpfulCount;
  if (total === 0) return 0;
  return (this.helpfulCount / total * 100).toFixed(1);
});

// Method to mark as helpful
reviewSchema.methods.markHelpful = async function(isHelpful) {
  if (isHelpful) {
    this.helpfulCount += 1;
  } else {
    this.notHelpfulCount += 1;
  }
  await this.save();
};

// Static method to get approved reviews for a PSU
reviewSchema.statics.findApprovedByPSU = function(powerSupplyId) {
  return this.find({ 
    powerSupplyId, 
    status: 'approved' 
  }).sort({ createdAt: -1 });
};

// Static method to calculate average ratings for a PSU
reviewSchema.statics.calculateAverageRatings = async function(powerSupplyId) {
  const result = await this.aggregate([
    { $match: { powerSupplyId: mongoose.Types.ObjectId(powerSupplyId), status: 'approved' } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: '$rating' },
        avgPerformance: { $avg: '$performanceRating' },
        avgNoise: { $avg: '$noiseRating' },
        avgValue: { $avg: '$valueRating' },
        count: { $sum: 1 }
      }
    }
  ]);

  return result.length > 0 ? result[0] : {
    avgRating: 0,
    avgPerformance: 0,
    avgNoise: 0,
    avgValue: 0,
    count: 0
  };
};

const Review = mongoose.model('Review', reviewSchema);

export default Review;
