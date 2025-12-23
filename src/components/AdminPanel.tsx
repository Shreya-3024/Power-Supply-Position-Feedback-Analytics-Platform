import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Search, Trash2, Edit, BarChart3, Download } from 'lucide-react';
import { api } from '../utils/api';
import { toast } from 'sonner@2.0.3';
import { ComplaintCard } from './ComplaintCard';

export function AdminPanel() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  });

  useEffect(() => {
    loadComplaints();
    loadStats();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [complaints, searchQuery, statusFilter]);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const response = await api.getComplaints();
      if (response.success) {
        setComplaints(response.data);
      }
    } catch (error) {
      console.error('Error loading complaints:', error);
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

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

  const applyFilters = () => {
    let filtered = [...complaints];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.complaintId.toLowerCase().includes(query) ||
        c.name.toLowerCase().includes(query) ||
        c.area.toLowerCase().includes(query) ||
        c.phone.includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    setFilteredComplaints(filtered);
  };

  const handleUpdateComplaint = async (id: string, updates: any) => {
    try {
      const response = await api.updateComplaint(id, updates);
      if (response.success) {
        toast.success('Complaint updated successfully');
        loadComplaints();
        loadStats();
      }
    } catch (error) {
      console.error('Error updating complaint:', error);
      toast.error('Failed to update complaint');
    }
  };

  const handleDeleteComplaint = async (id: string) => {
    if (!confirm('Are you sure you want to delete this complaint?')) {
      return;
    }

    try {
      await api.deleteComplaint(id);
      toast.success('Complaint deleted successfully');
      loadComplaints();
      loadStats();
    } catch (error) {
      console.error('Error deleting complaint:', error);
      toast.error('Failed to delete complaint');
    }
  };

  const exportToCSV = () => {
    const headers = ['Complaint ID', 'Name', 'Phone', 'Area', 'Issue Type', 'Status', 'Priority', 'Created At'];
    const rows = filteredComplaints.map(c => [
      c.complaintId,
      c.name,
      c.phone,
      c.area,
      c.issueType,
      c.status,
      c.priority,
      new Date(c.createdAt).toLocaleDateString()
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `complaints-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('CSV exported successfully');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl text-slate-900 dark:text-white">
              Admin Panel
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage and monitor all complaints
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total" value={stats.total} color="blue" />
        <StatCard label="Pending" value={stats.pending} color="yellow" />
        <StatCard label="In Progress" value={stats.inProgress} color="orange" />
        <StatCard label="Resolved" value={stats.resolved} color="green" />
      </div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 mb-8"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, name, area, or phone..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>

          {/* Export Button */}
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            Export CSV
          </button>
        </div>

        <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          Showing {filteredComplaints.length} of {complaints.length} complaints
        </div>
      </motion.div>

      {/* Complaints List */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400">No complaints found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredComplaints.map((complaint, index) => (
            <div key={complaint._id} className="relative">
              <ComplaintCard
                complaint={complaint}
                delay={index * 0.1}
                onUpdate={handleUpdateComplaint}
                showActions={true}
              />
              <button
                onClick={() => handleDeleteComplaint(complaint._id)}
                className="absolute top-6 right-6 p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                aria-label="Delete complaint"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: any) {
  const colorClasses: any = {
    blue: 'from-blue-500 to-blue-600',
    yellow: 'from-yellow-500 to-yellow-600',
    orange: 'from-orange-500 to-orange-600',
    green: 'from-green-500 to-green-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-xl p-6 border border-slate-200 dark:border-slate-800"
    >
      <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${colorClasses[color]} text-white mb-2`}>
        <BarChart3 className="w-4 h-4" />
      </div>
      <div className="text-3xl text-slate-900 dark:text-white mb-1">{value}</div>
      <div className="text-sm text-slate-600 dark:text-slate-400">{label}</div>
    </motion.div>
  );
}
