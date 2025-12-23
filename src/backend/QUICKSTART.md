# ⚡ Quick Start Guide - PowerSupply MongoDB Backend

Get your PowerSupply backend up and running in 5 minutes!

---

## 🚀 Quick Setup (5 Steps)

### **Step 1: Install MongoDB**

**Choose ONE option:**

**Option A: Local MongoDB (Recommended for Development)**
- Download from: https://www.mongodb.com/try/download/community
- Install and start the service

**Option B: MongoDB Atlas (Cloud - Free Tier)**
- Sign up at: https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get your connection string

---

### **Step 2: Install Dependencies**

```bash
cd backend
npm install
```

---

### **Step 3: Configure Environment**

Create `.env` file in the `backend` folder:

**For Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/powersupply
PORT=5000
NODE_ENV=development
JWT_SECRET=my_super_secret_key_12345
FRONTEND_URL=http://localhost:5173
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/powersupply?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
JWT_SECRET=my_super_secret_key_12345
FRONTEND_URL=http://localhost:5173
```

Replace `username:password@cluster` with your actual credentials!

---

### **Step 4: Seed Sample Data (Optional but Recommended)**

```bash
npm run seed
```

This will create:
- ✅ 6 Power Supply Units
- ✅ 3 Users (including 1 admin)
- ✅ 12-18 Reviews
- ✅ 20 Monitoring Records

---

### **Step 5: Start the Server**

```bash
npm run dev
```

You should see:
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
```

---

## ✅ Test Your API

Open your browser or use curl:

### **1. Health Check**
```
http://localhost:5000/health
```

### **2. Get Power Supplies**
```
http://localhost:5000/api/power-supplies
```

### **3. Get Real-Time Monitoring**
```
http://localhost:5000/api/monitoring/realtime
```

### **4. Get Top Rated PSUs**
```
http://localhost:5000/api/power-supplies/top/rated
```

---

## 🎯 Sample Login Credentials

After running `npm run seed`:

**User Account:**
- Email: `john@example.com`
- Password: `password123`

**Admin Account:**
- Email: `admin@powersupply.com`
- Password: `admin123`

---

## 📚 Full Documentation

For detailed setup instructions, see:
- [MONGODB_SETUP.md](./MONGODB_SETUP.md) - Complete MongoDB setup guide
- [README.md](./README.md) - API documentation

---

## 🐛 Troubleshooting

### **"Cannot connect to MongoDB"**
- Make sure MongoDB service is running
- Check your connection string in .env
- For Atlas: Verify IP whitelist

### **"Port 5000 already in use"**
- Change PORT in .env to another port
- Or stop the process using port 5000

### **"Module not found"**
- Run `npm install` again
- Make sure you're in the `backend` folder

---

## 🎉 You're All Set!

Your PowerSupply backend is now running with MongoDB! 

Next steps:
1. ✅ Connect your frontend to `http://localhost:5000`
2. ✅ Test the API endpoints
3. ✅ Build amazing features!

**Happy Coding! ⚡🔋**
