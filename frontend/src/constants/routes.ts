export const ROUTES = {
  // Public Routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  MENU: '/menu',
  ABOUT: '/about',
  CONTACT: '/contact',

  // Protected Routes
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  ORDERS: '/orders',

  // Admin Routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_DELIVERY_PARTNERS: '/admin/delivery-partners',

  // Delivery Partner Routes
  DELIVERY_DASHBOARD: '/delivery/dashboard',
  DELIVERY_ORDERS: '/delivery/orders'
} as const; 