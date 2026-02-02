const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  totalApplications: {
    type: Number,
    default: 0
  },
  statusBreakdown: {
    applied: { type: Number, default: 0 },
    rejected: { type: Number, default: 0 },
    interviewScheduled: { type: Number, default: 0 },
    interviewCompleted: { type: Number, default: 0 },
    offerReceived: { type: Number, default: 0 },
    offerAccepted: { type: Number, default: 0 }
  },
  conversionRates: {
    applicationToInterview: Number,
    interviewToOffer: Number,
    offerAcceptance: Number
  },
  weeklyActivity: [
    {
      week: String,
      applicationsCount: Number,
      interviewsCount: Number,
      offersCount: Number
    }
  ],
  successProbabilityTrends: [
    {
      date: Date,
      averageProbability: Number
    }
  ],
  topCompanies: [
    {
      company: String,
      applicationCount: Number,
      successRate: Number
    }
  ],
  topSkillsMatched: [
    {
      skill: String,
      frequency: Number
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Analytics', analyticsSchema);
