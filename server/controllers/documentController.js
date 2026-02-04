const Resume = require('../models/Resume');
const CoverLetter = require('../models/CoverLetter');
const fs = require('fs');
const path = require('path');

// Upload resume
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title, jobRole, description } = req.body;
    const userId = req.user.id;

    // Create resume record
    const resume = new Resume({
      user: userId,
      title: title || req.file.originalname.replace('.pdf', ''),
      originalName: req.file.originalname,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      jobRole: jobRole || '',
      description: description || ''
    });

    await resume.save();

    const responseData = {
      message: 'Resume uploaded successfully',
      resume: {
        id: resume._id,
        title: resume.title,
        originalName: resume.originalName,
        size: resume.size,
        uploadDate: resume.uploadDate,
        jobRole: resume.jobRole,
        description: resume.description,
        filename: resume.filename
      }
    };

    res.status(201).json(responseData);
  } catch (error) {
    console.error('Upload resume error:', error);
    res.status(500).json({ message: 'Failed to upload resume' });
  }
};

// Get all resumes for a user
const getResumes = async (req, res) => {
  try {
    
    
    
    
    const userId = req.user.id;
    
    // First, let's check all resumes in the database
    const allResumes = await Resume.find({});
    
    
    
    // Now check resumes for this specific user
    const resumes = await Resume.find({ user: userId, isActive: true })
      .select('title originalName size uploadDate jobRole description filename')
      .sort({ uploadDate: -1 });

    
    
    
    // Check if there are any resumes with different user IDs
    const distinctUsers = await Resume.distinct('user');
    
    
    // Check if the current user ID matches any stored resume user IDs
    const matchingResumes = allResumes.filter(resume => resume.user.toString() === userId);
    

    res.json(resumes);
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ message: 'Failed to get resumes' });
  }
};

// Get single resume
const getResume = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const resume = await Resume.findOne({ _id: id, user: userId, isActive: true });
    
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Check if file exists
    if (!fs.existsSync(resume.path)) {
      return res.status(404).json({ message: 'Resume file not found' });
    }

    res.setHeader('Content-Type', resume.mimetype);
    res.setHeader('Content-Disposition', `attachment; filename="${resume.originalName}"`);
    
    const fileStream = fs.createReadStream(resume.path);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ message: 'Failed to get resume' });
  }
};

// Update resume
const updateResume = async (req, res) => {
  try {
    
    
    
    

    const { id } = req.params;
    const { title, jobRole, description } = req.body;
    const userId = req.user.id;

    const resume = await Resume.findOne({ _id: id, user: userId, isActive: true });
    
    if (!resume) {
      
      return res.status(404).json({ message: 'Resume not found' });
    }

    

    resume.title = title || resume.title;
    resume.jobRole = jobRole || resume.jobRole;
    resume.description = description || resume.description;

    

    await resume.save();

    

    res.json({
      message: 'Resume updated successfully',
      resume: {
        id: resume._id,
        title: resume.title,
        jobRole: resume.jobRole,
        description: resume.description
      }
    });
  } catch (error) {
    console.error('Update resume error:', error);
    res.status(500).json({ message: 'Failed to update resume' });
  }
};

// Delete resume
const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const resume = await Resume.findOne({ _id: id, user: userId, isActive: true });
    
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Delete file from filesystem
    if (fs.existsSync(resume.path)) {
      fs.unlinkSync(resume.path);
    }

    // Soft delete by setting isActive to false
    resume.isActive = false;
    await resume.save();

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ message: 'Failed to delete resume' });
  }
};

// Upload cover letter
const uploadCoverLetter = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    let coverLetterData = {
      user: userId,
      title: title || 'Cover Letter',
      content: content || '',
      isGenerated: false
    };

    // If file is uploaded
    if (req.file) {
      coverLetterData.filename = req.file.filename;
      coverLetterData.mimetype = req.file.mimetype;
      coverLetterData.size = req.file.size;
      coverLetterData.path = req.file.path;
      coverLetterData.originalName = req.file.originalname;
    }

    const coverLetter = new CoverLetter(coverLetterData);
    await coverLetter.save();

    res.status(201).json({
      message: 'Cover letter uploaded successfully',
      coverLetter: {
        id: coverLetter._id,
        title: coverLetter.title,
        content: coverLetter.content,
        uploadDate: coverLetter.uploadDate,
        isGenerated: coverLetter.isGenerated
      }
    });
  } catch (error) {
    console.error('Upload cover letter error:', error);
    res.status(500).json({ message: 'Failed to upload cover letter' });
  }
};

// Get all cover letters for a user
const getCoverLetters = async (req, res) => {
  try {
    const userId = req.user.id;
    const coverLetters = await CoverLetter.find({ user: userId, isActive: true })
      .select('title content uploadDate isGenerated generatedFor')
      .sort({ uploadDate: -1 });

    res.json(coverLetters);
  } catch (error) {
    console.error('Get cover letters error:', error);
    res.status(500).json({ message: 'Failed to get cover letters' });
  }
};

// Get single cover letter
const getCoverLetter = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const coverLetter = await CoverLetter.findOne({ _id: id, user: userId, isActive: true });
    
    if (!coverLetter) {
      return res.status(404).json({ message: 'Cover letter not found' });
    }

    // If it's a file-based cover letter, send the file
    if (coverLetter.path && fs.existsSync(coverLetter.path)) {
      res.setHeader('Content-Type', coverLetter.mimetype);
      res.setHeader('Content-Disposition', `attachment; filename="${coverLetter.originalName || 'cover-letter.pdf'}"`);
      
      const fileStream = fs.createReadStream(coverLetter.path);
      fileStream.pipe(res);
    } else {
      // Send content as text
      res.setHeader('Content-Type', 'text/plain');
      res.send(coverLetter.content);
    }
  } catch (error) {
    console.error('Get cover letter error:', error);
    res.status(500).json({ message: 'Failed to get cover letter' });
  }
};

// Delete cover letter
const deleteCoverLetter = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const coverLetter = await CoverLetter.findOne({ _id: id, user: userId, isActive: true });
    
    if (!coverLetter) {
      return res.status(404).json({ message: 'Cover letter not found' });
    }

    // Delete file from filesystem if it exists
    if (coverLetter.path && fs.existsSync(coverLetter.path)) {
      fs.unlinkSync(coverLetter.path);
    }

    // Soft delete
    coverLetter.isActive = false;
    await coverLetter.save();

    res.json({ message: 'Cover letter deleted successfully' });
  } catch (error) {
    console.error('Delete cover letter error:', error);
    res.status(500).json({ message: 'Failed to delete cover letter' });
  }
};

module.exports = {
  uploadResume,
  getResumes,
  getResume,
  updateResume,
  deleteResume,
  uploadCoverLetter,
  getCoverLetters,
  getCoverLetter,
  deleteCoverLetter
};
