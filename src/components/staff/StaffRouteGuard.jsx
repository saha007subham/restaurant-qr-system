import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useStaffAuth } from '../../context/StaffAuthContext';

export const StaffRouteGuard = () => {
  const { isAuthenticated } = useStaffAuth();

  if (!isAuthenticated) {
    return <Navigate to="/staff/login" replace />;
  }

  return <Outlet />;
};

