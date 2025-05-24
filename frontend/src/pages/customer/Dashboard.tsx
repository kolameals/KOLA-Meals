import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { RootState } from '../../store';
import { ROUTES } from '../../types/routes';
import SubscriptionStatus from './components/SubscriptionStatus';
import TodayMeals from './components/TodayMeals';
import MealPause from './components/MealPause';
import DeliveryStatus from './components/DeliveryStatus';
import DeliveryHistory from './components/DeliveryHistory';

const CustomerDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Subscription Status */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Subscription Status</h2>
          <SubscriptionStatus />
        </section>

        {/* Today's Meals */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Today's Meals</h2>
          <TodayMeals />
        </section>

        {/* Meal Pause Management */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Meal Management</h2>
          <MealPause />
        </section>

        {/* Delivery Status */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Delivery Status</h2>
          <DeliveryStatus />
        </section>

        {/* Delivery History */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Delivery History</h2>
          <DeliveryHistory />
        </section>
      </div>
    </div>
  );
};

export default CustomerDashboard; 