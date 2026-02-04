const {
  extractTextFromPDF,
  analyzeResume: analyzeResumeAI,
  generateCoverLetter: generateCoverLetterAI,
  predictSuccessProbability,
  generateApplicationInsights,
  getInterviewPrep
} = require('../services/aiService');
const User = require('../models/User');
const Application = require('../models/Application');

/**
 * Analyze resume with PDF extraction (FormData version)
 */
const analyzeResumeWithPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No PDF file uploaded' });
    }

    const { jobDescription, targetRole, jobRole } = req.body;
    const role = targetRole || jobRole || 'General';

    if (!jobDescription) {
      // Allow analysis without job description for basic analysis
    }

    const resumeText = await extractTextFromPDF(req.file.buffer);
    const analysis = await analyzeResumeAI(resumeText, jobDescription || '', role);

    res.json({
      success: true,
      analysis,
      extractedText: resumeText.substring(0, 500) + '...'
    });
  } catch (error) {
    console.error('Resume analysis error:', error);
    res.status(500).json({ message: error.message || 'Resume analysis failed' });
  }
};

const analyzeResumeText = async (req, res) => {
  try {
    const { resumeText, jobDescription, targetRole } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ message: 'Resume text and job description are required' });
    }

    const analysis = await analyzeResumeAI(resumeText, jobDescription, targetRole || 'General');

    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Resume analysis error:', error);
    res.status(500).json({ message: error.message || 'Resume analysis failed' });
  }
};

const generateCoverLetterHandler = async (req, res) => {
  try {
    const { company, position, jobDescription, resumeText } = req.body;

    if (!company || !position || !jobDescription || !resumeText) {
      return res.status(400).json({
        message: 'Company, position, job description, and resume text are required'
      });
    }

    const coverLetter = await generateCoverLetterAI(company, position, jobDescription, resumeText);

    if (req.user) {
      await User.findByIdAndUpdate(
        req.user.id,
        {
          $push: {
            coverLetters: {
              title: `${company} - ${position}`,
              content: coverLetter,
              jobPosition: position,
              company: company,
              createdAt: new Date()
            }
          }
        },
        { new: true }
      );
    }

    res.json({
      success: true,
      coverLetter,
      saved: !!req.user
    });
  } catch (error) {
    console.error('Cover letter generation error:', error);
    res.status(500).json({ message: error.message || 'Cover letter generation failed' });
  }
};

/**
 * Generate cover letter with PDF (FormData version)
 */
const generateCoverLetterPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No PDF file uploaded' });
    }

    const { jobDescription, jobRole } = req.body;
    const role = jobRole || 'Software Engineer';

    if (!jobDescription) {
      return res.status(400).json({ message: 'Job description is required' });
    }

    // Extract text from PDF
    const resumeText = await extractTextFromPDF(req.file.buffer);
    
    // Generate cover letter using extracted text
    const company = 'Company'; // Default company name
    const position = role;
    const coverLetter = await generateCoverLetterAI(company, position, jobDescription, resumeText);

    res.json({
      success: true,
      coverLetter,
      content: coverLetter,
      pdfData: null // We're not generating PDF, just text content
    });
  } catch (error) {
    console.error('Cover letter generation error:', error);
    res.status(500).json({ message: error.message || 'Cover letter generation failed' });
  }
};

const predictSuccess = async (req, res) => {
  try {
    const { applicationId, jobDescription } = req.body;

    if (!applicationId || !jobDescription) {
      return res.status(400).json({ message: 'Application ID and job description are required' });
    }

    const user = await User.findById(req.user.id).select('-password');
    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const applications = await Application.find({ userId: req.user.id }).lean();

    const userProfile = {
      name: user.name,
      headline: user.headline,
      experience: user.experience,
      education: user.education,
      skills: user.skills,
      location: user.location
    };

    const prediction = await predictSuccessProbability(
      userProfile,
      jobDescription,
      applications
    );

    application.successProbability = prediction.successProbability;
    application.successAnalysis = JSON.stringify(prediction);
    await application.save();

    res.json({
      success: true,
      prediction,
      applicationUpdated: true
    });
  } catch (error) {
    console.error('Success prediction error:', error);
    res.status(500).json({ message: error.message || 'Success prediction failed' });
  }
};

const getApplicationInsightsHandler = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const applications = await Application.find({ userId: req.user.id }).lean();

    if (applications.length === 0) {
      return res.json({
        success: true,
        insights: {
          message: 'No applications yet. Start applying to get insights!'
        }
      });
    }

    const userProfile = {
      name: user.name,
      headline: user.headline,
      experience: user.experience,
      education: user.education,
      skills: user.skills,
      location: user.location,
      preferences: user.preferences
    };

    const insights = await generateApplicationInsights(applications, userProfile);

    res.json({
      success: true,
      insights,
      applicationCount: applications.length,
      stats: {
        applied: applications.length,
        interviews: applications.filter(a => a.status === 'Interview Scheduled' || a.status === 'Interview Completed').length,
        offers: applications.filter(a => a.status === 'Offer Received').length
      }
    });
  } catch (error) {
    console.error('Application insights error:', error);
    res.status(500).json({ message: error.message || 'Insights generation failed' });
  }
};

const getInterviewGuidance = async (req, res) => {
  try {
    const { company, jobDescription } = req.body;

    if (!company || !jobDescription) {
      return res.status(400).json({ message: 'Company and job description are required' });
    }

    const user = await User.findById(req.user.id).select('-password');

    const userProfile = {
      name: user.name,
      experience: user.experience,
      education: user.education,
      skills: user.skills
    };

    const guidance = await getInterviewPrep(jobDescription, company, userProfile);

    res.json({
      success: true,
      guidance
    });
  } catch (error) {
    console.error('Interview guidance error:', error);
    res.status(500).json({ message: error.message || 'Interview guidance generation failed' });
  }
};

module.exports = {
  analyzeResumeWithPDF,
  analyzeResumeText,
  generateCoverLetterHandler,
  generateCoverLetterPDF,
  predictSuccess,
  getApplicationInsightsHandler,
  getInterviewGuidance
};
