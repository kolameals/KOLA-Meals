export enum UserRole {
  ADMIN = 'ADMIN',
  DELIVERY_PARTNER = 'DELIVERY_PARTNER',
  CUSTOMER = 'CUSTOMER'
}

export interface User {
  id: string;
  email?: string;
  phoneNumber?: string;
  name: string;
  role: UserRole;
  apartment?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
} 