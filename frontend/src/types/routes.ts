export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  children?: RouteConfig[];
  auth?: boolean;
  roles?: string[];
}

export const ROUTES = {
  // Public Routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  MENU: '/menu',
  ABOUT: '/about',
  CONTACT: '/contact',
  
  // Customer Routes
  PROFILE: '/profile',
  ORDERS: '/orders',
  SUBSCRIPTION: '/subscription',
  
  // Admin Routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  
  // Kitchen Management
  ADMIN_RAW_MATERIALS: '/admin/raw-materials',
  ADMIN_RECIPES: '/admin/recipes',
  ADMIN_PRODUCTION: '/admin/production',
  
  // Menu Management
  ADMIN_MENU: '/admin/menu',
  ADMIN_MENU_CALENDAR: '/admin/menu/calendar',
  ADMIN_MEALS: '/admin/meals',
  
  // Company Costs
  ADMIN_COMPANY_COSTS: '/admin/company-costs',
  
  // Analytics & Reports
  ADMIN_SALES_ANALYTICS: '/admin/analytics/sales',
  ADMIN_KITCHEN_ANALYTICS: '/admin/analytics/kitchen',
  ADMIN_CUSTOMER_ANALYTICS: '/admin/analytics/customers',
  CUSTOMER_ANALYTICS: '/admin/analytics/customer',
  
  // User Management
  ADMIN_USERS: '/admin/users',
  ADMIN_DELIVERY_PARTNERS: '/admin/delivery-partners',
  
  // Operations
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_INVENTORY: '/admin/inventory',
  ADMIN_FEEDBACK: '/admin/feedback',
  
  // Delivery Routes
  DELIVERY_DASHBOARD: '/delivery/dashboard',
  DELIVERY_ORDERS: '/delivery/orders'
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey];
export type Route = typeof ROUTES[keyof typeof ROUTES]; 