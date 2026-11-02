import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, MapPin, Gamepad2, ArrowRight, Utensils, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useOrders } from '../../context/OrderContext';
import { useCustomer } from '../../context/CustomerContext';

export const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { table } = useCustomer();
  const { latestOrderId, getOrder } = useOrders();

  const orderId = location.state?.orderId || latestOrderId;
  const currentOrder = getOrder(orderId);

  useEffect(() => {
    // Launch celebratory confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#67523C', '#D2C6A6', '#A86C3E', '#3F6E4D']
      });
    } catch (e) {
      // Ignore if unsupported
    }
  }, []);

  const orderNumber = currentOrder?.orderNumber || location.state?.orderNumber || '#CR-9182';
  const tableDisplay = currentOrder?.table?.tableNumber || table?.tableNumber || 'Table 04';
  const sectionDisplay = currentOrder?.table?.section || table?.section || 'Sunlit Patio Terrace';

  return (
    <div className="min-h-[80vh] flex flex-col justify-between py-6 px-2">
      <div className="space-y-6">
        {/* Success Icon */}
        <div className="text-center pt-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="w-20 h-20 mx-auto rounded-3xl bg-[#3F6E4D] text-white flex items-center justify-center shadow-cafe mb-4"
          >
            <CheckCircle2 className="w-10 h-10" />
          </motion.div>

          {/* Exact required wording from prompt: */}
          <span className="text-xs font-bold uppercase tracking-wider text-[#3F6E4D] block mb-1">
            Confirmed & Transmitted
          </span>
          <h1 className="font-serif font-bold text-2xl text-[#312219] leading-tight">
            Order Placed! Thank you!
          </h1>
          <p className="text-sm font-medium text-[#5B5146] mt-1 max-w-xs mx-auto">
            Your order has been sent to the restaurant.
          </p>
        </div>

        {/* Order & Table Identification Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-3xl p-5 border border-[#67523C]/15 shadow-cafe"
        >
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[#67523C]/10 text-center">
            {/* Order Number */}
            <div className="border-r border-[#67523C]/10 pr-2">
              <span className="text-[10px] uppercase font-bold text-[#A86C3E] block">
                Order Number
              </span>
              <span className="font-serif font-bold text-xl text-[#312219]">
                {orderNumber}
              </span>
            </div>

            {/* Table Number */}
            <div className="pl-2">
              <span className="text-[10px] uppercase font-bold text-[#A86C3E] block">
                Table Assigned
              </span>
              <span className="font-serif font-bold text-xl text-[#312219]">
                {tableDisplay}
              </span>
            </div>
          </div>

          <div className="pt-3 text-center">
            <span className="text-xs text-[#5B5146] flex items-center justify-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#67523C]" />
              <span>{sectionDisplay}</span>
            </span>
            <div className="mt-2 inline-flex items-center space-x-1.5 bg-[#D2C6A6]/25 px-3 py-1 rounded-full text-xs text-[#5B5146]">
              <Clock className="w-3.5 h-3.5 text-[#67523C]" />
              <span>Estimated preparation: <strong>12-15 mins</strong></span>
            </div>
          </div>
        </motion.div>

        {/* Action: Track Status Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-3"
        >
          <button
            onClick={() => navigate(`/orders/${orderId}`)}
            className="w-full py-4 rounded-2xl bg-[#67523C] hover:bg-[#493725] text-[#F5EFE4] font-bold text-base flex items-center justify-center space-x-2 transition shadow-cafe-lg active:scale-98"
          >
            <Clock className="w-5 h-5 text-[#D2C6A6]" />
            <span>Track Order Status</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          {/* Action: Mental Math Game while you wait */}
          <div
            onClick={() => navigate('/game')}
            className="bg-[#FAF7F0] hover:bg-[#FAF7F0]/80 rounded-2xl p-4 border border-[#67523C]/20 shadow-cafe-sm cursor-pointer transition flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#D2C6A6]/50 text-[#67523C] flex items-center justify-center">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#3F6E4D] block">
                  Waiting for your food?
                </span>
                <span className="font-serif font-bold text-sm text-[#312219]">
                  Play 60s Mental Math Rush
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#67523C]" />
          </div>
        </motion.div>
      </div>

      {/* Return to menu link */}
      <div className="text-center pt-6">
        <Link
          to="/menu"
          className="text-xs font-semibold text-[#5B5146] hover:text-[#312219] underline"
        >
          Want to add more items? Back to Menu
        </Link>
      </div>
    </div>
  );
};

