import api from './api';

const getApplications = async () => {
  const response = await api.get('/applications');
  return response.data;
};

const getApplication = async (id) => {
  const response = await api.get(`/applications/${id}`);
  return response.data;
};

const createApplication = async (applicationData) => {
  const response = await api.post('/applications', applicationData);
  return response.data;
};

const updateApplication = async (id, applicationData) => {
  const response = await api.put(`/applications/${id}`, applicationData);
  return response.data;
};

const deleteApplication = async (id) => {
  const response = await api.delete(`/applications/${id}`);
  return response.data;
};

const applicationService = {
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
};

export default applicationService;
