import { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { api } from '../utils/api';
import { toast } from 'sonner@2.0.3';
import { useNavigate } from 'react-router-dom';

export function AdminLogin({ setIsAdmin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await api.adminLogin(formData.email, formData.password);
      
      if (response.success) {
        // Store token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        toast.success('Login successful!');
        setIsAdmin(true);
        navigate('/admin/dashboard');
      }
    } catch (error) {
      toast.error(error.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl p-8 border border-slate-200 dark:border-slate-800"
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500">
            <Lock className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl text-slate-900 dark:text-white text-center mb-2">
          Admin Login
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-center mb-8">
          Enter your credentials to access the admin panel
        </p>

        {/* Demo Credentials Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
            <strong>Demo Credentials:</strong>
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Email: <strong>admin@powersupply.com</strong>
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Password: <strong>Admin@12345</strong>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2">
              Email
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
                className="w-full pl-10 pr-12 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
