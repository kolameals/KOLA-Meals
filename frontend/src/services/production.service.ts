import api from './api';
import type { ProductionSchedule, ProductionItem } from '../types/production.types';

export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER';

export interface CreateScheduleData {
  date: Date;
  mealType: MealType;
  mealId: string;
  startTime: Date;
  endTime: Date;
  items: { rawMaterialId: string; requiredQuantity: number }[];
}

export interface UpdateScheduleData {
  startTime?: Date;
  endTime?: Date;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export interface UpdateProductionItemData {
  actualQuantity?: number;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export const productionService = {
  // Get all production schedules (optionally filter by date/mealType)
  async getSchedules(params: { date?: Date; mealType?: MealType } = {}) {
    const response = await api.get('/production-schedules', { 
      params: {
        ...params,
        date: params.date?.toISOString(),
        startTime: params.date?.toISOString(),
        endTime: params.date?.toISOString()
      }
    });
    return response.data;
  },

  // Get a single production schedule by ID
  async getScheduleById(id: string) {
    const response = await api.get(`/production-schedules/${id}`);
    return response.data;
  },

  // Create a new production schedule
  async createSchedule(data: CreateScheduleData) {
    if (!data.mealType || !['BREAKFAST', 'LUNCH', 'DINNER'].includes(data.mealType)) {
      throw new Error('Invalid meal type. Must be one of: BREAKFAST, LUNCH, DINNER');
    }
    if (!data.mealId) {
      throw new Error('Meal ID is required');
    }
    const response = await api.post('/production-schedules', {
      ...data,
      date: data.date.toISOString(),
      startTime: data.startTime.toISOString(),
      endTime: data.endTime.toISOString()
    });
    return response.data;
  },

  // Update a production schedule
  async updateSchedule(id: string, data: UpdateScheduleData) {
    const response = await api.put(`/production-schedules/${id}`, {
      ...data,
      startTime: data.startTime?.toISOString(),
      endTime: data.endTime?.toISOString()
    });
    return response.data;
  },

  // Delete a production schedule
  async deleteSchedule(id: string) {
    await api.delete(`/production-schedules/${id}`);
  },

  // Update a production item (actual quantity, status)
  async updateProductionItem(id: string, data: UpdateProductionItemData) {
    const response = await api.patch(`/production-schedules/item/${id}`, data);
    return response.data;
  },

  // Auto-generate a production schedule for a date/mealType
  async autoGenerateSchedule(data: { date: Date; mealType: MealType; startTime: Date; endTime: Date }) {
    if (!data.mealType || !['BREAKFAST', 'LUNCH', 'DINNER'].includes(data.mealType)) {
      throw new Error('Invalid meal type. Must be one of: BREAKFAST, LUNCH, DINNER');
    }
    const response = await api.post('/production-schedules/auto-generate', {
      ...data,
      date: data.date.toISOString(),
      startTime: data.startTime.toISOString(),
      endTime: data.endTime.toISOString()
    });
    return response.data;
  }
}; 