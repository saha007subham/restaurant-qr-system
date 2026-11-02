import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, ChefHat, Bell, CheckCheck, ArrowLeft, MapPin, Phone, MessageSquare, Play } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { formatINR, formatPhone } from '../../utils/formatters';

const STATUS_STEPS = [
  { key: 'received', title: 'Order Received', desc: 'Received & queued at espresso & kitchen bar', icon: Bell },
  { key: 'preparing', title: 'Preparing in Kitchen', desc: 'Chef & baristas are handcrafting your order', icon: ChefHat },
  { key: 'ready', title: 'Ready for Service', desc: 'Plated, checked for quality, and being brought out', icon: Clock },
  { key: 'served', title: 'Served at Table', desc: 'Bon appétit! Served hot at your designated table', icon: CheckCircle2 },
  { key: 'completed', title: 'Dining Completed', desc: 'Table dining session concluded', icon: CheckCheck }
];

export const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrder, advanceOrderStatus } = useOrders();

  const order = getOrder(orderId);

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="font-serif font-bold text-xl text-[#312219]">Order Not Found</h2>
        <p className="text-xs text-[#5B5146] mt-2 mb-6">
          The requested order session could not be retrieved.
        </p>
        <Link
          to="/menu"
          className="px-5 py-2.5 rounded-xl bg-[#67523C] text-[#F5EFE4] text-xs font-semibold"
        >
          Return to Menu
        </Link>
      </div>
    );
  }

  const currentStatusIndex = STATUS_STEPS.findIndex(s => s.key === order.status);

  return (
    <div className="space-y-5 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => navigate('/welcome')}
          className="flex items-center space-x-1.5 text-xs font-semibold text-[#67523C] hover:text-[#312219] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dining</span>
        </button>
        <span className="text-xs font-bold text-[#A86C3E] uppercase tracking-wider">
          Live Tracker
        </span>
      </div>

      {/* Hero Status Card */}
      <div className="bg-[#FAF7F0] rounded-3xl p-5 border border-[#67523C]/15 shadow-cafe-sm text-[#312219]">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#A86C3E] block">
              Order Identifier
            </span>
            <h1 className="font-serif font-bold text-2xl text-[#312219]">
              {order.orderNumber}
            </h1>
            <p className="text-xs text-[#5B5146] mt-0.5 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-[#67523C]" />
              <span>{order.table?.tableNumber} • {order.table?.section}</span>
            </p>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#67523C] text-[#F5EFE4] shadow-sm">
              {order.status}
            </span>
            <p className="text-[10px] text-[#5B5146] mt-1">
              Placed {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="relative pl-6 space-y-6 pt-2 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#D2C6A6]">
          {STATUS_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStatusIndex;
            const isCurrent = idx === currentStatusIndex;
            const isFuture = idx > currentStatusIndex;

            const StepIcon = step.icon;

            return (
              <div key={step.key} className="relative flex items-start space-x-3.5">
                {/* Node icon */}
                <div
                  className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-[#3F6E4D] text-white shadow-xs'
                      : isCurrent
                      ? 'bg-[#67523C] text-white ring-4 ring-[#67523C]/20 animate-pulse'
                      : 'bg-white border-2 border-[#D2C6A6] text-[#D2C6A6]'
                  }`}
                >
                  <StepIcon className="w-3.5 h-3.5" />
                </div>

                {/* Text info */}
                <div>
                  <h4
                    className={`font-serif font-bold text-sm leading-tight ${
                      isCurrent
                        ? 'text-[#67523C]'
                        : isCompleted
                        ? 'text-[#312219]'
                        : 'text-[#5B5146]/50'
                    }`}
                  >
                    {step.title}
                  </h4>
                  <p
                    className={`text-xs mt-0.5 leading-snug ${
                      isCurrent
                        ? 'text-[#312219] font-medium'
                        : isCompleted
                        ? 'text-[#5B5146]'
                        : 'text-[#5B5146]/40'
                    }`}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviewer Simulation Control (For Stage 1 demonstration) */}
      <div className="bg-white/80 rounded-2xl p-3.5 border border-[#67523C]/15 flex items-center justify-between">
        <div className="text-left">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#A86C3E] block">
            Demo Simulator
          </span>
          <span className="text-xs text-[#5B5146]">
            Simulate Kitchen Status Transition
          </span>
        </div>
        <button
          onClick={() => advanceOrderStatus(order.id)}
          disabled={order.status === 'completed'}
          className="px-3.5 py-1.5 rounded-xl bg-[#67523C] hover:bg-[#493725] text-[#F5EFE4] text-xs font-semibold flex items-center space-x-1.5 disabled:opacity-40 transition"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>Advance State</span>
        </button>
      </div>

      {/* Items Summary in this Order */}
      <div className="bg-white rounded-3xl p-5 border border-[#67523C]/15 shadow-cafe-sm space-y-3">
        <h3 className="font-serif font-bold text-base text-[#312219]">
          Items in this Order ({order.items.length})
        </h3>
        <div className="divide-y divide-[#67523C]/10 text-xs">
          {order.items.map((it, i) => (
            <div key={i} className="py-2.5 flex items-start justify-between">
              <div>
                <span className="font-semibold text-[#312219]">{it.quantity} × {it.name}</span>
                {it.specialInstructions && (
                  <p className="text-[11px] text-[#A86C3E] italic mt-0.5 flex items-center space-x-1">
                    <MessageSquare className="w-3 h-3 shrink-0" />
                    <span>"{it.specialInstructions}"</span>
                  </p>
                )}
              </div>
              <span className="font-semibold text-[#312219]">
                {formatINR(it.price * it.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Global Notes */}
        {order.orderNotes && (
          <div className="pt-2 text-xs text-[#5B5146] border-t border-[#67523C]/10">
            <span className="font-bold text-[#312219]">Order Notes: </span>
            <span>{order.orderNotes}</span>
          </div>
        )}

        {/* Totals */}
        <div className="pt-3 border-t border-[#67523C]/10 flex justify-between items-baseline">
          <span className="font-serif font-bold text-sm text-[#312219]">Grand Total (incl. GST)</span>
          <span className="font-serif font-bold text-lg text-[#67523C]">{formatINR(order.grandTotal)}</span>
        </div>
      </div>

      {/* Mental Math CTA */}
      <div
        onClick={() => navigate('/game')}
        className="bg-[#D2C6A6]/30 hover:bg-[#D2C6A6]/50 rounded-2xl p-4 border border-[#67523C]/15 cursor-pointer transition flex items-center justify-between"
      >
        <span className="text-xs font-semibold text-[#312219]">
          Wait time passing slowly? Play Mental Math Rush ⚡
        </span>
        <span className="text-xs font-bold text-[#67523C] underline">Play</span>
      </div>
    </div>
  );
};

