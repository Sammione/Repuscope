import axios from 'axios';

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8000/api/v1'
    : 'https://repuscope.onrender.com/api/v1';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token from localStorage
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('repuscope_token');
  if (token) {
    config.params = { ...config.params, token };
  }
  return config;
});

export default client;
