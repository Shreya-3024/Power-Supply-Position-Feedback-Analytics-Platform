import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (!token || !user) {
    // Redirect to landing page if not authenticated
    return <Navigate to="/welcome" replace />;
  }

  return <>{children}</>;
}
