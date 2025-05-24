import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import { authService } from '../services/auth.service';
import { ROUTES } from '../types/routes';
import type { RootState } from '../store';

// Type for registration method
type RegisterMethod = 'email' | 'phone';

const Register: React.FC = () => {
  const [registerMethod, setRegisterMethod] = useState<RegisterMethod>('email');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown]);

  // Handle Google callback
  useEffect(() => {
    const handleGoogleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (code) {
        try {
          dispatch(loginStart());
          // Let the backend handle the redirect
          window.location.href = `${import.meta.env.VITE_API_URL}/auth/google/callback?code=${code}`;
        } catch (err: any) {
          dispatch(loginFailure(err.response?.data?.message || 'Google authentication failed'));
          // Clear the URL parameters on error
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }

      // Check for auth data in the URL
      const authData = urlParams.get('auth');
      if (authData) {
        try {
          const parsedAuth = JSON.parse(decodeURIComponent(authData));
          dispatch(loginSuccess(parsedAuth));
          // Clear the URL parameters
          window.history.replaceState({}, document.title, window.location.pathname);
          navigate(ROUTES.HOME);
        } catch (err) {
          dispatch(loginFailure('Failed to process authentication data'));
          // Clear the URL parameters on error
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    };

    handleGoogleCallback();
  }, [dispatch, navigate]);

  // Send OTP for phone registration
  const handleSendOtp = async () => {
    try {
      if (!name.trim()) {
        dispatch(loginFailure('Name is required'));
        return;
      }
      if (!phoneNumber.trim()) {
        dispatch(loginFailure('Phone number is required'));
        return;
      }
      // Basic phone number validation
      if (!/^\+?[1-9]\d{9,14}$/.test(phoneNumber)) {
        dispatch(loginFailure('Please enter a valid phone number'));
        return;
      }

      setIsSendingOtp(true);
      await authService.sendOtp(phoneNumber, name);
      setOtpSent(true);
      setShowOtpInput(true);
      setCountdown(60);
    } catch (err: any) {
      dispatch(loginFailure(err.response?.data?.message || 'Failed to send OTP'));
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Register with phone and OTP
  const handlePhoneRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      dispatch(loginFailure('OTP is required'));
      return;
    }
    if (!/^\d{6}$/.test(otp)) {
      dispatch(loginFailure('Please enter a valid 6-digit OTP'));
      return;
    }

    try {
      dispatch(loginStart());
      const authResponse = await authService.verifyOtp(phoneNumber, otp, name);
      dispatch(loginSuccess(authResponse));
      navigate(ROUTES.HOME);
    } catch (err: any) {
      dispatch(loginFailure(err.response?.data?.message || 'Invalid OTP'));
    }
  };

  // Register with email/password
  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate inputs
      if (!name.trim()) {
        dispatch(loginFailure('Name is required'));
        return;
      }
      if (!email.trim()) {
        dispatch(loginFailure('Email is required'));
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        dispatch(loginFailure('Please enter a valid email address'));
        return;
      }
      if (!phoneNumber.trim()) {
        dispatch(loginFailure('Phone number is required'));
        return;
      }
      if (!/^\+?[1-9]\d{9,14}$/.test(phoneNumber)) {
        dispatch(loginFailure('Please enter a valid phone number'));
        return;
      }
      if (!password) {
        dispatch(loginFailure('Password is required'));
        return;
      }
      if (password.length < 6) {
        dispatch(loginFailure('Password must be at least 6 characters long'));
        return;
      }

      dispatch(loginStart());
      const authResponse = await authService.register({ name, email, phoneNumber, password });
      dispatch(loginSuccess(authResponse));
      navigate(ROUTES.HOME);
    } catch (err: any) {
      dispatch(loginFailure(err.response?.data?.message || 'Registration failed'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Registration Method Toggle */}
          <div className="flex justify-center space-x-4 mb-6">
            <button
              type="button"
              onClick={() => setRegisterMethod('email')}
              className={`px-4 py-2 rounded-md ${
                registerMethod === 'email'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Email Register
            </button>
            <button
              type="button"
              onClick={() => setRegisterMethod('phone')}
              className={`px-4 py-2 rounded-md ${
                registerMethod === 'phone'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Phone Register
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {registerMethod === 'email' ? (
            <form className="space-y-6" onSubmit={handleEmailRegister}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="mt-1">
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="+91XXXXXXXXXX"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handlePhoneRegister}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="mt-1">
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="+91XXXXXXXXXX"
                  />
                </div>
              </div>
              {!showOtpInput ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp || countdown > 0}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    (isSendingOtp || countdown > 0) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSendingOtp ? 'Sending...' : countdown > 0 ? `Resend OTP in ${countdown}s` : 'Send OTP'}
                </button>
              ) : (
                <>
                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                      Enter OTP
                    </label>
                    <div className="mt-1">
                      <input
                        id="otp"
                        name="otp"
                        type="text"
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter 6-digit OTP"
                      />
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {loading ? 'Verifying...' : 'Verify OTP & Register'}
                    </button>
                  </div>
                </>
              )}
            </form>
          )}

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
          </div>

          {/* Google Sign In Button */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => authService.loginWithGoogle()}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign up with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 