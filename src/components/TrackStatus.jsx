import { motion } from 'motion/react';
import { useState } from 'react';
import { Search, Mail, CheckCircle, Clock, AlertCircle, Star, Shield, Zap, TrendingUp, Award } from 'lucide-react';

export function TrackStatus({ isDarkMode = true }) {
  const [searchType, setSearchType] = useState('id');
  const [searchValue, setSearchValue] = useState('');
  const [result, setResult] = useState(null);
  const [searching, setSearching] = useState(false);

  // Theme colors
  const colors = {
    bgPrimary: isDarkMode ? '#000000' : '#f8f9fa',
    textPrimary: isDarkMode ? '#ffffff' : '#1f2937',
    textSecondary: isDarkMode ? '#9ca3af' : '#6b7280',
    borderColor: isDarkMode ? 'rgba(236, 72, 153, 0.2)' : 'rgba(236, 72, 153, 0.3)',
    cardBg: isDarkMode ? 'linear-gradient(135deg, rgba(30, 30, 46, 0.8) 0%, rgba(50, 30, 50, 0.8) 100%)' : 'linear-gradient(135deg, rgba(248, 249, 250, 0.9) 0%, rgba(230, 240, 255, 0.9) 100%)'
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearching(true);

    setTimeout(() => {
      const reviews = JSON.parse(localStorage.getItem('psuReviews') || '[]');
      
      let found = null;
      if (searchType === 'id') {
        found = reviews.find(r => r.id === searchValue.toUpperCase());
      } else {
        found = reviews.find(r => r.email === searchValue);
      }

      if (found) {
        setResult({
          ...found,
          timeline: [
            { status: 'Submitted', date: new Date(found.submittedDate).toLocaleDateString(), completed: true, icon: CheckCircle },
            { status: 'Under Review', date: 'In Progress', completed: true, icon: Shield },
            { status: 'Approved', date: 'Pending', completed: false, icon: Award },
            { status: 'Published', date: 'Pending', completed: false, icon: TrendingUp }
          ]
        });
      } else {
        setResult({ notFound: true });
      }
      setSearching(false);
    }, 1000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending Review':
        return { bg: 'rgba(234, 179, 8, 0.1)', border: 'rgba(234, 179, 8, 0.3)', text: '#fbbf24' };
      case 'Under Review':
        return { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)', text: '#60a5fa' };
      case 'Approved':
        return { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.3)', text: '#22c55e' };
      default:
        return { bg: 'rgba(107, 114, 128, 0.1)', border: 'rgba(107, 114, 128, 0.3)', text: '#9ca3af' };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ minHeight: '100vh', paddingTop: '5rem', paddingBottom: '4rem', backgroundColor: colors.bgPrimary, transition: 'all 0.3s ease', color: colors.textPrimary }}
    >
      <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '0 1rem' }}>
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{ marginBottom: '2rem' }}
        >
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}
          >
            🔍
          </motion.div>
          <h1 style={{ fontSize: '2.25rem', color: colors.textPrimary, marginBottom: '0.5rem', fontWeight: 'bold', textAlign: 'center' }}>
            Track Your <span style={{ color: '#22c55e' }}>Review Status</span>
          </h1>
          <p style={{ color: colors.textSecondary, fontSize: '1.125rem', textAlign: 'center' }}>
            Get real-time updates on your PSU review submission
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: '2rem' }}
        >
          <motion.form
            onSubmit={handleSearch}
            style={{
              background: colors.cardBg,
              border: `2px solid ${colors.borderColor}`,
              borderRadius: '1.5rem',
              padding: '2rem',
              boxShadow: isDarkMode ? '0 20px 40px rgba(236, 72, 153, 0.2)' : '0 20px 40px rgba(236, 72, 153, 0.15)',
              transition: 'all 0.3s ease'
            }}
          >
            {/* Search Type Selector */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: colors.textSecondary, marginBottom: '1rem', fontWeight: '500' }}>
                Track by
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                {[{ id: 'id', label: 'Reference ID', icon: Search }, { id: 'email', label: 'Email Address', icon: Mail }].map((option) => (
                  <motion.button
                    key={option.id}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSearchType(option.id)}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '0.75rem',
                      border: searchType === option.id ? '2px solid #22c55e' : `2px solid ${colors.borderColor}`,
                      background: searchType === option.id ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                      color: searchType === option.id ? '#22c55e' : colors.textSecondary,
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <option.icon size={20} />
                    {option.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: colors.textSecondary, marginBottom: '0.5rem', fontWeight: '500' }}>
                {searchType === 'id' ? 'Enter Tracking ID' : 'Enter Email Address'}
              </label>
              <motion.input
                whileHover={{ boxShadow: `0 0 20px rgba(34, 197, 94, 0.2)` }}
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                required
                placeholder={searchType === 'id' ? 'PSU-XXXXXXXX' : 'your.email@example.com'}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: isDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)',
                  border: `1px solid ${colors.borderColor}`,
                  borderRadius: '0.75rem',
                  color: colors.textPrimary,
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#22c55e';
                  e.target.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.borderColor;
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(34, 197, 94, 0.4)' }}
              whileTap={{ scale: 0.98 }}
              disabled={searching}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'linear-gradient(to right, #22c55e, #16a34a)',
                border: 'none',
                color: 'white',
                borderRadius: '0.75rem',
                cursor: searching ? 'not-allowed' : 'pointer',
                fontSize: '1.1rem',
                fontWeight: '600',
                boxShadow: '0 10px 30px rgba(34, 197, 94, 0.3)',
                transition: 'all 0.3s ease',
                opacity: searching ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {searching ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} style={{ display: 'inline-block' }}>
                    <Clock size={20} />
                  </motion.div>
                  Searching...
                </>
              ) : (
                <>
                  <Search size={20} />
                  Track Review Status
                </>
              )}
            </motion.button>
          </motion.form>
        </motion.div>

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {result.notFound ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                  background: colors.cardBg,
                  border: `2px solid rgba(239, 68, 68, 0.3)`,
                  borderRadius: '1.5rem',
                  padding: '2rem',
                  textAlign: 'center',
                  boxShadow: isDarkMode ? '0 20px 40px rgba(239, 68, 68, 0.2)' : '0 20px 40px rgba(239, 68, 68, 0.15)',
                  transition: 'all 0.3s ease'
                }}
              >
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ fontSize: '3rem', marginBottom: '1rem' }}
                >
                  ❌
                </motion.div>
                <h3 style={{ fontSize: '1.5rem', color: colors.textPrimary, marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  No Results Found
                </h3>
                <p style={{ color: colors.textSecondary, marginBottom: '1.5rem' }}>
                  We couldn't find any submission with the provided {searchType === 'id' ? 'reference ID' : 'email address'}.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setResult(null)}
                  style={{
                    padding: '0.5rem 1.5rem',
                    background: 'linear-gradient(to right, #22c55e, #16a34a)',
                    border: 'none',
                    color: 'white',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Try Again
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                  background: colors.cardBg,
                  border: `2px solid ${colors.borderColor}`,
                  borderRadius: '1.5rem',
                  padding: '2rem',
                  boxShadow: isDarkMode ? '0 20px 40px rgba(34, 197, 94, 0.2)' : '0 20px 40px rgba(34, 197, 94, 0.15)',
                  transition: 'all 0.3s ease'
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
                  <div>
                    <h3 style={{ fontSize: '1.5rem', color: colors.textPrimary, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                      <Zap size={24} color="#22c55e" />
                      {result.brand} {result.model}
                    </h3>
                    <p style={{ color: colors.textSecondary }}>{result.wattage}W • {result.efficiency}</p>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '0.75rem',
                      background: getStatusColor(result.status).bg,
                      border: `2px solid ${getStatusColor(result.status).border}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <Clock size={20} style={{ color: getStatusColor(result.status).text }} />
                    <span style={{ color: getStatusColor(result.status).text, fontWeight: '600' }}>{result.status}</span>
                  </motion.div>
                </div>

                {/* Review Details */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '1rem',
                  marginBottom: '2rem',
                  padding: '1.5rem',
                  background: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)',
                  borderRadius: '1rem'
                }}>
                  {[
                    { label: 'Overall Rating', value: `${result.rating}/5`, icon: Star },
                    { label: 'Type', value: result.modular, icon: Shield },
                    { label: 'Price Paid', value: `$${result.price}`, icon: TrendingUp },
                    { label: 'Usage Duration', value: result.usageDuration, icon: Clock }
                  ].map((item, idx) => (
                    <motion.div key={idx} whileHover={{ y: -5 }} style={{ textAlign: 'center' }}>
                      <item.icon size={24} style={{ color: '#22c55e', marginBottom: '0.5rem', margin: '0 auto 0.5rem' }} />
                      <p style={{ color: colors.textSecondary, fontSize: '0.875rem', marginBottom: '0.25rem' }}>{item.label}</p>
                      <p style={{ color: colors.textPrimary, fontWeight: '600', fontSize: '1.1rem' }}>{item.value}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Timeline */}
                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ fontSize: '1.125rem', color: colors.textPrimary, marginBottom: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <TrendingUp size={20} color="#22c55e" />
                    Review Status Timeline
                  </h4>
                  <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                    {result.timeline.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        style={{ marginBottom: index < result.timeline.length - 1 ? '2rem' : 0, position: 'relative' }}
                      >
                        {/* Timeline line */}
                        {index < result.timeline.length - 1 && (
                          <div
                            style={{
                              position: 'absolute',
                              left: '-1.5rem',
                              top: '2.5rem',
                              width: '2px',
                              height: '2rem',
                              background: item.completed ? '#22c55e' : isDarkMode ? '#4b5563' : '#d1d5db'
                            }}
                          />
                        )}
                        
                        {/* Timeline dot */}
                        <motion.div
                          whileHover={{ scale: 1.15 }}
                          style={{
                            position: 'absolute',
                            left: '-2rem',
                            top: 0,
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: item.completed ? 'linear-gradient(135deg, #22c55e, #16a34a)' : isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(209, 213, 219, 0.5)',
                            border: `2px solid ${item.completed ? '#22c55e' : colors.borderColor}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <item.icon size={16} color={item.completed ? 'white' : colors.textSecondary} />
                        </motion.div>

                        {/* Timeline content */}
                        <div style={{ paddingTop: '0.25rem' }}>
                          <p style={{ color: item.completed ? colors.textPrimary : colors.textSecondary, fontWeight: '600', fontSize: '1rem' }}>
                            {item.status}
                          </p>
                          <p style={{ color: colors.textSecondary, fontSize: '0.875rem', marginTop: '0.25rem' }}>{item.date}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <motion.div
                  whileHover={{ y: -5 }}
                  style={{
                    padding: '1.5rem',
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '2px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '1rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <p style={{ color: colors.textSecondary, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <strong style={{ color: '#22c55e' }}>Review ID:</strong> <span style={{ fontFamily: 'monospace', marginLeft: '0.5rem' }}>{result.id}</span>
                  </p>
                  <p style={{ color: colors.textSecondary, fontSize: '0.875rem' }}>
                    For any queries, contact us at <span style={{ color: '#22c55e', fontWeight: '600' }}>support@powersupply.com</span>
                  </p>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Info Card - Show when no results yet */}
        {!result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              whileHover={{ y: -10 }}
              style={{
                background: colors.cardBg,
                border: `2px solid ${colors.borderColor}`,
                borderRadius: '1.5rem',
                padding: '2rem',
                boxShadow: isDarkMode ? '0 20px 40px rgba(34, 197, 94, 0.2)' : '0 20px 40px rgba(34, 197, 94, 0.15)',
                transition: 'all 0.3s ease'
              }}
            >
              <h3 style={{ fontSize: '1.25rem', color: colors.textPrimary, marginBottom: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={24} color="#22c55e" />
                How to Track Your Review
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { icon: '1️⃣', text: 'Choose your tracking method (Reference ID or Email Address)' },
                  { icon: '2️⃣', text: 'Enter your reference ID (received after submission) or registered email' },
                  { icon: '3️⃣', text: 'View real-time status updates and timeline of your submission' },
                  { icon: '✅', text: 'Follow the status journey from submission to publication' }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ x: 10 }}
                    style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}
                  >
                    <span style={{ fontSize: '1.5rem', minWidth: '2rem', textAlign: 'center' }}>{item.icon}</span>
                    <p style={{ color: colors.textSecondary, fontSize: '1rem', marginTop: '0.25rem' }}>{item.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
