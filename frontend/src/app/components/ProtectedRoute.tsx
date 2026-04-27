import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useStore } from '../context/StoreContext';

interface ProtectedRouteProps {
  allowedRoles?: ('user' | 'admin' | 'super_admin')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, isAuthenticated, token } = useStore();

  // If not authenticated, redirect to login
  if (!isAuthenticated || !token || !user) {
    return <Navigate to="/login" replace />;
  }

  // If specific roles are required, check them
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
