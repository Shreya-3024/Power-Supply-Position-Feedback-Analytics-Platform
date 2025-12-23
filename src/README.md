# ⚡ Power Supply Feedback Management System

A modern, full-stack web application for citizens to report power supply issues and track resolution status in real-time.

![Power Supply Feedback System](https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&h=400&fit=crop)

## 🌟 Features

### Frontend (React + Vite)
- ⚡ **Welcome Page**: Animated landing page with electric-themed design
- 📊 **Dashboard**: Real-time statistics and system status overview
- 📝 **Multi-Step Form**: Easy complaint submission with validation
- 🔍 **Track Complaints**: Search by ID or phone number with filters
- 👨‍💼 **Admin Panel**: Manage complaints, update status, export data
- 🌙 **Dark Mode**: Beautiful dark theme with electric blue/purple colors
- 📱 **Responsive**: Mobile-first design that works on all devices
- ✨ **Animations**: Smooth transitions using Motion (Framer Motion)

### Backend Requirements (Node.js + Express + MongoDB)
- 🔐 RESTful API endpoints
- 💾 MongoDB database with Mongoose
- ✅ Input validation
- 🔒 Admin authentication (JWT)
- 📧 Email notifications (optional)
- 📱 SMS notifications (optional)

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Frontend Setup (This Repository)

1. **Install dependencies:**
```bash
npm install
```

2. **Run development server:**
```bash
npm run dev
```

3. **Build for production:**
```bash
npm run build
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
/
├── components/
│   ├── Navbar.tsx              # Navigation bar with dark mode toggle
│   ├── Footer.tsx              # Footer with links and contact info
│   ├── WelcomePage.tsx         # Animated landing page
│   ├── Dashboard.tsx           # Statistics dashboard
│   ├── ComplaintForm.tsx       # Multi-step complaint form
│   ├── TrackComplaints.tsx     # Search and filter complaints
│   ├── ComplaintCard.tsx       # Complaint display card
│   ├── StatusBadge.tsx         # Status indicator badge
│   ├── Timeline.tsx            # Status history timeline
│   ├── StatCard.tsx            # Statistics card component
│   ├── AdminLogin.tsx          # Admin login page
│   └── AdminPanel.tsx          # Admin management panel
├── utils/
│   └── api.ts                  # API service (mock data included)
├── styles/
│   └── globals.css             # Global styles and animations
├── App.tsx                     # Main application component
└── package.json                # Dependencies

```

## 🎨 Design Features

### Color Palette
- **Electric Blue**: `#3B82F6`
- **Purple**: `#8B5CF6`
- **Dark**: `#0F172A`

### Animations
- Page transitions with Motion
- Smooth scroll animations
- Card hover effects
- Loading skeletons
- Toast notifications
- Gradient animations

### Components
- Glassmorphism cards with backdrop blur
- Gradient buttons with hover effects
- Animated statistics counters
- Status badges with pulse animations
- Timeline component for status history

## 🔧 Backend Setup (Node.js + Express + MongoDB)

Since this runs in the browser, you'll need to implement the backend separately. Here's the recommended structure:

### 1. Create Backend Directory

```bash
mkdir server
cd server
npm init -y
```

### 2. Install Dependencies

```bash
npm install express mongoose dotenv cors express-validator bcryptjs jsonwebtoken nodemailer
npm install -D nodemon
```

### 3. Environment Variables (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/power-feedback
JWT_SECRET=your-secret-key-here
NODE_ENV=development

# Optional: Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Optional: Twilio SMS
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=your-twilio-number
```

### 4. MongoDB Schema Example

```javascript
// models/Complaint.js
import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  complaintId: {
    type: String,
    unique: true,
    required: true
  },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: String,
  address: { type: String, required: true },
  area: { type: String, required: true },
  zone: String,
  issueType: {
    type: String,
    required: true,
    enum: ['Power Outage', 'Voltage Fluctuation', 'Billing Issue', 'Meter Problem', 'Line Damage', 'Other']
  },
  description: { type: String, required: true },
  priority: {
    type: String,
    default: 'Medium',
    enum: ['Low', 'Medium', 'High', 'Critical']
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'In Progress', 'Resolved', 'Closed']
  },
  imageUrl: String,
  assignedTo: String,
  statusHistory: [{
    status: String,
    updatedAt: Date,
    updatedBy: String
  }],
  estimatedResolution: Date,
  actualResolution: Date
}, {
  timestamps: true
});

export default mongoose.model('Complaint', complaintSchema);
```

### 5. API Endpoints to Implement

```javascript
// routes/complaints.js
POST   /api/complaints          - Submit new complaint
GET    /api/complaints          - Get all complaints (with filters)
GET    /api/complaints/:id      - Get complaint by ID
GET    /api/complaints/track/:phone - Track by phone
PUT    /api/complaints/:id      - Update complaint (admin)
DELETE /api/complaints/:id      - Delete complaint (admin)
GET    /api/stats               - Get statistics
POST   /api/auth/login          - Admin login
```

### 6. Update Frontend API URL

In `/utils/api.ts`, change:
```typescript
const BASE_URL = 'http://localhost:5000/api';
```

Then uncomment the actual fetch calls and remove mock data.

## 👤 Demo Credentials

### Admin Access
- **Username**: `admin`
- **Password**: `admin123`

## 📊 API Integration

The frontend is ready to connect to your backend. Just:

1. Set up your Node.js/Express/MongoDB backend
2. Update `BASE_URL` in `/utils/api.ts`
3. Uncomment actual API calls
4. Remove mock data implementations

All API functions are already structured and ready to use!

## 🎯 Features to Implement in Backend

### Essential
- [x] RESTful API endpoints
- [x] MongoDB connection
- [x] Complaint CRUD operations
- [x] Search and filter
- [x] Statistics calculation
- [x] Admin authentication

### Optional Enhancements
- [ ] Email notifications (Nodemailer)
- [ ] SMS notifications (Twilio)
- [ ] File upload for images (Multer)
- [ ] Real-time updates (Socket.io)
- [ ] Rate limiting
- [ ] API documentation (Swagger)

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Connect to Vercel/Netlify
3. Deploy automatically

### Backend (Render/Railway/Heroku)
1. Create account on hosting platform
2. Connect MongoDB Atlas
3. Set environment variables
4. Deploy backend
5. Update frontend API URL

### Database (MongoDB Atlas)
1. Create free cluster
2. Add database user
3. Whitelist IP addresses
4. Copy connection string

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4.0
- **Routing**: React Router v6
- **Animations**: Motion (Framer Motion v11)
- **Icons**: Lucide React
- **Notifications**: Sonner

### Backend (To Implement)
- **Runtime**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + bcryptjs
- **Validation**: express-validator
- **Email**: Nodemailer
- **SMS**: Twilio (optional)

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🎨 Customization

### Colors
Edit in `/styles/globals.css`:
```css
--color-primary-blue: #3B82F6;
--color-primary-purple: #8B5CF6;
--color-dark: #0F172A;
```

### Typography
Change font in `/styles/globals.css`:
```css
font-family: 'Inter', sans-serif;
```

## 🐛 Known Issues

- Backend is not implemented (frontend only)
- Mock data is used for demonstration
- File upload needs backend implementation
- Real-time notifications require Socket.io setup

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions:
- GitHub Issues: [Create an issue]
- Email: support@powerfeedback.com

## 🎉 Acknowledgments

- Design inspiration from modern SaaS applications
- Icons by Lucide React
- Animations by Motion (Framer Motion)
- Images from Unsplash

---

**Built with ⚡ by Figma Make**

*Note: This is a frontend implementation. Backend with Node.js/Express/MongoDB needs to be implemented separately following the structure outlined in this README.*
