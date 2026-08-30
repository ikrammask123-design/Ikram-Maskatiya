import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Gem } from 'lucide-react';
import { TRUST_BADGES } from '../data/products';

export const TrustBadges: React.FC = () => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'badge-shipping':
        return <Truck className="w-6 h-6 text-[#6d0026]" />;
      case 'badge-returns':
        return <RotateCcw className="w-6 h-6 text-[#6d0026]" />;
      case 'badge-payment':
        return <ShieldCheck className="w-6 h-6 text-[#6d0026]" />;
      case 'badge-craft':
      default:
        return <Gem className="w-6 h-6 text-[#6d0026]" />;
    }
  };

  return (
    <section
      id="trust-badges-section"
      className="w-full bg-[#f6f3f2] border-y border-[#debfc2]/40 py-8 px-4 sm:px-8"
    >
      <div className="max-w-[1360px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
        {TRUST_BADGES.map((badge) => (
          <div
            key={badge.id}
            className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/60 backdrop-blur-xs border border-[#debfc2]/30 shadow-2xs hover:bg-white transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-[#fed9e2]/80 flex items-center justify-center flex-shrink-0 shadow-2xs">
              {getIcon(badge.id)}
            </div>
            <div className="flex flex-col">
              <h4 className="font-display text-sm sm:text-base font-bold text-[#1c1b1b]">
                {badge.title}
              </h4>
              <p className="font-body text-xs text-[#574144]">
                {badge.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
