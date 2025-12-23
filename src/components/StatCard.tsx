import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  change?: string;
  color: 'blue' | 'yellow' | 'orange' | 'green' | 'purple' | 'teal' | 'red';
  delay?: number;
  pulse?: boolean;
}

export function StatCard({ icon: Icon, label, value, change, color, delay = 0, pulse = false }: StatCardProps) {
  const colorClasses = {
    blue: {
      gradient: 'from-blue-500 to-blue-600',
      text: 'text-blue-600 dark:text-blue-400',
      glow: 'from-blue-500/50 to-blue-600/50'
    },
    yellow: {
      gradient: 'from-yellow-500 to-yellow-600',
      text: 'text-yellow-600 dark:text-yellow-400',
      glow: 'from-yellow-500/50 to-yellow-600/50'
    },
    orange: {
      gradient: 'from-orange-500 to-orange-600',
      text: 'text-orange-600 dark:text-orange-400',
      glow: 'from-orange-500/50 to-orange-600/50'
    },
    green: {
      gradient: 'from-green-500 to-green-600',
      text: 'text-green-600 dark:text-green-400',
      glow: 'from-green-500/50 to-green-600/50'
    },
    purple: {
      gradient: 'from-purple-500 to-purple-600',
      text: 'text-purple-600 dark:text-purple-400',
      glow: 'from-purple-500/50 to-purple-600/50'
    },
    teal: {
      gradient: 'from-teal-500 to-teal-600',
      text: 'text-teal-600 dark:text-teal-400',
      glow: 'from-teal-500/50 to-teal-600/50'
    },
    red: {
      gradient: 'from-red-500 to-red-600',
      text: 'text-red-600 dark:text-red-400',
      glow: 'from-red-500/50 to-red-600/50'
    }
  };

  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="relative group"
    >
      {/* Glow effect on hover */}
      <div className={`absolute inset-0 bg-gradient-to-r ${colors.glow} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500`} />
      
      {/* Card content */}
      <div className="relative backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 group-hover:border-blue-500/50 transition-all">
        <div className="flex items-start justify-between mb-4">
          <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${colors.gradient} text-white ${pulse ? 'animate-pulse' : ''}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="text-3xl text-slate-900 dark:text-white">
            {value}
          </div>
          <div className="text-slate-600 dark:text-slate-400">
            {label}
          </div>
          {change && (
            <div className={`text-sm ${colors.text}`}>
              {change}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
