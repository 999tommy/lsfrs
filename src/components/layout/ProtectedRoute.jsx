import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Redirect based on their role
    if (currentUser.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (currentUser.role === 'officer') return <Navigate to="/officer/dashboard" replace />;
    if (currentUser.role === 'technical') return <Navigate to="/technical/dashboard" replace />;
  }

  // Force officers to change password on first login
  if (currentUser.role === 'officer' && currentUser.isFirstLogin && location.pathname !== '/officer/settings') {
    return <Navigate to="/officer/settings" replace />;
  }

  return children;
};
