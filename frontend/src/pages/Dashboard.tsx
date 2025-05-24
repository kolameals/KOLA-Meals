import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { RootState } from '../store';
import { ROUTES } from '../types/routes';

const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const renderDashboardContent = () => {
    switch (user?.role) {
      case 'ADMIN':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                to={ROUTES.ADMIN_USERS}
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-medium text-gray-900">User Management</h3>
                <p className="mt-2 text-gray-500">Manage users and their roles</p>
              </Link>
              <Link
                to={ROUTES.ADMIN_ORDERS}
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-medium text-gray-900">Order Management</h3>
                <p className="mt-2 text-gray-500">View and manage all orders</p>
              </Link>
            </div>
          </div>
        );
      case 'DELIVERY_PARTNER':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Delivery Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                to={ROUTES.DELIVERY_ORDERS}
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-medium text-gray-900">My Deliveries</h3>
                <p className="mt-2 text-gray-500">View and manage your deliveries</p>
              </Link>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Customer Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                to={ROUTES.ORDERS}
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-medium text-gray-900">My Orders</h3>
                <p className="mt-2 text-gray-500">View your order history</p>
              </Link>
              <Link
                to={ROUTES.MENU}
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-medium text-gray-900">Order Food</h3>
                <p className="mt-2 text-gray-500">Browse our menu and place an order</p>
              </Link>
              <Link
                to={ROUTES.PROFILE}
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-medium text-gray-900">My Profile</h3>
                <p className="mt-2 text-gray-500">Update your profile information</p>
              </Link>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {renderDashboardContent()}
    </div>
  );
};

export default Dashboard; 