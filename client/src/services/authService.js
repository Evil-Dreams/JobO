import api from './api';

const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

const login = async (userData) => {
  const response = await api.post('/auth/login', userData);
  return response.data;
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const updateProfile = async (profileData) => {
  const response = await api.put('/user/profile', profileData);
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  updateProfile,
};

export default authService;
