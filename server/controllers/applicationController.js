const Application = require('../models/Application');
const Job = require('../models/Job');
const SiteStats = require('../models/SiteStats');
const User = require('../models/User');
const { predictSuccessProbability } = require('../services/aiService');

// Create new application
const createApplication = async (req, res) => {
  try {
    const {
      title,
      company,
      location = '',
      jobDescription = '',
      salaryRange = '',
      sourceLink = '',
      status,
      notes = '',
      followUpDate,
    } = req.body;

    // Create job first or find existing
    let job = await Job.findOne({ title, company });
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
      notes: notes ? [{ content: notes, createdAt: new Date() }] : [],
      followUpDate: followUpDate ? new Date(followUpDate) : undefined,
      timeline: [{ date: new Date(), action: 'Application submitted' }],
    });

    // Populate job details
    const populatedApplication = await Application.findById(application._id)
      .populate('jobId')
      .populate('userId', 'name email');

    // Calculate success probability
    try {
      const user = await User.findById(req.user.id).select('-password');
      const applications = await Application.find({ userId: req.user.id }).lean();
      
      const userProfile = {
        name: user.name,
        headline: user.headline,
        experience: user.experience,
        education: user.education,
        skills: user.skills,
        location: user.location
      };

      const jobDescription = populatedApplication.jobId?.description || '';
      
      // Only calculate AI prediction if we have sufficient data
      if (userProfile.name && jobDescription) {
        const prediction = await predictSuccessProbability(userProfile, jobDescription, applications);
        
        // Update application with success probability
        await Application.findByIdAndUpdate(application._id, {
          successProbability: prediction.successProbability || 75,
          successAnalysis: JSON.stringify(prediction)
        });
        
        // Refresh the populated application with updated data
        populatedApplication.successProbability = prediction.successProbability || 75;
      } else {
        // Set default probability if insufficient data
        await Application.findByIdAndUpdate(application._id, {
          successProbability: 75
        });
        populatedApplication.successProbability = 75;
      }
    } catch (aiError) {
      console.error('Error calculating success probability:', aiError);
      // Set default probability if AI calculation fails
      await Application.findByIdAndUpdate(application._id, {
        successProbability: 75
      });
      populatedApplication.successProbability = 75;
    }

    // Update site statistics
    try {
      const stats = await SiteStats.getSiteStats();
      await stats.updateJobsTracked();
      await stats.calculateSuccessRate();
    } catch (statsError) {
      console.error('Error updating site stats:', statsError);
      // Don't fail the request if stats update fails
    }

    res.status(201).json(populatedApplication);
  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
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
    const { id } = req.params;
    const { 
      company, 
      position, 
      location, 
      salary, 
      jobUrl, 
      status, 
      notes, 
      followUpDate, 
      timelineAction 
    } = req.body;

    

    // Build update object with all possible fields
    const updateFields = {};
    if (company !== undefined) updateFields.company = company;
    if (position !== undefined) updateFields.position = position;
    if (location !== undefined) updateFields.location = location;
    if (salary !== undefined) updateFields.salary = salary;
    if (jobUrl !== undefined) updateFields.jobUrl = jobUrl;
    if (status !== undefined) updateFields.status = status;
    if (notes !== undefined) {
      // Convert notes string to proper array format if it's a string
      if (typeof notes === 'string') {
        updateFields.notes = notes.trim() 
          ? [{ content: notes.trim(), createdAt: new Date() }]
          : [];
      } else {
        updateFields.notes = notes;
      }
    }
    if (followUpDate !== undefined) {
      updateFields.followUpDate = followUpDate ? new Date(followUpDate) : null;
    }
    
    // Always update the updatedAt timestamp
    updateFields.updatedAt = new Date();

    

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

    // Calculate success probability if significant fields changed
    try {
      const user = await User.findById(req.user.id).select('-password');
      const applications = await Application.find({ userId: req.user.id }).lean();
      
      const userProfile = {
        name: user.name,
        headline: user.headline,
        experience: user.experience,
        education: user.education,
        skills: user.skills,
        location: user.location
      };

      const jobDescription = application.jobId?.description || '';
      
      // Only calculate AI prediction if we have sufficient data
      if (userProfile.name && jobDescription) {
        const prediction = await predictSuccessProbability(userProfile, jobDescription, applications);
        
        // Update application with new success probability
        await Application.findByIdAndUpdate(application._id, {
          successProbability: prediction.successProbability || 75,
          successAnalysis: JSON.stringify(prediction)
        });
        
        // Update the application object with new success probability
        application.successProbability = prediction.successProbability || 75;
      } else {
        // Set default probability if insufficient data
        await Application.findByIdAndUpdate(application._id, {
          successProbability: 75
        });
        if (!application.successProbability) {
          application.successProbability = 75;
        }
      }
    } catch (aiError) {
      console.error('Error calculating success probability:', aiError);
      // Set default probability if AI calculation fails
      await Application.findByIdAndUpdate(application._id, {
        successProbability: 75
      });
      if (!application.successProbability) {
        application.successProbability = 75;
      }
    }

    // Update site statistics when status changes
    try {
      const stats = await SiteStats.getSiteStats();
      await stats.calculateSuccessRate();
    } catch (statsError) {
      console.error('Error updating site stats:', statsError);
      // Don't fail the request if stats update fails
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

    // Update site statistics when application is deleted
    try {
      const stats = await SiteStats.getSiteStats();
      await stats.updateJobsTracked();
      await stats.calculateSuccessRate();
    } catch (statsError) {
      console.error('Error updating site stats:', statsError);
      // Don't fail the request if stats update fails
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
  createApplication,
  getApplications,
  updateApplication,
  getApplication,
  deleteApplication,
  addCommunication,
  addNote,
  getApplicationsByStatus,
  getStatistics,
  setReminder,
  getUpcomingReminders
};
