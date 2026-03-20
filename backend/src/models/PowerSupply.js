import mongoose from 'mongoose';

const powerSupplySchema = new mongoose.Schema({
  // Basic Information
  brand: {
    type: String,
    required: [true, 'Brand name is required'],
    trim: true,
    maxlength: [100, 'Brand name cannot exceed 100 characters']
  },
  model: {
    type: String,
    required: [true, 'Model name is required'],
    trim: true,
    maxlength: [100, 'Model name cannot exceed 100 characters']
  },
  wattage: {
    type: Number,
    required: [true, 'Wattage is required'],
    min: [200, 'Wattage must be at least 200W'],
    max: [2000, 'Wattage cannot exceed 2000W']
  },
  efficiency: {
    type: String,
    required: [true, 'Efficiency rating is required'],
    enum: ['80+ Bronze', '80+ Silver', '80+ Gold', '80+ Platinum', '80+ Titanium', 'Standard']
  },
  modular: {
    type: String,
    required: [true, 'Modular type is required'],
    enum: ['Fully Modular', 'Semi-Modular', 'Non-Modular']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },

  // Ratings & Reviews
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviews: {
    type: Number,
    default: 0,
    min: [0, 'Review count cannot be negative']
  },

  // Performance Metrics
  performance: {
    type: Number,
    default: 0,
    min: [0, 'Performance cannot be less than 0'],
    max: [100, 'Performance cannot exceed 100']
  },
  noise: {
    type: Number,
    default: 0,
    min: [0, 'Noise level cannot be less than 0'],
    max: [100, 'Noise level cannot exceed 100']
  },
  value: {
    type: Number,
    default: 0,
    min: [0, 'Value cannot be less than 0'],
    max: [100, 'Value cannot exceed 100']
  },

  // Position Rating
  position: {
    type: String,
    required: [true, 'Position rating is required'],
    enum: ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'],
    default: 'Good'
  },

  // Additional Details
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  features: [{
    type: String,
    maxlength: [200, 'Feature cannot exceed 200 characters']
  }],
  
  // Stock & Availability
  inStock: {
    type: Boolean,
    default: true
  },
  stockQuantity: {
    type: Number,
    default: 0,
    min: [0, 'Stock quantity cannot be negative']
  },

  // Metadata
  imageUrl: {
    type: String,
    default: ''
  },
  manufacturer: {
    type: String,
    trim: true
  },
  warranty: {
    type: String,
    trim: true
  },
  releaseDate: {
    type: Date
  },

  // Active/Inactive
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
powerSupplySchema.index({ brand: 1, model: 1 });
powerSupplySchema.index({ wattage: 1 });
powerSupplySchema.index({ efficiency: 1 });
powerSupplySchema.index({ position: 1 });
powerSupplySchema.index({ rating: -1 });
powerSupplySchema.index({ price: 1 });

// Virtual for formatted price
powerSupplySchema.virtual('formattedPrice').get(function() {
  return `$${this.price.toFixed(2)}`;
});

// Method to calculate average rating
powerSupplySchema.methods.updateAverageRating = async function(newRating) {
  const totalRating = (this.rating * this.reviews) + newRating;
  this.reviews += 1;
  this.rating = totalRating / this.reviews;
  await this.save();
};

// Static method to find by efficiency
powerSupplySchema.statics.findByEfficiency = function(efficiency) {
  return this.find({ efficiency, isActive: true }).sort({ rating: -1 });
};

// Static method to find by wattage range
powerSupplySchema.statics.findByWattageRange = function(min, max) {
  return this.find({ 
    wattage: { $gte: min, $lte: max },
    isActive: true 
  }).sort({ rating: -1 });
};

// Pre-save middleware to update position based on rating
powerSupplySchema.pre('save', function(next) {
  if (this.rating >= 4.7) {
    this.position = 'Excellent';
  } else if (this.rating >= 4.3) {
    this.position = 'Very Good';
  } else if (this.rating >= 3.8) {
    this.position = 'Good';
  } else if (this.rating >= 3.0) {
    this.position = 'Fair';
  } else {
    this.position = 'Poor';
  }
  next();
});

const PowerSupply = mongoose.model('PowerSupply', powerSupplySchema);

export default PowerSupply;
