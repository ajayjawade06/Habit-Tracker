import { createContext, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import toast, { Toaster } from 'react-hot-toast';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const showNotification = useCallback((message, type = 'info', duration = 3000) => {
    const toastOptions = {
      duration: duration,
      position: 'top-right',
      style: {
        background: type === 'error' ? '#ef4444' : 
                   type === 'success' ? '#10b981' : 
                   type === 'warning' ? '#f59e0b' : 
                   '#3b82f6',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
      },
    };

    switch (type) {
      case 'success':
        toast.success(message, toastOptions);
        break;
      case 'error':
        toast.error(message, toastOptions);
        break;
      case 'warning':
        toast(message, {
          ...toastOptions,
          icon: '⚠️',
        });
        break;
      default:
        toast(message, toastOptions);
        break;
    }
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Toaster />
    </NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;