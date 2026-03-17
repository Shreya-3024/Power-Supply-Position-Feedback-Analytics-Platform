# Power Supply Position Feedback Analytics Platform

A comprehensive full-stack web application designed for users to report power supply issues and track resolution statuses in real-time, complete with an administrative dashboard for managing feedback.

## Features

- **User Reporting Form**: Submit detailed forms for power supply positioning and issues.
- **Track Complaints**: Search by ID or phone number with filters.
- **Admin Dashboard**: Secure panel to manage complaints, update statuses, and view analytics.
- **Dark Mode**: Electric-themed UI with dark mode support.
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop devices.
- **Real-Time Data**: Fast, RESTful endpoints connecting to a MongoDB database.

## Tech Stack

**Frontend:**
- React 18 / Vite
- Tailwind CSS 4
- Framer Motion (Animations)
- Lucide React (Icons)
- React Router DOM

**Backend:**
- Node.js / Express
- MongoDB (Mongoose)
- JWT (JSON Web Tokens for Authentication)
- bcryptjs (Password Hashing)

## Prerequisites

Before running the project locally, ensure you have the following installed:
- Node.js (v18 or higher recommended)
- MongoDB Server (or a MongoDB Atlas connection string)
- npm or yarn

## Installation & Setup

### 1. Backend Setup

The backend servers the API needed by the frontend application.

```bash
# Navigate to the backend directory
cd src/backend

# Install dependencies
npm install

# Make sure you have a .env file containing the required variables:
# PORT=5001
# MONGODB_URI=mongodb://localhost:27017/power-feedback (or your Atlas string)
# JWT_SECRET=your_super_secret_key

# Start the backend server (starts on http://localhost:5001 by default)
npm start
# OR for development with auto-restart:
npm run dev
```

### 2. Frontend Setup

The frontend is a Vite-powered React application.

```bash
# Navigate to the root directory of the project
cd .. 
# (assuming you are in the backend directory, or simply start from the root)

# Install dependencies
npm install

# Ensure your connection to the backend is configured securely
# Usually controlled via environment variables like VITE_API_URL or statically in API utilities.

# Start the frontend development server
npm run dev
```

The application will be available at `http://localhost:5173`.

## Folder Structure

```
/
├── .git                      # Git repository data
├── build/                    # Compiled frontend output (when built)
├── node_modules/             # Frontend dependencies
├── src/                      # Frontend and Backend source code
│   ├── backend/              # Node.js backend application
│   │   ├── controllers/      # Route controllers (API logic)
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # Express routes
│   │   └── server.js         # Backend entry point
│   ├── components/           # React UI components (Navbar, Admin, Forms, etc.)
│   ├── styles/               # CSS and Tailwind properties
│   ├── utils/                # Helper files and Frontend API clients
│   └── App.jsx               # Main React Application
├── index.html                # Frontend HTML entry point
├── package.json              # Frontend scripts and dependencies
├── postcss.config.js         # PostCSS configuration
├── tailwind.config.js        # Tailwind configuration
└── vite.config.ts            # Vite configuration
```

## Production Build

To prepare the frontend for production deployment:
```bash
# At the root directory
npm run build
```
The output will be generated in the `build/` (or `dist/`) directory. This folder can be served by Nginx, Vercel, Netlify, or your preferred static hosting platform.