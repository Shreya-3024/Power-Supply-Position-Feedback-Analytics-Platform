import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, AlertCircle, Loader } from 'lucide-react';
import { toast } from 'sonner';

export function AdminLogin() {
  const [email, setEmail] = useState('admin@powersupply.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);

      // Call backend login
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Check if user is admin
      if (data.data.role !== 'admin' && data.data.email !== 'admin@powersupply.com') {
        throw new Error('Access denied. Admin credentials required.');
      }

      // Store token and user info
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.data._id,
        name: data.data.name,
        email: data.data.email,
        role: data.data.role,
        isAdmin: true
      }));

      toast.success('Admin login successful! 🎉');
      navigate('/admin/dashboard');
    } catch (err) {
      const errorMsg = err.message || 'Login failed';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 backdrop-blur">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg mb-4">
              <Lock className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
            <p className="text-slate-400">Administrators only</p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-600/20 border border-red-600/50 rounded-lg flex items-start gap-3"
            >
              <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-200 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 mb-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@powersupply.com"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Logging in...
                </>
              ) : (
                '🔐 Admin Login'
              )}
            </button>
          </form>

          {/* Info Box */}
          <div className="bg-blue-600/20 border border-blue-600/50 rounded-lg p-4">
            <p className="text-xs text-slate-300 mb-2">
              <span className="font-semibold text-blue-200">Default Admin Credentials:</span>
            </p>
            <p className="text-xs text-slate-400 mb-1">
              Email: <span className="text-slate-300 font-mono">admin@powersupply.com</span>
            </p>
            <p className="text-xs text-slate-400">
              Password: <span className="text-slate-300 font-mono">Admin@123456</span>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-slate-400 hover:text-slate-200 text-sm transition"
            >
              ← Back to Home
            </a>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-6">
          If you're not an administrator, please use the regular login
        </p>
      </motion.div>
    </div>
  );
}

export default AdminLogin;
