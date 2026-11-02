import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, Shield, ShieldCheck, ShieldAlert, Edit, Trash2, KeyRound, Check, XCircle, CheckCircle2 } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

const AVAILABLE_ROLES = [
  { id: 'floor_captain', label: 'Floor Captain & Barista Lead', desc: 'Can take orders, fulfill drinks, and manage floor' },
  { id: 'chef_lead', label: 'Kitchen Sous Chef', desc: 'Can manage kitchen prep, accept/reject, mark ready' },
  { id: 'runner', label: 'Table Runner & Service', desc: 'Can mark orders served at tables' },
  { id: 'shift_manager', label: 'Shift Supervisor', desc: 'Floor supervisor with order management access' }
];

export const DeveloperStaffPage = () => {
  const { staffList, addStaffAccount, updateStaffRole, toggleStaffStatus, deleteStaffAccount } = useRestaurant();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'floor_captain',
    phone: '+91 '
  });

  const handleOpenAdd = () => {
    setFormData({ name: '', email: '', role: 'floor_captain', phone: '+91 98450 ' });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    const matchedRole = AVAILABLE_ROLES.find(r => r.id === formData.role);
    addStaffAccount({
      name: formData.name,
      email: formData.email,
      role: formData.role,
      phone: formData.phone
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#A86C3E] block">
            Access Governance
          </span>
          <h1 className="font-serif font-bold text-2xl text-[#312219]">
            Authorized Staff Accounts & Roles
          </h1>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-3.5 py-2 rounded-xl bg-[#67523C] hover:bg-[#493725] text-white text-xs font-semibold flex items-center space-x-1.5 shadow-cafe-sm transition"
        >
          <UserPlus className="w-4 h-4" />
          <span>Authorize Staff Member</span>
        </button>
      </div>

      {/* Security Boundary Notice */}
      <div className="bg-[#FAF7F0] p-4 rounded-3xl border border-[#67523C]/15 flex items-start space-x-3 text-xs text-[#5B5146]">
        <ShieldCheck className="w-5 h-5 text-[#3F6E4D] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Enforced RBAC Guardrail:</strong> Accounts authorized here are granted access strictly to the restricted restaurant staff station (`/staff/orders`). They are isolated by design and cannot view developer settings, edit menu items, adjust prices, or export customer data.
        </p>
      </div>

      {/* Staff Accounts Table */}
      <div className="bg-white rounded-3xl border border-[#67523C]/15 shadow-cafe-sm overflow-hidden">
        <div className="p-5 border-b border-[#67523C]/10 flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-[#312219]">
            Active Staff Crew ({staffList.length})
          </h3>
          <span className="text-xs text-[#5B5146]">
            {staffList.filter(s => s.isActive).length} currently active
          </span>
        </div>

        <div className="divide-y divide-[#67523C]/10 overflow-x-auto">
          {staffList.map(member => (
            <div key={member.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF7F0]/50 transition">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#67523C] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-[#312219]">{member.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      member.isActive ? 'bg-[#3F6E4D]/10 text-[#3F6E4D]' : 'bg-[#98382B]/10 text-[#98382B]'
                    }`}>
                      {member.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </div>
                  <div className="text-xs text-[#5B5146] flex flex-wrap items-center gap-x-2 mt-0.5 font-mono">
                    <span>{member.email}</span>
                    <span>•</span>
                    <span>{member.phone}</span>
                  </div>
                </div>
              </div>

              {/* Role selector & Status toggles */}
              <div className="flex items-center space-x-3">
                <select
                  value={member.role}
                  onChange={(e) => {
                    const r = AVAILABLE_ROLES.find(x => x.id === e.target.value);
                    updateStaffRole(member.id, e.target.value, r?.label || 'Staff');
                  }}
                  className="px-2.5 py-1.5 rounded-xl border border-[#67523C]/20 bg-[#FAF7F0] text-xs font-semibold text-[#312219] outline-none cursor-pointer"
                >
                  {AVAILABLE_ROLES.map(r => (
                    <option key={r.id} value={r.id}>{r.label}</option>
                  ))}
                </select>

                <button
                  onClick={() => toggleStaffStatus(member.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                    member.isActive
                      ? 'border-[#98382B]/30 text-[#98382B] hover:bg-[#98382B]/10'
                      : 'border-[#3F6E4D]/30 text-[#3F6E4D] hover:bg-[#3F6E4D]/10'
                  }`}
                >
                  {member.isActive ? 'Suspend' : 'Activate'}
                </button>

                <button
                  onClick={() => deleteStaffAccount(member.id)}
                  className="p-1.5 rounded-xl border border-[#98382B]/20 text-[#98382B] hover:bg-[#98382B]/10 transition"
                  title="Revoke and delete staff account"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AUTHORIZE STAFF MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FAF7F0] w-full max-w-sm rounded-3xl p-6 border border-[#67523C]/20 shadow-cafe-lg text-[#312219]"
            >
              <h3 className="font-serif font-bold text-xl mb-3">
                Authorize New Staff Member
              </h3>
              <form onSubmit={handleSave} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5B5146] mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Priya Nair"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#67523C]/20 bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5B5146] mb-1">Staff Email (Login ID)</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="priya@rustique.com"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#67523C]/20 bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5B5146] mb-1">Assigned Operational Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#67523C]/20 bg-white outline-none"
                  >
                    {AVAILABLE_ROLES.map(r => (
                      <option key={r.id} value={r.id}>{r.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5B5146] mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98450 12345"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#67523C]/20 bg-white outline-none"
                  />
                </div>
                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2 rounded-xl border border-[#67523C]/20 text-xs font-semibold text-[#5B5146]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-[#67523C] hover:bg-[#493725] text-white text-xs font-semibold transition"
                  >
                    Authorize Account
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

