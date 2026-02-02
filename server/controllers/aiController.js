const { body, validationResult } = require('express-validator');
const aiService = require('../services/ai.service');

// Analyze resume
const analyzeResume = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { resumeText, targetRole } = req.body;

    const analysis = await aiService.analyzeResume(resumeText, targetRole || 'General');

    res.json({ analysis });
  } catch (error) {
    console.error('Resume analysis error:', error);
    res.status(500).json({ message: 'Server error during resume analysis' });
  }
};

// Optimize resume
const optimizeResume = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { resumeText, jobDescription } = req.body;

    const optimizedResume = await aiService.optimizeResume(resumeText, jobDescription);

    res.json({ optimizedResume });
  } catch (error) {
    console.error('Resume optimization error:', error);
    res.status(500).json({ message: 'Server error during resume optimization' });
  }
};

// Generate cover letter
const generateCoverLetter = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Support both old format (profileData, jobDescription) and new format (company, position, additionalInfo)
    const { profileData, jobDescription, company, position, additionalInfo } = req.body;

    let coverLetter;
    if (company && position) {
      // New format from frontend
      const jobInfo = `Company: ${company}\nPosition: ${position}\n\nAdditional Info: ${additionalInfo || 'None'}`;
      coverLetter = await aiService.generateCoverLetter(profileData || {}, jobInfo);
    } else {
      // Legacy format
      coverLetter = await aiService.generateCoverLetter(profileData, jobDescription);
    }

    res.json({ coverLetter });
  } catch (error) {
    console.error('Cover letter generation error:', error);
    res.status(500).json({ message: 'Server error during cover letter generation' });
  }
};

// Predict interview questions
const predictInterviewQuestions = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Support both old format (jobDescription) and new format (company, role, questionType)
    const { jobDescription, company, role, questionType } = req.body;

    let jobInfo;
    if (company || role) {
      // New format from frontend
      jobInfo = `Company: ${company || 'Not specified'}\nPosition: ${role || 'Not specified'}\nQuestion Type: ${questionType || 'behavioral'}`;
    } else {
      jobInfo = jobDescription;
    }

    const questions = await aiService.predictInterviewQuestions(jobInfo, questionType);

    res.json({ questions });
  } catch (error) {
    console.error('Interview questions prediction error:', error);
    res.status(500).json({ message: 'Server error during interview questions prediction' });
  }
};

// Analyze success probability
const analyzeSuccessProbability = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { profileData, jobDescription } = req.body;

    const analysis = await aiService.analyzeSuccessProbability(profileData, jobDescription);

    res.json({ analysis });
  } catch (error) {
    console.error('Success probability analysis error:', error);
    res.status(500).json({ message: 'Server error during success probability analysis' });
  }
};

// Get interview feedback
const getInterviewFeedback = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { question, answer, role } = req.body;

    const feedback = await aiService.getInterviewFeedback(question, answer, role);

    res.json({ feedback });
  } catch (error) {
    console.error('Interview feedback error:', error);
    res.status(500).json({ message: 'Server error during interview feedback' });
  }
};

module.exports = {
  analyzeResume: [
    body('resumeText').notEmpty().withMessage('Resume text is required'),
    analyzeResume,
  ],
  optimizeResume: [
    body('resumeText').notEmpty().withMessage('Resume text is required'),
    body('jobDescription').notEmpty().withMessage('Job description is required'),
    optimizeResume,
  ],
  generateCoverLetter: [
    // Allow either format
    generateCoverLetter,
  ],
  predictInterviewQuestions: [
    // Allow either format
    predictInterviewQuestions,
  ],
  analyzeSuccessProbability: [
    body('profileData').notEmpty().withMessage('Profile data is required'),
    body('jobDescription').notEmpty().withMessage('Job description is required'),
    analyzeSuccessProbability,
  ],
  getInterviewFeedback: [
    body('question').notEmpty().withMessage('Question is required'),
    body('answer').notEmpty().withMessage('Answer is required'),
    getInterviewFeedback,
  ],
};
