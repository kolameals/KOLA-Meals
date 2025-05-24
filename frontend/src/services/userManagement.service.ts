import api from './api';
import type { User, CreateUserData, UpdateUserData, PaginatedResponse } from '../types/user.types';

export const userManagementService = {
  async getUsers(page = 1, limit = 10): Promise<PaginatedResponse<User>> {
    try {
      const response = await api.get('/users', { params: { page, limit } });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  async createUser(userData: CreateUserData): Promise<User> {
    try {
      const response = await api.post('/users', userData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  async updateUser(userId: string, userData: UpdateUserData): Promise<User> {
    try {
      const response = await api.patch(`/users/${userId}`, userData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  async deleteUser(userId: string): Promise<void> {
    try {
      await api.delete(`/users/${userId}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  async getDeliveryPartners(page = 1, limit = 10): Promise<PaginatedResponse<User>> {
    try {
      const response = await api.get('/users/delivery-partners', { params: { page, limit } });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching delivery partners:', error);
      throw error;
    }
  },

  async createDeliveryPartner(userData: CreateUserData): Promise<User> {
    try {
      const response = await api.post('/users/delivery-partners', userData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating delivery partner:', error);
      throw error;
    }
  }
}; 