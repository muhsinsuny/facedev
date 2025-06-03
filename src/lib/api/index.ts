// src/lib/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://truthful-simplicity-production.up.railway.app/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
