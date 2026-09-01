import React, { useState, useEffect } from 'react';
import { CategoryId } from '../types';
import { CATEGORY_CARDS } from '../data/products';
import { ArrowRight } from 'lucide-react';

interface CuratedCategoriesProps {
  onSelectCategory: (categoryId: CategoryId) => void;
}

interface CategoryCardItemProps {
  card: {
    id: CategoryId;
    title: string;
    subtitle: string;
    image: string;
    images?: string[];
  };
  index: number;
  onSelectCategory: (categoryId: CategoryId) => void;
}

const CategoryCardItem: React.FC<CategoryCardItemProps> = ({
  card,
  index,
  onSelectCategory,
}) => {
  const images = card.images && card.images.length > 0 ? card.images : [card.image];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    // Stagger initial delays slightly so cards don't all flip at the exact same millisecond
    const delay = 3200 + index * 600;
    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % images.length);
    }, delay);

    return () => clearInterval(interval);
  }, [images.length, index]);

  return (
    <button
      id={`category-card-${card.id}`}
      onClick={() => onSelectCategory(card.id)}
      className="group relative h-[380px] sm:h-[420px] rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-2xl transition-all duration-500 text-left focus:outline-none flex flex-col justify-end p-6 border border-[#debfc2]/40"
    >
      {/* Background Images with smooth Cross-Fade Transition */}
      {images.map((imgSrc, imgIdx) => {
        const isCurrent = imgIdx === activeImageIndex;
        return (
          <img
            key={imgSrc + imgIdx}
            src={imgSrc}
            alt={`${card.title} preview ${imgIdx + 1}`}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 ease-in-out group-hover:scale-108 ${
              isCurrent ? 'opacity-100 scale-100 z-0' : 'opacity-0 scale-105 pointer-events-none -z-10'
            }`}
          />
        );
      })}

      {/* Dark & Rich Vignette Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity duration-300 group-hover:from-black/90 z-[1]" />

      {/* Slide Indicators on top right if multiple images */}
      {images.length > 1 && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15">
          {images.map((_, dotIdx) => (
            <span
              key={dotIdx}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                dotIdx === activeImageIndex ? 'w-4 bg-[#ffdea5]' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      )}

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
  );
};

export const CuratedCategories: React.FC<CuratedCategoriesProps> = ({
  onSelectCategory,
}) => {
  return (
    <section
      id="curated-categories-section"
      className="py-12 sm:py-16 md:py-20 px-4 sm:px-8 max-w-[1360px] mx-auto w-full"
    >
      {/* Header Titles */}
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
        {CATEGORY_CARDS.map((card, index) => (
          <CategoryCardItem
            key={card.id}
            card={card}
            index={index}
            onSelectCategory={onSelectCategory}
          />
        ))}
      </div>
    </section>
  );
};
