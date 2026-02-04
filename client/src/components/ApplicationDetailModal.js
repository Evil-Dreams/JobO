import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit2, Calendar, MapPin, ExternalLink, Briefcase, Clock, CheckCircle2, MessageSquare, Trash2 } from 'lucide-react';

export function ApplicationDetailModal({ isOpen, onClose, application, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editForm, setEditForm] = useState({
    status: application?.status || 'Applied',
    notes: application?.notes?.[0]?.content || '',
    followUpDate: application?.followUpDate ? new Date(application.followUpDate).toISOString().split('T')[0] : ''
  });

  const statusOptions = [
    'Applied',
    'Interview Scheduled', 
    'Interview Completed',
    'Offer Received',
    'Offer Accepted',
    'Offer Declined',
    'Rejected'
  ];

  const statusConfig = {
    'Applied': { color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', icon: Clock },
    'Interview Scheduled': { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Calendar },
    'Interview Completed': { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Calendar },
    'Offer Received': { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle2 },
    'Offer Accepted': { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: CheckCircle2 },
    'Offer Declined': { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: CheckCircle2 },
    'Rejected': { color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: X }
  };

  const currentStatus = statusConfig[application?.status] || statusConfig['Applied'];
  const StatusIcon = currentStatus.icon;

  const handleSave = async () => {
    try {
      await onUpdate(application._id, editForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update application:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(application._id);
      onClose();
    } catch (error) {
      console.error('Failed to delete application:', error);
    }
  };

  const jobData = application?.jobId || application;

  if (!application) return null;

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            style={{ left: '80px', right: '0' }}
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl h-[80vh] max-h-[800px] bg-slate-900/95 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col backdrop-blur-md"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-800 bg-slate-900/50 sticky top-0 z-10">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold text-white shadow-lg"
                        style={{ backgroundColor: '#06b6d4' }}
                      >
                        {jobData?.company?.charAt(0) || 'C'}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-1">{jobData?.company || 'Unknown Company'}</h2>
                        <p className="text-lg text-slate-300">{jobData?.title || 'Unknown Position'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium border ${currentStatus.bg} ${currentStatus.color} ${currentStatus.border}`}
                      >
                        <StatusIcon className="w-4 h-4" />
                        {application?.status}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="p-2 hover:bg-rose-900/50 rounded-lg text-rose-400 hover:text-rose-300 transition-colors"
                    title="Delete Application"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-full space-y-8">
                  {/* Job Details - Horizontal Layout */}
                  <div className="flex gap-8">
                    <div className="flex-1 space-y-6">
                      <h3 className="text-2xl font-semibold text-white flex items-center gap-3">
                        <Briefcase className="w-6 h-6 text-cyan-400" />
                        Job Details
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 text-slate-300">
                          <MapPin className="w-5 h-5 text-slate-500" />
                          <span className="text-lg">{jobData?.location || 'Location not specified'}</span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-slate-300">
                          <Calendar className="w-5 h-5 text-slate-500" />
                          <span className="text-lg">Applied: {new Date(application?.appliedAt || application?.createdAt).toLocaleDateString()}</span>
                        </div>

                        {jobData?.sourceLink && (
                          <div className="flex items-center gap-4">
                            <ExternalLink className="w-5 h-5 text-slate-500" />
                            <a 
                              href={jobData.sourceLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-cyan-400 hover:text-cyan-300 transition-colors text-lg"
                            >
                              View Job Posting
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Editable Section - Horizontal */}
                    <div className="flex-1 space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-semibold text-white flex items-center gap-3">
                          <MessageSquare className="w-6 h-6 text-cyan-400" />
                          Application Status
                        </h3>
                        <button
                          onClick={() => setIsEditing(!isEditing)}
                          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
                        >
                          <Edit2 className="w-5 h-5" />
                          {isEditing ? 'Cancel' : 'Edit'}
                        </button>
                      </div>

                      {isEditing ? (
                        <div className="space-y-6">
                          <div>
                            <label className="block text-lg font-medium text-slate-400 mb-3">Status</label>
                            <select
                              value={editForm.status}
                              onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-lg text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all"
                            >
                              {statusOptions.map(status => (
                                <option key={status} value={status}>{status}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-lg font-medium text-slate-400 mb-3">Notes</label>
                            <textarea
                              value={editForm.notes}
                              onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                              rows={3}
                              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-lg text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all resize-none"
                              placeholder="Add notes about this application..."
                            />
                          </div>

                          <div>
                            <label className="block text-lg font-medium text-slate-400 mb-3">Follow-up Date</label>
                            <input
                              type="date"
                              value={editForm.followUpDate}
                              onChange={(e) => setEditForm({ ...editForm, followUpDate: e.target.value })}
                              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-lg text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all"
                            />
                          </div>

                          <div className="flex gap-4">
                            <button
                              onClick={handleSave}
                              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg font-medium transition-colors text-lg"
                            >
                              Save Changes
                            </button>
                            <button
                              onClick={() => setIsEditing(false)}
                              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors text-lg"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <p className="text-lg text-slate-400 mb-2">Current Status</p>
                            <div
                              className={`inline-flex items-center gap-3 px-4 py-2 rounded-full text-lg font-medium border ${currentStatus.bg} ${currentStatus.color} ${currentStatus.border}`}
                            >
                              <StatusIcon className="w-5 h-5" />
                              {application?.status}
                            </div>
                          </div>

                          {application?.notes?.length > 0 && (
                            <div>
                              <p className="text-lg text-slate-400 mb-2">Notes</p>
                              <p className="text-lg text-slate-300">{application.notes[0].content}</p>
                            </div>
                          )}

                          {application?.followUpDate && (
                            <div>
                              <p className="text-lg text-slate-400 mb-2">Follow-up Date</p>
                              <p className="text-lg text-slate-300">{new Date(application.followUpDate).toLocaleDateString()}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                {/* Job Description */}
                {jobData?.jobDescription && (
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-4">Job Description</h3>
                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                      <p className="text-lg text-slate-300 whitespace-pre-wrap">{jobData.jobDescription}</p>
                    </div>
                  </div>
                )}

                {/* Timeline */}
                {application?.timeline?.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                      <Clock className="w-6 h-6 text-cyan-400" />
                      Timeline
                    </h3>
                    <div className="space-y-4">
                      {application.timeline.map((item, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="w-3 h-3 bg-cyan-400 rounded-full mt-3 flex-shrink-0"></div>
                          <div className="flex-1">
                            <p className="text-lg text-slate-300">{item.action}</p>
                            <p className="text-slate-500">
                              {new Date(item.date).toLocaleDateString()} at {new Date(item.date).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            </motion.div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
              {showDeleteConfirm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000] flex items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full mx-4"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trash2 className="w-8 h-8 text-rose-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Delete Application</h3>
                      <p className="text-slate-300 mb-6">
                        Are you sure you want to delete this application for <span className="font-semibold text-white">{jobData?.company}</span>? This action cannot be undone.
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleDelete}
                          className="flex-1 px-4 py-2 bg-rose-500 hover:bg-rose-400 text-white rounded-lg font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
