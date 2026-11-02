import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  History, 
  Search, 
  Filter, 
  Calendar, 
  CheckCheck, 
  XCircle, 
  FileSpreadsheet, 
  ShieldAlert, 
  MapPin, 
  Phone, 
  Clock, 
  IndianRupee 
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { formatINR, formatPhone } from '../../utils/formatters';

export const StaffHistoryPage = () => {
  const { orders } = useOrders();
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'completed' | 'rejected'
  const [searchQuery, setSearchQuery] = useState('');

  // History orders include completed and rejected orders (and served orders if completed)
  const historyOrders = useMemo(() => {
    return orders.filter(o => ['completed', 'rejected'].includes(o.status));
  }, [orders]);

  // Aggregate stats
  const stats = useMemo(() => {
    const completedOrders = historyOrders.filter(o => o.status === 'completed');
    const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
    const rejectedCount = historyOrders.filter(o => o.status === 'rejected').length;

    return {
      completedCount: completedOrders.length,
      totalRevenue,
      rejectedCount
    };
  }, [historyOrders]);

  // Filtered list
  const filteredHistory = useMemo(() => {
    return historyOrders.filter(order => {
      if (filterStatus !== 'all' && order.status !== filterStatus) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesNum = order.orderNumber.toLowerCase().includes(q);
        const matchesTable = order.table?.tableNumber?.toLowerCase().includes(q);
        const matchesPhone = order.customer?.phone?.includes(q);
        const matchesItem = order.items.some(i => i.name.toLowerCase().includes(q));
        return matchesNum || matchesTable || matchesPhone || matchesItem;
      }

      return true;
    });
  }, [historyOrders, filterStatus, searchQuery]);

  return (
    <div className="space-y-5 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#A86C3E] block">
            Archives & Records
          </span>
          <h1 className="font-serif font-bold text-2xl text-[#312219]">
            Order History Log
          </h1>
        </div>

        {/* Export Attempt Badge (Enforcing Staff Restriction) */}
        <div className="flex items-center space-x-2">
          <div
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#D2C6A6]/20 border border-[#67523C]/15 text-xs text-[#5B5146] opacity-75 cursor-not-allowed"
            title="Exporting customer records or phone numbers is strictly prohibited for staff accounts"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#A86C3E]" />
            <span>Export CSV</span>
            <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-[#67523C] text-white">
              Locked
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-[#67523C]/15 shadow-cafe-sm">
          <div className="flex items-center justify-between text-[#3F6E4D] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Completed Orders</span>
            <CheckCheck className="w-4 h-4" />
          </div>
          <span className="font-serif font-bold text-2xl text-[#312219] block">
            {stats.completedCount}
          </span>
          <span className="text-[10px] text-[#5B5146]">Delivered & settled tables</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#67523C]/15 shadow-cafe-sm">
          <div className="flex items-center justify-between text-[#67523C] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Settled Revenue</span>
            <IndianRupee className="w-4 h-4" />
          </div>
          <span className="font-serif font-bold text-2xl text-[#67523C] block">
            {formatINR(stats.totalRevenue)}
          </span>
          <span className="text-[10px] text-[#5B5146]">Processed floor volume</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#67523C]/15 shadow-cafe-sm">
          <div className="flex items-center justify-between text-[#98382B] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Rejected / Cancelled</span>
            <XCircle className="w-4 h-4" />
          </div>
          <span className="font-serif font-bold text-2xl text-[#98382B] block">
            {stats.rejectedCount}
          </span>
          <span className="text-[10px] text-[#5B5146]">Capacity or 86'd items</span>
        </div>
      </div>

      {/* Security notice */}
      <div className="bg-[#FAF7F0] p-3 rounded-2xl border border-[#67523C]/15 flex items-start space-x-2.5 text-xs text-[#5B5146]">
        <ShieldAlert className="w-4 h-4 text-[#A86C3E] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Staff Access Guardrail:</strong> Order history records are strictly read-only for audit and review. Exporting customer telephone directories or marketing data requires Developer Suite access.
        </p>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <div className="flex items-center bg-white rounded-xl border border-[#67523C]/15 px-3 py-2 text-xs">
            <Search className="w-3.5 h-3.5 text-[#5B5146] mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by order #, table, phone..."
              className="w-full bg-transparent text-[#312219] placeholder-[#5B5146]/50 outline-none"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          {[
            { id: 'all', label: 'All History' },
            { id: 'completed', label: 'Completed Only' },
            { id: 'rejected', label: 'Rejected Only' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                filterStatus === f.id
                  ? 'bg-[#67523C] text-white border-[#67523C]'
                  : 'bg-white text-[#5B5146] border-[#67523C]/15 hover:bg-[#FAF7F0]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* History Records List */}
      {filteredHistory.length > 0 ? (
        <div className="space-y-3">
          {filteredHistory.map(order => {
            const isCompleted = order.status === 'completed';

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl p-4 border border-[#67523C]/15 shadow-cafe-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                {/* Left Info */}
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-sm text-[#312219]">
                      {order.orderNumber}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isCompleted ? 'bg-[#3F6E4D]/10 text-[#3F6E4D]' : 'bg-[#98382B]/10 text-[#98382B]'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-[#5B5146]">
                    <span className="flex items-center space-x-1 font-semibold text-[#312219]">
                      <MapPin className="w-3 h-3 text-[#67523C]" />
                      <span>{order.table?.tableNumber} • {order.table?.section}</span>
                    </span>
                    <span>•</span>
                    <span className="font-mono">
                      {formatPhone(order.customer?.phone)}
                    </span>
                  </div>

                  {/* Items summary */}
                  <p className="text-xs text-[#5B5146]">
                    {order.items.map(i => `${i.quantity}× ${i.name}`).join(', ')}
                  </p>

                  {/* Rejection Note if rejected */}
                  {order.rejectionReason && (
                    <p className="text-xs text-[#98382B] italic mt-1">
                      Reason: {order.rejectionReason}
                    </p>
                  )}
                </div>

                {/* Right Price & Time */}
                <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-[#67523C]/10">
                  <span className="font-serif font-bold text-base text-[#67523C] block">
                    {formatINR(order.grandTotal)}
                  </span>
                  <span className="text-[10px] text-[#5B5146]">
                    {new Date(order.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })} at{' '}
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 text-center border border-[#67523C]/10 max-w-md mx-auto">
          <History className="w-10 h-10 mx-auto text-[#D2C6A6] mb-2" />
          <h3 className="font-serif font-bold text-base text-[#312219]">
            No Archival Orders Found
          </h3>
          <p className="text-xs text-[#5B5146] mt-1">
            {searchQuery
              ? `No records matching "${searchQuery}".`
              : 'Completed and rejected dining sessions will be logged here for shift audit.'}
          </p>
        </div>
      )}
    </div>
  );
};

