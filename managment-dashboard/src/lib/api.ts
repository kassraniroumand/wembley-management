import { authAtom, refreshTokenAtom, tokenAtom } from "@/model/atoms";
import { LoginRequest } from "@/schema/loginSchema";
import axios, { AxiosError } from "axios";
import { getDefaultStore } from "jotai";
import { CreateRegionDto, Region, UpdateRegionDto } from "@/hooks/useRegion";
import { UserWithRolesModel } from "@/types/UserWithRolesModel";

const store = getDefaultStore();

const api = axios.create({
  baseURL: "http://localhost:5004",
  // withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = store.get(tokenAtom);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor with comprehensive error handling
api.interceptors.response.use(
  response => response, // Directly return successful responses.
  async error => {
    const originalRequest = error.config;
    console.log("error", originalRequest);

    originalRequest._retry = true; // Mark the request as retried to avoid infinite loops.
    try {
      const refreshToken = store.get(refreshTokenAtom);
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Make a request to refresh the token
      const response = await axios.post('/api/Auth/refreshToken', { RefreshToken: refreshToken });
      const { token: newToken, refreshToken: newRefreshToken } = response.data;

      // Update the auth state in the store
      const currentAuth = store.get(authAtom);
      if (currentAuth) {
        store.set(authAtom, {
          roles: currentAuth.roles,
          token: newToken,
          email: currentAuth.email,
          username: currentAuth.username,
          refreshToken: newRefreshToken || refreshToken
        });
      }

      // Retry the original request with the new token
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      // Handle refresh token errors by clearing auth state and redirecting to login
      console.error('Token refresh failed:', refreshError);
      store.set(authAtom, null);
      window.location.href = '/login';
      return Promise.reject(refreshError);
    }

    return Promise.reject(error); // For all other errors, return the error as is.
  }
);

export class ApiService {
  static async login(loginRequest: LoginRequest) {
    console.log("loginRequest", loginRequest);
    const response = await api.post("/api/Auth/token", loginRequest, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("response", response);
    return response.data;
  }
  static async verifyAuth() {
    try {
      const response = await api.get("/api/Auth/verify");
      return response.data;
    } catch (error) {
      return false;
    }
  }
  static async allRegion() {
    const response = await api.get("/api/Secured");
    return response.data;
  }
  // New Region API Methods
  static async getRegionById(id: string): Promise<Region> {
    const response = await api.get(`/api/Region/${id}`);
    return response.data;
  }
  static async createRegion(data: CreateRegionDto): Promise<Region> {
    const response = await api.post("/api/Region", data);
    return response.data;
  }
  static async updateRegion(data: UpdateRegionDto): Promise<Region> {
    const response = await api.put(`/api/Region/${data.id}`, data);
    return response.data;
  }
  static async deleteRegion(id: string): Promise<void> {
    await api.delete(`/api/Region/${id}`);
  }
  static async getUsersWithRoles(): Promise<UserWithRolesModel[]> {
    const response = await api.get(`api/auth/usersWithRoles`);
    return response.data
  }
  static async updateUserRole(userId: string, role: string): Promise<any> {
    const response = await api.post(`api/Auth/addrole`, {
      UserId: userId,
      Role: role
    });
    return response.data;
  }
}

export default api;
