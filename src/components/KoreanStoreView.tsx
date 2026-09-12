import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ArrowLeft,
  Truck,
  CreditCard,
  RotateCcw,
  Search,
  CheckCircle2,
  SlidersHorizontal,
  Flame,
  ArrowUpRight,
  Coffee,
  Briefcase,
  PartyPopper
} from 'lucide-react';
import {
  K_STORE_SECTIONS,
  K_PRODUCTS,
  KProduct,
  getProductStoreSection,
  KoreanCategoryKey
} from '../data/koreanStoreData';
import { KoreanProductCard } from './KoreanProductCard';
import { Currency, Product } from '../types';

interface KoreanStoreViewProps {
  currency: Currency;
  wishlistIds: string[];
  onToggleWishlist: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onBackToStore: () => void;
}

type SectionFilterKey = 'all' | 'party-glam' | 'campus-cafe' | 'office-brunch';

export const KoreanStoreView: React.FC<KoreanStoreViewProps> = ({
  currency,
  wishlistIds,
  onToggleWishlist,
  onSelectProduct,
  onAddToCart,
  onBuyNow,
  onBackToStore,
}) => {
  const [activeSection, setActiveSection] = useState<SectionFilterKey>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'discount'>('price-asc');

  // Filtered & Sorted List of Products (Every product belongs to exactly ONE section)
  const processedProducts = useMemo(() => {
    let list = [...K_PRODUCTS];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.color.toLowerCase().includes(q) ||
          (p.koreanTagline && p.koreanTagline.toLowerCase().includes(q)) ||
          p.categoryLabel.toLowerCase().includes(q)
      );
    }

    // Sort order (Defaults strictly to Low to High)
    if (sortBy === 'price-asc' || sortBy === 'featured') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'discount') {
      list.sort((a, b) => {
        const discA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
        const discB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
        return discB - discA;
      });
    }

    return list;
  }, [searchQuery, sortBy]);

  // Products grouped strictly by the 3 requested sections
  const partyProducts = useMemo(
    () => processedProducts.filter((p) => getProductStoreSection(p) === 'party-glam'),
    [processedProducts]
  );

  const campusProducts = useMemo(
    () => processedProducts.filter((p) => getProductStoreSection(p) === 'campus-cafe'),
    [processedProducts]
  );

  const officeProducts = useMemo(
    () => processedProducts.filter((p) => getProductStoreSection(p) === 'office-brunch'),
    [processedProducts]
  );

  const totalResults = processedProducts.length;

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(`section-${sectionId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FFFDF9] text-[#1C1B1B] flex flex-col antialiased selection:bg-[#FFB6C1]/40 selection:text-[#9F1239]">
      {/* ------------------------------------------------------------------------- */}
      {/* TOP NAVIGATION BAR: RETURN TO COUTURE & STORE BADGE                       */}
      {/* ------------------------------------------------------------------------- */}
      <div className="bg-[#FFF5F7] border-b border-[#FFCCD5]/80 py-2.5 px-4 sm:px-6 sticky top-0 z-30 backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <button
            id="btn-back-to-atelier"
            onClick={onBackToStore}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#E11D48] hover:text-[#9F1239] transition-all py-1.5 px-3.5 rounded-full bg-white shadow-xs border border-[#FFCCD5] hover:scale-102 active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Main Boutique</span>
          </button>

          {/* 100% Female Badge & Price Anchor */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-[#BE123C] bg-white px-3 py-1 rounded-full border border-[#FDA4AF] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#FF4D6D] animate-ping" />
              <span>100% Female Fits • 3 Curated Sections</span>
            </div>
            <span className="text-[11px] font-bold bg-gradient-to-r from-[#FF4D6D] to-[#E11D48] text-white px-3 py-1 rounded-full shadow-xs tracking-wider flex items-center gap-1">
              <span>♡</span>
              <span>FROM ₹549</span>
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. STORE HEADER BANNER: Clean, chic, no duplicate photo widgets           */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF5F7] via-[#FFF9FA] to-[#FFFDF9] border-b border-[#FFE4E8] pt-8 sm:pt-10 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8">
        {/* Soft Ambient Glows */}
        <div className="absolute top-0 -left-16 w-80 h-80 bg-[#FFB6C1]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#DDD6FE]/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl">
              {/* Category Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-xs px-3.5 py-1 rounded-full border border-[#FFCCD5] shadow-2xs text-xs font-bold text-[#E11D48] mb-3 tracking-wider">
                <Sparkles className="w-3.5 h-3.5 fill-[#FF4D6D] text-[#FF4D6D]" />
                <span className="font-mono uppercase">ZEVIOZA KOREAN STORE</span>
                <span className="text-[#FDA4AF]">•</span>
                <span className="text-[#7C3AED] font-semibold">한국 스토어</span>
              </div>

              {/* Store Title */}
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#1C1B1B] leading-tight">
                Korean Store <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D6D] via-[#D946EF] to-[#7C3AED] font-serif italic">Curated Fits</span>
              </h1>

              {/* Description specifying the 3 sections */}
              <p className="mt-2.5 text-xs sm:text-sm text-[#574144] font-body leading-relaxed max-w-2xl">
                Curated specifically for young women and college girls across 3 distinct lifestyle moments:
                <strong className="text-[#BE123C] font-semibold"> Party & Evening Glam</strong>,
                <strong className="text-[#7C3AED] font-semibold"> Campus & Cafe Everyday</strong>, and
                <strong className="text-[#C026D3] font-semibold"> Office & Weekend Brunch</strong>.
              </p>

              {/* Trust Badges */}
              <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
                <span className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-[#A7F3D0] text-[#065F46] font-semibold shadow-2xs">
                  <Truck className="w-3 h-3 text-[#059669]" />
                  <span>Free Delivery</span>
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-[#FFCCD5] text-[#BE123C] font-semibold shadow-2xs">
                  <CreditCard className="w-3 h-3 text-[#FF4D6D]" />
                  <span>COD Available</span>
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-[#DDD6FE] text-[#6D28D9] font-semibold shadow-2xs">
                  <RotateCcw className="w-3 h-3 text-[#7C3AED]" />
                  <span>7-Day Returns</span>
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-[#FECDD3] text-[#9F1239] font-semibold shadow-2xs">
                  <CheckCircle2 className="w-3 h-3 text-[#FF4D6D]" />
                  <span>100% Female Verified</span>
                </span>
              </div>
            </div>

            {/* Luxury Korean Boutique Stat Strip */}
            <div className="bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-3xl border-2 border-[#FFCCD5] shadow-xs flex flex-col justify-center gap-3 shrink-0 max-w-sm">
              <div className="flex items-center justify-between text-xs font-bold text-[#BE123C]">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 fill-[#FF4D6D] text-[#FF4D6D]" />
                  <span>3 KOREAN CATEGORIES</span>
                </span>
                <span className="text-[11px] text-[#7C3AED] font-mono font-extrabold bg-[#F3EEFF] px-2 py-0.5 rounded-full">
                  15 VERIFIED FITS
                </span>
              </div>
              <div className="text-xs text-[#574144] leading-relaxed">
                Explore dedicated style aisles below: <strong className="text-[#BE123C]">Party Glam</strong>, <strong className="text-[#7C3AED]">Campus Cafe</strong>, and <strong className="text-[#C026D3]">Office Brunch</strong> with verified fabric & size guides.
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-[#FFE4E8]">
                <span className="text-[11px] font-bold text-[#059669] bg-[#ECFDF5] px-2.5 py-1 rounded-full border border-[#A7F3D0]">
                  ✓ In Stock Ready to Dispatch
                </span>
                <span className="text-[11px] font-bold text-[#E11D48] bg-[#FFF1F2] px-2.5 py-1 rounded-full border border-[#FECDD3]">
                  All Sizes S–XXL
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. THE 3 BIG KOREAN CATEGORIES (CATEGORY CARDS WITH IMAGES)               */}
      {/* ========================================================================= */}
      <section className="bg-[#FFFDF9] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 border-b border-[#FFE4E8]">
        <div className="max-w-7xl mx-auto">
          {/* Section Heading */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#E11D48] mb-1.5">
                <Sparkles className="w-3.5 h-3.5 fill-[#FF4D6D] text-[#FF4D6D]" />
                <span>EXPLORE BY CATEGORY</span>
                <span className="text-[#FDA4AF]">•</span>
                <span className="text-[#7C3AED] font-bold">한국 패션 카테고리</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-[#1C1B1B] tracking-tight">
                Korean Fashion <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D6D] via-[#D946EF] to-[#7C3AED]">Lifestyle Categories</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#574144] mt-1.5 max-w-2xl font-body leading-relaxed">
                Click any category card to filter and explore hand-picked outfits tailored for that vibe.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                id="btn-korean-view-all-categories"
                onClick={() => {
                  setActiveSection('all');
                  scrollToSection('party-glam');
                }}
                className={`text-xs font-bold px-4 py-2 rounded-full border transition-all cursor-pointer ${
                  activeSection === 'all'
                    ? 'bg-[#1C1B1B] text-white border-[#1C1B1B] shadow-xs'
                    : 'bg-white text-[#574144] border-[#FFCCD5] hover:border-[#FF4D6D]'
                }`}
              >
                View All Categories ({totalResults})
              </button>
            </div>
          </div>

          {/* 3 Large, Immersive Category Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {K_STORE_SECTIONS.map((section) => {
              const isSelected = activeSection === section.id;
              const sectionFitsCount =
                section.id === 'party-glam'
                  ? partyProducts.length
                  : section.id === 'campus-cafe'
                  ? campusProducts.length
                  : officeProducts.length;

              return (
                <div
                  key={section.id}
                  id={`korean-category-card-${section.id}`}
                  onClick={() => {
                    setActiveSection(section.id);
                    scrollToSection(section.id);
                  }}
                  className={`group relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-end min-h-[400px] sm:min-h-[440px] bg-[#1C1B1B] border-2 ${
                    isSelected
                      ? `ring-4 shadow-xl scale-[1.01] ${
                          section.id === 'party-glam'
                            ? 'ring-[#FF4D6D]/40 border-[#FF4D6D]'
                            : section.id === 'campus-cafe'
                            ? 'ring-[#7C3AED]/40 border-[#7C3AED]'
                            : 'ring-[#C026D3]/40 border-[#C026D3]'
                        }`
                      : `${section.border} hover:shadow-xl hover:-translate-y-1`
                  }`}
                >
                  {/* Category Image with Smooth Zoom */}
                  <img
                    src={section.image}
                    alt={section.title}
                    className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105 opacity-90"
                    loading="lazy"
                  />

                  {/* Gradient Overlay for Typography Contrast */}
                  <div
                    className={`absolute inset-0 transition-opacity duration-300 ${
                      isSelected
                        ? 'bg-gradient-to-t from-black/95 via-black/60 to-black/25'
                        : 'bg-gradient-to-t from-black/90 via-black/50 to-black/15 group-hover:from-black/95 group-hover:via-black/55'
                    }`}
                  />

                  {/* Top Floating Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
                    <span
                      className={`text-[10px] font-black tracking-wider uppercase px-3 py-1 rounded-full shadow-sm backdrop-blur-md text-white flex items-center gap-1.5 ${
                        section.id === 'party-glam'
                          ? 'bg-[#FF4D6D]/90'
                          : section.id === 'campus-cafe'
                          ? 'bg-[#7C3AED]/90'
                          : 'bg-[#C026D3]/90'
                      }`}
                    >
                      {section.id === 'party-glam' && <PartyPopper className="w-3.5 h-3.5" />}
                      {section.id === 'campus-cafe' && <Coffee className="w-3.5 h-3.5" />}
                      {section.id === 'office-brunch' && <Briefcase className="w-3.5 h-3.5" />}
                      <span>{section.badge}</span>
                    </span>

                    <span className="text-[11px] font-bold text-white bg-black/65 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 shadow-xs">
                      From ₹{section.startingPrice} • {sectionFitsCount} Fits
                    </span>
                  </div>

                  {/* Active Indicator Pin */}
                  {isSelected && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white text-[#1C1B1B] text-[10px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                      <span>Viewing Category</span>
                    </div>
                  )}

                  {/* Bottom Content Card */}
                  <div className="relative z-10 p-5 sm:p-6 flex flex-col gap-2 text-white">
                    {/* Hangul Subtitle */}
                    <div className="text-[11px] font-bold tracking-widest text-[#FDA4AF] uppercase">
                      {section.hangul}
                    </div>

                    {/* Category Title */}
                    <h3 className="font-display text-2xl sm:text-2xl font-black tracking-tight leading-snug drop-shadow-xs">
                      {section.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-white/85 line-clamp-2 leading-relaxed font-body">
                      {section.subtitle}
                    </p>

                    {/* Style Feature Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {section.highlightPills.map((pill) => (
                        <span
                          key={pill}
                          className="text-[10px] bg-white/15 backdrop-blur-xs border border-white/25 px-2 py-0.5 rounded-md text-white/95 font-medium"
                        >
                          {pill}
                        </span>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <div className="pt-2">
                      <button
                        type="button"
                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                          isSelected
                            ? 'bg-white text-[#1C1B1B] hover:bg-[#F3EEFF]'
                            : 'bg-white/90 text-[#1C1B1B] group-hover:bg-white'
                        }`}
                      >
                        <span>{isSelected ? 'Viewing Category Outfits' : 'Explore Category Outfits'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. FILTER & SORT TOOLBAR                                                  */}
      {/* ========================================================================= */}
      <section className="bg-white border-b border-[#FFE4E8] py-3.5 px-4 sm:px-6 lg:px-8 sticky top-[49px] z-20 shadow-2xs backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Section Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveSection('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide whitespace-nowrap transition-all ${
                activeSection === 'all'
                  ? 'bg-gradient-to-r from-[#FF4D6D] to-[#E11D48] text-white shadow-xs'
                  : 'bg-[#FFF5F7] text-[#574144] hover:bg-[#FFE4E8] hover:text-[#BE123C] border border-[#FFCCD5]'
              }`}
            >
              <span>All 3 Sections</span>
              <span className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full ${activeSection === 'all' ? 'bg-white/30 text-white' : 'bg-white text-[#FF4D6D]'}`}>
                {totalResults}
              </span>
            </button>

            <button
              onClick={() => setActiveSection('party-glam')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeSection === 'party-glam'
                  ? 'bg-[#FF4D6D] text-white shadow-xs'
                  : 'bg-[#FFF5F7] text-[#BE123C] hover:bg-[#FFE4E8] border border-[#FFCCD5]'
              }`}
            >
              <PartyPopper className="w-3.5 h-3.5" />
              <span>1. Party & Evening Glam</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeSection === 'party-glam' ? 'bg-white/30 text-white' : 'bg-white text-[#FF4D6D]'}`}>
                {partyProducts.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSection('campus-cafe')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeSection === 'campus-cafe'
                  ? 'bg-[#7C3AED] text-white shadow-xs'
                  : 'bg-[#F3EEFF] text-[#6D28D9] hover:bg-[#EDE9FE] border border-[#DDD6FE]'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>2. Campus & Cafe Everyday</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeSection === 'campus-cafe' ? 'bg-white/30 text-white' : 'bg-white text-[#7C3AED]'}`}>
                {campusProducts.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSection('office-brunch')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeSection === 'office-brunch'
                  ? 'bg-[#C026D3] text-white shadow-xs'
                  : 'bg-[#FDF4FF] text-[#86198F] hover:bg-[#FAE8FF] border border-[#F5D0FE]'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>3. Office & Weekend Brunch</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeSection === 'office-brunch' ? 'bg-white/30 text-white' : 'bg-white text-[#C026D3]'}`}>
                {officeProducts.length}
              </span>
            </button>
          </div>

          {/* Search & Sort Row */}
          <div className="flex items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 md:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A7174]" />
              <input
                type="text"
                placeholder="Search Korean styles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 bg-[#FFF5F7] border border-[#FFCCD5] rounded-full text-xs text-[#1C1B1B] placeholder-[#8A7174] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D] focus:bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8A7174] hover:text-[#1C1B1B]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#FFF5F7] border border-[#FFCCD5] rounded-full px-3 py-1.5 text-xs font-medium text-[#1C1B1B] focus:outline-none focus:ring-1 focus:ring-[#FF4D6D]"
            >
              <option value="price-asc">Price: Low to High (Default)</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="discount">Highest Discount</option>
              <option value="featured">Featured Fits</option>
            </select>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. STRICTLY THE 3 REQUESTED SECTIONS (NO DUPLICATES)                      */}
      {/* ========================================================================= */}
      <main className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-14">
        {/* SECTION 1: PARTY & EVENING GLAM */}
        {(activeSection === 'all' || activeSection === 'party-glam') && (
          <section id="section-party-glam" className="scroll-mt-32">
            {/* Section Header Card */}
            <div className="bg-gradient-to-r from-[#FFF1F2] via-[#FFF5F7] to-[#FFE4E6] p-4 sm:p-6 rounded-3xl border-2 border-[#FECDD3] shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src="/Square Neck Backles Crisscross Yellow - 1.jpg"
                  alt="Party & Evening Glam"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover object-top border-2 border-white shadow-xs shrink-0"
                />
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#BE123C] mb-1">
                    <span className="bg-[#FF4D6D] text-white text-[10px] px-2 py-0.5 rounded-full shadow-2xs">
                      CATEGORY 01
                    </span>
                    <span>파티 & 나이트 룩</span>
                    <span className="text-[#FDA4AF]">•</span>
                    <span className="text-[#9F1239]">PARTY & EVENING GLAM</span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-black text-[#1C1B1B]">
                    Party & Evening Glam
                  </h2>
                  <p className="text-xs sm:text-sm text-[#574144] mt-1">
                    Figure-sculpting corset bodycons, lustrous satin cowl midis, chic shrugs & cocktail evening fits.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                {activeSection === 'party-glam' && (
                  <button
                    onClick={() => setActiveSection('all')}
                    className="text-xs font-bold text-[#BE123C] bg-white hover:bg-[#FFF1F2] px-3 py-1.5 rounded-2xl border border-[#FFCCD5] shadow-2xs transition-colors cursor-pointer"
                  >
                    ← All Categories
                  </button>
                )}
                <span className="text-xs font-bold text-[#BE123C] bg-white px-3 py-1.5 rounded-2xl border border-[#FFCCD5] shadow-2xs">
                  {partyProducts.length} Curated Fits
                </span>
                <span className="text-xs font-bold text-white bg-[#FF4D6D] px-3 py-1.5 rounded-2xl shadow-xs">
                  From ₹599
                </span>
              </div>
            </div>

            {/* Products Grid */}
            {partyProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {partyProducts.map((product) => (
                  <KoreanProductCard
                    key={product.id}
                    product={product}
                    currency={currency}
                    isWishlisted={wishlistIds.includes(product.id)}
                    onToggleWishlist={onToggleWishlist}
                    onSelectProduct={onSelectProduct}
                    onAddToCart={onAddToCart}
                    onBuyNow={onBuyNow}
                  />
                ))}
              </div>
            ) : (
              <div className="py-10 text-center bg-white rounded-3xl border border-[#FFCCD5] p-6">
                <p className="text-xs text-[#8A7174]">No party fits match your search query.</p>
              </div>
            )}
          </section>
        )}

        {/* SECTION 2: CAMPUS & CAFE EVERYDAY */}
        {(activeSection === 'all' || activeSection === 'campus-cafe') && (
          <section id="section-campus-cafe" className="scroll-mt-32">
            {/* Section Header Card */}
            <div className="bg-gradient-to-r from-[#F3EEFF] via-[#F8F5FF] to-[#EDE9FE] p-4 sm:p-6 rounded-3xl border-2 border-[#DDD6FE] shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src="/Spense Clothing Women Relaxed Fit - Light Blue -1.webp"
                  alt="Campus & Cafe Everyday"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover object-top border-2 border-white shadow-xs shrink-0"
                />
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#6D28D9] mb-1">
                    <span className="bg-[#7C3AED] text-white text-[10px] px-2 py-0.5 rounded-full shadow-2xs">
                      CATEGORY 02
                    </span>
                    <span>캠퍼스 & 카페 데이</span>
                    <span className="text-[#C4B5FD]">•</span>
                    <span className="text-[#5B21B6]">CAMPUS & CAFE EVERYDAY</span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-black text-[#1C1B1B]">
                    Campus & Cafe Everyday
                  </h2>
                  <p className="text-xs sm:text-sm text-[#574144] mt-1">
                    Breezy relaxed cotton button-downs, light blue Seoul streetwear & casual flare dresses for college days.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                {activeSection === 'campus-cafe' && (
                  <button
                    onClick={() => setActiveSection('all')}
                    className="text-xs font-bold text-[#6D28D9] bg-white hover:bg-[#F3EEFF] px-3 py-1.5 rounded-2xl border border-[#DDD6FE] shadow-2xs transition-colors cursor-pointer"
                  >
                    ← All Categories
                  </button>
                )}
                <span className="text-xs font-bold text-[#6D28D9] bg-white px-3 py-1.5 rounded-2xl border border-[#DDD6FE] shadow-2xs">
                  {campusProducts.length} Curated Fits
                </span>
                <span className="text-xs font-bold text-white bg-[#7C3AED] px-3 py-1.5 rounded-2xl shadow-xs">
                  From ₹549
                </span>
              </div>
            </div>

            {/* Products Grid */}
            {campusProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {campusProducts.map((product) => (
                  <KoreanProductCard
                    key={product.id}
                    product={product}
                    currency={currency}
                    isWishlisted={wishlistIds.includes(product.id)}
                    onToggleWishlist={onToggleWishlist}
                    onSelectProduct={onSelectProduct}
                    onAddToCart={onAddToCart}
                    onBuyNow={onBuyNow}
                  />
                ))}
              </div>
            ) : (
              <div className="py-10 text-center bg-white rounded-3xl border border-[#DDD6FE] p-6">
                <p className="text-xs text-[#8A7174]">No campus & cafe fits match your search query.</p>
              </div>
            )}
          </section>
        )}

        {/* SECTION 3: OFFICE & WEEKEND BRUNCH */}
        {(activeSection === 'all' || activeSection === 'office-brunch') && (
          <section id="section-office-brunch" className="scroll-mt-32">
            {/* Section Header Card */}
            <div className="bg-gradient-to-r from-[#FDF4FF] via-[#FAF5FF] to-[#FAE8FF] p-4 sm:p-6 rounded-3xl border-2 border-[#F5D0FE] shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src="/PATTZALA Women Sheath Purple - 1.webp"
                  alt="Office & Weekend Brunch"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover object-top border-2 border-white shadow-xs shrink-0"
                />
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#86198F] mb-1">
                    <span className="bg-[#C026D3] text-white text-[10px] px-2 py-0.5 rounded-full shadow-2xs">
                      CATEGORY 03
                    </span>
                    <span>오피스 & 브런치 데이트</span>
                    <span className="text-[#F0ABFC]">•</span>
                    <span className="text-[#701A75]">OFFICE & WEEKEND BRUNCH</span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-black text-[#1C1B1B]">
                    Office & Weekend Brunch
                  </h2>
                  <p className="text-xs sm:text-sm text-[#574144] mt-1">
                    Tailored desk-to-dinner sheath midis, elegant minimalist beige knits & boardroom presentation fits.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                {activeSection === 'office-brunch' && (
                  <button
                    onClick={() => setActiveSection('all')}
                    className="text-xs font-bold text-[#86198F] bg-white hover:bg-[#FDF4FF] px-3 py-1.5 rounded-2xl border border-[#F5D0FE] shadow-2xs transition-colors cursor-pointer"
                  >
                    ← All Categories
                  </button>
                )}
                <span className="text-xs font-bold text-[#86198F] bg-white px-3 py-1.5 rounded-2xl border border-[#F5D0FE] shadow-2xs">
                  {officeProducts.length} Curated Fits
                </span>
                <span className="text-xs font-bold text-white bg-[#C026D3] px-3 py-1.5 rounded-2xl shadow-xs">
                  From ₹699
                </span>
              </div>
            </div>

            {/* Products Grid */}
            {officeProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {officeProducts.map((product) => (
                  <KoreanProductCard
                    key={product.id}
                    product={product}
                    currency={currency}
                    isWishlisted={wishlistIds.includes(product.id)}
                    onToggleWishlist={onToggleWishlist}
                    onSelectProduct={onSelectProduct}
                    onAddToCart={onAddToCart}
                    onBuyNow={onBuyNow}
                  />
                ))}
              </div>
            ) : (
              <div className="py-10 text-center bg-white rounded-3xl border border-[#F5D0FE] p-6">
                <p className="text-xs text-[#8A7174]">No office & brunch fits match your search query.</p>
              </div>
            )}
          </section>
        )}

        {/* Global Empty State if user searched something that produced 0 results across all 3 sections */}
        {totalResults === 0 && (
          <div className="py-16 text-center bg-white rounded-3xl border-2 border-[#FFCCD5] p-8 max-w-lg mx-auto">
            <span className="text-4xl">🌸</span>
            <h3 className="mt-3 font-display text-lg font-bold text-[#1C1B1B]">No Korean styles found</h3>
            <p className="text-xs text-[#8A7174] mt-1">
              Try searching with another keyword or reset your search.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveSection('all');
              }}
              className="mt-4 px-4 py-2 bg-[#FF4D6D] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#E11D48] transition-colors"
            >
              Reset Search
            </button>
          </div>
        )}
      </main>

      {/* ------------------------------------------------------------------------- */}
      {/* FOOTER CALLOUT BANNER                                                     */}
      {/* ------------------------------------------------------------------------- */}
      <div className="bg-gradient-to-r from-[#FFF5F7] via-[#F3EEFF] to-[#ECFDF5] border-t border-[#FFCCD5] py-10 px-4 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="text-2xl">🎀 ♡ ✧</span>
          <h4 className="font-display text-lg sm:text-xl font-black text-[#1C1B1B] mt-1.5">
            Explore Zevioza's Royal Handloom Silk Sarees & Ethnic Couture
          </h4>
          <p className="text-xs text-[#574144] mt-1 leading-relaxed">
            Our bridal silk sarees, festive kurtis, and royal lehenga cholis are handcrafted in the main atelier.
          </p>
          <button
            onClick={onBackToStore}
            className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#6D0026] text-white text-xs font-bold tracking-wider uppercase hover:bg-[#52001C] shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <span>Visit Traditional Boutique</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
