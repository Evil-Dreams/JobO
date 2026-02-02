const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  jobTitle: String,
  company: String,
  status: {
    type: String,
    enum: ['Applied', 'Rejected', 'Interview Scheduled', 'Interview Completed', 'Offer Received', 'Offer Accepted', 'Offer Declined'],
    default: 'Applied'
  },
  notes: [
    {
      content: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  communicationHistory: [
    {
      date: {
        type: Date,
        default: Date.now
      },
      type: {
        type: String,
        enum: ['Email', 'Phone Call', 'In-person', 'Video Call', 'Message']
      },
      description: String,
      interviewer: String,
      outcome: String
    }
  ],
  timeline: [{
    date: {
      type: Date,
      default: Date.now
    },
    action: {
      type: String,
      required: true,
      trim: true
    },
    details: String
  }],
  followUpDate: {
    type: Date
  },
  reminderSet: {
    type: Boolean,
    default: false
  },
  successProbability: {
    type: Number,
    min: 0,
    max: 100
  },
  successAnalysis: String,
  appliedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Application', applicationSchema);
