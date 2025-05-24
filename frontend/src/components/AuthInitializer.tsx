import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { authService } from '../services/auth.service';
import { restoreAuth, loginFailure, setAuthLoaded } from '../store/slices/authSlice';

const AuthInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = sessionStorage.getItem('token');
      const refreshToken = sessionStorage.getItem('refreshToken');
      const userStr = sessionStorage.getItem('user');

      if (token && refreshToken && userStr) {
        try {
          // Verify the token is still valid
          const user = await authService.getCurrentUser();
          
          // If we get here, the token is valid
          dispatch(restoreAuth({
            user,
            token,
            refreshToken
          }));
        } catch (error) {
          console.error('Failed to initialize auth:', error);
          dispatch(loginFailure('Session expired'));
          
          // Clear invalid session data
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('refreshToken');
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('userRole');
        }
      }
      dispatch(setAuthLoaded());
    };

    initializeAuth();
  }, [dispatch]);

  return null;
};

export default AuthInitializer; 