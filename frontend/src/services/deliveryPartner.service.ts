import api from './api';

export interface Address {
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
}

export interface DeliveryAgent {
  id: string;
  userId: string;
  isAvailable: boolean;
  assignedTowers: string[];
  assignedRooms: string[];
  apartmentId: string;
  mealCount: number;
  currentLocation: string | null;
  createdAt: string;
  updatedAt: string;
  assignedTowerDetails?: Array<{
    id: string;
    name: string;
    floors: number;
    roomsPerFloor: number;
  }>;
}

export interface DeliveryPartner {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
  deliveryAgent?: DeliveryAgent;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApartmentUser {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  floor: string;
  roomNumber: string;
  hasActiveSubscription: boolean;
}

export interface ApartmentData {
  apartment: string;
  tower: string;
  users: ApartmentUser[];
  totalUsers: number;
  activeSubscribers: number;
}

export interface Tower {
  id: string;
  name: string;
  floors: number;
  roomsPerFloor: number;
  apartmentId: string;
  createdAt: string;
  updatedAt: string;
}

const deliveryPartnerService = {
  async getDeliveryPartners(page = 1, pageSize = 10): Promise<PaginatedResponse<DeliveryPartner>> {
    try {
      const response = await api.get(`/users/admin/delivery-partners?page=${page}&limit=${pageSize}`);
      console.log('Raw API response:', response);
      
      // Ensure we have the correct response structure
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        return {
          data: response.data.data,
          meta: response.data.meta
        };
      }
      
      // If the response structure is different, try to handle it
      if (response.data && Array.isArray(response.data)) {
        return {
          data: response.data,
          meta: {
            page,
            limit: pageSize,
            total: response.data.length,
            totalPages: Math.ceil(response.data.length / pageSize)
          }
        };
      }
      
      // If we can't handle the response, return empty data
      console.error('Unexpected response structure:', response);
      return {
        data: [],
        meta: {
          page,
          limit: pageSize,
          total: 0,
          totalPages: 0
        }
      };
    } catch (error) {
      console.error('Error in getDeliveryPartners:', error);
      throw error;
    }
  },

  async getAddresses(): Promise<PaginatedResponse<Address>> {
    const response = await api.get('/users/addresses');
    return response.data;
  },

  async createDeliveryPartner(data: Omit<DeliveryPartner, 'id' | 'createdAt' | 'updatedAt'> & { 
    password: string;
    assignedTowers: string[];
    assignedRooms: string[];
    mealCount: number;
  }): Promise<DeliveryPartner> {
    const response = await api.post('/users/admin/delivery-partners', data);
    return response.data.data;
  },

  async updateDeliveryPartner(id: string, data: Partial<DeliveryPartner> & {
    assignedTowers?: string[];
    assignedRooms?: string[];
    mealCount?: number;
  }): Promise<DeliveryPartner> {
    const response = await api.put(`/users/admin/delivery-partners/${id}`, data);
    return response.data.data;
  },

  async deleteDeliveryPartner(id: string): Promise<void> {
    await api.delete(`/users/admin/delivery-partners/${id}`);
  },

  async updateDeliveryAgentStatus(id: string, isAvailable: boolean): Promise<DeliveryPartner> {
    const response = await api.patch(`/users/admin/delivery-partners/${id}/status`, { isAvailable });
    return response.data.data;
  },

  async updateDeliveryAgentAssignments(id: string, data: {
    assignedTowers: string[];
    assignedRooms: string[];
    mealCount: number;
  }): Promise<DeliveryPartner> {
    const response = await api.patch(`/users/admin/delivery-partners/${id}/assignments`, data);
    return response.data.data;
  },

  async getApartmentsWithUsers(): Promise<ApartmentData[]> {
    try {
      const response = await api.get('/users/by-apartment');
      console.log('Raw apartment data response:', response);
      
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      console.error('Unexpected apartment data structure:', response);
      return [];
    } catch (error) {
      console.error('Error fetching apartment data:', error);
      throw error;
    }
  },

  async resetAllAssignments(): Promise<void> {
    await api.post('/users/admin/delivery-partners/reset-assignments');
  },

  async getTowers(): Promise<Tower[]> {
    const response = await api.get('/towers');
    return response.data.data || [];
  }
};

export default deliveryPartnerService; 