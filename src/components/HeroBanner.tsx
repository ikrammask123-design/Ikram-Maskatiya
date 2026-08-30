import React from 'react';
import { HERO_IMAGE } from '../data/products';
import { ArrowRight, Sparkles, Star, ShieldCheck } from 'lucide-react';

interface HeroBannerProps {
  onShopClick: () => void;
  onViewDealsClick?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onShopClick,
  onViewDealsClick,
}) => {
  return (
    <section
      id="hero-banner-section"
      className="relative w-full bg-[#fdf9f7] overflow-hidden border-b border-[#debfc2]/30"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 py-10 sm:py-16 md:py-20 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12">
        {/* Left Column: Editorial Headline & Actions */}
        <div className="w-full lg:w-1/2 flex flex-col items-start text-left z-10">
          {/* Badge: New Autumn Collection 2026 */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fed9e2]/80 border border-[#debfc2]/60 text-[#6d0026] text-xs font-semibold tracking-wide mb-5 sm:mb-6 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#891738]" />
            <span>New Autumn Collection 2026</span>
          </div>

          {/* Main Headline (Exact words from video) */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1c1b1b] leading-[1.1] sm:leading-[1.12] tracking-tight mb-5 sm:mb-6">
            Wear Your Confidence <br className="hidden sm:block" />
            <span className="text-[#6d0026]">Own Every Room..</span>
          </h1>

          {/* Subtitle */}
          <p className="font-body text-sm sm:text-base md:text-lg text-[#574144] font-normal leading-relaxed mb-8 max-w-xl">
            Exquisite sarees & kurtis crafted to make heads turn. Experience royalty in every thread.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-10">
            <button
              id="btn-claim-look"
              onClick={onShopClick}
              className="w-full sm:w-auto bg-[#6d0026] hover:bg-[#8e1b3b] text-white px-8 py-3.5 rounded-full font-body text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 active:scale-98 cursor-pointer"
            >
              <span>Claim Your Look</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="btn-view-deals"
              onClick={onViewDealsClick || onShopClick}
              className="w-full sm:w-auto bg-white hover:bg-[#f6f3f2] text-[#1c1b1b] border border-[#debfc2] px-7 py-3.5 rounded-full font-body text-xs sm:text-sm font-semibold tracking-wider transition-all shadow-2xs hover:border-[#6d0026] cursor-pointer"
            >
              View Deals
            </button>
          </div>

          {/* Key Stats / Trust metrics row */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#debfc2]/40 w-full max-w-lg">
            <div>
              <span className="font-display text-xl sm:text-2xl font-bold text-[#6d0026] block">
                12,000+
              </span>
              <span className="text-[11px] sm:text-xs text-[#574144] font-medium">
                Happy Customers
              </span>
            </div>
            <div>
              <span className="font-display text-xl sm:text-2xl font-bold text-[#6d0026] block">
                300+
              </span>
              <span className="text-[11px] sm:text-xs text-[#574144] font-medium">
                Artisanal Weaves
              </span>
            </div>
            <div>
              <span className="font-display text-xl sm:text-2xl font-bold text-[#6d0026] block">
                100%
              </span>
              <span className="text-[11px] sm:text-xs text-[#574144] font-medium">
                Pure Silk Mark
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Visual Model Image */}
        <div className="w-full lg:w-1/2 relative flex justify-center items-center">
          <div className="relative w-full max-w-md lg:max-w-none aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <img
              src={HERO_IMAGE}
              alt="Woman in luxury Indian ethnic silk drape"
              className="w-full h-full object-cover object-center transition-transform duration-1000 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

            {/* Floating Highlight Card */}
            <div className="absolute bottom-5 left-5 right-5 sm:right-auto bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#debfc2]/50 shadow-lg flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#fed9e2] text-[#6d0026] flex items-center justify-center flex-shrink-0">
                <Star className="w-5 h-5 fill-current text-[#dbb46b]" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#891738] uppercase tracking-wider block">
                  Couture Handloom
                </span>
                <span className="font-display text-xs sm:text-sm font-bold text-[#1c1b1b] block">
                  Varanasi & Kanchipuram Weaves
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
