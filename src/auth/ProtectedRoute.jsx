import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, logout } = useAuth();

  const checkAuth = () => {
    const expiresAt = localStorage.getItem('expiresAt');
    if (!expiresAt) return false;

    const now = Date.now();
    const expiry = parseInt(expiresAt);

    if (now > expiry) {
      logout(); // Logout if token is expired
      return false;
    }
    return true;
  };

  // If not authenticated, redirect to login page
  if (!checkAuth()) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;