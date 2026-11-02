import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  UtensilsCrossed, 
  QrCode, 
  Users, 
  Database, 
  Settings, 
  ExternalLink, 
  TrendingUp, 
  CheckCircle2, 
  ShieldCheck, 
  Star, 
  Plus, 
  ArrowRight,
  FileSpreadsheet
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useOrders } from '../../context/OrderContext';

export const DeveloperDashboardPage = () => {
  const navigate = useNavigate();
  const { restaurant, menuItems, categories, tables, staffList, customers, exportCustomersCSV, clients } = useRestaurant();
  const { orders } = useOrders();

  const totalMenuItems = menuItems.length;
  const availableItems = menuItems.filter(i => i.isAvailable !== false).length;
  const activeTables = tables.filter(t => t.isActive).length;
  const activeStaff = staffList.filter(s => s.isActive).length;

  const totalDiners = customers.length;
  const consentedDiners = customers.filter(c => c.whatsappConsent).length;
  const consentRate = totalDiners > 0 ? Math.round((consentedDiners / totalDiners) * 100) : 0;

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#FAF7F0] p-6 rounded-3xl border border-[#67523C]/15 shadow-cafe-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#67523C] text-white">
              Developer Architecture
            </span>
            <span className="text-xs text-[#5B5146] font-medium">
              Client: <strong>{restaurant.name}</strong>
            </span>
          </div>
          <h1 className="font-serif font-bold text-2xl text-[#312219] mt-1">
            System Control & Client Administration
          </h1>
          <p className="text-xs text-[#5B5146] mt-0.5">
            Full authority over menus, table QR tokens, staff roles, and future client configurations.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportCustomersCSV}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#67523C]/20 text-xs font-semibold text-[#67523C] hover:bg-[#FAF7F0] transition flex items-center space-x-1.5 shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#3F6E4D]" />
            <span>Export Consent CSV</span>
          </button>
          <Link
            to="/developer/menu"
            className="px-4 py-2 rounded-xl bg-[#67523C] hover:bg-[#493725] text-white text-xs font-semibold transition flex items-center space-x-1.5 shadow-cafe-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Menu Item</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Menu Offerings */}
        <div
          onClick={() => navigate('/developer/menu')}
          className="bg-white rounded-3xl p-5 border border-[#67523C]/15 shadow-cafe-sm hover:shadow-cafe transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#67523C] mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Menu Offerings</span>
            <UtensilsCrossed className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </div>
          <span className="font-serif font-bold text-3xl text-[#312219] block">
            {totalMenuItems}
          </span>
          <span className="text-xs text-[#5B5146] mt-1 block">
            {availableItems} active • {categories.length} categories
          </span>
        </div>

        {/* Tables & QR Tokens */}
        <div
          onClick={() => navigate('/developer/qr-codes')}
          className="bg-white rounded-3xl p-5 border border-[#67523C]/15 shadow-cafe-sm hover:shadow-cafe transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#A86C3E] mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Floor Tables</span>
            <QrCode className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </div>
          <span className="font-serif font-bold text-3xl text-[#312219] block">
            {tables.length}
          </span>
          <span className="text-xs text-[#5B5146] mt-1 block">
            {activeTables} QR tokens active & verified
          </span>
        </div>

        {/* Authorized Staff */}
        <div
          onClick={() => navigate('/developer/staff')}
          className="bg-white rounded-3xl p-5 border border-[#67523C]/15 shadow-cafe-sm hover:shadow-cafe transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#3F6E4D] mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Authorized Staff</span>
            <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </div>
          <span className="font-serif font-bold text-3xl text-[#312219] block">
            {staffList.length}
          </span>
          <span className="text-xs text-[#5B5146] mt-1 block">
            {activeStaff} floor & kitchen crew
          </span>
        </div>

        {/* WhatsApp Consent Rate */}
        <div
          onClick={() => navigate('/developer/customers')}
          className="bg-white rounded-3xl p-5 border border-[#67523C]/15 shadow-cafe-sm hover:shadow-cafe transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#A86C3E] mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">WhatsApp Consent</span>
            <Database className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </div>
          <span className="font-serif font-bold text-3xl text-[#3F6E4D] block">
            {consentRate}%
          </span>
          <span className="text-xs text-[#5B5146] mt-1 block">
            {consentedDiners} of {totalDiners} opted-in diners
          </span>
        </div>
      </div>

      {/* Main Grid: Management Shortcuts & Future Clients Setup */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Quick Modules */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-serif font-bold text-lg text-[#312219]">
            Architecture & Management Hub
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Menu Engineering Card */}
            <div
              onClick={() => navigate('/developer/menu')}
              className="bg-white rounded-3xl p-5 border border-[#67523C]/15 shadow-cafe-sm hover:shadow-cafe transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#67523C] text-white flex items-center justify-center mb-3">
                  <UtensilsCrossed className="w-5 h-5 text-[#D2C6A6]" />
                </div>
                <h3 className="font-serif font-bold text-base text-[#312219]">
                  Menu & Pricing Engineering
                </h3>
                <p className="text-xs text-[#5B5146] mt-1 leading-relaxed">
                  Add culinary categories, edit dishes, update INR prices, manage inventory availability, and upload imagery.
                </p>
              </div>
              <div className="pt-4 flex items-center justify-between text-xs font-semibold text-[#67523C]">
                <span>Manage Offerings</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* QR Codes Card */}
            <div
              onClick={() => navigate('/developer/qr-codes')}
              className="bg-white rounded-3xl p-5 border border-[#67523C]/15 shadow-cafe-sm hover:shadow-cafe transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#312219] text-[#D2C6A6] flex items-center justify-center mb-3">
                  <QrCode className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-base text-[#312219]">
                  Unique Table QR Generator
                </h3>
                <p className="text-xs text-[#5B5146] mt-1 leading-relaxed">
                  Generate, regenerate, and download high-resolution QR codes formatted for table stands with unpredictable secure tokens.
                </p>
              </div>
              <div className="pt-4 flex items-center justify-between text-xs font-semibold text-[#67523C]">
                <span>Generate QR Codes</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Staff Governance Card */}
            <div
              onClick={() => navigate('/developer/staff')}
              className="bg-white rounded-3xl p-5 border border-[#67523C]/15 shadow-cafe-sm hover:shadow-cafe transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#D2C6A6]/40 text-[#67523C] flex items-center justify-center mb-3">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-base text-[#312219]">
                  Staff Roles & Permissions
                </h3>
                <p className="text-xs text-[#5B5146] mt-1 leading-relaxed">
                  Grant and revoke floor access, assign kitchen roles, and ensure staff cannot breach developer boundaries.
                </p>
              </div>
              <div className="pt-4 flex items-center justify-between text-xs font-semibold text-[#67523C]">
                <span>Manage Staff</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Diner Records & Marketing Consent */}
            <div
              onClick={() => navigate('/developer/customers')}
              className="bg-white rounded-3xl p-5 border border-[#67523C]/15 shadow-cafe-sm hover:shadow-cafe transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#3F6E4D]/20 text-[#3F6E4D] flex items-center justify-center mb-3">
                  <Database className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-base text-[#312219]">
                  Diner Data & WhatsApp Consent
                </h3>
                <p className="text-xs text-[#5B5146] mt-1 leading-relaxed">
                  View phone logs, inspect explicit opt-in timestamps with version tracking, and export compliant CSV datasets.
                </p>
              </div>
              <div className="pt-4 flex items-center justify-between text-xs font-semibold text-[#67523C]">
                <span>Inspect Diner Logs</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Tenant Architecture & Review URL Configuration */}
        <div className="space-y-4">
          <h2 className="font-serif font-bold text-lg text-[#312219]">
            Client & Review Setup
          </h2>

          {/* Google Review Config Preview */}
          <div className="bg-white rounded-3xl p-5 border border-[#67523C]/15 shadow-cafe-sm space-y-3">
            <div className="flex items-center space-x-2 text-[#A86C3E]">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Google Review URL
              </span>
            </div>
            <p className="text-xs text-[#5B5146] leading-relaxed">
              Configured target URL triggered when customers click "Write a Review":
            </p>
            <div className="bg-[#FAF7F0] p-2.5 rounded-xl border border-[#67523C]/10 text-[11px] font-mono text-[#312219] break-all">
              {restaurant.googleReviewUrl}
            </div>
            <Link
              to="/developer/settings"
              className="text-xs text-[#67523C] hover:text-[#312219] font-semibold underline block pt-1"
            >
              Edit Review Link in Settings →
            </Link>
          </div>

          {/* Multi-Tenant Readiness */}
          <div className="bg-white rounded-3xl p-5 border border-[#67523C]/15 shadow-cafe-sm space-y-3">
            <div className="flex items-center space-x-2 text-[#312219]">
              <ShieldCheck className="w-4 h-4 text-[#3F6E4D]" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Multi-Restaurant Scale
              </span>
            </div>
            <p className="text-xs text-[#5B5146] leading-relaxed">
              Pre-configured for future restaurant clients with isolated table tokens, custom branding, and independent menus.
            </p>
            <div className="space-y-2 pt-1">
              {clients.map(c => (
                <div key={c.id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-[#FAF7F0] border border-[#67523C]/10">
                  <div>
                    <span className="font-semibold text-[#312219] block">{c.name}</span>
                    <span className="text-[10px] text-[#5B5146]">{c.city} • {c.plan}</span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    c.status === 'active' ? 'bg-[#3F6E4D]/10 text-[#3F6E4D]' : 'bg-[#A86C3E]/10 text-[#A86C3E]'
                  }`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

