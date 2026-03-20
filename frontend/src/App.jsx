import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { SubmitReviewEnhanced } from './components/SubmitReviewEnhanced';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import FeedbackForm from './components/FeedbackForm';
import AdminDashboard from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    setIsAuthenticated(!!(token && user));

    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      applyTheme(savedTheme === 'dark');
    } else {
      applyTheme(true);
    }

    // Simulate initial loading
    setTimeout(() => setLoading(false), 1500);
  }, []);

  const applyTheme = (isDark) => {
    const root = document.documentElement;
    if (isDark) {
      root.style.backgroundColor = '#000000';
      root.style.color = '#ffffff';
      document.body.style.backgroundColor = '#000000';
      document.body.style.color = '#ffffff';
      root.setAttribute('data-theme', 'dark');
    } else {
      root.style.backgroundColor = '#f8f9fa';
      root.style.color = '#1f2937';
      document.body.style.backgroundColor = '#f8f9fa';
      document.body.style.color = '#1f2937';
      root.setAttribute('data-theme', 'light');
    }
  };

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    applyTheme(newMode);
  };

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
      <div className="min-h-screen" style={{ backgroundColor: isDarkMode ? '#000000' : '#f8f9fa', color: isDarkMode ? '#ffffff' : '#1f2937', transition: 'all 0.3s ease' }}>
        {/* Only show Navbar if not on welcome/login/register pages */}
        {!window.location.pathname.match(/\/(welcome|login|register)/i) && <Navbar isDarkMode={isDarkMode} onThemeToggle={toggleTheme} />}
        
        <AnimatePresence mode="wait">
          <Routes>
            {/* Landing/Welcome Page - First page users see */}
            <Route 
              path="/welcome" 
              element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage isDarkMode={isDarkMode} />
              } 
            />
            
            {/* Auth Pages */}
            <Route 
              path="/login" 
              element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login isDarkMode={isDarkMode} />
              } 
            />
            <Route 
              path="/register" 
              element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register isDarkMode={isDarkMode} />
              } 
            />

            {/* Admin Login - Separate from regular login */}
            <Route 
              path="/admin-login" 
              element={
                isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin />
              } 
            />

            {/* Protected Routes - Require Authentication */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard isDarkMode={isDarkMode} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/submit-review" 
              element={
                <ProtectedRoute>
                  <SubmitReviewEnhanced isDarkMode={isDarkMode} />
                </ProtectedRoute>
              } 
            />
            
            {/* User Feedback Form Route - Different from admin */}
            <Route 
              path="/user/feedback" 
              element={
                <ProtectedRoute>
                  <FeedbackForm />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Dashboard Route - Admin only */}
            <Route 
              path="/admin/dashboard" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />

            {/* Default Route - Redirect based on auth status */}
            <Route 
              path="/" 
              element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/welcome" replace />
              } 
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
        {!window.location.pathname.match(/\/(welcome|login|register)/i) && <Footer isDarkMode={isDarkMode} />}
        <Toaster />
      </div>
    </Router>
  );
}
