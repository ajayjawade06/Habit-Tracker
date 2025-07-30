import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth, AuthProvider } from './utils/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { AnimatePresence, motion } from 'framer-motion';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import UserInfo from './pages/UserInfo';
import Reports from './pages/Reports';
import Home from './pages/Home';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

const PageTransition = ({ children }) => {
  const pageVariants = {
    initial: {
      opacity: 0,
      x: -20
    },
    animate: {
      opacity: 1,
      x: 0
    },
    exit: {
      opacity: 0,
      x: 20
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

PageTransition.propTypes = {
  children: PropTypes.node.isRequired
};

const AppContent = () => {
  const location = useLocation();

  return (
    <NotificationProvider>
      <AuthProvider>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
            <Route path="/verify-email" element={<PageTransition><VerifyEmail /></PageTransition>} />
            <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
            <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <Dashboard />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <Progress />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <Profile />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-info"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <UserInfo />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <Reports />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AnimatePresence>
      </AuthProvider>
    </NotificationProvider>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export default App;