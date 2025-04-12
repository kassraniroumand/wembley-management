import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import { getDefaultStore } from 'jotai';
import { tokenAtom } from '@/model/atoms';

const store = getDefaultStore();

// Create base axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: "http://localhost:5004/api",
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to request if available
apiClient.interceptors.request.use((config) => {
  const token = store.get(tokenAtom);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// Handle 401 responses with token refresh

export default apiClient;
