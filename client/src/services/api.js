import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Validate API URL
if (!API_BASE_URL) {
  console.error('REACT_APP_API_URL is not set');
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout to 30 seconds
  withCredentials: true, // Enable credentials for CORS
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error.message);
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Provide more user-friendly error messages
    let errorMessage = 'Network error occurred';
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Cannot connect to server. Please check if the backend is running.';
    } else if (error.code === 'NETWORK_ERROR') {
      errorMessage = 'Network error. Please check your internet connection.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    error.userMessage = errorMessage;
    return Promise.reject(error);
  }
);

export default api;
