import { authAtom } from '@/model/atoms';
import { ApiService } from '@/lib/api';
import { getDefaultStore } from 'jotai';
import { authService } from '@/services';

// Get the default Jotai store
const store = getDefaultStore();

interface AuthState {
  roles: string[];
  token: string;
  email: string;
  username: string;
  refreshToken: string;
}

// Login function
export const login = async (email: string, password: string) => {
  try {
    const response = await authService.login({ email, password });
    store.set(authAtom, response);
    return true;
  } catch (error) {
    console.error("Login failed", error);
    return false;
  }
};

// Logout function
export const logout = () => {
  store.set(authAtom, null);
};

// Update user function
export const updateUser = (userData: Partial<AuthState>) => {
  const auth = store.get(authAtom);
  if (auth) {
    store.set(authAtom, { ...auth, ...userData });
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const auth = store.get(authAtom);
  return !!auth?.token;
};
