import api from './api';

/**
 * Analyze resume PDF with job description
 */
export const analyzeResumePDF = async (file, jobDescription, targetRole = '') => {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('jobDescription', jobDescription);
  if (targetRole) formData.append('targetRole', targetRole);

  const response = await api.post('/ai/analyze-resume/pdf', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

/**
 * Analyze resume text with job description
 */
export const analyzeResumeText = async (resumeText, jobDescription, targetRole = '') => {
  const response = await api.post('/ai/analyze-resume/text', {
    resumeText,
    jobDescription,
    targetRole
  });
  return response.data;
};

/**
 * Analyze resume (new version for resume manager with FormData support)
 */
export const analyzeResume = async (resumeData, jobDescription, jobRole) => {
  if (resumeData instanceof FormData) {
    // Handle FormData upload
    const response = await api.post('/ai/analyze-resume/pdf', resumeData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } else {
    // Handle base64 or text data (legacy)
    const response = await api.post('/ai/analyze-resume', {
      resumeData,
      jobDescription,
      jobRole
    });
    return response.data;
  }
};

/**
 * Generate cover letter (new version for resume manager with FormData support)
 */
export const generateCoverLetter = async (resumeData, jobDescription, jobRole) => {
  if (resumeData instanceof FormData) {
    // Handle FormData upload
    const response = await api.post('/ai/generate-cover-letter/pdf', resumeData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } else {
    // Handle base64 or text data (legacy)
    const response = await api.post('/ai/generate-cover-letter', {
      resumeData,
      jobDescription,
      jobRole
    });
    return response.data;
  }
};

/**
 * Optimize resume (legacy compatibility)
 */
export const optimizeResume = async (resumeText, jobDescription) => {
  return analyzeResumeText(resumeText, jobDescription);
};

/**
 * Generate AI cover letter (legacy compatibility)
 */
export const generateCoverLetterAI = async (company, position, jobDescription, resumeText) => {
  const response = await api.post('/ai/generate-cover-letter', {
    company,
    position,
    jobDescription,
    resumeText
  });
  return response.data;
};

/**
 * Generate cover letter (legacy compatibility)
 */
export const generateCoverLetterLegacy = async ({ company, position, additionalInfo }) => {
  return generateCoverLetterAI(company, position, additionalInfo || '', '');
};

/**
 * Predict interview questions (legacy compatibility)
 */
export const predictInterviewQuestions = async (jobDescription) => {
  return getInterviewGuidance('', jobDescription);
};

/**
 * Generate interview questions (legacy compatibility)
 */
export const generateInterviewQuestions = async ({ company, role, questionType }) => {
  return getInterviewGuidance(company || 'the company', '');
};

/**
 * Get interview feedback (legacy compatibility)
 */
export const getInterviewFeedback = async ({ question, answer }) => {
  // For now, return a placeholder response
  return { feedback: 'Interview feedback will be provided here' };
};

/**
 * Analyze success probability (legacy compatibility)
 */
export const analyzeSuccessProbability = async (profileData, jobDescription) => {
  return predictSuccessProbability(null, jobDescription);
};

/**
 * Predict success probability for an application
 */
export const predictSuccessProbability = async (applicationId, jobDescription) => {
  const response = await api.post('/ai/predict-success', {
    applicationId,
    jobDescription
  });
  return response.data;
};

/**
 * Get AI insights for all applications
 */
export const getApplicationInsights = async () => {
  const response = await api.get('/ai/application-insights');
  return response.data;
};

/**
 * Get interview preparation guidance
 */
export const getInterviewGuidance = async (company, jobDescription) => {
  const response = await api.post('/ai/interview-prep', {
    company,
    jobDescription
  });
  return response.data;
};

const aiService = {
  analyzeResume,
  analyzeResumePDF,
  analyzeResumeText,
  optimizeResume,
  generateCoverLetter,
  generateCoverLetterAI,
  generateCoverLetterLegacy,
  predictInterviewQuestions,
  generateInterviewQuestions,
  getInterviewFeedback,
  analyzeSuccessProbability,
  predictSuccessProbability,
  getApplicationInsights,
  getInterviewGuidance,
};

export default aiService;
