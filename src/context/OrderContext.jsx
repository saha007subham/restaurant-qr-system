import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateOrderNumber } from '../utils/formatters';

const OrderContext = createContext(null);
const STORAGE_KEY_ORDERS = 'cafe_orders_store';
const STORAGE_KEY_LATEST_ORDER = 'cafe_latest_order_id';

export const ORDER_STATUS_FLOW = ['received', 'preparing', 'ready', 'served', 'completed'];

const INITIAL_MOCK_ORDERS = [
  {
    id: "ord-demo-001",
    orderNumber: "#CR-4028",
    table: {
      id: "table-04",
      tableNumber: "Table 04",
      section: "Sunlit Patio Terrace"
    },
    customer: {
      phone: "9876543210",
      countryCode: "+91",
      fullPhone: "+91 98765 43210"
    },
    items: [
      {
        id: "item-c01",
        name: "Classic Spanish Cortado",
        price: 240,
        quantity: 2,
        specialInstructions: "Less ice, oat milk if possible",
        imageUrl: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80",
        isVeg: true
      },
      {
        id: "item-b01",
        name: "Almond Frangipane Croissant",
        price: 260,
        quantity: 1,
        specialInstructions: "Warm before serving",
        imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
        isVeg: true
      }
    ],
    orderNotes: "Please bring coffee first.",
    subtotal: 740,
    gst: 37,
    grandTotal: 777,
    status: "received",
    statusHistory: [
      { status: "received", timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(), note: "Order placed by customer at Table 04" }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString()
  },
  {
    id: "ord-demo-002",
    orderNumber: "#CR-4022",
    table: {
      id: "table-01",
      tableNumber: "Table 01",
      section: "Main Roastery Hall"
    },
    customer: {
      phone: "9845012399",
      countryCode: "+91",
      fullPhone: "+91 98450 12399"
    },
    items: [
      {
        id: "item-s01",
        name: "Truffled Mushroom & Whipped Feta Toast",
        price: 420,
        quantity: 1,
        specialInstructions: "Crispy toast base",
        imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80",
        isVeg: true
      },
      {
        id: "item-c02",
        name: "Smoked Vanilla Flat White",
        price: 280,
        quantity: 1,
        specialInstructions: "",
        imageUrl: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80",
        isVeg: true
      }
    ],
    orderNotes: "Birthday celebration quick treat.",
    subtotal: 700,
    gst: 35,
    grandTotal: 735,
    status: "preparing",
    statusHistory: [
      { status: "received", timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(), note: "Order received" },
      { status: "preparing", timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(), note: "Kitchen started preparation" }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString()
  },
  {
    id: "ord-demo-003",
    orderNumber: "#CR-4015",
    table: {
      id: "table-07",
      tableNumber: "Table 07",
      section: "Courtyard Garden"
    },
    customer: {
      phone: "9731234567",
      countryCode: "+91",
      fullPhone: "+91 97312 34567"
    },
    items: [
      {
        id: "item-m01",
        name: "San Marzano Burrata Margherita",
        price: 580,
        quantity: 1,
        specialInstructions: "Extra basil leaves",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
        isVeg: true
      },
      {
        id: "item-v01",
        name: "Kaffir Lime & Passionfruit Fizz",
        price: 260,
        quantity: 2,
        specialInstructions: "",
        imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
        isVeg: true
      }
    ],
    orderNotes: "",
    subtotal: 1100,
    gst: 55,
    grandTotal: 1155,
    status: "ready",
    statusHistory: [
      { status: "received", timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(), note: "Order received" },
      { status: "preparing", timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(), note: "Kitchen preparation started" },
      { status: "ready", timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(), note: "Order plated and ready for table runner" }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString()
  },
  {
    id: "ord-demo-004",
    orderNumber: "#CR-3998",
    table: {
      id: "table-02",
      tableNumber: "Table 02",
      section: "Main Roastery Hall"
    },
    customer: {
      phone: "9123456789",
      countryCode: "+91",
      fullPhone: "+91 91234 56789"
    },
    items: [
      {
        id: "item-d01",
        name: "Belgian Espresso Tiramisu Pot",
        price: 360,
        quantity: 1,
        specialInstructions: "",
        imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80",
        isVeg: true
      }
    ],
    orderNotes: "",
    subtotal: 360,
    gst: 18,
    grandTotal: 378,
    status: "completed",
    statusHistory: [
      { status: "received", timestamp: new Date(Date.now() - 1000 * 60 * 70).toISOString(), note: "Order placed" },
      { status: "preparing", timestamp: new Date(Date.now() - 1000 * 60 * 65).toISOString(), note: "Kitchen prep" },
      { status: "ready", timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString(), note: "Plated" },
      { status: "served", timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString(), note: "Served at Table 02" },
      { status: "completed", timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), note: "Dining completed and settled" }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 70).toISOString()
  }
];

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_MOCK_ORDERS;
  });

  const [latestOrderId, setLatestOrderId] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_LATEST_ORDER) || 'ord-demo-001';
    } catch {
      return 'ord-demo-001';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      if (latestOrderId) {
        localStorage.setItem(STORAGE_KEY_LATEST_ORDER, latestOrderId);
      }
    } catch (e) {
      console.error(e);
    }
  }, [latestOrderId]);

  const placeOrder = ({ items, table, customer, orderNotes, subtotal, gst, grandTotal }) => {
    const orderId = `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const orderNumber = generateOrderNumber();
    const now = new Date().toISOString();

    const newOrder = {
      id: orderId,
      orderNumber,
      table,
      customer,
      items: items.map(entry => ({
        id: entry.item.id,
        name: entry.item.name,
        price: entry.item.price,
        quantity: entry.quantity,
        specialInstructions: entry.specialInstructions || '',
        imageUrl: entry.item.imageUrl,
        isVeg: entry.item.isVeg
      })),
      orderNotes: orderNotes || '',
      subtotal,
      gst,
      grandTotal,
      status: 'received',
      statusHistory: [
        {
          status: 'received',
          timestamp: now,
          note: `Order received at ${table.tableNumber}. Awaiting kitchen confirmation.`
        }
      ],
      createdAt: now
    };

    setOrders(prev => [newOrder, ...prev]);
    setLatestOrderId(orderId);
    return newOrder;
  };

  const getOrder = (orderId) => {
    return orders.find(o => o.id === orderId) || null;
  };

  const updateOrderStatus = (orderId, newStatus, note = '') => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          const now = new Date().toISOString();
          const defaultNotes = {
            received: 'Order placed and logged in kitchen system.',
            preparing: 'Staff accepted order and initiated preparation.',
            ready: 'Order is plated, checked, and ready for serving.',
            served: 'Order served hot at the table.',
            completed: 'Dining session completed and settled.',
            rejected: 'Order was rejected by restaurant staff.'
          };

          const eventNote = note || defaultNotes[newStatus] || `Status updated to ${newStatus}`;

          return {
            ...ord,
            status: newStatus,
            statusHistory: [
              ...ord.statusHistory,
              { status: newStatus, timestamp: now, note: eventNote }
            ]
          };
        }
        return ord;
      })
    );
  };

  const rejectOrder = (orderId, reason = 'Kitchen busy / item out of stock') => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          const now = new Date().toISOString();
          return {
            ...ord,
            status: 'rejected',
            rejectionReason: reason,
            statusHistory: [
              ...ord.statusHistory,
              { status: 'rejected', timestamp: now, note: `Rejected: ${reason}` }
            ]
          };
        }
        return ord;
      })
    );
  };

  const advanceOrderStatus = (orderId) => {
    const ord = getOrder(orderId);
    if (!ord) return;
    const currentIndex = ORDER_STATUS_FLOW.indexOf(ord.status);
    if (currentIndex >= 0 && currentIndex < ORDER_STATUS_FLOW.length - 1) {
      const nextStatus = ORDER_STATUS_FLOW[currentIndex + 1];
      updateOrderStatus(orderId, nextStatus);
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        latestOrderId,
        placeOrder,
        getOrder,
        updateOrderStatus,
        rejectOrder,
        advanceOrderStatus
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within OrderProvider');
  }
  return context;
};
