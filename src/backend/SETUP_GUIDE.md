# 🚀 Complete Setup Guide - Power Supply Backend

This guide will walk you through setting up the backend from scratch, including all dependencies and configurations.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation Steps](#installation-steps)
3. [MongoDB Setup](#mongodb-setup)
4. [Environment Configuration](#environment-configuration)
5. [Running the Server](#running-the-server)
6. [Testing the API](#testing-the-api)
7. [Connecting to Frontend](#connecting-to-frontend)
8. [Troubleshooting](#troubleshooting)

---

## 1. Prerequisites

### Required Software

#### Node.js (v18 or higher)
```bash
# Check if Node.js is installed
node --version

# If not installed, download from:
# https://nodejs.org/

# Or using nvm (recommended):
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

#### MongoDB (v6 or higher)

**Option A: Local Installation**
```bash
# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community@6.0
brew services start mongodb-community@6.0

# Ubuntu/Debian
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod

# Windows
# Download installer from: https://www.mongodb.com/try/download/community
# Run installer and follow instructions
```

**Option B: MongoDB Atlas (Cloud - Recommended for Production)**
1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create a new cluster (Free tier available)
4. Get connection string
5. Whitelist your IP address
6. Create database user

---

## 2. Installation Steps

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Install Dependencies
```bash
# Using npm
npm install

# Or using yarn
yarn install
```

This will install all required packages:
- express
- mongoose
- cors
- dotenv
- bcryptjs
- jsonwebtoken
- express-validator
- multer
- nodemailer
- socket.io
- helmet
- express-rate-limit
- compression
- morgan

### Step 3: Verify Installation
```bash
# Check if node_modules folder is created
ls -la

# You should see node_modules directory
```

---

## 3. MongoDB Setup

### Option A: Local MongoDB

#### Start MongoDB Service
```bash
# macOS
brew services start mongodb-community@6.0

# Linux
sudo systemctl start mongod
sudo systemctl enable mongod

# Windows
# MongoDB runs as a service automatically after installation
```

#### Verify MongoDB is Running
```bash
# Connect to MongoDB shell
mongosh

# You should see MongoDB shell prompt
# Type 'exit' to exit

# Or check the status
# macOS
brew services list | grep mongodb

# Linux
sudo systemctl status mongod
```

#### Create Database (Optional)
```bash
mongosh
use power_supply_feedback
db.createCollection("feedbacks")
exit
```

### Option B: MongoDB Atlas (Cloud)

#### Step-by-Step Setup:

1. **Create Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free account

2. **Create Cluster**
   - Click "Build a Cluster"
   - Choose "Shared" (Free tier)
   - Select cloud provider and region
   - Click "Create Cluster"
   - Wait 5-10 minutes for cluster creation

3. **Create Database User**
   - Go to "Database Access" in left menu
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `poweradmin`
   - Password: Generate strong password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Whitelist IP Address**
   - Go to "Network Access" in left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP address (for production)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Clusters" in left menu
   - Click "Connect" on your cluster
   - Click "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `power_supply_feedback`

Example connection string:
```
mongodb+srv://poweradmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/power_supply_feedback?retryWrites=true&w=majority
```

---

## 4. Environment Configuration

### Step 1: Configure .env File

The `.env` file is already created. Update it with your values:

```bash
# Open .env file in text editor
nano .env
# or
code .env
# or
vim .env
```

### Step 2: Update Environment Variables

#### Minimum Required Configuration:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB (choose one)
# Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/power_supply_feedback

# OR MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/power_supply_feedback

# JWT (IMPORTANT: Change this!)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2024
JWT_EXPIRE=7d

# Frontend URL
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

#### Optional Configuration:

```env
# Email (Gmail example)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=Power Supply Support <noreply@powersupply.com>

# SMS (Twilio - optional)
SMS_ENABLED=false
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Admin Credentials
ADMIN_DEFAULT_EMAIL=admin@powersupply.com
ADMIN_DEFAULT_PASSWORD=Admin@123
ADMIN_DEFAULT_NAME=System Administrator
```

### Step 3: Generate Secure JWT Secret

```bash
# Generate random secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Copy the output and use it as JWT_SECRET
```

### Step 4: Setup Email (Optional but Recommended)

#### Gmail Configuration:

1. **Enable 2-Factor Authentication**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification

2. **Generate App Password**
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Other (Custom name)"
   - Enter "Power Supply Backend"
   - Click "Generate"
   - Copy the 16-character password

3. **Update .env**
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # App password
   ```

#### Other Email Services:

For SendGrid, Mailgun, etc., update:
```env
EMAIL_SERVICE=SMTP
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your_api_key
```

---

## 5. Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

You should see:
```
🚀 Starting Power Supply Feedback Management API...

✅ MongoDB Connected: localhost
📊 Database: power_supply_feedback
✅ Default admin user created
📧 Email: admin@powersupply.com
🔐 Password: Admin@123
⚠️  Please change the default password after first login!
✅ Sample power areas initialized

============================================================
⚡ Server running in development mode
🌐 Server URL: http://localhost:5000
📡 API Base: http://localhost:5000/api
🔌 WebSocket: ws://localhost:5000
============================================================

📋 Available Endpoints:
   - Health Check: GET /api/health
   - Login: POST /api/auth/login
   - Create Complaint: POST /api/feedback
   - Track Complaint: GET /api/feedback/:complaintId
   - Dashboard Stats: GET /api/analytics/dashboard
   - Power Areas: GET /api/power/areas

✅ Server is ready to accept connections!
```

### Production Mode

```bash
npm start
```

### Stopping the Server

Press `Ctrl + C` to stop the server gracefully.

---

## 6. Testing the API

### Method 1: Using cURL

#### Test Health Endpoint
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-12-11T10:30:00.000Z",
  "environment": "development"
}
```

#### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@powersupply.com",
    "password": "Admin@123"
  }'
```

Save the token from response!

#### Test Creating Complaint
```bash
curl -X POST http://localhost:5000/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "9876543210",
    "address": "123 Test Street, Mumbai",
    "issueType": "Power Outage",
    "description": "Power outage in my area since morning"
  }'
```

#### Test Dashboard (with token)
```bash
curl http://localhost:5000/api/analytics/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Method 2: Using Postman

1. **Download Postman** from [postman.com](https://www.postman.com/downloads/)

2. **Create New Request Collection**
   - Click "New" → "Collection"
   - Name it "Power Supply API"

3. **Add Requests**

   **Login Request:**
   - Method: POST
   - URL: `http://localhost:5000/api/auth/login`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
   ```json
   {
     "email": "admin@powersupply.com",
     "password": "Admin@123"
   }
   ```
   - Click "Send"
   - Copy the token from response

   **Setup Authorization:**
   - Go to Collection settings
   - Click "Authorization" tab
   - Type: Bearer Token
   - Token: Paste your token

   **Create Complaint:**
   - Method: POST
   - URL: `http://localhost:5000/api/feedback`
   - Body (raw JSON):
   ```json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "phone": "9876543210",
     "address": "456 Main Street, Delhi",
     "issueType": "Voltage Fluctuation",
     "description": "Frequent voltage fluctuations causing appliance damage"
   }
   ```

### Method 3: Using Browser

Open browser and navigate to:
```
http://localhost:5000
```

You'll see API documentation with all available endpoints.

---

## 7. Connecting to Frontend

### Update Frontend API Configuration

In your frontend project, update the API base URL:

```javascript
// frontend/src/config.js (or similar)
export const API_BASE_URL = 'http://localhost:5000/api';
export const SOCKET_URL = 'http://localhost:5000';
```

### CORS Configuration

Make sure CORS is properly configured in backend `.env`:
```env
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

If frontend runs on different port, add it to `ALLOWED_ORIGINS`.

### Test Integration

1. Start backend server: `npm run dev`
2. Start frontend server: `npm run dev`
3. Open frontend in browser
4. Try creating a complaint
5. Check backend logs for API calls

---

## 8. Troubleshooting

### Problem: MongoDB Connection Failed

**Error:**
```
❌ Error connecting to MongoDB: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**

1. **Check if MongoDB is running:**
   ```bash
   # macOS
   brew services list | grep mongodb
   
   # Linux
   sudo systemctl status mongod
   
   # Start MongoDB
   brew services start mongodb-community@6.0  # macOS
   sudo systemctl start mongod  # Linux
   ```

2. **Verify MongoDB URI in .env:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/power_supply_feedback
   ```

3. **Check MongoDB logs:**
   ```bash
   # macOS
   tail -f /usr/local/var/log/mongodb/mongo.log
   
   # Linux
   sudo tail -f /var/log/mongodb/mongod.log
   ```

### Problem: Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**

1. **Find process using port 5000:**
   ```bash
   # macOS/Linux
   lsof -i :5000
   
   # Windows
   netstat -ano | findstr :5000
   ```

2. **Kill the process:**
   ```bash
   # macOS/Linux
   kill -9 PID_NUMBER
   
   # Windows
   taskkill /PID PID_NUMBER /F
   ```

3. **Or change port in .env:**
   ```env
   PORT=5001
   ```

### Problem: JWT Token Invalid

**Error:**
```
{
  "success": false,
  "message": "Invalid token"
}
```

**Solutions:**

1. **Check if token is included in header:**
   ```
   Authorization: Bearer YOUR_TOKEN_HERE
   ```

2. **Verify JWT_SECRET is same:**
   - Don't change JWT_SECRET after generating tokens
   - If changed, login again to get new token

3. **Check token expiration:**
   - Default is 7 days
   - Login again if expired

### Problem: Email Notifications Not Sending

**Error in logs:**
```
⚠️  Email credentials not configured
```

**Solutions:**

1. **Configure email in .env:**
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```

2. **Generate App Password for Gmail:**
   - Enable 2FA first
   - Create app password at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)

3. **Test email sending:**
   - Create a test complaint
   - Check backend logs
   - Check spam folder

### Problem: CORS Error in Frontend

**Error in browser console:**
```
Access to XMLHttpRequest at 'http://localhost:5000/api/...' from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solutions:**

1. **Add frontend URL to .env:**
   ```env
   ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
   ```

2. **Restart backend server** after changing .env

3. **Check frontend is using correct URL:**
   ```javascript
   const API_BASE_URL = 'http://localhost:5000/api';
   ```

### Problem: Dependencies Installation Failed

**Error:**
```
npm ERR! code ENOENT
```

**Solutions:**

1. **Clear npm cache:**
   ```bash
   npm cache clean --force
   ```

2. **Delete node_modules and reinstall:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check Node.js version:**
   ```bash
   node --version  # Should be v18 or higher
   ```

### Problem: Permission Errors

**Error:**
```
Error: EACCES: permission denied
```

**Solutions:**

1. **Don't use sudo with npm:**
   ```bash
   # Instead of: sudo npm install
   # Use: npm install
   ```

2. **Fix npm permissions:**
   ```bash
   # Create directory for global packages
   mkdir ~/.npm-global
   npm config set prefix '~/.npm-global'
   
   # Add to PATH
   echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
   source ~/.bashrc
   ```

### Problem: Default Admin Not Created

**Solution:**

Manually create admin user:

```bash
# Connect to MongoDB
mongosh power_supply_feedback

# Create admin user
db.users.insertOne({
  name: "Admin User",
  email: "admin@powersupply.com",
  password: "$2a$10$XYZ...",  // Hashed password
  role: "admin",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

Or restart the server - it will try to create admin on startup.

---

## ✅ Verification Checklist

Before proceeding, verify:

- [ ] Node.js v18+ installed
- [ ] MongoDB running (local or Atlas)
- [ ] All dependencies installed (`npm install`)
- [ ] .env file configured
- [ ] Server starts without errors
- [ ] Health endpoint responds: `http://localhost:5000/api/health`
- [ ] Can login with default credentials
- [ ] Can create a test complaint
- [ ] Frontend can connect to backend
- [ ] No CORS errors in browser console

---

## 🎯 Next Steps

1. **Change Default Admin Password**
   ```bash
   curl -X POST http://localhost:5000/api/auth/change-password \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "currentPassword": "Admin@123",
       "newPassword": "NewSecurePassword123"
     }'
   ```

2. **Create Additional Users**
   - Register technician/manager accounts
   - Assign appropriate roles

3. **Configure Email Notifications**
   - Set up email service
   - Test notification sending

4. **Customize Configuration**
   - Adjust rate limits
   - Configure file uploads
   - Set custom JWT expiration

5. **Deploy to Production**
   - Use MongoDB Atlas
   - Deploy to Heroku/AWS/DigitalOcean
   - Configure production environment variables
   - Enable HTTPS
   - Set NODE_ENV=production

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Guide](https://mongoosejs.com/docs/guide.html)
- [JWT Introduction](https://jwt.io/introduction)
- [Socket.IO Documentation](https://socket.io/docs/v4/)

---

## 🤝 Need Help?

If you encounter issues not covered here:

1. Check server logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure all services (MongoDB, etc.) are running
4. Test each endpoint individually
5. Check network connectivity

---

**Setup Complete! Your backend is ready to use! ⚡**
