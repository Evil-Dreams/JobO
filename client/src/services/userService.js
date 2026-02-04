import api from './api';

const getProfile = async () => {
  const response = await api.get('/user/profile');
  return response.data;
};

const updateProfile = async (profileData) => {
  const response = await api.put('/user/profile', profileData);
  return response.data;
};

const uploadProfileImage = async (formData) => {
  const response = await api.post('/user/profile/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const uploadResume = async (formData) => {
  const response = await api.post('/user/resumes', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const getResumes = async () => {
  const response = await api.get('/user/resumes');
  return response.data;
};

const deleteResume = async (resumeId) => {
  const response = await api.delete(`/user/resumes/${resumeId}`);
  return response.data;
};

const saveCoverLetter = async (coverLetterData) => {
  const response = await api.post('/user/cover-letters', coverLetterData);
  return response.data;
};

const getCoverLetters = async () => {
  const response = await api.get('/user/cover-letters');
  return response.data;
};

const userService = {
  getProfile,
  updateProfile,
  uploadProfileImage,
  uploadResume,
  getResumes,
  deleteResume,
  saveCoverLetter,
  getCoverLetters,
};

export default userService;

