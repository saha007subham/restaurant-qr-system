import React from 'react';
import { Coffee, Croissant, Sandwich, Pizza, GlassWater, Cake, Utensils } from 'lucide-react';
import { MENU_CATEGORIES } from '../../data/mockMenu';

const iconMap = {
  Utensils: Utensils,
  Coffee: Coffee,
  Croissant: Croissant,
  Sandwich: Sandwich,
  Pizza: Pizza,
  GlassWater: GlassWater,
  Cake: Cake
};

export const CategoryPills = ({ activeCategory, onSelectCategory, itemCounts }) => {
  return (
    <div className="py-2 overflow-x-auto scrollbar-none -mx-4 px-4 flex items-center space-x-2">
      {MENU_CATEGORIES.map((cat) => {
        const IconComponent = iconMap[cat.icon] || Utensils;
        const isActive = activeCategory === cat.id;
        const count = itemCounts[cat.id] || 0;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
              isActive
                ? 'bg-[#67523C] text-[#F5EFE4] border-[#67523C] shadow-cafe-sm scale-102'
                : 'bg-white/80 hover:bg-white text-[#5B5146] border-[#67523C]/15 hover:border-[#67523C]/40'
            }`}
          >
            <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-[#D2C6A6]' : 'text-[#67523C]'}`} />
            <span>{cat.name}</span>
            {count > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive
                    ? 'bg-[#493725] text-[#D2C6A6]'
                    : 'bg-[#D2C6A6]/30 text-[#67523C]'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

