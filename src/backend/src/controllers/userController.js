import { User, PowerSupplyArea } from '../models/index.js';
import * as simulationService from '../services/simulationService.js';
import { successResponse, errorResponse, HTTP_STATUS, generateToken, paginatedResponse } from '../utils.js';
import { config } from '../config.js';

// ==================== USER/AUTH CONTROLLERS ====================

/**
 * Register new user
 * POST /api/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(
        res,
        'User with this email already exists',
        HTTP_STATUS.CONFLICT
      );
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: role || 'admin',
      phone
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    // Return user without password
    const userObject = user.toSafeObject();

    return successResponse(
      res,
      {
        user: userObject,
        token
      },
      'User registered successfully',
      HTTP_STATUS.CREATED
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return errorResponse(
        res,
        'Invalid email or password',
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return errorResponse(
        res,
        'Your account has been deactivated',
        HTTP_STATUS.FORBIDDEN
      );
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return errorResponse(
        res,
        'Invalid email or password',
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    // Return user without password
    const userObject = user.toSafeObject();

    return successResponse(
      res,
      {
        user: userObject,
        token
      },
      'Login successful'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 * GET /api/auth/me
 */
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId)
      .populate('assignedComplaints', 'complaintId issueType status priority');

    if (!user) {
      return errorResponse(
        res,
        'User not found',
        HTTP_STATUS.NOT_FOUND
      );
    }

    return successResponse(
      res,
      user,
      'User profile retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 * PATCH /api/auth/profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findById(req.userId);
    
    if (!user) {
      return errorResponse(
        res,
        'User not found',
        HTTP_STATUS.NOT_FOUND
      );
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();

    return successResponse(
      res,
      user.toSafeObject(),
      'Profile updated successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Change password
 * POST /api/auth/change-password
 */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.userId).select('+password');
    
    if (!user) {
      return errorResponse(
        res,
        'User not found',
        HTTP_STATUS.NOT_FOUND
      );
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    
    if (!isPasswordValid) {
      return errorResponse(
        res,
        'Current password is incorrect',
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return successResponse(
      res,
      null,
      'Password changed successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all users (Admin only)
 * GET /api/users
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      role,
      isActive,
      search
    } = req.query;

    const query = {};
    
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      User.countDocuments(query)
    ]);

    return paginatedResponse(
      res,
      users,
      parseInt(page),
      parseInt(limit),
      total,
      'Users retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by ID (Admin only)
 * GET /api/users/:userId
 */
export const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select('-password')
      .populate('assignedComplaints', 'complaintId issueType status priority');

    if (!user) {
      return errorResponse(
        res,
        'User not found',
        HTTP_STATUS.NOT_FOUND
      );
    }

    return successResponse(
      res,
      user,
      'User retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update user (Admin only)
 * PATCH /api/users/:userId
 */
export const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    // Don't allow password update through this endpoint
    delete updateData.password;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return errorResponse(
        res,
        'User not found',
        HTTP_STATUS.NOT_FOUND
      );
    }

    return successResponse(
      res,
      user,
      'User updated successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user (Admin only)
 * DELETE /api/users/:userId
 */
export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return errorResponse(
        res,
        'User not found',
        HTTP_STATUS.NOT_FOUND
      );
    }

    return successResponse(
      res,
      { userId: user._id },
      'User deleted successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Initialize default admin user
 */
export const initializeDefaultAdmin = async () => {
  try {
    const adminCount = await User.countDocuments({ role: 'admin' });
    
    if (adminCount > 0) {
      console.log('✅ Admin user already exists');
      return;
    }

    const defaultAdmin = new User({
      name: config.admin.defaultName,
      email: config.admin.defaultEmail,
      password: config.admin.defaultPassword,
      role: 'admin',
      isActive: true,
      permissions: {
        canCreateComplaint: true,
        canUpdateComplaint: true,
        canDeleteComplaint: true,
        canManageUsers: true,
        canViewAnalytics: true
      }
    });

    await defaultAdmin.save();
    
    console.log('✅ Default admin user created');
    console.log(`📧 Email: ${config.admin.defaultEmail}`);
    console.log(`🔐 Password: ${config.admin.defaultPassword}`);
    console.log('⚠️  Please change the default password after first login!');
  } catch (error) {
    console.error('❌ Failed to create default admin:', error.message);
  }
};

// ==================== POWER SUPPLY AREA CONTROLLERS (Admin) ====================

/**
 * Create power area (Admin only)
 * POST /api/power/areas
 */
export const createPowerArea = async (req, res, next) => {
  try {
    const area = await simulationService.createPowerArea(req.body);

    return successResponse(
      res,
      area,
      'Power area created successfully',
      HTTP_STATUS.CREATED
    );
  } catch (error) {
    if (error.message.includes('already exists')) {
      return errorResponse(res, error.message, HTTP_STATUS.CONFLICT);
    }
    next(error);
  }
};

/**
 * Update power area (Admin only)
 * PATCH /api/power/areas/:areaCode
 */
export const updatePowerArea = async (req, res, next) => {
  try {
    const { areaCode } = req.params;
    const area = await simulationService.updatePowerArea(areaCode, req.body);

    return successResponse(
      res,
      area,
      'Power area updated successfully'
    );
  } catch (error) {
    if (error.message === 'Power area not found') {
      return errorResponse(res, error.message, HTTP_STATUS.NOT_FOUND);
    }
    next(error);
  }
};

/**
 * Delete power area (Admin only)
 * DELETE /api/power/areas/:areaCode
 */
export const deletePowerArea = async (req, res, next) => {
  try {
    const { areaCode } = req.params;
    const area = await simulationService.deletePowerArea(areaCode);

    return successResponse(
      res,
      { areaCode: area.areaCode },
      'Power area deleted successfully'
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
  register,
  login,
  getCurrentUser,
  updateProfile,
  changePassword,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  initializeDefaultAdmin,
  createPowerArea,
  updatePowerArea,
  deletePowerArea
};
