import axios from 'axios';

// API base URL - adjust based on your backend server
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
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
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect on 401 if we're not already on login page
    // and if error is not due to network/backend being down
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      // Only clear auth if it's a real authentication error
      // Don't clear on network errors (error.code will be present)
      if (!error.code || error.code === 'ECONNREFUSED') {
        // Backend is down, don't clear user - just reject the promise
        return Promise.reject(error);
      }
      // Real auth error - clear and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

