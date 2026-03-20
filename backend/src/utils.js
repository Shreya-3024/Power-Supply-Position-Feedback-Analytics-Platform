import jwt from 'jsonwebtoken';
import { config } from './config.js';

// ==================== CONSTANTS ====================
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

export const ISSUE_TYPES = [
  'Power Outage',
  'Voltage Fluctuation',
  'Billing Issue',
  'Equipment Damage',
  'Meter Problem',
  'Other'
];

export const PRIORITY_LEVELS = ['Low', 'Medium', 'High'];

export const STATUS_TYPES = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

export const USER_ROLES = ['admin', 'technician', 'manager', 'user'];

export const POWER_AREA_STATUS = ['Online', 'Offline', 'Maintenance', 'Critical'];

// ==================== JWT HELPERS ====================
export const generateToken = (userId, role = 'admin') => {
  try {
    return jwt.sign(
      { 
        id: userId,
        role: role,
        timestamp: Date.now()
      },
      config.jwtSecret,
      { 
        expiresIn: config.jwtExpire,
        issuer: 'power-supply-system'
      }
    );
  } catch (error) {
    throw new Error('Token generation failed');
  }
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw new Error('Token verification failed');
  }
};

// ==================== VALIDATORS ====================
export const validateEmail = (email) => {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

export const validatePassword = (password) => {
  // At least 6 characters, 1 uppercase, 1 lowercase, 1 number
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  return { valid: true };
};

export const validateComplaintData = (data) => {
  const errors = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.push('Valid email is required');
  }

  if (!data.phone || !validatePhone(data.phone)) {
    errors.push('Valid 10-digit phone number is required');
  }

  if (!data.address || data.address.trim().length < 5) {
    errors.push('Address must be at least 5 characters');
  }

  if (!data.issueType || !ISSUE_TYPES.includes(data.issueType)) {
    errors.push('Valid issue type is required');
  }

  if (!data.description || data.description.trim().length < 10) {
    errors.push('Description must be at least 10 characters');
  }

  if (data.priority && !PRIORITY_LEVELS.includes(data.priority)) {
    errors.push('Invalid priority level');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

// ==================== RESPONSE HELPERS ====================
export const successResponse = (res, data, message = 'Success', statusCode = HTTP_STATUS.OK) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

export const errorResponse = (res, message = 'An error occurred', statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errors = null) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

export const paginatedResponse = (res, data, page, limit, total, message = 'Success') => {
  const totalPages = Math.ceil(total / limit);
  
  return res.status(HTTP_STATUS.OK).json({
    success: true,
    message,
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    },
    timestamp: new Date().toISOString()
  });
};

// ==================== DATE HELPERS ====================
export const formatDate = (date) => {
  return new Date(date).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const getTimeDifference = (date1, date2) => {
  const diff = Math.abs(date1 - date2);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { days, hours, minutes };
};

// ==================== STRING HELPERS ====================
export const sanitizeString = (str) => {
  if (!str) return '';
  return str.trim().replace(/[<>]/g, '');
};

export const truncateString = (str, maxLength = 100) => {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};

export const generateRandomString = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// ==================== NUMBER HELPERS ====================
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return ((value / total) * 100).toFixed(2);
};

export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-IN').format(num);
};

// ==================== ARRAY HELPERS ====================
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

export const removeDuplicates = (array, key) => {
  return array.filter((item, index, self) =>
    index === self.findIndex((t) => t[key] === item[key])
  );
};

// ==================== ASYNC HELPERS ====================
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// ==================== PRIORITY CALCULATOR ====================
export const calculatePriority = (issueType, description) => {
  const highPriorityIssues = ['Power Outage', 'Equipment Damage'];
  const urgentKeywords = ['urgent', 'emergency', 'critical', 'fire', 'danger', 'immediately'];
  
  if (highPriorityIssues.includes(issueType)) {
    return 'High';
  }
  
  const lowerDesc = description.toLowerCase();
  if (urgentKeywords.some(keyword => lowerDesc.includes(keyword))) {
    return 'High';
  }
  
  if (issueType === 'Voltage Fluctuation' || issueType === 'Meter Problem') {
    return 'Medium';
  }
  
  return 'Low';
};

// ==================== ESTIMATED RESOLUTION TIME ====================
export const calculateEstimatedResolution = (priority, issueType) => {
  const now = new Date();
  
  // Base hours for resolution based on priority
  let hours = 72; // Low priority: 3 days
  
  if (priority === 'High') {
    hours = 4; // 4 hours
  } else if (priority === 'Medium') {
    hours = 24; // 1 day
  }
  
  // Adjust based on issue type
  if (issueType === 'Billing Issue') {
    hours *= 2; // Billing issues take longer
  } else if (issueType === 'Power Outage') {
    hours = Math.min(hours, 2); // Power outages should be fastest
  }
  
  return new Date(now.getTime() + hours * 60 * 60 * 1000);
};

// ==================== FILE HELPERS ====================
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

export const isValidImageExtension = (filename) => {
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  const ext = getFileExtension(filename).toLowerCase();
  return validExtensions.includes(ext);
};

export const generateUniqueFilename = (originalname) => {
  const timestamp = Date.now();
  const random = generateRandomString(8);
  const ext = getFileExtension(originalname);
  return `${timestamp}-${random}.${ext}`;
};

// ==================== EXPORT ALL ====================
export default {
  HTTP_STATUS,
  ISSUE_TYPES,
  PRIORITY_LEVELS,
  STATUS_TYPES,
  USER_ROLES,
  POWER_AREA_STATUS,
  generateToken,
  verifyToken,
  validateEmail,
  validatePhone,
  validatePassword,
  validateComplaintData,
  successResponse,
  errorResponse,
  paginatedResponse,
  formatDate,
  addDays,
  getTimeDifference,
  sanitizeString,
  truncateString,
  generateRandomString,
  calculatePercentage,
  formatNumber,
  groupBy,
  removeDuplicates,
  asyncHandler,
  sleep,
  calculatePriority,
  calculateEstimatedResolution,
  getFileExtension,
  isValidImageExtension,
  generateUniqueFilename
};
