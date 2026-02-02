const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
  reminderDate: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ['Follow-up', 'Interview', 'Research', 'Custom'],
    default: 'Follow-up'
  },
  title: String,
  description: String,
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: Date,
  isPushed: {
    type: Boolean,
    default: false
  },
  pushedAt: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Reminder', reminderSchema);
