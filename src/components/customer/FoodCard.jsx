import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Clock, Sparkles, MessageSquarePlus, Check } from 'lucide-react';
import { formatINR } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { SpecialInstructionsModal } from './SpecialInstructionsModal';

export const FoodCard = ({ item }) => {
  const { items, addItem, updateQuantity, updateInstructions } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cartEntry = items.find(entry => entry.item.id === item.id);
  const quantity = cartEntry ? cartEntry.quantity : 0;
  const currentInstructions = cartEntry?.specialInstructions || '';
  const isAvailable = item.isAvailable !== false;

  const handleAddFirst = () => {
    if (!isAvailable) return;
    addItem(item, 1);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className={`bg-white rounded-2xl p-3.5 border shadow-cafe-sm hover:shadow-cafe transition-all duration-300 flex flex-col justify-between ${
          !isAvailable ? 'opacity-75 border-dashed border-[#5B5146]/30' : 'border-[#67523C]/10'
        }`}
      >
        <div>
          {/* Top Image & Badges */}
          <div className="relative w-full h-44 rounded-xl overflow-hidden mb-3 bg-[#D2C6A6]/20">
            <img
              src={item.imageUrl}
              alt={item.name}
              className={`w-full h-full object-cover transform hover:scale-105 transition-transform duration-500 ${
                !isAvailable ? 'grayscale opacity-75' : ''
              }`}
              loading="lazy"
            />

            {/* Out of stock overlay banner */}
            {!isAvailable && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#98382B] text-white shadow-sm">
                  Out of Stock
                </span>
              </div>
            )}
            
            {/* Top Badges */}
            <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
              {item.isChefSpecial && (
                <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#67523C] text-[#F5EFE4] shadow-sm">
                  <Sparkles className="w-3 h-3 text-[#D2C6A6]" />
                  <span>Chef's Choice</span>
                </span>
              )}
              {item.isBestseller && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#A86C3E] text-white shadow-sm">
                  Bestseller
                </span>
              )}
            </div>

            {/* Indian Veg / Non-Veg Indicator Icon */}
            <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-xs p-1 rounded-md shadow-sm">
              <div
                className={`w-4 h-4 border-2 flex items-center justify-center ${
                  item.isVeg ? 'border-[#3F6E4D]' : 'border-[#98382B]'
                }`}
                title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    item.isVeg ? 'bg-[#3F6E4D]' : 'bg-[#98382B]'
                  }`}
                />
              </div>
            </div>

            {/* Prep Time Badge */}
            <div className="absolute bottom-2 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[11px] px-2 py-0.5 rounded-full flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{item.prepTime}</span>
            </div>
          </div>

          {/* Title & Description */}
          <div className="mb-3">
            <div className="flex items-baseline justify-between mb-1">
              <h3 className="font-serif font-bold text-base text-[#312219] leading-snug">
                {item.name}
              </h3>
            </div>
            <p className="text-xs text-[#5B5146] line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>

        {/* Pricing and Cart Actions */}
        <div className="pt-2 border-t border-[#67523C]/10 flex items-center justify-between mt-auto">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#A86C3E] block">
              Price
            </span>
            <span className="font-serif font-bold text-lg text-[#312219]">
              {formatINR(item.price)}
            </span>
          </div>

          {/* Stepper or Add button or Out of Stock label */}
          {!isAvailable ? (
            <span className="px-3 py-1.5 rounded-xl bg-[#98382B]/10 text-[#98382B] text-xs font-bold border border-[#98382B]/20">
              Out of Stock
            </span>
          ) : quantity === 0 ? (
            <button
              onClick={handleAddFirst}
              className="px-4 py-2 rounded-xl bg-[#67523C] hover:bg-[#493725] text-[#F5EFE4] text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all shadow-cafe-sm active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          ) : (
            <div className="flex items-center space-x-1.5">
              {/* Note / Instruction button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className={`p-2 rounded-xl border transition ${
                  currentInstructions
                    ? 'bg-[#D2C6A6]/40 border-[#67523C] text-[#67523C]'
                    : 'bg-white border-[#67523C]/20 text-[#5B5146] hover:bg-[#FAF7F0]'
                }`}
                title={currentInstructions ? `Note: "${currentInstructions}"` : "Add special instructions"}
              >
                {currentInstructions ? (
                  <Check className="w-3.5 h-3.5 text-[#67523C]" />
                ) : (
                  <MessageSquarePlus className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Stepper */}
              <div className="flex items-center bg-[#FAF7F0] border border-[#67523C]/20 rounded-xl p-0.5">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="w-7 h-7 rounded-lg bg-white text-[#312219] flex items-center justify-center font-bold text-xs hover:bg-[#D2C6A6]/30 transition"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center text-xs font-bold text-[#312219]">
                  {quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="w-7 h-7 rounded-lg bg-[#67523C] text-[#F5EFE4] flex items-center justify-center font-bold text-xs hover:bg-[#493725] transition"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Special Instruction Modal */}
      <SpecialInstructionsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={item}
        currentInstructions={currentInstructions}
        onSave={(instructions) => updateInstructions(item.id, instructions)}
      />
    </>
  );
};

