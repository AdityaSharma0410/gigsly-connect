import axios from 'axios';
import { authStorage } from './auth-storage';

const baseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8081';

export const api = axios.create({
  baseURL: `${baseUrl.replace(/\/$/, '')}/api`,
});

api.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authStorage.clear();
    }
    return Promise.reject(error);
  }
);

export default api;

