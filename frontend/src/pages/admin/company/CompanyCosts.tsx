import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { 
  fetchStaffCosts, 
  fetchEquipmentCosts, 
  fetchFacilityCosts, 
  fetchCostSummary,
  fetchDeliveryCostConfig,
  updateDeliveryCostConfig
} from '@/store/slices/costSlice';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Calendar as CalendarIcon, PieChart, BarChart, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StaffCost, EquipmentCost, FacilityCost } from '@/types/cost.types';
import { formatCurrency } from '@/lib/utils';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

// Import components
import CostSummary from './components/CostSummary';
import StaffCosts from './components/StaffCosts';
import EquipmentCosts from './components/EquipmentCosts';
import FacilityCosts from './components/FacilityCosts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const CompanyCosts: React.FC = () => {
  const dispatch = useAppDispatch();
  const { 
    staffCosts, 
    equipmentCosts, 
    facilityCosts, 
    costSummary, 
    loading, 
    error,
    deliveryCostConfig
  } = useAppSelector((state: { costs: any }) => state.costs);

  const [activeTab, setActiveTab] = useState<string>('summary');
  const [isEditing, setIsEditing] = useState(false);
  const [costPerAgent, setCostPerAgent] = useState(deliveryCostConfig?.costPerAgent || 8000);
  const [date, setDate] = useState<Date>(new Date());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const startDate = startOfMonth(new Date(selectedYear, selectedMonth));
        const endDate = endOfMonth(new Date(selectedYear, selectedMonth));

        await Promise.all([
          dispatch(fetchStaffCosts()),
          dispatch(fetchEquipmentCosts()),
          dispatch(fetchFacilityCosts()),
          dispatch(fetchCostSummary({ startDate, endDate })),
          dispatch(fetchDeliveryCostConfig())
        ]);
      } catch (error) {
        toast.error('Failed to fetch costs');
      }
    };

    fetchData();
  }, [dispatch, selectedYear, selectedMonth]);

  useEffect(() => {
    if (deliveryCostConfig?.costPerAgent) {
      setCostPerAgent(deliveryCostConfig.costPerAgent);
    }
  }, [deliveryCostConfig]);

  const handleSaveCost = async () => {
    try {
      await dispatch(updateDeliveryCostConfig({ costPerAgent: Number(costPerAgent) }));
      setIsEditing(false);
      const startDate = startOfMonth(new Date(selectedYear, selectedMonth));
      const endDate = endOfMonth(new Date(selectedYear, selectedMonth));
      await dispatch(fetchStaffCosts());
      await dispatch(fetchCostSummary({ startDate, endDate }));
      await dispatch(fetchDeliveryCostConfig());
      toast.success('Delivery cost updated successfully');
    } catch (error) {
      toast.error('Failed to update delivery cost');
    }
  };

  // Filter costs based on selected month and calculate totals
  const filteredStaffCosts = staffCosts.filter((cost: StaffCost) => {
    const costDate = new Date(cost.createdAt);
    return costDate.getFullYear() === selectedYear && costDate.getMonth() === selectedMonth;
  });

  const filteredEquipmentCosts = equipmentCosts.filter((cost: EquipmentCost) => {
    const costDate = new Date(cost.createdAt);
    return costDate.getFullYear() === selectedYear && costDate.getMonth() === selectedMonth;
  });

  const filteredFacilityCosts = facilityCosts.filter((cost: FacilityCost) => {
    const costDate = new Date(cost.createdAt);
    return costDate.getFullYear() === selectedYear && costDate.getMonth() === selectedMonth;
  });

  // Calculate monthly totals with proper number handling
  const monthlyTotals = {
    staff: filteredStaffCosts.reduce((sum: number, cost: StaffCost) => {
      const salary = Number(cost.baseSalary) || 0;
      return sum + salary;
    }, 0),
    equipment: {
      oneTime: filteredEquipmentCosts
        .filter((cost: EquipmentCost) => cost.paymentType === 'one-time')
        .reduce((sum: number, cost: EquipmentCost) => {
          const amount = Number(cost.purchaseAmount) || 0;
          return sum + amount;
        }, 0),
      emi: filteredEquipmentCosts
        .filter((cost: EquipmentCost) => cost.paymentType === 'emi')
        .reduce((sum: number, cost: EquipmentCost) => {
          const amount = Number(cost.emiAmount) || 0;
          return sum + amount;
        }, 0),
      rented: filteredEquipmentCosts
        .filter((cost: EquipmentCost) => cost.paymentType === 'rented')
        .reduce((sum: number, cost: EquipmentCost) => {
          const amount = Number(cost.monthlyRent) || 0;
          return sum + amount;
        }, 0)
    },
    facility: filteredFacilityCosts.reduce((sum: number, cost: FacilityCost) => {
      const rent = Number(cost.rentAmount) || 0;
      const maintenance = Number(cost.maintenanceAmount) || 0;
      const utilities = Number(cost.utilitiesAmount) || 0;
      return sum + rent + maintenance + utilities;
    }, 0)
  };

  // Calculate total monthly recurring costs
  const totalMonthlyRecurringCost = Number(
    (monthlyTotals.staff + 
    monthlyTotals.equipment.emi + 
    monthlyTotals.equipment.rented + 
    monthlyTotals.facility).toFixed(2)
  );

  // Calculate one-time costs for the month
  const oneTimeCosts = Number(monthlyTotals.equipment.oneTime.toFixed(2));

  // Calculate total monthly cost (including one-time costs)
  const totalMonthlyCost = Number((totalMonthlyRecurringCost + oneTimeCosts).toFixed(2));

  // Calculate profit margin (assuming 30% target margin)
  const targetProfitMargin = 0.3;
  
  // Calculate minimum subscription cost needed to achieve target margin
  const minimumSubscriptionCost = Number(
    (totalMonthlyRecurringCost / (1 - targetProfitMargin)).toFixed(2)
  );

  // Calculate potential profit
  const potentialProfit = Number(
    (minimumSubscriptionCost - totalMonthlyRecurringCost).toFixed(2)
  );

  // Calculate actual profit margin
  const actualProfitMargin = Number(
    ((potentialProfit / minimumSubscriptionCost) * 100).toFixed(1)
  );

  // Calculate average cost per agent
  const averageCostPerAgent = filteredStaffCosts.length > 0 
    ? Number((totalMonthlyRecurringCost / filteredStaffCosts.length).toFixed(2))
    : 0;

  const years = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i);
  const months = [
    { value: 0, label: 'January' },
    { value: 1, label: 'February' },
    { value: 2, label: 'March' },
    { value: 3, label: 'April' },
    { value: 4, label: 'May' },
    { value: 5, label: 'June' },
    { value: 6, label: 'July' },
    { value: 7, label: 'August' },
    { value: 8, label: 'September' },
    { value: 9, label: 'October' },
    { value: 10, label: 'November' },
    { value: 11, label: 'December' },
  ];

  // Prepare data for charts
  const pieChartData = [
    { name: 'Staff Costs', value: monthlyTotals.staff },
    { name: 'Equipment Costs', value: monthlyTotals.equipment.emi + monthlyTotals.equipment.rented },
    { name: 'Facility Costs', value: monthlyTotals.facility },
    { name: 'One-Time Costs', value: oneTimeCosts }
  ];

  const barChartData = [
    {
      name: 'Staff',
      recurring: monthlyTotals.staff,
      oneTime: 0
    },
    {
      name: 'Equipment',
      recurring: monthlyTotals.equipment.emi + monthlyTotals.equipment.rented,
      oneTime: monthlyTotals.equipment.oneTime
    },
    {
      name: 'Facility',
      recurring: monthlyTotals.facility,
      oneTime: 0
    }
  ];

  const trendData = [
    { name: 'Jan', value: 0 },
    { name: 'Feb', value: 0 },
    { name: 'Mar', value: 0 },
    { name: 'Apr', value: 0 },
    { name: 'May', value: 0 },
    { name: 'Jun', value: 0 },
    { name: 'Jul', value: 0 },
    { name: 'Aug', value: 0 },
    { name: 'Sep', value: 0 },
    { name: 'Oct', value: 0 },
    { name: 'Nov', value: 0 },
    { name: 'Dec', value: 0 }
  ];

  if (loading && !staffCosts.length && !equipmentCosts.length && !facilityCosts.length) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading costs data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-start">
      <div>
          <h1 className="text-2xl font-bold">Cost Management</h1>
        <p className="text-sm text-muted-foreground mt-1">
            Manage and track all related costs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={selectedYear.toString()}
            onValueChange={(value) => setSelectedYear(parseInt(value))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedMonth.toString()}
            onValueChange={(value) => setSelectedMonth(parseInt(value))}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value.toString()}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="summary">Cost Summary</TabsTrigger>
          <TabsTrigger value="staff">Staff Costs</TabsTrigger>
          <TabsTrigger value="equipment">Equipment Costs</TabsTrigger>
          <TabsTrigger value="facility">Facility Costs</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6 w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Cost Dashboard</h2>
            <span className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-semibold">
              {format(new Date(selectedYear, selectedMonth), 'MMMM yyyy')}
            </span>
          </div>
          {/* Cost Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">Monthly Staff Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-700">
                  {formatCurrency(monthlyTotals.staff)}
                </div>
                <p className="text-sm text-blue-600 mt-1">
                  {filteredStaffCosts.length} staff members
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-700">Monthly Equipment Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-700">
                  {formatCurrency(monthlyTotals.equipment.emi + monthlyTotals.equipment.rented)}
                </div>
                <div className="text-sm text-green-600 mt-1 space-y-1">
                  <p>EMI: {formatCurrency(monthlyTotals.equipment.emi)}</p>
                  <p>Rented: {formatCurrency(monthlyTotals.equipment.rented)}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-purple-700">Monthly Facility Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-700">
                  {formatCurrency(monthlyTotals.facility)}
                </div>
                <p className="text-sm text-purple-600 mt-1">
                  {filteredFacilityCosts.length} facilities
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-orange-700">One-Time Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-700">
                  {formatCurrency(oneTimeCosts)}
                </div>
                <p className="text-sm text-orange-600 mt-1">
                  Equipment purchases
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Cost Analysis Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cost Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Cost Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Cost Breakdown Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={barChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Bar dataKey="recurring" name="Recurring Costs" fill="#0088FE" />
                      <Bar dataKey="oneTime" name="One-Time Costs" fill="#FF8042" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Trend Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Monthly Cost Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Line type="monotone" dataKey="value" name="Total Cost" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cost Summary Component */}
          <div className="w-full">
            <CostSummary 
              costSummary={costSummary} 
              selectedMonth={new Date(selectedYear, selectedMonth)} 
            />
          </div>
        </TabsContent>

        <TabsContent value="staff" className="mt-6">
          <StaffCosts 
            staffCosts={staffCosts}
            costSummary={costSummary}
            loading={loading}
            costPerAgent={costPerAgent}
            isEditing={isEditing}
            onCostChange={setCostPerAgent}
            onEditToggle={() => setIsEditing(true)}
            onSave={handleSaveCost}
            selectedMonth={new Date(selectedYear, selectedMonth)}
          />
        </TabsContent>

        <TabsContent value="equipment" className="mt-6">
          <EquipmentCosts 
            equipmentCosts={equipmentCosts}
            costSummary={costSummary}
            loading={loading}
            selectedMonth={new Date(selectedYear, selectedMonth)}
          />
        </TabsContent>

        <TabsContent value="facility" className="mt-6">
          <FacilityCosts 
            facilityCosts={facilityCosts}
            costSummary={costSummary}
            loading={loading}
            selectedMonth={new Date(selectedYear, selectedMonth)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyCosts; 