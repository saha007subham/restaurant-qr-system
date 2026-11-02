import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Coffee, MapPin, Phone, MessageSquare, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';
import { useRestaurant } from '../../context/RestaurantContext';
import { MOCK_RESTAURANT } from '../../data/mockRestaurant';
import { MOCK_TABLES, getTableByToken } from '../../data/mockTables';

export const TableRegisterPage = () => {
  const { qrToken } = useParams();
  const navigate = useNavigate();
  const { table, customer, setTableFromToken, registerCustomer } = useCustomer();
  const { recordCustomerVisit } = useRestaurant();

  const [resolvedTable, setResolvedTable] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(customer?.phone || '');
  const [countryCode, setCountryCode] = useState('+91');
  const [whatsappConsent, setWhatsappConsent] = useState(false); // Strictly UNCHECKED by default
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (qrToken) {
      const match = setTableFromToken(qrToken);
      if (match) {
        setResolvedTable(match);
      } else {
        // Fallback or invalid token
        setResolvedTable(null);
      }
    } else if (table) {
      setResolvedTable(table);
    }
  }, [qrToken]);

  const handlePhoneChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (raw.length <= 10) {
      setPhoneNumber(raw);
      if (error) setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Save customer registration and explicit consent decisions
      registerCustomer({
        phone: phoneNumber,
        countryCode,
        whatsappConsent
      });

      // Record in developer customer logs
      recordCustomerVisit({
        phone: phoneNumber,
        countryCode,
        whatsappConsent,
        tableNumber: activeTable?.tableNumber || 'Table 04'
      });

      // Navigate to customer welcome page
      setTimeout(() => {
        setIsSubmitting(false);
        navigate('/welcome');
      }, 400);
    } catch (err) {
      setIsSubmitting(false);
      setError('Registration failed. Please try again.');
    }
  };

  const activeTable = resolvedTable || table || MOCK_TABLES[2];

  return (
    <div className="min-h-screen bg-[#F5EFE4] flex flex-col justify-between py-6 px-4">
      <div className="max-w-md w-full mx-auto">
        {/* Brand Header */}
        <div className="text-center pt-4 pb-6">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-[#67523C] text-[#F5EFE4] flex items-center justify-center shadow-cafe mb-3">
            <Coffee className="w-8 h-8" />
          </div>
          <h1 className="font-serif font-bold text-2xl text-[#312219]">
            {MOCK_RESTAURANT.name}
          </h1>
          <p className="text-xs text-[#A86C3E] uppercase tracking-wider font-semibold mt-0.5">
            {MOCK_RESTAURANT.tagline}
          </p>
        </div>

        {/* Table Banner Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-[#67523C]/15 shadow-cafe-sm mb-6 flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#D2C6A6]/40 flex items-center justify-center text-[#67523C]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#A86C3E] tracking-wider block">
                Your Table Assigned
              </span>
              <h2 className="font-serif font-bold text-lg text-[#312219] leading-tight">
                {activeTable.tableNumber}
              </h2>
              <span className="text-xs text-[#5B5146]">
                {activeTable.section}
              </span>
            </div>
          </div>
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#3F6E4D]/10 text-[#3F6E4D] border border-[#3F6E4D]/20">
            <CheckCircle2 className="w-3 h-3" />
            <span>QR Verified</span>
          </span>
        </motion.div>

        {/* Registration Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 border border-[#67523C]/15 shadow-cafe text-[#312219]"
        >
          <div className="mb-5">
            <h3 className="font-serif font-bold text-xl text-[#312219]">
              Diner Registration
            </h3>
            <p className="text-xs text-[#5B5146] mt-1 leading-relaxed">
              Enter your mobile number to view our curated menu, place table orders, and monitor your kitchen status.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone Input with +91 default */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5B5146] mb-1.5">
                Mobile Number
              </label>
              <div className="flex rounded-xl border border-[#67523C]/20 focus-within:border-[#67523C] focus-within:ring-2 focus-within:ring-[#67523C]/20 bg-[#FAF7F0] overflow-hidden transition">
                {/* Country code prefix */}
                <div className="bg-[#D2C6A6]/30 px-3.5 flex items-center border-r border-[#67523C]/15 font-semibold text-sm text-[#312219]">
                  <span>{countryCode}</span>
                </div>
                {/* Phone digits */}
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="98765 43210"
                  className="w-full px-3.5 py-3 text-base font-semibold bg-transparent text-[#312219] placeholder-[#5B5146]/40 outline-none"
                  autoComplete="tel-national"
                  autoFocus
                />
              </div>
              {error && (
                <p className="flex items-center space-x-1 text-xs text-[#98382B] mt-1.5 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{error}</span>
                </p>
              )}
            </div>

            {/* Optional Unchecked WhatsApp Marketing Consent Checkbox */}
            <div className="pt-2">
              <label className="flex items-start space-x-3 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  checked={whatsappConsent}
                  onChange={(e) => setWhatsappConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-[#67523C] border-[#67523C]/30 focus:ring-[#67523C] focus:ring-offset-0 cursor-pointer accent-[#67523C]"
                />
                <div className="text-xs text-[#5B5146] leading-snug">
                  <span className="font-semibold text-[#312219] group-hover:text-[#67523C] transition">
                    Keep me updated on WhatsApp (Optional)
                  </span>
                  <p className="text-[11px] text-[#5B5146]/80 mt-0.5">
                    Receive digital table bills, roastery updates, and chef tasting invitations via WhatsApp. You can withdraw anytime.
                  </p>
                </div>
              </label>
            </div>

            {/* Privacy notice */}
            <div className="bg-[#D2C6A6]/20 rounded-xl p-3 flex items-center space-x-2.5 text-[#5B5146] text-[11px]">
              <ShieldCheck className="w-4 h-4 text-[#67523C] shrink-0" />
              <span>We never sell your phone number or spam you. Data is stored securely.</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-[#67523C] hover:bg-[#493725] text-[#F5EFE4] font-semibold text-sm flex items-center justify-center space-x-2 transition shadow-cafe-sm disabled:opacity-50 active:scale-98"
            >
              <span>{isSubmitting ? 'Registering Table...' : 'Enter Café Dining'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </motion.div>

        {/* Demo QR Table Selector Switcher (Notice for reviewers during Stage 1) */}
        <div className="mt-6 text-center">
          <p className="text-[11px] text-[#5B5146]">
            Testing different tables? Try{' '}
            <button
              onClick={() => navigate('/t/tbl-main-01')}
              className="underline font-semibold hover:text-[#312219]"
            >
              Table 01
            </button>
            ,{' '}
            <button
              onClick={() => navigate('/t/tbl-patio-04')}
              className="underline font-semibold hover:text-[#312219]"
            >
              Table 04
            </button>
            , or{' '}
            <button
              onClick={() => navigate('/t/tbl-garden-07')}
              className="underline font-semibold hover:text-[#312219]"
            >
              Table 07
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

