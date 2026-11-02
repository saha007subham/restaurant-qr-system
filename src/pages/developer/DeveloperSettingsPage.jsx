import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Building2, Star, ShieldCheck, Check, ExternalLink, Plus, Save, Coffee, Globe } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

export const DeveloperSettingsPage = () => {
  const { restaurant, updateRestaurantSettings, clients, activeClientId, setActiveClientId, addClientTenant } = useRestaurant();

  const [formData, setFormData] = useState({
    name: restaurant.name || '',
    tagline: restaurant.tagline || '',
    location: restaurant.location || '',
    phone: restaurant.phone || '',
    hours: restaurant.hours || '',
    gstRate: restaurant.gstRate || 0.05,
    googleReviewUrl: restaurant.googleReviewUrl || ''
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [clientData, setClientData] = useState({ name: '', city: '', plan: 'Pro Tier' });

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateRestaurantSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleAddClient = (e) => {
    e.preventDefault();
    if (!clientData.name || !clientData.city) return;
    addClientTenant(clientData);
    setClientData({ name: '', city: '', plan: 'Pro Tier' });
    setIsClientModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#A86C3E] block">
          Platform Architecture
        </span>
        <h1 className="font-serif font-bold text-2xl text-[#312219]">
          Restaurant Branding & Multi-Client Settings
        </h1>
        <p className="text-xs text-[#5B5146] mt-0.5">
          Configure branding attributes, review writing redirects, and future restaurant tenant architecture.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Section 1: Branding & Profile */}
        <div className="bg-white rounded-3xl p-6 border border-[#67523C]/15 shadow-cafe-sm space-y-4">
          <div className="flex items-center space-x-2 text-[#312219] pb-2 border-b border-[#67523C]/10">
            <Coffee className="w-5 h-5 text-[#67523C]" />
            <h3 className="font-serif font-bold text-lg">Restaurant Branding & Identity</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#5B5146] mb-1">Establishment Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#67523C]/20 bg-[#FAF7F0] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5B5146] mb-1">Brand Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#67523C]/20 bg-[#FAF7F0] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#5B5146] mb-1">Physical Address</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#67523C]/20 bg-[#FAF7F0] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5B5146] mb-1">Contact Telephone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#67523C]/20 bg-[#FAF7F0] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5B5146] mb-1">Service & Operating Hours</label>
            <input
              type="text"
              value={formData.hours}
              onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#67523C]/20 bg-[#FAF7F0] outline-none"
            />
          </div>
        </div>

        {/* Section 2: Google Review Redirect Configuration */}
        <div className="bg-white rounded-3xl p-6 border border-[#67523C]/15 shadow-cafe-sm space-y-4">
          <div className="flex items-center space-x-2 text-[#A86C3E] pb-2 border-b border-[#67523C]/10">
            <Star className="w-5 h-5 fill-current" />
            <h3 className="font-serif font-bold text-lg text-[#312219]">Google Review URL Configuration</h3>
          </div>

          <p className="text-xs text-[#5B5146] leading-relaxed">
            Specify the official Google Business review-writing link for this establishment. When customers tap <strong>"Write a Review"</strong> on the welcome page, this exact link is opened in a new tab.
          </p>

          <div>
            <label className="block text-xs font-semibold text-[#5B5146] mb-1">Target Google Review Link</label>
            <div className="flex gap-2">
              <input
                type="url"
                required
                value={formData.googleReviewUrl}
                onChange={(e) => setFormData({ ...formData, googleReviewUrl: e.target.value })}
                placeholder="https://search.google.com/local/writereview?placeid=..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#67523C]/20 bg-[#FAF7F0] font-mono text-[#312219] outline-none"
              />
              <a
                href={formData.googleReviewUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl border border-[#67523C]/20 hover:bg-[#FAF7F0] text-xs font-semibold text-[#67523C] flex items-center space-x-1 shrink-0"
              >
                <span>Test Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="bg-[#FAF7F0] p-3 rounded-xl border border-[#67523C]/10 flex items-start space-x-2 text-[11px] text-[#5B5146]">
            <ShieldCheck className="w-4 h-4 text-[#3F6E4D] shrink-0 mt-0.5" />
            <span>
              <strong>Review Policy:</strong> In full compliance with specifications, this link directly opens Google's native review screen. No fake reviews are generated and no review gating or incentives are applied.
            </span>
          </div>
        </div>

        {/* Section 3: Tax & Currency */}
        <div className="bg-white rounded-3xl p-6 border border-[#67523C]/15 shadow-cafe-sm space-y-4">
          <div className="flex items-center space-x-2 text-[#312219] pb-2 border-b border-[#67523C]/10">
            <Globe className="w-5 h-5 text-[#67523C]" />
            <h3 className="font-serif font-bold text-lg">Currency & Tax Rates</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#5B5146] mb-1">Currency Code</label>
              <input
                type="text"
                disabled
                value="INR (Indian Rupee - ₹)"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#67523C]/10 bg-[#D2C6A6]/20 font-semibold text-[#5B5146] cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5B5146] mb-1">GST Tax Rate</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="0.28"
                value={formData.gstRate}
                onChange={(e) => setFormData({ ...formData, gstRate: parseFloat(e.target.value) || 0.05 })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#67523C]/20 bg-[#FAF7F0] outline-none"
              />
              <span className="text-[10px] text-[#5B5146] mt-0.5 block">0.05 = 5% Indian Restaurant GST</span>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-[#67523C]/15 shadow-cafe-sm">
          {savedSuccess ? (
            <span className="text-xs font-bold text-[#3F6E4D] flex items-center space-x-1.5">
              <Check className="w-4 h-4" />
              <span>Settings updated successfully!</span>
            </span>
          ) : (
            <span className="text-xs text-[#5B5146]">
              All changes apply immediately across customer, staff, and developer interfaces.
            </span>
          )}

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#67523C] hover:bg-[#493725] text-white text-xs font-bold flex items-center space-x-2 shadow-cafe-sm transition"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>

      {/* Section 4: Future Restaurant Clients Configuration */}
      <div className="bg-white rounded-3xl p-6 border border-[#67523C]/15 shadow-cafe-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#67523C]/10">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-[#67523C]" />
            <h3 className="font-serif font-bold text-lg text-[#312219]">Future Restaurant Clients Architecture</h3>
          </div>

          <button
            type="button"
            onClick={() => setIsClientModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-[#FAF7F0] hover:bg-[#D2C6A6]/30 border border-[#67523C]/20 text-xs font-semibold text-[#67523C] flex items-center space-x-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Onboard Client Profile</span>
          </button>
        </div>

        <p className="text-xs text-[#5B5146] leading-relaxed">
          Manage future restaurant client tenants within this unified architecture. Each client maintains isolated menus, unique table QR tokens, and role authorizations.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {clients.map(c => {
            const isActive = c.id === activeClientId;

            return (
              <div
                key={c.id}
                onClick={() => setActiveClientId(c.id)}
                className={`p-4 rounded-2xl border text-xs cursor-pointer transition flex items-center justify-between ${
                  isActive
                    ? 'bg-[#FAF7F0] border-[#67523C] ring-2 ring-[#67523C]/10'
                    : 'bg-white hover:bg-[#FAF7F0]/40 border-[#67523C]/15'
                }`}
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-[#312219]">{c.name}</span>
                    {isActive && (
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-[#67523C] text-white">
                        Active
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#5B5146]">
                    {c.city} • {c.plan}
                  </span>
                </div>

                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  c.status === 'active' ? 'bg-[#3F6E4D]/10 text-[#3F6E4D]' : 'bg-[#A86C3E]/10 text-[#A86C3E]'
                }`}>
                  {c.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ONBOARD CLIENT MODAL */}
      <AnimatePresence>
        {isClientModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FAF7F0] w-full max-w-sm rounded-3xl p-6 border border-[#67523C]/20 shadow-cafe-lg text-[#312219]"
            >
              <h3 className="font-serif font-bold text-lg mb-2">Onboard Future Restaurant Client</h3>
              <form onSubmit={handleAddClient} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5B5146] mb-1">Client Business Name</label>
                  <input
                    type="text"
                    required
                    value={clientData.name}
                    onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                    placeholder="e.g. Bistro Nouveau"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#67523C]/20 bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5B5146] mb-1">City / Region</label>
                  <input
                    type="text"
                    required
                    value={clientData.city}
                    onChange={(e) => setClientData({ ...clientData, city: e.target.value })}
                    placeholder="e.g. Mumbai, Maharashtra"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#67523C]/20 bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5B5146] mb-1">Subscription Plan</label>
                  <select
                    value={clientData.plan}
                    onChange={(e) => setClientData({ ...clientData, plan: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#67523C]/20 bg-white outline-none"
                  >
                    <option value="Pro Tier">Pro Tier</option>
                    <option value="Enterprise">Enterprise</option>
                    <option value="Multi-Location Franchise">Multi-Location Franchise</option>
                  </select>
                </div>
                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsClientModalOpen(false)}
                    className="flex-1 py-2 rounded-xl border border-[#67523C]/20 text-xs font-semibold text-[#5B5146]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-[#67523C] hover:bg-[#493725] text-white text-xs font-semibold transition"
                  >
                    Onboard Client
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

