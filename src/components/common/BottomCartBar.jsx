import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatINR } from '../../utils/formatters';

export const BottomCartBar = () => {
  const { totalCount, subtotal } = useCart();
  const location = useLocation();

  // Hide on cart, order-success, and game pages
  const shouldHide =
    totalCount === 0 ||
    location.pathname === '/cart' ||
    location.pathname === '/order-success' ||
    location.pathname === '/game' ||
    location.pathname.startsWith('/t/');

  return (
    <AnimatePresence>
      {!shouldHide && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          className="fixed bottom-4 inset-x-0 z-40 px-4 pointer-events-none"
        >
          <div className="max-w-md mx-auto pointer-events-auto">
            <Link
              to="/cart"
              className="w-full flex items-center justify-between bg-[#67523C] hover:bg-[#493725] text-[#F5EFE4] px-5 py-3.5 rounded-2xl shadow-cafe-lg transition-all duration-200 transform active:scale-98 border border-[#D2C6A6]/20"
            >
              {/* Left count & items */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#FAF7F0]/20 flex items-center justify-center font-bold text-xs">
                  <ShoppingBag className="w-4 h-4 text-[#F5EFE4]" />
                </div>
                <div className="text-left">
                  <span className="block text-xs uppercase tracking-wider font-semibold text-[#D2C6A6]">
                    {totalCount} {totalCount === 1 ? 'Item' : 'Items'} in Basket
                  </span>
                  <span className="font-serif font-bold text-lg text-white">
                    {formatINR(subtotal)}
                  </span>
                </div>
              </div>

              {/* Right CTA */}
              <div className="flex items-center space-x-2 text-sm font-semibold tracking-wide">
                <span>View Cart</span>
                <div className="w-7 h-7 rounded-full bg-[#FAF7F0] text-[#67523C] flex items-center justify-center">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

