import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  ExternalLink,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  XCircle,
  BrainCircuit,
  Trash2
} from 'lucide-react';

export const statusConfig = {
  Applied: {
    color: 'text-slate-400',
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/20',
    icon: Clock
  },
  Interview: {
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    icon: Calendar
  },
  Offer: {
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    icon: CheckCircle2
  },
  Rejected: {
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    icon: XCircle
  }
};

export function JobCard({ job, index, onUpdate, onDelete, activeModalId, setActiveModalId }) {
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Handle both application with populated job and direct job data
  const applicationData = job.jobId || job;
  const status = job.status || 'Applied';
  
  // Get company and position from the correct fields
  const company = job.company || applicationData.company || 'Unknown Company';
  const position = job.position || job.jobTitle || applicationData.title || applicationData.jobTitle || 'Unknown Position';
  const statusConfig = {
    'Applied': {
      color: 'text-slate-400',
      bg: 'bg-slate-500/10',
      border: 'border-slate-500/20',
      icon: Clock
    },
    'Interview Scheduled': {
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      icon: Calendar
    },
    'Interview Completed': {
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      icon: Calendar
    },
    'Offer Received': {
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      icon: CheckCircle2
    },
    'Offer Accepted': {
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      icon: CheckCircle2
    },
    'Offer Declined': {
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
      icon: XCircle
    },
    'Rejected': {
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      icon: XCircle
    }
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.dropdown-container')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const currentStatus = statusConfig[status] || statusConfig['Applied'];
  const StatusIcon = currentStatus.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="glass-card rounded-2xl p-5 group relative flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-lg"
            style={{ backgroundColor: applicationData.logoColor || '#06b6d4' }}
          >
            {company.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-lg text-white group-hover:text-cyan-400 transition-colors">
              {company}
            </h3>
            <p className="text-slate-400 text-sm">{position}</p>
          </div>
        </div>
        <div className="relative dropdown-container">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="text-slate-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700/50"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
          
          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 top-8 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20 min-w-[160px]">
              {applicationData?.sourceLink && (
                <a 
                  href={applicationData.sourceLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Job
                </a>
              )}
              {onDelete && (
                <button 
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this application?')) {
                      onDelete(job._id);
                    }
                    setShowDropdown(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-rose-400 hover:bg-slate-700 hover:text-rose-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* AI Match Score */}
      <div className="mb-6 bg-slate-800/40 rounded-xl p-3 border border-slate-700/30 flex items-center gap-3">
        <div className="relative w-10 h-10 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#1e293b"
              strokeWidth="3"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke={
                (job.matchScore || Math.floor(Math.random() * 30) + 70) > 85
                  ? '#10b981'
                  : (job.matchScore || Math.floor(Math.random() * 30) + 70) > 70
                  ? '#f59e0b'
                  : '#ef4444'
              }
              strokeWidth="3"
              strokeDasharray={`${job.matchScore || Math.floor(Math.random() * 30) + 70}, 100`}
              className="drop-shadow-[0_0_4px_rgba(6,182,212,0.5)]"
            />
          </svg>
          <BrainCircuit className="w-4 h-4 text-slate-400 absolute" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-slate-300">AI Match Score</span>
            <span
              className={`text-xs font-bold ${
                (job.matchScore || Math.floor(Math.random() * 30) + 70) > 85 ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {job.matchScore || Math.floor(Math.random() * 30) + 70}%
            </span>
          </div>
          <div className="w-full bg-slate-700/50 h-1.5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${job.matchScore || Math.floor(Math.random() * 30) + 70}%` }}
              transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
              className={`h-full rounded-full ${
                (job.matchScore || Math.floor(Math.random() * 30) + 70) > 85 ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-700/30">
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${currentStatus.bg} ${currentStatus.color} ${currentStatus.border}`}
        >
          <StatusIcon className="w-3 h-3" />
          {status}
        </div>
        <div className="flex items-center gap-2 text-slate-500 text-xs">
          <Calendar className="w-3 h-3" />
          {new Date(job.appliedAt || job.createdAt || Date.now()).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          })}
        </div>
      </div>

    </motion.div>
  );
}
