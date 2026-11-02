import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_TABLES, getTableByToken } from '../data/mockTables';

const CustomerContext = createContext(null);

const STORAGE_KEY_SESSION = 'cafe_customer_session';

export const CustomerProvider = ({ children }) => {
  const [session, setSession] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SESSION);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load customer session", e);
    }
    // Default fallback to Patio Table 04 for preview/demo ease if no token yet
    return {
      table: MOCK_TABLES[2], // Table 04 Patio
      customer: null,
      registeredAt: null
    };
  });

  // Save session updates
  useEffect(() => {
    try {
      if (session) {
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
      }
    } catch (e) {
      console.error("Failed to save customer session", e);
    }
  }, [session]);

  const setTableFromToken = (qrToken) => {
    const foundTable = getTableByToken(qrToken);
    if (foundTable) {
      setSession(prev => ({
        ...prev,
        table: foundTable
      }));
      return foundTable;
    }
    return null;
  };

  const registerCustomer = ({ phone, countryCode = '+91', whatsappConsent = false }) => {
    const customerData = {
      phone: phone.trim(),
      countryCode,
      fullPhone: `${countryCode}${phone.trim()}`,
      whatsappConsent: Boolean(whatsappConsent),
      consentedAt: whatsappConsent ? new Date().toISOString() : null,
      consentVersion: 'v1.0_2026',
      consentSource: 'qr_table_onboarding',
      isVerified: false // Unverified until OTP verification implemented
    };

    setSession(prev => ({
      ...prev,
      customer: customerData,
      registeredAt: new Date().toISOString()
    }));

    return customerData;
  };

  const clearSession = () => {
    const reset = {
      table: MOCK_TABLES[2],
      customer: null,
      registeredAt: null
    };
    setSession(reset);
    localStorage.removeItem(STORAGE_KEY_SESSION);
  };

  return (
    <CustomerContext.Provider value={{
      table: session?.table,
      customer: session?.customer,
      registeredAt: session?.registeredAt,
      isRegistered: Boolean(session?.customer?.phone),
      setTableFromToken,
      registerCustomer,
      clearSession
    }}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
};

