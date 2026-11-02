import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Terminal, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, ShieldAlert } from 'lucide-react';
import { useDeveloperAuth } from '../../context/DeveloperAuthContext';

export const DeveloperLoginPage = () => {
  const navigate = useNavigate();
  const { isDevAuthenticated, login, authError, setAuthError } = useDeveloperAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isDevAuthenticated) {
      navigate('/developer/dashboard', { replace: true });
    }
  }, [isDevAuthenticated, navigate]);

  const handleFillDemo = () => {
    setEmail('developer@rustique.com');
    setPassword('devmaster123');
    setAuthError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setAuthError('Please enter developer credentials.');
      return;
    }

    setIsSubmitting(true);
    const res = login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      navigate('/developer/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5EFE4] flex flex-col justify-between p-4 sm:p-6">
      <div className="max-w-md w-full mx-auto my-auto py-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-[#312219] text-[#D2C6A6] flex items-center justify-center shadow-cafe mb-3">
            <Terminal className="w-8 h-8" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#A86C3E] block">
            System Architecture
          </span>
          <h1 className="font-serif font-bold text-2xl text-[#312219]">
            Developer Suite
          </h1>
          <p className="text-xs text-[#5B5146] mt-1">
            Menu engineering, QR tokens, marketing consent & multi-client console
          </p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-[#67523C]/20 shadow-cafe text-[#312219]"
        >
          {/* Quick Demo Autofill Banner */}
          <div className="bg-[#FAF7F0] border border-[#67523C]/15 rounded-2xl p-3 mb-5 flex items-center justify-between">
            <div className="text-xs text-[#5B5146]">
              <span className="font-bold text-[#312219] block">Developer Master Account</span>
              <span className="font-mono text-[11px]">developer@rustique.com • devmaster123</span>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="px-2.5 py-1.5 rounded-lg bg-[#312219] hover:bg-[#1f1510] text-[#D2C6A6] text-[11px] font-bold transition shadow-xs"
            >
              Auto-fill
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5B5146] mb-1.5">
                Developer Email
              </label>
              <div className="flex items-center rounded-xl border border-[#67523C]/20 bg-[#FAF7F0] px-3.5 py-2.5 focus-within:border-[#312219] transition">
                <Mail className="w-4 h-4 text-[#5B5146] shrink-0 mr-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="developer@rustique.com"
                  className="w-full bg-transparent text-sm text-[#312219] placeholder-[#5B5146]/40 outline-none"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5B5146] mb-1.5">
                Master Password
              </label>
              <div className="flex items-center rounded-xl border border-[#67523C]/20 bg-[#FAF7F0] px-3.5 py-2.5 focus-within:border-[#312219] transition">
                <Lock className="w-4 h-4 text-[#5B5146] shrink-0 mr-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-transparent text-sm text-[#312219] placeholder-[#5B5146]/40 outline-none"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            {authError && (
              <p className="text-xs text-[#98382B] font-medium bg-[#98382B]/10 p-2.5 rounded-xl flex items-center space-x-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-[#312219] hover:bg-[#1f1510] text-[#FAF7F0] font-semibold text-sm flex items-center justify-center space-x-2 transition shadow-cafe-sm disabled:opacity-50 active:scale-98"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Enter Developer Console'}</span>
              <ArrowRight className="w-4 h-4 text-[#D4A373]" />
            </button>
          </form>

          {/* Strict Separation Callout */}
          <div className="mt-6 pt-4 border-t border-[#67523C]/10 text-left">
            <div className="flex items-start space-x-2 text-[11px] text-[#5B5146] leading-tight">
              <ShieldAlert className="w-4 h-4 text-[#A86C3E] shrink-0 mt-0.5" />
              <span>
                <strong>Security Policy:</strong> This portal is restricted to developers. Ordinary restaurant staff accounts are prohibited from accessing this interface.
              </span>
            </div>
          </div>
        </motion.div>

        {/* Navigation Switchers */}
        <div className="text-center mt-6 space-y-1">
          <Link
            to="/staff/login"
            className="text-xs text-[#67523C] hover:text-[#312219] font-medium block"
          >
            ← Switch to Restaurant Staff Login
          </Link>
          <Link
            to="/welcome"
            className="text-xs text-[#5B5146] hover:text-[#312219] underline block"
          >
            Go to Diner Interface
          </Link>
        </div>
      </div>
    </div>
  );
};

