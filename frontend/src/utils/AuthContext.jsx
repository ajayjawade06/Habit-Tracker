import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { axiosInstance } from '../config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axiosInstance.get('/auth/dashboard/me');
      setUser(response.data);
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshUserData = async () => {
    try {
      const response = await axiosInstance.get('/auth/dashboard/me');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const login = async (email, password) => {
    const response = await axiosInstance.post('/auth/login', { email, password });
    setUser(response.data.user);
    await refreshUserData(); // Refresh user data after login
    return response.data;
  };

  const logout = async () => {
    await axiosInstance.post('/auth/logout');
    setUser(null);
  };

  const register = async (formData) => {
    const response = await axiosInstance.post('/auth/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    // Don't set user or refresh data after registration
    // User needs to explicitly log in
    if (response.data.success) {
      return {
        success: true,
        message: response.data.message,
        redirectTo: '/login'
      };
    }
    
    throw new Error(response.data.message || 'Registration failed');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      <div className="animate-spin h-12 w-12 border-4 border-white rounded-full border-t-transparent"></div>
    </div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, checkAuth, refreshUserData }}>
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