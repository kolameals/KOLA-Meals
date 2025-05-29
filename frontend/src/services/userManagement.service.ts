import api from './api';
import type { User, CreateUserData, UpdateUserData, PaginatedResponse } from '../types/user.types';

interface ApartmentGroup {
  apartment: string;
  tower: string;
  users: Array<{
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    floor: string;
    roomNumber: string;
    hasActiveSubscription: boolean;
  }>;
  totalUsers: number;
  activeSubscribers: number;
}

interface NonSubscribedUser {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  addresses: Array<{
    id: string;
    apartment: string;
    tower: string;
    floor: string;
    roomNumber: string;
  }>;
  subscription: {
    status: string;
    endDate: string;
    plan: {
      name: string;
    };
  } | null;
}

export const userManagementService = {
  async getUsers(page = 1, limit = 10): Promise<PaginatedResponse<User>> {
    try {
      const response = await api.get('/users', { 
        params: { 
          page, 
          limit
        } 
      });
      
      // Debug: Log the raw response
      console.log('Raw API response:', response.data);
      
      // Handle both possible response structures
      const responseData = response.data;
      
      // If the response has a success field, it's wrapped in our standard format
      if (responseData.success) {
        const { data } = responseData;
        return {
          users: data.data || [],
          total: data.meta?.total || 0,
          page: data.meta?.page || page,
          totalPages: data.meta?.totalPages || 1
        };
      }
      
      // If the response is direct
      return {
        users: responseData.data || [],
        total: responseData.meta?.total || 0,
        page: responseData.meta?.page || page,
        totalPages: responseData.meta?.totalPages || 1
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      // Return a default response in case of error
      return {
        users: [],
        total: 0,
        page,
        totalPages: 1
      };
    }
  },

  async getUsersByApartment(): Promise<ApartmentGroup[]> {
    try {
      const response = await api.get('/users/by-apartment');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching users by apartment:', error);
      return [];
    }
  },

  async getNonSubscribedUsers(): Promise<NonSubscribedUser[]> {
    try {
      const response = await api.get('/users/non-subscribed');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching non-subscribed users:', error);
      return [];
    }
  },

  async getActiveSubscribers(): Promise<User[]> {
    try {
      const response = await api.get('/users/active-subscribers');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching active subscribers:', error);
      return [];
    }
  },

  async createUser(userData: CreateUserData): Promise<User> {
    const response = await api.post('/users', userData);
    return response.data.data;
  },

  async updateUser(userId: string, userData: UpdateUserData): Promise<User> {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data.data;
  },

  async deleteUser(userId: string): Promise<void> {
    await api.delete(`/users/${userId}`);
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