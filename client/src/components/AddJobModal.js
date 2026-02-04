import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export function AddJobModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    jobDescription: '',
    sourceLink: '',
    status: 'Applied',
    notes: '',
    followUpDate: ''
  });

  const handleSubmit = () => {
    if (formData.title && formData.company) {
      onAdd(formData);
      setFormData({
        title: '',
        company: '',
        location: '',
        jobDescription: '',
        sourceLink: '',
        status: 'Applied',
        notes: '',
        followUpDate: ''
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                <div>
                  <h2 className="text-xl font-bold text-white">Add Application</h2>
                  <p className="text-sm text-slate-400">Track a new job opportunity</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400">Job Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Frontend Engineer"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400">Company Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Vercel"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. San Francisco, CA"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400">Job Description</label>
                  <textarea
                    placeholder="Paste job description here..."
                    value={formData.jobDescription}
                    onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                    rows={3}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-600 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400">Job URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.sourceLink}
                    onChange={(e) => setFormData({ ...formData, sourceLink: e.target.value })}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all"
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
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400">Follow-up Date (Optional)</label>
                    <input
                      type="date"
                      value={formData.followUpDate}
                      onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white text-sm font-medium rounded-lg shadow-lg shadow-cyan-500/25 transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  <div className="w-4 h-4 rounded overflow-hidden">
                    <img 
                      src="/iblis_logo.png" 
                      alt="JobO Logo" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  Track Application
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
