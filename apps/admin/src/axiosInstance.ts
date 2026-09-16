import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  withCredentials: true,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth failures
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear token and reload or trigger redirect
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_info');
      // If we are not on the login page already, redirect
      if (window.location.pathname !== '/login') {
        window.dispatchEvent(new CustomEvent('auth-failed'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
