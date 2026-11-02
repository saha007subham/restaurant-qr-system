import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  FileSpreadsheet, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  MessageSquare, 
  Calendar, 
  Clock, 
  Phone, 
  Info 
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { formatPhone } from '../../utils/formatters';

export const DeveloperCustomersPage = () => {
  const { customers, exportCustomersCSV } = useRestaurant();
  const [filterConsent, setFilterConsent] = useState('all'); // 'all' | 'consented' | 'not_consented'
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectingCustomer, setInspectingCustomer] = useState(null);

  const stats = useMemo(() => {
    const total = customers.length;
    const consented = customers.filter(c => c.whatsappConsent).length;
    const rate = total > 0 ? Math.round((consented / total) * 100) : 0;
    return { total, consented, rate };
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      if (filterConsent === 'consented' && !c.whatsappConsent) return false;
      if (filterConsent === 'not_consented' && c.whatsappConsent) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return c.phone.includes(q) || c.lastTableVisited?.toLowerCase().includes(q);
      }
      return true;
    });
  }, [customers, filterConsent, searchQuery]);

  return (
    <div className="space-y-5 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#A86C3E] block">
            Regulatory Compliance
          </span>
          <h1 className="font-serif font-bold text-2xl text-[#312219]">
            Customer Records & Marketing Consent
          </h1>
        </div>

        <button
          onClick={exportCustomersCSV}
          className="px-4 py-2 rounded-xl bg-[#67523C] hover:bg-[#493725] text-white text-xs font-semibold flex items-center space-x-2 shadow-cafe-sm transition"
        >
          <FileSpreadsheet className="w-4 h-4 text-[#D4A373]" />
          <span>Export Consent Records (CSV)</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-[#67523C]/15 shadow-cafe-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B5146] block mb-1">
            Registered Table Diners
          </span>
          <span className="font-serif font-bold text-2xl text-[#312219] block">
            {stats.total}
          </span>
          <span className="text-[10px] text-[#5B5146]">Mobile phone numbers on record</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#67523C]/15 shadow-cafe-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#3F6E4D] block mb-1">
            WhatsApp Opt-In Rate
          </span>
          <span className="font-serif font-bold text-2xl text-[#3F6E4D] block">
            {stats.rate}%
          </span>
          <span className="text-[10px] text-[#5B5146]">{stats.consented} explicit opt-ins</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#67523C]/15 shadow-cafe-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#A86C3E] block mb-1">
            Phone Verification Mode
          </span>
          <span className="font-serif font-bold text-base text-[#312219] block mt-1">
            Unverified (Pre-OTP)
          </span>
          <span className="text-[10px] text-[#5B5146]">Awaiting SMS OTP integration</span>
        </div>
      </div>

      {/* Compliance Information Box */}
      <div className="bg-[#FAF7F0] p-4 rounded-3xl border border-[#67523C]/15 flex items-start space-x-3 text-xs text-[#5B5146]">
        <ShieldCheck className="w-5 h-5 text-[#3F6E4D] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold text-[#312219] block">Explicit Consent Policy:</span>
          WhatsApp consent is recorded with exact timestamp, versioning (<code className="font-mono">v1.0_2026</code>), and source (<code className="font-mono">qr_table_onboarding</code>). In accordance with data privacy laws, ordinary restaurant staff are blocked from exporting phone records.
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <div className="flex items-center bg-white rounded-xl border border-[#67523C]/15 px-3 py-2 text-xs shadow-xs">
            <Search className="w-3.5 h-3.5 text-[#5B5146] mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search phone number or table..."
              className="w-full bg-transparent text-[#312219] outline-none"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Diners' },
            { id: 'consented', label: 'WhatsApp Consented Only' },
            { id: 'not_consented', label: 'Unchecked / Withdrawn' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterConsent(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                filterConsent === f.id
                  ? 'bg-[#67523C] text-white border-[#67523C]'
                  : 'bg-white text-[#5B5146] border-[#67523C]/15 hover:bg-[#FAF7F0]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Records Table */}
      <div className="bg-white rounded-3xl border border-[#67523C]/15 shadow-cafe-sm overflow-hidden">
        <div className="p-4 border-b border-[#67523C]/10 flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-[#312219]">
            Customer Records ({filteredCustomers.length})
          </h3>
          <span className="text-xs text-[#5B5146]">
            Showing compliant records
          </span>
        </div>

        <div className="divide-y divide-[#67523C]/10 overflow-x-auto">
          {filteredCustomers.map(cust => (
            <div key={cust.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF7F0]/50 transition">
              <div className="flex items-start sm:items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#FAF7F0] border border-[#67523C]/20 flex items-center justify-center font-bold text-[#67523C] shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-sm text-[#312219]">
                      {formatPhone(cust.phone, cust.countryCode)}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D2C6A6]/30 text-[#5B5146] border border-[#67523C]/10">
                      Unverified
                    </span>
                  </div>
                  <div className="text-xs text-[#5B5146] flex flex-wrap items-center gap-x-2 mt-0.5">
                    <span>Visits: <strong>{cust.visitCount || 1}</strong></span>
                    <span>•</span>
                    <span>Last Table: <strong>{cust.lastTableVisited || 'Table 04'}</strong></span>
                    <span>•</span>
                    <span>{cust.lastVisitAt ? new Date(cust.lastVisitAt).toLocaleDateString() : 'Today'}</span>
                  </div>
                </div>
              </div>

              {/* Consent Badge & Audit Button */}
              <div className="flex items-center space-x-3">
                {cust.whatsappConsent ? (
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#3F6E4D]/10 text-[#3F6E4D] border border-[#3F6E4D]/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>WhatsApp Consented</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#5B5146]/10 text-[#5B5146] border border-[#67523C]/10">
                    <XCircle className="w-3.5 h-3.5 text-[#5B5146]/60" />
                    <span>Consent Unchecked</span>
                  </span>
                )}

                <button
                  onClick={() => setInspectingCustomer(cust)}
                  className="px-2.5 py-1 text-xs rounded-xl border border-[#67523C]/20 text-[#67523C] hover:bg-[#FAF7F0] transition"
                >
                  Inspect Audit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AUDIT DETAILS MODAL */}
      <AnimatePresence>
        {inspectingCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FAF7F0] w-full max-w-sm rounded-3xl p-6 border border-[#67523C]/20 shadow-cafe-lg text-[#312219]"
            >
              <div className="flex items-start justify-between pb-3 border-b border-[#67523C]/10 mb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#A86C3E]">
                    Consent Audit Log
                  </span>
                  <h3 className="font-serif font-bold text-lg">
                    {formatPhone(inspectingCustomer.phone)}
                  </h3>
                </div>
                <button
                  onClick={() => setInspectingCustomer(null)}
                  className="font-bold text-xs p-1 text-[#5B5146] hover:text-[#312219]"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-[#67523C]/10 flex justify-between">
                  <span className="text-[#5B5146]">WhatsApp Marketing Consent:</span>
                  <span className={`font-bold ${inspectingCustomer.whatsappConsent ? 'text-[#3F6E4D]' : 'text-[#98382B]'}`}>
                    {inspectingCustomer.whatsappConsent ? 'EXPLICIT OPT-IN' : 'NOT CONSENTED'}
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-[#67523C]/10 flex justify-between">
                  <span className="text-[#5B5146]">Consent Timestamp:</span>
                  <span className="font-mono text-[#312219]">
                    {inspectingCustomer.consentedAt ? new Date(inspectingCustomer.consentedAt).toLocaleString() : 'N/A'}
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-[#67523C]/10 flex justify-between">
                  <span className="text-[#5B5146]">Consent Policy Version:</span>
                  <span className="font-mono text-[#312219]">
                    {inspectingCustomer.consentVersion || 'v1.0_2026'}
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-[#67523C]/10 flex justify-between">
                  <span className="text-[#5B5146]">Opt-In Source Channel:</span>
                  <span className="font-mono text-[#312219]">
                    {inspectingCustomer.consentSource || 'qr_table_onboarding'}
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-[#67523C]/10 flex justify-between">
                  <span className="text-[#5B5146]">Verification State:</span>
                  <span className="text-[#A86C3E] font-semibold">Unverified (Pending OTP)</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setInspectingCustomer(null)}
                className="w-full mt-4 py-2.5 rounded-xl bg-[#67523C] hover:bg-[#493725] text-white text-xs font-semibold transition"
              >
                Close Audit
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

