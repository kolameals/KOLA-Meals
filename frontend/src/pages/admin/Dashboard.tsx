import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../types/routes';

const AdminDashboard = () => {
  const adminFeatures = [
    {
      category: 'Kitchen Management',
      features: [
        {
          title: 'Raw Materials',
          description: 'Manage raw materials, stock levels, and categories',
          route: ROUTES.ADMIN_RAW_MATERIALS,
          icon: '🥕'
        },
        {
          title: 'Recipes',
          description: 'Manage meal recipes and ingredients',
          route: ROUTES.ADMIN_RECIPES,
          icon: '📝'
        },
        {
          title: 'Production Planning',
          description: 'Daily production planning and kitchen instructions',
          route: ROUTES.ADMIN_PRODUCTION,
          icon: '📊'
        }
      ]
    },
    {
      category: 'Menu Management',
      features: [
        {
          title: 'Daily Menu',
          description: 'Plan and manage daily menus',
          route: ROUTES.ADMIN_MENU,
          icon: '🍽️'
        },
        {
          title: 'Menu Calendar',
          description: 'View and manage menu calendar',
          route: ROUTES.ADMIN_MENU_CALENDAR,
          icon: '📅'
        },
        {
          title: 'Meal Management',
          description: 'Add, edit, and manage meals',
          route: ROUTES.ADMIN_MEALS,
          icon: '🍲'
        }
      ]
    },
    {
      category: 'Analytics & Reports',
      features: [
        {
          title: 'Sales Analytics',
          description: 'View sales and revenue reports',
          route: ROUTES.ADMIN_SALES_ANALYTICS,
          icon: '💰'
        },
        {
          title: 'Kitchen Analytics',
          description: 'Track kitchen efficiency and costs',
          route: ROUTES.ADMIN_KITCHEN_ANALYTICS,
          icon: '📈'
        },
        {
          title: 'Customer Analytics',
          description: 'View customer insights and trends',
          route: ROUTES.ADMIN_CUSTOMER_ANALYTICS,
          icon: '👥'
        }
      ]
    },
    {
      category: 'User Management',
      features: [
        {
          title: 'Users',
          description: 'Manage users and their roles',
          route: ROUTES.ADMIN_USERS,
          icon: '👤'
        },
        {
          title: 'Delivery Partners',
          description: 'Manage delivery partners',
          route: ROUTES.ADMIN_DELIVERY_PARTNERS,
          icon: '🚚'
        }
      ]
    },
    {
      category: 'Operations',
      features: [
        {
          title: 'Orders',
          description: 'View and manage customer orders',
          route: ROUTES.ADMIN_ORDERS,
          icon: '📦'
        },
        {
          title: 'Inventory',
          description: 'Track inventory and stock levels',
          route: ROUTES.ADMIN_INVENTORY,
          icon: '📋'
        },
        {
          title: 'Feedback',
          description: 'View and respond to customer feedback',
          route: ROUTES.ADMIN_FEEDBACK,
          icon: '💬'
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {adminFeatures.map((category) => (
        <div key={category.category} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{category.category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.features.map((feature) => (
              <Link
                key={feature.route}
                to={feature.route}
                className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard; 