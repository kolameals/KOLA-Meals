import React, { useState } from 'react';
import { TrendingUp, Users, Building2, Package, IndianRupee, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

interface CostSummaryProps {
  costSummary: any;
  selectedMonth: Date;
}

// Helper for colored metric cards
const MetricCard = ({ title, value, icon, color, change }: { title: string; value: string; icon: React.ReactNode; color: string; change?: string }) => (
  <div className={`rounded-xl shadow bg-gradient-to-br from-${color}-50 to-${color}-100 p-6 flex flex-col items-center w-full`}>
    <div className={`mb-2`}>{icon}</div>
    <div className="text-xs text-gray-500">{title}</div>
    <div className={`text-2xl font-bold text-${color}-700`}>{value}</div>
    {change && (
      <div className={`flex items-center gap-1 text-xs mt-1 ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}> 
        {change.startsWith('+') ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />} {change}
      </div>
    )}
  </div>
);

// Helper for cost breakdown bar
const BreakdownBar = ({ label, value, percent, color }: { label: string; value: number; percent: number; color: string }) => (
  <div className="flex items-center gap-3">
    <span className={`inline-block w-2 h-2 rounded-full bg-${color}-500`} />
    <span className="w-24 text-xs text-gray-700">{label}</span>
    <div className="flex-1 bg-gray-100 rounded h-2 mx-2 overflow-hidden">
      <div className={`h-2 rounded bg-${color}-400`} style={{ width: `${percent}%` }} />
    </div>
    <span className={`text-xs font-semibold text-${color}-700`}>{formatCurrency(value)} ({percent.toFixed(1)}%)</span>
  </div>
);

const CostSummary: React.FC<CostSummaryProps> = ({ costSummary, selectedMonth }) => {
  if (!costSummary) return null;

  // Totals
  const staffTotal = costSummary?.staffCosts?.total || 0;
  const equipmentTotal = costSummary?.equipmentCosts?.total || 0;
  const facilityTotal = costSummary?.facilityCosts?.total || 0;
  const totalCosts = staffTotal + equipmentTotal + facilityTotal;
  const totalRevenue = staffTotal * 1.3;
  const netProfit = totalRevenue - totalCosts;
  const profitMargin = totalRevenue ? ((netProfit / totalRevenue) * 100).toFixed(1) : '0';

  // Cost breakdown percentages
  const staffPercent = totalCosts ? (staffTotal / totalCosts) * 100 : 0;
  const equipmentPercent = totalCosts ? (equipmentTotal / totalCosts) * 100 : 0;
  const facilityPercent = totalCosts ? (facilityTotal / totalCosts) * 100 : 0;

  // Helper for partner initials
  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase();

  // Example insights (replace with real calculations if available)
  const insights = [
    `Net profit is ${netProfit > 0 ? 'positive' : 'negative'} this month.`,
    `Staff costs are ${staffPercent.toFixed(1)}% of total costs.`,
    `Profit margin is ${profitMargin}% (target: 30%).`,
  ];

  // Market Forecast Calculator
  const [subscriptionRevenue, setSubscriptionRevenue] = useState<number>(totalRevenue);
  const forecastedExpenses = totalCosts;
  const forecastedProfit = subscriptionRevenue - forecastedExpenses;
  const forecastedProfitMargin = subscriptionRevenue ? ((forecastedProfit / subscriptionRevenue) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-10">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={<TrendingUp className="h-7 w-7 text-green-600" />}
          color="green"
        />
        <MetricCard
          title="Total Costs"
          value={formatCurrency(totalCosts)}
          icon={<Package className="h-7 w-7 text-red-600" />}
          color="red"
        />
        <MetricCard
          title="Net Profit"
          value={formatCurrency(netProfit)}
          icon={<IndianRupee className="h-7 w-7 text-blue-600" />}
          color="blue"
        />
        <MetricCard
          title="Profit Margin"
          value={`${profitMargin}%`}
          icon={<Users className="h-7 w-7 text-purple-600" />}
          color="purple"
        />
      </div>

      {/* Cost Breakdown */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Cost Breakdown</h3>
        <div className="space-y-3">
          <BreakdownBar label="Staff" value={staffTotal} percent={staffPercent} color="blue" />
          <BreakdownBar label="Equipment" value={equipmentTotal} percent={equipmentPercent} color="purple" />
          <BreakdownBar label="Facility" value={facilityTotal} percent={facilityPercent} color="green" />
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gray-50 rounded-xl shadow p-6">
        <h4 className="font-semibold mb-2 text-gray-900">Insights</h4>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          {insights.map((insight, idx) => (
            <li key={idx}>{insight}</li>
          ))}
        </ul>
      </div>

      {/* Market Forecast Calculator */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Market Forecast Calculator</h3>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Revenue</label>
            <input
              type="number"
              value={subscriptionRevenue}
              onChange={(e) => setSubscriptionRevenue(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            onClick={() => {
              // Update forecast calculations if needed
            }}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Update Forecast
          </button>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-sm text-gray-500">Forecasted Expenses</div>
            <div className="text-xl font-bold text-gray-900">{formatCurrency(forecastedExpenses)}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-sm text-gray-500">Forecasted Profit</div>
            <div className="text-xl font-bold text-gray-900">{formatCurrency(forecastedProfit)}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-sm text-gray-500">Forecasted Profit Margin</div>
            <div className="text-xl font-bold text-gray-900">{forecastedProfitMargin}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostSummary; 