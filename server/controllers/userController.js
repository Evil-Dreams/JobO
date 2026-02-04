const User = require('../models/User');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads/resumes');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

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
    
    
    

    const {
      name,
      headline,
      phone,
      location,
      bio,
      dateOfBirth,
      gender,
      nationality,
      languages,
      workAuthorization,
      salaryExpectation,
      availability,
      links,
      skills,
      experience,
      education,
      preferences,
      goals
    } = req.body;

    // Parse skills if it's a string
    let parsedSkills = skills;
    if (typeof skills === 'string') {
      try {
        parsedSkills = JSON.parse(skills);
      } catch (error) {
        parsedSkills = [];
      }
    }

    // Build update object
    const updateFields = {};
    if (name) updateFields.name = name;
    if (headline !== undefined) updateFields.headline = headline;
    if (phone) updateFields.phone = phone;
    if (location !== undefined) updateFields.location = location;
    if (bio !== undefined) updateFields.bio = bio;
    if (dateOfBirth) updateFields.dateOfBirth = dateOfBirth;
    if (gender) updateFields.gender = gender;
    if (nationality) updateFields.nationality = nationality;
    if (languages) updateFields.languages = languages;
    if (workAuthorization) updateFields.workAuthorization = workAuthorization;
    if (salaryExpectation) updateFields.salaryExpectation = salaryExpectation;
    if (availability) updateFields.availability = availability;
    if (links) updateFields.links = links;
    if (parsedSkills) updateFields.skills = parsedSkills;
    if (experience !== undefined) updateFields.experience = experience;
    if (education !== undefined) updateFields.education = education;
    if (preferences) updateFields.preferences = preferences;
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

// Upload resume
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title, targetRole, isPrimary } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Resume title is required' });
    }

    // If setting as primary, remove primary from others
    if (isPrimary === 'true' || isPrimary === true) {
      await User.findByIdAndUpdate(req.user.id, {
        $set: { 'resumes.$[].isPrimary': false }
      });
    }

    const resume = {
      _id: new mongoose.Types.ObjectId(),
      title,
      fileName: req.file.originalname,
      fileSize: `${Math.round(req.file.size / 1024)} KB`,
      filePath: `/uploads/resumes/${req.file.filename}`,
      targetRole: targetRole || 'General',
      uploadedAt: new Date(),
      isPrimary: isPrimary === 'true' || isPrimary === true
    };

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { resumes: resume } },
      { new: true }
    ).select('-password');

    res.json(resume);
  } catch (error) {
    console.error('Upload resume error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get resumes
const getResumes = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('resumes');
    res.json(user.resumes || []);
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete resume
const deleteResume = async (req, res) => {
  try {
    const { id: resumeId } = req.params;

    if (!resumeId) {
      return res.status(400).json({ message: 'Resume ID is required' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { resumes: { _id: resumeId } } },
      { new: true }
    ).select('-password');

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add cover letter
const addCoverLetter = async (req, res) => {
  try {
    const { title, content, jobPosition, company } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const coverLetter = {
      _id: new mongoose.Types.ObjectId(),
      title,
      content,
      jobPosition: jobPosition || '',
      company: company || '',
      createdAt: new Date()
    };

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { coverLetters: coverLetter } },
      { new: true }
    ).select('-password');

    res.json(coverLetter);
  } catch (error) {
    console.error('Add cover letter error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get cover letters
const getCoverLetters = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('coverLetters');
    res.json(user.coverLetters || []);
  } catch (error) {
    console.error('Get cover letters error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete cover letter
const deleteCoverLetter = async (req, res) => {
  try {
    const { id: coverLetterId } = req.params;

    if (!coverLetterId) {
      return res.status(400).json({ message: 'Cover letter ID is required' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { coverLetters: { _id: coverLetterId } } },
      { new: true }
    ).select('-password');

    res.json({ message: 'Cover letter deleted successfully' });
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
  updateProfile,
  uploadResume,
  getResumes,
  deleteResume,
  addCoverLetter,
  getCoverLetters,
  deleteCoverLetter,
  setGoals
};
