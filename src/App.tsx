import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { SubmitReviewEnhanced } from './components/SubmitReviewEnhanced';
import { TrackStatus } from './components/TrackStatus';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { ProtectedRoute } from './components/ProtectedRoute';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    setIsAuthenticated(!!(token && user));

    // Simulate initial loading
    setTimeout(() => setLoading(false), 1500);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity }
            }}
            className="w-20 h-20 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4 shadow-lg shadow-pink-500/50"
          />
          <motion.h2
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-2xl text-green-400"
          >
            Loading PowerSupply...
          </motion.h2>
        </motion.div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black">
        {/* Only show Navbar if not on welcome/login/register pages */}
        {!window.location.pathname.match(/\/(welcome|login|register)/i) && <Navbar />}
        
        <AnimatePresence mode="wait">
          <Routes>
            {/* Landing/Welcome Page - First page users see */}
            <Route 
              path="/welcome" 
              element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />
              } 
            />
            
            {/* Auth Pages */}
            <Route 
              path="/login" 
              element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
              } 
            />
            <Route 
              path="/register" 
              element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
              } 
            />

            {/* Protected Routes - Require Authentication */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/submit-review" 
              element={
                <ProtectedRoute>
                  <SubmitReviewEnhanced />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/track-status" 
              element={
                <ProtectedRoute>
                  <TrackStatus />
                </ProtectedRoute>
              } 
            />

            {/* Default Route - Always redirect to welcome page */}
            <Route
              path="/"
              element={<Navigate to="/welcome" replace />}
            />

            {/* Catch all - redirect to welcome or dashboard */}
            <Route 
              path="*" 
              element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/welcome" replace />
              } 
            />
          </Routes>
        </AnimatePresence>

        {/* Only show Footer if not on welcome/login/register pages */}
        {!window.location.pathname.match(/\/(welcome|login|register)/i) && <Footer />}
        <Toaster />
      </div>
    </Router>
  );
}
