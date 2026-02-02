import api from './api';

const getProfile = async () => {
  const response = await api.get('/user/profile');
  return response.data;
};

const updateProfile = async (profileData) => {
  const response = await api.put('/user/profile', profileData);
  return response.data;
};

const userService = {
  getProfile,
  updateProfile,
};

export default userService;
