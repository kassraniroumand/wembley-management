// Auth-related DTOs
export interface AuthModel {
  message: string;
  isAuthenticated: boolean;
  username: string;
  email: string;
  roles: string[];
  token: string;
  refreshToken: string;
  expiresOn: string; // ISO date string
}

export interface TokenRequestModel {
  email: string;
  password: string;
}

export interface RegisterModel {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export interface AddRoleModel {
  userId: string;
  role: string;
}

export interface UserWithRolesModel {
  id: string;
  userName: string;
  email: string;
  roles: string[];
}
