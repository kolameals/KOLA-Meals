import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../types/routes';
import { UserRole } from '../types/auth';

interface NavbarProps {
  isAuthenticated?: boolean;
  userRole?: UserRole;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated = false, userRole }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate(ROUTES.HOME);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={ROUTES.HOME} className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-auto"
                src="/logo.png"
                alt="KOLA Meals"
              />
              <span className="ml-2 text-xl font-bold text-gray-800">KOLA Meals</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to={ROUTES.HOME} className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link to={ROUTES.MENU} className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Menu
            </Link>
            <Link to={ROUTES.ABOUT} className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              About
            </Link>
            <Link to={ROUTES.CONTACT} className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Contact
            </Link>

            {isAuthenticated ? (
              <>
                {userRole === UserRole.ADMIN && (
                  <>
                    <Link
                      to={ROUTES.ADMIN_DASHBOARD}
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Admin Dashboard
                    </Link>
                    <Link
                      to={ROUTES.ADMIN_MEALS}
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Meal Management
                    </Link>
                  </>
                )}
                {userRole === UserRole.DELIVERY_PARTNER && (
                  <Link
                    to={ROUTES.DELIVERY_DASHBOARD}
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Delivery Dashboard
                  </Link>
                )}
                {userRole === UserRole.CUSTOMER && (
                  <>
                    <Link
                      to={ROUTES.PROFILE}
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      My Profile
                    </Link>
                    <Link
                      to={ROUTES.ORDERS}
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      My Orders
                    </Link>
                    <Link
                      to={ROUTES.SUBSCRIPTION}
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      My Subscription
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to={ROUTES.LOGIN}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Subscribe Now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 