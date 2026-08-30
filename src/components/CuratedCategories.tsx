import React from 'react';
import { CategoryId } from '../types';
import { CATEGORY_CARDS } from '../data/products';
import { ArrowRight } from 'lucide-react';

interface CuratedCategoriesProps {
  onSelectCategory: (categoryId: CategoryId) => void;
}

export const CuratedCategories: React.FC<CuratedCategoriesProps> = ({
  onSelectCategory,
}) => {
  return (
    <section
      id="curated-categories-section"
      className="py-12 sm:py-16 md:py-20 px-4 sm:px-8 max-w-[1360px] mx-auto w-full"
    >
      {/* Header Titles (Exact wording from video) */}
      <div className="text-center mb-10 sm:mb-12">
        <span className="font-body text-xs sm:text-sm font-bold text-[#891738] tracking-[0.25em] uppercase mb-2 block">
          BROWSE BY CATEGORY
        </span>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1c1b1b] tracking-tight">
          SHOP OUR COLLECTIONS
        </h2>
      </div>

      {/* Grid of Collection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {CATEGORY_CARDS.map((card) => (
          <button
            key={card.id}
            id={`category-card-${card.id}`}
            onClick={() => onSelectCategory(card.id)}
            className="group relative h-[380px] sm:h-[420px] rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-2xl transition-all duration-500 text-left focus:outline-none flex flex-col justify-end p-6 border border-[#debfc2]/40"
          >
            {/* Background Image */}
            <img
              src={card.image}
              alt={card.title}
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
            />

            {/* Dark & Rich Vignette Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity duration-300 group-hover:from-black/90" />

            {/* Content Layer */}
            <div className="relative z-10 flex flex-col">
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-1.5 tracking-tight drop-shadow-md">
                {card.title}
              </h3>
              <p className="font-body text-xs sm:text-sm text-[#ffd9dd] font-medium mb-4 line-clamp-1">
                {card.subtitle}
              </p>

              {/* Action link with smooth arrow translation */}
              <div className="inline-flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest group-hover:text-[#ffdea5] transition-colors">
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
