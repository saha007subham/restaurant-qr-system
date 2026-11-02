import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_RESTAURANT } from '../data/mockRestaurant';

const CartContext = createContext(null);
const STORAGE_KEY_CART = 'cafe_cart_items';
const STORAGE_KEY_NOTES = 'cafe_order_notes';

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orderNotes, setOrderNotes] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_NOTES) || '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_NOTES, orderNotes);
    } catch (e) {
      console.error(e);
    }
  }, [orderNotes]);

  const addItem = (item, quantity = 1, specialInstructions = '') => {
    setItems(prev => {
      const existingIndex = prev.findIndex(i => i.item.id === item.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          specialInstructions: specialInstructions || updated[existingIndex].specialInstructions
        };
        return updated;
      }
      return [...prev, { item, quantity, specialInstructions }];
    });
  };

  const updateQuantity = (itemId, delta) => {
    setItems(prev => {
      return prev
        .map(entry => {
          if (entry.item.id === itemId) {
            const newQty = entry.quantity + delta;
            return newQty > 0 ? { ...entry, quantity: newQty } : null;
          }
          return entry;
        })
        .filter(Boolean);
    });
  };

  const setItemQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems(prev =>
      prev.map(entry =>
        entry.item.id === itemId ? { ...entry, quantity } : entry
      )
    );
  };

  const updateInstructions = (itemId, instructions) => {
    setItems(prev =>
      prev.map(entry =>
        entry.item.id === itemId
          ? { ...entry, specialInstructions: instructions }
          : entry
      )
    );
  };

  const removeItem = (itemId) => {
    setItems(prev => prev.filter(entry => entry.item.id !== itemId));
  };

  const clearCart = () => {
    setItems([]);
    setOrderNotes('');
    localStorage.removeItem(STORAGE_KEY_CART);
    localStorage.removeItem(STORAGE_KEY_NOTES);
  };

  const getItemQuantity = (itemId) => {
    const found = items.find(i => i.item.id === itemId);
    return found ? found.quantity : 0;
  };

  // Calculations
  const totalCount = items.reduce((sum, entry) => sum + entry.quantity, 0);
  const subtotal = items.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0);
  const gst = Math.round(subtotal * MOCK_RESTAURANT.gstRate);
  const grandTotal = subtotal + gst;

  return (
    <CartContext.Provider
      value={{
        items,
        orderNotes,
        setOrderNotes,
        addItem,
        updateQuantity,
        setItemQuantity,
        updateInstructions,
        removeItem,
        clearCart,
        getItemQuantity,
        totalCount,
        subtotal,
        gst,
        grandTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

