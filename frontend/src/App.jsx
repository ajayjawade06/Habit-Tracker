import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth, AuthProvider } from './utils/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import UserInfo from './pages/UserInfo';
import Home from './pages/Home';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <Progress />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-info"
          element={
            <ProtectedRoute>
              <UserInfo />
            </ProtectedRoute>
          }
        />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export default App;