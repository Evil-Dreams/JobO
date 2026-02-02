const { body, validationResult } = require('express-validator');
const Application = require('../models/Application');
const Job = require('../models/Job');

// Create new application
const createApplication = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      jobDescription,
      salaryRange,
      sourceLink,
      status,
      notes,
      followUpDate,
    } = req.body;

    // Create job first or find existing
    let job = await Job.findOne({ title, company, location });
    if (!job) {
      job = await Job.create({
        title,
        company,
        location,
        jobDescription,
        salaryRange,
        sourceLink,
      });
    }

    // Create application
    const application = await Application.create({
      userId: req.user.id,
      jobId: job._id,
      status: status || 'Applied',
      notes,
      followUpDate: followUpDate ? new Date(followUpDate) : undefined,
      timeline: [{ date: new Date(), action: 'Application submitted' }],
    });

    // Populate job details
    const populatedApplication = await Application.findById(application._id)
      .populate('jobId')
      .populate('userId', 'name email');

    res.status(201).json(populatedApplication);
  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all applications for a user
const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user.id })
      .populate('jobId')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update application
const updateApplication = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status, notes, followUpDate, timelineAction } = req.body;

    // Build update object
    const updateFields = {};
    if (status) updateFields.status = status;
    if (notes !== undefined) updateFields.notes = notes;
    if (followUpDate !== undefined) {
      updateFields.followUpDate = followUpDate ? new Date(followUpDate) : null;
    }

    // Build the update query
    let updateQuery = { $set: updateFields };

    // Add timeline action if provided
    if (timelineAction) {
      updateQuery.$push = {
        timeline: {
          date: new Date(),
          action: timelineAction,
        },
      };
    }

    const application = await Application.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      updateQuery,
      { new: true, runValidators: true }
    ).populate('jobId');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single application
const getApplication = async (req, res) => {
  try {
    const { id } = req.params;
    
    const application = await Application.findOne({ _id: id, userId: req.user.id })
      .populate('jobId');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete application
const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    
    const application = await Application.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({ message: 'Application deleted successfully', id });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add communication history
const addCommunication = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, description, interviewer, outcome } = req.body;

    if (!type || !description) {
      return res.status(400).json({ message: 'Type and description are required' });
    }

    const application = await Application.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      {
        $push: {
          communicationHistory: {
            date: new Date(),
            type,
            description,
            interviewer: interviewer || null,
            outcome: outcome || null
          }
        }
      },
      { new: true }
    ).populate('jobId');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    console.error('Add communication error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add note to application
const addNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Note content is required' });
    }

    const application = await Application.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      {
        $push: {
          notes: {
            content,
            createdAt: new Date()
          }
        }
      },
      { new: true }
    ).populate('jobId');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get applications by status
const getApplicationsByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    const applications = await Application.find({ 
      userId: req.user.id, 
      status 
    })
      .populate('jobId')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Get applications by status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get application statistics
const getStatistics = async (req, res) => {
  try {
    const userId = req.user.id;

    const total = await Application.countDocuments({ userId });
    const statuses = {};

    // Get breakdown by status
    const statusBreakdown = await Application.aggregate([
      { $match: { userId: require('mongoose').Types.ObjectId(userId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    statusBreakdown.forEach(item => {
      statuses[item._id] = item.count;
    });

    // Get applications this week
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const thisWeek = await Application.countDocuments({
      userId,
      appliedAt: { $gte: oneWeekAgo }
    });

    // Get conversion rates
    const interviews = statuses['Interview Scheduled'] || 0;
    const offers = statuses['Offer Received'] || 0;
    
    const conversionRates = {
      applicationToInterview: total > 0 ? ((interviews / total) * 100).toFixed(2) : 0,
      interviewToOffer: interviews > 0 ? ((offers / interviews) * 100).toFixed(2) : 0
    };

    res.json({
      total,
      thisWeek,
      statuses,
      conversionRates,
      averageSuccessProbability: 0 // Will be calculated from stored probabilities
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Set reminder for follow-up
const setReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reminderDate, title, description } = req.body;

    if (!reminderDate) {
      return res.status(400).json({ message: 'Reminder date is required' });
    }

    const application = await Application.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      {
        followUpDate: new Date(reminderDate),
        reminderSet: true,
        $push: {
          timeline: {
            date: new Date(),
            action: 'Reminder set',
            details: title || 'Follow-up reminder'
          }
        }
      },
      { new: true }
    ).populate('jobId');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    console.error('Set reminder error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get applications with upcoming reminders
const getUpcomingReminders = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const reminders = await Application.find({
      userId,
      followUpDate: { $gte: now, $lte: sevenDaysFromNow },
      reminderSet: true
    })
      .populate('jobId')
      .sort({ followUpDate: 1 });

    res.json(reminders);
  } catch (error) {
    console.error('Get upcoming reminders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createApplication: [
    body('title').notEmpty().withMessage('Job title is required'),
    body('company').notEmpty().withMessage('Company is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('jobDescription').notEmpty().withMessage('Job description is required'),
    createApplication,
  ],
  getApplications,
  updateApplication: [
    body('status').optional().isIn(['Applied', 'Rejected', 'Interview Scheduled', 'Interview Completed', 'Offer Received', 'Offer Accepted', 'Offer Declined']),
    updateApplication,
  ],
  getApplication,
  deleteApplication,
  addCommunication,
  addNote,
  getApplicationsByStatus,
  getStatistics,
  setReminder,
  getUpcomingReminders
};
