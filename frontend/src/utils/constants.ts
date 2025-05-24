export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
  MEALS: {
    LIST: '/meals',
    DETAIL: (id: string) => `/meals/${id}`,
  },
  ORDERS: {
    LIST: '/orders',
    CREATE: '/orders',
    DETAIL: (id: string) => `/orders/${id}`,
  },
}

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  LOGIN: '/login',
  REGISTER: '/register',
  MEALS: '/meals',
  ORDERS: '/orders',
  PROFILE: '/profile',
} 