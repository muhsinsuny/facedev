// src/lib/api/index.ts
import axios from 'axios';

console.log('API base URL:', import.meta.env.VITE_API_BASE_URL);

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) { 
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });