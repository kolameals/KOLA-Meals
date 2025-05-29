import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../types/routes';
import { menuService, MenuNotFoundError } from '../../../services/menu.service';
import type { DailyMenu } from '../../../types/menu.types';
import DailyMenuComponent from './DailyMenu';
import MenuCalendar from './MenuCalendar';
import MealManagement from './MealManagement';
import FinancialCalculator from './FinancialCalculator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TabType = 'calculator' | 'daily' | 'calendar' | 'meals';

const MenuManagement: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('calculator');
  const [dailyMenu, setDailyMenu] = useState<DailyMenu | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuNotFound, setMenuNotFound] = useState(false);

  useEffect(() => {
    if (activeTab === 'daily') {
      fetchDailyMenu();
    }
  }, [activeTab]);

  const fetchDailyMenu = async () => {
    try {
      setLoading(true);
      setError(null);
      setMenuNotFound(false);
      const today = new Date();
      const menu = await menuService.getDailyMenuByDate(today);
      setDailyMenu(menu);
    } catch (err) {
      console.error('Error fetching daily menu:', err);
      if (err instanceof MenuNotFoundError) {
        setMenuNotFound(true);
        setError(null);
      } else {
        setError('Failed to fetch daily menu');
        setMenuNotFound(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMenuUpdate = (updatedMenu: DailyMenu) => {
    setDailyMenu(updatedMenu);
  };

  const handleCreateMenu = async () => {
    try {
      setLoading(true);
      setError(null);
      const today = new Date();
      console.log('Creating menu for date:', today.toISOString());
      const newMenu = await menuService.createDailyMenu({
        date: today.toISOString(),
        items: [],
      });
      console.log('Created menu:', newMenu);
      setDailyMenu(newMenu);
      setMenuNotFound(false);
    } catch (error: any) {
      console.error('Error creating daily menu:', error);
      setError(error.message || 'Failed to create daily menu');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'calculator', label: 'Financial Calculator' },
    { id: 'daily', label: 'Daily Menu' },
    { id: 'calendar', label: 'Menu Calendar' },
    { id: 'meals', label: 'Meal Management' }
  ];

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Menu Management</h1>
        <div className="space-x-4">
          <button
            onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-4">
          <TabsContent value="calculator">
            <FinancialCalculator />
          </TabsContent>

          <TabsContent value="daily">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : menuNotFound ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">No Menu Found</h2>
                <p className="text-gray-600">There is no menu created for today.</p>
                <button
                  onClick={handleCreateMenu}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2"
                >
                  <span>+</span>
                  <span>Create Today's Menu</span>
                </button>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <strong className="font-bold">Error!</strong>
                  <span className="block sm:inline"> {error}</span>
                </div>
                <button
                  onClick={fetchDailyMenu}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Retry
                </button>
              </div>
            ) : (
              <DailyMenuComponent
                dailyMenu={dailyMenu}
                onUpdate={handleMenuUpdate}
              />
            )}
          </TabsContent>

          <TabsContent value="calendar">
            <MenuCalendar />
          </TabsContent>

          <TabsContent value="meals">
            <MealManagement />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default MenuManagement; 