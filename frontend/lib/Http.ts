// lib/Http.ts
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';

const Http = axios.create({
  timeout: 10000,
});

// Intercept request
Http.interceptors.request.use(async (config) => {
  
  const { getToken } = await useAuth();

  const token = await getToken(); // TODO: WRONG

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercept response
Http.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default Http;
