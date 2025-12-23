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
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function updateAdminPassword() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/power_supply_feedback';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Find admin user
    const admin = await User.findOne({ email: 'admin@powersupply.com' });
    if (!admin) {
      console.log('Admin user not found');
      process.exit(1);
    }

    // Update password
    admin.password = 'Admin@12345';
    await admin.save();

    console.log('✅ Admin password updated successfully');
    console.log('Email: admin@powersupply.com');
    console.log('Password: Admin@12345');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating admin password:', error.message);
    process.exit(1);
  }
}

updateAdminPassword();
