import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UtensilsCrossed, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Check, 
  X, 
  Sparkles, 
  Clock, 
  Image as ImageIcon, 
  FolderPlus, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  Upload 
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { formatINR } from '../../utils/formatters';

const PRESET_CAFE_PHOTOS = [
  { label: 'Espresso / Cortado', url: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80' },
  { label: 'Latte / Flat White', url: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80' },
  { label: 'Hand Brew Pour Over', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80' },
  { label: 'Butter Croissant', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80' },
  { label: 'Pain au Chocolat', url: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=600&q=80' },
  { label: 'Mushroom Toast', url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80' },
  { label: 'Avocado Tartine', url: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?auto=format&fit=crop&w=600&q=80' },
  { label: 'Burrata Pizza', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80' },
  { label: 'Tiramisu Pot', url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80' },
  { label: 'Basque Cheesecake', url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80' }
];

export const DeveloperMenuPage = () => {
  const { 
    menuItems, 
    categories, 
    addMenuItem, 
    updateMenuItem, 
    toggleItemAvailability, 
    deleteMenuItem,
    addCategory,
    updateCategory,
    deleteCategory 
  } = useRestaurant();

  const [activeView, setActiveView] = useState('items'); // 'items' | 'categories'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Item Form Modal state
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemFormData, setItemFormData] = useState({
    name: '',
    category: 'coffee',
    price: '',
    description: '',
    prepTime: '8-10 mins',
    imageUrl: PRESET_CAFE_PHOTOS[0].url,
    isVeg: true,
    isChefSpecial: false,
    isBestseller: false,
    isAvailable: true
  });

  // Category Modal state
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');

  // Delete Confirmation state
  const [itemToDelete, setItemToDelete] = useState(null);

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description?.toLowerCase().includes(q);
        return matchesName || matchesDesc;
      }
      return true;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  // Open Add Item modal
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setItemFormData({
      name: '',
      category: categories[1]?.id || 'coffee',
      price: '',
      description: '',
      prepTime: '8-10 mins',
      imageUrl: PRESET_CAFE_PHOTOS[0].url,
      isVeg: true,
      isChefSpecial: false,
      isBestseller: false,
      isAvailable: true
    });
    setIsItemModalOpen(true);
  };

  // Open Edit Item modal
  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setItemFormData({
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description,
      prepTime: item.prepTime,
      imageUrl: item.imageUrl,
      isVeg: item.isVeg,
      isChefSpecial: item.isChefSpecial,
      isBestseller: item.isBestseller,
      isAvailable: item.isAvailable !== false
    });
    setIsItemModalOpen(true);
  };

  // Save Item
  const handleSaveItem = (e) => {
    e.preventDefault();
    if (!itemFormData.name || !itemFormData.price) return;

    if (editingItem) {
      updateMenuItem(editingItem.id, {
        ...itemFormData,
        price: Number(itemFormData.price)
      });
    } else {
      addMenuItem({
        ...itemFormData,
        price: Number(itemFormData.price)
      });
    }

    setIsItemModalOpen(false);
  };

  // Save Category
  const handleSaveCategory = (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    if (editingCategory) {
      updateCategory(editingCategory.id, { name: categoryName.trim() });
    } else {
      addCategory({ name: categoryName.trim() });
    }

    setCategoryName('');
    setIsCatModalOpen(false);
  };

  return (
    <div className="space-y-5 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#A86C3E] block">
            Culinary Engineering
          </span>
          <h1 className="font-serif font-bold text-2xl text-[#312219]">
            Menu & Pricing Management
          </h1>
        </div>

        {/* View Switcher & Action */}
        <div className="flex items-center space-x-2">
          <div className="bg-[#D2C6A6]/30 p-1 rounded-xl flex items-center space-x-1 border border-[#67523C]/15">
            <button
              onClick={() => setActiveView('items')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeView === 'items'
                  ? 'bg-[#67523C] text-white shadow-xs'
                  : 'text-[#5B5146] hover:text-[#312219]'
              }`}
            >
              Dishes ({menuItems.length})
            </button>
            <button
              onClick={() => setActiveView('categories')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeView === 'categories'
                  ? 'bg-[#67523C] text-white shadow-xs'
                  : 'text-[#5B5146] hover:text-[#312219]'
              }`}
            >
              Categories ({categories.length - 1})
            </button>
          </div>

          {activeView === 'items' ? (
            <button
              onClick={handleOpenAddModal}
              className="px-3.5 py-2 rounded-xl bg-[#67523C] hover:bg-[#493725] text-white text-xs font-semibold flex items-center space-x-1.5 shadow-cafe-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Dish</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setEditingCategory(null);
                setCategoryName('');
                setIsCatModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-[#67523C] hover:bg-[#493725] text-white text-xs font-semibold flex items-center space-x-1.5 shadow-cafe-sm transition"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW: MENU ITEMS */}
      {activeView === 'items' && (
        <div className="space-y-4">
          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <div className="flex items-center bg-white rounded-xl border border-[#67523C]/15 px-3 py-2 text-xs shadow-xs">
                <Search className="w-3.5 h-3.5 text-[#5B5146] mr-2 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter dishes by name or description..."
                  className="w-full bg-transparent text-[#312219] outline-none"
                />
              </div>
            </div>

            <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition ${
                    selectedCategory === cat.id
                      ? 'bg-[#67523C] text-white border-[#67523C]'
                      : 'bg-white text-[#5B5146] border-[#67523C]/15 hover:bg-[#FAF7F0]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Dishes Table / Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map(item => {
              const isAvailable = item.isAvailable !== false;

              return (
                <motion.div
                  key={item.id}
                  layout
                  className={`bg-white rounded-2xl p-4 border shadow-cafe-sm flex flex-col justify-between transition ${
                    !isAvailable ? 'opacity-60 border-dashed border-[#5B5146]/30' : 'border-[#67523C]/15'
                  }`}
                >
                  <div>
                    {/* Top image & badges */}
                    <div className="relative w-full h-36 rounded-xl overflow-hidden mb-3 bg-[#D2C6A6]/20">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#312219]/80 text-white backdrop-blur-xs">
                          {categories.find(c => c.id === item.category)?.name || item.category}
                        </span>
                        {item.isChefSpecial && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#67523C] text-[#F5EFE4]">
                            Chef's Pick
                          </span>
                        )}
                      </div>

                      {/* Veg indicator */}
                      <div className="absolute top-2 right-2 bg-white/90 p-1 rounded-md">
                        <div className={`w-3.5 h-3.5 border-2 flex items-center justify-center ${item.isVeg ? 'border-[#3F6E4D]' : 'border-[#98382B]'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-[#3F6E4D]' : 'bg-[#98382B]'}`} />
                        </div>
                      </div>

                      {/* Prep time */}
                      <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{item.prepTime}</span>
                      </span>
                    </div>

                    {/* Title & Desc */}
                    <div className="mb-2">
                      <div className="flex items-baseline justify-between">
                        <h3 className="font-serif font-bold text-base text-[#312219]">
                          {item.name}
                        </h3>
                        <span className="font-serif font-bold text-base text-[#67523C]">
                          {formatINR(item.price)}
                        </span>
                      </div>
                      <p className="text-xs text-[#5B5146] line-clamp-2 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Availability Toggle */}
                  <div className="pt-3 border-t border-[#67523C]/10 flex items-center justify-between">
                    {/* Availability Switch */}
                    <button
                      onClick={() => toggleItemAvailability(item.id)}
                      className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                        isAvailable
                          ? 'bg-[#3F6E4D]/10 text-[#3F6E4D] border border-[#3F6E4D]/20'
                          : 'bg-[#98382B]/10 text-[#98382B] border border-[#98382B]/20'
                      }`}
                      title={isAvailable ? "Item is in stock and visible to diners" : "Item 86'd / Archived"}
                    >
                      {isAvailable ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>{isAvailable ? 'In Stock' : '86’d (Archived)'}</span>
                    </button>

                    {/* Edit & Delete Buttons */}
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="p-1.5 rounded-lg border border-[#67523C]/20 hover:bg-[#D2C6A6]/30 text-[#67523C] transition"
                        title="Edit Dish & Price"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setItemToDelete(item)}
                        className="p-1.5 rounded-lg border border-[#98382B]/20 hover:bg-[#98382B]/10 text-[#98382B] transition"
                        title="Delete Dish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: CATEGORIES MANAGEMENT */}
      {activeView === 'categories' && (
        <div className="bg-white rounded-3xl p-6 border border-[#67523C]/15 shadow-cafe-sm space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#312219]">
            Active Culinary Categories ({categories.length - 1})
          </h3>
          <p className="text-xs text-[#5B5146]">
            Categories organize dishes for the customer menu and determine category pill filters.
          </p>

          <div className="divide-y divide-[#67523C]/10">
            {categories.filter(c => c.id !== 'all').map(cat => {
              const count = menuItems.filter(i => i.category === cat.id).length;

              return (
                <div key={cat.id} className="py-3 flex items-center justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#312219]">
                      {cat.name}
                    </h4>
                    <span className="text-[11px] text-[#5B5146]">
                      {count} {count === 1 ? 'dish' : 'dishes'} assigned
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setEditingCategory(cat);
                        setCategoryName(cat.name);
                        setIsCatModalOpen(true);
                      }}
                      className="px-2.5 py-1 text-xs rounded-lg border border-[#67523C]/20 text-[#67523C] hover:bg-[#FAF7F0]"
                    >
                      Rename
                    </button>
                    <button
                      onClick={() => deleteCategory(cat.id)}
                      disabled={count > 0}
                      className="px-2.5 py-1 text-xs rounded-lg border border-[#98382B]/20 text-[#98382B] hover:bg-[#98382B]/10 disabled:opacity-40"
                      title={count > 0 ? "Cannot delete category containing dishes" : "Delete category"}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ADD / EDIT DISH MODAL */}
      <AnimatePresence>
        {isItemModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FAF7F0] w-full max-w-lg rounded-3xl p-6 border border-[#67523C]/20 shadow-cafe-lg text-[#312219] max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between pb-3 border-b border-[#67523C]/10 mb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#A86C3E]">
                    Culinary Builder
                  </span>
                  <h3 className="font-serif font-bold text-xl text-[#312219]">
                    {editingItem ? 'Edit Culinary Offering' : 'Add New Menu Item'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsItemModalOpen(false)}
                  className="p-1 font-bold text-[#5B5146] hover:text-[#312219]"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveItem} className="space-y-4">
                {/* Name & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#5B5146] mb-1">Dish Name</label>
                    <input
                      type="text"
                      required
                      value={itemFormData.name}
                      onChange={(e) => setItemFormData({ ...itemFormData, name: e.target.value })}
                      placeholder="e.g. Saffron Cardamom Latte"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#67523C]/20 bg-white outline-none focus:border-[#67523C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5B5146] mb-1">Category</label>
                    <select
                      value={itemFormData.category}
                      onChange={(e) => setItemFormData({ ...itemFormData, category: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#67523C]/20 bg-white outline-none focus:border-[#67523C]"
                    >
                      {categories.filter(c => c.id !== 'all').map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price & Prep time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#5B5146] mb-1">Price in INR (₹)</label>
                    <input
                      type="number"
                      required
                      min={10}
                      step={5}
                      value={itemFormData.price}
                      onChange={(e) => setItemFormData({ ...itemFormData, price: e.target.value })}
                      placeholder="e.g. 280"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#67523C]/20 bg-white outline-none focus:border-[#67523C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5B5146] mb-1">Preparation Time</label>
                    <input
                      type="text"
                      value={itemFormData.prepTime}
                      onChange={(e) => setItemFormData({ ...itemFormData, prepTime: e.target.value })}
                      placeholder="e.g. 6-8 mins"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#67523C]/20 bg-white outline-none focus:border-[#67523C]"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-[#5B5146] mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={itemFormData.description}
                    onChange={(e) => setItemFormData({ ...itemFormData, description: e.target.value })}
                    placeholder="Describe culinary taste, origin, and texture..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#67523C]/20 bg-white outline-none focus:border-[#67523C] resize-none"
                  />
                </div>

                {/* Dietary Switches */}
                <div className="flex flex-wrap gap-4 pt-1">
                  <label className="flex items-center space-x-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={itemFormData.isVeg}
                      onChange={(e) => setItemFormData({ ...itemFormData, isVeg: e.target.checked })}
                      className="accent-[#3F6E4D]"
                    />
                    <span className="font-semibold text-[#3F6E4D]">Vegetarian</span>
                  </label>

                  <label className="flex items-center space-x-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={itemFormData.isChefSpecial}
                      onChange={(e) => setItemFormData({ ...itemFormData, isChefSpecial: e.target.checked })}
                      className="accent-[#67523C]"
                    />
                    <span className="font-semibold text-[#67523C]">Chef's Special</span>
                  </label>

                  <label className="flex items-center space-x-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={itemFormData.isBestseller}
                      onChange={(e) => setItemFormData({ ...itemFormData, isBestseller: e.target.checked })}
                      className="accent-[#A86C3E]"
                    />
                    <span className="font-semibold text-[#A86C3E]">Bestseller</span>
                  </label>

                  <label className="flex items-center space-x-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={itemFormData.isAvailable}
                      onChange={(e) => setItemFormData({ ...itemFormData, isAvailable: e.target.checked })}
                      className="accent-[#312219]"
                    />
                    <span className="font-semibold text-[#312219]">Available for Ordering</span>
                  </label>
                </div>

                {/* Image URL & Preset Selection */}
                <div>
                  <label className="block text-xs font-semibold text-[#5B5146] mb-1">Food Image URL</label>
                  <input
                    type="url"
                    value={itemFormData.imageUrl}
                    onChange={(e) => setItemFormData({ ...itemFormData, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#67523C]/20 bg-white outline-none focus:border-[#67523C] mb-2"
                  />
                  
                  {/* Preset library quick pick */}
                  <span className="text-[10px] text-[#5B5146] block mb-1.5 font-medium">Or pick from curated café photo library:</span>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-white rounded-xl border border-[#67523C]/10">
                    {PRESET_CAFE_PHOTOS.map(p => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => setItemFormData({ ...itemFormData, imageUrl: p.url })}
                        className={`text-[10px] px-2 py-1 rounded-lg border transition ${
                          itemFormData.imageUrl === p.url
                            ? 'bg-[#67523C] text-white border-[#67523C]'
                            : 'bg-[#FAF7F0] text-[#5B5146] border-[#67523C]/10'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex space-x-2 pt-3 border-t border-[#67523C]/10">
                  <button
                    type="button"
                    onClick={() => setIsItemModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-[#67523C]/20 text-xs font-semibold text-[#5B5146]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#67523C] hover:bg-[#493725] text-white text-xs font-semibold transition shadow-cafe-sm"
                  >
                    {editingItem ? 'Save Changes' : 'Create Dish'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CATEGORY MODAL */}
      <AnimatePresence>
        {isCatModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FAF7F0] w-full max-w-sm rounded-3xl p-6 border border-[#67523C]/20 shadow-cafe-lg text-[#312219]"
            >
              <h3 className="font-serif font-bold text-lg mb-2">
                {editingCategory ? 'Rename Category' : 'Add New Category'}
              </h3>
              <form onSubmit={handleSaveCategory} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#5B5146] mb-1">Category Name</label>
                  <input
                    type="text"
                    required
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="e.g. Woodfired Flatbreads"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#67523C]/20 bg-white outline-none focus:border-[#67523C]"
                    autoFocus
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsCatModalOpen(false)}
                    className="flex-1 py-2 rounded-xl border border-[#67523C]/20 text-xs font-semibold text-[#5B5146]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-[#67523C] hover:bg-[#493725] text-white text-xs font-semibold transition"
                  >
                    Save Category
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {itemToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FAF7F0] w-full max-w-sm rounded-3xl p-6 border border-[#67523C]/20 shadow-cafe-lg text-[#312219]"
            >
              <h3 className="font-serif font-bold text-lg text-[#98382B] mb-2">Delete Dish?</h3>
              <p className="text-xs text-[#5B5146] mb-4">
                Are you sure you want to permanently remove <strong>{itemToDelete.name}</strong> from the restaurant menu?
              </p>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setItemToDelete(null)}
                  className="flex-1 py-2 rounded-xl border border-[#67523C]/20 text-xs font-semibold text-[#5B5146]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteMenuItem(itemToDelete.id);
                    setItemToDelete(null);
                  }}
                  className="flex-1 py-2 rounded-xl bg-[#98382B] hover:bg-[#7e2d22] text-white text-xs font-semibold transition"
                >
                  Delete Dish
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

