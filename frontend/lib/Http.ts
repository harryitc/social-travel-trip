// lib/Http.ts
import axios from "axios";

const Http = axios.create({
  timeout: 10000,
});

// Intercept request
Http.interceptors.request.use(async (config) => {
  return config;
});

// Intercept response
Http.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

export const attachToken = (config: any, token: string | null) => {
  return {
    ...config,
    headers: {
      ...config.headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

export default Http;
