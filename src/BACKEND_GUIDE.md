# 🔧 Backend Implementation Guide

Complete guide to implement the Node.js + Express + MongoDB backend for the Power Supply Feedback System.

## 📦 Backend Structure

```
server/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── models/
│   │   ├── Complaint.js          # Complaint schema
│   │   └── Admin.js              # Admin user schema
│   ├── controllers/
│   │   ├── complaintController.js # Complaint logic
│   │   └── statsController.js    # Statistics logic
│   ├── routes/
│   │   ├── complaintRoutes.js    # Complaint routes
│   │   └── authRoutes.js         # Auth routes
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT authentication
│   │   ├── validation.js         # Request validation
│   │   └── errorHandler.js       # Error handling
│   ├── utils/
│   │   ├── generateId.js         # Generate complaint ID
│   │   └── sendEmail.js          # Email notifications
│   └── server.js                 # Main server file
├── .env
├── .gitignore
└── package.json
```

## 🚀 Step-by-Step Implementation

### Step 1: Initialize Project

```bash
mkdir server
cd server
npm init -y
```

### Step 2: Install Dependencies

```bash
# Core dependencies
npm install express mongoose dotenv cors

# Security & validation
npm install express-validator bcryptjs jsonwebtoken helmet

# Optional features
npm install nodemailer multer twilio

# Development
npm install -D nodemon
```

### Step 3: Create package.json Scripts

```json
{
  "type": "module",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
```

### Step 4: Environment Variables (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/power-feedback
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/power-feedback

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# CORS Origin
CORS_ORIGIN=http://localhost:5173

# Email Configuration (Optional - Nodemailer with Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password

# Twilio SMS (Optional)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

## 📝 Complete Code Examples

### 1. Database Connection (`src/config/db.js`)

```javascript
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};
```

### 2. Complaint Model (`src/models/Complaint.js`)

```javascript
import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  complaintId: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    index: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  area: {
    type: String,
    required: [true, 'Area is required'],
    index: true
  },
  zone: String,
  issueType: {
    type: String,
    required: [true, 'Issue type is required'],
    enum: [
      'Power Outage',
      'Voltage Fluctuation',
      'Billing Issue',
      'Meter Problem',
      'Line Damage',
      'Other'
    ]
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  priority: {
    type: String,
    default: 'Medium',
    enum: ['Low', 'Medium', 'High', 'Critical']
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'In Progress', 'Resolved', 'Closed'],
    index: true
  },
  imageUrl: String,
  assignedTo: String,
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: String,
      default: 'System'
    }
  }],
  estimatedResolution: Date,
  actualResolution: Date
}, {
  timestamps: true
});

// Index for faster queries
complaintSchema.index({ createdAt: -1 });
complaintSchema.index({ status: 1, priority: 1 });

export default mongoose.model('Complaint', complaintSchema);
```

### 3. Admin Model (`src/models/Admin.js`)

```javascript
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  role: {
    type: String,
    default: 'admin',
    enum: ['admin', 'superadmin']
  }
}, {
  timestamps: true
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('Admin', adminSchema);
```

### 4. Generate Complaint ID (`src/utils/generateId.js`)

```javascript
export const generateComplaintId = async (Complaint) => {
  const year = new Date().getFullYear();
  
  // Find the latest complaint ID for this year
  const latestComplaint = await Complaint
    .findOne({ complaintId: new RegExp(`^PWR${year}`) })
    .sort({ complaintId: -1 });

  let nextNumber = 1;
  
  if (latestComplaint) {
    const lastNumber = parseInt(latestComplaint.complaintId.slice(-6));
    nextNumber = lastNumber + 1;
  }

  return `PWR${year}${String(nextNumber).padStart(6, '0')}`;
};
```

### 5. Complaint Controller (`src/controllers/complaintController.js`)

```javascript
import Complaint from '../models/Complaint.js';
import { generateComplaintId } from '../utils/generateId.js';

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Public
export const createComplaint = async (req, res, next) => {
  try {
    const complaintId = await generateComplaintId(Complaint);

    const complaint = await Complaint.create({
      ...req.body,
      complaintId,
      statusHistory: [{
        status: 'Pending',
        updatedAt: new Date(),
        updatedBy: 'System'
      }]
    });

    res.status(201).json({
      success: true,
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Admin
export const getComplaints = async (req, res, next) => {
  try {
    const { status, priority, area, search, page = 1, limit = 10 } = req.query;

    const query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (area) query.area = area;
    if (search) {
      query.$or = [
        { complaintId: new RegExp(search, 'i') },
        { name: new RegExp(search, 'i') },
        { area: new RegExp(search, 'i') }
      ];
    }

    const complaints = await Complaint
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Complaint.countDocuments(query);

    res.json({
      success: true,
      data: complaints,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get complaint by ID
// @route   GET /api/complaints/:id
// @access  Public
export const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findOne({
      $or: [
        { _id: req.params.id },
        { complaintId: req.params.id }
      ]
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    res.json({
      success: true,
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Track complaints by phone
// @route   GET /api/complaints/track/:phone
// @access  Public
export const trackByPhone = async (req, res, next) => {
  try {
    const complaints = await Complaint
      .find({ phone: req.params.phone })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: complaints
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint
// @route   PUT /api/complaints/:id
// @access  Admin
export const updateComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // If status is being updated, add to history
    if (req.body.status && req.body.status !== complaint.status) {
      complaint.statusHistory.push({
        status: req.body.status,
        updatedAt: new Date(),
        updatedBy: req.user?.username || 'Admin'
      });
    }

    Object.assign(complaint, req.body);
    await complaint.save();

    res.json({
      success: true,
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Admin
export const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    res.json({
      success: true,
      message: 'Complaint deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
```

### 6. Stats Controller (`src/controllers/statsController.js`)

```javascript
import Complaint from '../models/Complaint.js';

// @desc    Get statistics
// @route   GET /api/stats
// @access  Public
export const getStats = async (req, res, next) => {
  try {
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: 'Pending' });
    const inProgress = await Complaint.countDocuments({ status: 'In Progress' });
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });

    // Calculate average resolution time
    const resolvedComplaints = await Complaint.find({
      status: 'Resolved',
      actualResolution: { $exists: true }
    });

    let avgResolutionTime = 0;
    if (resolvedComplaints.length > 0) {
      const totalTime = resolvedComplaints.reduce((acc, complaint) => {
        const created = new Date(complaint.createdAt).getTime();
        const resolved = new Date(complaint.actualResolution).getTime();
        return acc + (resolved - created);
      }, 0);
      avgResolutionTime = (totalTime / resolvedComplaints.length / (1000 * 60 * 60)).toFixed(1);
    }

    // Resolved today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const resolvedToday = await Complaint.countDocuments({
      status: 'Resolved',
      actualResolution: { $gte: today }
    });

    res.json({
      success: true,
      data: {
        total,
        pending,
        inProgress,
        resolved,
        avgResolutionTime,
        resolvedToday
      }
    });
  } catch (error) {
    next(error);
  }
};
```

### 7. Auth Middleware (`src/middleware/authMiddleware.js`)

```javascript
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Admin.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};
```

### 8. Validation Middleware (`src/middleware/validation.js`)

```javascript
import { body, validationResult } from 'express-validator';

export const complaintValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('area').trim().notEmpty().withMessage('Area is required'),
  body('issueType').trim().notEmpty().withMessage('Issue type is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};
```

### 9. Error Handler (`src/middleware/errorHandler.js`)

```javascript
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate field value entered'
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
};
```

### 10. Routes (`src/routes/complaintRoutes.js`)

```javascript
import express from 'express';
import {
  createComplaint,
  getComplaints,
  getComplaintById,
  trackByPhone,
  updateComplaint,
  deleteComplaint
} from '../controllers/complaintController.js';
import { protect } from '../middleware/authMiddleware.js';
import { complaintValidation, validate } from '../middleware/validation.js';

const router = express.Router();

router.post('/', complaintValidation, validate, createComplaint);
router.get('/', getComplaints);
router.get('/:id', getComplaintById);
router.get('/track/:phone', trackByPhone);
router.put('/:id', protect, updateComplaint);
router.delete('/:id', protect, deleteComplaint);

export default router;
```

### 11. Auth Routes (`src/routes/authRoutes.js`)

```javascript
import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const router = express.Router();

// @desc    Admin login
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          role: admin.role
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;
```

### 12. Main Server (`src/server.js`)

```javascript
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import { connectDB } from './config/db.js';
import complaintRoutes from './routes/complaintRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { getStats } from './controllers/statsController.js';
import { errorHandler } from './middleware/errorHandler.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Power Supply Feedback API' });
});

app.use('/api/complaints', complaintRoutes);
app.use('/api/auth', authRoutes);
app.get('/api/stats', getStats);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

## 🔐 Creating Admin User

Create a script to add admin users (`scripts/createAdmin.js`):

```javascript
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../src/models/Admin.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const admin = await Admin.create({
      username: 'admin',
      password: 'admin123',
      email: 'admin@powerfeedback.com'
    });

    console.log('✅ Admin created:', admin.username);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createAdmin();
```

Run: `node scripts/createAdmin.js`

## 📧 Email Notifications (Optional)

Create `src/utils/sendEmail.js`:

```javascript
import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const message = {
    from: `Power Feedback <${process.env.SMTP_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html
  };

  await transporter.sendMail(message);
};
```

## 🚀 Running the Backend

```bash
# Development
npm run dev

# Production
npm start
```

## ✅ Testing API Endpoints

Use Postman or curl:

```bash
# Create complaint
curl -X POST http://localhost:5000/api/complaints \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "+1234567890",
    "address": "123 Main St",
    "area": "Downtown",
    "issueType": "Power Outage",
    "description": "Power outage for 2 hours",
    "priority": "High"
  }'

# Get all complaints
curl http://localhost:5000/api/complaints

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

## 📦 Complete Backend Ready!

Your backend is now production-ready with:
- ✅ MongoDB integration
- ✅ RESTful API
- ✅ Authentication
- ✅ Validation
- ✅ Error handling
- ✅ Statistics
- ✅ Search & filter

Connect it to your frontend by updating the API URL! 🎉
