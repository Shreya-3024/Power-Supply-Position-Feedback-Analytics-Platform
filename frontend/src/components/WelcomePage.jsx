import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Zap, TrendingUp, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../utils/api';

export function WelcomePage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    resolvedToday: 0,
    avgResolutionTime: '0'
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Electric icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <Zap className="w-24 h-24 text-blue-600 dark:text-blue-400" />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-blue-500 blur-2xl"
              />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-7xl mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent animate-gradient"
          >
            Power Supply Feedback Portal
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 max-w-3xl mx-auto"
          >
            Report power issues instantly and track resolutions in real-time. 
            Your voice matters in building a reliable power infrastructure.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => navigate('/submit')}
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:scale-105"
            >
              <span className="flex items-center gap-2 justify-center">
                Report an Issue
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button
              onClick={() => navigate('/track')}
              className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-slate-200 dark:border-slate-700"
            >
              Track Complaint Status
            </button>
          </motion.div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20"
        >
          <StatCard
            icon={TrendingUp}
            value={stats.total.toLocaleString()}
            label="Total Complaints"
            color="blue"
            delay={0.7}
          />
          <StatCard
            icon={CheckCircle}
            value={stats.resolvedToday.toString()}
            label="Resolved Today"
            color="green"
            delay={0.8}
          />
          <StatCard
            icon={Clock}
            value={`${stats.avgResolutionTime}h`}
            label="Avg Response Time"
            color="purple"
            delay={0.9}
          />
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <FeatureCard
            title="Quick Reporting"
            description="Submit complaints in under 2 minutes with our streamlined form"
            icon="⚡"
          />
          <FeatureCard
            title="Real-time Tracking"
            description="Monitor your complaint status with live updates and notifications"
            icon="📍"
          />
          <FeatureCard
            title="Fast Resolution"
            description="Our dedicated team works round the clock to resolve issues quickly"
            icon="✅"
          />
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, value, label, color, delay }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 from-blue-500/50 to-purple-500/50" />
      <div className="relative backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all">
        <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} text-white mb-4`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="text-3xl text-slate-900 dark:text-white mb-2">
          {value}
        </div>
        <div className="text-slate-600 dark:text-slate-400">{label}</div>
      </div>
    </motion.div>
  );
}

function FeatureCard({ title, description, icon }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400">{description}</p>
    </motion.div>
  );
}
