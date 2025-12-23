import React, { useState, useEffect } from 'react';
import { ChevronRight, Filter, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch submissions
  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/feedback?limit=100', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      setSubmissions(data.data || []);
      calculateStats(data.data || []);
    } catch (error) {
      toast.error('Failed to load submissions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const stats = {
      total: data.length,
      pending: data.filter(s => s.status === 'pending').length,
      approved: data.filter(s => s.status === 'approved').length,
      rejected: data.filter(s => s.status === 'rejected').length,
    };
    setStats(stats);
  };

  // Filter submissions
  useEffect(() => {
    let filtered = submissions;

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(s => s.status === selectedStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.psuModel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.case?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSubmissions(filtered);
  }, [selectedStatus, searchTerm, submissions]);

  // Handle bulk action
  const handleBulkApprove = async () => {
    if (selectedRows.size === 0) {
      toast.error('No submissions selected');
      return;
    }

    try {
      const ids = Array.from(selectedRows);
      const response = await fetch('http://localhost:5000/api/feedback/bulk-update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ids, status: 'approved' })
      });

      if (!response.ok) throw new Error('Failed to update');

      toast.success(`${ids.length} submissions approved! ✅`);
      setSelectedRows(new Set());
      fetchSubmissions();
    } catch (error) {
      toast.error('Failed to approve submissions');
    }
  };

  const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="text-white" size={24} />
      </div>
      <div>
        <p className="text-slate-400 text-sm font-medium">{label}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard 👑</h1>
          <p className="text-slate-400">Manage user feedback submissions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Submissions"
            value={stats.total}
            icon={CheckCircle}
            color="bg-blue-600"
          />
          <StatCard
            label="Pending"
            value={stats.pending}
            icon={Clock}
            color="bg-yellow-600"
          />
          <StatCard
            label="Approved"
            value={stats.approved}
            icon={CheckCircle}
            color="bg-green-600"
          />
          <StatCard
            label="Rejected"
            value={stats.rejected}
            icon={XCircle}
            color="bg-red-600"
          />
        </div>

        {/* Controls */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-6 backdrop-blur">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search by PSU model or case..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
                <Filter size={16} /> Filter by Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Submissions</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Bulk Actions */}
            <button
              onClick={handleBulkApprove}
              disabled={selectedRows.size === 0}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Approve Selected ({selectedRows.size})
            </button>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg backdrop-blur overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-slate-400">Loading submissions...</p>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-slate-400">No submissions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-900/50">
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRows(
                              new Set(filteredSubmissions.map((_, i) => i))
                            );
                          } else {
                            setSelectedRows(new Set());
                          }
                        }}
                        className="w-4 h-4 rounded accent-blue-600"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                      PSU Model
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                      Case
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map((submission, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-slate-700 hover:bg-slate-700/30 transition"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(idx)}
                          onChange={(e) => {
                            const newSelected = new Set(selectedRows);
                            if (e.target.checked) {
                              newSelected.add(idx);
                            } else {
                              newSelected.delete(idx);
                            }
                            setSelectedRows(newSelected);
                          }}
                          className="w-4 h-4 rounded accent-blue-600"
                        />
                      </td>
                      <td className="px-6 py-4 text-white font-medium">
                        {submission.psuModel}
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {submission.case}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            submission.status === 'pending'
                              ? 'bg-yellow-600/30 text-yellow-200'
                              : submission.status === 'approved'
                              ? 'bg-green-600/30 text-green-200'
                              : 'bg-red-600/30 text-red-200'
                          }`}
                        >
                          {submission.status.charAt(0).toUpperCase() +
                            submission.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm">
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedSubmission(submission)}
                          className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition"
                        >
                          <Eye size={16} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail View Modal */}
        {selectedSubmission && (
          <SubmissionDetailView
            submission={selectedSubmission}
            onClose={() => setSelectedSubmission(null)}
            onUpdate={fetchSubmissions}
          />
        )}
      </div>
    </div>
  );
};

// Submission Detail View Component
const SubmissionDetailView = ({ submission, onClose, onUpdate }) => {
  const [adminNotes, setAdminNotes] = useState(submission.adminNotes || '');
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState(submission.status);

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true);
      const response = await fetch(
        `http://localhost:5000/api/feedback/${submission._id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            status: newStatus,
            adminNotes
          })
        }
      );

      if (!response.ok) throw new Error('Failed to update');

      toast.success(`Submission ${newStatus}! ✅`);
      setStatus(newStatus);
      onUpdate();
      setTimeout(onClose, 1500);
    } catch (error) {
      toast.error('Failed to update submission');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/80 backdrop-blur border-b border-slate-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Submission Details</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side: User Submission */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-white mb-4">User's Submission 📝</h3>

            {/* Basic Info */}
            <div className="bg-slate-700/50 rounded-lg p-4 mb-4 border border-slate-600">
              <h4 className="font-semibold text-white mb-2">Basic Information</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-slate-400">Case:</p>
                  <p className="text-white font-medium">{submission.case}</p>
                </div>
                <div>
                  <p className="text-slate-400">PSU Model:</p>
                  <p className="text-white font-medium">{submission.psuModel}</p>
                </div>
                <div>
                  <p className="text-slate-400">Placement:</p>
                  <p className="text-white font-medium capitalize">{submission.placement}</p>
                </div>
                {submission.fanDirection && (
                  <div>
                    <p className="text-slate-400">Fan Direction:</p>
                    <p className="text-white font-medium capitalize">{submission.fanDirection}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Performance Ratings */}
            <div className="bg-slate-700/50 rounded-lg p-4 mb-4 border border-slate-600">
              <h4 className="font-semibold text-white mb-2">Performance Ratings</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-slate-400">Temperature:</p>
                  <p className="text-white font-medium">
                    {['', 'Cooler', 'Slightly Cooler', 'Same', 'Slightly Hotter', 'Hotter'][submission.temperature]}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Noise Level:</p>
                  <p className="text-white font-medium">
                    {['', 'Silent', 'Quiet', 'Normal', 'Loud', 'Very Noisy'][submission.noiseLevel]}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Installation:</p>
                  <p className="text-white font-medium">{'⭐'.repeat(submission.installation)}</p>
                </div>
                <div>
                  <p className="text-slate-400">Recommend:</p>
                  <p className="text-white font-medium">{submission.recommend ? '✅ Yes' : '❌ No'}</p>
                </div>
              </div>
            </div>

            {/* Notes */}
            {submission.notes && (
              <div className="bg-slate-700/50 rounded-lg p-4 mb-4 border border-slate-600">
                <h4 className="font-semibold text-white mb-2">User Notes</h4>
                <p className="text-slate-300 text-sm">{submission.notes}</p>
              </div>
            )}

            {/* Problems */}
            {submission.problems && submission.problems.length > 0 && (
              <div className="bg-slate-700/50 rounded-lg p-4 mb-4 border border-slate-600">
                <h4 className="font-semibold text-white mb-2">Reported Problems</h4>
                <div className="flex flex-wrap gap-2">
                  {submission.problems.map((problem, idx) => (
                    <span
                      key={idx}
                      className="bg-red-600/30 text-red-200 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {problem}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Photos */}
            {submission.photos && submission.photos.length > 0 && (
              <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                <h4 className="font-semibold text-white mb-2">Uploaded Photos</h4>
                <div className="grid grid-cols-3 gap-2">
                  {submission.photos.map((photo, idx) => (
                    <img
                      key={idx}
                      src={photo}
                      alt="submission"
                      className="w-full h-24 object-cover rounded border border-slate-500"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Admin Tools */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold text-white mb-4">Admin Tools ⚙️</h3>

            {/* Status */}
            <div className="bg-slate-700/50 rounded-lg p-4 mb-4 border border-slate-600">
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm mb-4"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              <div className="flex gap-2">
                <button
                  onClick={() => handleStatusUpdate('approved')}
                  disabled={updating}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white font-semibold py-2 rounded transition text-sm"
                >
                  ✓ Approve
                </button>
                <button
                  onClick={() => handleStatusUpdate('rejected')}
                  disabled={updating}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-slate-600 text-white font-semibold py-2 rounded transition text-sm"
                >
                  ✕ Reject
                </button>
              </div>
            </div>

            {/* Admin Notes */}
            <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Admin Notes
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add verification notes..."
                rows="6"
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400 text-sm resize-none"
              />
              <button
                onClick={() => handleStatusUpdate(status)}
                disabled={updating}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-semibold py-2 rounded transition mt-2"
              >
                Save Changes
              </button>
            </div>

            {/* Metadata */}
            <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 mt-4 text-sm">
              <p className="text-slate-400 mb-1">
                <span className="font-semibold">Submitted:</span>{' '}
                {new Date(submission.createdAt).toLocaleDateString()}
              </p>
              <p className="text-slate-400">
                <span className="font-semibold">ID:</span>{' '}
                <code className="text-xs bg-slate-800 px-2 py-1 rounded">
                  {submission._id?.slice(-8)}
                </code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
