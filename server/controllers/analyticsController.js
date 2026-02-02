const Analytics = require('../models/Analytics');
const Application = require('../models/Application');
const User = require('../models/User');

// Get or create analytics for user
const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    let analytics = await Analytics.findOne({ userId });

    if (!analytics) {
      // Calculate from applications
      const applications = await Application.find({ userId });
      
      const statusBreakdown = {
        applied: 0,
        rejected: 0,
        interviewScheduled: 0,
        interviewCompleted: 0,
        offerReceived: 0,
        offerAccepted: 0
      };

      applications.forEach(app => {
        const statusKey = app.status.toLowerCase().replace(/\s+/g, '');
        if (statusKey in statusBreakdown) {
          statusBreakdown[statusKey]++;
        }
      });

      analytics = await Analytics.create({
        userId,
        totalApplications: applications.length,
        statusBreakdown
      });
    }

    res.json(analytics);
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get dashboard overview
const getDashboardOverview = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get total applications
    const totalApplications = await Application.countDocuments({ userId });

    // Get status breakdown
    const statusBreakdown = await Application.aggregate([
      { $match: { userId: require('mongoose').Types.ObjectId(userId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const statuses = {};
    statusBreakdown.forEach(item => {
      statuses[item._id] = item.count;
    });

    // Get this week's applications
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const thisWeekApps = await Application.find({
      userId,
      appliedAt: { $gte: oneWeekAgo }
    }).countDocuments();

    // Get user's goals
    const user = await User.findById(userId);
    const goals = user?.goals || {};

    // Calculate conversion rates
    const interviews = statuses['Interview Scheduled'] || 0;
    const offers = statuses['Offer Received'] || 0;

    const conversionRates = {
      applicationToInterview: totalApplications > 0 ? ((interviews / totalApplications) * 100).toFixed(2) : 0,
      interviewToOffer: interviews > 0 ? ((offers / interviews) * 100).toFixed(2) : 0,
      totalOfferRate: totalApplications > 0 ? ((offers / totalApplications) * 100).toFixed(2) : 0
    };

    // Get top companies
    const topCompanies = await Application.aggregate([
      { $match: { userId: require('mongoose').Types.ObjectId(userId) } },
      { $group: { 
          _id: '$company', 
          count: { $sum: 1 },
          avgSuccessProbability: { $avg: '$successProbability' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, company: '$_id', applicationCount: '$count', avgSuccessProbability: 1 } }
    ]);

    // Get weekly activity
    const weeklyActivity = [];
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(Date.now() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000);
      
      const weekApps = await Application.countDocuments({
        userId,
        appliedAt: { $gte: weekStart, $lt: weekEnd }
      });

      weeklyActivity.unshift({
        week: `Week ${4 - i}`,
        applicationsCount: weekApps,
        timestamp: weekStart
      });
    }

    res.json({
      totalApplications,
      thisWeekApplications: thisWeekApps,
      statuses,
      conversionRates,
      goals,
      topCompanies,
      weeklyActivity
    });
  } catch (error) {
    console.error('Get dashboard overview error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get application trends
const getTrends = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get last 12 weeks of data
    const trends = [];
    for (let i = 0; i < 12; i++) {
      const weekStart = new Date(Date.now() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000);

      const weekApps = await Application.countDocuments({
        userId,
        appliedAt: { $gte: weekStart, $lt: weekEnd }
      });

      const interviews = await Application.countDocuments({
        userId,
        communicationHistory: { $exists: true, $ne: [] },
        'communicationHistory.date': { $gte: weekStart, $lt: weekEnd }
      });

      trends.unshift({
        week: `W${12 - i}`,
        applications: weekApps,
        interviews,
        timestamp: weekStart
      });
    }

    res.json({ trends });
  } catch (error) {
    console.error('Get trends error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get application success analysis
const getSuccessAnalysis = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get applications with success probability
    const applications = await Application.find({ userId })
      .select('successProbability status company jobTitle');

    const successProbabilities = applications
      .filter(app => app.successProbability)
      .map(app => app.successProbability);

    const avgProbability = successProbabilities.length > 0
      ? (successProbabilities.reduce((a, b) => a + b, 0) / successProbabilities.length).toFixed(2)
      : 0;

    // Analyze by status
    const statusAnalysis = await Application.aggregate([
      { $match: { userId: require('mongoose').Types.ObjectId(userId) } },
      { $group: { 
          _id: '$status',
          count: { $sum: 1 },
          avgSuccessProbability: { $avg: '$successProbability' }
        }
      }
    ]);

    // Get top matching skills
    const skillMatches = await Application.aggregate([
      { $match: { userId: require('mongoose').Types.ObjectId(userId) } },
      { $project: { successProbability: 1 } }
    ]);

    res.json({
      averageSuccessProbability: avgProbability,
      highProbabilityApps: applications.filter(app => app.successProbability > 75).length,
      mediumProbabilityApps: applications.filter(app => app.successProbability > 50 && app.successProbability <= 75).length,
      lowProbabilityApps: applications.filter(app => app.successProbability <= 50).length,
      statusAnalysis,
      totalAnalyzed: successProbabilities.length
    });
  } catch (error) {
    console.error('Get success analysis error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAnalytics,
  getDashboardOverview,
  getTrends,
  getSuccessAnalysis
};
