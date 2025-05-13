import axios from 'axios';

const api = axios.create({
  baseURL: 'https://mazeapi.onrender.com',
});

export default api;