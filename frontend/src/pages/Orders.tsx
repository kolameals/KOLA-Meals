import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

const Orders: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="text-center text-gray-500">
            <p>No orders found.</p>
            <p className="mt-2">Your order history will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders; 