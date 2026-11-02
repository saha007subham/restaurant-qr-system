import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Coffee, Bell, Clock, History, LogOut, KeyRound, ShieldAlert, User, ExternalLink, ChevronDown, PackageCheck } from 'lucide-react';
import { useStaffAuth } from '../../context/StaffAuthContext';
import { useOrders } from '../../context/OrderContext';
import { useRestaurant } from '../../context/RestaurantContext';
import { StaffCredentialsModal } from '../staff/StaffCredentialsModal';

export const StaffLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { staffUser, logout } = useStaffAuth();
  const { orders } = useOrders();
  const { menuItems } = useRestaurant();
  const [isCredModalOpen, setIsCredModalOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const activeOrdersCount = orders.filter(o => ['received', 'preparing', 'ready', 'served'].includes(o.status)).length;
  const receivedOrdersCount = orders.filter(o => o.status === 'received').length;
  const outOfStockCount = menuItems.filter(i => i.isAvailable === false).length;

  const handleLogout = () => {
    logout();
    navigate('/staff/login');
  };

  return (
    <div className="min-h-screen bg-[#F5EFE4] text-[#5B5146] flex flex-col font-sans">
      {/* Top Operations Header */}
      <header className="sticky top-0 z-40 bg-[#FAF7F0] border-b border-[#67523C]/15 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo & Portal Badge */}
          <div className="flex items-center space-x-3">
            <Link to="/staff/orders" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#67523C] text-[#F5EFE4] flex items-center justify-center shadow-cafe-sm">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-serif font-bold text-base text-[#312219] leading-tight">
                    Café Rustique
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#67523C] text-[#F5EFE4]">
                    Staff Ops
                  </span>
                </div>
                <span className="text-[10px] text-[#A86C3E] font-medium block">
                  Orders & Kitchen Stock Station
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links for Desktop/Tablet */}
          <nav className="hidden sm:flex items-center space-x-1 bg-[#D2C6A6]/30 p-1 rounded-xl border border-[#67523C]/15">
            <Link
              to="/staff/orders"
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                location.pathname === '/staff/orders' || location.pathname === '/staff/dashboard'
                  ? 'bg-[#67523C] text-[#F5EFE4] shadow-xs'
                  : 'text-[#5B5146] hover:text-[#312219]'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Live Orders</span>
              {activeOrdersCount > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  receivedOrdersCount > 0 ? 'bg-[#98382B] text-white animate-pulse' : 'bg-[#D2C6A6] text-[#312219]'
                }`}>
                  {activeOrdersCount}
                </span>
              )}
            </Link>

            {/* NEW: Stock Availability & 86'd Items */}
            <Link
              to="/staff/stock"
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                location.pathname === '/staff/stock'
                  ? 'bg-[#67523C] text-[#F5EFE4] shadow-xs'
                  : 'text-[#5B5146] hover:text-[#312219]'
              }`}
            >
              <PackageCheck className="w-3.5 h-3.5" />
              <span>Stock Status</span>
              {outOfStockCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#98382B] text-white">
                  {outOfStockCount} 86'd
                </span>
              )}
            </Link>

            <Link
              to="/staff/history"
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                location.pathname === '/staff/history'
                  ? 'bg-[#67523C] text-[#F5EFE4] shadow-xs'
                  : 'text-[#5B5146] hover:text-[#312219]'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Order History</span>
            </Link>
          </nav>

          {/* Right Action & Profile Area */}
          <div className="flex items-center space-x-2">
            {/* View Diner App (Helpful for quick verification) */}
            <Link
              to="/welcome"
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border border-[#67523C]/20 hover:bg-[#D2C6A6]/30 text-xs font-medium text-[#67523C] transition"
              title="Open customer view in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Customer View</span>
            </Link>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-1.5 pl-2.5 rounded-xl border border-[#67523C]/15 hover:bg-[#D2C6A6]/20 transition"
              >
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-bold text-[#312219] block leading-tight">
                    {staffUser?.name || 'Staff Member'}
                  </span>
                  <span className="text-[10px] text-[#A86C3E] block">
                    Floor & Kitchen Staff
                  </span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-[#67523C] text-[#F5EFE4] flex items-center justify-center font-bold text-xs shadow-xs">
                  {staffUser?.avatar || 'ST'}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#5B5146]" />
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-[#FAF7F0] border border-[#67523C]/20 rounded-2xl p-2 shadow-cafe-lg z-50 text-xs text-[#312219]">
                  <div className="p-2 border-b border-[#67523C]/10 mb-1">
                    <span className="font-bold block">{staffUser?.name}</span>
                    <span className="text-[11px] text-[#5B5146] font-mono">{staffUser?.email}</span>
                    <span className="inline-block mt-1 text-[10px] font-semibold text-[#A86C3E] bg-[#D2C6A6]/40 px-2 py-0.5 rounded">
                      Role: Staff (Orders & Stock Control)
                    </span>
                  </div>

                  <Link
                    to="/staff/stock"
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#D2C6A6]/30 flex items-center space-x-2 text-[#312219] transition"
                  >
                    <PackageCheck className="w-3.5 h-3.5 text-[#67523C]" />
                    <span>Manage Stock (In / 86'd)</span>
                  </Link>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setIsCredModalOpen(true);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#D2C6A6]/30 flex items-center space-x-2 text-[#312219] transition"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-[#67523C]" />
                    <span>Manage Password</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#98382B]/10 flex items-center space-x-2 text-[#98382B] transition font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="sm:hidden border-t border-[#67523C]/10 px-3 py-2 flex items-center space-x-1.5 bg-[#F5EFE4]">
          <Link
            to="/staff/orders"
            className={`flex-1 flex items-center justify-center space-x-1 py-1.5 rounded-xl text-[11px] font-semibold ${
              location.pathname === '/staff/orders' || location.pathname === '/staff/dashboard'
                ? 'bg-[#67523C] text-[#F5EFE4]'
                : 'bg-white text-[#5B5146] border border-[#67523C]/15'
            }`}
          >
            <Bell className="w-3 h-3" />
            <span>Orders</span>
            {activeOrdersCount > 0 && (
              <span className="ml-0.5 px-1 py-0.2 rounded-full text-[9px] bg-[#98382B] text-white">
                {activeOrdersCount}
              </span>
            )}
          </Link>

          <Link
            to="/staff/stock"
            className={`flex-1 flex items-center justify-center space-x-1 py-1.5 rounded-xl text-[11px] font-semibold ${
              location.pathname === '/staff/stock'
                ? 'bg-[#67523C] text-[#F5EFE4]'
                : 'bg-white text-[#5B5146] border border-[#67523C]/15'
            }`}
          >
            <PackageCheck className="w-3 h-3" />
            <span>Stock</span>
            {outOfStockCount > 0 && (
              <span className="ml-0.5 px-1 py-0.2 rounded-full text-[9px] bg-[#98382B] text-white">
                {outOfStockCount}
              </span>
            )}
          </Link>

          <Link
            to="/staff/history"
            className={`flex-1 flex items-center justify-center space-x-1 py-1.5 rounded-xl text-[11px] font-semibold ${
              location.pathname === '/staff/history'
                ? 'bg-[#67523C] text-[#F5EFE4]'
                : 'bg-white text-[#5B5146] border border-[#67523C]/15'
            }`}
          >
            <History className="w-3 h-3" />
            <span>History</span>
          </Link>
        </div>
      </header>

      {/* Main Staff Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6">
        <Outlet />
      </main>

      {/* Manage Credentials Modal */}
      <StaffCredentialsModal
        isOpen={isCredModalOpen}
        onClose={() => setIsCredModalOpen(false)}
      />
    </div>
  );
};
