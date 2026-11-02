import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Plus, Minus, Trash2, MessageSquare, ShieldCheck, MapPin, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useCustomer } from '../../context/CustomerContext';
import { useOrders } from '../../context/OrderContext';
import { formatINR } from '../../utils/formatters';
import { MOCK_RESTAURANT } from '../../data/mockRestaurant';
import { SpecialInstructionsModal } from '../../components/customer/SpecialInstructionsModal';

export const CartPage = () => {
  const navigate = useNavigate();
  const { items, orderNotes, setOrderNotes, updateQuantity, updateInstructions, removeItem, clearCart, subtotal, gst, grandTotal } = useCart();
  const { table, customer } = useCustomer();
  const { placeOrder } = useOrders();

  const [activeItemForModal, setActiveItemForModal] = useState(null);
  const [isPlacing, setIsPlacing] = useState(false);

  const handlePlaceOrder = () => {
    if (items.length === 0) return;
    setIsPlacing(true);

    try {
      const order = placeOrder({
        items,
        table: table || { tableNumber: "Table 04", section: "Sunlit Patio Terrace" },
        customer: customer || { phone: "9876543210", countryCode: "+91" },
        orderNotes,
        subtotal,
        gst,
        grandTotal
      });

      // Clear the cart
      clearCart();

      // Brief delay for delightful transition
      setTimeout(() => {
        setIsPlacing(false);
        navigate('/order-success', { state: { orderId: order.id, orderNumber: order.orderNumber } });
      }, 500);
    } catch (err) {
      console.error(err);
      setIsPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 rounded-full bg-[#D2C6A6]/30 flex items-center justify-center text-[#67523C] mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-serif font-bold text-2xl text-[#312219]">
          Your Basket is Empty
        </h2>
        <p className="text-xs text-[#5B5146] max-w-xs mt-1.5 leading-relaxed">
          Looks like you haven't added any coffees, sourdough toasts, or bakes to your order yet.
        </p>
        <Link
          to="/menu"
          className="mt-6 px-6 py-3 rounded-xl bg-[#67523C] hover:bg-[#493725] text-[#F5EFE4] text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition shadow-cafe-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Café Menu</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => navigate('/menu')}
          className="flex items-center space-x-1.5 text-xs font-semibold text-[#67523C] hover:text-[#312219] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Ordering</span>
        </button>
        <span className="text-xs font-bold text-[#A86C3E] uppercase tracking-wider">
          Review Order
        </span>
      </div>

      {/* Table Context Card */}
      <div className="bg-[#FAF7F0] rounded-2xl p-3.5 border border-[#67523C]/15 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#67523C] text-white flex items-center justify-center">
            <MapPin className="w-4 h-4 text-[#D2C6A6]" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#A86C3E] block">
              Delivering to
            </span>
            <span className="font-serif font-bold text-sm text-[#312219]">
              {table ? table.tableNumber : 'Table 04'} • {table ? table.section : 'Patio'}
            </span>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-[#3F6E4D] bg-[#3F6E4D]/10 px-2 py-0.5 rounded-full">
          Table Confirmed
        </span>
      </div>

      {/* Items List */}
      <div className="space-y-3">
        <h3 className="font-serif font-bold text-lg text-[#312219]">
          Selected Items ({items.reduce((acc, i) => acc + i.quantity, 0)})
        </h3>

        <div className="space-y-2.5">
          {items.map(({ item, quantity, specialInstructions }) => (
            <motion.div
              key={item.id}
              layout
              className="bg-white rounded-2xl p-3.5 border border-[#67523C]/15 shadow-cafe-sm"
            >
              <div className="flex items-start space-x-3">
                {/* Thumb */}
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 bg-[#D2C6A6]/20"
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#312219] leading-tight truncate">
                        {item.name}
                      </h4>
                      <span className="text-xs font-semibold text-[#A86C3E] block mt-0.5">
                        {formatINR(item.price)} each
                      </span>
                    </div>

                    {/* Delete item button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-[#5B5146]/50 hover:text-[#98382B] transition"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Special instruction pill / trigger */}
                  <div className="mt-2 flex items-center justify-between">
                    <button
                      onClick={() => setActiveItemForModal({ item, instructions: specialInstructions })}
                      className="text-[11px] text-[#67523C] hover:text-[#312219] flex items-center space-x-1 underline truncate max-w-[170px]"
                    >
                      <MessageSquare className="w-3 h-3 shrink-0" />
                      <span className="truncate">
                        {specialInstructions ? `"${specialInstructions}"` : "+ Add cooking note"}
                      </span>
                    </button>

                    {/* Quantity Stepper */}
                    <div className="flex items-center bg-[#FAF7F0] border border-[#67523C]/20 rounded-lg p-0.5">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 rounded bg-white text-[#312219] flex items-center justify-center font-bold text-xs hover:bg-[#D2C6A6]/30 transition"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-[#312219]">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 rounded bg-[#67523C] text-white flex items-center justify-center font-bold text-xs hover:bg-[#493725] transition"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Global Order Special Instructions */}
      <div className="bg-white rounded-2xl p-4 border border-[#67523C]/15 shadow-cafe-sm">
        <label className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#312219] mb-2">
          <MessageSquare className="w-4 h-4 text-[#A86C3E]" />
          <span>General Kitchen / Service Notes</span>
        </label>
        <textarea
          rows={2}
          value={orderNotes}
          onChange={(e) => setOrderNotes(e.target.value)}
          placeholder="e.g. Please bring drinks together, extra napkins requested..."
          className="w-full p-3 text-xs rounded-xl border border-[#67523C]/15 bg-[#FAF7F0] text-[#312219] placeholder-[#5B5146]/50 outline-none focus:border-[#67523C] resize-none"
        />
      </div>

      {/* Bill Breakdown */}
      <div className="bg-white rounded-2xl p-4 border border-[#67523C]/15 shadow-cafe-sm space-y-2 text-xs">
        <h4 className="font-serif font-bold text-sm text-[#312219] mb-3">
          Bill Breakdown
        </h4>
        <div className="flex justify-between text-[#5B5146]">
          <span>Item Total</span>
          <span className="font-semibold text-[#312219]">{formatINR(subtotal)}</span>
        </div>
        <div className="flex justify-between text-[#5B5146]">
          <span>GST (5% Indian Tax)</span>
          <span className="font-semibold text-[#312219]">{formatINR(gst)}</span>
        </div>
        <div className="flex justify-between text-[#5B5146]">
          <span>Restaurant Service Charge</span>
          <span className="font-semibold text-[#3F6E4D]">₹0 (Complimentary)</span>
        </div>
        <div className="pt-2 border-t border-[#67523C]/10 flex justify-between items-baseline font-bold">
          <span className="text-sm font-serif text-[#312219]">Grand Total</span>
          <span className="text-lg font-serif text-[#67523C]">{formatINR(grandTotal)}</span>
        </div>
      </div>

      {/* Payment Notice Callout */}
      <div className="bg-[#FAF7F0] border border-[#67523C]/20 rounded-2xl p-3.5 flex items-start space-x-3 text-[#5B5146]">
        <ShieldCheck className="w-5 h-5 text-[#67523C] shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-bold text-[#312219] block">
            No Online Payment Required
          </span>
          <p className="mt-0.5 leading-relaxed">
            Your order will be transmitted directly to the kitchen. You can settle the bill via cash, UPI, or card at your table upon completion.
          </p>
        </div>
      </div>

      {/* Place Order CTA Button */}
      <button
        onClick={handlePlaceOrder}
        disabled={isPlacing}
        className="w-full py-4 rounded-2xl bg-[#67523C] hover:bg-[#493725] text-[#F5EFE4] font-bold text-base flex items-center justify-center space-x-2 transition shadow-cafe-lg disabled:opacity-60 active:scale-98"
      >
        <span>{isPlacing ? 'Sending to Kitchen...' : `Place Table Order • ${formatINR(grandTotal)}`}</span>
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Special Instruction Modal for individual item */}
      {activeItemForModal && (
        <SpecialInstructionsModal
          isOpen={Boolean(activeItemForModal)}
          onClose={() => setActiveItemForModal(null)}
          item={activeItemForModal.item}
          currentInstructions={activeItemForModal.instructions}
          onSave={(note) => {
            updateInstructions(activeItemForModal.item.id, note);
            setActiveItemForModal(null);
          }}
        />
      )}
    </div>
  );
};
