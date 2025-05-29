import api from './api';
import { 
  StaffCost, 
  EquipmentCost, 
  FacilityCost, 
  CostSummary,
  DeliveryCostConfig
} from '@/types/cost.types';

export const costService = {
  // Delivery cost configuration
  async getDeliveryCostConfig(): Promise<DeliveryCostConfig> {
    const response = await api.get('/costs/delivery-cost-config');
    return response.data;
  },

  async updateDeliveryCostConfig(data: { costPerAgent: number }): Promise<DeliveryCostConfig> {
    const response = await api.put('/costs/delivery-cost-config', data);
    return response.data;
  },

  // Staff Costs
  async getStaffCosts(): Promise<StaffCost[]> {
    const response = await api.get('/costs/staff');
    return response.data;
  },

  async getStaffCostById(id: number): Promise<StaffCost> {
    const response = await api.get(`/costs/staff/${id}`);
    return response.data;
  },

  async createStaffCost(data: Omit<StaffCost, 'id' | 'createdAt' | 'updatedAt' | 'user'>): Promise<StaffCost> {
    const response = await api.post('/costs/staff', data);
    return response.data;
  },

  // Equipment Costs
  async getEquipmentCosts(): Promise<EquipmentCost[]> {
    const response = await api.get('/costs/equipment');
    return response.data;
  },

  async getEquipmentCostById(id: number): Promise<EquipmentCost> {
    const response = await api.get(`/costs/equipment/${id}`);
    return response.data;
  },

  async createEquipmentCost(data: Omit<EquipmentCost, 'id' | 'createdAt' | 'updatedAt'>): Promise<EquipmentCost> {
    const response = await api.post('/costs/equipment', data);
    return response.data;
  },

  // Facility Costs
  async getFacilityCosts(): Promise<FacilityCost[]> {
    const response = await api.get('/costs/facility');
    return response.data;
  },

  async getFacilityCostById(id: number): Promise<FacilityCost> {
    const response = await api.get(`/costs/facility/${id}`);
    return response.data;
  },

  async createFacilityCost(data: Omit<FacilityCost, 'id' | 'createdAt' | 'updatedAt'>): Promise<FacilityCost> {
    const response = await api.post('/costs/facility', data);
    return response.data;
  },

  // Cost Approvals
  async approveCost(costId: number, costType: 'staff' | 'equipment' | 'facility'): Promise<any> {
    const response = await api.post(`/costs/${costType}/${costId}/approve`);
    return response.data;
  },

  async rejectCost(costId: number, costType: 'staff' | 'equipment' | 'facility', comments: string): Promise<any> {
    const response = await api.post(`/costs/${costType}/${costId}/reject`, { comments });
    return response.data;
  },

  // Cost Summary
  async getCostSummary(startDate: Date, endDate: Date): Promise<CostSummary> {
    const response = await api.get('/costs/summary', {
      params: { startDate, endDate }
    });
    return response.data;
  }
}; 