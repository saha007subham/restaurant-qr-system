import React, { createContext, useContext, useState, useEffect } from 'react';

const DeveloperAuthContext = createContext(null);
const STORAGE_KEY_DEV_AUTH = 'cafe_developer_auth_session';

const DEMO_DEVELOPER_USER = {
  id: "dev-001-master",
  name: "System Architect",
  email: "developer@rustique.com",
  role: "developer",
  badge: "Master Developer",
  avatar: "DEV",
  permissions: {
    canManageBranding: true,
    canManageMenu: true,
    canManagePricing: true,
    canManageTables: true,
    canGenerateQRCodes: true,
    canConfigureReviewLinks: true,
    canManageStaffAccounts: true,
    canViewCustomerRecords: true,
    canExportCustomerData: true,
    canConfigureClients: true
  }
};

export const DeveloperAuthProvider = ({ children }) => {
  const [devUser, setDevUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DEV_AUTH);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [authError, setAuthError] = useState('');

  useEffect(() => {
    try {
      if (devUser) {
        localStorage.setItem(STORAGE_KEY_DEV_AUTH, JSON.stringify(devUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_DEV_AUTH);
      }
    } catch (e) {
      console.error(e);
    }
  }, [devUser]);

  const login = (email, password) => {
    setAuthError('');
    const cleanEmail = email.trim().toLowerCase();

    // In Stage 3 mock developer auth:
    if (cleanEmail === DEMO_DEVELOPER_USER.email && password === 'devmaster123') {
      const authUser = {
        ...DEMO_DEVELOPER_USER,
        lastLogin: new Date().toISOString()
      };
      setDevUser(authUser);
      return { success: true };
    }

    const err = 'Invalid developer credentials. Use developer@rustique.com / devmaster123';
    setAuthError(err);
    return { success: false, error: err };
  };

  const logout = () => {
    setDevUser(null);
    localStorage.removeItem(STORAGE_KEY_DEV_AUTH);
  };

  return (
    <DeveloperAuthContext.Provider
      value={{
        devUser,
        isDevAuthenticated: Boolean(devUser),
        authError,
        setAuthError,
        login,
        logout
      }}
    >
      {children}
    </DeveloperAuthContext.Provider>
  );
};

export const useDeveloperAuth = () => {
  const context = useContext(DeveloperAuthContext);
  if (!context) {
    throw new Error('useDeveloperAuth must be used within DeveloperAuthProvider');
  }
  return context;
};

