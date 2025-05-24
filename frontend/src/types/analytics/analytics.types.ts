export interface RevenueData {
  date: string;
  amount: number;
  orderCount: number;
  averageOrderValue: number;
}

export interface SalesTrend {
  period: string;
  totalSales: number;
  previousPeriodSales: number;
  growthRate: number;
}

export interface PerformanceMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topSellingItems: {
    id: string;
    name: string;
    quantity: number;
    revenue: number;
  }[];
  customerMetrics: {
    totalCustomers: number;
    newCustomers: number;
    returningCustomers: number;
  };
}

export interface AnalyticsFilters {
  startDate: string;
  endDate: string;
  groupBy?: 'day' | 'week' | 'month';
  type?: 'revenue' | 'sales' | 'performance';
}

export interface AnalyticsResponse {
  success: boolean;
  data: {
    revenue?: RevenueData[];
    salesTrends?: SalesTrend[];
    performanceMetrics?: PerformanceMetrics;
  };
  error?: string;
} 