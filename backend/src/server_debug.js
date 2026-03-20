import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import connectDB from './config/database.js';
import fs from 'fs';
import path from 'path';

// Debug Logger
const logFile = 'debug_startup.log';
const log = (msg) => {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logFile, `[${timestamp}] ${msg}\n`);
};

log('--- STARTING SERVER DEBUG ---');

try {
    // Load environment variables
    // Try both paths
    log('Loading dotenv...');
    const envPath = './src/backend/.env'; // Path from root
    const result = dotenv.config({ path: envPath });

    if (result.error) {
        log(`Error loading dotenv from ${envPath}: ${result.error.message}`);
        // Try local path
        const localEnv = './.env';
        const result2 = dotenv.config({ path: localEnv });
        log(`Tried local .env: ${result2.error ? result2.error.message : 'Success'}`);
    } else {
        log(`Dotenv loaded from ${envPath}`);
    }

    log(`PORT: ${process.env.PORT}`);
    log(`MONGODB_URI: ${process.env.MONGODB_URI}`);

    // Initialize Express app
    const app = express();

    // Connect to MongoDB
    log('Connecting to MongoDB...');
    connectDB().then(() => {
        log('MongoDB Connected successfully (promise resolved)');
    }).catch(err => {
        log(`MongoDB Connection FAILED: ${err.message}`);
    });

    // Middleware setup
    app.set('trust proxy', 1);
    app.use(helmet({ contentSecurityPolicy: false })); // Simplified for debug
    app.use(cors({
        origin: ['http://localhost:3000'],
        credentials: true,
    }));
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true }));

    // Import routes (simplified)
    // We need to import these dynamically or assume they work.
    // importing them might fail if files missing.
    // For debug, let's skip routes initially or try/catch them.

    try {
        log('Importing routes...');
        const feedbackRoutes = await import('./routes/feedbackRoutes.js');
        app.use('/api/feedback', feedbackRoutes.default);
        log('Routes imported.');
    } catch (routeErr) {
        log(`Route import error: ${routeErr.message}`);
    }

    app.get('/health', (req, res) => {
        res.json({ status: 'ok', msg: 'Debug Server Running' });
    });

    const PORT = process.env.PORT || 5000;
    log(`Attempting to listen on port ${PORT}...`);

    const server = app.listen(PORT, () => {
        log(`SERVER LISTENING ON PORT ${PORT}`);
        log('READY');
    });

    server.on('error', (e) => {
        log(`SERVER ERROR: ${e.code} - ${e.message}`);
    });

} catch (err) {
    log(`FATAL ERROR in script: ${err.message}\n${err.stack}`);
}
