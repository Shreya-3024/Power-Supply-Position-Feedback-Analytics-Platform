import mongoose from 'mongoose';
import dotenv from 'dotenv';
import PowerSupply from '../models/PowerSupply.js';
import Review from '../models/Review.js';
import Monitoring from '../models/Monitoring.js';
import { User, PowerSupplyArea, Notification } from '../models/index.js';

console.log("Diagnostic script starting...");
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/power_supply_feedback';
console.log("URI:", MONGODB_URI);

try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully!");
    await mongoose.disconnect();
    console.log("Disconnected.");
    process.exit(0);
} catch (e) {
    console.error("Connection failed:", e);
    process.exit(1);
}
