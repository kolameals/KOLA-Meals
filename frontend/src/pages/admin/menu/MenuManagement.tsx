import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../types/routes';
import { menuService } from '../../../services/menu.service';
import type { DailyMenu } from '../../../types/menu.types';
import DailyMenuComponent from './DailyMenu';
import MenuCalendar from './MenuCalendar';
import MealManagement from './MealManagement';

type TabType = 'daily' | 'calendar' | 'meals';

const MenuManagement: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('daily');
  const [dailyMenu, setDailyMenu] = useState<DailyMenu | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'daily') {
      fetchDailyMenu();
    }
  }, [activeTab]);

  const fetchDailyMenu = async () => {
    try {
      setLoading(true);
      const today = new Date();
      const menu = await menuService.getDailyMenuByDate(today);
      setDailyMenu(menu);
      setError(null);
    } catch (err) {
      console.error('Error fetching daily menu:', err);
      setError('Failed to fetch daily menu');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuUpdate = (updatedMenu: DailyMenu) => {
    setDailyMenu(updatedMenu);
  };

  const tabs = [
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
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {activeTab === 'daily' && (
          loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{error}</p>
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
          )
        )}
        {activeTab === 'calendar' && <MenuCalendar />}
        {activeTab === 'meals' && <MealManagement />}
      </div>
    </div>
  );
};

export default MenuManagement; 