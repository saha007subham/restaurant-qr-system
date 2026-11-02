import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_RESTAURANT } from '../data/mockRestaurant';
import { MOCK_MENU_ITEMS, MENU_CATEGORIES } from '../data/mockMenu';
import { MOCK_TABLES } from '../data/mockTables';

const RestaurantContext = createContext(null);

const STORAGE_KEY_SETTINGS = 'cafe_restaurant_settings';
const STORAGE_KEY_MENU_ITEMS = 'cafe_menu_items_store';
const STORAGE_KEY_CATEGORIES = 'cafe_menu_categories_store';
const STORAGE_KEY_TABLES = 'cafe_tables_store';
const STORAGE_KEY_STAFF = 'cafe_staff_members_store';
const STORAGE_KEY_CUSTOMERS = 'cafe_customers_store';
const STORAGE_KEY_CLIENTS = 'cafe_multi_clients_store';

const INITIAL_STAFF_MEMBERS = [
  {
    id: "staff-001",
    name: "Arjun Verma",
    email: "staff@rustique.com",
    role: "floor_captain",
    roleLabel: "Floor Captain & Barista Lead",
    phone: "+91 98450 99881",
    isActive: true,
    createdAt: "2026-01-15T09:00:00Z"
  },
  {
    id: "staff-002",
    name: "Meera Patel",
    email: "meera@rustique.com",
    role: "chef_lead",
    roleLabel: "Kitchen Sous Chef",
    phone: "+91 98450 99882",
    isActive: true,
    createdAt: "2026-02-01T10:30:00Z"
  },
  {
    id: "staff-003",
    name: "Rohan Deshmukh",
    email: "rohan@rustique.com",
    role: "runner",
    roleLabel: "Table Runner & Service",
    phone: "+91 98450 99883",
    isActive: false,
    createdAt: "2026-03-10T11:15:00Z"
  }
];

const INITIAL_CUSTOMERS = [
  {
    id: "cust-001",
    phone: "9876543210",
    countryCode: "+91",
    fullPhone: "+91 98765 43210",
    whatsappConsent: true,
    consentedAt: "2026-10-31T08:15:00Z",
    consentVersion: "v1.0_2026",
    consentSource: "qr_table_onboarding",
    isVerified: false,
    visitCount: 3,
    lastTableVisited: "Table 04",
    lastVisitAt: "2026-10-31T08:15:00Z"
  },
  {
    id: "cust-002",
    phone: "9845012399",
    countryCode: "+91",
    fullPhone: "+91 98450 12399",
    whatsappConsent: false,
    consentedAt: null,
    consentVersion: "v1.0_2026",
    consentSource: "qr_table_onboarding",
    isVerified: false,
    visitCount: 1,
    lastTableVisited: "Table 01",
    lastVisitAt: "2026-10-31T07:45:00Z"
  },
  {
    id: "cust-003",
    phone: "9731234567",
    countryCode: "+91",
    fullPhone: "+91 97312 34567",
    whatsappConsent: true,
    consentedAt: "2026-10-31T07:10:00Z",
    consentVersion: "v1.0_2026",
    consentSource: "qr_table_onboarding",
    isVerified: false,
    visitCount: 5,
    lastTableVisited: "Table 07",
    lastVisitAt: "2026-10-31T07:10:00Z"
  }
];

const INITIAL_CLIENTS = [
  {
    id: "client-rustique-01",
    name: "Café Rustique - Lavelle Road",
    city: "Bengaluru",
    status: "active",
    plan: "Enterprise",
    tablesCount: 5
  },
  {
    id: "client-bistro-02",
    name: "Bistro Nouveau - Bandra West",
    city: "Mumbai",
    status: "sandbox",
    plan: "Pro Tier",
    tablesCount: 8
  }
];

export const RestaurantProvider = ({ children }) => {
  // Restaurant Profile & Branding
  const [restaurant, setRestaurant] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      return saved ? JSON.parse(saved) : MOCK_RESTAURANT;
    } catch {
      return MOCK_RESTAURANT;
    }
  });

  // Menu Categories
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CATEGORIES);
      return saved ? JSON.parse(saved) : MENU_CATEGORIES;
    } catch {
      return MENU_CATEGORIES;
    }
  });

  // Menu Items
  const [menuItems, setMenuItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MENU_ITEMS);
      return saved ? JSON.parse(saved) : MOCK_MENU_ITEMS;
    } catch {
      return MOCK_MENU_ITEMS;
    }
  });

  // Tables
  const [tables, setTables] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TABLES);
      return saved ? JSON.parse(saved) : MOCK_TABLES;
    } catch {
      return MOCK_TABLES;
    }
  });

  // Staff accounts
  const [staffList, setStaffList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STAFF);
      return saved ? JSON.parse(saved) : INITIAL_STAFF_MEMBERS;
    } catch {
      return INITIAL_STAFF_MEMBERS;
    }
  });

  // Customers & consent records
  const [customers, setCustomers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOMERS);
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  // Multi-tenant clients
  const [clients, setClients] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CLIENTS);
      return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
    } catch {
      return INITIAL_CLIENTS;
    }
  });
  const [activeClientId, setActiveClientId] = useState("client-rustique-01");

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(restaurant));
    } catch (e) { console.error(e); }
  }, [restaurant]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
    } catch (e) { console.error(e); }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MENU_ITEMS, JSON.stringify(menuItems));
    } catch (e) { console.error(e); }
  }, [menuItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TABLES, JSON.stringify(tables));
    } catch (e) { console.error(e); }
  }, [tables]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(staffList));
    } catch (e) { console.error(e); }
  }, [staffList]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOMERS, JSON.stringify(customers));
    } catch (e) { console.error(e); }
  }, [customers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CLIENTS, JSON.stringify(clients));
    } catch (e) { console.error(e); }
  }, [clients]);

  // --- BRANDING & SETTINGS ACTIONS ---
  const updateRestaurantSettings = (updatedFields) => {
    setRestaurant(prev => ({
      ...prev,
      ...updatedFields,
      branding: {
        ...prev.branding,
        ...(updatedFields.branding || {})
      }
    }));
  };

  // --- CATEGORIES ACTIONS ---
  const addCategory = ({ name, icon = 'Utensils' }) => {
    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newCat = { id, name, icon };
    setCategories(prev => [...prev, newCat]);
    return newCat;
  };

  const updateCategory = (id, updatedFields) => {
    setCategories(prev =>
      prev.map(cat => cat.id === id ? { ...cat, ...updatedFields } : cat)
    );
  };

  const deleteCategory = (id) => {
    if (id === 'all') return;
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  // --- MENU ITEMS ACTIONS ---
  const addMenuItem = (itemData) => {
    const newItem = {
      id: `item-${Date.now().toString(36)}`,
      name: itemData.name,
      category: itemData.category || 'coffee',
      price: Number(itemData.price) || 0,
      description: itemData.description || '',
      imageUrl: itemData.imageUrl || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
      isVeg: Boolean(itemData.isVeg),
      isChefSpecial: Boolean(itemData.isChefSpecial),
      isBestseller: Boolean(itemData.isBestseller),
      isAvailable: itemData.isAvailable !== false,
      prepTime: itemData.prepTime || '8-10 mins',
      dietary: itemData.isVeg ? 'Vegetarian' : 'Non-Vegetarian',
      tags: itemData.tags || ['Artisanal']
    };
    setMenuItems(prev => [newItem, ...prev]);
    return newItem;
  };

  const updateMenuItem = (id, updatedFields) => {
    setMenuItems(prev =>
      prev.map(item => item.id === id ? { ...item, ...updatedFields } : item)
    );
  };

  const toggleItemAvailability = (id) => {
    setMenuItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isAvailable: item.isAvailable === false ? true : false } : item
      )
    );
  };

  const deleteMenuItem = (id) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  // --- TABLES & QR TOKENS ACTIONS ---
  const addTable = ({ tableNumber, section, capacity = 4 }) => {
    const numPart = tableNumber.replace(/\D/g, '') || Math.floor(10 + Math.random() * 80);
    const cleanSection = section.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 8);
    const randomHex = Math.random().toString(36).substring(2, 6);
    const qrToken = `tbl-${cleanSection}-${numPart}-${randomHex}`;

    const newTable = {
      id: `table-${Date.now().toString(36)}`,
      qrToken,
      tableNumber,
      section,
      capacity: Number(capacity),
      isActive: true,
      createdAt: new Date().toISOString()
    };

    setTables(prev => [...prev, newTable]);
    return newTable;
  };

  const updateTable = (id, updatedFields) => {
    setTables(prev =>
      prev.map(t => t.id === id ? { ...t, ...updatedFields } : t)
    );
  };

  const deleteTable = (id) => {
    setTables(prev => prev.filter(t => t.id !== id));
  };

  const regenerateTableToken = (id) => {
    const randomHex = Math.random().toString(36).substring(2, 8);
    setTables(prev =>
      prev.map(t => {
        if (t.id === id) {
          const prefix = t.qrToken.split('-')[1] || 'sec';
          const num = t.tableNumber.replace(/\D/g, '') || '01';
          return { ...t, qrToken: `tbl-${prefix}-${num}-${randomHex}` };
        }
        return t;
      })
    );
  };

  // --- STAFF ACCOUNTS ACTIONS ---
  const addStaffAccount = ({ name, email, role, phone }) => {
    const newStaff = {
      id: `staff-${Date.now().toString(36)}`,
      name,
      email: email.toLowerCase().trim(),
      role: role || 'floor_captain',
      roleLabel: role === 'chef_lead' ? 'Kitchen Sous Chef' : role === 'runner' ? 'Table Runner' : 'Floor Captain & Barista Lead',
      phone: phone || '+91 98450 00000',
      isActive: true,
      createdAt: new Date().toISOString()
    };
    setStaffList(prev => [...prev, newStaff]);
    return newStaff;
  };

  const updateStaffRole = (id, role, roleLabel) => {
    setStaffList(prev =>
      prev.map(s => s.id === id ? { ...s, role, roleLabel } : s)
    );
  };

  const toggleStaffStatus = (id) => {
    setStaffList(prev =>
      prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s)
    );
  };

  const deleteStaffAccount = (id) => {
    setStaffList(prev => prev.filter(s => s.id !== id));
  };

  // --- RECORD CUSTOMER VISIT FROM TABLE ONBOARDING ---
  const recordCustomerVisit = ({ phone, countryCode, whatsappConsent, tableNumber }) => {
    const cleanPhone = phone.trim();
    setCustomers(prev => {
      const existingIdx = prev.findIndex(c => c.phone === cleanPhone);
      const now = new Date().toISOString();

      if (existingIdx > -1) {
        const updated = [...prev];
        const existing = updated[existingIdx];
        updated[existingIdx] = {
          ...existing,
          visitCount: (existing.visitCount || 1) + 1,
          lastTableVisited: tableNumber,
          lastVisitAt: now,
          // Update consent if explicitly changed
          whatsappConsent: Boolean(whatsappConsent),
          consentedAt: whatsappConsent ? (existing.consentedAt || now) : null
        };
        return updated;
      }

      const newCustomer = {
        id: `cust-${Date.now().toString(36)}`,
        phone: cleanPhone,
        countryCode: countryCode || '+91',
        fullPhone: `${countryCode || '+91'} ${cleanPhone}`,
        whatsappConsent: Boolean(whatsappConsent),
        consentedAt: whatsappConsent ? now : null,
        consentVersion: 'v1.0_2026',
        consentSource: 'qr_table_onboarding',
        isVerified: false,
        visitCount: 1,
        lastTableVisited: tableNumber,
        lastVisitAt: now
      };

      return [newCustomer, ...prev];
    });
  };

  // --- EXPORT CUSTOMER CSV (DEVELOPER ONLY) ---
  const exportCustomersCSV = () => {
    const headers = ["Customer ID", "Phone Number", "WhatsApp Consent", "Consent Timestamp", "Consent Version", "Source", "Total Visits", "Last Table Visited", "Last Visit Date"];
    const rows = customers.map(c => [
      c.id,
      c.fullPhone,
      c.whatsappConsent ? "CONSENTED" : "UNCHECKED / WITHDRAWN",
      c.consentedAt ? new Date(c.consentedAt).toISOString() : "N/A",
      c.consentVersion || "v1.0",
      c.consentSource || "qr_table_onboarding",
      c.visitCount || 1,
      c.lastTableVisited || "Table",
      c.lastVisitAt ? new Date(c.lastVisitAt).toLocaleDateString() : "N/A"
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.map(field => `"${field}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `cafe_rustique_customers_consent_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- FUTURE CLIENT MANAGEMENT ---
  const addClientTenant = ({ name, city, plan = 'Pro Tier' }) => {
    const newClient = {
      id: `client-${Date.now().toString(36)}`,
      name,
      city,
      status: 'sandbox',
      plan,
      tablesCount: 0
    };
    setClients(prev => [...prev, newClient]);
    return newClient;
  };

  return (
    <RestaurantContext.Provider
      value={{
        restaurant,
        updateRestaurantSettings,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        menuItems,
        addMenuItem,
        updateMenuItem,
        toggleItemAvailability,
        deleteMenuItem,
        tables,
        addTable,
        updateTable,
        deleteTable,
        regenerateTableToken,
        staffList,
        addStaffAccount,
        updateStaffRole,
        toggleStaffStatus,
        deleteStaffAccount,
        customers,
        recordCustomerVisit,
        exportCustomersCSV,
        clients,
        activeClientId,
        setActiveClientId,
        addClientTenant
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within RestaurantProvider');
  }
  return context;
};

