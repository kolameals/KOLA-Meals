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
import { customerAnalyticsService } from '../../../services/customerAnalytics.service';
import type {
  CustomerBehavior,
  CustomerPreferences,
  FeedbackAnalysis
} from '../../../services/customerAnalytics.service';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const CustomerAnalytics: React.FC = () => {
  const [behavior, setBehavior] = useState<CustomerBehavior | null>(null);
  const [preferences, setPreferences] = useState<CustomerPreferences | null>(null);
  const [feedback, setFeedback] = useState<FeedbackAnalysis | null>(null);
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

      console.log('Fetching analytics data with params:', dateRange);

      const [behaviorData, preferencesData, feedbackData] = await Promise.all([
        customerAnalyticsService.getCustomerBehavior(dateRange.startDate, dateRange.endDate),
        customerAnalyticsService.getCustomerPreferences(dateRange.startDate, dateRange.endDate),
        customerAnalyticsService.getFeedbackAnalysis(dateRange.startDate, dateRange.endDate)
      ]);

      console.log('Received analytics data:', { behaviorData, preferencesData, feedbackData });

      setBehavior(behaviorData);
      setPreferences(preferencesData);
      setFeedback(feedbackData);
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      let errorMessage = 'Failed to fetch analytics data';
      
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = err.response.data?.error || `Server error: ${err.response.status}`;
      } else if (err.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server. Please check your connection.';
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
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Customer Analytics</h1>

      {/* Date Range Selector */}
      <div className="mb-8 flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <label htmlFor="startDate" className="font-medium">Start Date:</label>
          <input
            id="startDate"
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
            className="border rounded p-2"
            max={dateRange.endDate}
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="endDate" className="font-medium">End Date:</label>
          <input
            id="endDate"
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
            className="border rounded p-2"
            min={dateRange.startDate}
          />
        </div>
      </div>

      {/* Customer Behavior Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Customer Behavior</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium">Total Customers</h3>
            <p className="text-3xl font-bold">{behavior?.totalCustomers || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium">Total Orders</h3>
            <p className="text-3xl font-bold">{behavior?.totalOrders || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium">Avg. Order Value</h3>
            <p className="text-3xl font-bold">{behavior?.averageOrderValue ? formatCurrency(behavior.averageOrderValue) : '₹0.00'}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium">Repeat Customer Rate</h3>
            <p className="text-3xl font-bold">
              {behavior?.repeatCustomerRate 
                ? formatPercentage(behavior.repeatCustomerRate)
                : '0.0%'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Order Frequency Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={behavior ? Object.entries(behavior.orderFrequencyDistribution).map(([key, value]) => ({
                name: key,
                value
              })) : []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="Number of Customers" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Peak Ordering Hours</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={behavior?.peakHours || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="hour" 
                  tickFormatter={(hour) => `${hour}:00`}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(hour) => `${hour}:00`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="orderCount" 
                  stroke="#8884d8" 
                  name="Orders"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Customer Preferences Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Customer Preferences</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Category Preferences</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={preferences ? Object.entries(preferences.categoryPreferences).map(([key, value]) => ({
                    name: key,
                    value
                  })) : []}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {preferences ? Object.entries(preferences.categoryPreferences).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  )) : null}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Top Items</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={preferences?.topItems || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-8 bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Dietary Preferences</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={preferences ? Object.entries(preferences.dietaryPreferences).map(([key, value]) => ({
                  name: key,
                  value
                })) : []}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {preferences ? Object.entries(preferences.dietaryPreferences).map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                )) : null}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Feedback Analysis Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Feedback Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium">Total Feedback</h3>
            <p className="text-3xl font-bold">{feedback?.totalFeedback || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium">Average Rating</h3>
            <p className="text-3xl font-bold">{feedback?.averageRating?.toFixed(1) || '0.0'}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium">Positive Feedback</h3>
            <p className="text-3xl font-bold">
              {feedback?.sentimentAnalysis.positive || 0}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium">Negative Feedback</h3>
            <p className="text-3xl font-bold">
              {feedback?.sentimentAnalysis.negative || 0}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Rating Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={feedback ? Object.entries(feedback.ratingDistribution).map(([key, value]) => ({
                rating: key,
                count: value
              })) : []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rating" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Number of Ratings" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Sentiment Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={feedback ? Object.entries(feedback.sentimentAnalysis).map(([key, value]) => ({
                    name: key.charAt(0).toUpperCase() + key.slice(1),
                    value
                  })) : []}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {feedback ? Object.entries(feedback.sentimentAnalysis).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  )) : null}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-8 bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Common Themes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {feedback?.topThemes.map((theme, index) => (
              <div key={index} className="p-4 border rounded hover:shadow-md transition-shadow">
                <p className="font-medium capitalize">{theme.theme}</p>
                <p className="text-gray-600">Mentioned {theme.count} times</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAnalytics; 