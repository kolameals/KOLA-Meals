import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../types/routes';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

interface Feature {
  title: string;
  description: string;
  route: string;
  icon: string;
  subFeatures?: string[];
}

interface Category {
  category: string;
  features: Feature[];
}

const AdminDashboard = () => {
  const adminFeatures: Category[] = [
    {
      category: 'Product Management',
      features: [
        {
          title: 'Menu Management',
          description: 'Manage daily, weekly, and monthly menus with veg/non-veg sections',
          route: ROUTES.ADMIN_MENU,
          icon: '🍽️',
          subFeatures: [
            'Daily Menu with Veg/Non-veg sections',
            'Weekly Menu Planning',
            'Monthly Calendar View',
            'Meal History Tracking',
            'Add/Edit/Delete Meals'
          ]
        },
        {
          title: 'Production Planning',
          description: 'Daily production planning and kitchen instructions',
          route: ROUTES.ADMIN_PRODUCTION,
          icon: '📊',
          subFeatures: [
            'Daily Production Schedule',
            'Kitchen Instructions',
            'Staff Assignment',
            'Equipment Planning',
            'Quality Control Checklist'
          ]
        },
        {
          title: 'Company Costs',
          description: 'Comprehensive cost management and financial tracking system',
          route: ROUTES.ADMIN_COMPANY_COSTS,
          icon: '💰',
          subFeatures: [
            'Monthly Fixed Costs',
            'Weekly Variable Costs',
            'Raw Materials Cost Tracking',
            'Staff & Delivery Partner Management',
            'Equipment & EMI Tracking',
            'Facility & Operational Costs',
            'Financial Reports & Analytics'
          ]
        }
      ]
    },
    {
      category: 'Kitchen Management',
      features: [
        {
          title: 'Recipes',
          description: 'Create and manage detailed meal recipes with portion calculations',
          route: ROUTES.ADMIN_RECIPES,
          icon: '📝',
          subFeatures: [
            'Recipe Creation with Portion Control',
            'Ingredient Requirements Calculator',
            'Preparation & Cooking Time Tracking',
            'Nutritional Information',
            'Cost per Portion Analysis',
            'Recipe Scaling Tools',
            'Quality Standards & Instructions'
          ]
        },
        {
          title: 'Raw Materials',
          description: 'Automated raw material management based on recipes',
          route: ROUTES.ADMIN_RAW_MATERIALS,
          icon: '🥕',
          subFeatures: [
            'Auto-generated from Recipes',
            'Real-time Price Tracking',
            'Supplier Management',
            'Minimum Stock Levels',
            'Purchase Order Generation',
            'Storage Requirements',
            'Quality Specifications'
          ]
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
          icon: '💰',
          subFeatures: [
            'Daily Sales Reports',
            'Revenue Analysis',
            'Trend Analysis',
            'Subscription Metrics',
            'Profit Margins'
          ]
        },
        {
          title: 'Kitchen Analytics',
          description: 'Track kitchen efficiency and costs',
          route: ROUTES.ADMIN_KITCHEN_ANALYTICS,
          icon: '📈',
          subFeatures: [
            'Production Efficiency',
            'Cost Analysis',
            'Waste Management',
            'Staff Performance',
            'Equipment Usage'
          ]
        },
        {
          title: 'Customer Analytics',
          description: 'View customer insights and trends',
          route: ROUTES.ADMIN_CUSTOMER_ANALYTICS,
          icon: '👥',
          subFeatures: [
            'Customer Preferences',
            'Order Patterns',
            'Feedback Analysis',
            'Subscription Trends',
            'Customer Segmentation'
          ]
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
          icon: '👤',
          subFeatures: [
            'Staff Management',
            'Role Assignment',
            'Access Control',
            'Performance Tracking',
            'Training Records'
          ]
        },
        {
          title: 'Delivery Partners',
          description: 'Manage delivery partners',
          route: ROUTES.ADMIN_DELIVERY_PARTNERS,
          icon: '🚚',
          subFeatures: [
            'Partner Onboarding',
            'Route Management',
            'Performance Tracking',
            'Payment Processing',
            'Service Quality'
          ]
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
          icon: '📦',
          subFeatures: [
            'Order Processing',
            'Delivery Tracking',
            'Subscription Management',
            'Customer Support',
            'Order History'
          ]
        },
        {
          title: 'Inventory',
          description: 'Track inventory and stock levels',
          route: ROUTES.ADMIN_INVENTORY,
          icon: '📋',
          subFeatures: [
            'Stock Management',
            'Low Stock Alerts',
            'Inventory Reports',
            'Stock Valuation',
            'Storage Management'
          ]
        },
        {
          title: 'Feedback',
          description: 'View and respond to customer feedback',
          route: ROUTES.ADMIN_FEEDBACK,
          icon: '💬',
          subFeatures: [
            'Customer Reviews',
            'Complaint Management',
            'Satisfaction Surveys',
            'Quality Metrics',
            'Improvement Tracking'
          ]
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {adminFeatures.map((category) => (
        <div key={category.category} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{category.category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.features.map((feature) => (
              <Link
                key={feature.route}
                to={feature.route}
                className="block transition-all hover:scale-[1.02]"
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="text-4xl mb-2">{feature.icon}</div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <p className="text-muted-foreground mt-2">{feature.description}</p>
                  </CardHeader>
                  <CardContent>
                    {feature.subFeatures && (
                      <ul className="space-y-2">
                        {feature.subFeatures.map((item: string, index: number) => (
                          <li key={index} className="flex items-center text-muted-foreground">
                            <span className="mr-2">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard; 