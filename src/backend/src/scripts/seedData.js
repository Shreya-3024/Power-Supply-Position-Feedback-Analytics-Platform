import mongoose from 'mongoose';
import fs from 'fs';
import dotenv from 'dotenv';
import PowerSupply from '../models/PowerSupply.js';
import Review from '../models/Review.js';
import Monitoring from '../models/Monitoring.js';
import { User, PowerSupplyArea, Notification } from '../models/index.js';

dotenv.config();

// Sample Power Supplies Data
const powerSuppliesData = [
  {
    brand: 'Corsair',
    model: 'RM850x',
    wattage: 850,
    efficiency: '80+ Gold',
    modular: 'Fully Modular',
    price: 139.99,
    rating: 4.8,
    reviews: 2847,
    performance: 95,
    noise: 88,
    value: 92,
    position: 'Excellent',
    description: 'High-performance fully modular power supply with 80+ Gold efficiency',
    features: ['Zero RPM Fan Mode', '10 Year Warranty', '105°C Japanese Capacitors'],
    inStock: true,
    stockQuantity: 45,
    manufacturer: 'Corsair',
    warranty: '10 Years'
  },
  {
    brand: 'Seasonic',
    model: 'FOCUS GX-750',
    wattage: 750,
    efficiency: '80+ Gold',
    modular: 'Fully Modular',
    price: 119.99,
    rating: 4.9,
    reviews: 1923,
    performance: 97,
    noise: 90,
    value: 94,
    position: 'Excellent',
    description: 'Premium quality power supply with excellent efficiency and quiet operation',
    features: ['Fluid Dynamic Bearing Fan', '10 Year Warranty', 'Compact Design'],
    inStock: true,
    stockQuantity: 32,
    manufacturer: 'Seasonic',
    warranty: '10 Years'
  },
  {
    brand: 'EVGA',
    model: 'SuperNOVA 1000 G6',
    wattage: 1000,
    efficiency: '80+ Gold',
    modular: 'Fully Modular',
    price: 179.99,
    rating: 4.7,
    reviews: 1456,
    performance: 94,
    noise: 85,
    value: 89,
    position: 'Very Good',
    description: 'High wattage power supply perfect for gaming and workstation builds',
    features: ['ECO Mode', '10 Year Warranty', 'OVP/UVP/OCP Protection'],
    inStock: true,
    stockQuantity: 18,
    manufacturer: 'EVGA',
    warranty: '10 Years'
  },
  {
    brand: 'be quiet!',
    model: 'Dark Power Pro 12',
    wattage: 1200,
    efficiency: '80+ Titanium',
    modular: 'Fully Modular',
    price: 329.99,
    rating: 4.9,
    reviews: 876,
    performance: 98,
    noise: 95,
    value: 85,
    position: 'Excellent',
    description: 'Premium flagship PSU with titanium efficiency and whisper-quiet operation',
    features: ['Nearly Silent Operation', '5 Year Warranty', 'Premium Components'],
    inStock: true,
    stockQuantity: 12,
    manufacturer: 'be quiet!',
    warranty: '5 Years'
  },
  {
    brand: 'Thermaltake',
    model: 'Toughpower GF1',
    wattage: 650,
    efficiency: '80+ Gold',
    modular: 'Fully Modular',
    price: 99.99,
    rating: 4.6,
    reviews: 2134,
    performance: 91,
    noise: 87,
    value: 95,
    position: 'Good',
    description: 'Budget-friendly power supply with solid performance',
    features: ['RGB Sync', '10 Year Warranty', 'Hydraulic Bearing Fan'],
    inStock: true,
    stockQuantity: 67,
    manufacturer: 'Thermaltake',
    warranty: '10 Years'
  },
  {
    brand: 'Cooler Master',
    model: 'V850 SFX Gold',
    wattage: 850,
    efficiency: '80+ Gold',
    modular: 'Fully Modular',
    price: 159.99,
    rating: 4.5,
    reviews: 1087,
    performance: 90,
    noise: 83,
    value: 88,
    position: 'Good',
    description: 'Compact SFX form factor with full ATX power',
    features: ['SFX Form Factor', '10 Year Warranty', 'Silent Operation'],
    inStock: true,
    stockQuantity: 23,
    manufacturer: 'Cooler Master',
    warranty: '10 Years'
  }
];

// Sample Users Data
const usersData = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
    reviewCount: 5,
    helpfulVotes: 12,
    // Correcting: strict mode might fail if field not in schema? Check User schema.
    // User schema has: name, email, password, role, phone, isActive, lastLogin, assignedComplaints, permissions.
    // It DOES NOT have reviewCount or helpfulVotes or isEmailVerified.
    // Mongoose strict: true by default will just strip them, not error.
  },
  {
    name: 'Admin User',
    email: 'admin@powersupply.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user'
  }
];

// Sample Power Supply Areas Data
const powerAreasData = [
  {
    areaCode: 'DOW001',
    areaName: 'Downtown Core',
    district: 'Central District',
    substationName: 'Substation A',
    capacity: 5000,
    currentLoad: 3200,
    voltage: 230,
    status: 'Online',
    affectedHouseholds: 0,
    activeComplaints: 0,
    contactPerson: {
      name: 'John Engineer',
      phone: '1234567890',
      email: 'john.eng@power.com'
    }
  },
  {
    areaCode: 'UPT002',
    areaName: 'Uptown Residential',
    district: 'North District',
    substationName: 'Substation B',
    capacity: 4000,
    currentLoad: 2800,
    voltage: 228,
    status: 'Maintenance',
    affectedHouseholds: 50,
    activeComplaints: 3,
    contactPerson: {
      name: 'Jane Tech',
      phone: '9876543210',
      email: 'jane.tech@power.com'
    }
  },
  {
    areaCode: 'IND003',
    areaName: 'Industrial Zone',
    district: 'East District',
    substationName: 'Substation C',
    capacity: 8000,
    currentLoad: 6500,
    voltage: 232,
    status: 'Online',
    affectedHouseholds: 0,
    activeComplaints: 1,
    contactPerson: {
      name: 'Mike Manager',
      phone: '5551234567',
      email: 'mike.mgr@power.com'
    }
  }
];

// Sample Monitoring Data
const generateMonitoringData = () => {
  const data = [];
  const now = new Date();

  for (let i = 0; i < 20; i++) {
    const timestamp = new Date(now - i * 5 * 60 * 1000); // Every 5 minutes
    data.push({
      powerDraw: 780 + Math.random() * 100,
      voltage: 11.8 + Math.random() * 0.6,
      current: 65 + Math.random() * 10,
      temperature: 35 + Math.random() * 15,
      efficiency: 88 + Math.random() * 10,
      systemName: 'Main System',
      recordedAt: timestamp
    });
  }

  return data;
};

// Generate Sample Notifications
const generateNotifications = (users) => {
  if (!users || users.length === 0) return [];
  const safeUser = users[0] || { email: 'test@example.com' };

  return [
    {
      recipient: { email: safeUser.email, phone: '1234567890' },
      type: 'email',
      subject: 'Welcome to PowerFeedback',
      message: 'Thank you for registering with our service.',
      status: 'sent',
      sentAt: new Date()
    },
    {
      recipient: { email: safeUser.email, phone: '1234567890' },
      type: 'sms',
      subject: 'Complaint Update',
      message: 'Your complaint #PS241000123 has been resolved.',
      status: 'sent',
      sentAt: new Date()
    }
  ];
};

// Connect to MongoDB and seed data
const seedDatabase = async () => {
  try {
    console.log('\n' + '='.repeat(50));
    console.log('🌱 Starting Database Seeding...');
    console.log('='.repeat(50) + '\n');

    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/power_supply_feedback';
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ Connected to MongoDB at ${MONGODB_URI}\n`);

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    try {
      await PowerSupply.deleteMany({});
      await Review.deleteMany({});
      await Monitoring.deleteMany({});
      await User.deleteMany({});
      await PowerSupplyArea.deleteMany({});
      await Notification.deleteMany({});
    } catch (err) {
      console.log('Error clearing:', err.message);
    }
    console.log('✅ Existing data cleared\n');

    // Seed Users
    console.log('👤 Seeding users...');
    const users = await User.create(usersData);
    console.log(`✅ Created ${users.length} users\n`);

    // Seed Power Supplies
    console.log('⚡ Seeding power supplies...');
    const powerSupplies = await PowerSupply.create(powerSuppliesData);
    console.log(`✅ Created ${powerSupplies.length} power supplies\n`);

    // Seed Reviews
    console.log('⭐ Seeding reviews...');
    const reviewsData = [];

    if (powerSupplies.length > 0 && users.length > 0) {
      powerSupplies.forEach((psu, index) => {
        // Create 2-3 reviews per PSU
        const reviewCount = 2 + Math.floor(Math.random() * 2);

        for (let i = 0; i < reviewCount; i++) {
          reviewsData.push({
            userName: users[i % users.length].name,
            userEmail: users[i % users.length].email,
            powerSupplyId: psu._id,
            brand: psu.brand,
            model: psu.model,
            rating: 4 + Math.random(),
            title: `Great power supply from ${psu.brand}`,
            comment: `I've been using this ${psu.model} for ${i + 1} months now and it's been fantastic.`,
            performanceRating: psu.performance,
            noiseRating: psu.noise,
            valueRating: psu.value,
            usageDuration: i === 0 ? 'Less than 1 month' : i === 1 ? '1-6 months' : '6-12 months',
            wouldRecommend: true,
            status: 'approved',
            helpfulCount: Math.floor(Math.random() * 20),
            notHelpfulCount: Math.floor(Math.random() * 3)
          });
        }
      });

      if (reviewsData.length > 0) {
        const reviews = await Review.create(reviewsData);
        console.log(`✅ Created ${reviews.length} reviews\n`);
      }
    }

    // Seed Monitoring Data
    console.log('📊 Seeding monitoring data...');
    const monitoringData = generateMonitoringData();
    const monitoring = await Monitoring.create(monitoringData);
    console.log(`✅ Created ${monitoring.length} monitoring records\n`);

    // Seed Power Supply Areas
    console.log('🏭 Seeding power supply areas...');
    const areas = await PowerSupplyArea.create(powerAreasData);
    console.log(`✅ Created ${areas.length} power supply areas\n`);

    // Seed Notifications
    console.log('🔔 Seeding notifications...');
    const notificationsData = generateNotifications(users);
    const notifications = await Notification.create(notificationsData);
    console.log(`✅ Created ${notifications.length} notifications\n`);

    console.log('🎉 Database Seeding Complete!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    try {
      const errorLog = {
        message: error.message,
        stack: error.stack,
        name: error.name
      };
      if (error.errors) errorLog.validationErrors = error.errors;

      fs.writeFileSync('seed_error.log', JSON.stringify(errorLog, null, 2));
    } catch (e) {
      console.error("Failed to write error log");
    }
    process.exit(1);
  }
};

// Run seeding
seedDatabase();
