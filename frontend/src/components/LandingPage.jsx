import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Zap, LogIn, UserPlus, Activity, Shield, TrendingUp, Star, CheckCircle, ArrowRight, Home, LayoutDashboard, FileText, Search } from 'lucide-react';

export function LandingPage({ isDarkMode = true }) {
  const features = [
    {
      icon: Activity,
      title: 'Real-Time Monitoring',
      description: 'Track your power supply performance with live data and analytics'
    },
    {
      icon: Shield,
      title: 'Quality Reviews',
      description: 'Read and submit verified reviews from real users'
    },
    {
      icon: TrendingUp,
      title: 'Performance Metrics',
      description: 'Detailed performance, noise, and efficiency ratings'
    },
    {
      icon: Star,
      title: 'Top Rated PSUs',
      description: 'Discover the best power supplies based on community feedback'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Reviews' },
    { value: '500+', label: 'PSU Models' },
    { value: '50K+', label: 'Users' },
    { value: '4.8', label: 'Avg Rating' }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: isDarkMode ? '#000000' : '#f8f9fa', overflow: 'hidden' }}>
      {/* Animated Background with Floating Elements */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {/* Animated gradient background */}
        <motion.div
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          style={{
            position: 'absolute',
            inset: 0,
            background: isDarkMode 
              ? 'linear-gradient(-45deg, #000000, #1a1a2e, #0f3460, #000000)'
              : 'linear-gradient(-45deg, #f8f9fa, #e8eef7, #f0f4ff, #f8f9fa)',
            backgroundSize: '400% 400%'
          }}
        />
        
        {/* Floating orbs */}
        <motion.div
          animate={{ y: [0, -100, 0], x: [0, 50, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, transparent 70%)',
            filter: 'blur(60px)'
          }}
        />
        <motion.div
          animate={{ y: [0, 100, 0], x: [0, -50, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '10%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%)',
            filter: 'blur(80px)'
          }}
        />
      </div>

      {/* Content Container */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        {/* Hero Section */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '8rem 1rem 6rem', textAlign: 'center' }}>
            
            {/* Animated Logo with Enhanced Effects */}
            <motion.div
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ duration: 1, type: 'spring', stiffness: 100 }}
              style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem', position: 'relative' }}
            >
              {/* Rotating halo ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  width: '300px',
                  height: '300px',
                  borderRadius: '50%',
                  border: '2px dashed rgba(34, 197, 94, 0.3)',
                  inset: '-18px'
                }}
              />
              
              {/* Pulsing outer glow */}
              <motion.div
                animate={{ 
                  scale: [1, 1.15, 1],
                  boxShadow: [
                    '0 0 30px rgba(34, 197, 94, 0.4)',
                    '0 0 80px rgba(34, 197, 94, 0.8), 0 0 40px rgba(236, 72, 153, 0.6)',
                    '0 0 30px rgba(34, 197, 94, 0.4)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '3rem'
                }}
              />
              
              {/* Main icon container with enhanced hover */}
              <motion.div
                whileHover={{ scale: 1.3, rotate: 45, boxShadow: '0 0 100px rgba(34, 197, 94, 1), 0 0 60px rgba(236, 72, 153, 1)' }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                style={{
                  width: '260px',
                  height: '260px',
                  borderRadius: '3rem',
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)',
                  boxShadow: '0 0 60px rgba(34, 197, 94, 0.6), 0 0 30px rgba(236, 72, 153, 0.4)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Zap style={{ width: '160px', height: '160px', color: 'white', filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.8))' }} strokeWidth={1.5} />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Animated Text with Staggered Letters */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h1 style={{ fontSize: '3.5rem', color: isDarkMode ? 'white' : '#1f2937', marginBottom: '1.5rem', fontWeight: '900', letterSpacing: '-0.025em' }}>
                Welcome to{' '}
                <motion.span
                  animate={{ color: ['#22c55e', '#16a34a', '#22c55e'] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{ background: 'linear-gradient(90deg, #22c55e, #16a34a, #22c55e)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                >
                  PowerSupply
                </motion.span>
              </h1>
            </motion.div>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              style={{ fontSize: '1.5rem', color: isDarkMode ? '#d1d5db' : '#4b5563', marginBottom: '3rem', maxWidth: '800px', margin: '0 auto', marginBottom: '3rem' }}
            >
              Your trusted platform for power supply feedback, reviews, and real-time monitoring
            </motion.p>

            {/* Animated CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}
            >
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.08, y: -5, boxShadow: '0 20px 40px rgba(34, 197, 94, 0.5)' }}
                  whileTap={{ scale: 0.92 }}
                  style={{
                    padding: '1rem 2rem',
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    color: 'white',
                    borderRadius: '1rem',
                    border: 'none',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    boxShadow: '0 10px 30px rgba(34, 197, 94, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <UserPlus size={24} />
                  <span>Get Started Free</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight size={20} />
                  </motion.span>
                </motion.button>
              </Link>

              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.08, borderColor: '#22c55e', boxShadow: '0 20px 40px rgba(34, 197, 94, 0.2)' }}
                  whileTap={{ scale: 0.92 }}
                  style={{
                    padding: '1rem 2rem',
                    background: isDarkMode ? 'rgba(30, 30, 46, 0.5)' : 'rgba(255, 255, 255, 0.7)',
                    color: isDarkMode ? 'white' : '#1f2937',
                    border: '2px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '1rem',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    boxShadow: '0 10px 30px rgba(34, 197, 94, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <LogIn size={24} />
                  <span>Sign In</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                  >
                    <ArrowRight size={20} />
                  </motion.span>
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust Indicators with Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}
            >
              {[
                { icon: CheckCircle, text: 'Free to use' },
                { icon: CheckCircle, text: 'No credit card required' },
                { icon: CheckCircle, text: 'Join 50K+ users' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.1, x: 5 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isDarkMode ? 'white' : '#4b5563' }}
                >
                  <motion.div animate={{ rotate: [0, 15, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}>
                    <item.icon size={24} color="#22c55e" />
                  </motion.div>
                  <span style={{ fontSize: '1rem', fontWeight: '500' }}>{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Stats Section - Animated Cards */}
        <div style={{ width: '100%', padding: '4rem 1rem', display: 'flex', justifyContent: 'center' }}>
          <div style={{ maxWidth: '1200px', width: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -12, boxShadow: '0 20px 50px rgba(236, 72, 153, 0.3)' }}
                  transition={{ delay: index * 0.15, type: 'spring', stiffness: 100 }}
                  viewport={{ once: true, margin: '-50px' }}
                  style={{
                    background: isDarkMode
                      ? 'linear-gradient(135deg, rgba(30, 30, 46, 0.8) 0%, rgba(50, 30, 50, 0.8) 100%)'
                      : 'linear-gradient(135deg, rgba(248, 249, 250, 0.9) 0%, rgba(230, 240, 255, 0.9) 100%)',
                    border: `2px solid ${isDarkMode ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)'}`,
                    borderRadius: '1.5rem',
                    padding: '2rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 }}
                    style={{ fontSize: '2.5rem', color: '#22c55e', marginBottom: '0.5rem', fontWeight: '900' }}
                  >
                    {stat.value}
                  </motion.div>
                  <div style={{ fontSize: '1.1rem', color: isDarkMode ? '#9ca3af' : '#6b7280', fontWeight: '500' }}>{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div style={{ width: '100%', padding: '6rem 1rem', display: 'flex', justifyContent: 'center' }}>
          <div style={{ maxWidth: '1200px', width: '100%' }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true, margin: '-50px' }}
              style={{ textAlign: 'center', marginBottom: '4rem' }}
            >
              <h2 style={{ fontSize: '3rem', color: isDarkMode ? 'white' : '#1f2937', marginBottom: '1rem', fontWeight: '900' }}>
                Why Choose{' '}
                <span style={{ color: '#22c55e', background: 'linear-gradient(90deg, #22c55e, #16a34a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  PowerSupply
                </span>
                ?
              </h2>
              <p style={{ fontSize: '1.25rem', color: isDarkMode ? '#d1d5db' : '#4b5563', maxWidth: '600px', margin: '0 auto' }}>
                Everything you need to make informed decisions about power supplies
              </p>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 40, rotate: -5 }}
                    whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                    whileHover={{ y: -15, rotate: 2, boxShadow: '0 25px 50px rgba(236, 72, 153, 0.3)' }}
                    transition={{ delay: index * 0.1, type: 'spring', stiffness: 120 }}
                    viewport={{ once: true, margin: '-50px' }}
                    style={{
                      background: isDarkMode
                        ? 'linear-gradient(135deg, rgba(30, 30, 46, 0.9) 0%, rgba(50, 30, 50, 0.9) 100%)'
                        : 'linear-gradient(135deg, rgba(248, 249, 250, 0.95) 0%, rgba(230, 240, 255, 0.95) 100%)',
                      border: `2px solid ${isDarkMode ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)'}`,
                      borderRadius: '1.5rem',
                      padding: '2rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.8 }}
                      style={{
                        width: '60px',
                        height: '60px',
                        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                        borderRadius: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1rem',
                        boxShadow: '0 10px 25px rgba(34, 197, 94, 0.3)'
                      }}
                    >
                      <Icon size={32} color="white" />
                    </motion.div>
                    <h3 style={{ fontSize: '1.25rem', color: isDarkMode ? 'white' : '#1f2937', marginBottom: '0.5rem', fontWeight: '700' }}>{feature.title}</h3>
                    <p style={{ fontSize: '1rem', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div style={{ width: '100%', padding: '6rem 1rem', display: 'flex', justifyContent: 'center' }}>
          <div style={{ maxWidth: '1200px', width: '100%' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: 'spring' }}
              viewport={{ once: true, margin: '-50px' }}
              style={{
                background: isDarkMode
                  ? 'linear-gradient(135deg, rgba(30, 30, 46, 0.95) 0%, rgba(60, 20, 40, 0.95) 100%)'
                  : 'linear-gradient(135deg, rgba(248, 249, 250, 0.98) 0%, rgba(230, 240, 255, 0.98) 100%)',
                border: `2px solid ${isDarkMode ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)'}`,
                borderRadius: '2rem',
                padding: '4rem',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Animated background elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  top: '-50%',
                  right: '-50%',
                  width: '500px',
                  height: '500px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%)',
                  pointerEvents: 'none'
                }}
              />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <h2 style={{ fontSize: '2.5rem', color: isDarkMode ? 'white' : '#1f2937', marginBottom: '1rem', fontWeight: '900' }}>
                  Ready to Get Started?
                </h2>
                <p style={{ fontSize: '1.25rem', color: isDarkMode ? '#d1d5db' : '#4b5563', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto', marginBottom: '2rem' }}>
                  Join thousands of users monitoring and reviewing power supplies
                </p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link to="/register">
                    <motion.button
                      whileHover={{ scale: 1.08, y: -5 }}
                      whileTap={{ scale: 0.92 }}
                      style={{
                        padding: '1rem 2rem',
                        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                        color: 'white',
                        borderRadius: '1rem',
                        border: 'none',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        boxShadow: '0 10px 30px rgba(34, 197, 94, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <UserPlus size={24} />
                      <span>Create Free Account</span>
                      <ArrowRight size={20} />
                    </motion.button>
                  </Link>

                  <Link to="/login">
                    <motion.button
                      whileHover={{ scale: 1.08, borderColor: '#22c55e' }}
                      whileTap={{ scale: 0.92 }}
                      style={{
                        padding: '1rem 2rem',
                        background: isDarkMode ? 'rgba(30, 30, 46, 0.5)' : 'rgba(255, 255, 255, 0.5)',
                        color: isDarkMode ? 'white' : '#1f2937',
                        border: '2px solid rgba(34, 197, 94, 0.3)',
                        borderRadius: '1rem',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        boxShadow: '0 10px 30px rgba(34, 197, 94, 0.1)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <LogIn size={24} />
                      <span>Sign In</span>
                      <ArrowRight size={20} />
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
