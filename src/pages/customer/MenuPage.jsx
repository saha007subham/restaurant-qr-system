import React, { useState, useMemo } from 'react';
import { Search, X, Sparkles, Filter, Leaf, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FoodCard } from '../../components/customer/FoodCard';
import { CategoryPills } from '../../components/customer/CategoryPills';
import { useCustomer } from '../../context/CustomerContext';
import { useRestaurant } from '../../context/RestaurantContext';

export const MenuPage = () => {
  const { table } = useCustomer();
  const { menuItems, categories } = useRestaurant();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [chefSpecialOnly, setChefSpecialOnly] = useState(false);

  // Category item counts
  const itemCounts = useMemo(() => {
    const counts = { all: menuItems.length };
    categories.forEach(cat => {
      if (cat.id !== 'all') {
        counts[cat.id] = menuItems.filter(item => item.category === cat.id).length;
      }
    });
    return counts;
  }, [categories, menuItems]);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      // Category filter
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }

      // Veg filter
      if (vegOnly && !item.isVeg) {
        return false;
      }

      // Chef special filter
      if (chefSpecialOnly && !item.isChefSpecial) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesTag = item.tags?.some(t => t.toLowerCase().includes(query));
        return matchesName || matchesDesc || matchesTag;
      }

      return true;
    });
  }, [activeCategory, vegOnly, chefSpecialOnly, searchQuery]);

  return (
    <div className="space-y-4 pb-12">
      {/* Top Banner / Table context */}
      <div className="flex items-baseline justify-between pt-1">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#A86C3E]">
            Artisanal Kitchen
          </span>
          <h1 className="font-serif font-bold text-2xl text-[#312219]">
            Curated Menu
          </h1>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-semibold text-[#5B5146] bg-[#D2C6A6]/30 px-2.5 py-1 rounded-full border border-[#67523C]/10">
            {table ? table.tableNumber : 'Table 04'}
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="flex items-center bg-white rounded-2xl border border-[#67523C]/15 px-3.5 py-2.5 shadow-cafe-sm focus-within:border-[#67523C] focus-within:ring-2 focus-within:ring-[#67523C]/10 transition">
          <Search className="w-4 h-4 text-[#5B5146] shrink-0 mr-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cortado, sourdough, croissants..."
            className="w-full bg-transparent text-sm text-[#312219] placeholder-[#5B5146]/50 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 text-[#5B5146] hover:text-[#312219] rounded-full hover:bg-[#D2C6A6]/20 transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Bar */}
      <CategoryPills
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        itemCounts={itemCounts}
      />

      {/* Dietary Quick Toggles */}
      <div className="flex items-center space-x-2 pt-1 pb-1">
        {/* Veg Only Toggle */}
        <button
          onClick={() => setVegOnly(!vegOnly)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 border transition ${
            vegOnly
              ? 'bg-[#3F6E4D] text-white border-[#3F6E4D] shadow-sm'
              : 'bg-white text-[#5B5146] border-[#67523C]/15 hover:border-[#3F6E4D]/40'
          }`}
        >
          <Leaf className="w-3.5 h-3.5" />
          <span>Veg Only</span>
        </button>

        {/* Chef's Special Toggle */}
        <button
          onClick={() => setChefSpecialOnly(!chefSpecialOnly)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 border transition ${
            chefSpecialOnly
              ? 'bg-[#67523C] text-[#F5EFE4] border-[#67523C] shadow-sm'
              : 'bg-white text-[#5B5146] border-[#67523C]/15 hover:border-[#67523C]/40'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
          <span>Chef's Specials</span>
        </button>

        {(vegOnly || chefSpecialOnly || searchQuery) && (
          <button
            onClick={() => {
              setVegOnly(false);
              setChefSpecialOnly(false);
              setSearchQuery('');
              setActiveCategory('all');
            }}
            className="text-[11px] text-[#A86C3E] underline font-medium pl-1 hover:text-[#312219]"
          >
            Reset
          </button>
        )}
      </div>

      {/* Food Cards Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {filteredItems.map(item => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 bg-white/70 rounded-3xl border border-[#67523C]/10 p-6">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#D2C6A6]/30 flex items-center justify-center text-[#67523C] mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-[#312219]">
            No culinary items found
          </h3>
          <p className="text-xs text-[#5B5146] mt-1 max-w-xs mx-auto">
            We couldn't find matches for "{searchQuery}". Try searching for coffee, croissant, or clear your filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setVegOnly(false);
              setChefSpecialOnly(false);
              setActiveCategory('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-[#67523C] text-[#F5EFE4] text-xs font-semibold hover:bg-[#493725] transition"
          >
            Clear Filters & View All
          </button>
        </div>
      )}
    </div>
  );
};

