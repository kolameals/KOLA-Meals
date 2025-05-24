import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROUTES } from './types/routes';
import type { RootState } from './store';
import AuthInitializer from './components/AuthInitializer';

// Pages
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import About from './pages/About';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import CustomerDashboard from './pages/customer/Dashboard';
import Profile from './pages/Profile';
import DeliveryPartners from './pages/admin/DeliveryPartners';
import AdminDashboard from './pages/admin/Dashboard';
import Analytics from './pages/admin/analytics/Analytics';
import CustomerAnalytics from './pages/admin/analytics/CustomerAnalytics';
import KitchenAnalytics from './pages/admin/analytics/KitchenAnalytics';
import MealManagement from './pages/admin/menu/MealManagement';
import RawMaterials from './pages/admin/kitchen/RawMaterials';
import Recipes from './pages/admin/kitchen/Recipes';
import Production from './pages/admin/kitchen/Production';
import MenuManagement from './pages/admin/menu/MenuManagement';
import MenuCalendar from './pages/admin/menu/MenuCalendar';
import Inventory from './pages/admin/operations/Inventory';
import FeedbackManagement from './pages/admin/feedback/FeedbackManagement';
import OrderManagement from './pages/admin/orders/OrderManagement';
import OrderDetails from './pages/admin/orders/OrderDetails';
import UserManagement from './pages/admin/users/UserManagement';

// Components
import AuthNavbar from './components/navbar/AuthNavbar';
import PublicNavbar from './components/navbar/PublicNavbar';
import Footer from './components/Footer';
import AdminNavbar from './components/AdminNavbar';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  return isAuthenticated ? <>{children}</> : <Navigate to={ROUTES.LOGIN} />;
};

// Role-based Protected Route Component
const RoleProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.HOME} />;
  }

  return <>{children}</>;
};

// Public Route Component (redirects to dashboard if authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  if (isAuthenticated) {
    switch (user?.role) {
      case 'ADMIN':
        return <Navigate to={ROUTES.ADMIN_DASHBOARD} />;
      case 'DELIVERY_PARTNER':
        return <Navigate to={ROUTES.DELIVERY_DASHBOARD} />;
      default:
        return <Navigate to={ROUTES.HOME} />;
    }
  }
  
  return <>{children}</>;
};

const App = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const renderNavbar = () => {
    if (!isAuthenticated) return <PublicNavbar />;
    if (user?.role === 'ADMIN') return <AdminNavbar />;
    return <AuthNavbar />;
  };

  return (
    <Router>
      <AuthInitializer />
      {renderNavbar()}
      <main className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes with Auth Check */}
          <Route
            path={ROUTES.HOME}
            element={
              <PublicRoute>
                <Welcome />
              </PublicRoute>
            }
          />
          <Route
            path={ROUTES.LOGIN}
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path={ROUTES.REGISTER}
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route path={ROUTES.MENU} element={<Menu />} />
          <Route path={ROUTES.ABOUT} element={<About />} />
          <Route path={ROUTES.CONTACT} element={<Contact />} />

          {/* Protected Routes */}
          <Route
            path={ROUTES.HOME}
            element={
              <ProtectedRoute>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PROFILE}
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path={ROUTES.ADMIN_DASHBOARD}
            element={
              <RoleProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </RoleProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_INVENTORY}
            element={
              <RoleProtectedRoute allowedRoles={['ADMIN']}>
                <Inventory />
              </RoleProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_SALES_ANALYTICS}
            element={
              <RoleProtectedRoute allowedRoles={['ADMIN']}>
                <Analytics />
              </RoleProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_CUSTOMER_ANALYTICS}
            element={
              <RoleProtectedRoute allowedRoles={['ADMIN']}>
                <CustomerAnalytics />
              </RoleProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_KITCHEN_ANALYTICS}
            element={
              <RoleProtectedRoute allowedRoles={['ADMIN']}>
                <KitchenAnalytics />
              </RoleProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_MENU}
            element={
              <RoleProtectedRoute allowedRoles={['ADMIN']}>
                <MenuManagement />
              </RoleProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_MENU_CALENDAR}
            element={
              <RoleProtectedRoute allowedRoles={['ADMIN']}>
                <MenuCalendar />
              </RoleProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_MEALS}
            element={
              <RoleProtectedRoute allowedRoles={['ADMIN']}>
                <MealManagement />
              </RoleProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_RAW_MATERIALS}
            element={
              <RoleProtectedRoute allowedRoles={['ADMIN']}>
                <RawMaterials />
              </RoleProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_RECIPES}
            element={
              <RoleProtectedRoute allowedRoles={['ADMIN']}>
                <Recipes />
              </RoleProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_PRODUCTION}
            element={
              <RoleProtectedRoute allowedRoles={['ADMIN']}>
                <Production />
              </RoleProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_FEEDBACK}
            element={
              <RoleProtectedRoute allowedRoles={['ADMIN']}>
                <FeedbackManagement />
              </RoleProtectedRoute>
            }
          />

          {/* Admin Order Routes */}
          <Route
            path={ROUTES.ADMIN_ORDERS}
            element={
              <RoleProtectedRoute allowedRoles={['ADMIN']}>
                <OrderManagement />
              </RoleProtectedRoute>
            }
          />
          <Route
            path={`${ROUTES.ADMIN_ORDERS}/:orderId`}
            element={
              <RoleProtectedRoute allowedRoles={['ADMIN']}>
                <OrderDetails />
              </RoleProtectedRoute>
            }
          />

          {/* Delivery Partner Routes */}
          <Route
            path={ROUTES.DELIVERY_DASHBOARD}
            element={
              <RoleProtectedRoute allowedRoles={['DELIVERY_PARTNER']}>
                <Dashboard />
              </RoleProtectedRoute>
            }
          />

          {/* Admin Delivery Partners Route */}
          <Route
            path={ROUTES.ADMIN_DELIVERY_PARTNERS}
            element={
              <RoleProtectedRoute allowedRoles={['ADMIN']}>
                <DeliveryPartners />
              </RoleProtectedRoute>
            }
          />

          {/* User Management Routes */}
          <Route
            path={ROUTES.ADMIN_USERS}
            element={
              <RoleProtectedRoute allowedRoles={['ADMIN']}>
                <UserManagement />
              </RoleProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
