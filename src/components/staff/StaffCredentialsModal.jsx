import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, KeyRound, Lock, Check, ShieldAlert, User, CheckCircle2 } from 'lucide-react';
import { useStaffAuth } from '../../context/StaffAuthContext';

export const StaffCredentialsModal = ({ isOpen, onClose }) => {
  const { staffUser, updateCredentials } = useStaffAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen || !staffUser) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!currentPassword) {
      setError('Please enter your current password.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    const res = updateCredentials(currentPassword, newPassword);
    if (res.success) {
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } else {
      setError(res.error || 'Failed to update credentials.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-[#FAF7F0] w-full max-w-md rounded-3xl p-6 shadow-cafe-lg border border-[#67523C]/20 text-[#312219] relative"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#67523C] text-[#F5EFE4] flex items-center justify-center shadow-cafe-sm">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A86C3E]">
                  Account Settings
                </span>
                <h3 className="font-serif font-bold text-xl text-[#312219]">
                  Manage Credentials
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-[#D2C6A6]/30 hover:bg-[#D2C6A6]/60 text-[#312219] transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Info Capsule */}
          <div className="bg-white rounded-2xl p-3.5 border border-[#67523C]/10 mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-full bg-[#D2C6A6]/40 text-[#67523C] font-bold flex items-center justify-center text-xs">
                {staffUser.avatar}
              </div>
              <div>
                <span className="font-bold text-xs text-[#312219] block">{staffUser.name}</span>
                <span className="text-[11px] text-[#5B5146] font-mono">{staffUser.email}</span>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#67523C]/10 text-[#67523C] border border-[#67523C]/20">
              Staff Member
            </span>
          </div>

          {/* Role Boundary Notice */}
          <div className="bg-[#D2C6A6]/20 border border-[#67523C]/15 rounded-xl p-3 mb-4 flex items-start space-x-2.5">
            <ShieldAlert className="w-4 h-4 text-[#A86C3E] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#5B5146] leading-tight">
              Staff members can update their own login password. Role modifications and privilege upgrades require developer authorization.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#5B5146] mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#67523C]/20 bg-white text-[#312219] outline-none focus:border-[#67523C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5B5146] mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#67523C]/20 bg-white text-[#312219] outline-none focus:border-[#67523C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5B5146] mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#67523C]/20 bg-white text-[#312219] outline-none focus:border-[#67523C]"
              />
            </div>

            {error && (
              <p className="text-xs text-[#98382B] font-medium bg-[#98382B]/10 p-2 rounded-lg">
                {error}
              </p>
            )}

            {success && (
              <p className="text-xs text-[#3F6E4D] font-bold bg-[#3F6E4D]/10 p-2 rounded-lg flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Password updated successfully!</span>
              </p>
            )}

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-[#67523C]/20 text-xs font-semibold text-[#5B5146] hover:bg-[#D2C6A6]/20 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#67523C] hover:bg-[#493725] text-[#F5EFE4] text-xs font-semibold transition shadow-cafe-sm"
              >
                Update Password
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

