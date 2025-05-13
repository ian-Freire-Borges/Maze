import axios from 'axios';

const api = axios.create({
  baseURL: 'https://mazeapi.onrender.com',
});

api.interceptors.request.use((config) => {
  const token = import.meta.env.VITE_API_TOKEN;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;