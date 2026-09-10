import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ArrowLeft,
  Truck,
  CreditCard,
  RotateCcw,
  Search,
  Heart,
  ShoppingBag,
  Zap,
  Tag,
  Gift,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  Music2,
  ArrowRight
} from 'lucide-react';
import {
  K_AESTHETIC_CATEGORIES,
  K_TREND_BANNERS,
  K_STAMP_OCCASIONS,
  K_PRODUCTS,
  KProduct,
  KAestheticCategory,
  KTrendBanner,
  KStampOccasion,
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

type FilterTabKey = 'all' | KoreanCategoryKey;

export const KoreanStoreView: React.FC<KoreanStoreViewProps> = ({
  currency,
  wishlistIds,
  onToggleWishlist,
  onSelectProduct,
  onAddToCart,
  onBuyNow,
  onBackToStore,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterTabKey>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'discount'>('featured');
  const [selectedSubCategory, setSelectedSubCategory] = useState<KoreanCategoryKey | null>(null);
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
  const [onlyWomenChecked, setOnlyWomenChecked] = useState<boolean>(true); // 100% Female filter toggle

  // Filtered & Sorted Products (Strictly 3 Categories x 2 Products = 6 Curated Items)
  const filteredProducts = useMemo(() => {
    // 100% Female products only
    let list = K_PRODUCTS.filter((p) => p.gender === 'female');

    // 1. Filter Tab
    if (activeFilter !== 'all') {
      list = list.filter((p) => p.koreanCategory === activeFilter);
    }

    // 2. SubCategory filter (from the 3 circular aesthetic categories)
    if (selectedSubCategory) {
      list = list.filter((p) => p.koreanCategory === selectedSubCategory);
    }

    // 3. Occasion filter (from the 3 postage stamp frames)
    if (selectedOccasion) {
      const matchedOcc = K_STAMP_OCCASIONS.find((o) => o.id === selectedOccasion);
      if (matchedOcc) {
        list = list.filter((p) => p.koreanCategory === matchedOcc.filterTarget);
      }
    }

    // 4. Search Query
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

    // 5. Sort
    if (sortBy === 'price-asc') {
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
  }, [activeFilter, selectedSubCategory, selectedOccasion, searchQuery, sortBy]);

  const scrollToProducts = () => {
    const target = document.getElementById('korean-products-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubCategoryClick = (cat: KAestheticCategory) => {
    setSelectedSubCategory(cat.id);
    setSelectedOccasion(null);
    setActiveFilter(cat.filterKey);
    scrollToProducts();
  };

  const handleTrendBannerClick = (filterTarget: KTrendBanner['filterTarget']) => {
    setSelectedSubCategory(filterTarget);
    setSelectedOccasion(null);
    setActiveFilter(filterTarget);
    scrollToProducts();
  };

  const handleOccasionClick = (occasion: KStampOccasion) => {
    setSelectedOccasion(occasion.id);
    setSelectedSubCategory(occasion.filterTarget);
    setActiveFilter(occasion.filterTarget);
    scrollToProducts();
  };

  return (
    <div className="w-full min-h-screen bg-[#FFFDF9] text-[#1C1B1B] flex flex-col antialiased selection:bg-[#FFB6C1]/40 selection:text-[#9F1239]">
      {/* ------------------------------------------------------------------------- */}
      {/* TOP NAVIGATION BAR: 100% FEMALE BADGE & RETURN TO COUTURE                 */}
      {/* ------------------------------------------------------------------------- */}
      <div className="bg-[#FFF5F7] border-b border-[#FFCCD5]/80 py-2.5 px-4 sm:px-6 sticky top-0 z-30 backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <button
            onClick={onBackToStore}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#E11D48] hover:text-[#9F1239] transition-all py-1 px-3.5 rounded-full bg-white shadow-xs border border-[#FFCCD5] hover:scale-102 active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Zevioza Atelier</span>
          </button>

          {/* 100% Female-Focused Badge Pill */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-[#BE123C] bg-white px-3 py-1 rounded-full border border-[#FDA4AF] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#FF4D6D] animate-ping" />
              <span>100% Female Focused • 3 Categories (2 Products Each)</span>
            </div>
            <span className="text-[11px] font-bold bg-[#FF4D6D] text-white px-2.5 py-1 rounded-full shadow-xs tracking-wider flex items-center gap-1">
              <span>♡</span>
              <span>FROM ₹549</span>
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. HERO BANNER SECTION (Soft K-Aesthetic + Cyber/Tech Korean Typography)  */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF5F7] via-[#FFFDF9] to-[#FFFDF9] border-b border-[#FFE4E8] pt-8 sm:pt-12 pb-10 sm:pb-16 px-4 sm:px-6 lg:px-8">
        {/* Soft Pastel Mesh Glow Orbs */}
        <div className="absolute top-0 -left-20 w-96 h-96 bg-[#FFB6C1]/35 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-0 w-96 h-96 bg-[#F3EEFF]/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#D1FAE5]/30 rounded-full blur-3xl pointer-events-none" />

        {/* Cyber / Tech Korean Typography Watermark & Floating Sparkles/Notes */}
        <div className="absolute top-4 right-6 font-mono text-7xl sm:text-9xl font-black text-[#FF4D6D]/6 select-none pointer-events-none tracking-widest uppercase">
          한국 // 2026
        </div>
        <div className="absolute bottom-2 left-6 font-mono text-6xl sm:text-8xl font-black text-[#7C3AED]/6 select-none pointer-events-none tracking-widest uppercase">
          K-AESTHETIC
        </div>

        {/* Floating Musical & Sparkle Notes */}
        <div className="absolute top-12 left-10 text-[#FF4D6D]/40 text-xl animate-bounce pointer-events-none">♡</div>
        <div className="absolute top-24 right-24 text-[#7C3AED]/40 text-lg pointer-events-none">✧</div>
        <div className="absolute bottom-12 right-1/3 text-[#059669]/40 text-base pointer-events-none">♪</div>
        <div className="absolute bottom-6 left-1/4 text-[#FF4D6D]/30 text-xl pointer-events-none">｡*ﾟ+</div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            {/* Left Column: Cyber/Tech K-Aesthetic Typography & Highlights */}
            <div className="flex-1 text-center lg:text-left">
              {/* Cyber/Tech Header Tag */}
              <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#FFCCD5] shadow-xs text-xs font-bold text-[#E11D48] mb-3.5 tracking-wider">
                <span className="text-[#FF4D6D]">♡</span>
                <span className="font-mono uppercase">KOREAN AESTHETIC // 한국 에스테틱</span>
                <span className="text-[#FDA4AF]">•</span>
                <span className="text-[#7C3AED] font-semibold">3 CATEGORIES • 2 FITS EACH</span>
              </div>

              {/* Main Title Styled with Cyber/Tech Typography */}
              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#1C1B1B] leading-[1.08]">
                ZEVIOZA <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D6D] via-[#D946EF] to-[#7C3AED]">KOREAN AESTHETIC</span> STORE
              </h1>

              {/* Korean Subtitle / Tagline */}
              <p className="mt-3.5 text-base sm:text-lg text-[#574144] font-body max-w-2xl leading-relaxed">
                Curated specifically for young women & college girls. Minimalist Bodycon Maxis, Tailored Sheath Dresses & Seoul Relaxed Shirts — <span className="font-bold text-[#FF4D6D]">3 Korean Categories with 2 Curated Fits each</span>.
              </p>

              {/* Trust Badges & 100% Female Guarantee Bar */}
              <div className="mt-5 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3">
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-2xl border border-[#A7F3D0] shadow-2xs text-xs font-bold text-[#065F46]">
                  <Truck className="w-3.5 h-3.5 text-[#059669]" />
                  <span>Free Express Delivery</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-2xl border border-[#FFCCD5] shadow-2xs text-xs font-bold text-[#BE123C]">
                  <CreditCard className="w-3.5 h-3.5 text-[#FF4D6D]" />
                  <span>COD Available</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-2xl border border-[#DDD6FE] shadow-2xs text-xs font-bold text-[#6D28D9]">
                  <RotateCcw className="w-3.5 h-3.5 text-[#7C3AED]" />
                  <span>7-Day Easy Returns</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-2xl border border-[#FECDD3] shadow-2xs text-xs font-bold text-[#9F1239]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FF4D6D]" />
                  <span>100% Female Fits</span>
                </div>
              </div>

              {/* Quick Action Jump Buttons */}
              <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <button
                  onClick={() => handleTrendBannerClick('bodycon-maxi')}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#FF4D6D] via-[#E11D48] to-[#BE123C] text-white text-xs sm:text-sm font-bold tracking-wider uppercase shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
                >
                  <span>♡</span>
                  <span>Explore Bodycon Maxis (2 Fits)</span>
                </button>
                <button
                  onClick={() => handleTrendBannerClick('relaxed-shirts')}
                  className="px-4 py-3 rounded-2xl bg-white border-2 border-[#FFCCD5] text-[#E11D48] text-xs sm:text-sm font-bold tracking-wider shadow-2xs hover:bg-[#FFF5F7] transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Tag className="w-4 h-4 text-[#FF4D6D]" />
                  <span>Seoul Relaxed Shirts (2 Fits)</span>
                </button>
              </div>
            </div>

            {/* Right Column: Visual Collage Card with Dotted/Grid Aesthetic Background */}
            <div className="w-full lg:w-[430px] shrink-0">
              <div
                className="relative p-4 rounded-3xl bg-white border-2 border-[#FFCCD5] shadow-xl overflow-hidden"
                style={{
                  backgroundImage: `radial-gradient(#FFCCD5 1px, transparent 1px)`,
                  backgroundSize: '16px 16px',
                }}
              >
                {/* Floating Pastel Label */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#BE123C]">
                    <span>♡</span>
                    <span className="font-mono tracking-wider uppercase">SEOUL GIRL DROP 2026</span>
                  </div>
                  <span className="bg-[#FF4D6D] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-2xs">
                    70% OFF
                  </span>
                </div>

                {/* 2-Column Photo Collage with Verified Catalog Images */}
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => handleTrendBannerClick('bodycon-maxi')}
                    className="relative rounded-2xl overflow-hidden aspect-[4/5] group bg-[#FFF5F7] border border-[#FFCCD5] cursor-pointer"
                  >
                    <img
                      src="/METRONAUT Women Bodycon Black - 1.webp"
                      alt="METRONAUT Minimalist Bodycon Maxi"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2.5">
                      <div>
                        <span className="text-[10px] font-bold text-[#FFCCD5] block">Bodycon & Maxi</span>
                        <p className="text-white text-xs font-bold leading-tight">From ₹599</p>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => handleTrendBannerClick('sheath-aline')}
                    className="relative rounded-2xl overflow-hidden aspect-[4/5] group bg-[#FFF5F7] border border-[#FFCCD5] cursor-pointer"
                  >
                    <img
                      src="/PATTZALA Women Sheath Purple - 1.webp"
                      alt="PATTZALA Tailored Sheath Midi"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2.5">
                      <div>
                        <span className="text-[10px] font-bold text-[#FDE68A] block">Sheath & A-Line</span>
                        <p className="text-white text-xs font-bold leading-tight">From ₹699</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Strip */}
                <div className="mt-3 p-2.5 rounded-2xl bg-gradient-to-r from-[#FFF5F7] to-[#F3EEFF] flex items-center justify-between border border-[#FFCCD5]">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎀</span>
                    <div>
                      <span className="text-xs font-bold text-[#1C1B1B] block">3 Curated Categories</span>
                      <span className="text-[10px] text-[#8A7174]">2 Products per Category • 6 Fits Total</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#FF4D6D]">♪ ✧</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. "SHOP BY KOREAN AESTHETIC" (EXACTLY 3 CATEGORIES - 2 PRODUCTS EACH)    */}
      {/* ========================================================================= */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF4D6D]">
              <span>♡ 3 KOREAN AESTHETIC CATEGORIES</span>
              <span className="text-[#FDA4AF]">•</span>
              <span className="text-[#7C3AED] font-mono">카테고리 01-03</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-[#1C1B1B] mt-0.5">
              Shop By Korean Aesthetic
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#8A7174] flex items-center gap-1">
            <span>Tap any category to view its 2 curated products</span>
            <span className="text-[#FF4D6D]">♡</span>
          </p>
        </div>

        {/* 3 CIRCULAR CATEGORIES (1 Row x 3 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {K_AESTHETIC_CATEGORIES.map((cat, idx) => {
            const isSelected = selectedSubCategory === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => handleSubCategoryClick(cat)}
                className={`group relative rounded-3xl p-5 cursor-pointer transition-all duration-300 border-2 flex flex-col items-center text-center bg-gradient-to-b ${cat.bgGradient} ${
                  isSelected
                    ? 'border-[#FF4D6D] ring-4 ring-[#FFB6C1]/50 shadow-lg scale-[1.02]'
                    : 'border-white/80 hover:border-[#FFB6C1] hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                {/* Number Watermark (01 to 03) */}
                <span className="absolute top-3.5 left-4 text-xs font-mono font-black text-black/20">
                  0{idx + 1}
                </span>

                {/* Heart Icon top right */}
                <span className="absolute top-3.5 right-4 text-sm text-[#FF4D6D]/60 group-hover:scale-125 transition-transform">
                  ♡
                </span>

                {/* Circular Category Image with Soft Halo */}
                <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden p-1.5 bg-white shadow-md group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-full"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 rounded-full border-2 border-white/90 pointer-events-none" />
                </div>

                {/* Price / Fit Badge */}
                <span
                  className="mt-4 text-[11px] font-black px-3.5 py-1 rounded-full shadow-xs text-white uppercase tracking-wider flex items-center gap-1"
                  style={{ backgroundColor: cat.accentColor }}
                >
                  <span>♡</span>
                  <span>{cat.priceBadge}</span>
                </span>

                {/* Category Title */}
                <h3 className="mt-2.5 font-display text-lg font-black text-[#1C1B1B] group-hover:text-[#FF4D6D] transition-colors line-clamp-1">
                  {cat.name}
                </h3>

                {/* Subtitle / Description */}
                <p className="text-xs text-[#574144] line-clamp-2 mt-1 px-2">
                  {cat.tagline}
                </p>

                {/* Hangul text */}
                <span className="text-[11px] text-[#7C3AED] font-semibold mt-1.5">
                  {cat.hangul}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. "KOREAN TRENDS" - 3 CATEGORY SPOTLIGHTS                                 */}
      {/* ========================================================================= */}
      <section className="py-10 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#7C3AED]">
              <span>KOREAN TRENDS ROW</span>
              <span className="text-[#D8B4FE]">•</span>
              <span className="text-[#FF4D6D] font-mono">3 TREND SPOTLIGHTS</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-[#1C1B1B] mt-0.5">
              Korean Trends
            </h2>
          </div>
          <p className="text-xs text-[#8A7174]">
            Curated trend spotlights corresponding to your 3 Korean categories
          </p>
        </div>

        {/* 3 Rectangular Rounded Cards with Grid Backgrounds */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {K_TREND_BANNERS.map((banner) => (
            <div
              key={banner.id}
              onClick={() => handleTrendBannerClick(banner.filterTarget)}
              className={`group relative rounded-3xl overflow-hidden border-2 ${banner.palette.border} ${banner.palette.bg} p-5 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1`}
              style={{
                backgroundImage: `linear-gradient(to right, ${banner.palette.patternColor}33 1px, transparent 1px), linear-gradient(to bottom, ${banner.palette.patternColor}33 1px, transparent 1px)`,
                backgroundSize: '20px 20px',
              }}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${banner.palette.tagBg} ${banner.palette.tagText}`}>
                    {banner.hangul}
                  </span>
                  <span className={`text-xs font-black px-3 py-1 rounded-full ${banner.palette.pillBg} ${banner.palette.pillText} shadow-xs`}>
                    {banner.priceTag}
                  </span>
                </div>

                <h3 className="font-display text-base sm:text-lg font-black text-[#1C1B1B] group-hover:text-[#FF4D6D] transition-colors leading-snug">
                  {banner.title}
                </h3>
                <p className="text-xs text-[#574144] mt-1 line-clamp-2">
                  {banner.subtitle}
                </p>
              </div>

              {/* Product Visual Thumbnail */}
              <div className="mt-4 relative aspect-[4/3] rounded-2xl overflow-hidden bg-white shadow-sm border border-white/90">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                  <span className="text-white text-xs font-bold flex items-center gap-1">
                    <span>View Category (2 Products)</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. "SHOP BY OCCASION" (Postage Stamp Frame Section - 3 Occasions)          */}
      {/* ========================================================================= */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF4D6D]">
              <span>POSTAGE STAMP COLLECTION</span>
              <span className="text-[#FDA4AF]">•</span>
              <span className="text-[#7C3AED] font-mono">우표 스타일</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-[#1C1B1B] mt-0.5">
              Shop By Occasion
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#8A7174]">
            Postage stamp frames linking to Party Glam, Office Brunch & Campus Cafe
          </p>
        </div>

        {/* 3 Postage Stamp Frame Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {K_STAMP_OCCASIONS.map((occasion) => {
            const isSelected = selectedOccasion === occasion.id;
            return (
              <div
                key={occasion.id}
                onClick={() => handleOccasionClick(occasion)}
                className={`group relative rounded-3xl p-5 cursor-pointer transition-all duration-300 bg-gradient-to-b ${occasion.stampColor} border-2 border-dashed ${occasion.borderColor} hover:border-[#FF4D6D] shadow-md hover:shadow-2xl hover:-translate-y-1.5 flex flex-col justify-between ${
                  isSelected ? 'ring-4 ring-[#FFB6C1] border-solid border-[#FF4D6D]' : ''
                }`}
              >
                {/* Perforated Postage Stamp Edge Cutout Emulation */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-3 bg-[#FFFDF9] rounded-b-full border-b border-x border-[#FFCCD5]" />
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-3 bg-[#FFFDF9] rounded-t-full border-t border-x border-[#FFCCD5]" />
                <div className="absolute top-1/2 -left-3 -translate-y-1/2 h-8 w-3 bg-[#FFFDF9] rounded-r-full border-r border-y border-[#FFCCD5]" />
                <div className="absolute top-1/2 -right-3 -translate-y-1/2 h-8 w-3 bg-[#FFFDF9] rounded-l-full border-l border-y border-[#FFCCD5]" />

                <div>
                  {/* Top Postage Header: Postal Stamp Cancellation Mark */}
                  <div className="flex items-center justify-between mb-3 text-[11px] font-mono text-[#7C3AED] border-b border-dashed border-[#FFCCD5]/80 pb-2">
                    <span className="font-bold flex items-center gap-1">
                      <span>POSTAGE</span>
                      <span className="text-[#FF4D6D]">♡</span>
                      <span>2026</span>
                    </span>
                    <span className="font-extrabold bg-white px-2 py-0.5 rounded-full border border-[#FFCCD5] text-[#BE123C]">
                      {occasion.stampPrice}
                    </span>
                  </div>

                  {/* Stamp Photo */}
                  <div className="relative aspect-[16/11] rounded-2xl overflow-hidden bg-white shadow-sm border border-white">
                    <img
                      src={occasion.image}
                      alt={occasion.title}
                      className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-xs text-[10px] font-black text-[#BE123C] px-2.5 py-0.5 rounded-full border border-[#FFCCD5] shadow-xs">
                      {occasion.accentBadge}
                    </div>
                  </div>

                  {/* Stamp Title */}
                  <h3 className="mt-4 font-display text-lg sm:text-xl font-black text-[#1C1B1B] group-hover:text-[#FF4D6D] transition-colors leading-snug">
                    {occasion.title}
                  </h3>
                  <p className="text-xs text-[#574144] mt-1 line-clamp-2">
                    {occasion.subtitle}
                  </p>
                </div>

                {/* Bottom Stamp Seal */}
                <div className="mt-4 pt-3 border-t border-dashed border-[#FFCCD5]/80 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#8A7174]">
                    {occasion.hangul}
                  </span>
                  <span className="text-xs font-bold text-[#FF4D6D] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>View 2 Fits</span>
                    <span>→</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. ALL K-AESTHETIC PRODUCTS (STRICTLY THE 6 CURATED PRODUCTS)              */}
      {/* ========================================================================= */}
      <section
        id="korean-products-section"
        className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full scroll-mt-20 flex-1"
      >
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FF4D6D] uppercase tracking-wider">
                <span>♡ CURATED KOREAN COLLECTION</span>
                <span className="text-[#FDA4AF]">•</span>
                <span className="text-[#7C3AED] font-mono">3 CATEGORIES • 6 PRODUCTS</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-[#1C1B1B] mt-0.5">
                Korean Aesthetic Collection
              </h2>
            </div>

            {/* Quick Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7174]" />
              <input
                type="text"
                placeholder="Search fits, colors, fabrics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9.5 pr-8 py-2 bg-white border border-[#FFCCD5] rounded-2xl text-xs text-[#1C1B1B] placeholder-[#8A7174] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D] shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#8A7174] hover:text-[#1C1B1B]"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Filter Bar with 3 Category Pills */}
          <div className="mt-5 pt-4 border-t border-[#FFE4E8] flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Functional "Filter by Women" Indicator Toggle */}
              <button
                onClick={() => setOnlyWomenChecked(!onlyWomenChecked)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold tracking-wide transition-all border flex items-center gap-1.5 ${
                  onlyWomenChecked
                    ? 'bg-[#FFF1F2] text-[#BE123C] border-[#FDA4AF] shadow-2xs'
                    : 'bg-gray-100 text-gray-600 border-gray-200'
                }`}
                title="100% Female Selection"
              >
                <span>♀</span>
                <span>Women / Girls</span>
                <span className="text-[10px] bg-white text-[#FF4D6D] font-black px-1.5 rounded-full border border-[#FFCCD5]">
                  100%
                </span>
              </button>

              {/* 3 Distinct Category Tabs + All Fits */}
              {[
                { key: 'all' as FilterTabKey, label: 'All Fits', count: K_PRODUCTS.length },
                { key: 'bodycon-maxi' as FilterTabKey, label: 'Bodycon & Maxi', count: K_PRODUCTS.filter((p) => p.koreanCategory === 'bodycon-maxi').length },
                { key: 'sheath-aline' as FilterTabKey, label: 'Sheath & A-Line', count: K_PRODUCTS.filter((p) => p.koreanCategory === 'sheath-aline').length },
                { key: 'relaxed-shirts' as FilterTabKey, label: 'Relaxed Shirts & Tops', count: K_PRODUCTS.filter((p) => p.koreanCategory === 'relaxed-shirts').length },
              ].map((tab) => {
                const isActive = activeFilter === tab.key && !selectedSubCategory && !selectedOccasion;
                return (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setActiveFilter(tab.key);
                      setSelectedSubCategory(null);
                      setSelectedOccasion(null);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wide transition-all ${
                      isActive
                        ? 'bg-[#FF4D6D] text-white shadow-xs'
                        : 'bg-[#FFF5F7] text-[#574144] hover:bg-[#FFE4E8] hover:text-[#BE123C] border border-[#FFCCD5]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/30 text-white' : 'bg-white text-[#FF4D6D]'}`}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}

              {(selectedSubCategory || selectedOccasion) && (
                <button
                  onClick={() => {
                    setSelectedSubCategory(null);
                    setSelectedOccasion(null);
                    setActiveFilter('all');
                  }}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-[#FEE2E2] text-[#B91C1C] border border-[#FCA5A5] flex items-center gap-1 hover:bg-[#FECACA]"
                >
                  <span>Reset Filter</span>
                  <span>✕</span>
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs text-[#574144]">
              <span className="font-semibold text-[11px] text-[#8A7174]">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#FFF5F7] border border-[#FFCCD5] rounded-xl px-3 py-1.5 text-xs font-medium text-[#1C1B1B] focus:outline-none focus:ring-1 focus:ring-[#FF4D6D]"
              >
                <option value="featured">Featured Drops</option>
                <option value="discount">Highest Discount</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Cards Grid - 3 Columns on Tablet/Desktop for Perfect Visual Balance */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProducts.map((prod) => (
              <KoreanProductCard
                key={prod.id}
                product={prod}
                currency={currency}
                isWishlisted={wishlistIds.includes(prod.id)}
                onToggleWishlist={onToggleWishlist}
                onSelectProduct={onSelectProduct}
                onAddToCart={onAddToCart}
                onBuyNow={onBuyNow}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-white rounded-3xl border-2 border-[#FFCCD5] p-8">
            <span className="text-4xl">🌸</span>
            <h3 className="mt-3 font-display text-lg font-bold text-[#1C1B1B]">No matching Korean styles found</h3>
            <p className="text-xs text-[#8A7174] mt-1 max-w-sm mx-auto">
              Try adjusting your search query or reset filters to browse all 6 curated fits.
            </p>
            <button
              onClick={() => {
                setActiveFilter('all');
                setSelectedSubCategory(null);
                setSelectedOccasion(null);
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-[#FF4D6D] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#E11D48] transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>

      {/* ------------------------------------------------------------------------- */}
      {/* FOOTER CALLOUT BANNER                                                     */}
      {/* ------------------------------------------------------------------------- */}
      <div className="bg-gradient-to-r from-[#FFF5F7] via-[#F3EEFF] to-[#ECFDF5] border-t border-[#FFCCD5] py-10 px-4 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="text-2xl">🎀 ♡ ✧</span>
          <h4 className="font-display text-lg sm:text-xl font-black text-[#1C1B1B] mt-1.5">
            Looking for Zevioza's Royal Handloom Silk Sarees?
          </h4>
          <p className="text-xs text-[#574144] mt-1 leading-relaxed">
            Our traditional bridal atelier, Kanjivaram silk sarees, and festive Chikankari anarkalis are preserved in the main Zevioza boutique.
          </p>
          <button
            onClick={onBackToStore}
            className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#6D0026] text-white text-xs font-bold tracking-wider uppercase hover:bg-[#52001C] shadow-sm transition-all active:scale-95"
          >
            <span>Visit Traditional Boutique</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
