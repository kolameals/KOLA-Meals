import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { analyticsService } from '../../../services/analytics/analytics.service';
import type { AnalyticsResponse, AnalyticsFilters } from '../../../types/analytics/analytics.types';

interface AnalyticsState {
  revenueData: AnalyticsResponse['data']['revenue'];
  salesTrends: AnalyticsResponse['data']['salesTrends'];
  performanceMetrics: AnalyticsResponse['data']['performanceMetrics'];
  loading: boolean;
  error: string | null;
  filters: AnalyticsFilters;
}

const initialState: AnalyticsState = {
  revenueData: undefined,
  salesTrends: undefined,
  performanceMetrics: undefined,
  loading: false,
  error: null,
  filters: {
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last 30 days
    endDate: new Date().toISOString().split('T')[0],
    groupBy: 'day',
  },
};

export const fetchRevenueData = createAsyncThunk(
  'analytics/fetchRevenueData',
  async (filters: AnalyticsFilters) => {
    const response = await analyticsService.getRevenueData(filters);
    return response.data.revenue;
  }
);

export const fetchSalesTrends = createAsyncThunk(
  'analytics/fetchSalesTrends',
  async (filters: AnalyticsFilters) => {
    const response = await analyticsService.getSalesTrends(filters);
    return response.data.salesTrends;
  }
);

export const fetchPerformanceMetrics = createAsyncThunk(
  'analytics/fetchPerformanceMetrics',
  async (filters: AnalyticsFilters) => {
    const response = await analyticsService.getPerformanceMetrics(filters);
    return response.data.performanceMetrics;
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Revenue Data
      .addCase(fetchRevenueData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRevenueData.fulfilled, (state, action) => {
        state.loading = false;
        state.revenueData = action.payload;
      })
      .addCase(fetchRevenueData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch revenue data';
      })
      // Sales Trends
      .addCase(fetchSalesTrends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesTrends.fulfilled, (state, action) => {
        state.loading = false;
        state.salesTrends = action.payload;
      })
      .addCase(fetchSalesTrends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch sales trends';
      })
      // Performance Metrics
      .addCase(fetchPerformanceMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPerformanceMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.performanceMetrics = action.payload;
      })
      .addCase(fetchPerformanceMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch performance metrics';
      });
  },
});

export const { setFilters, clearError } = analyticsSlice.actions;
export default analyticsSlice.reducer; 