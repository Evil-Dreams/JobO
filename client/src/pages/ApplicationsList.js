import React, { useState, useEffect, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Trash2,
  Edit2,
  ExternalLink,
  Plus,
  Eye,
  EyeOff,
  Calendar,
  MapPin,
  DollarSign,
  FileText,
  Link,
  Clock,
  CheckCircle,
  X
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { getApplications, createApplication, deleteApplication, updateApplication } from '../store/applicationsSlice';
import { AddJobModal } from '../components/AddJobModal';

const statusColors = {
  Applied: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20' },
  'Interview Scheduled': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  'Interview Completed': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  'Offer Received': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  'Offer Accepted': { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
  'Offer Declined': { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
  Rejected: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' }
};

export default function Applications() {
  const dispatch = useDispatch();
  const { applications } = useSelector((state) => state.applications);
  const [showModal, setShowModal] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, application: null });
  const [saveStatus, setSaveStatus] = useState({ show: false, type: '', message: '' });
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showFilters, setShowFilters] = useState(false);

  // Auto-hide save notification after 3 seconds
  useEffect(() => {
    if (saveStatus.show) {
      const timer = setTimeout(() => {
        setSaveStatus({ show: false, type: '', message: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus.show]);

  const handleViewApplication = (application) => {
    setExpandedRow(expandedRow === application._id ? null : application._id);
  };

  const handleEditApplication = (application) => {
    
    
    // Handle notes field - convert array to string if needed
    const notesText = Array.isArray(application.notes) 
      ? application.notes.map(note => note.content).join('\n')
      : application.notes || '';
    
    setEditingRow(application._id);
    setEditFormData({
      company: application.company || application.jobId?.company || '',
      position: application.position || application.jobId?.title || '',
      location: application.location || application.jobId?.location || '',
      salary: application.salary || application.jobId?.salary || '',
      jobUrl: application.jobUrl || application.jobId?.sourceLink || application.jobId?.url || '',
      status: application.status || 'Applied',
      notes: notesText
    });
  };

  const handleSaveEdit = async () => {
    
    try {
      // Clean up the form data to remove empty fields
      const cleanedData = Object.keys(editFormData).reduce((acc, key) => {
        const value = editFormData[key];
        // Include all fields, even empty ones, to ensure they're properly updated
        if (value !== undefined && value !== null) {
          // Handle notes field - convert string back to array format if needed
          if (key === 'notes') {
            acc[key] = value; // Server will handle the conversion
          } else {
            acc[key] = value;
          }
        }
        return acc;
      }, {});
      
      
      
      
      // Add timeline action for the edit
      cleanedData.timelineAction = 'Application details updated';
      
      
      
      // Dispatch the update action
      await dispatch(updateApplication({ id: editingRow, applicationData: cleanedData }));
      
      // Wait a moment for the server to process, then refresh the data
      setTimeout(async () => {
        try {
          await dispatch(getApplications());
          
          
          // Force a re-render by updating a dummy state
          const currentTime = new Date().getTime();
          setEditFormData(prev => ({ ...prev, _refresh: currentTime }));
          
          // Also force expanded row to refresh
          setExpandedRow(null);
          setTimeout(() => {
            setExpandedRow(editingRow);
          }, 100);
          
        } catch (refreshError) {
          console.error('Error refreshing applications list:', refreshError);
          setSaveStatus({ show: true, type: 'error', message: 'Application saved but failed to refresh UI' });
        }
      }, 1500); // Increased delay to ensure server processing
      
      // Close edit mode
      setEditingRow(null);
      setEditFormData({});
      
      
      // Show success message to user
      setSaveStatus({ show: true, type: 'success', message: 'Application saved successfully!' });
      
    } catch (error) {
      console.error('Error updating application:', error);
      console.error('Error details:', error.response?.data || error.message);
      
      // Show error message to user
      setSaveStatus({ show: true, type: 'error', message: `Failed to save application: ${error.response?.data?.message || error.message || 'Unknown error'}` });
    }
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
    setEditFormData({});
  };

  const handleEditFormChange = (field, value) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDeleteApplication = (application) => {
    setDeleteConfirm({ show: true, application });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.application) return;
    
    try {
      await dispatch(deleteApplication(deleteConfirm.application._id));
      setDeleteConfirm({ show: false, application: null });
    } catch (error) {
      console.error('Error deleting application:', error);
      alert('Failed to delete application. Please try again.');
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, application: null });
  };

  const handleViewJobPosting = (application) => {
    const jobUrl = application.jobUrl || application.jobId?.sourceLink || application.jobId?.url;
    
    if (jobUrl) {
      window.open(jobUrl, '_blank');
    } else {
      setSaveStatus({ show: true, type: 'error', message: 'No job posting link available for this application' });
    }
  };

  const handleAddApplication = async (jobData) => {
    try {
      await dispatch(createApplication(jobData));
      setShowModal(false);
    } catch (error) {
      console.error('Error adding application:', error);
    }
  };



  useEffect(() => {
    dispatch(getApplications());
  }, [dispatch]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+K or Cmd+K for search focus
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search applications"]');
        if (searchInput) {
          searchInput.focus();
        }
      }
      // Escape to clear search
      if (e.key === 'Escape' && searchTerm) {
        setSearchTerm('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchTerm]);

  // Filter applications based on search term, status, and date
  const filteredApplications = applications.filter(application => {
    const company = application.jobId?.company || application.company || '';
    const position = application.jobId?.title || application.position || '';
    const location = application.location || application.jobId?.location || '';
    const applicationDate = new Date(application.appliedAt || application.createdAt);
    
    // Search filter
    const matchesSearch = searchTerm === '' || 
      company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || application.status === statusFilter;
    
    // Date filter
    let matchesDate = true;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastQuarter = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
    
    switch (dateFilter) {
      case 'today':
        matchesDate = applicationDate >= today;
        break;
      case 'week':
        matchesDate = applicationDate >= thisWeek;
        break;
      case 'month':
        matchesDate = applicationDate >= thisMonth;
        break;
      case 'quarter':
        matchesDate = applicationDate >= lastQuarter;
        break;
      default:
        matchesDate = true;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Sort applications
  const sortedApplications = [...filteredApplications].sort((a, b) => {
    const dateA = new Date(a.appliedAt || a.createdAt);
    const dateB = new Date(b.appliedAt || b.createdAt);
    
    switch (sortBy) {
      case 'company':
        const companyA = a.jobId?.company || a.company || '';
        const companyB = b.jobId?.company || b.company || '';
        return companyA.localeCompare(companyB);
      case 'position':
        const positionA = a.jobId?.title || a.position || '';
        const positionB = b.jobId?.title || b.position || '';
        return positionA.localeCompare(positionB);
      case 'status':
        return a.status.localeCompare(b.status);
      case 'date':
      default:
        return dateB.getTime() - dateA.getTime(); // Newest first
    }
  });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Applications</h1>
          <p className="text-slate-400">
            Manage and track all your job applications in one place
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Application
        </motion.button>
      </div>

      {/* Enhanced Search and Filters - File Explorer Style */}
      <div className="bg-slate-900/30 border border-slate-800/50 rounded-xl p-4 space-y-4">
        {/* Search Bar with Quick Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Enhanced Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search applications... (Ctrl+K)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-12 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Status Filters */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm whitespace-nowrap">Quick Filter:</span>
            <div className="flex gap-1">
              {['all', 'Applied', 'Interview', 'Offer'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                    statusFilter === status
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {status === 'all' ? 'All' : status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                showFilters 
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                  : 'bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Filter className="w-4 h-4" />
              Advanced Filters
              {(statusFilter !== 'all' || searchTerm) && (
                <span className="px-2 py-1 bg-cyan-500/30 text-cyan-300 text-xs rounded-full">
                  Active
                </span>
              )}
            </button>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              >
                <option value="date">Date Applied</option>
                <option value="company">Company</option>
                <option value="position">Position</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-400">
              {filteredApplications.length} of {applications.length} applications
            </span>
            {searchTerm && (
              <span className="text-cyan-400">
                Searching: "{searchTerm}"
              </span>
            )}
          </div>
        </div>

        {/* Expanded Advanced Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-800/50 pt-4 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div>
                <label className="text-slate-400 text-sm mb-2 block">Application Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                >
                  <option value="all">All Status</option>
                  <option value="Applied">Applied</option>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                  <option value="Interview Completed">Interview Completed</option>
                  <option value="Offer Received">Offer Received</option>
                  <option value="Offer Accepted">Offer Accepted</option>
                  <option value="Offer Declined">Offer Declined</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="text-slate-400 text-sm mb-2 block">Date Applied</label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">Last 3 Months</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div>
                <label className="text-slate-400 text-sm mb-2 block">Actions</label>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setDateFilter('all');
                    setSortBy('date');
                  }}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Applications Table */}
      <motion.div className="overflow-x-auto rounded-xl border border-slate-800/50 bg-slate-900/30">
        <table className="w-full">
          <thead className="bg-slate-900/80 border-b border-slate-800/50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Company</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Position</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Match Score</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Date Applied</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/30">
            {sortedApplications.map((job, index) => {
              const company = job.jobId?.company || job.company || '';
              const position = job.jobId?.title || job.position || '';
              const isExpanded = expandedRow === job._id;
              
              return (
                <Fragment key={job._id}>
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold text-sm shadow-lg"
                          style={{ backgroundColor: job.logoColor || '#06b6d4' }}
                        >
                          {company.charAt(0)}
                        </div>
                        <span className="font-medium text-white">{company}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{position}</td>
                    <td className="px-6 py-4">
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                          statusColors[job.status]?.bg || statusColors.Applied.bg
                        } ${
                          statusColors[job.status]?.text || statusColors.Applied.text
                        } ${
                          statusColors[job.status]?.border || statusColors.Applied.border
                        }`}
                      >
                        {job.status}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-800/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"
                            style={{ width: `${job.successProbability || 75}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-cyan-400">{job.successProbability || 75}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {new Date(job.appliedAt || job.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleViewApplication(job)}
                          className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50 rounded-lg transition-colors"
                          title={isExpanded ? "Collapse Details" : "View Application"}
                        >
                          {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button 
                          onClick={() => handleViewJobPosting(job)}
                          className="p-2 text-slate-400 hover:text-green-400 hover:bg-slate-800/50 rounded-lg transition-colors"
                          title="View Job Posting"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteApplication(job)}
                          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/50 rounded-lg transition-colors"
                          title="Delete Application"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                  
                  {/* Expandable Detail Row */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td colSpan="6" className="px-0 py-0">
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-slate-800/30 border-l-4 border-cyan-500/50"
                          >
                            <div className="p-6 space-y-6">
                              {editingRow === job._id ? (
                                /* Edit Mode */
                                <div className="space-y-4">
                                  <h3 className="text-lg font-semibold text-white mb-4">Edit Application</h3>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-xs text-slate-500 mb-1">Company</label>
                                      <input
                                        type="text"
                                        value={editFormData.company}
                                        onChange={(e) => handleEditFormChange('company', e.target.value)}
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 outline-none"
                                        placeholder="Company name"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-slate-500 mb-1">Position</label>
                                      <input
                                        type="text"
                                        value={editFormData.position}
                                        onChange={(e) => handleEditFormChange('position', e.target.value)}
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 outline-none"
                                        placeholder="Job position"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-slate-500 mb-1">Location</label>
                                      <input
                                        type="text"
                                        value={editFormData.location}
                                        onChange={(e) => handleEditFormChange('location', e.target.value)}
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 outline-none"
                                        placeholder="Location"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-slate-500 mb-1">Salary</label>
                                      <input
                                        type="text"
                                        value={editFormData.salary}
                                        onChange={(e) => handleEditFormChange('salary', e.target.value)}
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 outline-none"
                                        placeholder="Salary"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-slate-500 mb-1">Job URL</label>
                                      <input
                                        type="url"
                                        value={editFormData.jobUrl}
                                        onChange={(e) => handleEditFormChange('jobUrl', e.target.value)}
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 outline-none"
                                        placeholder="Job posting URL"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-slate-500 mb-1">Status</label>
                                      <select
                                        value={editFormData.status}
                                        onChange={(e) => handleEditFormChange('status', e.target.value)}
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 outline-none"
                                      >
                                        <option value="Applied">Applied</option>
                                        <option value="Interview Scheduled">Interview Scheduled</option>
                                        <option value="Interview Completed">Interview Completed</option>
                                        <option value="Offer Received">Offer Received</option>
                                        <option value="Offer Accepted">Offer Accepted</option>
                                        <option value="Offer Declined">Offer Declined</option>
                                        <option value="Rejected">Rejected</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-xs text-slate-500 mb-1">Notes</label>
                                    <textarea
                                      value={editFormData.notes}
                                      onChange={(e) => handleEditFormChange('notes', e.target.value)}
                                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 outline-none"
                                      rows={4}
                                      placeholder="Additional notes..."
                                    />
                                  </div>
                                  
                                  {/* Edit Action Buttons */}
                                  <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-700/50">
                                    <button
                                      onClick={handleSaveEdit}
                                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors text-sm"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                      Save Changes
                                    </button>
                                    <button
                                      onClick={handleCancelEdit}
                                      className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors text-sm"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                /* View Mode */
                                <div className="space-y-6">
                                  {/* Header Info */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="flex items-center gap-3">
                                      <MapPin className="w-5 h-5 text-slate-500" />
                                      <div>
                                        <p className="text-xs text-slate-500">Location</p>
                                        <p className="text-sm text-white font-medium">
                                          {job.location || job.jobId?.location || 'Not specified'}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <DollarSign className="w-5 h-5 text-slate-500" />
                                      <div>
                                        <p className="text-xs text-slate-500">Salary</p>
                                        <p className="text-sm text-white font-medium">
                                          {job.salary || job.jobId?.salary || 'Not specified'}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <Calendar className="w-5 h-5 text-slate-500" />
                                      <div>
                                        <p className="text-xs text-slate-500">Applied Date</p>
                                        <p className="text-sm text-white font-medium">
                                          {new Date(job.appliedAt || job.createdAt).toLocaleDateString('en-US', {
                                            weekday: 'short',
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                          })}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <Clock className="w-5 h-5 text-slate-500" />
                                      <div>
                                        <p className="text-xs text-slate-500">Last Updated</p>
                                        <p className="text-sm text-white font-medium">
                                          {new Date(job.updatedAt || job.createdAt).toLocaleDateString('en-US', {
                                            weekday: 'short',
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                          })}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Job URL */}
                                  {(job.jobUrl || job.jobId?.sourceLink || job.jobId?.url) && (
                                    <div className="flex items-center gap-3">
                                      <Link className="w-5 h-5 text-slate-500" />
                                      <div className="flex-1">
                                        <p className="text-xs text-slate-500 mb-1">Job Posting</p>
                                        <a
                                          href={job.jobUrl || job.jobId?.sourceLink || job.jobId?.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-cyan-400 hover:text-cyan-300 text-sm underline break-all"
                                        >
                                          {job.jobUrl || job.jobId?.sourceLink || job.jobId?.url}
                                        </a>
                                      </div>
                                    </div>
                                  )}

                                  {/* Notes */}
                                  {job.notes && (Array.isArray(job.notes) ? job.notes.length > 0 : job.notes) && (
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-slate-500" />
                                        <p className="text-xs text-slate-500">Notes</p>
                                      </div>
                                      <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                                        <p className="text-sm text-slate-300 whitespace-pre-wrap">
                                          {Array.isArray(job.notes) 
                                            ? job.notes.map(note => note.content).join('\n')
                                            : job.notes}
                                        </p>
                                      </div>
                                    </div>
                                  )}

                                  {/* Timeline */}
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                      <CheckCircle className="w-5 h-5 text-slate-500" />
                                      <p className="text-xs text-slate-500">Application Timeline</p>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                                        <div className="flex-1">
                                          <p className="text-sm text-white font-medium">Application Created</p>
                                          <p className="text-xs text-slate-500">
                                            {new Date(job.createdAt).toLocaleString('en-US', {
                                              weekday: 'long',
                                              month: 'long',
                                              day: 'numeric',
                                              year: 'numeric',
                                              hour: '2-digit',
                                              minute: '2-digit'
                                            })}
                                          </p>
                                        </div>
                                      </div>
                                      {job.updatedAt !== job.createdAt && (
                                        <div className="flex items-center gap-3">
                                          <div className="w-2 h-2 bg-slate-500 rounded-full" />
                                          <div className="flex-1">
                                            <p className="text-sm text-white font-medium">Last Updated</p>
                                            <p className="text-xs text-slate-500">
                                              {new Date(job.updatedAt).toLocaleString('en-US', {
                                                weekday: 'long',
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                              })}
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-700/50">
                                    <button
                                      onClick={() => handleEditApplication(job)}
                                      className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors text-sm"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                      Edit Application
                                    </button>
                                    <button
                                      onClick={() => handleDeleteApplication(job)}
                                      className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors text-sm"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      Delete Application
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </motion.div>

      {/* Empty State */}
      {sortedApplications.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-slate-600" />
          </div>
          <h3 className="text-lg font-medium text-white mb-1">No applications found</h3>
          <p className="text-slate-500">Start by adding your first job application</p>
        </div>
      )}

      {/* Add Application Modal */}
      <AddJobModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAddApplication}
      />

      {/* Delete Confirmation Dialog */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Confirm Delete</h3>
            <p className="text-slate-300 mb-6">
              Are you sure you want to delete the application at{' '}
              <strong>{deleteConfirm.application?.company || deleteConfirm.application?.jobId?.company}</strong>?
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors"
              >
                Delete Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Status Notification */}
      {saveStatus.show && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`px-6 py-3 rounded-lg border ${
            saveStatus.type === 'success' 
              ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-400' 
              : 'bg-rose-600/20 border-rose-500/50 text-rose-400'
          }`}>
            <div className="flex items-center gap-2">
              {saveStatus.type === 'success' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <span className="text-sm font-medium">{saveStatus.message}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
