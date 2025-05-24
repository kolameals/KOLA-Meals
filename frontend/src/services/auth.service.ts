import api from './api';
import type { LoginCredentials, RegisterData, User, AuthResponse } from '../types/auth';

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  async register(data: RegisterData) {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      if (response.data) {
        this.storeAuthData(response.data);
      }
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async refreshToken(refreshToken: string) {
    const response = await api.post<AuthResponse>('/auth/refresh-token', { refreshToken });
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  async logout() {
    await api.post('/auth/logout');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('userRole');
  },

  async sendOtp(phoneNumber: string, name?: string) {
    try {
      // Use different endpoints for login and registration
      const endpoint = name ? '/auth/register/phone' : '/auth/login/phone';
      const payload = name ? { phoneNumber, name } : { phoneNumber };
      
      const response = await api.post(endpoint, payload);
      return response.data;
    } catch (error) {
      console.error('Send OTP error:', error);
      throw error;
    }
  },

  async verifyOtp(phoneNumber: string, code: string, name?: string): Promise<AuthResponse> {
    try {
      // Use different endpoints for login and registration
      const endpoint = name ? '/auth/verify-otp' : '/auth/verify-otp/login';
      const payload = name 
        ? { phoneNumber, otp: code, name }
        : { phoneNumber, otp: code };

      const response = await api.post<AuthResponse>(endpoint, payload);
      if (response.data) {
        this.storeAuthData(response.data);
      }
      return response.data;
    } catch (error) {
      console.error('Verify OTP error:', error);
      throw error;
    }
  },

  async loginWithGoogle() {
    try {
      // Redirect to Google OAuth endpoint
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  },

  // Handle Google OAuth callback
  async handleGoogleCallback() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (!code) {
        throw new Error('No authorization code received');
      }

      // Instead of making a GET request, we'll let the backend handle the redirect
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/google/callback?code=${code}`;
    } catch (error) {
      console.error('Google callback error:', error);
      throw error;
    }
  },

  // Helper function to store auth data
  storeAuthData(data: AuthResponse) {
    sessionStorage.setItem('token', data.token);
    sessionStorage.setItem('refreshToken', data.refreshToken);
    sessionStorage.setItem('userRole', data.user.role);
  }
}; 