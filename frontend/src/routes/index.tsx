import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Welcome from '../pages/Welcome';
import Login from '../pages/Login';
import Register from '../pages/Register';
import { ROUTES } from '../types/routes';

// Import other components as they are created
// import Menu from '../pages/Menu';
// import About from '../pages/About';
// import Contact from '../pages/Contact';
// import Profile from '../pages/Profile';
// import Orders from '../pages/Orders';
// import Subscription from '../pages/Subscription';
// import AdminDashboard from '../pages/admin/Dashboard';
// import DeliveryDashboard from '../pages/delivery/Dashboard';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Welcome />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
      {/* Add more routes here as we create them */}
      {/* Example routes to be added:
      <Route path={ROUTES.MENU} element={<Menu />} />
      <Route path={ROUTES.ABOUT} element={<About />} />
      <Route path={ROUTES.CONTACT} element={<Contact />} />
      <Route path={ROUTES.PROFILE} element={<Profile />} />
      <Route path={ROUTES.ORDERS} element={<Orders />} />
      <Route path={ROUTES.SUBSCRIPTION} element={<Subscription />} />
      <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
      <Route path={ROUTES.DELIVERY_DASHBOARD} element={<DeliveryDashboard />} />
      */}
    </Routes>
  );
};

export default AppRoutes; 