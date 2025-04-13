import apiClient from './api-client';
import { AddRoleModel, AuthModel, RegisterModel, TokenRequestModel, UserWithRolesModel } from '../types';

export const authService = {
  register: async (model: RegisterModel): Promise<AuthModel> => {
    const response = await apiClient.post<AuthModel>('/auth/register', model);
    console.log("response ---> ", response);

    // if (response.data.token) {
    //   localStorage.setItem('token', response.data.token);
    //   localStorage.setItem('refreshToken', response.data.refreshToken);
    // }
    return response.data;
  },

  login: async (model: TokenRequestModel): Promise<AuthModel> => {
    const response = await apiClient.post<AuthModel>('/auth/token', model);
    return response.data;
  },

  refreshToken: async (token: string): Promise<AuthModel> => {
    const response = await apiClient.post<AuthModel>('/auth/refreshToken', { refreshToken: token });
    return response.data;
  },

  revokeToken: async (token: string): Promise<boolean> => {
    const response = await apiClient.post<boolean>('/auth/revoke-token', { token });
    return response.data;
  },

  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },

  isLoggedIn: (): boolean => {
    return !!localStorage.getItem('token');
  },

  addRole: async (model: AddRoleModel): Promise<string> => {
    const response = await apiClient.post<string>('/auth/add-role', model);
    return response.data;
  },

  getUsersWithRoles: async (): Promise<UserWithRolesModel[]> => {
    const response = await apiClient.get<UserWithRolesModel[]>('/auth/users-with-roles');
    return response.data;
  }
};
