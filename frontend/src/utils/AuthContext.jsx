import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { axiosInstance } from '../config';

const AuthContext = createContext(null);

// Helper functions for token management
const getStoredAuth = () => {
  try {
    const token = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user'));
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
};

const setStoredAuth = (token, user) => {
  if (token) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredAuth().user);
  const [loading, setLoading] = useState(true);

  // Set up axios interceptor for token
  useEffect(() => {
    const interceptor = axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => axiosInstance.interceptors.request.eject(interceptor);
  }, []);

  // Check auth status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { token } = getStoredAuth();
      
      // Try to get user data with stored token
      const response = await axiosInstance.get('/auth/dashboard/me');
      const userData = response.data;
      
      // If successful, ensure token is properly stored
      if (userData) {
        setUser(userData);
        setStoredAuth(token, userData);
      } else {
        throw new Error('Invalid user data');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setStoredAuth(null, null);
    } finally {
      setLoading(false);
    }
  };

  const refreshUserData = async () => {
    try {
      const { token } = getStoredAuth();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axiosInstance.get('/auth/dashboard/me');
      const userData = response.data;
      
      if (userData) {
        setUser(userData);
        setStoredAuth(token, userData);
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      setUser(null);
      setStoredAuth(null, null);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      
      // If login requires verification
      if (response.status === 403 && response.data.requiresVerification) {
        return {
          requiresVerification: true,
          email: response.data.email,
          message: response.data.message
        };
      }

      // Normal successful login
      const { token, user: userData } = response.data;
      
      // Ensure we have both token and user data
      if (!token || !userData) {
        throw new Error('Invalid login response');
      }

      // Set auth data
      setUser(userData);
      setStoredAuth(token, userData);

      // Update axios default headers
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return response.data;
    } catch (error) {
      if (error.response?.status === 403 && error.response.data.requiresVerification) {
        return {
          requiresVerification: true,
          email: error.response.data.email,
          message: error.response.data.message
        };
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } finally {
      // Clear all auth data
      setUser(null);
      setStoredAuth(null, null);
      
      // Clear axios headers
      delete axiosInstance.defaults.headers.common['Authorization'];
      
      // Force a check of auth status
      await checkAuth();
    }
  };

  const register = async (formData) => {
    try {
      const response = await axiosInstance.post('/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Check if registration was successful
      if (response.data.success) {
        // Always redirect to verify-email after successful registration
        return {
          success: true,
          message: response.data.message || 'Registration successful! Please verify your email.',
          email: formData.get('email'),
          name: formData.get('name'),
          requiresVerification: true
        };
      }

      // If we get here without success, something went wrong
      throw new Error(response.data.message || 'Registration failed');
    } catch (error) {
      // Handle specific error cases
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Registration failed');
      }
      throw error;
    }
  };

  const verifyEmail = async (email, otp) => {
    const response = await axiosInstance.post('/auth/verify-email', {
      email,
      otp: otp.trim()
    });

    // Backend returns message and redirectTo on success
    if (response.data.redirectTo) {
      return {
        success: true,
        message: response.data.message,
        redirectTo: response.data.redirectTo
      };
    }

    throw new Error(response.data.message || 'Verification failed');
  };

  const resendVerificationOTP = async (email) => {
    const response = await axiosInstance.post('/auth/resend-verification', { email });
    return {
      success: true,
      message: response.data.message || 'Verification code sent successfully!'
    };
  };

  const updateVerificationEmail = async (email, oldEmail) => {
    const response = await axiosInstance.post('/auth/update-verification-email', { 
      email,
      oldEmail 
    });
    return {
      success: true,
      message: response.data.message || 'Email updated successfully!'
    };
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      <div className="animate-spin h-12 w-12 border-4 border-white rounded-full border-t-transparent"></div>
    </div>;
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      register, 
      checkAuth, 
      refreshUserData, 
      verifyEmail,
      resendVerificationOTP,
      updateVerificationEmail 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};