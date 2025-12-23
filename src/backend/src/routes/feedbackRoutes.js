import express from 'express';
import { Feedback } from '../models/index.js';
import { authenticate, authorize } from '../middleware.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configure multer for file uploads
const uploadDir = './uploads/feedback';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// ==================== PUBLIC ROUTES ====================

// POST - Create feedback (public)
router.post('/', upload.array('photos', 3), async (req, res) => {
  try {
    const {
      case: caseModel,
      psuModel,
      placement,
      fanDirection,
      temperature,
      noiseLevel,
      installation,
      recommend,
      notes,
      problems: problemsStr
    } = req.body;

    // Validation
    if (!caseModel || !psuModel || !placement || !temperature || !noiseLevel || !installation) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields'
      });
    }

    // Parse problems if it's a JSON string
    let problems = [];
    if (problemsStr) {
      try {
        problems = typeof problemsStr === 'string' ? JSON.parse(problemsStr) : problemsStr;
      } catch (e) {
        problems = [];
      }
    }

    // Process photos
    const photos = req.files ? req.files.map(f => ({
      filename: f.filename,
      url: `/uploads/feedback/${f.filename}`
    })) : [];

    const feedback = new Feedback({
      case: caseModel,
      psuModel,
      placement,
      fanDirection: fanDirection || null,
      temperature: parseInt(temperature),
      noiseLevel: parseInt(noiseLevel),
      installation: parseInt(installation),
      recommend: recommend === 'true' || recommend === true,
      notes: notes || '',
      problems,
      photos,
      status: 'pending'
    });

    await feedback.save();

    res.status(201).json({
      status: 'success',
      message: 'Feedback submitted successfully',
      data: feedback
    });
  } catch (error) {
    console.error('Feedback creation error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to submit feedback'
    });
  }
});

// ==================== PROTECTED ROUTES (ADMIN) ====================

// GET - Fetch all feedback with filtering
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, limit = 20, page = 1, search } = req.query;

    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { psuModel: { $regex: search, $options: 'i' } },
        { case: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const feedback = await Feedback.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Feedback.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: feedback.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: feedback
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET - Single feedback by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        status: 'error',
        message: 'Feedback not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: feedback
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// PATCH - Update feedback status and admin notes
router.patch('/:id', authenticate, async (req, res) => {
  try {
    const { status, adminNotes, rejectionReason } = req.body;
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        status: 'error',
        message: 'Feedback not found'
      });
    }

    if (status) {
      feedback.status = status;
      if (status === 'approved') {
        feedback.approvedAt = new Date();
        feedback.verifiedBy = req.user._id;
      }
      if (status === 'rejected' && rejectionReason) {
        feedback.rejectionReason = rejectionReason;
      }
    }

    if (adminNotes !== undefined) {
      feedback.adminNotes = adminNotes;
    }

    await feedback.save();

    res.status(200).json({
      status: 'success',
      message: 'Feedback updated successfully',
      data: feedback
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// PATCH - Bulk update
router.patch('/bulk/update', authenticate, async (req, res) => {
  try {
    const { ids, status } = req.body;

    if (!Array.isArray(ids) || !status) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields'
      });
    }

    const updateData = {
      status,
      updatedAt: new Date()
    };

    if (status === 'approved') {
      updateData.approvedAt = new Date();
      updateData.verifiedBy = req.user._id;
    }

    const result = await Feedback.updateMany(
      { _id: { $in: ids } },
      updateData
    );

    res.status(200).json({
      status: 'success',
      message: `${result.modifiedCount} feedback(s) updated`,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// DELETE - Delete feedback
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        status: 'error',
        message: 'Feedback not found'
      });
    }

    // Delete associated files
    if (feedback.photos && feedback.photos.length > 0) {
      feedback.photos.forEach(photo => {
        const filePath = path.join(uploadDir, photo.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET - Dashboard stats
router.get('/stats/overview', authenticate, async (req, res) => {
  try {
    const total = await Feedback.countDocuments();
    const pending = await Feedback.countDocuments({ status: 'pending' });
    const approved = await Feedback.countDocuments({ status: 'approved' });
    const rejected = await Feedback.countDocuments({ status: 'rejected' });

    const approvalRate = total > 0 ? ((approved / total) * 100).toFixed(2) : 0;

    const topPSU = await Feedback.aggregate([
      { $group: { _id: '$psuModel', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        total,
        pending,
        approved,
        rejected,
        approvalRate: parseFloat(approvalRate),
        topPSU
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;
