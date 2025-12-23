import { motion } from 'motion/react';
import { Calendar, MapPin, AlertCircle, User, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { StatusBadge } from './StatusBadge';
import { Timeline } from './Timeline';

export function ComplaintCard({ complaint, delay = 0, onUpdate, showActions = false }) {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority) => {
    const colors = {
      Low: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
      Medium: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30',
      High: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30',
      Critical: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
    };
    return colors[priority] || colors.Medium;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="relative group"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 rounded-2xl" />
      
      {/* Card */}
      <div className="relative backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 group-hover:border-blue-500/50 transition-all">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl text-slate-900 dark:text-white">
                {complaint.complaintId}
              </h3>
              <StatusBadge status={complaint.status} />
              <span className={`px-3 py-1 rounded-full text-xs ${getPriorityColor(complaint.priority)}`}>
                {complaint.priority}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              {complaint.issueType}
            </p>
          </div>
          
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {expanded ? (
              <ChevronUp className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            )}
          </button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <InfoItem icon={User} label="Name" value={complaint.name} />
          <InfoItem icon={MapPin} label="Area" value={`${complaint.area}${complaint.zone ? ` - ${complaint.zone}` : ''}`} />
          <InfoItem icon={Calendar} label="Submitted" value={formatDate(complaint.createdAt)} />
          <InfoItem icon={Calendar} label="Last Updated" value={formatDate(complaint.updatedAt)} />
        </div>

        {/* Description */}
        <div className="mb-4">
          <p className="text-slate-700 dark:text-slate-300 text-sm">
            {complaint.description}
          </p>
        </div>

        {/* Expanded Content */}
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4"
          >
            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Contact</p>
                <p className="text-slate-900 dark:text-white">{complaint.phone}</p>
                {complaint.email && (
                  <p className="text-slate-900 dark:text-white text-sm">{complaint.email}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Address</p>
                <p className="text-slate-900 dark:text-white">{complaint.address}</p>
              </div>
              {complaint.assignedTo && (
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Assigned To</p>
                  <p className="text-slate-900 dark:text-white">{complaint.assignedTo}</p>
                </div>
              )}
              {complaint.estimatedResolution && (
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Estimated Resolution</p>
                  <p className="text-slate-900 dark:text-white">{formatDate(complaint.estimatedResolution)}</p>
                </div>
              )}
            </div>

            {/* Timeline */}
            {complaint.statusHistory && complaint.statusHistory.length > 0 && (
              <div>
                <h4 className="text-lg text-slate-900 dark:text-white mb-4">Status History</h4>
                <Timeline history={complaint.statusHistory} />
              </div>
            )}

            {/* Admin Actions */}
            {showActions && onUpdate && (
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => onUpdate(complaint._id, { status: 'In Progress' })}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                  disabled={complaint.status === 'In Progress'}
                >
                  Mark In Progress
                </button>
                <button
                  onClick={() => onUpdate(complaint._id, { status: 'Resolved', actualResolution: new Date() })}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  disabled={complaint.status === 'Resolved'}
                >
                  Mark Resolved
                </button>
                <button
                  onClick={() => onUpdate(complaint._id, { status: 'Closed' })}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm"
                  disabled={complaint.status === 'Closed'}
                >
                  Close Complaint
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-4 h-4 text-slate-400 mt-0.5" />
      <div>
        <p className="text-xs text-slate-600 dark:text-slate-400">{label}</p>
        <p className="text-sm text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}
