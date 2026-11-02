import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useDeveloperAuth } from '../../context/DeveloperAuthContext';

export const DeveloperRouteGuard = () => {
  const { isDevAuthenticated } = useDeveloperAuth();

  if (!isDevAuthenticated) {
    return <Navigate to="/developer/login" replace />;
  }

  return <Outlet />;
};

