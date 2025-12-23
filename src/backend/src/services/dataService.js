import { Feedback, PowerSupplyArea } from '../models/index.js';
import { groupBy, calculatePercentage } from '../utils.js';

// ==================== FEEDBACK DATA SERVICES ====================

/**
 * Create a new feedback/complaint
 */
export const createFeedback = async (feedbackData, metadata = {}) => {
  try {
    const feedback = new Feedback({
      ...feedbackData,
      metadata: {
        ...metadata,
        source: metadata.source || 'web'
      }
    });

    await feedback.save();
    
    // Update affected area statistics if location data provided
    if (feedbackData.location?.area) {
      await updateAreaComplaintCount(feedbackData.location.area, 1);
    }

    return feedback;
  } catch (error) {
    throw new Error(`Failed to create feedback: ${error.message}`);
  }
};

/**
 * Get feedback by complaint ID
 */
export const getFeedbackByComplaintId = async (complaintId) => {
  try {
    const feedback = await Feedback.findOne({ complaintId })
      .populate('assignedTo', 'name email phone')
      .populate('internalNotes.addedBy', 'name');
    
    if (!feedback) {
      throw new Error('Complaint not found');
    }

    return feedback;
  } catch (error) {
    throw error;
  }
};

/**
 * Get feedback by phone number
 */
export const getFeedbackByPhone = async (phone) => {
  try {
    const feedbacks = await Feedback.find({ phone })
      .sort({ createdAt: -1 })
      .populate('assignedTo', 'name email')
      .limit(20);

    return feedbacks;
  } catch (error) {
    throw new Error(`Failed to fetch feedback: ${error.message}`);
  }
};

/**
 * Get all feedbacks with filters and pagination
 */
export const getAllFeedbacks = async (filters = {}, page = 1, limit = 20, sortBy = '-createdAt') => {
  try {
    const query = {};

    // Apply filters
    if (filters.status) query.status = filters.status;
    if (filters.priority) query.priority = filters.priority;
    if (filters.issueType) query.issueType = filters.issueType;
    if (filters.assignedTo) query.assignedTo = filters.assignedTo;
    if (filters.search) {
      query.$or = [
        { complaintId: { $regex: filters.search, $options: 'i' } },
        { name: { $regex: filters.search, $options: 'i' } },
        { phone: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } }
      ];
    }

    // Date range filter
    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
      if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
    }

    const skip = (page - 1) * limit;

    const [feedbacks, total] = await Promise.all([
      Feedback.find(query)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .populate('assignedTo', 'name email phone')
        .lean(),
      Feedback.countDocuments(query)
    ]);

    return {
      feedbacks,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    throw new Error(`Failed to fetch feedbacks: ${error.message}`);
  }
};

/**
 * Update feedback status
 */
export const updateFeedbackStatus = async (complaintId, updateData, userId = null) => {
  try {
    const feedback = await Feedback.findOne({ complaintId });
    
    if (!feedback) {
      throw new Error('Complaint not found');
    }

    // Update fields
    if (updateData.status) {
      feedback.status = updateData.status;
      
      // If resolved, set resolved timestamp
      if (updateData.status === 'Resolved') {
        feedback.resolvedAt = new Date();
      }
    }

    if (updateData.priority) feedback.priority = updateData.priority;
    if (updateData.resolution) feedback.resolution = updateData.resolution;
    if (updateData.assignedTo) feedback.assignedTo = updateData.assignedTo;
    if (updateData.estimatedResolutionTime) {
      feedback.estimatedResolutionTime = updateData.estimatedResolutionTime;
    }

    // Add internal note if provided
    if (updateData.note && userId) {
      feedback.internalNotes.push({
        note: updateData.note,
        addedBy: userId,
        addedAt: new Date()
      });
    }

    await feedback.save();
    
    return await Feedback.findOne({ complaintId })
      .populate('assignedTo', 'name email phone')
      .populate('internalNotes.addedBy', 'name');
  } catch (error) {
    throw error;
  }
};

/**
 * Delete feedback
 */
export const deleteFeedback = async (complaintId) => {
  try {
    const feedback = await Feedback.findOneAndDelete({ complaintId });
    
    if (!feedback) {
      throw new Error('Complaint not found');
    }

    // Update area statistics
    if (feedback.location?.area) {
      await updateAreaComplaintCount(feedback.location.area, -1);
    }

    return feedback;
  } catch (error) {
    throw error;
  }
};

// ==================== DATA ANALYSIS SERVICES ====================

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async () => {
  try {
    const [
      totalComplaints,
      pendingComplaints,
      inProgressComplaints,
      resolvedComplaints,
      rejectedComplaints,
      highPriorityComplaints,
      todayComplaints,
      avgResolutionTime
    ] = await Promise.all([
      Feedback.countDocuments(),
      Feedback.countDocuments({ status: 'Pending' }),
      Feedback.countDocuments({ status: 'In Progress' }),
      Feedback.countDocuments({ status: 'Resolved' }),
      Feedback.countDocuments({ status: 'Rejected' }),
      Feedback.countDocuments({ priority: 'High', status: { $ne: 'Resolved' } }),
      Feedback.countDocuments({
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }),
      calculateAverageResolutionTime()
    ]);

    // Calculate resolution rate
    const resolutionRate = totalComplaints > 0
      ? calculatePercentage(resolvedComplaints, totalComplaints)
      : 0;

    return {
      total: totalComplaints,
      pending: pendingComplaints,
      inProgress: inProgressComplaints,
      resolved: resolvedComplaints,
      rejected: rejectedComplaints,
      highPriority: highPriorityComplaints,
      today: todayComplaints,
      resolutionRate: parseFloat(resolutionRate),
      avgResolutionTime: avgResolutionTime || 0
    };
  } catch (error) {
    throw new Error(`Failed to fetch dashboard stats: ${error.message}`);
  }
};

/**
 * Get complaints by issue type
 */
export const getComplaintsByIssueType = async () => {
  try {
    const complaints = await Feedback.aggregate([
      {
        $group: {
          _id: '$issueType',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    return complaints.map(item => ({
      issueType: item._id,
      count: item.count
    }));
  } catch (error) {
    throw new Error(`Failed to fetch complaints by issue type: ${error.message}`);
  }
};

/**
 * Get complaints by priority
 */
export const getComplaintsByPriority = async () => {
  try {
    const complaints = await Feedback.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    return complaints.map(item => ({
      priority: item._id,
      count: item.count
    }));
  } catch (error) {
    throw new Error(`Failed to fetch complaints by priority: ${error.message}`);
  }
};

/**
 * Get complaints by status
 */
export const getComplaintsByStatus = async () => {
  try {
    const complaints = await Feedback.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    return complaints.map(item => ({
      status: item._id,
      count: item.count
    }));
  } catch (error) {
    throw new Error(`Failed to fetch complaints by status: ${error.message}`);
  }
};

/**
 * Get complaints trend (last 30 days)
 */
export const getComplaintsTrend = async (days = 30) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const complaints = await Feedback.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    return complaints.map(item => ({
      date: item._id,
      count: item.count
    }));
  } catch (error) {
    throw new Error(`Failed to fetch complaints trend: ${error.message}`);
  }
};

/**
 * Get top areas by complaints
 */
export const getTopAreasByComplaints = async (limit = 10) => {
  try {
    const areas = await Feedback.aggregate([
      {
        $match: {
          'location.area': { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: '$location.area',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: limit
      }
    ]);

    return areas.map(item => ({
      area: item._id,
      count: item.count
    }));
  } catch (error) {
    throw new Error(`Failed to fetch top areas: ${error.message}`);
  }
};

/**
 * Calculate average resolution time (in hours)
 */
export const calculateAverageResolutionTime = async () => {
  try {
    const resolvedComplaints = await Feedback.find({
      status: 'Resolved',
      resolvedAt: { $exists: true, $ne: null }
    }).select('createdAt resolvedAt');

    if (resolvedComplaints.length === 0) {
      return 0;
    }

    const totalHours = resolvedComplaints.reduce((sum, complaint) => {
      const timeDiff = complaint.resolvedAt - complaint.createdAt;
      const hours = timeDiff / (1000 * 60 * 60);
      return sum + hours;
    }, 0);

    return Math.round(totalHours / resolvedComplaints.length);
  } catch (error) {
    throw new Error(`Failed to calculate average resolution time: ${error.message}`);
  }
};

/**
 * Get recent complaints
 */
export const getRecentComplaints = async (limit = 10) => {
  try {
    const complaints = await Feedback.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('assignedTo', 'name email')
      .select('complaintId name issueType priority status createdAt')
      .lean();

    return complaints;
  } catch (error) {
    throw new Error(`Failed to fetch recent complaints: ${error.message}`);
  }
};

/**
 * Update area complaint count
 */
const updateAreaComplaintCount = async (areaCode, increment) => {
  try {
    await PowerSupplyArea.findOneAndUpdate(
      { areaCode },
      { $inc: { activeComplaints: increment } }
    );
  } catch (error) {
    console.error('Failed to update area complaint count:', error);
  }
};

/**
 * Get advanced analytics
 */
export const getAdvancedAnalytics = async () => {
  try {
    const [
      issueTypeDistribution,
      priorityDistribution,
      statusDistribution,
      trend,
      topAreas,
      recentComplaints,
      stats
    ] = await Promise.all([
      getComplaintsByIssueType(),
      getComplaintsByPriority(),
      getComplaintsByStatus(),
      getComplaintsTrend(30),
      getTopAreasByComplaints(5),
      getRecentComplaints(5),
      getDashboardStats()
    ]);

    return {
      stats,
      issueTypeDistribution,
      priorityDistribution,
      statusDistribution,
      trend,
      topAreas,
      recentComplaints
    };
  } catch (error) {
    throw new Error(`Failed to fetch advanced analytics: ${error.message}`);
  }
};

// ==================== EXPORTS ====================
export default {
  createFeedback,
  getFeedbackByComplaintId,
  getFeedbackByPhone,
  getAllFeedbacks,
  updateFeedbackStatus,
  deleteFeedback,
  getDashboardStats,
  getComplaintsByIssueType,
  getComplaintsByPriority,
  getComplaintsByStatus,
  getComplaintsTrend,
  getTopAreasByComplaints,
  calculateAverageResolutionTime,
  getRecentComplaints,
  getAdvancedAnalytics
};
