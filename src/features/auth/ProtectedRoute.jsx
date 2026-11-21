import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * ProtectedRoute — wraps private pages. Redirects to /login while preserving
 * the intended destination in location.state.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading || !user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return children;
}