import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  PackageCheck, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldAlert, 
  Filter, 
  Sparkles, 
  AlertTriangle 
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { formatINR } from '../../utils/formatters';

export const StaffStockPage = () => {
  const { menuItems, categories, toggleItemAvailability } = useRestaurant();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState('all'); // 'all' | 'in_stock' | 'out_of_stock'

  // Summary counts
  const stats = useMemo(() => {
    const total = menuItems.length;
    const inStock = menuItems.filter(i => i.isAvailable !== false).length;
    const outOfStock = total - inStock;
    return { total, inStock, outOfStock };
  }, [menuItems]);

  // Filtered list
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const isAvailable = item.isAvailable !== false;

      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Stock status filter
      if (stockFilter === 'in_stock' && !isAvailable) return false;
      if (stockFilter === 'out_of_stock' && isAvailable) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description?.toLowerCase().includes(q);
        return matchesName || matchesDesc;
      }

      return true;
    });
  }, [menuItems, selectedCategory, stockFilter, searchQuery]);

  return (
    <div className="space-y-5 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#A86C3E] block">
            Floor & Kitchen Inventory
          </span>
          <h1 className="font-serif font-bold text-2xl text-[#312219]">
            Stock Availability & 86'd Items
          </h1>
          <p className="text-xs text-[#5B5146] mt-0.5">
            Mark items as In Stock or Out of Stock. Changes reflect instantaneously on customer QR menus.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-[#67523C]/15 shadow-cafe-sm">
          <div className="flex items-center justify-between text-[#5B5146] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Menu Items</span>
            <PackageCheck className="w-4 h-4 text-[#67523C]" />
          </div>
          <span className="font-serif font-bold text-2xl text-[#312219] block">
            {stats.total}
          </span>
          <span className="text-[10px] text-[#5B5146]">Active kitchen offerings</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#67523C]/15 shadow-cafe-sm">
          <div className="flex items-center justify-between text-[#3F6E4D] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Available In Stock</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="font-serif font-bold text-2xl text-[#3F6E4D] block">
            {stats.inStock}
          </span>
          <span className="text-[10px] text-[#5B5146]">Visible & orderable by diners</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#67523C]/15 shadow-cafe-sm">
          <div className="flex items-center justify-between text-[#98382B] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Out of Stock (86'd)</span>
            <XCircle className="w-4 h-4" />
          </div>
          <span className="font-serif font-bold text-2xl text-[#98382B] block">
            {stats.outOfStock}
          </span>
          <span className="text-[10px] text-[#5B5146]">Disabled from customer carts</span>
        </div>
      </div>

      {/* Staff Guardrail Notice */}
      <div className="bg-[#FAF7F0] p-3 rounded-2xl border border-[#67523C]/15 flex items-start space-x-2.5 text-xs text-[#5B5146]">
        <ShieldAlert className="w-4 h-4 text-[#A86C3E] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Staff Scope:</strong> Staff members are authorized to update real-time stock availability (In Stock / Out of Stock). Adding new items, editing descriptions, or altering prices requires Developer Suite access.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <div className="flex items-center bg-white rounded-xl border border-[#67523C]/15 px-3 py-2 text-xs shadow-xs">
              <Search className="w-3.5 h-3.5 text-[#5B5146] mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search coffee, croissant, sourdough..."
                className="w-full bg-transparent text-[#312219] outline-none"
              />
            </div>
          </div>

          {/* Availability Status Filter */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'in_stock', label: 'In Stock' },
              { id: 'out_of_stock', label: 'Out of Stock (86)' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setStockFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  stockFilter === f.id
                    ? 'bg-[#67523C] text-white border-[#67523C]'
                    : 'bg-white text-[#5B5146] border-[#67523C]/15 hover:bg-[#FAF7F0]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none pb-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition ${
                selectedCategory === cat.id
                  ? 'bg-[#312219] text-[#F5EFE4] border-[#312219]'
                  : 'bg-white text-[#5B5146] border-[#67523C]/15 hover:bg-[#FAF7F0]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Stock Cards Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map(item => {
            const isAvailable = item.isAvailable !== false;

            return (
              <motion.div
                key={item.id}
                layout
                className={`bg-white rounded-2xl p-4 border shadow-cafe-sm flex flex-col justify-between transition-all duration-200 ${
                  !isAvailable
                    ? 'border-[#98382B]/30 bg-[#FAF7F0]/40'
                    : 'border-[#67523C]/15'
                }`}
              >
                <div>
                  <div className="flex items-start space-x-3 mb-3">
                    {/* Thumbnail */}
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[#D2C6A6]/20">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className={`w-full h-full object-cover ${!isAvailable ? 'grayscale opacity-70' : ''}`}
                      />
                      {!isAvailable && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="text-[9px] font-bold text-white uppercase tracking-wider bg-[#98382B] px-1 py-0.2 rounded">
                            86'd
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between">
                        <h3 className="font-serif font-bold text-sm text-[#312219] leading-tight truncate">
                          {item.name}
                        </h3>
                      </div>
                      <span className="text-xs font-semibold text-[#A86C3E] block mt-0.5">
                        {formatINR(item.price)}
                      </span>
                      <p className="text-[11px] text-[#5B5146] line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stock Toggle Controls */}
                <div className="pt-3 border-t border-[#67523C]/10 flex items-center justify-between">
                  {/* Current Status Pill */}
                  <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                    isAvailable
                      ? 'bg-[#3F6E4D]/10 text-[#3F6E4D] border border-[#3F6E4D]/20'
                      : 'bg-[#98382B]/10 text-[#98382B] border border-[#98382B]/20'
                  }`}>
                    {isAvailable ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    <span>{isAvailable ? 'Available' : 'Out of Stock'}</span>
                  </span>

                  {/* 1-Click Action Button */}
                  <button
                    onClick={() => toggleItemAvailability(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs ${
                      isAvailable
                        ? 'bg-[#98382B] hover:bg-[#7e2d22] text-white'
                        : 'bg-[#3F6E4D] hover:bg-[#2e5238] text-white'
                    }`}
                  >
                    {isAvailable ? 'Set Out of Stock (86)' : 'Set In Stock'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 text-center border border-[#67523C]/10 max-w-md mx-auto">
          <PackageCheck className="w-10 h-10 mx-auto text-[#D2C6A6] mb-2" />
          <h3 className="font-serif font-bold text-base text-[#312219]">
            No Items Found
          </h3>
          <p className="text-xs text-[#5B5146] mt-1">
            {searchQuery
              ? `No menu items matching "${searchQuery}".`
              : 'Try clearing your category or stock filter.'}
          </p>
        </div>
      )}
    </div>
  );
};

