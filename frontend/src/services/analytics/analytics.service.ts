import api from '../api';
import type { AnalyticsResponse, AnalyticsFilters } from '../../types/analytics/analytics.types';

export const analyticsService = {
  async getRevenueData(filters: AnalyticsFilters): Promise<AnalyticsResponse> {
    try {
      const response = await api.get('/analytics/revenue', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      throw error;
    }
  },

  async getSalesTrends(filters: AnalyticsFilters): Promise<AnalyticsResponse> {
    try {
      const response = await api.get('/analytics/sales-trends', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching sales trends:', error);
      throw error;
    }
  },

  async getPerformanceMetrics(filters: AnalyticsFilters): Promise<AnalyticsResponse> {
    try {
      const response = await api.get('/analytics/performance', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      throw error;
    }
  },
}; 