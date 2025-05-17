import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, logout } = useAuth();

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

  // If loading, return a loading spinner
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center p-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login page
  if (!isAuthenticated || !checkAuth()) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;