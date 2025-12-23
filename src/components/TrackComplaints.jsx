import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, AlertCircle, Clock, CheckCircle, Activity } from 'lucide-react';
import { api } from '../utils/api';
import { ComplaintCard } from './ComplaintCard';
import { StatusBadge } from './StatusBadge';

export function TrackComplaints() {
  const [searchType, setSearchType] = useState('id');
  const [searchQuery, setSearchQuery] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    loadAllComplaints();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [complaints, statusFilter, sortBy]);

  const loadAllComplaints = async () => {
    try {
      setLoading(true);
      const response = await api.getComplaints();
      if (response.success) {
        setComplaints(response.data);
      }
    } catch (error) {
      console.error('Error loading complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadAllComplaints();
      return;
    }

    try {
      setLoading(true);
      let response;
      
      if (searchType === 'phone') {
        response = await api.trackByPhone(searchQuery);
      } else {
        response = await api.getComplaintById(searchQuery);
        if (response.success && response.data) {
          response.data = [response.data];
        }
      }

      if (response.success) {
        setComplaints(response.data || []);
      }
    } catch (error) {
      console.error('Error searching complaints:', error);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...complaints];

    // Status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    // Sort
    if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'priority') {
      const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
      filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }

    setFilteredComplaints(filtered);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl text-slate-900 dark:text-white mb-2">
          Track Complaints
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Search for your complaint by ID or phone number
        </p>
      </motion.div>

      {/* Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 mb-8"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Type Selector */}
          <div className="flex gap-2">
            <button
              onClick={() => setSearchType('id')}
              className={`px-4 py-2 rounded-lg transition-all ${
                searchType === 'id'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              By ID
            </button>
            <button
              onClick={() => setSearchType('phone')}
              className={`px-4 py-2 rounded-lg transition-all ${
                searchType === 'phone'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              By Phone
            </button>
          </div>

          {/* Search Input */}
          <div className="flex-1 flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  searchType === 'id'
                    ? 'Enter complaint ID (e.g., PWR2025001234)'
                    : 'Enter phone number'
                }
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-4 mb-6"
      >
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <span className="text-sm text-slate-600 dark:text-slate-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600 dark:text-slate-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>

        {/* Results Count */}
        <div className="ml-auto flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <span className="text-sm">
            {filteredComplaints.length} {filteredComplaints.length === 1 ? 'result' : 'results'}
          </span>
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <AlertCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl text-slate-900 dark:text-white mb-2">
            No complaints found
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Try adjusting your search or filters
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredComplaints.map((complaint, index) => (
            <ComplaintCard key={complaint._id} complaint={complaint} delay={index * 0.1} />
          ))}
        </div>
      )}
    </div>
  );
}
