# 🔌 MongoDB Setup Guide for PowerSupply Project

This guide will help you connect MongoDB to your PowerSupply project.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Option 1: Local MongoDB](#option-1-local-mongodb)
3. [Option 2: MongoDB Atlas (Cloud)](#option-2-mongodb-atlas-cloud)
4. [Environment Setup](#environment-setup)
5. [Installation](#installation)
6. [Running the Server](#running-the-server)
7. [Testing the API](#testing-the-api)
8. [Seed Sample Data](#seed-sample-data)

---

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local) OR MongoDB Atlas account (cloud)

---

## Option 1: Local MongoDB

### **Step 1: Install MongoDB**

#### **Windows:**
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Complete" installation
4. Install MongoDB as a service
5. MongoDB will start automatically

#### **Mac:**
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community@7.0

# Start MongoDB
brew services start mongodb-community@7.0
```

#### **Linux (Ubuntu/Debian):**
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### **Step 2: Verify Installation**
```bash
# Check if MongoDB is running
mongosh

# You should see MongoDB shell prompt
# Type 'exit' to quit
```

### **Step 3: Connection String**
```
mongodb://localhost:27017/powersupply
```

---

## Option 2: MongoDB Atlas (Cloud)

### **Step 1: Create MongoDB Atlas Account**
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Sign up with email or Google/GitHub

### **Step 2: Create a Cluster**
1. After login, click "Build a Database"
2. Choose **FREE** tier (M0 Sandbox)
3. Select a cloud provider and region (closest to you)
4. Name your cluster (e.g., "PowerSupply")
5. Click "Create"

### **Step 3: Create Database User**
1. Click "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `powersupply_user`
5. Password: Generate a secure password (save it!)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### **Step 4: Whitelist IP Address**
1. Click "Network Access" in left sidebar
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add your specific IP
5. Click "Confirm"

### **Step 5: Get Connection String**
1. Click "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Driver: Node.js, Version: 5.5 or later
5. Copy the connection string:
```
mongodb+srv://powersupply_user:<password>@cluster0.xxxxx.mongodb.net/powersupply?retryWrites=true&w=majority
```
6. Replace `<password>` with your actual password
7. Replace `cluster0.xxxxx` with your actual cluster name

---

## Environment Setup

### **Step 1: Navigate to Backend Directory**
```bash
cd backend
```

### **Step 2: Create .env File**
```bash
# Copy example file
cp .env.example .env
```

### **Step 3: Edit .env File**

**For Local MongoDB:**
```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/powersupply

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**For MongoDB Atlas (Cloud):**
```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://powersupply_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/powersupply?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**⚠️ IMPORTANT:** Replace `YOUR_PASSWORD` with your actual MongoDB Atlas password!

---

## Installation

### **Step 1: Install Dependencies**
```bash
cd backend
npm install
```

This will install:
- express
- mongoose
- cors
- dotenv
- bcryptjs
- jsonwebtoken
- helmet
- express-rate-limit
- compression
- morgan
- And more...

---

## Running the Server

### **Development Mode (with auto-reload):**
```bash
npm run dev
```

### **Production Mode:**
```bash
npm start
```

### **Expected Output:**
```
==================================================
⚡ PowerSupply API Server
==================================================
🚀 Server running on port 5000
🌍 Environment: development
📡 API URL: http://localhost:5000
💚 Health Check: http://localhost:5000/health
==================================================

✅ MongoDB Connected: localhost
📊 Database: powersupply
✅ Mongoose connected to MongoDB
```

---

## Testing the API

### **1. Health Check**
```bash
curl http://localhost:5000/health
```

Expected Response:
```json
{
  "status": "success",
  "message": "PowerSupply API is running",
  "timestamp": "2024-12-14T10:30:00.000Z",
  "environment": "development"
}
```

### **2. Get All Power Supplies**
```bash
curl http://localhost:5000/api/power-supplies
```

### **3. Create a Power Supply**
```bash
curl -X POST http://localhost:5000/api/power-supplies \
  -H "Content-Type: application/json" \
  -d '{
    "brand": "Corsair",
    "model": "RM850x",
    "wattage": 850,
    "efficiency": "80+ Gold",
    "modular": "Fully Modular",
    "price": 139.99,
    "position": "Excellent"
  }'
```

### **4. Get Monitoring Data**
```bash
curl http://localhost:5000/api/monitoring/latest
```

### **5. Create Monitoring Record**
```bash
curl -X POST http://localhost:5000/api/monitoring \
  -H "Content-Type: application/json" \
  -d '{
    "powerDraw": 834.1,
    "voltage": 12.0,
    "current": 69.5,
    "temperature": 45.2,
    "efficiency": 92.5
  }'
```

---

## Seed Sample Data

### **Option 1: Using the Seed Script**

Create `backend/src/scripts/seedData.js`:
```bash
npm run seed
```

### **Option 2: Manual Seeding via API**

Use the seed script provided below or use Postman/Thunder Client to send POST requests.

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/
│   │   ├── PowerSupply.js       # PSU model
│   │   ├── Review.js            # Review model
│   │   ├── Monitoring.js        # Monitoring model
│   │   └── User.js              # User model
│   ├── routes/
│   │   ├── powerSupplyRoutes.js # PSU endpoints
│   │   ├── reviewRoutes.js      # Review endpoints
│   │   ├── monitoringRoutes.js  # Monitoring endpoints
│   │   └── userRoutes.js        # User endpoints
│   └── server.js                # Main server file
├── .env                         # Environment variables (create this!)
├── .env.example                 # Example env file
└── package.json
```

---

## 🔗 API Endpoints

### **Power Supplies**
- `GET /api/power-supplies` - Get all PSUs
- `GET /api/power-supplies/:id` - Get single PSU
- `POST /api/power-supplies` - Create PSU
- `PUT /api/power-supplies/:id` - Update PSU
- `DELETE /api/power-supplies/:id` - Delete PSU
- `GET /api/power-supplies/top/rated` - Get top rated PSUs
- `GET /api/power-supplies/stats/overview` - Get statistics

### **Reviews**
- `GET /api/reviews` - Get all reviews
- `GET /api/reviews/:id` - Get single review
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `PATCH /api/reviews/:id/status` - Approve/reject review
- `POST /api/reviews/:id/helpful` - Mark helpful

### **Monitoring**
- `GET /api/monitoring` - Get monitoring data
- `GET /api/monitoring/latest` - Get latest readings
- `GET /api/monitoring/realtime` - Get real-time data
- `GET /api/monitoring/stats` - Get statistics
- `POST /api/monitoring` - Create monitoring record
- `POST /api/monitoring/bulk` - Bulk create records
- `GET /api/monitoring/alerts` - Get alerts

### **Users**
- `POST /api/users/register` - Register user
- `POST /api/users/login` - Login user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

---

## 🐛 Troubleshooting

### **Error: "MongoServerError: Authentication failed"**
- Check your username and password in .env
- Make sure you replaced `<password>` with actual password
- No special characters in password? Try URL encoding them

### **Error: "MongooseError: Cannot connect to MongoDB"**
- Check if MongoDB service is running
- Verify connection string in .env
- For Atlas: Check Network Access whitelist

### **Error: "Port 5000 already in use"**
- Change PORT in .env to another port (e.g., 5001)
- Or kill process using port 5000

### **Error: "Module not found"**
- Run `npm install` again
- Delete node_modules and run `npm install`

---

## 🎉 Success!

If you see this message, you're all set:
```
✅ MongoDB Connected: localhost
📊 Database: powersupply
```

Your backend is now connected to MongoDB and ready to use!

---

## 📚 Next Steps

1. ✅ Connect frontend to backend API
2. ✅ Create seed data script
3. ✅ Test all endpoints
4. ✅ Build authentication system
5. ✅ Deploy to production

---

## 🔒 Security Notes

- **NEVER** commit .env file to Git
- Change JWT_SECRET before production
- Use strong passwords
- Enable MongoDB authentication in production
- Use HTTPS in production
- Implement rate limiting (already included!)
- Validate all user inputs

---

## 📞 Need Help?

- MongoDB Docs: https://www.mongodb.com/docs/
- Mongoose Docs: https://mongoosejs.com/docs/
- Express Docs: https://expressjs.com/

---

**Happy Coding! ⚡🔋**
