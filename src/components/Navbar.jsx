import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, LayoutDashboard, FileText, Search, Zap, LogIn, UserPlus, User, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Navbar({ isDarkMode: externalIsDarkMode, onThemeToggle }) {
  const [user, setUser] = useState(null);
  const [activePath, setActivePath] = useState('/');
  const [isDarkMode, setIsDarkMode] = useState(externalIsDarkMode !== undefined ? externalIsDarkMode : true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    // Set active path based on current location
    setActivePath(window.location.pathname);

    // Check saved theme preference if not provided externally
    if (externalIsDarkMode === undefined) {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        setIsDarkMode(savedTheme === 'dark');
        applyTheme(savedTheme === 'dark');
      } else {
        applyTheme(true);
      }
    } else {
      setIsDarkMode(externalIsDarkMode);
    }
  }, [externalIsDarkMode]);

  const applyTheme = (isDark) => {
    const root = document.documentElement;
    if (isDark) {
      root.style.backgroundColor = '#000000';
      root.style.color = '#ffffff';
      document.body.style.backgroundColor = '#000000';
      document.body.style.color = '#ffffff';
    } else {
      root.style.backgroundColor = '#f8f9fa';
      root.style.color = '#1f2937';
      document.body.style.backgroundColor = '#f8f9fa';
      document.body.style.color = '#1f2937';
    }
  };

  const toggleTheme = () => {
    if (onThemeToggle) {
      // Call parent component's toggle function
      onThemeToggle();
    } else {
      // Local toggle if no parent function provided
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      applyTheme(newMode);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/welcome';
  };

  const navLinks = [
    { icon: Home, label: 'Home', path: '/welcome' },
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: FileText, label: 'Submit Review', path: '/submit-review' },
    { icon: FileText, label: 'Feedback', path: '/user/feedback' }
  ];

  // Admin only link
  const adminLinks = [
    { icon: LayoutDashboard, label: 'Admin Panel', path: '/admin/dashboard' }
  ];

  // Check if user is admin
  const isAdmin = user && (user.role === 'admin' || user.isAdmin === true || user.email === 'admin@powersupply.com');

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      style={{
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(248, 249, 250, 0.95)',
        backdropFilter: 'blur(0.5rem)',
        borderBottom: isDarkMode ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid rgba(34, 197, 94, 0.3)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: `0 0 1rem ${isDarkMode ? 'rgba(244, 114, 182, 0.1)' : 'rgba(244, 114, 182, 0.15)'}`
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
          {/* Logo */}
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
            >
              <div style={{ width: '2.5rem', height: '2.5rem', background: 'linear-gradient(to bottom right, #22c55e, #15803d)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(236, 72, 153, 0.5)' }}>
                <Zap className="w-6 h-6 text-black" />
              </div>
              <span style={{ fontSize: '1.25rem', color: isDarkMode ? 'white' : '#1f2937', fontWeight: 'bold' }}>
                Power<span style={{ color: '#22c55e' }}>Supply</span>
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation - Pill-shaped Container */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.5)' : 'rgba(255, 255, 255, 0.5)', padding: '0.5rem', borderRadius: '50px', border: isDarkMode ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid rgba(34, 197, 94, 0.3)' }}>
            {/* Theme Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 20 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                border: '2px solid rgba(168, 85, 247, 0.4)',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                color: '#a855f7',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                boxShadow: '0 0 15px rgba(168, 85, 247, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.8)';
                e.currentTarget.style.boxShadow = '0 0 25px rgba(168, 85, 247, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.4)';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(168, 85, 247, 0.2)';
              }}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>

            {/* Separator */}
            <div style={{ width: '1px', height: '1.5rem', backgroundColor: isDarkMode ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.3)' }} />

            {/* Regular user links */}
            {navLinks.map((link, index) => {
              const Icon = link.icon;
              const isActive = activePath === link.path || (link.path === '/welcome' && activePath === '/');

              return (
                <Link key={link.label} to={link.path}>
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActivePath(link.path)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      borderRadius: '50px',
                      border: isActive ? '2px solid #22c55e' : '2px solid transparent',
                      backgroundColor: isActive ? 'rgba(34, 197, 94, 0.15)' : 'transparent',
                      color: isActive ? '#22c55e' : isDarkMode ? '#9ca3af' : '#6b7280',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isActive ? '0 0 20px rgba(34, 197, 94, 0.4)' : 'none',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.5)';
                        e.currentTarget.style.color = '#86efac';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = 'transparent';
                        e.currentTarget.style.color = '#9ca3af';
                      }
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </motion.div>
                </Link>
              );
            })}

            {/* Admin Panel Link - Only show for admins */}
            {isAdmin && (
              <>
                <div style={{ width: '1px', height: '1.5rem', backgroundColor: isDarkMode ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.3)' }} />
                {adminLinks.map((link, index) => {
                  const Icon = link.icon;
                  const isActive = activePath === link.path;

                  return (
                    <Link key={link.label} to={link.path}>
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (navLinks.length + index) * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActivePath(link.path)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 1rem',
                          borderRadius: '50px',
                          border: isActive ? '2px solid #3b82f6' : '2px solid transparent',
                          backgroundColor: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                          color: isActive ? '#3b82f6' : isDarkMode ? '#9ca3af' : '#6b7280',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          boxShadow: isActive ? '0 0 20px rgba(59, 130, 246, 0.4)' : 'none',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                            e.currentTarget.style.color = '#60a5fa';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.borderColor = 'transparent';
                            e.currentTarget.style.color = '#9ca3af';
                          }
                        }}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{link.label}</span>
                      </motion.div>
                    </Link>
                  );
                })}
              </>
            )}

            {/* Separator */}
            <div style={{ width: '1px', height: '1.5rem', backgroundColor: 'rgba(34, 197, 94, 0.2)' }} />

            {/* Auth Buttons */}
            {user ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '50px',
                  border: '2px solid #ef4444',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                Logout
              </motion.button>
            ) : (
              <>
                <Link to="/login">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      borderRadius: '50px',
                      border: '2px solid rgba(34, 197, 94, 0.3)',
                      backgroundColor: 'transparent',
                      color: isDarkMode ? '#9ca3af' : '#6b7280',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </motion.div>
                </Link>
                <Link to="/register">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      borderRadius: '50px',
                      background: 'linear-gradient(to right, #22c55e, #16a34a)',
                      color: 'white',
                      cursor: 'pointer',
                      boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)',
                      transition: 'all 0.15s ease',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Sign Up</span>
                  </motion.div>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
