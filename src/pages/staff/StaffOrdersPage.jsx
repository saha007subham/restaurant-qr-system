import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Clock, 
  ChefHat, 
  CheckCircle2, 
  CheckCheck, 
  Search, 
  Filter, 
  MapPin, 
  Phone, 
  Eye, 
  EyeOff, 
  MessageSquare, 
  AlertTriangle, 
  XCircle, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  ArrowRight,
  Info,
  PackageCheck
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { formatINR, formatPhone } from '../../utils/formatters';

export const StaffOrdersPage = () => {
  const { orders, updateOrderStatus, rejectOrder } = useOrders();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'received' | 'preparing' | 'ready' | 'served'
  const [searchQuery, setSearchQuery] = useState('');
  const [revealedPhones, setRevealedPhones] = useState({}); // { [orderId]: boolean }
  const [rejectingOrder, setRejectingOrder] = useState(null); // order object
  const [rejectionReason, setRejectionReason] = useState('Ingredients out of stock');
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Filter only active orders (exclude completed and rejected from live board)
  const liveOrders = useMemo(() => {
    return orders.filter(o => ['received', 'preparing', 'ready', 'served'].includes(o.status));
  }, [orders]);

  // Counts for tabs
  const counts = useMemo(() => {
    return {
      all: liveOrders.length,
      received: liveOrders.filter(o => o.status === 'received').length,
      preparing: liveOrders.filter(o => o.status === 'preparing').length,
      ready: liveOrders.filter(o => o.status === 'ready').length,
      served: liveOrders.filter(o => o.status === 'served').length
    };
  }, [liveOrders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return liveOrders.filter(order => {
      // Tab filter
      if (activeTab !== 'all' && order.status !== activeTab) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesNum = order.orderNumber.toLowerCase().includes(query);
        const matchesTable = order.table?.tableNumber?.toLowerCase().includes(query);
        const matchesSection = order.table?.section?.toLowerCase().includes(query);
        const matchesItem = order.items.some(i => i.name.toLowerCase().includes(query));
        const matchesPhone = order.customer?.phone?.includes(query);
        return matchesNum || matchesTable || matchesSection || matchesItem || matchesPhone;
      }

      return true;
    });
  }, [liveOrders, activeTab, searchQuery]);

  const togglePhoneReveal = (orderId) => {
    setRevealedPhones(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const handleConfirmReject = () => {
    if (!rejectingOrder) return;
    rejectOrder(rejectingOrder.id, rejectionReason);
    setRejectingOrder(null);
  };

  const getElapsedTime = (dateString) => {
    const elapsedMinutes = Math.floor((Date.now() - new Date(dateString).getTime()) / (1000 * 60));
    if (elapsedMinutes < 1) return 'Just now';
    if (elapsedMinutes === 1) return '1 min ago';
    return `${elapsedMinutes} mins ago`;
  };

  return (
    <div className="space-y-5 pb-16">
      {/* Top Banner & Quick Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#A86C3E] block">
            Floor Operations
          </span>
          <h1 className="font-serif font-bold text-2xl text-[#312219]">
            Live Orders Dispatch
          </h1>
        </div>

        {/* Action Controls & Sound simulation */}
        <div className="flex items-center space-x-2">
          <Link
            to="/staff/stock"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#67523C]/20 hover:bg-[#FAF7F0] text-xs font-semibold text-[#67523C] transition shadow-xs"
          >
            <PackageCheck className="w-4 h-4 text-[#A86C3E]" />
            <span>Kitchen Stock (86)</span>
          </Link>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
              soundEnabled
                ? 'bg-white border-[#67523C]/20 text-[#67523C]'
                : 'bg-[#D2C6A6]/20 border-transparent text-[#5B5146]'
            }`}
            title="Toggle incoming order chime"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#67523C]" /> : <VolumeX className="w-4 h-4 text-[#5B5146]" />}
            <span>{soundEnabled ? 'Chime Active' : 'Chime Muted'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-3.5 border border-[#67523C]/15 shadow-cafe-sm">
          <div className="flex items-center justify-between text-[#A86C3E] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">New Incoming</span>
            <Bell className={`w-4 h-4 ${counts.received > 0 ? 'animate-bounce text-[#98382B]' : ''}`} />
          </div>
          <span className="font-serif font-bold text-2xl text-[#312219] block">
            {counts.received}
          </span>
          <span className="text-[10px] text-[#5B5146]">Needs kitchen acceptance</span>
        </div>

        <div className="bg-white rounded-2xl p-3.5 border border-[#67523C]/15 shadow-cafe-sm">
          <div className="flex items-center justify-between text-[#67523C] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">In Kitchen</span>
            <ChefHat className="w-4 h-4" />
          </div>
          <span className="font-serif font-bold text-2xl text-[#312219] block">
            {counts.preparing}
          </span>
          <span className="text-[10px] text-[#5B5146]">Under preparation</span>
        </div>

        <div className="bg-white rounded-2xl p-3.5 border border-[#67523C]/15 shadow-cafe-sm">
          <div className="flex items-center justify-between text-[#3F6E4D] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Ready to Run</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="font-serif font-bold text-2xl text-[#3F6E4D] block">
            {counts.ready}
          </span>
          <span className="text-[10px] text-[#5B5146]">Plated & waiting for pickup</span>
        </div>

        <div className="bg-white rounded-2xl p-3.5 border border-[#67523C]/15 shadow-cafe-sm">
          <div className="flex items-center justify-between text-[#5B5146] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">At Tables</span>
            <CheckCheck className="w-4 h-4" />
          </div>
          <span className="font-serif font-bold text-2xl text-[#312219] block">
            {counts.served}
          </span>
          <span className="text-[10px] text-[#5B5146]">Diners enjoying meals</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <div className="flex items-center bg-white rounded-2xl border border-[#67523C]/15 px-3.5 py-2.5 shadow-cafe-sm focus-within:border-[#67523C]">
            <Search className="w-4 h-4 text-[#5B5146] shrink-0 mr-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order #, table number, item name, or phone..."
              className="w-full bg-transparent text-xs text-[#312219] placeholder-[#5B5146]/50 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#5B5146] hover:text-[#312219]"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none pb-1">
          {[
            { id: 'all', label: 'All Active', count: counts.all },
            { id: 'received', label: 'New / Received', count: counts.received, highlight: counts.received > 0 },
            { id: 'preparing', label: 'In Kitchen', count: counts.preparing },
            { id: 'ready', label: 'Ready to Run', count: counts.ready },
            { id: 'served', label: 'Served', count: counts.served }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                activeTab === tab.id
                  ? 'bg-[#67523C] text-white border-[#67523C] shadow-cafe-sm'
                  : 'bg-white hover:bg-[#FAF7F0] text-[#5B5146] border-[#67523C]/15'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                tab.highlight
                  ? 'bg-[#98382B] text-white'
                  : activeTab === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-[#D2C6A6]/40 text-[#67523C]'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map(order => {
            const isRevealed = Boolean(revealedPhones[order.id]);
            const elapsed = getElapsedTime(order.createdAt);
            const isUrgent = order.status === 'received';

            return (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`bg-white rounded-3xl p-5 border flex flex-col justify-between shadow-cafe-sm transition-all duration-200 ${
                  isUrgent ? 'border-2 border-[#A86C3E] ring-2 ring-[#A86C3E]/10' : 'border-[#67523C]/15'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between pb-3 border-b border-[#67523C]/10 mb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-serif font-bold text-lg text-[#312219]">
                          {order.table?.tableNumber || 'Table'}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-[#A86C3E] bg-[#D2C6A6]/30 px-2 py-0.5 rounded">
                          {order.table?.section || 'Floor'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mt-0.5 text-xs text-[#5B5146]">
                        <span className="font-mono font-semibold text-[#312219]">{order.orderNumber}</span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-[#A86C3E]" />
                          <span>{elapsed}</span>
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      order.status === 'received'
                        ? 'bg-[#A86C3E] text-white animate-pulse'
                        : order.status === 'preparing'
                        ? 'bg-[#67523C] text-white'
                        : order.status === 'ready'
                        ? 'bg-[#3F6E4D] text-white'
                        : 'bg-[#5B5146]/20 text-[#312219]'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Items List */}
                  <div className="space-y-2 mb-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="text-xs bg-[#FAF7F0] p-2.5 rounded-xl border border-[#67523C]/10">
                        <div className="flex items-center justify-between font-semibold text-[#312219]">
                          <span className="flex items-center space-x-2">
                            <span className="w-5 h-5 rounded-md bg-[#67523C] text-white flex items-center justify-center font-bold text-[10px]">
                              {item.quantity}×
                            </span>
                            <span>{item.name}</span>
                          </span>
                          <span>{formatINR(item.price * item.quantity)}</span>
                        </div>

                        {/* Special Instructions */}
                        {item.specialInstructions && (
                          <div className="mt-1.5 flex items-start space-x-1 text-[11px] text-[#A86C3E] font-medium bg-[#A86C3E]/10 p-1.5 rounded-lg">
                            <MessageSquare className="w-3 h-3 shrink-0 mt-0.5" />
                            <span>Note: "{item.specialInstructions}"</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* General Order Notes */}
                  {order.orderNotes && (
                    <div className="mb-4 bg-[#D2C6A6]/20 p-2.5 rounded-xl border border-[#67523C]/15 text-xs text-[#5B5146]">
                      <span className="font-bold text-[#312219] block text-[11px] uppercase tracking-wider mb-0.5">
                        Table Service Note:
                      </span>
                      <span>{order.orderNotes}</span>
                    </div>
                  )}

                  {/* Customer Phone Handling (Restricted reveal) */}
                  <div className="mb-4 p-2.5 rounded-xl bg-white border border-[#67523C]/15 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-[#67523C]" />
                      <span className="text-[#5B5146]">Customer Contact:</span>
                      {isRevealed ? (
                        <span className="font-mono font-bold text-[#312219]">
                          {formatPhone(order.customer?.phone)}
                        </span>
                      ) : (
                        <span className="font-mono text-[#5B5146]/70">
                          +91 ••••• ••{order.customer?.phone?.slice(-3) || '999'}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => togglePhoneReveal(order.id)}
                      className="p-1 text-[#67523C] hover:text-[#312219] transition"
                      title={isRevealed ? "Hide contact" : "Reveal contact for order handling"}
                    >
                      {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Bottom Action Section */}
                <div className="pt-3 border-t border-[#67523C]/10 space-y-2">
                  <div className="flex items-baseline justify-between text-xs mb-1">
                    <span className="text-[#5B5146]">Total Bill (Pay at table)</span>
                    <span className="font-serif font-bold text-base text-[#67523C]">
                      {formatINR(order.grandTotal)}
                    </span>
                  </div>

                  {/* Action Buttons based on status */}
                  {order.status === 'received' && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setRejectingOrder(order)}
                        className="py-2.5 px-3 rounded-xl border border-[#98382B]/40 text-[#98382B] hover:bg-[#98382B]/10 text-xs font-bold transition flex items-center justify-center space-x-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className="py-2.5 px-3 rounded-xl bg-[#67523C] hover:bg-[#493725] text-white text-xs font-bold transition flex items-center justify-center space-x-1 shadow-cafe-sm"
                      >
                        <ChefHat className="w-3.5 h-3.5" />
                        <span>Accept Order</span>
                      </button>
                    </div>
                  )}

                  {order.status === 'preparing' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className="w-full py-2.5 rounded-xl bg-[#3F6E4D] hover:bg-[#2e5238] text-white text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-cafe-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark Ready for Pickup</span>
                    </button>
                  )}

                  {order.status === 'ready' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'served')}
                      className="w-full py-2.5 rounded-xl bg-[#67523C] hover:bg-[#493725] text-white text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-cafe-sm"
                    >
                      <MapPin className="w-4 h-4 text-[#D2C6A6]" />
                      <span>Mark Served at Table</span>
                    </button>
                  )}

                  {order.status === 'served' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      className="w-full py-2.5 rounded-xl bg-[#312219] hover:bg-[#1f1510] text-[#F5EFE4] text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-cafe-sm"
                    >
                      <CheckCheck className="w-4 h-4 text-[#D2C6A6]" />
                      <span>Complete & Settle Table</span>
                    </button>
                  )}

                  {/* Audit details trigger */}
                  <button
                    onClick={() => setSelectedOrderForDetails(order)}
                    className="w-full py-1 text-[11px] text-[#5B5146] hover:text-[#312219] font-medium transition text-center"
                  >
                    View Status History & Timeline →
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-[#67523C]/10 max-w-md mx-auto">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#D2C6A6]/30 flex items-center justify-center text-[#67523C] mb-3">
            <CheckCircle2 className="w-7 h-7 text-[#3F6E4D]" />
          </div>
          <h3 className="font-serif font-bold text-lg text-[#312219]">
            All Clean on the Floor!
          </h3>
          <p className="text-xs text-[#5B5146] mt-1 max-w-xs mx-auto">
            {searchQuery
              ? `No live orders matching "${searchQuery}".`
              : activeTab !== 'all'
              ? `No active orders currently under status "${activeTab}".`
              : 'There are no active orders waiting. When customers scan their table QR and order, they will appear here instantaneously.'}
          </p>
        </div>
      )}

      {/* REJECTION MODAL */}
      <AnimatePresence>
        {rejectingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FAF7F0] w-full max-w-sm rounded-3xl p-6 border border-[#67523C]/20 shadow-cafe-lg text-[#312219]"
            >
              <div className="flex items-center space-x-2 text-[#98382B] mb-2">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-serif font-bold text-lg">Reject Order</h3>
              </div>
              <p className="text-xs text-[#5B5146] mb-4">
                Are you sure you want to reject Order <strong>{rejectingOrder.orderNumber}</strong> ({rejectingOrder.table?.tableNumber})? Select the reason to notify customer tracking:
              </p>

              <div className="space-y-2 mb-5">
                {[
                  'Ingredients out of stock',
                  'Kitchen at maximum capacity',
                  'Item temporarily unavailable',
                  'Diner requested cancellation',
                  'Espresso machine maintenance'
                ].map(reason => (
                  <label
                    key={reason}
                    className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                      rejectionReason === reason
                        ? 'bg-white border-[#67523C] font-semibold text-[#312219]'
                        : 'bg-white/60 border-[#67523C]/10 text-[#5B5146]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="rejectionReason"
                      value={reason}
                      checked={rejectionReason === reason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="accent-[#67523C]"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setRejectingOrder(null)}
                  className="flex-1 py-2.5 rounded-xl border border-[#67523C]/20 text-xs font-semibold text-[#5B5146]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReject}
                  className="flex-1 py-2.5 rounded-xl bg-[#98382B] text-white text-xs font-semibold hover:bg-[#7e2d22] transition shadow-xs"
                >
                  Confirm Rejection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ORDER AUDIT & DETAILS MODAL */}
      <AnimatePresence>
        {selectedOrderForDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FAF7F0] w-full max-w-md rounded-3xl p-6 border border-[#67523C]/20 shadow-cafe-lg text-[#312219]"
            >
              <div className="flex items-start justify-between pb-3 border-b border-[#67523C]/10 mb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#A86C3E]">
                    Order Audit Log
                  </span>
                  <h3 className="font-serif font-bold text-xl text-[#312219]">
                    {selectedOrderForDetails.orderNumber}
                  </h3>
                  <span className="text-xs text-[#5B5146]">
                    {selectedOrderForDetails.table?.tableNumber} • {selectedOrderForDetails.table?.section}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedOrderForDetails(null)}
                  className="text-xs font-bold p-1 text-[#5B5146] hover:text-[#312219]"
                >
                  ✕
                </button>
              </div>

              {/* Status History Timeline */}
              <div className="space-y-3 mb-5 max-h-56 overflow-y-auto pr-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#312219] block mb-2">
                  Event Timeline:
                </span>
                {selectedOrderForDetails.statusHistory?.map((ev, i) => (
                  <div key={i} className="flex items-start space-x-3 text-xs bg-white p-2.5 rounded-xl border border-[#67523C]/10">
                    <span className="font-bold uppercase text-[10px] px-2 py-0.5 rounded bg-[#67523C]/10 text-[#67523C] shrink-0 mt-0.5">
                      {ev.status}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-[#312219]">{ev.note}</p>
                      <span className="text-[10px] text-[#5B5146]/70">
                        {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Security Boundary Notice */}
              <div className="bg-[#D2C6A6]/20 p-3 rounded-xl border border-[#67523C]/15 flex items-start space-x-2 text-[11px] text-[#5B5146] mb-4">
                <ShieldAlert className="w-4 h-4 text-[#A86C3E] shrink-0 mt-0.5" />
                <span>
                  Staff accounts have read-only access to audit logs. Changing pricing or editing historical order lines is restricted to developer administrators.
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrderForDetails(null)}
                className="w-full py-2.5 rounded-xl bg-[#67523C] text-white text-xs font-semibold hover:bg-[#493725] transition"
              >
                Close Audit View
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

