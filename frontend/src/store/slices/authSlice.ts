import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthResponse, User } from '../../types/auth';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  authLoaded: boolean;
}

const getInitialState = (): AuthState => {
  const token = sessionStorage.getItem('token');
  const refreshToken = sessionStorage.getItem('refreshToken');
  const userStr = sessionStorage.getItem('user');
  return {
    isAuthenticated: !!(token && refreshToken),
    user: userStr ? JSON.parse(userStr) : null,
    token,
    refreshToken,
    loading: false,
    error: null,
    authLoaded: false,
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<AuthResponse>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.loading = false;
      state.error = null;
      state.authLoaded = true;
      sessionStorage.setItem('token', action.payload.token);
      sessionStorage.setItem('refreshToken', action.payload.refreshToken);
      sessionStorage.setItem('user', JSON.stringify(action.payload.user));
      sessionStorage.setItem('userRole', action.payload.user.role);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.authLoaded = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.loading = false;
      state.error = null;
      state.authLoaded = true;
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('userRole');
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      sessionStorage.setItem('user', JSON.stringify(action.payload));
      sessionStorage.setItem('userRole', action.payload.role);
    },
    restoreAuth: (state, action: PayloadAction<{ user: User; token: string; refreshToken: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.loading = false;
      state.error = null;
      state.authLoaded = true;
    },
    setAuthLoaded: (state) => {
      state.authLoaded = true;
    }
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateUser, restoreAuth, setAuthLoaded } = authSlice.actions;
export default authSlice.reducer;
