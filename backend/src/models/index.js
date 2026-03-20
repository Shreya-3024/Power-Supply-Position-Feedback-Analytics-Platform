import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema, model } = mongoose;

// ==================== FEEDBACK/COMPLAINT MODEL ====================
const feedbackSchema = new Schema({
  complaintId: {
    type: String,
    unique: true,
    index: true
  },
  // Common fields
  name: {
    type: String,
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  
  // Complaint/Review specific fields
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  issueType: {
    type: String
  },
  priority: {
    type: String,
    default: 'Medium'
  },
  description: {
    type: String,
    trim: true,
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  
  // System Feedback specific fields
  case: {
    type: String,
    trim: true
  },
  psuModel: {
    type: String,
    trim: true
  },
  placement: {
    type: String
  },
  fanDirection: {
    type: String
  },
  temperature: {
    type: Number
  },
  noiseLevel: {
    type: Number
  },
  installation: {
    type: Number
  },
  recommend: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String
  },
  problems: {
    type: [String],
    default: []
  },
  
  // Shared
  images: [{
    type: String
  }],
  photos: [{ // For System Feedback
    filename: String,
    url: String
  }],

  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  resolution: {
    type: String,
    trim: true,
    maxlength: [500, 'Resolution cannot exceed 500 characters']
  },
  resolvedAt: {
    type: Date,
    default: null
  },
  estimatedResolutionTime: {
    type: Date,
    default: null
  },
  internalNotes: [{
    note: {
      type: String,
      required: true
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  location: {
    area: String,
    district: String,
    pincode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    source: {
      type: String,
      enum: ['web', 'mobile', 'admin'],
      default: 'web'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
feedbackSchema.index({ status: 1, createdAt: -1 });
feedbackSchema.index({ phone: 1, createdAt: -1 });
feedbackSchema.index({ email: 1 });
feedbackSchema.index({ priority: 1, status: 1 });
feedbackSchema.index({ issueType: 1 });

// Virtual for time elapsed since creation
feedbackSchema.virtual('timeElapsed').get(function () {
  return Date.now() - this.createdAt;
});

// Pre-save middleware to generate complaint ID only once
feedbackSchema.pre('save', async function (next) {
  // Only generate complaintId if it doesn't already exist
  if (!this.complaintId && this.isNew) {
    try {
      // Use findOne with sort for better performance than countDocuments
      const lastRecord = await mongoose.model('Feedback')
        .findOne({}, {}, { sort: { 'createdAt': -1 } })
        .lean();
      
      let sequenceNumber = 1;
      if (lastRecord && lastRecord.complaintId) {
        const lastNumber = parseInt(lastRecord.complaintId.slice(-5));
        sequenceNumber = lastNumber + 1;
      }
      
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const sequence = String(sequenceNumber).padStart(5, '0');
      this.complaintId = `PS${year}${month}${sequence}`;
    } catch (error) {
      console.error('Error generating complaintId:', error);
      // Continue without complaintId if there's an error
    }
  }
  next();
});

// ==================== USER MODEL ====================
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: {
      values: ['admin', 'technician', 'manager', 'user'],
      message: '{VALUE} is not a valid role'
    },
    default: 'admin'
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  assignedComplaints: [{
    type: Schema.Types.ObjectId,
    ref: 'Feedback'
  }],
  permissions: {
    canCreateComplaint: { type: Boolean, default: true },
    canUpdateComplaint: { type: Boolean, default: true },
    canDeleteComplaint: { type: Boolean, default: false },
    canManageUsers: { type: Boolean, default: false },
    canViewAnalytics: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

// Index for faster email lookups
userSchema.index({ email: 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Method to generate sanitized user object (without password)
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// ==================== POWER SUPPLY AREA MODEL ====================
const powerSupplyAreaSchema = new Schema({
  areaCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  areaName: {
    type: String,
    required: true,
    trim: true
  },
  district: {
    type: String,
    required: true,
    trim: true
  },
  substationName: {
    type: String,
    required: true,
    trim: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 0
  },
  currentLoad: {
    type: Number,
    default: 0,
    min: 0
  },
  voltage: {
    type: Number,
    default: 230,
    min: 0
  },
  status: {
    type: String,
    enum: ['Online', 'Offline', 'Maintenance', 'Critical'],
    default: 'Online'
  },
  affectedHouseholds: {
    type: Number,
    default: 0,
    min: 0
  },
  lastMaintenance: {
    type: Date,
    default: null
  },
  nextScheduledMaintenance: {
    type: Date,
    default: null
  },
  activeComplaints: {
    type: Number,
    default: 0,
    min: 0
  },
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  contactPerson: {
    name: String,
    phone: String,
    email: String
  }
}, {
  timestamps: true
});

// Index for area lookups
powerSupplyAreaSchema.index({ areaCode: 1 });
powerSupplyAreaSchema.index({ district: 1 });
powerSupplyAreaSchema.index({ status: 1 });

// ==================== NOTIFICATION MODEL ====================
const notificationSchema = new Schema({
  recipient: {
    email: String,
    phone: String
  },
  type: {
    type: String,
    enum: ['email', 'sms', 'both'],
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedComplaint: {
    type: Schema.Types.ObjectId,
    ref: 'Feedback'
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed'],
    default: 'pending'
  },
  sentAt: {
    type: Date,
    default: null
  },
  errorMessage: String
}, {
  timestamps: true
});

// Index for notification queries
notificationSchema.index({ status: 1, createdAt: -1 });
notificationSchema.index({ relatedComplaint: 1 });

// ==================== EXPORTS ====================
export const Feedback = model('Feedback', feedbackSchema);
export const User = model('User', userSchema);
export const PowerSupplyArea = model('PowerSupplyArea', powerSupplyAreaSchema);
export const Notification = model('Notification', notificationSchema);

export default {
  Feedback,
  User,
  PowerSupplyArea,
  Notification
};
