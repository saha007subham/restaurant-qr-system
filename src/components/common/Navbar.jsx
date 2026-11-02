import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Coffee, ShoppingBag, Gamepad2, MapPin, Sparkles, ChevronDown } from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';
import { useCart } from '../../context/CartContext';
import { MOCK_TABLES } from '../../data/mockTables';

export const Navbar = () => {
  const { table, setTableFromToken } = useCustomer();
  const { totalCount } = useCart();
  const location = useLocation();
  const [showTablePicker, setShowTablePicker] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#F5EFE4]/95 backdrop-blur-md border-b border-[#67523C]/10 transition-all">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo & Table Badge */}
          <div className="flex items-center space-x-3">
            <Link to="/welcome" className="flex items-center space-x-2 group">
              <div className="w-9 h-9 rounded-full bg-[#67523C] text-[#F5EFE4] flex items-center justify-center shadow-cafe-sm transition-transform group-hover:scale-105">
                <Coffee className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-lg leading-tight text-[#312219] tracking-tight">
                  Café Rustique
                </span>
                <span className="text-[10px] text-[#A86C3E] uppercase tracking-wider font-semibold">
                  Artisanal Roastery
                </span>
              </div>
            </Link>
          </div>

          {/* Quick Table Switcher Pill & Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowTablePicker(!showTablePicker)}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#D2C6A6]/40 hover:bg-[#D2C6A6]/70 border border-[#67523C]/15 text-xs text-[#312219] font-medium transition"
              title="Change table for testing"
            >
              <MapPin className="w-3.5 h-3.5 text-[#67523C]" />
              <span className="font-semibold">{table ? table.tableNumber : 'Table'}</span>
              <ChevronDown className="w-3 h-3 text-[#5B5146]" />
            </button>

            {/* Quick Math Game Shortcut */}
            <Link
              to="/game"
              className={`p-2 rounded-full border transition ${
                location.pathname === '/game'
                  ? 'bg-[#67523C] text-[#F5EFE4] border-[#67523C]'
                  : 'bg-[#D2C6A6]/30 text-[#67523C] hover:bg-[#D2C6A6]/60 border-[#67523C]/15'
              }`}
              title="Play Mental Math Game"
            >
              <Gamepad2 className="w-4 h-4" />
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 rounded-full bg-[#67523C] text-[#F5EFE4] hover:bg-[#493725] transition shadow-cafe-sm"
              title="View Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#98382B] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#F5EFE4] animate-pulse">
                  {totalCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Switch Table Dropdown (Helpful for quick QR token testing in Stage 1) */}
      {showTablePicker && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F0] border border-[#67523C]/20 rounded-2xl p-5 w-full max-w-xs shadow-cafe-lg text-[#312219]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif font-bold text-base">Select Table (Testing)</h3>
              <button
                onClick={() => setShowTablePicker(false)}
                className="text-xs text-[#5B5146] hover:text-[#312219] p-1 font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[#5B5146] mb-3">
              Simulate scanning different QR codes placed on physical cafe tables:
            </p>
            <div className="space-y-2">
              {MOCK_TABLES.map(t => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTableFromToken(t.qrToken);
                    setShowTablePicker(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between border transition ${
                    table?.id === t.id
                      ? 'bg-[#67523C] text-white border-[#67523C]'
                      : 'bg-white hover:bg-[#D2C6A6]/30 border-[#67523C]/15 text-[#312219]'
                  }`}
                >
                  <span className="font-semibold">{t.tableNumber}</span>
                  <span className="text-[11px] opacity-80">{t.section}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

