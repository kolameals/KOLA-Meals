import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { fetchRevenueData, fetchSalesTrends, fetchPerformanceMetrics, setFilters } from '../../../store/slices/analytics/analyticsSlice';
import type { RootState } from '../../../store';
import type { AnalyticsFilters } from '../../../types/analytics/analytics.types';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Analytics: React.FC = () => {
  const dispatch = useDispatch();
  const { revenueData, salesTrends, performanceMetrics, loading, error, filters } = useSelector(
    (state: RootState) => state.analytics
  );
  const [activeTab, setActiveTab] = useState<'revenue' | 'sales' | 'performance'>('revenue');

  useEffect(() => {
    switch (activeTab) {
      case 'revenue':
        dispatch(fetchRevenueData(filters));
        break;
      case 'sales':
        dispatch(fetchSalesTrends(filters));
        break;
      case 'performance':
        dispatch(fetchPerformanceMetrics(filters));
        break;
    }
  }, [dispatch, activeTab, filters]);

  const handleFilterChange = (newFilters: Partial<AnalyticsFilters>) => {
    dispatch(setFilters(newFilters));
  };

  const renderRevenueChart = () => {
    if (!revenueData) return null;

    const data = {
      labels: revenueData.map(item => item.date),
      datasets: [
        {
          label: 'Revenue',
          data: revenueData.map(item => item.amount),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
        {
          label: 'Order Count',
          data: revenueData.map(item => item.orderCount),
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1,
        },
      ],
    };

    return <Line data={data} />;
  };

  const renderSalesTrendsChart = () => {
    if (!salesTrends) return null;

    const data = {
      labels: salesTrends.map(item => item.period),
      datasets: [
        {
          label: 'Current Period',
          data: salesTrends.map(item => item.totalSales),
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
        {
          label: 'Previous Period',
          data: salesTrends.map(item => item.previousPeriodSales),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    };

    return <Bar data={data} />;
  };

  const renderPerformanceMetrics = () => {
    if (!performanceMetrics) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Revenue Overview</h3>
          <p className="text-2xl font-bold">₹{performanceMetrics.totalRevenue.toFixed(2)}</p>
          <p className="text-sm text-gray-600">Total Revenue</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Orders</h3>
          <p className="text-2xl font-bold">{performanceMetrics.totalOrders}</p>
          <p className="text-sm text-gray-600">Total Orders</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Average Order Value</h3>
          <p className="text-2xl font-bold">₹{performanceMetrics.averageOrderValue.toFixed(2)}</p>
          <p className="text-sm text-gray-600">Per Order</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow col-span-full">
          <h3 className="text-lg font-semibold mb-2">Top Selling Items</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">Item</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {performanceMetrics.topSellingItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-2">{item.name}</td>
                    <td className="px-4 py-2">{item.quantity}</td>
                    <td className="px-4 py-2">₹{item.revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
        
        {/* Date Range Filter */}
        <div className="flex gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange({ startDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange({ endDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Group By</label>
            <select
              value={filters.groupBy}
              onChange={(e) => handleFilterChange({ groupBy: e.target.value as 'day' | 'week' | 'month' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('revenue')}
              className={`${
                activeTab === 'revenue'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Revenue
            </button>
            <button
              onClick={() => setActiveTab('sales')}
              className={`${
                activeTab === 'sales'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Sales Trends
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`${
                activeTab === 'performance'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Performance Metrics
            </button>
          </nav>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow">
          {activeTab === 'revenue' && renderRevenueChart()}
          {activeTab === 'sales' && renderSalesTrendsChart()}
          {activeTab === 'performance' && renderPerformanceMetrics()}
        </div>
      )}
    </div>
  );
};

export default Analytics; 