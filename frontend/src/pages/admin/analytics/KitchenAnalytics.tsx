import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { kitchenAnalyticsService } from '../../../services/kitchenAnalytics.service';
import type {
  KitchenEfficiencyMetrics,
  KitchenCostAnalysis,
  ResourceUtilization
} from '../../../types/analytics.types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const KitchenAnalytics: React.FC = () => {
  const [efficiencyMetrics, setEfficiencyMetrics] = useState<KitchenEfficiencyMetrics | null>(null);
  const [costAnalysis, setCostAnalysis] = useState<KitchenCostAnalysis | null>(null);
  const [resourceUtilization, setResourceUtilization] = useState<ResourceUtilization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Log the request parameters
      console.log('Fetching analytics data with params:', {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      });

      const [efficiency, cost, resources] = await Promise.all([
        kitchenAnalyticsService.getEfficiencyMetrics(dateRange.startDate, dateRange.endDate),
        kitchenAnalyticsService.getCostAnalysis(dateRange.startDate, dateRange.endDate),
        kitchenAnalyticsService.getResourceUtilization(dateRange.startDate, dateRange.endDate)
      ]);

      // Log the response data
      console.log('Analytics data received:', {
        efficiency,
        cost,
        resources
      });

      setEfficiencyMetrics(efficiency);
      setCostAnalysis(cost);
      setResourceUtilization(resources);
    } catch (err: any) {
      console.error('Error fetching analytics:', {
        error: err,
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });

      let errorMessage = 'Failed to fetch analytics data';
      if (err.response?.status === 401) {
        errorMessage = 'Please log in to view analytics';
      } else if (err.response?.status === 403) {
        errorMessage = 'You do not have permission to view analytics';
      } else if (err.response?.status === 404) {
        errorMessage = 'Analytics endpoints not found. Please check the API configuration.';
      } else if (!err.response) {
        errorMessage = 'Network error. Please check your connection.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Kitchen Analytics</h1>

      {/* Date Range Selector */}
      <div className="mb-8 flex gap-4">
        <input
          type="date"
          value={dateRange.startDate}
          onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
          className="border rounded p-2"
        />
        <input
          type="date"
          value={dateRange.endDate}
          onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
          className="border rounded p-2"
        />
      </div>

      {/* Efficiency Metrics */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Efficiency Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium">Total Orders</h3>
            <p className="text-3xl font-bold">{efficiencyMetrics?.totalOrders || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium">Avg. Prep Time</h3>
            <p className="text-3xl font-bold">{efficiencyMetrics?.averagePreparationTime?.toFixed(1) || '0.0'} min</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium">On-Time Delivery</h3>
            <p className="text-3xl font-bold">
              {efficiencyMetrics?.onTimeDeliveryRate 
                ? (efficiencyMetrics.onTimeDeliveryRate * 100).toFixed(1)
                : '0.0'}%
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium">Kitchen Utilization</h3>
            <p className="text-3xl font-bold">
              {efficiencyMetrics?.kitchenUtilizationRate 
                ? (efficiencyMetrics.kitchenUtilizationRate * 100).toFixed(1)
                : '0.0'}%
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Peak Hours</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={efficiencyMetrics?.peakHours || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orderCount" fill="#8884d8" name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cost Analysis */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Cost Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Cost Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={costAnalysis ? Object.entries(costAnalysis.costBreakdown).map(([key, value]) => ({
                    name: key.charAt(0).toUpperCase() + key.slice(1),
                    value
                  })) : []}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {costAnalysis ? Object.entries(costAnalysis.costBreakdown).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  )) : null}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Cost Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={costAnalysis?.costTrends || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="totalCost" stroke="#8884d8" name="Total Cost" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Resource Utilization */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Resource Utilization</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Staff Utilization</h3>
            <div className="space-y-2">
              <p>Total Hours: {resourceUtilization?.staffUtilization.totalStaffHours?.toFixed(1) || '0.0'}</p>
              <p>Productive Hours: {resourceUtilization?.staffUtilization.productiveHours?.toFixed(1) || '0.0'}</p>
              <p>Utilization Rate: {
                resourceUtilization?.staffUtilization.utilizationRate 
                  ? (resourceUtilization.staffUtilization.utilizationRate * 100).toFixed(1)
                  : '0.0'}%
              </p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Equipment Utilization</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={resourceUtilization?.equipmentUtilization || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="equipmentName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="utilizationRate" fill="#82ca9d" name="Utilization Rate" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Inventory Utilization</h3>
            <div className="space-y-2">
              <p>Total Items: {resourceUtilization?.inventoryUtilization.totalItems || 0}</p>
              <p>Active Items: {resourceUtilization?.inventoryUtilization.activeItems || 0}</p>
              <p>Utilization Rate: {
                resourceUtilization?.inventoryUtilization.utilizationRate 
                  ? (resourceUtilization.inventoryUtilization.utilizationRate * 100).toFixed(1)
                  : '0.0'}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenAnalytics; 