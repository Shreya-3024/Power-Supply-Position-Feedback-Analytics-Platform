# Power Supply Feedback Management System - Backend API

A comprehensive Node.js/Express/MongoDB backend API for managing power supply complaints and feedback with real-time updates using Socket.IO.

## 🚀 Features

- **RESTful API** with comprehensive endpoints for complaints, analytics, and power grid management
- **JWT Authentication** for secure admin access
- **Real-time Updates** using Socket.IO for live complaint tracking and dashboard updates
- **MongoDB Database** with Mongoose ODM for robust data management
- **Email & SMS Notifications** for complaint confirmations and status updates
- **Advanced Analytics** including trends, distributions, and statistics
- **Power Grid Simulation** for testing and demonstration purposes
- **Rate Limiting & Security** with Helmet, CORS, and express-rate-limit
- **Input Validation** using express-validator
- **Error Handling** with comprehensive middleware

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn package manager

## 🛠️ Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy the `.env` file and update the values:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/power_supply_feedback
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/power_supply_feedback

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2024
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Email Configuration (Gmail example)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=Power Supply Support <noreply@powersupply.com>

# Admin Default Credentials
ADMIN_DEFAULT_EMAIL=admin@powersupply.com
ADMIN_DEFAULT_PASSWORD=Admin@123
ADMIN_DEFAULT_NAME=System Administrator
```

### 3. Setup MongoDB

#### Local MongoDB:
```bash
# Install MongoDB Community Edition
# Start MongoDB service
mongod --dbpath /path/to/data/directory
```

#### MongoDB Atlas (Cloud):
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string and update `MONGODB_URI` in `.env`

### 4. Email Configuration (Optional)

For Gmail:
1. Enable 2-Factor Authentication
2. Generate App Password: [Google Account Security](https://myaccount.google.com/security)
3. Use app password in `EMAIL_PASSWORD`

## 🚀 Running the Server

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will start on `http://localhost:5000` (or your configured PORT)

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
Most admin routes require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "phone": "9876543210"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@powersupply.com",
  "password": "Admin@123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "...",
      "name": "System Administrator",
      "email": "admin@powersupply.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Get Current User Profile
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Update Profile
```http
PATCH /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "phone": "9999999999"
}
```

### Change Password
```http
POST /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123"
}
```

---

## 📝 Complaint/Feedback Endpoints

### Create Complaint (Public)
```http
POST /api/feedback
Content-Type: application/json

{
  "name": "Rajesh Kumar",
  "email": "rajesh@example.com",
  "phone": "9876543210",
  "address": "123 Main Street, Andheri, Mumbai - 400001",
  "issueType": "Power Outage",
  "priority": "High",
  "description": "Complete power outage in my area since 2 hours",
  "location": {
    "area": "Andheri",
    "district": "Mumbai",
    "pincode": "400001"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Complaint registered successfully",
  "data": {
    "_id": "...",
    "complaintId": "PS2412001",
    "name": "Rajesh Kumar",
    "status": "Pending",
    "createdAt": "2024-12-11T10:30:00.000Z"
  }
}
```

### Get Complaint by ID (Public)
```http
GET /api/feedback/PS2412001
```

### Track Complaints by Phone (Public)
```http
GET /api/feedback/phone/9876543210
```

### Get All Complaints (Admin)
```http
GET /api/feedback?page=1&limit=20&status=Pending&priority=High
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `status` - Filter by status (Pending, In Progress, Resolved, Rejected)
- `priority` - Filter by priority (Low, Medium, High)
- `issueType` - Filter by issue type
- `search` - Search by complaint ID, name, phone, email
- `startDate` - Filter complaints after this date
- `endDate` - Filter complaints before this date
- `sortBy` - Sort field (default: -createdAt)

### Update Complaint Status (Admin)
```http
PATCH /api/feedback/PS2412001
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "In Progress",
  "priority": "High",
  "assignedTo": "user_id_here",
  "note": "Team dispatched to location",
  "resolution": "Repairing main transformer"
}
```

### Delete Complaint (Admin)
```http
DELETE /api/feedback/PS2412001
Authorization: Bearer <token>
```

---

## 📊 Analytics Endpoints

### Dashboard Statistics
```http
GET /api/analytics/dashboard
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 150,
    "pending": 25,
    "inProgress": 40,
    "resolved": 80,
    "rejected": 5,
    "highPriority": 15,
    "today": 8,
    "resolutionRate": 53.33,
    "avgResolutionTime": 18
  }
}
```

### Complaints by Issue Type
```http
GET /api/analytics/issue-types
Authorization: Bearer <token>
```

### Complaints by Priority
```http
GET /api/analytics/priorities
Authorization: Bearer <token>
```

### Complaints by Status
```http
GET /api/analytics/statuses
Authorization: Bearer <token>
```

### Complaints Trend
```http
GET /api/analytics/trend?days=30
Authorization: Bearer <token>
```

### Top Areas by Complaints
```http
GET /api/analytics/top-areas?limit=10
Authorization: Bearer <token>
```

### Advanced Analytics (All-in-One)
```http
GET /api/analytics/advanced
Authorization: Bearer <token>
```

---

## ⚡ Power Supply Area Endpoints

### Get All Power Areas (Public)
```http
GET /api/power/areas
```

### Get Power Area by Code (Public)
```http
GET /api/power/areas/MUM01
```

### Power Grid Overview (Public)
```http
GET /api/power/overview
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalAreas": 10,
    "onlineAreas": 8,
    "offlineAreas": 1,
    "maintenanceAreas": 1,
    "criticalAreas": 0,
    "totalCapacity": 50000,
    "totalLoad": 35000,
    "loadPercentage": 70,
    "totalAffectedHouseholds": 150000,
    "totalActiveComplaints": 25,
    "avgVoltage": 230
  }
}
```

### Create Power Area (Admin)
```http
POST /api/power/areas
Authorization: Bearer <token>
Content-Type: application/json

{
  "areaCode": "MUM01",
  "areaName": "Andheri",
  "district": "Mumbai",
  "substationName": "Andheri Substation",
  "capacity": 5000,
  "currentLoad": 3500,
  "voltage": 230,
  "affectedHouseholds": 15000
}
```

### Update Power Area (Admin)
```http
PATCH /api/power/areas/MUM01
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentLoad": 4000,
  "voltage": 228,
  "status": "Online"
}
```

### Delete Power Area (Admin)
```http
DELETE /api/power/areas/MUM01
Authorization: Bearer <token>
```

### Simulate Power Load (Admin)
```http
POST /api/power/simulate/MUM01
Authorization: Bearer <token>
```

### Simulate Outage (Admin)
```http
POST /api/power/outage/MUM01
Authorization: Bearer <token>
Content-Type: application/json

{
  "duration": 30
}
```
*Duration in minutes*

---

## 👥 User Management Endpoints (Admin)

### Get All Users
```http
GET /api/users?page=1&limit=20&role=admin&search=john
Authorization: Bearer <token>
```

### Get User by ID
```http
GET /api/users/:userId
Authorization: Bearer <token>
```

### Update User
```http
PATCH /api/users/:userId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "role": "technician",
  "isActive": true
}
```

### Delete User
```http
DELETE /api/users/:userId
Authorization: Bearer <token>
```

---

## 🔌 WebSocket Events

### Client Connection
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: {
    token: 'your_jwt_token' // Optional for authenticated features
  }
});
```

### Track Specific Complaint
```javascript
// Join complaint tracking
socket.emit('track-complaint', 'PS2412001');

// Listen for updates
socket.on('complaint-updated', (data) => {
  console.log('Complaint updated:', data);
  // { complaintId, status, priority, ... }
});

// Stop tracking
socket.emit('untrack-complaint', 'PS2412001');
```

### Admin Dashboard Updates
```javascript
// Join dashboard (requires authentication)
socket.emit('join-dashboard');

// Listen for new complaints
socket.on('new-complaint', (data) => {
  console.log('New complaint:', data.complaint);
});

// Listen for dashboard stats updates
socket.on('dashboard-update', (data) => {
  console.log('Dashboard stats:', data.stats);
});
```

### Power Grid Monitoring
```javascript
// Join power grid monitoring
socket.emit('join-power-grid');

// Listen for grid updates
socket.on('power-grid-update', (data) => {
  console.log('Power grid update:', data);
  // { areaCode, currentLoad, voltage, status, ... }
});

// Listen for outage alerts
socket.on('power-outage-alert', (data) => {
  console.log('Power outage:', data);
});

// Leave monitoring
socket.emit('leave-power-grid');
```

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config.js              # Database, CORS, environment config
│   ├── controllers/
│   │   ├── apiController.js   # Feedback & analytics controllers
│   │   └── userController.js  # User & auth controllers
│   ├── models/
│   │   └── index.js           # Mongoose models (all)
│   ├── routes/
│   │   └── api.js             # All API routes
│   ├── services/
│   │   ├── dataService.js     # Feedback & analytics logic
│   │   └── simulationService.js # Power grid & notifications
│   ├── middleware.js          # Auth, validation, error handling
│   ├── utils.js               # Helper functions & constants
│   ├── socket.js              # WebSocket configuration
│   └── server.js              # Main server file
├── .env                       # Environment variables
├── package.json
└── README.md
```

---

## 🗄️ Database Models

### Feedback/Complaint Model
- complaintId (auto-generated)
- name, email, phone, address
- issueType, priority, status
- description, images
- assignedTo, resolution, resolvedAt
- location (area, district, pincode, coordinates)
- internalNotes (array)
- timestamps

### User Model
- name, email, password (hashed)
- role (admin, technician, manager, user)
- phone, isActive, lastLogin
- assignedComplaints (array)
- permissions (object)
- timestamps

### PowerSupplyArea Model
- areaCode, areaName, district
- substationName, capacity, currentLoad
- voltage, status
- affectedHouseholds, activeComplaints
- lastMaintenance, nextScheduledMaintenance
- coordinates, contactPerson
- timestamps

### Notification Model
- recipient (email, phone)
- type (email, sms, both)
- subject, message
- relatedComplaint, status
- sentAt, errorMessage
- timestamps

---

## 🔧 Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/power_supply_feedback |
| `JWT_SECRET` | Secret key for JWT | (required) |
| `JWT_EXPIRE` | JWT expiration time | 7d |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5173 |
| `EMAIL_SERVICE` | Email service provider | gmail |
| `EMAIL_USER` | Email account | (optional) |
| `EMAIL_PASSWORD` | Email password | (optional) |
| `ADMIN_DEFAULT_EMAIL` | Default admin email | admin@powersupply.com |
| `ADMIN_DEFAULT_PASSWORD` | Default admin password | Admin@123 |

---

## 🧪 Testing the API

### Using cURL

```bash
# Health check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@powersupply.com","password":"Admin@123"}'

# Create complaint
curl -X POST http://localhost:5000/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "9876543210",
    "address": "123 Test Street",
    "issueType": "Power Outage",
    "description": "Power outage in my area"
  }'
```

### Using Postman
1. Import the API endpoints
2. Set Authorization header with JWT token
3. Test all endpoints

---

## 🚨 Error Handling

All API errors return consistent format:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": ["Optional array of error details"],
  "timestamp": "2024-12-11T10:30:00.000Z"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `500` - Internal Server Error

---

## 🔒 Security Features

- **JWT Authentication** with token expiration
- **Password Hashing** using bcryptjs
- **Rate Limiting** to prevent abuse
- **Helmet** for secure HTTP headers
- **CORS** configuration
- **Input Validation** and sanitization
- **SQL Injection Protection** via Mongoose
- **XSS Protection** through input sanitization

---

## 📧 Notifications

### Email Notifications
- Complaint registration confirmation
- Status update notifications
- Resolution notifications

### SMS Notifications (Optional)
- Configure Twilio credentials in `.env`
- Enable SMS with `SMS_ENABLED=true`

---

## 🎯 Next Steps

1. **Connect Frontend**: Update API base URL in frontend
2. **Configure Email**: Set up email service for notifications
3. **Deploy**: Deploy to production server
4. **Monitor**: Set up logging and monitoring
5. **Scale**: Add Redis for caching and session management

---

## 🤝 Support

For issues or questions:
1. Check the logs: `console` output shows detailed info
2. Verify `.env` configuration
3. Ensure MongoDB is running
4. Check network connectivity

---

## 📝 License

ISC License - Free to use and modify

---

## 👨‍💻 Developer Notes

- Default admin credentials are created on first run
- Sample power areas are initialized automatically
- WebSocket connections support anonymous users
- All timestamps are in ISO 8601 format
- Pagination is available on list endpoints
- Soft delete can be implemented if needed

---

**Happy Coding! ⚡**
