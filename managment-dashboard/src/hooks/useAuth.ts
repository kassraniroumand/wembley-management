import { useMutation, useQuery } from '@tanstack/react-query';
import { authService } from '@/services';
import { AddRoleModel, RegisterModel, TokenRequestModel, UserWithRolesModel } from '@/types';
import { queryClient } from './query-provider';

// Auth Query Keys
export const authKeys = {
  all: ['auth'] as const,
  users: () => [...authKeys.all, 'users'] as const,
};

// Hooks
export const useRegister = (model: RegisterModel) => {
  return useMutation({
    mutationFn: (model: RegisterModel) => authService.register(model),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
};

export const useLogin = (model: TokenRequestModel) => {
  return useMutation({
    mutationFn: (model: TokenRequestModel) => authService.login(model),
  });
};

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: (token: string) => authService.refreshToken(token),
  });
};

export const useRevokeToken = () => {
  return useMutation({
    mutationFn: (token: string) => authService.revokeToken(token),
  });
};

export const useLogout = () => {
  return {
    logout: () => {
      authService.logout();
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  };
};

export const useAddRole = () => {
  return useMutation({
    mutationFn: (model: AddRoleModel) => authService.addRole(model),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.users() });
    },
  });
};

export const useUsersWithRoles = () => {
  return useQuery({
    queryKey: authKeys.users(),
    queryFn: (): Promise<UserWithRolesModel[]> => authService.getUsersWithRoles(),
  });
};
