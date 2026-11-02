import React, { createContext, useContext, useState, useEffect } from 'react';

const StaffAuthContext = createContext(null);
const STORAGE_KEY_STAFF_AUTH = 'cafe_staff_auth_session';

// Demo staff user credentials for Stage 2
const DEMO_STAFF_USER = {
  id: "staff-001",
  name: "Arjun Verma",
  email: "staff@rustique.com",
  role: "staff", // Enforces restricted staff role
  roleTitle: "Floor Captain & Barista Lead",
  avatar: "AV",
  restaurantId: "rest-001-rustique",
  permissions: {
    canViewLiveOrders: true,
    canUpdateOrderStatus: true,
    canViewOrderHistory: true,
    canViewCustomerPhoneForOrder: true,
    // Strictly disallowed for staff:
    canManageMenu: false,
    canChangePrices: false,
    canManageTables: false,
    canGenerateQRCodes: false,
    canChangeSettings: false,
    canModifyCustomerRecords: false,
    canExportPhoneNumbers: false,
    canManageMarketingConsent: false,
    canManageStaffRoles: false,
    canAccessDeveloperSettings: false
  }
};

export const StaffAuthProvider = ({ children }) => {
  const [staffUser, setStaffUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STAFF_AUTH);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [authError, setAuthError] = useState('');
  const [passwordStore, setPasswordStore] = useState(() => {
    try {
      return localStorage.getItem('cafe_staff_pwd') || 'staff123';
    } catch {
      return 'staff123';
    }
  });

  useEffect(() => {
    try {
      if (staffUser) {
        localStorage.setItem(STORAGE_KEY_STAFF_AUTH, JSON.stringify(staffUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_STAFF_AUTH);
      }
    } catch (e) {
      console.error(e);
    }
  }, [staffUser]);

  const login = (email, password) => {
    setAuthError('');
    const cleanEmail = email.trim().toLowerCase();

    if (cleanEmail === DEMO_STAFF_USER.email && password === passwordStore) {
      const authenticatedUser = {
        ...DEMO_STAFF_USER,
        lastLogin: new Date().toISOString()
      };
      setStaffUser(authenticatedUser);
      return { success: true };
    }

    const err = 'Invalid staff email or password. Use staff@rustique.com / staff123';
    setAuthError(err);
    return { success: false, error: err };
  };

  const logout = () => {
    setStaffUser(null);
    localStorage.removeItem(STORAGE_KEY_STAFF_AUTH);
  };

  const updateCredentials = (currentPassword, newPassword) => {
    if (currentPassword !== passwordStore) {
      return { success: false, error: 'Current password does not match.' };
    }
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters long.' };
    }

    setPasswordStore(newPassword);
    localStorage.setItem('cafe_staff_pwd', newPassword);
    return { success: true };
  };

  return (
    <StaffAuthContext.Provider
      value={{
        staffUser,
        isAuthenticated: Boolean(staffUser),
        authError,
        setAuthError,
        login,
        logout,
        updateCredentials
      }}
    >
      {children}
    </StaffAuthContext.Provider>
  );
};

export const useStaffAuth = () => {
  const context = useContext(StaffAuthContext);
  if (!context) {
    throw new Error('useStaffAuth must be used within StaffAuthProvider');
  }
  return context;
};

