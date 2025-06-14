import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../types/routes';
import { menuService, MenuNotFoundError } from '../../../../services/menu.service';
import type { DailyMenu } from '../../../../types/menu.types';
import MenuCalendar from './MenuCalendar';
import FinancialCalculator from './FinancialCalculator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TabType = 'calculator' | 'calendar';

const MenuManagement: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('calculator');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: 'calculator', label: 'Financial Calculator' },
    { id: 'calendar', label: 'Menu Calendar' }
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
        <TabsList className="grid w-full grid-cols-2">
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

          <TabsContent value="calendar">
            <MenuCalendar />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default MenuManagement; 