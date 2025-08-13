export interface LoginUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  tenantId: string | null;
  force_password_change: boolean;
}

export interface LoginResponse {
  message: string;
  data: {
    user: LoginUser;
    token: string;
  };
}

export interface AuthState {
  user: LoginUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
} 