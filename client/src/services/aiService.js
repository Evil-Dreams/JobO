import api from './api';

export const analyzeResume = async (resumeText, targetRole) => {
  const response = await api.post('/ai/analyze-resume', { resumeText, targetRole });
  return response.data;
};

export const optimizeResume = async (resumeText, jobDescription) => {
  const response = await api.post('/ai/resume', { resumeText, jobDescription });
  return response.data;
};

export const generateCoverLetter = async ({ company, position, additionalInfo }) => {
  const response = await api.post('/ai/cover-letter', {
    company,
    position,
    additionalInfo: additionalInfo || '',
  });
  return response.data;
};

export const predictInterviewQuestions = async (jobDescription) => {
  const response = await api.post('/ai/interview', { jobDescription });
  return response.data;
};

export const generateInterviewQuestions = async ({ company, role, questionType }) => {
  const response = await api.post('/ai/interview', {
    company: company || 'the company',
    role: role || 'the position',
    questionType: questionType || 'behavioral',
  });
  return response.data;
};

export const getInterviewFeedback = async ({ question, answer }) => {
  const response = await api.post('/ai/feedback', {
    question,
    answer,
  });
  return response.data;
};

export const analyzeSuccessProbability = async (profileData, jobDescription) => {
  const response = await api.post('/ai/success', { profileData, jobDescription });
  return response.data;
};

const aiService = {
  analyzeResume,
  optimizeResume,
  generateCoverLetter,
  predictInterviewQuestions,
  generateInterviewQuestions,
  getInterviewFeedback,
  analyzeSuccessProbability,
};

export default aiService;
