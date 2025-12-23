import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend directory
dotenv.config({ path: path.resolve(__dirname, 'src/backend/.env') });

// Define User schema inline
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['admin', 'technician', 'manager', 'user'], default: 'admin' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

const User = mongoose.model('User', userSchema);

async function testAdminLogin() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/power_supply_feedback';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Find admin user
    const admin = await User.findOne({ email: 'admin@powersupply.com' }).select('+password');
    if (!admin) {
      console.log('Admin user not found');
      process.exit(1);
    }

    console.log('Admin user found:');
    console.log('Name:', admin.name);
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('Password hash exists:', !!admin.password);

    // Test different passwords
    const testPasswords = ['Admin@123', 'Admin@12345', 'admin123'];

    console.log('\nTesting password comparisons:');
    for (const password of testPasswords) {
      try {
        const isValid = await admin.comparePassword(password);
        console.log(`Password "${password}": ${isValid ? '✅ VALID' : '❌ INVALID'}`);
      } catch (error) {
        console.log(`Password "${password}": ERROR - ${error.message}`);
      }
    }

    console.log('\n🔧 Setting password to Admin@12345...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@12345', salt);
    admin.password = hashedPassword;
    await admin.save();

    console.log('✅ Password updated. Testing again...');
    const isValidNow = await admin.comparePassword('Admin@12345');
    console.log(`Password "Admin@12345" after update: ${isValidNow ? '✅ VALID' : '❌ INVALID'}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error testing admin login:', error.message);
    process.exit(1);
  }
}

testAdminLogin();
