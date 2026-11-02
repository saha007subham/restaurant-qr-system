import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Coffee, Lock, Mail, ArrowRight, ShieldCheck, ShieldAlert, KeyRound, AlertCircle } from 'lucide-react';
import { useStaffAuth } from '../../context/StaffAuthContext';
import { MOCK_RESTAURANT } from '../../data/mockRestaurant';

export const StaffLoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login, authError, setAuthError } = useStaffAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/staff/orders', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleFillDemo = () => {
    setEmail('staff@rustique.com');
    setPassword('staff123');
    setAuthError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setAuthError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    const result = login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/staff/orders');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5EFE4] flex flex-col justify-between p-4 sm:p-6">
      <div className="max-w-md w-full mx-auto my-auto py-8">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-[#67523C] text-[#F5EFE4] flex items-center justify-center shadow-cafe mb-3">
            <Coffee className="w-8 h-8" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#A86C3E] block">
            {MOCK_RESTAURANT.name} Operations
          </span>
          <h1 className="font-serif font-bold text-2xl text-[#312219]">
            Staff Orders Portal
          </h1>
          <p className="text-xs text-[#5B5146] mt-1">
            Restricted live order-fulfillment & table service dashboard
          </p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-[#67523C]/15 shadow-cafe text-[#312219]"
        >
          {/* Quick Demo Autofill Banner */}
          <div className="bg-[#D2C6A6]/25 border border-[#67523C]/15 rounded-2xl p-3 mb-5 flex items-center justify-between">
            <div className="text-xs text-[#5B5146]">
              <span className="font-bold text-[#312219] block">Demo Staff Credentials</span>
              <span className="font-mono text-[11px]">staff@rustique.com • staff123</span>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="px-2.5 py-1.5 rounded-lg bg-[#67523C] hover:bg-[#493725] text-white text-[11px] font-bold transition shadow-xs"
            >
              Auto-fill
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5B5146] mb-1.5">
                Staff Email
              </label>
              <div className="flex items-center rounded-xl border border-[#67523C]/20 bg-[#FAF7F0] px-3.5 py-2.5 focus-within:border-[#67523C] focus-within:ring-2 focus-within:ring-[#67523C]/10 transition">
                <Mail className="w-4 h-4 text-[#5B5146] shrink-0 mr-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="staff@rustique.com"
                  className="w-full bg-transparent text-sm text-[#312219] placeholder-[#5B5146]/40 outline-none"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5B5146] mb-1.5">
                Password
              </label>
              <div className="flex items-center rounded-xl border border-[#67523C]/20 bg-[#FAF7F0] px-3.5 py-2.5 focus-within:border-[#67523C] focus-within:ring-2 focus-within:ring-[#67523C]/10 transition">
                <Lock className="w-4 h-4 text-[#5B5146] shrink-0 mr-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm text-[#312219] placeholder-[#5B5146]/40 outline-none"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            {/* Error message */}
            {authError && (
              <p className="text-xs text-[#98382B] font-medium bg-[#98382B]/10 p-2.5 rounded-xl flex items-center space-x-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </p>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-[#67523C] hover:bg-[#493725] text-[#F5EFE4] font-semibold text-sm flex items-center justify-center space-x-2 transition shadow-cafe-sm disabled:opacity-50 active:scale-98"
            >
              <span>{isSubmitting ? 'Verifying...' : 'Sign In to Staff Station'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Strict Role Boundary Clarification */}
          <div className="mt-6 pt-4 border-t border-[#67523C]/10 text-left">
            <div className="flex items-start space-x-2 text-[11px] text-[#5B5146] leading-tight">
              <ShieldAlert className="w-4 h-4 text-[#A86C3E] shrink-0 mt-0.5" />
              <span>
                <strong>Restricted Role:</strong> Staff can fulfill live orders and view order history. Staff cannot edit menu items, prices, tables, or export customer data.
              </span>
            </div>
          </div>
        </motion.div>

        {/* Quick Links */}
        <div className="text-center mt-6 space-y-1">
          <Link
            to="/welcome"
            className="text-xs text-[#5B5146] hover:text-[#312219] underline font-medium block"
          >
            Switch to Customer Dining View
          </Link>
          <Link
            to="/developer/login"
            className="text-xs text-[#A86C3E] hover:text-[#312219] font-medium block"
          >
            Developer Suite Portal →
          </Link>
        </div>
      </div>
    </div>
  );
};

