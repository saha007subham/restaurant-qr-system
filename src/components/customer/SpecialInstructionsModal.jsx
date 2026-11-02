import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquareQuote, Check } from 'lucide-react';

export const SpecialInstructionsModal = ({ isOpen, onClose, item, currentInstructions, onSave }) => {
  const [instructions, setInstructions] = useState('');

  useEffect(() => {
    if (isOpen) {
      setInstructions(currentInstructions || '');
    }
  }, [isOpen, currentInstructions]);

  if (!isOpen || !item) return null;

  const handleSave = () => {
    onSave(instructions.trim());
    onClose();
  };

  const sampleTags = [
    "Extra hot",
    "Less sugar",
    "No ice",
    "Oat milk preference",
    "Allergy: nuts",
    "Gluten sensitive"
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 200, opacity: 0 }}
          className="bg-[#FAF7F0] w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-cafe-lg border border-[#67523C]/20 text-[#312219]"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-[11px] font-semibold tracking-wider uppercase text-[#A86C3E]">
                Kitchen Notes
              </span>
              <h3 className="font-serif font-bold text-xl text-[#312219] leading-tight">
                Special Instructions
              </h3>
              <p className="text-xs text-[#5B5146] mt-0.5">
                For: <span className="font-semibold text-[#312219]">{item.name}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-[#D2C6A6]/30 hover:bg-[#D2C6A6]/60 text-[#312219] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick presets */}
          <div className="mb-4">
            <label className="text-xs font-semibold text-[#5B5146] block mb-2">
              Common Requests:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {sampleTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    if (instructions.includes(tag)) return;
                    setInstructions(prev => (prev ? `${prev}, ${tag}` : tag));
                  }}
                  className="px-2.5 py-1 text-xs rounded-full bg-white border border-[#67523C]/15 hover:border-[#67523C] text-[#5B5146] transition"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Text Area */}
          <div className="relative mb-5">
            <textarea
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Please make it extra hot with less sweetness..."
              maxLength={150}
              className="w-full p-3.5 text-sm rounded-xl border border-[#67523C]/20 focus:border-[#67523C] focus:ring-1 focus:ring-[#67523C] bg-white text-[#312219] placeholder-[#5B5146]/50 outline-none resize-none transition"
            />
            <span className="absolute bottom-2.5 right-3 text-[10px] text-[#5B5146]/60">
              {instructions.length}/150
            </span>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-[#67523C]/30 text-[#67523C] font-semibold text-sm hover:bg-[#D2C6A6]/20 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 py-3 rounded-xl bg-[#67523C] hover:bg-[#493725] text-[#F5EFE4] font-semibold text-sm flex items-center justify-center space-x-1.5 transition shadow-cafe-sm"
            >
              <Check className="w-4 h-4" />
              <span>Save Note</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

