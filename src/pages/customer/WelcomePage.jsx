import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Gamepad2, Star, MapPin, Phone, ArrowRight, Sparkles, Clock, CheckCircle } from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';
import { useOrders } from '../../context/OrderContext';
import { MOCK_RESTAURANT } from '../../data/mockRestaurant';
import { ReviewModal } from '../../components/customer/ReviewModal';
import { formatPhone } from '../../utils/formatters';

export const WelcomePage = () => {
  const navigate = useNavigate();
  const { table, customer } = useCustomer();
  const { latestOrderId, getOrder } = useOrders();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const activeOrder = latestOrderId ? getOrder(latestOrderId) : null;

  return (
    <div className="space-y-5 pb-8">
      {/* Table & Diner Status Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#FAF7F0] rounded-3xl p-5 border border-[#67523C]/15 shadow-cafe-sm relative overflow-hidden"
      >
        <div className="flex items-start justify-between relative z-10">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#A86C3E] block">
              Dine-In Session
            </span>
            <h1 className="font-serif font-bold text-2xl text-[#312219]">
              {table ? table.tableNumber : 'Table 04'}
            </h1>
            <p className="text-xs text-[#5B5146] mt-0.5">
              {table ? table.section : 'Sunlit Patio Terrace'}
            </p>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#3F6E4D]/10 text-[#3F6E4D] border border-[#3F6E4D]/20">
              <CheckCircle className="w-3 h-3" />
              <span>Registered</span>
            </span>
            {customer?.phone && (
              <p className="text-[11px] text-[#5B5146] mt-1 font-mono">
                {formatPhone(customer.phone)}
              </p>
            )}
          </div>
        </div>

        {/* Ambient background accent */}
        <div className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full bg-[#D2C6A6]/20 blur-xl pointer-events-none" />
      </motion.div>

      {/* Active Order Quick Glance if existing */}
      {activeOrder && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => navigate(`/orders/${activeOrder.id}`)}
          className="bg-white rounded-2xl p-4 border-2 border-[#A86C3E]/30 shadow-cafe-sm hover:border-[#A86C3E] transition cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-[#A86C3E]/10 text-[#A86C3E] flex items-center justify-center font-bold">
              <Clock className="w-4 h-4 animate-spin text-[#A86C3E]" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#A86C3E] tracking-wider block">
                Live Kitchen Status
              </span>
              <p className="font-serif font-bold text-sm text-[#312219]">
                Order {activeOrder.orderNumber} • <span className="capitalize">{activeOrder.status}</span>
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#67523C]" />
        </motion.div>
      )}

      {/* Main 3 Options Required by Customer Flow */}
      <div className="space-y-3.5">
        <h2 className="font-serif font-bold text-lg text-[#312219] px-1">
          How would you like to begin?
        </h2>

        {/* OPTION 1: View Menu */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => navigate('/menu')}
          className="bg-white rounded-3xl p-5 border border-[#67523C]/15 shadow-cafe hover:shadow-cafe-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-[#67523C] text-[#F5EFE4] flex items-center justify-center shrink-0 shadow-cafe-sm group-hover:bg-[#493725] transition-colors">
              <UtensilsCrossed className="w-7 h-7 text-[#F5EFE4]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-serif font-bold text-lg text-[#312219] group-hover:text-[#67523C] transition-colors">
                  View Menu
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#A86C3E]/10 text-[#A86C3E]">
                  Order at Table
                </span>
              </div>
              <p className="text-xs text-[#5B5146] mt-1 leading-relaxed">
                Explore single-origin coffees, fresh artisan bakes, woodfired sourdough pizzas and cold brews.
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#FAF7F0] flex items-center justify-center text-[#67523C] group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </motion.div>

        {/* OPTION 2: Play Game */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => navigate('/game')}
          className="bg-white rounded-3xl p-5 border border-[#67523C]/15 shadow-cafe hover:shadow-cafe-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-[#D2C6A6]/50 text-[#67523C] flex items-center justify-center shrink-0 border border-[#67523C]/20 group-hover:bg-[#D2C6A6] transition-colors">
              <Gamepad2 className="w-7 h-7 text-[#67523C]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-serif font-bold text-lg text-[#312219] group-hover:text-[#67523C] transition-colors">
                  Play Game
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#3F6E4D]/10 text-[#3F6E4D]">
                  60s Math Rush
                </span>
              </div>
              <p className="text-xs text-[#5B5146] mt-1 leading-relaxed">
                Challenge your mental math skills with rapid arithmetic while your barista prepares your order.
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#FAF7F0] flex items-center justify-center text-[#67523C] group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </motion.div>

        {/* OPTION 3: Write a Review */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setIsReviewModalOpen(true)}
          className="bg-white rounded-3xl p-5 border border-[#67523C]/15 shadow-cafe hover:shadow-cafe-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-[#A86C3E]/10 text-[#A86C3E] flex items-center justify-center shrink-0 border border-[#A86C3E]/20 group-hover:bg-[#A86C3E]/20 transition-colors">
              <Star className="w-7 h-7 text-[#A86C3E] fill-current" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-serif font-bold text-lg text-[#312219] group-hover:text-[#67523C] transition-colors">
                  Write a Review
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#67523C]/10 text-[#67523C]">
                  Google Reviews
                </span>
              </div>
              <p className="text-xs text-[#5B5146] mt-1 leading-relaxed">
                Share your candid dining experience directly on our Google Maps profile.
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#FAF7F0] flex items-center justify-center text-[#67523C] group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Review Modal Dialog */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
    </div>
  );
};

