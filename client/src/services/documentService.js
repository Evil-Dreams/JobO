import api from './api';

// Resume services
export const uploadResume = async (formData, title, jobRole, description) => {
  const formDataWithMetadata = new FormData();
  formDataWithMetadata.append('resume', formData.get('resume'));
  formDataWithMetadata.append('title', title);
  formDataWithMetadata.append('jobRole', jobRole);
  formDataWithMetadata.append('description', description);

  const response = await api.post('/documents/resumes', formDataWithMetadata, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const getResumes = async () => {
  const response = await api.get('/documents/resumes');
  return response.data;
};

export const getResumeFile = async (id) => {
  const response = await api.get(`/documents/resumes/${id}`, {
    responseType: 'blob'
  });
  return response.data;
};

export const updateResume = async (id, title, jobRole, description) => {
  const response = await api.put(`/documents/resumes/${id}`, {
    title,
    jobRole,
    description
  });
  return response.data;
};

export const deleteResume = async (id) => {
  const response = await api.delete(`/documents/resumes/${id}`);
  return response.data;
};

// Cover letter services
export const uploadCoverLetter = async (formData, title, content) => {
  const formDataWithMetadata = new FormData();
  if (formData.get('coverLetter')) {
    formDataWithMetadata.append('coverLetter', formData.get('coverLetter'));
  }
  formDataWithMetadata.append('title', title);
  formDataWithMetadata.append('content', content);

  const response = await api.post('/documents/cover-letters', formDataWithMetadata, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const getCoverLetters = async () => {
  const response = await api.get('/documents/cover-letters');
  return response.data;
};

export const getCoverLetterFile = async (id) => {
  const response = await api.get(`/documents/cover-letters/${id}`, {
    responseType: 'blob'
  });
  return response.data;
};

export const deleteCoverLetter = async (id) => {
  const response = await api.delete(`/documents/cover-letters/${id}`);
  return response.data;
};
