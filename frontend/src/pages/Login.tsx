import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import { authService } from '../services/auth.service';
import { ROUTES } from '../types/routes';
import type { RootState } from '../store';

type LoginMethod = 'email' | 'phone';

const Login: React.FC = () => {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
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

  useEffect(() => {
    // Clear any previous errors when component mounts
    dispatch(loginFailure(''));
  }, [dispatch]);

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

  const handleSendOtp = async () => {
    try {
      setIsSendingOtp(true);
      await authService.sendOtp(phoneNumber);
      setOtpSent(true);
      setShowOtpInput(true);
      setCountdown(60); // 60 seconds countdown
    } catch (err: any) {
      dispatch(loginFailure(err.response?.data?.message || 'Failed to send OTP'));
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      dispatch(loginFailure('Please enter OTP'));
      return;
    }
    try {
      dispatch(loginStart());
      const authResponse = await authService.verifyOtp(phoneNumber, otp);
      authService.storeAuthData(authResponse);
      dispatch(loginSuccess(authResponse));
      navigate(ROUTES.HOME);
    } catch (err: any) {
      dispatch(loginFailure(err.response?.data?.message || 'Invalid OTP'));
      setShowOtpInput(false); // Reset OTP input on error
      setOtp(''); // Clear OTP input
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      dispatch(loginStart());
      const authResponse = await authService.login({ email, password });
      authService.storeAuthData(authResponse);
      dispatch(loginSuccess(authResponse));
      
      switch (authResponse.user.role) {
        case 'ADMIN':
          navigate(ROUTES.ADMIN_DASHBOARD);
          break;
        case 'DELIVERY_PARTNER':
          navigate(ROUTES.DELIVERY_DASHBOARD);
          break;
        default:
          navigate(ROUTES.HOME);
      }
    } catch (err: any) {
      dispatch(loginFailure(err.response?.data?.message || 'Login failed'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to={ROUTES.REGISTER} className="font-medium text-blue-600 hover:text-blue-500">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Login Method Toggle */}
          <div className="flex justify-center space-x-4 mb-6">
            <button
              type="button"
              onClick={() => setLoginMethod('email')}
              className={`px-4 py-2 rounded-md ${
                loginMethod === 'email'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Email Login
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('phone')}
              className={`px-4 py-2 rounded-md ${
                loginMethod === 'phone'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Phone Login
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {loginMethod === 'email' ? (
            <form className="space-y-6" onSubmit={handleEmailLogin}>
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
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
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
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleOtpLogin}>
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
                  disabled={isSendingOtp || countdown > 0 || !phoneNumber.trim()}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    (isSendingOtp || countdown > 0 || !phoneNumber.trim()) ? 'opacity-50 cursor-not-allowed' : ''
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
                      disabled={loading || !otp.trim()}
                      className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        (loading || !otp.trim()) ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                  </div>
                </>
              )}
            </form>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => authService.loginWithGoogle()}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <img
                  className="h-5 w-5 mr-2"
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google logo"
                />
                Sign in with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 