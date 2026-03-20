import { motion } from 'motion/react';
import { CheckCircle } from 'lucide-react';

export function Timeline({ history }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      {history.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex gap-4"
        >
          {/* Timeline dot */}
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            {index < history.length - 1 && (
              <div className="w-0.5 flex-1 bg-slate-200 dark:bg-slate-700 mt-2" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pb-8">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-slate-900 dark:text-white">{item.status}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                by {item.updatedBy}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {formatDate(item.updatedAt)}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
