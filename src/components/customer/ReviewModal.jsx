import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ExternalLink, ShieldCheck } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

export const ReviewModal = ({ isOpen, onClose }) => {
  const { restaurant } = useRestaurant();
  if (!isOpen) return null;

  const handleOpenReview = () => {
    window.open(restaurant?.googleReviewUrl || 'https://google.com', '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-[#FAF7F0] w-full max-w-sm rounded-3xl p-6 shadow-cafe-lg border border-[#67523C]/20 text-center relative"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-[#D2C6A6]/30 hover:bg-[#D2C6A6]/60 text-[#312219] transition"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Star Icon Cluster */}
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#67523C] text-[#D2C6A6] flex items-center justify-center shadow-cafe-sm mb-4">
            <Star className="w-7 h-7 fill-current" />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-wider text-[#A86C3E]">
            Authentic Diner Feedback
          </span>

          <h3 className="font-serif font-bold text-xl text-[#312219] mt-1 mb-2">
            Share Your Experience
          </h3>

          <p className="text-xs text-[#5B5146] leading-relaxed mb-4">
            Your honest review helps our artisan kitchen and roasters maintain the highest culinary standards.
          </p>

          {/* Policy Compliance Note */}
          <div className="bg-[#D2C6A6]/25 border border-[#67523C]/10 rounded-xl p-3 text-left flex items-start space-x-2.5 mb-5">
            <ShieldCheck className="w-4 h-4 text-[#67523C] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#5B5146] leading-tight">
              We never incentivize or falsify reviews. You will be directed to Google’s verified business profile.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={handleOpenReview}
              className="w-full py-3.5 rounded-xl bg-[#67523C] hover:bg-[#493725] text-[#F5EFE4] font-semibold text-sm flex items-center justify-center space-x-2 transition shadow-cafe-sm"
            >
              <span>Write Review on Google</span>
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 text-xs text-[#5B5146] hover:text-[#312219] font-medium transition"
            >
              Maybe later
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

