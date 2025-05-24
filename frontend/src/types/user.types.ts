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
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  name: string;
  email?: string;
  phoneNumber?: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  role?: UserRole;
}

export interface PaginatedResponse<T> {
  users: T[];
  total: number;
  page: number;
  totalPages: number;
} 