import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Terminal, 
  LayoutDashboard, 
  UtensilsCrossed, 
  MapPin, 
  QrCode, 
  Users, 
  Database, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ExternalLink, 
  Building2, 
  ShieldCheck 
} from 'lucide-react';
import { useDeveloperAuth } from '../../context/DeveloperAuthContext';
import { useRestaurant } from '../../context/RestaurantContext';

export const DeveloperLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { devUser, logout } = useDeveloperAuth();
  const { clients, activeClientId, setActiveClientId, restaurant } = useRestaurant();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Overview', path: '/developer/dashboard', icon: LayoutDashboard },
    { label: 'Menu & Categories', path: '/developer/menu', icon: UtensilsCrossed },
    { label: 'Tables Management', path: '/developer/tables', icon: MapPin },
    { label: 'QR Code Generator', path: '/developer/qr-codes', icon: QrCode },
    { label: 'Staff Roles & Access', path: '/developer/staff', icon: Users },
    { label: 'Diners & WhatsApp Consent', path: '/developer/customers', icon: Database },
    { label: 'Branding & Client Setup', path: '/developer/settings', icon: Settings }
  ];

  const handleLogout = () => {
    logout();
    navigate('/developer/login');
  };

  return (
    <div className="min-h-screen bg-[#F5EFE4] text-[#5B5146] flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <header className="md:hidden bg-[#312219] text-[#F5EFE4] px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#67523C] flex items-center justify-center text-[#D2C6A6]">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <span className="font-serif font-bold text-sm text-[#FAF7F0] block leading-tight">
              Developer Suite
            </span>
            <span className="text-[10px] text-[#D2C6A6]">Café Rustique</span>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg bg-white/10 text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar for Desktop & Mobile drawer */}
      <aside
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-[#312219] text-[#F5EFE4] flex-shrink-0 flex flex-col justify-between p-4 md:sticky md:top-0 md:h-screen z-40`}
      >
        <div>
          {/* Brand & Developer Identity */}
          <div className="pb-5 border-b border-white/10 mb-4 hidden md:block">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#67523C] text-[#D2C6A6] flex items-center justify-center shadow-sm">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-base text-[#FAF7F0] leading-tight">
                  Developer Suite
                </h2>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-[#3F6E4D]" />
                  <span className="text-[10px] font-semibold text-[#D2C6A6] uppercase tracking-wider">
                    Full Admin Privileges
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Tenant / Client Selector */}
          <div className="bg-white/5 rounded-2xl p-2.5 border border-white/10 mb-4">
            <span className="text-[9px] uppercase font-bold tracking-wider text-[#D2C6A6] block mb-1">
              Active Client Profile
            </span>
            <div className="flex items-center space-x-2 text-xs">
              <Building2 className="w-3.5 h-3.5 text-[#D4A373] shrink-0" />
              <select
                value={activeClientId}
                onChange={(e) => setActiveClientId(e.target.value)}
                className="w-full bg-transparent text-white text-xs font-semibold outline-none cursor-pointer"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id} className="bg-[#312219] text-white">
                    {c.name} ({c.status})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                    isActive
                      ? 'bg-[#67523C] text-white font-semibold shadow-xs'
                      : 'text-[#D2C6A6]/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4A373]' : 'text-[#D2C6A6]/60'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Other Views & Logout */}
        <div className="pt-4 border-t border-white/10 space-y-2 mt-4">
          <div className="flex items-center justify-between text-[11px] text-[#D2C6A6]/80 px-2 py-1">
            <span>Diner Interface:</span>
            <Link
              to="/welcome"
              target="_blank"
              rel="noreferrer"
              className="text-white hover:underline flex items-center space-x-1"
            >
              <span>Launch</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#D2C6A6]/80 px-2 py-1">
            <span>Staff Portal:</span>
            <Link
              to="/staff/orders"
              target="_blank"
              rel="noreferrer"
              className="text-white hover:underline flex items-center space-x-1"
            >
              <span>Launch</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <button
            onClick={handleLogout}
            className="w-full mt-2 py-2 px-3 rounded-xl bg-white/5 hover:bg-[#98382B]/20 text-[#D2C6A6] hover:text-[#98382B] text-xs font-semibold flex items-center justify-center space-x-2 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Developer</span>
          </button>
        </div>
      </aside>

      {/* Main Developer Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full">
        <Outlet />
      </main>
    </div>
  );
};

