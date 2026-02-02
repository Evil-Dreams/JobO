const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      phone,
      skills,
      experience,
      preferences,
      resumes,
      coverLetters,
      goals
    } = req.body;

    // Build update object
    const updateFields = {};
    if (name) updateFields.name = name;
    if (phone) updateFields.phone = phone;
    if (skills) updateFields.skills = skills;
    if (experience !== undefined) updateFields.experience = experience;
    if (preferences) updateFields.preferences = preferences;
    if (resumes) updateFields.resumes = resumes;
    if (coverLetters) updateFields.coverLetters = coverLetters;
    if (goals) updateFields.goals = goals;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add resume
const addResume = async (req, res) => {
  try {
    const { title, content, isPrimary } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    // If setting as primary, remove primary from others
    if (isPrimary) {
      await User.findByIdAndUpdate(req.user.id, {
        $set: { 'resumes.$[].isPrimary': false }
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $push: {
          resumes: {
            title,
            content,
            uploadedAt: new Date(),
            isPrimary: isPrimary || false
          }
        }
      },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Add resume error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update resume
const updateResume = async (req, res) => {
  try {
    const { resumeId, title, content, isPrimary } = req.body;

    if (!resumeId) {
      return res.status(400).json({ message: 'Resume ID is required' });
    }

    if (isPrimary) {
      await User.findByIdAndUpdate(req.user.id, {
        $set: { 'resumes.$[].isPrimary': false }
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          'resumes.$[elem].title': title,
          'resumes.$[elem].content': content,
          'resumes.$[elem].isPrimary': isPrimary || false
        }
      },
      { new: true, arrayFilters: [{ 'elem._id': resumeId }] }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Update resume error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete resume
const deleteResume = async (req, res) => {
  try {
    const { resumeId } = req.body;

    if (!resumeId) {
      return res.status(400).json({ message: 'Resume ID is required' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { resumes: { _id: resumeId } } },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add cover letter
const addCoverLetter = async (req, res) => {
  try {
    const { title, content, relatedJob } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $push: {
          coverLetters: {
            title,
            content,
            createdAt: new Date(),
            relatedJob: relatedJob || null
          }
        }
      },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Add cover letter error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete cover letter
const deleteCoverLetter = async (req, res) => {
  try {
    const { coverLetterId } = req.body;

    if (!coverLetterId) {
      return res.status(400).json({ message: 'Cover letter ID is required' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { coverLetters: { _id: coverLetterId } } },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Delete cover letter error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add skill
const addSkill = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Skill name is required' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $push: {
          skills: {
            name,
            endorsements: 0
          }
        }
      },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Add skill error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Endorse skill
const endorseSkill = async (req, res) => {
  try {
    const { skillId } = req.body;

    if (!skillId) {
      return res.status(400).json({ message: 'Skill ID is required' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { 'skills.$[elem].endorsements': 1 } },
      { new: true, arrayFilters: [{ 'elem._id': skillId }] }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Endorse skill error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete skill
const deleteSkill = async (req, res) => {
  try {
    const { skillId } = req.body;

    if (!skillId) {
      return res.status(400).json({ message: 'Skill ID is required' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { skills: { _id: skillId } } },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Set goals
const setGoals = async (req, res) => {
  try {
    const { targetApplicationsPerWeek, targetInterviewsPerMonth, targetOffers } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          goals: {
            targetApplicationsPerWeek: targetApplicationsPerWeek || 0,
            targetInterviewsPerMonth: targetInterviewsPerMonth || 0,
            targetOffers: targetOffers || 0
          }
        }
      },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Set goals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProfile,
  updateProfile: [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('phone').optional().isLength({ min: 10 }).withMessage('Phone must be at least 10 characters'),
    body('skills').optional().isArray().withMessage('Skills must be an array'),
    body('preferences').optional().isObject().withMessage('Preferences must be an object'),
    body('resumes').optional().isArray().withMessage('Resumes must be an array'),
    body('coverLetters').optional().isArray().withMessage('Cover letters must be an array'),
    updateProfile,
  ],
  addResume,
  updateResume,
  deleteResume,
  addCoverLetter,
  deleteCoverLetter,
  addSkill,
  endorseSkill,
  deleteSkill,
  setGoals
};
