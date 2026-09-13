import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CategoryId } from '../types';
import { CATEGORY_CARDS } from '../data/products';

interface CuratedCategoriesProps {
  onSelectCategory: (categoryId: CategoryId) => void;
}

export const CuratedCategories: React.FC<CuratedCategoriesProps> = ({
  onSelectCategory,
}) => {
  return (
    <section
      id="curated-categories-section"
      className="py-12 sm:py-16 px-4 sm:px-8 max-w-[1360px] mx-auto w-full"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
        <div>
          <span className="font-body text-xs sm:text-sm font-bold text-[#891738] tracking-[0.25em] uppercase mb-1.5 block">
            ARTISANAL ATELIER
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1c1b1b] tracking-tight">
            Shop Our Collections
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-[#574144] max-w-md">
          Explore pure handloom silk sarees, royal bridal lehengas, festive anarkali kurtis, and contemporary gowns.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {CATEGORY_CARDS.map((card) => (
          <div
            key={card.id}
            onClick={() => onSelectCategory(card.id as CategoryId)}
            className="group relative rounded-3xl overflow-hidden aspect-3/4 bg-[#f6f3f2] border border-[#debfc2]/40 shadow-xs hover:shadow-xl transition-all duration-500 cursor-pointer"
          >
            {/* Background Image */}
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
              loading="lazy"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent transition-opacity duration-300 group-hover:from-black/85" />

            {/* Content Bottom */}
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 text-white flex flex-col justify-end">
              <span className="text-[10px] tracking-widest uppercase font-semibold text-[#ffd9dd] mb-1">
                Handcrafted
              </span>
              <h3 className="font-display text-lg sm:text-2xl font-bold tracking-tight text-white mb-1 group-hover:text-[#ffd9dd] transition-colors">
                {card.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-white/80 line-clamp-1 mb-3">
                {card.subtitle}
              </p>

              <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-[#ffb2bc] transition-colors">
                <span>Explore Category</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
