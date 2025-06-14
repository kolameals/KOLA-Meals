import { UserRole } from '../types/user.types.js';
import type { CreateUserData, UpdateUserData } from '../types/user.types.js';

export const validateCreateUser = (data: CreateUserData): string | null => {
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    return 'Name is required';
  }

  if (data.email && typeof data.email !== 'string') {
    return 'Email must be a string';
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return 'Invalid email format';
  }

  if (data.phoneNumber && typeof data.phoneNumber !== 'string') {
    return 'Phone number must be a string';
  }

  if (data.phoneNumber && !/^\+?[\d\s-]{10,}$/.test(data.phoneNumber)) {
    return 'Invalid phone number format';
  }

  if (!data.password || typeof data.password !== 'string' || data.password.length < 6) {
    return 'Password must be at least 6 characters long';
  }

  if (!data.role || !Object.values(UserRole).includes(data.role)) {
    return 'Invalid role';
  }

  return null;
};

export const validateUpdateUser = (data: UpdateUserData): string | null => {
  if (data.name && (typeof data.name !== 'string' || data.name.trim().length === 0)) {
    return 'Name must be a non-empty string';
  }

  if (data.email !== undefined && typeof data.email !== 'string') {
    return 'Email must be a string';
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return 'Invalid email format';
  }

  if (data.phoneNumber !== undefined && typeof data.phoneNumber !== 'string') {
    return 'Phone number must be a string';
  }

  if (data.phoneNumber && !/^\+?[\d\s-]{10,}$/.test(data.phoneNumber)) {
    return 'Invalid phone number format';
  }

  if (data.password && (typeof data.password !== 'string' || data.password.length < 6)) {
    return 'Password must be at least 6 characters long';
  }

  if (data.role && !Object.values(UserRole).includes(data.role)) {
    return 'Invalid role';
  }

  return null;
}; 