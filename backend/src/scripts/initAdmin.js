import { User } from '../models/index.js';

/**
 * Ensures a default admin user exists in the database
 */
export const initAdminUser = async () => {
  try {
    const adminEmail = 'admin@powersupply.com';
    const adminPassword = 'Admin@12345';
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      console.log('👷 Creating default admin user...');
      
      const admin = new User({
        name: 'System Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        phone: '1234567890',
        isActive: true,
        permissions: {
          canCreateComplaint: true,
          canUpdateComplaint: true,
          canDeleteComplaint: true,
          canManageUsers: true,
          canViewAnalytics: true
        }
      });

      await admin.save();
      console.log('✅ Default admin user created successfully!');
    } else {
      console.log('ℹ️ Admin user already exists.');
    }
  } catch (error) {
    console.error('❌ Error initializing admin user:', error.message);
  }
};
