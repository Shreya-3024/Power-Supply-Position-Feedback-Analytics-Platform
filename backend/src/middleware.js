import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { config } from './config.js';
import { User } from './models/index.js';
import { errorResponse, HTTP_STATUS, validateComplaintData } from './utils.js';

// ==================== AUTHENTICATION MIDDLEWARE ====================
export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(
        res,
        'Access denied. No token provided.',
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      // Verify token
      const decoded = jwt.verify(token, config.jwtSecret);
      
      // Get user from database
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return errorResponse(
          res,
          'User not found.',
          HTTP_STATUS.UNAUTHORIZED
        );
      }

      if (!user.isActive) {
        return errorResponse(
          res,
          'User account is inactive.',
          HTTP_STATUS.FORBIDDEN
        );
      }

      // Attach user to request
      req.user = user;
      req.userId = user._id;
      req.userRole = user.role;
      
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return errorResponse(
          res,
          'Invalid token.',
          HTTP_STATUS.UNAUTHORIZED
        );
      } else if (error.name === 'TokenExpiredError') {
        return errorResponse(
          res,
          'Token has expired.',
          HTTP_STATUS.UNAUTHORIZED
        );
      }
      throw error;
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return errorResponse(
      res,
      'Authentication failed.',
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

// ==================== AUTHORIZATION MIDDLEWARE ====================
export const authorize = (...roles) => {
  return (req, res, next) => {
    console.log('[Authorize] Checking - User role:', req.user?.role, 'Required roles:', roles);
    
    if (!req.user) {
      console.log('[Authorize] FAILED - No user attached to request');
      return errorResponse(
        res,
        'Authentication required.',
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    if (!roles.includes(req.user.role)) {
      console.log('[Authorize] FAILED - User role not in required roles. User role:', req.user.role);
      return errorResponse(
        res,
        `You do not have permission to perform this action. Your role: ${req.user.role}`,
        HTTP_STATUS.FORBIDDEN
      );
    }

    console.log('[Authorize] ✅ PASSED for role:', req.user.role);
    next();
  };
};

// ==================== VALIDATION MIDDLEWARE ====================
export const validateComplaint = (req, res, next) => {
  const validation = validateComplaintData(req.body);
  
  if (!validation.valid) {
    return errorResponse(
      res,
      'Validation failed',
      HTTP_STATUS.BAD_REQUEST,
      validation.errors
    );
  }
  
  next();
};

// Express-validator rules for different endpoints
export const userValidationRules = () => {
  return [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Must be a valid email')
      .normalizeEmail(),
    body('password')
      .optional()
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
      .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
      .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
      .matches(/[0-9]/).withMessage('Password must contain at least one number'),
    body('role')
      .optional()
      .isIn(['admin', 'technician', 'manager', 'user']).withMessage('Invalid role'),
    body('phone')
      .optional()
      .matches(/^[0-9]{10}$/).withMessage('Phone must be a valid 10-digit number')
  ];
};

export const loginValidationRules = () => {
  return [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Must be a valid email')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('Password is required')
  ];
};

export const complaintUpdateValidationRules = () => {
  return [
    body('status')
      .optional()
      .isIn(['Pending', 'In Progress', 'Resolved', 'Rejected']).withMessage('Invalid status'),
    body('priority')
      .optional()
      .isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority'),
    body('resolution')
      .optional()
      .trim()
      .isLength({ max: 500 }).withMessage('Resolution cannot exceed 500 characters')
  ];
};

export const powerAreaValidationRules = () => {
  return [
    body('areaCode')
      .trim()
      .notEmpty().withMessage('Area code is required')
      .isLength({ min: 2, max: 10 }).withMessage('Area code must be between 2 and 10 characters')
      .toUpperCase(),
    body('areaName')
      .trim()
      .notEmpty().withMessage('Area name is required'),
    body('district')
      .trim()
      .notEmpty().withMessage('District is required'),
    body('substationName')
      .trim()
      .notEmpty().withMessage('Substation name is required'),
    body('capacity')
      .notEmpty().withMessage('Capacity is required')
      .isNumeric().withMessage('Capacity must be a number')
      .isFloat({ min: 0 }).withMessage('Capacity must be positive'),
    body('currentLoad')
      .optional()
      .isNumeric().withMessage('Current load must be a number')
      .isFloat({ min: 0 }).withMessage('Current load must be positive'),
    body('voltage')
      .optional()
      .isNumeric().withMessage('Voltage must be a number')
      .isFloat({ min: 0 }).withMessage('Voltage must be positive'),
    body('status')
      .optional()
      .isIn(['Online', 'Offline', 'Maintenance', 'Critical']).withMessage('Invalid status')
  ];
};

// Generic validation result checker
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return errorResponse(
      res,
      'Validation failed',
      HTTP_STATUS.BAD_REQUEST,
      errors.array().map(err => err.msg)
    );
  }
  
  next();
};

// ==================== ERROR HANDLER MIDDLEWARE ====================
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return errorResponse(
      res,
      'Validation error',
      HTTP_STATUS.BAD_REQUEST,
      errors
    );
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return errorResponse(
      res,
      `${field} already exists`,
      HTTP_STATUS.CONFLICT
    );
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return errorResponse(
      res,
      'Invalid ID format',
      HTTP_STATUS.BAD_REQUEST
    );
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(
      res,
      'Invalid token',
      HTTP_STATUS.UNAUTHORIZED
    );
  }

  if (err.name === 'TokenExpiredError') {
    return errorResponse(
      res,
      'Token expired',
      HTTP_STATUS.UNAUTHORIZED
    );
  }

  // Default error
  return errorResponse(
    res,
    err.message || 'Internal server error',
    err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
  );
};

// ==================== NOT FOUND MIDDLEWARE ====================
export const notFound = (req, res) => {
  return errorResponse(
    res,
    `Route ${req.originalUrl} not found`,
    HTTP_STATUS.NOT_FOUND
  );
};

// ==================== REQUEST LOGGER MIDDLEWARE ====================
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logMessage = `${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`;
    
    if (res.statusCode >= 400) {
      console.error(`❌ ${logMessage}`);
    } else {
      console.log(`✅ ${logMessage}`);
    }
  });
  
  next();
};

// ==================== PERMISSION CHECKER ====================
export const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(
        res,
        'Authentication required',
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const hasPermission = req.user.permissions && req.user.permissions[permission];
    
    if (!hasPermission && req.user.role !== 'admin') {
      return errorResponse(
        res,
        `You do not have permission to ${permission}`,
        HTTP_STATUS.FORBIDDEN
      );
    }

    next();
  };
};

// ==================== SANITIZE INPUT MIDDLEWARE ====================
export const sanitizeInput = (req, res, next) => {
  // Remove any potential XSS from string inputs
  const sanitize = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].trim().replace(/[<>]/g, '');
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };

  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);
  
  next();
};

// ==================== EXPORTS ====================
export default {
  authenticate,
  authorize,
  validateComplaint,
  userValidationRules,
  loginValidationRules,
  complaintUpdateValidationRules,
  powerAreaValidationRules,
  validate,
  errorHandler,
  notFound,
  requestLogger,
  checkPermission,
  sanitizeInput
};
