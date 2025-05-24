import React from 'react';

const Menu: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Menu</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Menu items will be added here */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900">Coming Soon</h2>
          <p className="mt-2 text-gray-500">Our menu is being prepared. Please check back soon!</p>
        </div>
      </div>
    </div>
  );
};

export default Menu; 