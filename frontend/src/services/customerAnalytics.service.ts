import api from './api';

export interface CustomerBehavior {
  totalCustomers: number;
  totalOrders: number;
  averageOrderValue: number;
  orderFrequencyDistribution: {
    '1-2 orders': number;
    '3-5 orders': number;
    '6-10 orders': number;
    '10+ orders': number;
  };
  peakHours: Array<{
    hour: number;
    orderCount: number;
  }>;
  repeatCustomerRate: number;
}

export interface CustomerPreferences {
  categoryPreferences: { [key: string]: number };
  topItems: Array<{
    name: string;
    count: number;
  }>;
  dietaryPreferences: { [key: string]: number };
}

export interface FeedbackAnalysis {
  totalFeedback: number;
  averageRating: number;
  ratingDistribution: { [key: number]: number };
  sentimentAnalysis: {
    positive: number;
    neutral: number;
    negative: number;
  };
  topThemes: Array<{
    theme: string;
    count: number;
  }>;
}

export const customerAnalyticsService = {
  async getCustomerBehavior(startDate: string, endDate: string): Promise<CustomerBehavior> {
    const response = await api.get('/analytics/customer/behavior', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  async getCustomerPreferences(startDate: string, endDate: string): Promise<CustomerPreferences> {
    const response = await api.get('/analytics/customer/preferences', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  async getFeedbackAnalysis(startDate: string, endDate: string): Promise<FeedbackAnalysis> {
    const response = await api.get('/analytics/customer/feedback', {
      params: { startDate, endDate }
    });
    return response.data;
  }
}; 