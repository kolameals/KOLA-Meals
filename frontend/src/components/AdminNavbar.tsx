import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ROUTES } from '../types/routes';
import { logout } from '../store/slices/authSlice';

const AdminNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.LOGIN);
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="text-white text-xl font-bold">
            KOLA Meals | Admin
          </div>
          <div className="space-x-4">
            <Link to={ROUTES.ADMIN_DASHBOARD} className="text-white hover:underline">
              Dashboard
            </Link>
            <Link to={ROUTES.PROFILE} className="text-white hover:underline">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="text-black hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar; 