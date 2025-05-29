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
  addresses?: {
    id: string;
    apartment: string;
    tower: string;
    floor: string;
    roomNumber: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }[];
  subscription?: {
    id: string;
    planId: string;
    status: 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'EXPIRED';
    startDate: Date;
    endDate: Date;
    plan?: {
      id: string;
      name: string;
      price: number;
      mealsPerDay: number;
      description?: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
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