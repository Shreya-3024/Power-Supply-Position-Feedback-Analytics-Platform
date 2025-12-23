import { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, Star, Shield, DollarSign, Activity, Volume2, Award, CheckCircle, Box, Cpu, Thermometer, Wind, Wrench, Filter } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function SubmitReview() {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    wattage: '',
    efficiency: '',
    modular: '',
    price: '',
    purchaseDate: '',
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
    email: '',
    // Case Information
    caseName: '',
    caseManufacturer: '',
    caseModel: '',
    releaseYear: '',
    msrpPrice: '',
    caseType: '',
    // PSU Positioning
    psuPosition: '',
    psuSizeSupport: '',
    maxPsuLength: '',
    hasPsuShroud: '',
    psuShroudMaterial: '',
    psuChamberIsolated: '',
    psuShroudVentilation: '',
    bottomVentilation: '',
    clearanceBottom: '',
    fanSupportBottom: '',
    psuMountingStyle: '',
    vibrationDampening: '',
    dustFilterPsu: '',
    recommendedOrientation: '',
    psuCableRouting: '',
    psuCableGrommets: '',
    psuPowerCableAccess: '',
    // Thermal Performance
    thermalRating: '',
    idleTemperature: '',
    loadTemperature: '',
    ambientDuringTest: '',
    testComponents: '',
    noiseLevel: '',
    airflowScore: '',
    psuIntakeDustBuildup: '',
    psuExhaustBlocking: '',
    compatibilityIssues: '',
    // Installation
    installationDifficulty: '',
    cableManagementScore: '',
    toolRequired: '',
    accessibility: '',
    maintenanceEase: '',
    psuRemovalSteps: '',
    warrantyPeriod: '',
    aestheticRating: '',
    rgbSupport: '',
    overallRecommendation: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate tracking ID
    const id = `PSU-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setTrackingId(id);

    // Save to localStorage
    const existingReviews = JSON.parse(localStorage.getItem('psuReviews') || '[]');
    const newReview = {
      ...formData,
      id,
      status: 'Pending Review',
      submittedDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    existingReviews.push(newReview);
    localStorage.setItem('psuReviews', JSON.stringify(existingReviews));

    setSubmitted(true);
    toast.success('Review submitted successfully!');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (field: string, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const RatingStars = ({ field, value }: { field: string; value: number }) => (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleRatingChange(field, star)}
          className="focus:outline-none"
        >
          <Star
            className={`w-6 h-6 ${
              star <= value
                ? 'text-yellow-500 fill-yellow-500'
                : 'text-gray-600'
            }`}
          />
        </motion.button>
      ))}
    </div>
  );

  if (submitted) {
    return (
      <div className="min-h-screen bg-black pt-20 pb-16 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-2xl mx-auto px-4"
        >
          <div className="bg-slate-900/50 border border-green-500/50 rounded-xl p-8 shadow-lg shadow-pink-500/30 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-12 h-12 text-green-500" />
            </motion.div>
            
            <h2 className="text-3xl text-white mb-4">Review Submitted Successfully!</h2>
            <p className="text-gray-400 mb-6">
              Thank you for sharing your experience. Your review will be published after moderation.
            </p>
            
            <div className="bg-black/50 border border-green-500/30 rounded-lg p-6 mb-6">
              <p className="text-gray-400 text-sm mb-2">Your Tracking ID</p>
              <p className="text-2xl text-green-500 font-mono">{trackingId}</p>
              <p className="text-gray-500 text-sm mt-2">Save this ID to track your review status</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  brand: '',
                  model: '',
                  wattage: '',
                  efficiency: '',
                  modular: '',
                  price: '',
                  purchaseDate: '',
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
                  email: '',
                  // Case Information
                  caseName: '',
                  caseManufacturer: '',
                  caseModel: '',
                  releaseYear: '',
                  msrpPrice: '',
                  caseType: '',
                  // PSU Positioning
                  psuPosition: '',
                  psuSizeSupport: '',
                  maxPsuLength: '',
                  hasPsuShroud: '',
                  psuShroudMaterial: '',
                  psuChamberIsolated: '',
                  psuShroudVentilation: '',
                  bottomVentilation: '',
                  clearanceBottom: '',
                  fanSupportBottom: '',
                  psuMountingStyle: '',
                  vibrationDampening: '',
                  dustFilterPsu: '',
                  recommendedOrientation: '',
                  psuCableRouting: '',
                  psuCableGrommets: '',
                  psuPowerCableAccess: '',
                  // Thermal Performance
                  thermalRating: '',
                  idleTemperature: '',
                  loadTemperature: '',
                  ambientDuringTest: '',
                  testComponents: '',
                  noiseLevel: '',
                  airflowScore: '',
                  psuIntakeDustBuildup: '',
                  psuExhaustBlocking: '',
                  compatibilityIssues: '',
                  // Installation
                  installationDifficulty: '',
                  cableManagementScore: '',
                  toolRequired: '',
                  accessibility: '',
                  maintenanceEase: '',
                  psuRemovalSteps: '',
                  warrantyPeriod: '',
                  aestheticRating: '',
                  rgbSupport: '',
                  overallRecommendation: ''
                });
              }}
              className="px-8 py-3 bg-green-500/20 border border-green-500 text-green-400 rounded-lg hover:bg-green-500/30 transition-all shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50"
            >
              Submit Another Review
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl text-white mb-2">
            Submit <span className="text-green-500">Review</span>
          </h1>
          <p className="text-gray-400 text-lg">Share your power supply experience with the community</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-slate-900/50 border border-green-500/20 rounded-xl p-8 shadow-lg shadow-pink-500/20"
        >
          {/* PSU Information */}
          <div className="mb-8">
            <h2 className="text-2xl text-white mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-green-500" />
              Power Supply Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 mb-2">Brand *</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Corsair, Seasonic, EVGA"
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none focus:shadow-lg focus:shadow-pink-500/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Model *</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  required
                  placeholder="e.g., RM850x, FOCUS GX-750"
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none focus:shadow-lg focus:shadow-pink-500/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Wattage *</label>
                <select
                  name="wattage"
                  value={formData.wattage}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none focus:shadow-lg focus:shadow-pink-500/30 transition-all"
                >
                  <option value="">Select wattage</option>
                  <option value="450W">450W</option>
                  <option value="550W">550W</option>
                  <option value="650W">650W</option>
                  <option value="750W">750W</option>
                  <option value="850W">850W</option>
                  <option value="1000W">1000W</option>
                  <option value="1200W">1200W</option>
                  <option value="1600W">1600W</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Efficiency Rating *</label>
                <select
                  name="efficiency"
                  value={formData.efficiency}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none focus:shadow-lg focus:shadow-pink-500/30 transition-all"
                >
                  <option value="">Select efficiency</option>
                  <option value="80+ Bronze">80+ Bronze</option>
                  <option value="80+ Silver">80+ Silver</option>
                  <option value="80+ Gold">80+ Gold</option>
                  <option value="80+ Platinum">80+ Platinum</option>
                  <option value="80+ Titanium">80+ Titanium</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Modular Type *</label>
                <select
                  name="modular"
                  value={formData.modular}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none focus:shadow-lg focus:shadow-pink-500/30 transition-all"
                >
                  <option value="">Select type</option>
                  <option value="Fully Modular">Fully Modular</option>
                  <option value="Semi-Modular">Semi-Modular</option>
                  <option value="Non-Modular">Non-Modular</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Price Paid *</label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  placeholder="$99.99"
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none focus:shadow-lg focus:shadow-pink-500/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Purchase Date</label>
                <input
                  type="date"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none focus:shadow-lg focus:shadow-pink-500/30 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Ratings */}
          <div className="mb-8">
            <h2 className="text-2xl text-white mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500" />
              Ratings
            </h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Overall Rating</span>
                <RatingStars field="rating" value={formData.rating} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Performance</span>
                <RatingStars field="performance" value={formData.performance} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Noise Level (Quietness)</span>
                <RatingStars field="noise" value={formData.noise} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Value for Money</span>
                <RatingStars field="value" value={formData.value} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Build Quality</span>
                <RatingStars field="buildQuality" value={formData.buildQuality} />
              </div>
            </div>
          </div>

          {/* Review Content */}
          <div className="mb-8">
            <h2 className="text-2xl text-white mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-green-500" />
              Your Review
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-400 mb-2">Review Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Summarize your experience"
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none focus:shadow-lg focus:shadow-pink-500/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Detailed Review *</label>
                <textarea
                  name="review"
                  value={formData.review}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Share your detailed experience with this power supply..."
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none focus:shadow-lg focus:shadow-pink-500/30 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Pros</label>
                <textarea
                  name="pros"
                  value={formData.pros}
                  onChange={handleChange}
                  rows={3}
                  placeholder="What did you like? (separate with commas)"
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none focus:shadow-lg focus:shadow-pink-500/30 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Cons</label>
                <textarea
                  name="cons"
                  value={formData.cons}
                  onChange={handleChange}
                  rows={3}
                  placeholder="What could be improved? (separate with commas)"
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none focus:shadow-lg focus:shadow-pink-500/30 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Would you recommend this PSU? *</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="recommend"
                      value="yes"
                      checked={formData.recommend === 'yes'}
                      onChange={handleChange}
                      className="w-4 h-4 text-green-500"
                    />
                    <span className="text-white">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="recommend"
                      value="no"
                      checked={formData.recommend === 'no'}
                      onChange={handleChange}
                      className="w-4 h-4 text-green-500"
                    />
                    <span className="text-white">No</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="mb-8">
            <h2 className="text-2xl text-white mb-6">Contact Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 mb-2">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none focus:shadow-lg focus:shadow-pink-500/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none focus:shadow-lg focus:shadow-pink-500/30 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-green-500/20 border border-green-500 text-green-400 rounded-lg hover:bg-green-500/30 transition-all shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 text-lg font-medium"
          >
            Submit Review
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
}