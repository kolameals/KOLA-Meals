import api from './api';

export interface RawMaterial {
  id: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  minimumStock: number;
  costPerUnit: number;
  supplier?: string;
  lastUpdated: string;
  createdAt: string;
}

export const rawMaterialService = {
  async getRawMaterials(): Promise<RawMaterial[]> {
    const response = await api.get('/raw-materials');
    return response.data;
  },

  async getRawMaterialById(id: string): Promise<RawMaterial> {
    const response = await api.get(`/raw-materials/${id}`);
    return response.data;
  },

  async createRawMaterial(data: Omit<RawMaterial, 'id' | 'createdAt' | 'lastUpdated'>): Promise<RawMaterial> {
    const response = await api.post('/raw-materials', data);
    return response.data;
  },

  async updateRawMaterial(id: string, data: Partial<Omit<RawMaterial, 'id' | 'createdAt' | 'lastUpdated'>>): Promise<RawMaterial> {
    const response = await api.put(`/raw-materials/${id}`, data);
    return response.data;
  },

  async deleteRawMaterial(id: string): Promise<void> {
    await api.delete(`/raw-materials/${id}`);
  },

  async updateStock(id: string, quantity: number): Promise<RawMaterial> {
    const response = await api.patch(`/raw-materials/${id}/stock`, { quantity });
    return response.data;
  }
}; 