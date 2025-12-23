import React from 'react';
import { Navigate } from 'react-router-dom';

export function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (!token || !user) {
    return <Navigate to="/admin-login" replace />;
  }

  try {
    const userData = JSON.parse(user);
    
    // Check if user is admin (email matches admin email or has admin role)
    const isAdmin = 
      userData.email === process.env.REACT_APP_ADMIN_EMAIL ||
      userData.role === 'admin' ||
      userData.isAdmin === true;

    if (!isAdmin) {
      return <Navigate to="/dashboard" replace />;
    }

    return children;
  } catch (error) {
    return <Navigate to="/admin-login" replace />;
  }
}
