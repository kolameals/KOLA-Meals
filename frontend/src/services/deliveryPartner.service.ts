import api from './api';

export interface DeliveryPartner {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
}

export const deliveryPartnerService = {
  async getDeliveryPartners(): Promise<DeliveryPartner[]> {
    const response = await api.get('/users/admin/delivery-partners');
    return response.data.data;
  },

  async createDeliveryPartner(data: Omit<DeliveryPartner, 'id' | 'createdAt' | 'updatedAt'> & { password: string }): Promise<DeliveryPartner> {
    const response = await api.post('/users/admin/delivery-partners', data);
    return response.data.data;
  },

  async updateDeliveryPartner(id: string, data: Partial<DeliveryPartner>): Promise<DeliveryPartner> {
    const response = await api.put(`/users/admin/delivery-partners/${id}`, data);
    return response.data.data;
  },

  async deleteDeliveryPartner(id: string): Promise<void> {
    await api.delete(`/users/admin/delivery-partners/${id}`);
  }
}; 