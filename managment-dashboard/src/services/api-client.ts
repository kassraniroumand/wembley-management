import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import { getDefaultStore } from 'jotai';
import { tokenAtom } from '@/model/atoms';
import { refreshToken } from '@/utils/authUtils';

const store = getDefaultStore();

// Create base axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: "https://wembleyback-g3d7a0cqhacsfuhc.westus2-01.azurewebsites.net/api",
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to request if available
apiClient.interceptors.request.use((config) => {
  const token = store.get(tokenAtom);
  console.log("token ---> ", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError) => {
//     console.log("error ---> ", error);

//     const originalRequest = error.config;

//     // Handle 401 Unauthorized errors by refreshing the token

//       originalRequest['_retry'] = true;

//       try {
//         // Attempt to refresh the token
//         const refreshSuccessful = await refreshToken();

//         if (refreshSuccessful) {
//           // Get the new token and update the request
//           const newToken = store.get(tokenAtom);
//           originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

//           // Retry the original request with the new token
//           return apiClient(originalRequest);
//         }
//       } catch (refreshError) {
//         console.error('Token refresh failed:', refreshError);
//       }
//       return Promise.reject(error);
//     }
// );

export default apiClient;
