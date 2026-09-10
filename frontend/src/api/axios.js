import axios from 'axios';

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (!envUrl || envUrl.trim() === '') {
    // In production, fallback directly to the live Render backend
    if (import.meta.env.PROD) {
      return 'https://parkease-backend-pwd9.onrender.com/api/v1';
    }
    return '/api/v1';
  }
  let cleanUrl = envUrl.trim().replace(/\/+$/, '');
  if (!cleanUrl.endsWith('/api/v1')) {
    if (cleanUrl.endsWith('/api')) {
      cleanUrl = `${cleanUrl}/v1`;
    } else {
      cleanUrl = `${cleanUrl}/api/v1`;
    }
  }
  return cleanUrl;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('parkease_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors uniformly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized and request was not to login/register, clear token
      const url = error.config?.url || '';
      if (!url.includes('/auth/login') && !url.includes('/auth/register')) {
        localStorage.removeItem('parkease_token');
        localStorage.removeItem('parkease_user');
        window.dispatchEvent(new Event('auth_state_changed'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
