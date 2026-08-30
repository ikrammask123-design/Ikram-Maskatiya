import React, { useState, useMemo } from 'react';
import { CategoryId, Product, Currency } from '../types';
import { ProductCard } from './ProductCard';
import { Filter, SlidersHorizontal, ArrowUpDown, Sparkles } from 'lucide-react';

interface CategoryViewProps {
  products: Product[];
  selectedCategory: CategoryId;
  setSelectedCategory: (cat: CategoryId) => void;
  currency: Currency;
  wishlistIds: string[];
  onToggleWishlist: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({
  products,
  selectedCategory,
  setSelectedCategory,
  currency,
  wishlistIds,
  onToggleWishlist,
  onSelectProduct,
  onAddToCart,
}) => {
  const [selectedFabric, setSelectedFabric] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fabrics = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.fabric) set.add(p.fabric);
    });
    return Array.from(set);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }
        if (selectedFabric !== 'all' && p.fabric !== selectedFabric) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = p.name.toLowerCase().includes(q);
          const matchesFabric = p.fabric.toLowerCase().includes(q);
          const matchesDesc = p.description.toLowerCase().includes(q);
          const matchesWeave = p.weave ? p.weave.toLowerCase().includes(q) : false;
          return matchesName || matchesFabric || matchesDesc || matchesWeave;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // featured default
      });
  }, [products, selectedCategory, selectedFabric, sortBy, searchQuery]);

  const categories: { id: CategoryId; label: string }[] = [
    { id: 'all', label: 'All Creations' },
    { id: 'sarees', label: 'Silk Sarees' },
    { id: 'kurtis', label: 'Kurtis' },
    { id: 'dresses', label: 'Dresses' },
    { id: 'accessories', label: 'Accessories' },
  ];

  return (
    <div id="category-view-page" className="py-8 md:py-12 px-5 md:px-16 max-w-[1280px] mx-auto">
      {/* Category Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="font-body text-xs font-semibold text-[#891738] tracking-[0.2em] uppercase mb-2 block">
          HAUTE COUTURE ARCHIVE
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-[#6d0026] mb-3">
          {selectedCategory === 'all'
            ? 'The Complete Collection'
            : selectedCategory === 'sarees'
            ? 'Pure Silk & Heirloom Sarees'
            : selectedCategory === 'kurtis'
            ? 'Artisanal Embroidered Kurtis'
            : selectedCategory === 'dresses'
            ? 'Contemporary Flowing Silhouettes'
            : 'Fine Kundan & Temple Accessories'}
        </h2>
        <p className="font-body text-sm md:text-base text-[#574144]">
          Handcrafted by generational artisans with pure natural fibers, certified zari, and timeless aesthetics.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            id={`filter-cat-${cat.id}`}
            onClick={() => {
              setSelectedCategory(cat.id);
              setSelectedFabric('all');
            }}
            className={`px-5 py-2.5 rounded-full text-xs font-body font-semibold tracking-wider transition-all duration-200 ${
              selectedCategory === cat.id
                ? 'bg-[#6d0026] text-white shadow-md scale-102'
                : 'bg-[#fed9e2]/50 text-[#574144] hover:bg-[#fed9e2] hover:text-[#6d0026]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#debfc2]/30 shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search input inside catalog */}
        <div className="w-full md:w-72 relative">
          <input
            type="text"
            placeholder="Search by weave, fabric..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-8 py-2 text-xs bg-[#f6f3f2] border border-transparent rounded-full focus:bg-white focus:border-[#debfc2] focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8a7174] hover:text-black"
            >
              ✕
            </button>
          )}
        </div>

        {/* Fabric & Sort Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end flex-wrap">
          {/* Fabric Filter */}
          <div className="flex items-center gap-1.5 text-xs text-[#574144]">
            <Filter className="w-3.5 h-3.5 text-[#6d0026]" />
            <select
              value={selectedFabric}
              onChange={(e) => setSelectedFabric(e.target.value)}
              className="bg-[#f6f3f2] border border-[#debfc2]/40 rounded-full px-3 py-1.5 text-xs font-medium text-[#1c1b1b] focus:outline-none cursor-pointer"
            >
              <option value="all">All Fabrics</option>
              {fabrics.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 text-xs text-[#574144]">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#6d0026]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#f6f3f2] border border-[#debfc2]/40 rounded-full px-3 py-1.5 text-xs font-medium text-[#1c1b1b] focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured Curations</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              currency={currency}
              isWishlisted={wishlistIds.includes(prod.id)}
              onToggleWishlist={onToggleWishlist}
              onSelectProduct={onSelectProduct}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#debfc2]/30 p-8">
          <Sparkles className="w-8 h-8 text-[#aa314e] mx-auto mb-3" />
          <h4 className="font-display text-xl font-semibold text-[#1c1b1b] mb-2">
            No matching creations found
          </h4>
          <p className="text-sm text-[#574144] mb-6">
            Try adjusting your fabric filters or searching for different keywords.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedFabric('all');
              setSearchQuery('');
            }}
            className="bg-[#6d0026] text-white px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
