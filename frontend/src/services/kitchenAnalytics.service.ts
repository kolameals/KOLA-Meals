import api from './api';
import type {
  KitchenEfficiencyMetrics,
  KitchenCostAnalysis,
  ResourceUtilization
} from '../types/analytics.types';

export const kitchenAnalyticsService = {
  async getEfficiencyMetrics(startDate: string, endDate: string): Promise<KitchenEfficiencyMetrics> {
    const response = await api.get('/analytics/kitchen/efficiency-metrics', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  async getCostAnalysis(startDate: string, endDate: string): Promise<KitchenCostAnalysis> {
    const response = await api.get('/analytics/kitchen/cost-analysis', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  async getResourceUtilization(startDate: string, endDate: string): Promise<ResourceUtilization> {
    const response = await api.get('/analytics/kitchen/resource-utilization', {
      params: { startDate, endDate }
    });
    return response.data;
  }
}; 