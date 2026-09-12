import React from 'react';
import { HeroBanner } from './HeroBanner';
import { CuratedCategories } from './CuratedCategories';
import { TrustBadges } from './TrustBadges';
import { ProductCard } from './ProductCard';
import { TestimonialsSection } from './TestimonialsSection';
import { NewsletterSection } from './NewsletterSection';
import { Logo } from './Logo';
import { CategoryId, Product, Currency } from '../types';
import { ArrowRight, Sparkles, Award, ShieldCheck, Heart, MapPin, Phone, Mail, Lock } from 'lucide-react';
import { formatPrice } from './ProductCard';

interface HomeViewProps {
  products: Product[];
  currency: Currency;
  wishlistIds: string[];
  onSelectCategory: (categoryId: CategoryId) => void;
  onToggleWishlist: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onOpenStylistModal: () => void;
  onOpenTrackOrder?: () => void;
  onOpenKoreanStore?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  currency,
  wishlistIds,
  onSelectCategory,
  onToggleWishlist,
  onSelectProduct,
  onAddToCart,
  onOpenStylistModal,
  onOpenTrackOrder,
  onOpenKoreanStore,
}) => {
  const [secretTapCount, setSecretTapCount] = React.useState(0);

  const handleSecretTap = () => {
    setSecretTapCount((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        window.location.hash = 'admin';
        return 0;
      }
      return next;
    });
  };

  // Flagship saree
  const flagshipSaree = products.find((p) => p.id === 'zv-01') || products[0];

  return (
    <div id="home-view" className="flex flex-col w-full bg-[#fdf9f7]">
      {/* 1. Hero Banner */}
      <HeroBanner
        onShopClick={() => onSelectCategory('all')}
        onViewDealsClick={() => onSelectCategory('sarees')}
      />

      {/* 2. Shop Our Collections Categories */}
      <CuratedCategories onSelectCategory={onSelectCategory} />

      {/* 3. Value Proposition / Trust Badges Bar */}
      <TrustBadges />

      {/* 3.5. 100% FEMALE-FOCUSED KOREAN STORE FEATURE BANNER */}
      {onOpenKoreanStore && (
        <section className="px-4 sm:px-8 max-w-[1360px] mx-auto w-full pt-4 pb-2">
          <div
            onClick={onOpenKoreanStore}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FFF5F7] via-[#FFFDF9] to-[#F3EEFF] border-2 border-[#FFCCD5] hover:border-[#FF4D6D] p-6 sm:p-8 cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
            style={{
              backgroundImage: `radial-gradient(#FFCCD5 0.75px, transparent 0.75px)`,
              backgroundSize: '14px 14px',
            }}
          >
            {/* Soft decorative glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFB6C1]/30 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-10 w-60 h-60 bg-[#D1FAE5]/30 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-xl text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-xs px-3.5 py-1 rounded-full border border-[#FFCCD5] text-[11px] font-bold text-[#E11D48] shadow-2xs mb-2.5">
                  <Sparkles className="w-3.5 h-3.5 fill-[#FF4D6D] text-[#FF4D6D]" />
                  <span>100% FEMALE FOCUSED • KOREAN STORE</span>
                  <span className="text-[#7C3AED]">한국 스토어</span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-[#1C1B1B] tracking-tight">
                  Step Into The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D6D] via-[#D946EF] to-[#7C3AED]">Korean Store</span>
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#574144] leading-relaxed">
                  Party & Evening Glam, Campus & Cafe Everyday, and Office & Weekend Brunch — curated western silhouettes, bodycon maxis & tailored fits starting @ <span className="font-bold text-[#FF4D6D]">₹549</span>.
                </p>

                {/* Quick pill tags */}
                <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="bg-white px-2.5 py-1 rounded-xl text-xs font-semibold text-[#9F1239] border border-[#FFCCD5]">
                    ♡ Party & Evening Glam
                  </span>
                  <span className="bg-white px-2.5 py-1 rounded-xl text-xs font-semibold text-[#6D28D9] border border-[#DDD6FE]">
                    ✧ Campus & Cafe Everyday
                  </span>
                  <span className="bg-white px-2.5 py-1 rounded-xl text-xs font-semibold text-[#065F46] border border-[#A7F3D0]">
                    🍃 Office & Weekend Brunch
                  </span>
                </div>
              </div>

              {/* Action Button & Visual Previews */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="hidden lg:flex items-center -space-x-4">
                  <img
                    src="/METRONAUT Women Bodycon Black - 1.webp"
                    alt="Minimalist Bodycon Maxi"
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                  />
                  <img
                    src="/PATTZALA Women Sheath Purple - 1.webp"
                    alt="Tailored Sheath Midi"
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                  />
                  <img
                    src="/Spense Clothing Women Relaxed Fit - Light Blue -1.webp"
                    alt="Seoul Relaxed Shirt"
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                  />
                </div>

                <button
                  type="button"
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FF4D6D] via-[#E11D48] to-[#BE123C] text-white text-xs sm:text-sm font-bold tracking-wider uppercase shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300 flex items-center gap-2 shrink-0"
                >
                  <span>Explore Korean Store</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. MOST LOVED -> Trending Now Section */}
      <section
        id="trending-now-section"
        className="py-14 sm:py-20 px-4 sm:px-8 max-w-[1360px] mx-auto w-full"
      >
        <div className="flex flex-row items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <span className="font-body text-xs sm:text-sm font-bold text-[#891738] tracking-[0.25em] uppercase mb-1.5 block">
              MOST LOVED
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1c1b1b] tracking-tight">
              Trending Now
            </h2>
          </div>

          <button
            onClick={() => onSelectCategory('all')}
            className="text-xs sm:text-sm font-bold text-[#6d0026] hover:text-[#8e1b3b] tracking-wider uppercase flex items-center gap-1.5 group cursor-pointer"
          >
            <span>View all</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {products.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currency={currency}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onSelectProduct={onSelectProduct}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </section>

      {/* 5. Masterpiece Highlight (Rose Petal Silk Saree Banner) */}
      <section
        id="flagship-masterpiece-section"
        className="py-12 md:py-20 px-4 sm:px-8 bg-[#f6f3f2] border-y border-[#debfc2]/30"
      >
        <div className="max-w-[1360px] mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Left: Interactive Image Showcase */}
          <div className="w-full lg:w-1/2 relative group">
            <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border border-[#debfc2]/40 bg-white relative">
              <img
                src={flagshipSaree.image}
                alt={flagshipSaree.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-[#6d0026] flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#aa314e]" />
                FLAGSHIP HEIRLOOM
              </div>
            </div>

            {/* Floating Detail Pill */}
            <div className="absolute -bottom-4 right-4 sm:right-8 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-[#debfc2]/40 max-w-xs">
              <span className="text-[10px] font-bold text-[#8a7174] uppercase tracking-wider block">
                Pure Mulberry Silk • 240 Artisan Hours
              </span>
              <span className="font-display text-sm font-bold text-[#6d0026]">
                Tested Gold Zari Korvai Weave
              </span>
            </div>
          </div>

          {/* Right: Masterpiece Details & Action */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <span className="font-body text-xs font-bold text-[#891738] tracking-[0.25em] uppercase mb-2 block">
              THE SIGNATURE ATELIER PIECE
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1c1b1b] mb-3 leading-tight">
              {flagshipSaree.name}
            </h2>
            <p className="font-body text-base sm:text-lg text-[#574144] font-medium mb-4">
              {flagshipSaree.weave}
            </p>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-display text-3xl sm:text-4xl font-extrabold text-[#6d0026]">
                {formatPrice(flagshipSaree.price, currency)}
              </span>
              {flagshipSaree.originalPrice && (
                <span className="text-base text-[#8a7174] line-through font-body">
                  {formatPrice(flagshipSaree.originalPrice, currency)}
                </span>
              )}
            </div>

            <p className="font-body text-sm sm:text-base text-[#574144] leading-relaxed mb-6">
              {flagshipSaree.description} Featuring delicate floral jaal in antique gold zari across a luminous rose-petal pink silk body. Certified Silk Mark purity.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8 text-xs font-semibold text-[#574144]">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#6d0026]" />
                <span>Silk Mark Certified Purity</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#6d0026]" />
                <span>Unstitched Brocade Blouse Included</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                id="btn-flagship-explore"
                onClick={() => onSelectProduct(flagshipSaree)}
                className="bg-[#6d0026] text-white px-8 py-3.5 rounded-full font-body text-xs font-bold tracking-widest uppercase hover:bg-[#8e1b3b] active:scale-98 transition-all shadow-md cursor-pointer"
              >
                EXPLORE MASTERPIECE
              </button>

              <button
                id="btn-flagship-add-bag"
                onClick={() => onAddToCart(flagshipSaree)}
                className="bg-[#ffd9dd] text-[#6d0026] px-6 py-3.5 rounded-full font-body text-xs font-bold tracking-widest uppercase hover:bg-[#fed9e2] active:scale-98 transition-all cursor-pointer"
              >
                ADD TO BAG
              </button>

              <button
                onClick={() => onToggleWishlist(flagshipSaree)}
                className={`p-3 rounded-full border transition-all cursor-pointer ${
                  wishlistIds.includes(flagshipSaree.id)
                    ? 'bg-[#8e1b3b] text-white border-[#8e1b3b]'
                    : 'border-[#debfc2] text-[#574144] hover:text-[#6d0026] bg-white'
                }`}
                title="Save to Wishlist"
              >
                <Heart
                  className={`w-4 h-4 ${
                    wishlistIds.includes(flagshipSaree.id) ? 'fill-current' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section */}
      <TestimonialsSection />

      {/* 7. Newsletter Section */}
      <NewsletterSection />

      {/* 8. Boutique Footer */}
      <footer className="bg-[#fcf9f8] border-t border-[#debfc2]/40 py-12 md:py-16 px-4 sm:px-8 text-[#574144]">
        <div className="max-w-[1360px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div>
            <div className="mb-3">
              <Logo size="md" withTagline={true} />
            </div>
            <p className="text-xs sm:text-sm text-[#574144] leading-relaxed mb-4 mt-2">
              Premium ethnic & contemporary fashion crafted for the modern woman.
            </p>
            <p className="text-xs text-[#8a7174]">
              Surat, Gujarat, India
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-xs font-bold text-[#1c1b1b] uppercase tracking-wider mb-4">
              Shop
            </h4>
            <ul className="text-xs sm:text-sm flex flex-col gap-2.5">
              <li>
                <button
                  onClick={() => onSelectCategory('sarees')}
                  className="hover:text-[#6d0026] transition-colors"
                >
                  Sarees
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('kurtis')}
                  className="hover:text-[#6d0026] transition-colors"
                >
                  Kurtis & Sets
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('dresses')}
                  className="hover:text-[#6d0026] transition-colors"
                >
                  Dresses & Gowns
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('accessories')}
                  className="hover:text-[#6d0026] transition-colors"
                >
                  Temple Jewellery & Accessories
                </button>
              </li>
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="text-xs font-bold text-[#1c1b1b] uppercase tracking-wider mb-4">
              Help
            </h4>
            <ul className="text-xs sm:text-sm flex flex-col gap-2.5">
              <li>
                <span className="cursor-pointer hover:text-[#6d0026] transition-colors">
                  Help Center
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-[#6d0026] transition-colors">
                  Support Tickets
                </span>
              </li>
              <li>
                {onOpenTrackOrder ? (
                  <button
                    type="button"
                    onClick={onOpenTrackOrder}
                    className="cursor-pointer hover:text-[#6d0026] text-left transition-colors font-medium text-[#6d0026]"
                  >
                    Track Your Order
                  </button>
                ) : (
                  <span className="cursor-pointer hover:text-[#6d0026] transition-colors">
                    Track Order
                  </span>
                )}
              </li>
              <li>
                <span className="cursor-pointer hover:text-[#6d0026] transition-colors">
                  7-Day Return Policy
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Details (From Video) */}
          <div>
            <h4 className="text-xs font-bold text-[#1c1b1b] uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul className="text-xs sm:text-sm flex flex-col gap-3">
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#6d0026] flex-shrink-0" />
                <a href="mailto:zevioza27@gmail.com" className="hover:text-[#6d0026]">
                  zevioza27@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#6d0026] flex-shrink-0" />
                <a href="tel:+918238023498" className="hover:text-[#6d0026]">
                  +91 82380 23498
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-4 h-4 text-emerald-600 font-bold text-xs flex items-center justify-center">WA</span>
                <a
                  href="https://wa.me/918238023498?text=Hello%20Zevioza%20Support%2C%20I%20have%20an%20inquiry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-700 text-[#574144] font-medium"
                >
                  WhatsApp: +91 82380 23498
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#6d0026] flex-shrink-0" />
                <span>Surat, Gujarat, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1360px] mx-auto pt-6 border-t border-[#debfc2]/30 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8a7174] gap-4">
          <p
            onClick={handleSecretTap}
            className="cursor-default select-none"
            title="Zevioza Haute Ethnic"
          >
            © 2026 Zevioza Haute Ethnic. All rights reserved.
          </p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <span className="hover:underline cursor-pointer">Privacy Charter</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Terms of Salon</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Silk Mark License</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
