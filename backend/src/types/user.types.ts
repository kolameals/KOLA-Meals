export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
  DELIVERY_PARTNER = 'DELIVERY_PARTNER'
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
  email?: string | null;
  phoneNumber?: string | null;
  password?: string;
  role?: UserRole;
}

export interface AuthenticatedUser {
  id: string;
  role: UserRole;
  email: string | null;
  name: string;
  phoneNumber: string | null;
} 