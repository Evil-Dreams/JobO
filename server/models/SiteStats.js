const mongoose = require('mongoose');

const siteStatsSchema = new mongoose.Schema({
  userCount: {
    type: Number,
    default: 0,
    min: 0
  },
  jobsTracked: {
    type: Number,
    default: 0,
    min: 0
  },
  successRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Static method to get or create site stats
siteStatsSchema.statics.getSiteStats = async function() {
  let stats = await this.findOne();
  if (!stats) {
    stats = await this.create({});
  }
  return stats;
};

// Method to increment user count
siteStatsSchema.methods.incrementUserCount = async function() {
  this.userCount += 1;
  this.lastUpdated = new Date();
  return await this.save();
};

// Method to update jobs tracked count
siteStatsSchema.methods.updateJobsTracked = async function() {
  const Application = mongoose.model('Application');
  const totalApplications = await Application.countDocuments();
  this.jobsTracked = totalApplications;
  this.lastUpdated = new Date();
  return await this.save();
};

// Method to calculate success rate
siteStatsSchema.methods.calculateSuccessRate = async function() {
  const Application = mongoose.model('Application');
  const totalApplications = await Application.countDocuments();
  
  if (totalApplications === 0) {
    this.successRate = 0;
  } else {
    const successfulApplications = await Application.countDocuments({
      status: { $in: ['Offer Received', 'Offer Accepted'] }
    });
    this.successRate = Math.round((successfulApplications / totalApplications) * 100);
  }
  
  this.lastUpdated = new Date();
  return await this.save();
};

module.exports = mongoose.model('SiteStats', siteStatsSchema);
