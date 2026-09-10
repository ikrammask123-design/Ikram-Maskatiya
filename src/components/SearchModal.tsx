import React, { useState } from 'react';
import { Search, X, Sparkles, ArrowRight } from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice } from './ProductCard';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currency: Currency;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  currency,
  onSelectProduct,
  onAddToCart,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const popularSearches = [
    'Rose Petal Silk',
    'Lucknowi Chikankari',
    'Banarasi Brocade',
    'Bodycon Maxi',
    'Korean Aesthetic',
    'Temple Jewellery',
    'Kanjivaram Saree',
  ];

  const results = query.trim()
    ? products.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.weave && p.weave.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q)
        );
      })
    : [];

  return (
    <div
      id="search-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 p-4"
    >
      <div className="bg-[#fcf9f8] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#debfc2]/40 overflow-hidden animate-scaleUp">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#debfc2]/30 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#6d0026]" />
          <input
            type="text"
            autoFocus
            placeholder="Search weaves, fabrics, sarees, jewelry..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 font-body text-sm sm:text-base text-[#1c1b1b] placeholder:text-[#8a7174] bg-transparent focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#8a7174] hover:text-[#1c1b1b] px-2 py-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-[#574144] hover:bg-[#fed9e2]/30 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 max-h-[65vh] overflow-y-auto">
          {!query ? (
            <div>
              <span className="text-xs font-semibold text-[#8a7174] uppercase tracking-wider block mb-3">
                Trending Searches in Salon
              </span>
              <div className="flex flex-wrap gap-2 mb-6">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3.5 py-1.5 bg-[#f0eded] hover:bg-[#ffd9dd] text-[#574144] hover:text-[#6d0026] text-xs font-medium rounded-full transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-[#aa314e]" />
                    {term}
                  </button>
                ))}
              </div>

              <div className="p-4 bg-[#ffd9dd]/30 rounded-xl border border-[#debfc2]/30">
                <h4 className="font-display text-sm font-semibold text-[#6d0026] mb-1">
                  Artisanal Heritage Curation
                </h4>
                <p className="text-xs text-[#574144] leading-relaxed">
                  Search by pure fabrics like Mulberry Silk, Kanchipuram Brocade, Chanderi, or search for handcrafted temple gold accessories.
                </p>
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold text-[#8a7174] uppercase tracking-wider block mb-1">
                {results.length} Creations Found
              </span>
              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="group p-3 bg-white hover:bg-[#ffd9dd]/20 rounded-xl border border-[#debfc2]/30 flex items-center gap-4 cursor-pointer transition-all hover:shadow-xs"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-20 object-cover rounded-lg bg-[#f6f3f2] shrink-0"
                  />
                  <div className="flex-1">
                    <span className="text-[10px] font-semibold text-[#891738] uppercase tracking-wider block">
                      {product.categoryLabel} • {product.fabric}
                    </span>
                    <h4 className="font-display text-sm font-semibold text-[#1c1b1b] group-hover:text-[#6d0026] transition-colors">
                      {product.name}
                    </h4>
                    {product.weave && (
                      <p className="text-xs text-[#574144] line-clamp-1">
                        {product.weave}
                      </p>
                    )}
                    <span className="font-display text-xs font-bold text-[#6d0026] block mt-1">
                      {formatPrice(product.price, currency)}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#8a7174] group-hover:text-[#6d0026] group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="font-display text-base font-semibold text-[#1c1b1b] mb-1">
                No creations found for "{query}"
              </p>
              <p className="text-xs text-[#574144]">
                Try searching for 'Silk', 'Kurti', 'Saree', or 'Gold'.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
