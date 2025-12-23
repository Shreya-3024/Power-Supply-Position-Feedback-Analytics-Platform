import { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, Star, Award, CheckCircle, Send, Sparkles } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { api } from '../utils/api';

export function SubmitReviewEnhanced({ isDarkMode = true }) {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    wattage: '',
    efficiency: '',
    modular: '',
    price: '',
    purchaseDate: '',
    usageDuration: '',
    rating: 5,
    performance: 5,
    noise: 5,
    value: 5,
    buildQuality: 5,
    title: '',
    review: '',
    pros: '',
    cons: '',
    recommend: 'yes',
    name: '',
    email: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState('');

  // Theme colors
  const colors = {
    bgPrimary: isDarkMode ? '#000000' : '#f8f9fa',
    textPrimary: isDarkMode ? '#ffffff' : '#1f2937',
    textSecondary: isDarkMode ? '#9ca3af' : '#6b7280',
    borderColor: isDarkMode ? 'rgba(236, 72, 153, 0.2)' : 'rgba(236, 72, 153, 0.3)',
    cardBg: isDarkMode ? 'linear-gradient(135deg, rgba(30, 30, 46, 0.8) 0%, rgba(50, 30, 50, 0.8) 100%)' : 'linear-gradient(135deg, rgba(248, 249, 250, 0.9) 0%, rgba(230, 240, 255, 0.9) 100%)'
  };

  /* import api at top of file is assumed, but I need to check if I can add valid import if missing */
  // Actually, I should use multi_replace to add import and change handler.

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = `PSU-${Date.now().toString().slice(-8)}`;
    setTrackingId(id);

    const newReview = {
      ...formData,
      id,
      status: 'Pending Review',
      submittedDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    // Save to localStorage (for offline access)
    const existingReviews = JSON.parse(localStorage.getItem('psuReviews') || '[]');
    existingReviews.push(newReview);
    localStorage.setItem('psuReviews', JSON.stringify(existingReviews));

    // Send to MongoDB backend
    try {
      // Generate a valid 10-digit phone number from email or use a default
      const phoneFromEmail = formData.email?.replace(/[^0-9]/g, '').slice(-10) || '9876543210';
      const phone = phoneFromEmail.length === 10 ? phoneFromEmail : '9876543210';

      // Format description to include all review details since backend Feedback model is strict
      const description = `
PSU Review: ${formData.title}

Product Details:
Brand: ${formData.brand}
Model: ${formData.model}
Wattage: ${formData.wattage}
Efficiency: ${formData.efficiency}
Modular: ${formData.modular}
Price: ${formData.price}

Ratings:
Overall: ${formData.rating}/5
Performance: ${formData.performance}/5
Noise: ${formData.noise}/5
Value: ${formData.value}/5
Build Quality: ${formData.buildQuality}/5

Review:
${formData.review}

Pros: ${formData.pros}
Cons: ${formData.cons}
Recommendation: ${formData.recommend}
      `.trim();

      const payload = {
        name: formData.name || 'PSU Reviewer',
        email: formData.email || 'reviewer@example.com',
        phone: phone,
        address: 'Not provided', // Required by backend
        issueType: 'Review',      // Changed from 'Other' to 'Review'
        priority: 'Medium',
        description: description
      };

      const response = await api.submitComplaint(payload);

      if (response && (response.success || response.status === 'success')) {
        console.log('Review saved to MongoDB successfully:', response);
        setSubmitted(true);
        toast.success('Review submitted successfully!');
      } else {
        const errorMsg = response.message || 'Unknown backend error';
        console.error('Failed to save to MongoDB:', errorMsg);
        toast.error('Backend error: ' + errorMsg);
        // Do NOT show success screen if backend failed
      }
    } catch (error) {
      console.error('Error sending data to backend:', error);
      toast.error('Failed to connect to server: ' + error.message);
      // Do NOT show success screen if connection failed
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const RatingStars = ({ field, value }) => (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          whileHover={{ scale: 1.25, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleRatingChange(field, star)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <Star
            size={24}
            style={{
              color: star <= value ? '#fbbf24' : isDarkMode ? '#4b5563' : '#d1d5db',
              fill: star <= value ? '#fbbf24' : 'none',
              transition: 'all 0.2s ease'
            }}
          />
        </motion.button>
      ))}
    </div>
  );

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: colors.bgPrimary, paddingTop: '5rem', paddingBottom: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ maxWidth: '48rem', width: '100%', padding: '0 1rem' }}
        >
          <motion.div
            style={{
              background: colors.cardBg,
              border: `2px solid ${colors.borderColor}`,
              borderRadius: '1.5rem',
              padding: '2rem',
              textAlign: 'center',
              boxShadow: isDarkMode ? '0 20px 60px rgba(236, 72, 153, 0.3)' : '0 20px 60px rgba(236, 72, 153, 0.2)',
              transition: 'all 0.3s ease'
            }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
              style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.3) 0%, rgba(244, 114, 182, 0.2) 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                border: '2px solid #22c55e',
                boxShadow: '0 0 30px rgba(34, 197, 94, 0.5)'
              }}
            >
              <CheckCircle size={48} color="#22c55e" />
            </motion.div>

            <h2 style={{ fontSize: '1.875rem', color: colors.textPrimary, marginBottom: '1rem', fontWeight: 'bold' }}>
              Review Submitted! 🎉
            </h2>
            <p style={{ color: colors.textSecondary, marginBottom: '1.5rem', fontSize: '1.05rem' }}>
              Thank you for sharing your PSU experience. Your review will be published after moderation.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                background: isDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)',
                border: `2px solid #22c55e`,
                borderRadius: '1rem',
                padding: '1.5rem',
                marginBottom: '1.5rem'
              }}
            >
              <p style={{ color: colors.textSecondary, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Your Tracking ID</p>
              <p style={{ fontSize: '1.5rem', color: '#22c55e', fontFamily: 'monospace', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {trackingId}
              </p>
              <p style={{ color: colors.textSecondary, fontSize: '0.875rem' }}>Save this ID to track your review status</p>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(34, 197, 94, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSubmitted(false);
                window.location.reload();
              }}
              style={{
                padding: '0.75rem 2rem',
                background: 'linear-gradient(to right, #22c55e, #16a34a)',
                border: 'none',
                color: 'white',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 10px 30px rgba(34, 197, 94, 0.4)',
                transition: 'all 0.3s ease'
              }}
            >
              <Sparkles size={20} />
              Submit Another Review
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.bgPrimary, paddingTop: '5rem', paddingBottom: '4rem', transition: 'all 0.3s ease', color: colors.textPrimary }}>
      <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '0 1rem' }}>
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '2rem' }}
        >
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ fontSize: '3rem', marginBottom: '1rem' }}
          >
            ⚡
          </motion.div>
          <h1 style={{ fontSize: '2.25rem', color: colors.textPrimary, marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Share Your <span style={{ color: '#22c55e' }}>PSU Experience</span>
          </h1>
          <p style={{ color: colors.textSecondary, fontSize: '1.125rem' }}>
            Help others make informed decisions with your honest review
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
        >
          {/* PSU Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{
              background: colors.cardBg,
              border: `2px solid ${colors.borderColor}`,
              borderRadius: '1.5rem',
              padding: '2rem',
              boxShadow: isDarkMode ? '0 8px 32px rgba(236, 72, 153, 0.2)' : '0 8px 32px rgba(236, 72, 153, 0.15)',
              transition: 'all 0.3s ease'
            }}
          >
            <h2 style={{ fontSize: '1.5rem', color: colors.textPrimary, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
              <Zap size={24} color="#22c55e" />
              Power Supply Info
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {[{ label: 'Brand *', name: 'brand', type: 'text', placeholder: 'e.g., Corsair' }, { label: 'Model *', name: 'model', type: 'text', placeholder: 'e.g., RM850x' }].map((field) => (
                <motion.div key={field.name} whileHover={{ y: -5 }}>
                  <label style={{ display: 'block', color: colors.textSecondary, marginBottom: '0.5rem', fontWeight: '500' }}>{field.label}</label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required
                    placeholder={field.placeholder}
                    style={{
                      width: '100%',
                      background: isDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)',
                      border: `1px solid ${colors.borderColor}`,
                      borderRadius: '0.75rem',
                      padding: '0.75rem 1rem',
                      color: colors.textPrimary,
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#22c55e'; e.target.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.3)'; }}
                    onBlur={(e) => { e.target.style.borderColor = colors.borderColor; e.target.style.boxShadow = 'none'; }}
                  />
                </motion.div>
              ))}

              <motion.div whileHover={{ y: -5 }}>
                <label style={{ display: 'block', color: colors.textSecondary, marginBottom: '0.5rem', fontWeight: '500' }}>Wattage *</label>
                <select name="wattage" value={formData.wattage} onChange={handleChange} required style={{ width: '100%', background: isDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)', border: `1px solid ${colors.borderColor}`, borderRadius: '0.75rem', padding: '0.75rem 1rem', color: colors.textPrimary, fontSize: '1rem', outline: 'none', transition: 'all 0.3s ease', cursor: 'pointer' }} onFocus={(e) => { e.target.style.borderColor = '#22c55e'; e.target.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.3)'; }} onBlur={(e) => { e.target.style.borderColor = colors.borderColor; e.target.style.boxShadow = 'none'; }}>
                  <option value="">Select wattage</option>
                  {['450W', '550W', '650W', '750W', '850W', '1000W', '1200W', '1600W'].map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </motion.div>

              <motion.div whileHover={{ y: -5 }}>
                <label style={{ display: 'block', color: colors.textSecondary, marginBottom: '0.5rem', fontWeight: '500' }}>Efficiency *</label>
                <select name="efficiency" value={formData.efficiency} onChange={handleChange} required style={{ width: '100%', background: isDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)', border: `1px solid ${colors.borderColor}`, borderRadius: '0.75rem', padding: '0.75rem 1rem', color: colors.textPrimary, fontSize: '1rem', outline: 'none', transition: 'all 0.3s ease', cursor: 'pointer' }} onFocus={(e) => { e.target.style.borderColor = '#22c55e'; e.target.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.3)'; }} onBlur={(e) => { e.target.style.borderColor = colors.borderColor; e.target.style.boxShadow = 'none'; }}>
                  <option value="">Select efficiency</option>
                  {['80+ Bronze', '80+ Silver', '80+ Gold', '80+ Platinum', '80+ Titanium'].map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </motion.div>
            </div>
          </motion.div>

          {/* Ratings Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{
              background: colors.cardBg,
              border: `2px solid ${colors.borderColor}`,
              borderRadius: '1.5rem',
              padding: '2rem',
              boxShadow: isDarkMode ? '0 8px 32px rgba(236, 72, 153, 0.2)' : '0 8px 32px rgba(236, 72, 153, 0.15)',
              transition: 'all 0.3s ease'
            }}
          >
            <h2 style={{ fontSize: '1.5rem', color: colors.textPrimary, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
              <Star size={24} color="#fbbf24" />
              Rate Your Experience
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[{ field: 'rating', label: 'Overall Rating' }, { field: 'performance', label: 'Performance' }, { field: 'noise', label: 'Noise Level' }, { field: 'value', label: 'Value for Money' }].map((item) => (
                <motion.div key={item.field} whileHover={{ x: 5 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ color: colors.textSecondary, fontWeight: '500' }}>{item.label}</label>
                  <RatingStars field={item.field} value={formData[item.field]} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Review Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              background: colors.cardBg,
              border: `2px solid ${colors.borderColor}`,
              borderRadius: '1.5rem',
              padding: '2rem',
              boxShadow: isDarkMode ? '0 8px 32px rgba(236, 72, 153, 0.2)' : '0 8px 32px rgba(236, 72, 153, 0.15)',
              transition: 'all 0.3s ease'
            }}
          >
            <h2 style={{ fontSize: '1.5rem', color: colors.textPrimary, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
              <Award size={24} color="#22c55e" />
              Review Details
            </h2>

            {[{ name: 'title', label: 'Review Title *', placeholder: 'Summarize your review', type: 'text' }, { name: 'review', label: 'Your Review *', placeholder: 'Share your detailed experience...', type: 'textarea' }, { name: 'pros', label: 'Pros', placeholder: 'What do you like?', type: 'textarea' }, { name: 'cons', label: 'Cons', placeholder: 'What could be improved?', type: 'textarea' }].map((field) => (
              <motion.div key={field.name} whileHover={{ y: -5 }} style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: colors.textSecondary, marginBottom: '0.5rem', fontWeight: '500' }}>{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea name={field.name} value={formData[field.name]} onChange={handleChange} placeholder={field.placeholder} rows={field.name === 'review' ? 5 : 3} style={{ width: '100%', background: isDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)', border: `1px solid ${colors.borderColor}`, borderRadius: '0.75rem', padding: '0.75rem 1rem', color: colors.textPrimary, fontSize: '1rem', outline: 'none', transition: 'all 0.3s ease', fontFamily: 'inherit', resize: 'vertical' }} onFocus={(e) => { e.target.style.borderColor = '#22c55e'; e.target.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.3)'; }} onBlur={(e) => { e.target.style.borderColor = colors.borderColor; e.target.style.boxShadow = 'none'; }} />
                ) : (
                  <input type={field.type} name={field.name} value={formData[field.name]} onChange={handleChange} placeholder={field.placeholder} required={field.label.includes('*')} style={{ width: '100%', background: isDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)', border: `1px solid ${colors.borderColor}`, borderRadius: '0.75rem', padding: '0.75rem 1rem', color: colors.textPrimary, fontSize: '1rem', outline: 'none', transition: 'all 0.3s ease' }} onFocus={(e) => { e.target.style.borderColor = '#22c55e'; e.target.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.3)'; }} onBlur={(e) => { e.target.style.borderColor = colors.borderColor; e.target.style.boxShadow = 'none'; }} />
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              background: colors.cardBg,
              border: `2px solid ${colors.borderColor}`,
              borderRadius: '1.5rem',
              padding: '2rem',
              boxShadow: isDarkMode ? '0 8px 32px rgba(236, 72, 153, 0.2)' : '0 8px 32px rgba(236, 72, 153, 0.15)',
              transition: 'all 0.3s ease'
            }}
          >
            <h2 style={{ fontSize: '1.5rem', color: colors.textPrimary, marginBottom: '1.5rem', fontWeight: 'bold' }}>Contact Information</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {[{ name: 'name', label: 'Name *', placeholder: 'Your name' }, { name: 'email', label: 'Email *', placeholder: 'your@email.com', type: 'email' }].map((field) => (
                <motion.div key={field.name} whileHover={{ y: -5 }}>
                  <label style={{ display: 'block', color: colors.textSecondary, marginBottom: '0.5rem', fontWeight: '500' }}>{field.label}</label>
                  <input type={field.type || 'text'} name={field.name} value={formData[field.name]} onChange={handleChange} required placeholder={field.placeholder} style={{ width: '100%', background: isDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)', border: `1px solid ${colors.borderColor}`, borderRadius: '0.75rem', padding: '0.75rem 1rem', color: colors.textPrimary, fontSize: '1rem', outline: 'none', transition: 'all 0.3s ease' }} onFocus={(e) => { e.target.style.borderColor = '#22c55e'; e.target.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.3)'; }} onBlur={(e) => { e.target.style.borderColor = colors.borderColor; e.target.style.boxShadow = 'none'; }} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(34, 197, 94, 0.4)' }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%',
              padding: '1rem',
              background: 'linear-gradient(to right, #22c55e, #16a34a)',
              border: 'none',
              color: 'white',
              borderRadius: '0.75rem',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 10px 30px rgba(34, 197, 94, 0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            <Send size={20} />
            Submit Your Review
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
}
