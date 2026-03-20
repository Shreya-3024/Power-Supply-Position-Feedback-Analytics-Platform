import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, User, MapPin, AlertCircle, CheckCircle, Upload, X } from 'lucide-react';
import { api } from '../utils/api';
import { toast } from 'sonner@2.0.3';
import { useNavigate } from 'react-router-dom';

const ISSUE_TYPES = [
  'Power Outage',
  'Voltage Fluctuation',
  'Billing Issue',
  'Meter Problem',
  'Line Damage',
  'Other'
];

const PRIORITIES = [
  { value: 'Low', label: 'Low', icon: '🟢', color: 'green' },
  { value: 'Medium', label: 'Medium', icon: '🟡', color: 'yellow' },
  { value: 'High', label: 'High', icon: '🟠', color: 'orange' },
  { value: 'Critical', label: 'Critical', icon: '🔴', color: 'red' }
];

export function ComplaintForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [complaintId, setComplaintId] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    area: '',
    zone: '',
    issueType: '',
    description: '',
    priority: 'Medium',
    imageUrl: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (stepNum) => {
    const newErrors = {};

    if (stepNum === 1) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.area.trim()) newErrors.area = 'Area is required';
    }

    if (stepNum === 2) {
      if (!formData.issueType) newErrors.issueType = 'Please select an issue type';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(step)) return;

    try {
      setLoading(true);
      const response = await api.submitComplaint(formData);
      
      if (response.success) {
        setComplaintId(response.data.complaintId);
        setSubmitted(true);
        toast.success('Complaint submitted successfully!');
      }
    } catch (error) {
      toast.error('Failed to submit complaint. Please try again.');
      console.error('Error submitting complaint:', error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex p-6 rounded-full bg-green-100 dark:bg-green-900/30 mb-6"
          >
            <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
          </motion.div>
          
          <h2 className="text-3xl text-slate-900 dark:text-white mb-4">
            Complaint Submitted Successfully!
          </h2>
          
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Your complaint has been registered. Please save your complaint ID for tracking.
          </p>
          
          <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-6 mb-8">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Your Complaint ID</p>
            <p className="text-3xl text-blue-600 dark:text-blue-400 tracking-wider">
              {complaintId}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/track')}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Track Status
            </button>
            <button
              onClick={() => {
                setSubmitted(false);
                setStep(1);
                setFormData({
                  name: '',
                  phone: '',
                  email: '',
                  address: '',
                  area: '',
                  zone: '',
                  issueType: '',
                  description: '',
                  priority: 'Medium',
                  imageUrl: ''
                });
              }}
              className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Submit Another
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-600 dark:text-slate-400">Step {step} of 3</span>
          <span className="text-sm text-slate-600 dark:text-slate-400">{Math.round((step / 3) * 100)}% Complete</span>
        </div>
        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(step / 3) * 100}%` }}
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
          />
        </div>
      </div>

      {/* Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl p-8 border border-slate-200 dark:border-slate-800"
      >
        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <StepOne
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                nextStep={nextStep}
              />
            )}
            {step === 2 && (
              <StepTwo
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                setFormData={setFormData}
                nextStep={nextStep}
                prevStep={prevStep}
              />
            )}
            {step === 3 && (
              <StepThree
                formData={formData}
                setFormData={setFormData}
                prevStep={prevStep}
                loading={loading}
              />
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </div>
  );
}

function StepOne({ formData, errors, handleChange, nextStep }) {
  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
          <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl text-slate-900 dark:text-white">Personal Details</h2>
          <p className="text-slate-600 dark:text-slate-400">Let us know how to reach you</p>
        </div>
      </div>

      <div className="space-y-4">
        <InputField
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="John Doe"
          required
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            placeholder="+1 234 567 8900"
            required
          />
          <InputField
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="john@example.com"
          />
        </div>

        <InputField
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          error={errors.address}
          placeholder="123 Main Street"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Area"
            name="area"
            value={formData.area}
            onChange={handleChange}
            error={errors.area}
            placeholder="Downtown"
            required
          />
          <InputField
            label="Zone"
            name="zone"
            value={formData.zone}
            onChange={handleChange}
            error={errors.zone}
            placeholder="Zone A"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={nextStep}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all"
        >
          Next Step
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}

function StepTwo({ formData, errors, handleChange, setFormData, nextStep, prevStep }) {
  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-orange-100 dark:bg-orange-900/30">
          <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h2 className="text-2xl text-slate-900 dark:text-white">Issue Details</h2>
          <p className="text-slate-600 dark:text-slate-400">Describe the problem you're facing</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2">
            Issue Type <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {ISSUE_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, issueType: type }))}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.issueType === type
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'border-slate-200 dark:border-slate-700 hover:border-blue-400 text-slate-700 dark:text-slate-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          {errors.issueType && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.issueType}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Please describe the issue in detail..."
            className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Previous
        </button>
        <button
          type="button"
          onClick={nextStep}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all"
        >
          Next Step
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}

function StepThree({ formData, setFormData, prevStep, loading }) {
  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
          <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h2 className="text-2xl text-slate-900 dark:text-white">Priority & Review</h2>
          <p className="text-slate-600 dark:text-slate-400">Set priority and review your complaint</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm text-slate-700 dark:text-slate-300 mb-3">
            Priority Level
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PRIORITIES.map((priority) => (
              <button
                key={priority.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, priority: priority.value }))}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.priority === priority.value
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30'
                    : 'border-slate-200 dark:border-slate-700 hover:border-blue-400'
                }`}
              >
                <div className="text-2xl mb-1">{priority.icon}</div>
                <div className="text-sm text-slate-900 dark:text-white">{priority.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Review Summary */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 space-y-3">
          <h3 className="text-lg text-slate-900 dark:text-white mb-4">Complaint Summary</h3>
          <ReviewItem label="Name" value={formData.name} />
          <ReviewItem label="Phone" value={formData.phone} />
          <ReviewItem label="Area" value={formData.area} />
          <ReviewItem label="Issue Type" value={formData.issueType} />
          <ReviewItem label="Priority" value={formData.priority} />
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          disabled={loading}
        >
          <ArrowLeft className="w-5 h-5" />
          Previous
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Complaint'}
          <CheckCircle className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}

function InputField({ label, name, type = 'text', value, onChange, error, placeholder, required = false }) {
  return (
    <div>
      <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
        }`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

function ReviewItem({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-slate-600 dark:text-slate-400">{label}:</span>
      <span className="text-slate-900 dark:text-white">{value}</span>
    </div>
  );
}
