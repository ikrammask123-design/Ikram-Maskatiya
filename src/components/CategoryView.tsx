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
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating' | 'featured'>('price-asc');
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
        // Strictly isolate Korean store products: K-store products only appear in K-store view
        if (p.isKoreanStore || p.category === 'k-store' || (p as any).koreanCategory) {
          return false;
        }

        if (selectedCategory !== 'all') {
          if (selectedCategory === 'lehenga-choli') {
            if (p.category !== 'lehenga-choli' && p.category !== 'Lehenga Choli') {
              return false;
            }
          } else if (p.category !== selectedCategory) {
            return false;
          }
        }
        if (selectedFabric !== 'all' && p.fabric !== selectedFabric) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = (p.name || p.title || '').toLowerCase().includes(q);
          const matchesFabric = (p.fabric || '').toLowerCase().includes(q);
          const matchesDesc = (p.description || '').toLowerCase().includes(q);
          const matchesWeave = p.weave ? p.weave.toLowerCase().includes(q) : false;
          return matchesName || matchesFabric || matchesDesc || matchesWeave;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return a.price - b.price; // Default: strictly low price to high price
      });
  }, [products, selectedCategory, selectedFabric, sortBy, searchQuery]);

  const categories: { id: CategoryId; label: string }[] = [
    { id: 'all', label: 'All Creations' },
    { id: 'kurtis', label: 'Kurtis' },
    { id: 'sarees', label: 'Sarees' },
    { id: 'lehenga-choli', label: 'Lehenga Choli' },
    { id: 'dresses', label: 'Dresses' },
    { id: 'accessories', label: 'Accessories' },
  ];

  const CATEGORY_SECTIONS: {
    id: CategoryId;
    title: string;
    subtitle: string;
    tagline: string;
  }[] = [
    {
      id: 'kurtis',
      title: 'Kurtis & Suit Sets',
      subtitle: 'Anarkali, Straight Silhouettes & Embroidered Cotton-Silk Ensembles',
      tagline: 'Artisanal Weaves & Festive Sets',
    },
    {
      id: 'sarees',
      title: 'Sarees',
      subtitle: 'Handloom, Kanjivaram, Organza & Pure Silk Masterpieces',
      tagline: 'Timeless Drapes & Certified Zari',
    },
    {
      id: 'lehenga-choli',
      title: 'Lehenga Choli',
      subtitle: 'Royal Bridal & Festive Semi-Stitched Kali Ensembles',
      tagline: 'Heavy Resham & Gold Zari Craft',
    },
    {
      id: 'dresses',
      title: 'Dresses & Gowns',
      subtitle: 'Contemporary Flowing Silhouettes, Ethnic Flared Gowns & Cape Ensembles',
      tagline: 'Modern Elegance & Festive Flairs',
    },
    {
      id: 'accessories',
      title: 'Fine Accessories & Jewelry',
      subtitle: 'Kundan Chokers, Temple Bangles & Handcrafted Potlis',
      tagline: 'Handcrafted Heritage Accents',
    },
  ];

  // Group products strictly by category when viewing All Creations
  const categoryGroups = useMemo(() => {
    return CATEGORY_SECTIONS.map((sec) => {
      const items = filteredProducts.filter((p) => {
        if (sec.id === 'lehenga-choli') {
          return p.category === 'lehenga-choli' || p.category === 'Lehenga Choli';
        }
        return p.category === sec.id;
      });
      return {
        ...sec,
        products: items,
      };
    }).filter((group) => group.products.length > 0);
  }, [filteredProducts]);

  // Featured cover details for Lehenga Choli
  const lehengaCoverProduct = useMemo(() => {
    return products.find((p) => p.id === 'lc-04') || products.find((p) => p.category === 'lehenga-choli');
  }, [products]);

  return (
    <div id="category-view-page" className="py-6 md:py-10 px-4 sm:px-8 md:px-16 max-w-[1360px] mx-auto">
      {/* Category Filter Pills on Top */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            id={`filter-cat-${cat.id}`}
            onClick={() => {
              setSelectedCategory(cat.id);
              setSelectedFabric('all');
            }}
            className={`px-5 py-2.5 rounded-full text-xs font-body font-semibold tracking-wider transition-all duration-200 cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[#6d0026] text-white shadow-md scale-102'
                : 'bg-[#fed9e2]/50 text-[#574144] hover:bg-[#fed9e2] hover:text-[#6d0026]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* DEDICATED LEHENGA CHOLI HERO COVER BANNER */}
      {selectedCategory === 'lehenga-choli' && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2B0914] via-[#4A0E1F] to-[#1F070E] text-white p-6 sm:p-10 mb-10 shadow-xl border border-[#AA314E]/40">
          {/* Subtle gold decorative glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFDEA5]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 left-10 w-80 h-80 bg-[#AA314E]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Text & Specs */}
            <div className="max-w-xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-[#FFDEA5]/20 backdrop-blur-md px-3.5 py-1 rounded-full border border-[#FFDEA5]/30 text-xs font-bold text-[#FFDEA5] mb-4">
                <Sparkles className="w-3.5 h-3.5 text-[#FFDEA5]" />
                <span>EXCLUSIVE BRIDAL & FESTIVE EDITION</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-3">
                Royal Lehenga Choli Collection
              </h1>
              <p className="text-xs sm:text-sm text-[#FFCCD5] leading-relaxed mb-6 font-body">
                Masterpiece bridal & festive ensembles crafted in Pure Silk, Art Silk & Satin Blend. Featuring heavy Resham & gold zari hand embroidery, shimmering sequin kali work, and full flare silhouettes with unstitched blouse and dupatta.
              </p>

              {/* Badges / Guarantees */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3 text-[11px] font-semibold">
                <span className="bg-white/10 backdrop-blur-xs px-3 py-1 rounded-xl border border-white/15 text-white">
                  ✓ Semi-Stitched Free Size
                </span>
                <span className="bg-white/10 backdrop-blur-xs px-3 py-1 rounded-xl border border-white/15 text-white">
                  ✓ Complete 3-Piece Sets
                </span>
                <span className="bg-white/10 backdrop-blur-xs px-3 py-1 rounded-xl border border-white/15 text-[#FFDEA5]">
                  ★ 4.8+ Rating (Surat Verified)
                </span>
              </div>
            </div>

            {/* Featured Lehenga Cover Photo Frame */}
            {lehengaCoverProduct && (
              <div
                onClick={() => onSelectProduct(lehengaCoverProduct)}
                className="group relative w-full sm:w-80 md:w-96 shrink-0 aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#FFDEA5]/40 cursor-pointer bg-black/40"
              >
                <img
                  src={lehengaCoverProduct.image}
                  alt={lehengaCoverProduct.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                
                {/* Cover Photo Badge */}
                <div className="absolute top-3 left-3 bg-[#6D0026]/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white border border-[#FFDEA5]/40 flex items-center gap-1.5 shadow-md">
                  <Sparkles className="w-3 h-3 text-[#FFDEA5]" />
                  <span>FEATURED CREATION</span>
                </div>

                {/* Bottom title on card */}
                <div className="absolute bottom-3 left-3 right-3 p-3 bg-black/60 backdrop-blur-md rounded-xl border border-white/10">
                  <p className="text-xs font-bold text-white line-clamp-1">
                    {lehengaCoverProduct.name}
                  </p>
                  <div className="flex items-center justify-between mt-1 text-[11px]">
                    <span className="font-bold text-[#FFDEA5]">₹{lehengaCoverProduct.price.toLocaleString('en-IN')}</span>
                    <span className="text-white/80 underline text-[10px] group-hover:text-white">View Details →</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Standard Category Header for other categories */}
      {selectedCategory !== 'lehenga-choli' && (
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
      )}

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
              <option value="price-asc">Price: Low to High (Default)</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="featured">Featured Curations</option>
            </select>
          </div>
        </div>
      </div>

      {/* Selected Category Range Note */}
      {selectedCategory !== 'all' && filteredProducts.length > 0 && (
        <div className="mb-6 flex items-center justify-between flex-wrap gap-2 text-xs text-[#574144] bg-[#fed9e2]/25 border border-[#debfc2]/40 px-4 py-2.5 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6d0026]" />
            <span className="font-semibold text-[#6d0026]">
              {filteredProducts.length} Creations Available
            </span>
          </div>
          <span className="text-[11px] font-medium text-[#1c1b1b]">
            Sorted by Price: ₹{filteredProducts[0]?.price.toLocaleString('en-IN')} → ₹{filteredProducts[filteredProducts.length - 1]?.price.toLocaleString('en-IN')}
          </span>
        </div>
      )}

      {/* Products Display: Grouped by category when "All Creations" is selected, or single category grid */}
      {filteredProducts.length > 0 ? (
        selectedCategory === 'all' ? (
          <div className="space-y-12 sm:space-y-16">
            {categoryGroups.map((group) => {
              const minPrice = group.products[0]?.price;
              const maxPrice = group.products[group.products.length - 1]?.price;
              return (
                <section key={group.id} id={`catalog-section-${group.id}`} className="scroll-mt-24">
                  {/* Category Section Header */}
                  <div className="bg-gradient-to-r from-[#fed9e2]/35 via-white to-[#fdf8f9] p-4 sm:p-5 rounded-2xl border border-[#debfc2]/40 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] sm:text-xs font-bold tracking-widest text-[#891738] uppercase">
                          {group.tagline}
                        </span>
                      </div>
                      <h3 className="font-display text-xl sm:text-2xl font-bold text-[#6d0026]">
                        {group.title}
                      </h3>
                      <p className="text-xs text-[#574144] mt-0.5 font-body">
                        {group.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-[#debfc2]/50 text-xs font-semibold text-[#6d0026] shadow-xs">
                        <span>{group.products.length} Designs</span>
                        <span className="text-[#8a7174]">•</span>
                        <span className="font-medium text-[#1c1b1b]">
                          ₹{minPrice?.toLocaleString('en-IN')} – ₹{maxPrice?.toLocaleString('en-IN')} (Low to High)
                        </span>
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory(group.id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-xs font-bold text-[#6d0026] hover:text-white bg-[#fed9e2]/70 hover:bg-[#6d0026] px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Only {group.title.split(' ')[0]}</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>

                  {/* Grid of products for this category */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {group.products.map((prod) => (
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
                </section>
              );
            })}
          </div>
        ) : (
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
        )
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
