import React from 'react';
import { Navigate } from 'react-router-dom';

export function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  console.log('[AdminRoute] Checking auth - token:', !!token, 'user:', !!userStr);

  if (!token || !userStr) {
    console.log('[AdminRoute] No token or user, redirecting to admin-login');
    return <Navigate to="/admin-login" replace />;
  }

  try {
    const userData = JSON.parse(userStr);
    console.log('[AdminRoute] Parsed user data:', userData);
    
    // Check if user is admin (role is admin or isAdmin flag is true)
    const isAdmin = 
      userData.role === 'admin' ||
      userData.isAdmin === true ||
      userData.email === 'admin@powersupply.com';

    console.log('[AdminRoute] Admin check result:', isAdmin);

    if (!isAdmin) {
      console.log('[AdminRoute] User is not admin, redirecting to dashboard');
      return <Navigate to="/dashboard" replace />;
    }

    console.log('[AdminRoute] Admin verified, rendering children');
    return children;
  } catch (error) {
    console.error('[AdminRoute] Error parsing user:', error);
    return <Navigate to="/admin-login" replace />;
  }
}
