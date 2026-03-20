import express from 'express';
import * as apiController from '../controllers/apiController.js';
import * as userController from '../controllers/userController.js';
import {
  authenticate,
  authorize,
  validateComplaint,
  userValidationRules,
  loginValidationRules,
  complaintUpdateValidationRules,
  powerAreaValidationRules,
  validate,
  checkPermission,
  sanitizeInput
} from '../middleware.js';

const router = express.Router();

// Apply sanitization to all routes
router.use(sanitizeInput);

// ==================== PUBLIC ROUTES ====================

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ==================== AUTH ROUTES ====================
router.post('/auth/register', userValidationRules(), validate, userController.register);
router.post('/auth/login', loginValidationRules(), validate, userController.login);
router.get('/auth/me', authenticate, userController.getCurrentUser);
router.patch('/auth/profile', authenticate, userController.updateProfile);
router.post('/auth/change-password', authenticate, userController.changePassword);

// ==================== FEEDBACK/COMPLAINT ROUTES ====================

// Public routes - Create complaint and track by ID/phone
// router.post('/feedback', validateComplaint, apiController.createComplaint); // Moved to feedbackRoutes.js
router.get('/feedback/:complaintId', apiController.getComplaintById);
router.get('/feedback/phone/:phone', apiController.getComplaintsByPhone);

// Protected routes - Admin/Manager access
router.get('/feedback', authenticate, apiController.getAllComplaints);
router.patch(
  '/feedback/:complaintId',
  authenticate,
  checkPermission('canUpdateComplaint'),
  complaintUpdateValidationRules(),
  validate,
  apiController.updateComplaintStatus
);
router.delete(
  '/feedback/:complaintId',
  authenticate,
  checkPermission('canDeleteComplaint'),
  apiController.deleteComplaint
);

// ==================== ANALYTICS ROUTES ====================
router.get('/analytics/dashboard', authenticate, apiController.getDashboardStats);
router.get('/analytics/issue-types', authenticate, apiController.getComplaintsByIssueType);
router.get('/analytics/priorities', authenticate, apiController.getComplaintsByPriority);
router.get('/analytics/statuses', authenticate, apiController.getComplaintsByStatus);
router.get('/analytics/trend', authenticate, apiController.getComplaintsTrend);
router.get('/analytics/top-areas', authenticate, apiController.getTopAreas);
router.get('/analytics/advanced', authenticate, apiController.getAdvancedAnalytics);

// ==================== POWER SUPPLY AREA ROUTES ====================

// Public routes - View power areas
router.get('/power/areas', apiController.getAllPowerAreas);
router.get('/power/areas/:areaCode', apiController.getPowerAreaByCode);
router.get('/power/overview', apiController.getPowerGridOverview);

// Protected routes - Admin only
router.post(
  '/power/areas',
  authenticate,
  authorize('admin'),
  powerAreaValidationRules(),
  validate,
  userController.createPowerArea
);
router.patch(
  '/power/areas/:areaCode',
  authenticate,
  authorize('admin'),
  userController.updatePowerArea
);
router.delete(
  '/power/areas/:areaCode',
  authenticate,
  authorize('admin'),
  userController.deletePowerArea
);

// Simulation routes - Admin only
router.post(
  '/power/simulate/:areaCode',
  authenticate,
  authorize('admin'),
  apiController.simulatePowerLoad
);
router.post(
  '/power/outage/:areaCode',
  authenticate,
  authorize('admin'),
  apiController.simulateOutage
);

// ==================== USER MANAGEMENT ROUTES (Admin only) ====================
router.get('/users', authenticate, authorize('admin'), userController.getAllUsers);
router.get('/users/:userId', authenticate, authorize('admin'), userController.getUserById);
router.patch('/users/:userId', authenticate, authorize('admin'), userController.updateUser);
router.delete('/users/:userId', authenticate, authorize('admin'), userController.deleteUser);

// ==================== EXPORTS ====================
export default router;
