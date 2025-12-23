import * as dataService from '../services/dataService.js';
import * as simulationService from '../services/simulationService.js';
import { successResponse, errorResponse, paginatedResponse, HTTP_STATUS, calculatePriority, calculateEstimatedResolution } from '../utils.js';

// ==================== FEEDBACK/COMPLAINT CONTROLLERS ====================

/**
 * Create new complaint
 * POST /api/feedback
 */
export const createComplaint = async (req, res, next) => {
  try {
    const complaintData = {
      ...req.body,
      priority: req.body.priority || calculatePriority(req.body.issueType, req.body.description),
      estimatedResolutionTime: calculateEstimatedResolution(
        req.body.priority || 'Medium',
        req.body.issueType
      )
    };

    // Add metadata
    const metadata = {
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      source: 'web'
    };

    const feedback = await dataService.createFeedback(complaintData, metadata);

    // Send confirmation notifications (non-blocking)
    simulationService.sendComplaintConfirmation(
      feedback.email,
      feedback.phone,
      feedback.complaintId,
      feedback.name
    ).catch(err => console.error('Notification error:', err));

    return successResponse(
      res,
      feedback,
      'Complaint registered successfully',
      HTTP_STATUS.CREATED
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get complaint by ID
 * GET /api/feedback/:complaintId
 */
export const getComplaintById = async (req, res, next) => {
  try {
    const { complaintId } = req.params;
    const feedback = await dataService.getFeedbackByComplaintId(complaintId);

    return successResponse(
      res,
      feedback,
      'Complaint retrieved successfully'
    );
  } catch (error) {
    if (error.message === 'Complaint not found') {
      return errorResponse(res, error.message, HTTP_STATUS.NOT_FOUND);
    }
    next(error);
  }
};

/**
 * Get complaints by phone
 * GET /api/feedback/phone/:phone
 */
export const getComplaintsByPhone = async (req, res, next) => {
  try {
    const { phone } = req.params;
    const feedbacks = await dataService.getFeedbackByPhone(phone);

    return successResponse(
      res,
      feedbacks,
      `Found ${feedbacks.length} complaint(s)`
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all complaints (with filters and pagination)
 * GET /api/feedback
 */
export const getAllComplaints = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      priority,
      issueType,
      search,
      startDate,
      endDate,
      sortBy = '-createdAt'
    } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (issueType) filters.issueType = issueType;
    if (search) filters.search = search;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;

    const result = await dataService.getAllFeedbacks(
      filters,
      parseInt(page),
      parseInt(limit),
      sortBy
    );

    return paginatedResponse(
      res,
      result.feedbacks,
      result.page,
      parseInt(limit),
      result.total,
      'Complaints retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update complaint status
 * PATCH /api/feedback/:complaintId
 */
export const updateComplaintStatus = async (req, res, next) => {
  try {
    const { complaintId } = req.params;
    const updateData = req.body;
    const userId = req.userId || null;

    const feedback = await dataService.updateFeedbackStatus(
      complaintId,
      updateData,
      userId
    );

    // Send status update notification (non-blocking)
    if (updateData.status && feedback.email && feedback.phone) {
      simulationService.sendStatusUpdateNotification(
        feedback.email,
        feedback.phone,
        feedback.complaintId,
        updateData.status,
        feedback.name
      ).catch(err => console.error('Notification error:', err));
    }

    return successResponse(
      res,
      feedback,
      'Complaint updated successfully'
    );
  } catch (error) {
    if (error.message === 'Complaint not found') {
      return errorResponse(res, error.message, HTTP_STATUS.NOT_FOUND);
    }
    next(error);
  }
};

/**
 * Delete complaint
 * DELETE /api/feedback/:complaintId
 */
export const deleteComplaint = async (req, res, next) => {
  try {
    const { complaintId } = req.params;
    const feedback = await dataService.deleteFeedback(complaintId);

    return successResponse(
      res,
      { complaintId: feedback.complaintId },
      'Complaint deleted successfully'
    );
  } catch (error) {
    if (error.message === 'Complaint not found') {
      return errorResponse(res, error.message, HTTP_STATUS.NOT_FOUND);
    }
    next(error);
  }
};

// ==================== ANALYTICS CONTROLLERS ====================

/**
 * Get dashboard statistics
 * GET /api/analytics/dashboard
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await dataService.getDashboardStats();

    return successResponse(
      res,
      stats,
      'Dashboard statistics retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get complaints by issue type
 * GET /api/analytics/issue-types
 */
export const getComplaintsByIssueType = async (req, res, next) => {
  try {
    const data = await dataService.getComplaintsByIssueType();

    return successResponse(
      res,
      data,
      'Issue type distribution retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get complaints by priority
 * GET /api/analytics/priorities
 */
export const getComplaintsByPriority = async (req, res, next) => {
  try {
    const data = await dataService.getComplaintsByPriority();

    return successResponse(
      res,
      data,
      'Priority distribution retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get complaints by status
 * GET /api/analytics/statuses
 */
export const getComplaintsByStatus = async (req, res, next) => {
  try {
    const data = await dataService.getComplaintsByStatus();

    return successResponse(
      res,
      data,
      'Status distribution retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get complaints trend
 * GET /api/analytics/trend
 */
export const getComplaintsTrend = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const data = await dataService.getComplaintsTrend(parseInt(days));

    return successResponse(
      res,
      data,
      'Complaints trend retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get top areas by complaints
 * GET /api/analytics/top-areas
 */
export const getTopAreas = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const data = await dataService.getTopAreasByComplaints(parseInt(limit));

    return successResponse(
      res,
      data,
      'Top areas retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get advanced analytics
 * GET /api/analytics/advanced
 */
export const getAdvancedAnalytics = async (req, res, next) => {
  try {
    const data = await dataService.getAdvancedAnalytics();

    return successResponse(
      res,
      data,
      'Advanced analytics retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

// ==================== POWER SIMULATION CONTROLLERS ====================

/**
 * Get all power areas
 * GET /api/power/areas
 */
export const getAllPowerAreas = async (req, res, next) => {
  try {
    const areas = await simulationService.getAllPowerAreas();

    return successResponse(
      res,
      areas,
      'Power areas retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get power area by code
 * GET /api/power/areas/:areaCode
 */
export const getPowerAreaByCode = async (req, res, next) => {
  try {
    const { areaCode } = req.params;
    const area = await simulationService.getPowerAreaByCode(areaCode);

    return successResponse(
      res,
      area,
      'Power area retrieved successfully'
    );
  } catch (error) {
    if (error.message === 'Power area not found') {
      return errorResponse(res, error.message, HTTP_STATUS.NOT_FOUND);
    }
    next(error);
  }
};

/**
 * Get power grid overview
 * GET /api/power/overview
 */
export const getPowerGridOverview = async (req, res, next) => {
  try {
    const overview = await simulationService.getPowerGridOverview();

    return successResponse(
      res,
      overview,
      'Power grid overview retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Simulate power load for an area
 * POST /api/power/simulate/:areaCode
 */
export const simulatePowerLoad = async (req, res, next) => {
  try {
    const { areaCode } = req.params;
    const area = await simulationService.simulatePowerLoad(areaCode);

    return successResponse(
      res,
      area,
      'Power load simulated successfully'
    );
  } catch (error) {
    if (error.message === 'Power area not found') {
      return errorResponse(res, error.message, HTTP_STATUS.NOT_FOUND);
    }
    next(error);
  }
};

/**
 * Simulate outage
 * POST /api/power/outage/:areaCode
 */
export const simulateOutage = async (req, res, next) => {
  try {
    const { areaCode } = req.params;
    const { duration = 30 } = req.body;
    
    const area = await simulationService.simulateOutage(areaCode, duration);

    return successResponse(
      res,
      area,
      `Outage simulated for ${duration} minutes`
    );
  } catch (error) {
    if (error.message === 'Power area not found') {
      return errorResponse(res, error.message, HTTP_STATUS.NOT_FOUND);
    }
    next(error);
  }
};

// ==================== EXPORTS ====================
export default {
  createComplaint,
  getComplaintById,
  getComplaintsByPhone,
  getAllComplaints,
  updateComplaintStatus,
  deleteComplaint,
  getDashboardStats,
  getComplaintsByIssueType,
  getComplaintsByPriority,
  getComplaintsByStatus,
  getComplaintsTrend,
  getTopAreas,
  getAdvancedAnalytics,
  getAllPowerAreas,
  getPowerAreaByCode,
  getPowerGridOverview,
  simulatePowerLoad,
  simulateOutage
};
