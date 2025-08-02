export interface User {
  id: string;
  full_name?: string; // Optional untuk kompatibilitas dengan API yang berbeda
  FullName?: string; // Field dari API yang menggunakan FullName
  email: string;
  password?: string; // Optional karena tidak akan ditampilkan di response
  role: string;
  tenant_id?: string | null;
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
  force_password_change: boolean;
  // Additional fields untuk relasi
  tenant?: {
    id: string;
    name: string;
    domain?: string;
  } | null;
}

export interface CreateUserData {
  full_name: string;
  email: string;
  password: string;
  role: string;
  tenant_id?: string | null;
  isVerified?: boolean;
  force_password_change?: boolean;
}

export interface UpdateUserData extends Partial<CreateUserData> {
  id: string;
}

export interface UserFilters {
  search?: string;
  role?: string;
  tenant_id?: string;
  isVerified?: boolean;
}

export interface UserListResponse {
  message: string;
  data: User[];
}

export interface UserResponse {
  message: string;
  user: User;
}

export interface VerifyEmailData {
  email: string;
}

export interface VerifyUserData {
  id: string;
}

export interface ResetPasswordData {
  id: string;
  new_password?: string;
} 