import { authAtom } from '@/model/atoms';
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

    // Log auth response to check if roles are present
    console.log("Login response:", response);
    console.log("Roles from login:", response.roles);

    // Ensure roles are properly saved
    if (!response.roles) {
      response.roles = [];
    }

    store.set(authAtom, response);
    console.log("Auth state after login:", store.get(authAtom));

    return true;
  } catch (error) {
    console.error("Login failed", error);
    return false;
  }
};

export const refreshToken = async () => {
  const currentAuth = store.get(authAtom);
  const refreshTokenValue = currentAuth?.refreshToken;

  console.log("Current auth before refresh:", currentAuth);

  if (!refreshTokenValue) {
    console.warn("No refresh token available");
    return false;
  }

  try {
    const response = await authService.refreshToken(refreshTokenValue);
    console.log("Refresh token response:", response);

    // Ensure roles are preserved in the updated auth state
    const updatedAuth = {
      ...currentAuth,
      token: response.token,
      refreshToken: response.refreshToken,
      // Use response roles if available, otherwise keep current roles
      roles: response.roles || currentAuth?.roles || []
    };

    store.set(authAtom, updatedAuth);
    console.log("Auth state after refresh:", store.get(authAtom));

    return true;
  } catch (error) {
    console.error("Token refresh failed", error);
    return false;
  }
};

// Logout function
export const logout = () => {
  console.log("Logging out, clearing auth state");
  store.set(authAtom, null);
};

// Update user function
export const updateUser = (userData: Partial<AuthState>) => {
  const auth = store.get(authAtom);
  if (auth) {
    const updatedAuth = { ...auth, ...userData };
    store.set(authAtom, updatedAuth);
    console.log("Updated user data:", updatedAuth);
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const auth = store.get(authAtom);
  return !!auth?.token;
};
