import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Edit3, Trash2, QrCode, RefreshCw, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

export const DeveloperTablesPage = () => {
  const navigate = useNavigate();
  const { tables, addTable, updateTable, deleteTable, regenerateTableToken } = useRestaurant();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [formData, setFormData] = useState({
    tableNumber: '',
    section: 'Main Hall',
    capacity: 4
  });

  const handleOpenAdd = () => {
    setEditingTable(null);
    setFormData({ tableNumber: `Table ${String(tables.length + 1).padStart(2, '0')}`, section: 'Main Roastery Hall', capacity: 4 });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (table) => {
    setEditingTable(table);
    setFormData({ tableNumber: table.tableNumber, section: table.section, capacity: table.capacity });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.tableNumber || !formData.section) return;

    if (editingTable) {
      updateTable(editingTable.id, formData);
    } else {
      addTable(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#A86C3E] block">
            Floor Architecture
          </span>
          <h1 className="font-serif font-bold text-2xl text-[#312219]">
            Restaurant Tables & Seating
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/developer/qr-codes"
            className="px-3.5 py-2 rounded-xl bg-white border border-[#67523C]/20 text-xs font-semibold text-[#67523C] hover:bg-[#FAF7F0] transition flex items-center space-x-1.5 shadow-xs"
          >
            <QrCode className="w-4 h-4 text-[#A86C3E]" />
            <span>View All QR Codes</span>
          </Link>
          <button
            onClick={handleOpenAdd}
            className="px-3.5 py-2 rounded-xl bg-[#67523C] hover:bg-[#493725] text-white text-xs font-semibold flex items-center space-x-1.5 shadow-cafe-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Dining Table</span>
          </button>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map(table => (
          <motion.div
            key={table.id}
            layout
            className="bg-white rounded-3xl p-5 border border-[#67523C]/15 shadow-cafe-sm flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between pb-3 border-b border-[#67523C]/10 mb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#67523C] text-[#F5EFE4] flex items-center justify-center font-serif font-bold text-sm shadow-xs">
                    {table.tableNumber.replace(/\D/g, '') || '01'}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#312219]">
                      {table.tableNumber}
                    </h3>
                    <span className="text-xs text-[#5B5146] flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-[#A86C3E]" />
                      <span>{table.section}</span>
                    </span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  table.isActive ? 'bg-[#3F6E4D]/10 text-[#3F6E4D]' : 'bg-[#98382B]/10 text-[#98382B]'
                }`}>
                  {table.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Table Info & Token */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#5B5146]">
                  <span>Seating Capacity:</span>
                  <span className="font-bold text-[#312219]">{table.capacity} Guests</span>
                </div>
                <div className="bg-[#FAF7F0] p-2 rounded-xl border border-[#67523C]/10">
                  <span className="text-[10px] uppercase font-bold text-[#A86C3E] block">
                    Assigned Secure QR Token:
                  </span>
                  <span className="font-mono text-xs text-[#312219] break-all">
                    {table.qrToken}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 mt-3 border-t border-[#67523C]/10 flex items-center justify-between">
              <Link
                to={`/developer/qr-codes?selected=${table.qrToken}`}
                className="text-xs font-semibold text-[#67523C] hover:text-[#312219] flex items-center space-x-1"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Print QR Stand</span>
              </Link>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => regenerateTableToken(table.id)}
                  className="p-1.5 rounded-lg border border-[#67523C]/15 hover:bg-[#FAF7F0] text-[#5B5146]"
                  title="Regenerate unpredictable QR Token"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleOpenEdit(table)}
                  className="p-1.5 rounded-lg border border-[#67523C]/15 hover:bg-[#FAF7F0] text-[#67523C]"
                  title="Edit Table"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteTable(table.id)}
                  className="p-1.5 rounded-lg border border-[#98382B]/20 hover:bg-[#98382B]/10 text-[#98382B]"
                  title="Delete Table"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ADD / EDIT TABLE MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FAF7F0] w-full max-w-sm rounded-3xl p-6 border border-[#67523C]/20 shadow-cafe-lg text-[#312219]"
            >
              <h3 className="font-serif font-bold text-xl mb-3">
                {editingTable ? 'Edit Table Settings' : 'Add New Restaurant Table'}
              </h3>
              <form onSubmit={handleSave} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5B5146] mb-1">Table Number</label>
                  <input
                    type="text"
                    required
                    value={formData.tableNumber}
                    onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                    placeholder="e.g. Table 05"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#67523C]/20 bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5B5146] mb-1">Section / Area</label>
                  <input
                    type="text"
                    required
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    placeholder="e.g. Sunlit Patio Terrace"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#67523C]/20 bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5B5146] mb-1">Seating Capacity</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#67523C]/20 bg-white outline-none"
                  />
                </div>
                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2 rounded-xl border border-[#67523C]/20 text-xs font-semibold text-[#5B5146]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-[#67523C] hover:bg-[#493725] text-white text-xs font-semibold transition"
                  >
                    Save Table
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

