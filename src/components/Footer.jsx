import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Building2, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Zap, Clock } from 'lucide-react';

export function Footer({ isDarkMode = true }) {
  const socialLinks = [
    { icon: Facebook, label: 'Facebook', url: 'https://facebook.com' },
    { icon: Twitter, label: 'Twitter', url: 'https://twitter.com' },
    { icon: Instagram, label: 'Instagram', url: 'https://instagram.com' },
    { icon: Linkedin, label: 'LinkedIn', url: 'https://linkedin.com' }
  ];

  return (
    <footer style={{ background: isDarkMode ? '#000000' : '#f8f9fa', borderTop: `1px solid ${isDarkMode ? 'rgba(236, 72, 153, 0.2)' : 'rgba(236, 72, 153, 0.3)'}`, marginTop: '5rem', color: isDarkMode ? '#ffffff' : '#1f2937' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '3rem 1rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
        
        {/* Brand Section - Left */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ width: '3rem', height: '3rem', background: 'linear-gradient(135deg, #a855f7 0%, #d946ef 100%)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(236, 72, 153, 0.5)' }}>
              <Zap style={{ width: '1.75rem', height: '1.75rem', color: '#ffffff' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', color: 'white' }}>
                Power<span style={{ color: '#a855f7' }}>Supply</span>
              </h2>
              <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>PSU Reviews & Ratings</p>
            </div>
          </div>
          <p style={{ color: '#d1d5db', fontSize: '0.875rem', maxWidth: '300px' }}>
            Your trusted source for unbiased power supply reviews, ratings, and recommendations. Helping you make informed decisions for your PC builds.
          </p>
        </motion.div>

        {/* Contact Us - Center */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ textAlign: 'center' }}
        >
          <h3 style={{ color: 'white', fontSize: '1.125rem', marginBottom: '1rem' }}>Contact Us</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05, y: -4, boxShadow: '0 12px 24px rgba(236, 72, 153, 0.3)' }}
              style={{
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%)',
                border: '1px solid rgba(236, 72, 153, 0.2)',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                boxShadow: '0 4px 12px rgba(236, 72, 153, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center', color: '#d1d5db' }}>
                <Phone style={{ width: '1rem', height: '1rem', color: '#a855f7' }} />
                <span style={{ fontSize: '0.875rem' }}>1-800-PSU-HELP</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05, y: -4, boxShadow: '0 12px 24px rgba(236, 72, 153, 0.3)' }}
              style={{
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%)',
                border: '1px solid rgba(236, 72, 153, 0.2)',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                boxShadow: '0 4px 12px rgba(236, 72, 153, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center', color: '#d1d5db' }}>
                <Mail style={{ width: '1rem', height: '1rem', color: '#a855f7' }} />
                <span style={{ fontSize: '0.875rem' }}>support@powersupply.com</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05, y: -4, boxShadow: '0 12px 24px rgba(236, 72, 153, 0.3)' }}
              style={{
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%)',
                border: '1px solid rgba(236, 72, 153, 0.2)',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                boxShadow: '0 4px 12px rgba(236, 72, 153, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center', color: '#d1d5db' }}>
                <MapPin style={{ width: '1rem', height: '1rem', color: '#a855f7' }} />
                <span style={{ fontSize: '0.875rem' }}>Tech Plaza, Silicon Valley, CA 94025</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.08, y: -6, boxShadow: '0 16px 32px rgba(239, 68, 68, 0.5)' }}
              style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                textAlign: 'center',
                boxShadow: '0 8px 24px rgba(239, 68, 68, 0.4)',
                fontWeight: '600',
                color: 'white',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              24/7 Support Available
            </motion.div>
          </div>
        </motion.div>

        {/* Follow Us - Right */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 style={{ color: 'white', fontSize: '1.125rem', marginBottom: '1rem' }}>Follow Us</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ x: 8, scale: 1.08, boxShadow: '0 16px 32px rgba(236, 72, 153, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%)',
                    border: '1px solid rgba(236, 72, 153, 0.2)',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none',
                    boxShadow: '0 4px 12px rgba(236, 72, 153, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(236, 72, 153, 0.15) 100%)';
                    e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%)';
                    e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.2)';
                  }}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', delay: index * 0.2 }}
                  >
                    <Icon style={{ width: '1.25rem', height: '1.25rem', color: '#a855f7' }} />
                  </motion.div>
                  <span style={{ color: '#d1d5db', fontSize: '0.875rem' }}>
                    {social.label}
                  </span>
                </motion.a>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            style={{ color: '#9ca3af', fontSize: '0.875rem' }}
          >
            <motion.div 
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}
              whileHover={{ x: 5 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                <Clock style={{ width: '1rem', height: '1rem', color: '#a855f7' }} />
              </motion.div>
              <p style={{ fontWeight: '500' }}>Business Hours:</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: '0 12px 24px rgba(236, 72, 153, 0.2)' }}
              style={{
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%)',
                border: '1px solid rgba(236, 72, 153, 0.2)',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                boxShadow: '0 4px 12px rgba(236, 72, 153, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <p style={{ color: '#a855f7', fontWeight: '500' }}>Mon - Fri: 9:00 AM - 6:00 PM</p>
              <p style={{ color: '#a855f7', fontWeight: '500' }}>Sat - Sun: 10:00 AM - 4:00 PM</p>
            </motion.div>
          </motion.div>
        </motion.div>

      </div>

      {/* Bottom Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{
          marginTop: '3rem',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(236, 72, 153, 0.2)',
          textAlign: 'center'
        }}
      >
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ x: 5 }}
            style={{ color: '#9ca3af', fontSize: '0.875rem', cursor: 'pointer' }}
          >
            © 2025 PowerSupply. All rights reserved.
          </motion.p>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem' }}>
            <motion.a
              href="#"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
              whileHover={{ scale: 1.1, color: '#a855f7' }}
              style={{ color: '#9ca3af', textDecoration: 'none', transition: 'all 0.3s ease', cursor: 'pointer' }}
            >
              Privacy Policy
            </motion.a>
            <motion.a
              href="#"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              whileHover={{ scale: 1.1, color: '#a855f7' }}
              style={{ color: '#9ca3af', textDecoration: 'none', transition: 'all 0.3s ease', cursor: 'pointer' }}
            >
              Terms of Service
            </motion.a>
            <motion.a
              href="#"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95 }}
              whileHover={{ scale: 1.1, color: '#a855f7' }}
              style={{ color: '#9ca3af', textDecoration: 'none', transition: 'all 0.3s ease', cursor: 'pointer' }}
            >
              FAQ
            </motion.a>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
