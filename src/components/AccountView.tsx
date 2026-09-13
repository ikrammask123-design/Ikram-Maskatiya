import React, { useState } from 'react';
import {
  Heart,
  Package,
  Sparkles,
  ShoppingBag,
  Trash2,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Search,
} from 'lucide-react';
import { Product, Currency } from '../types';

interface AccountViewProps {
  wishlistedProducts: Product[];
  currency: Currency;
  onRemoveWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onOpenStylistModal: () => void;
  onOpenTrackOrder: (orderId?: string) => void;
  onShopNow: () => void;
}

export const AccountView: React.FC<AccountViewProps> = ({
  wishlistedProducts,
  currency,
  onRemoveWishlist,
  onAddToCart,
  onSelectProduct,
  onOpenStylistModal,
  onOpenTrackOrder,
  onShopNow,
}) => {
  const [trackInput, setTrackInput] = useState('');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackInput.trim()) {
      onOpenTrackOrder(trackInput.trim().toUpperCase());
    } else {
      onOpenTrackOrder();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* User Header Profile Card */}
      <div className="bg-gradient-to-r from-[#6d0026] via-[#891738] to-[#450018] rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center font-display text-2xl font-bold backdrop-blur-xs">
              Z
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-xs mb-1">
                <Sparkles className="w-3 h-3 text-[#ffdea5]" />
                <span>Privilege Member</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold">
                Welcome to Zevioza
              </h1>
              <p className="text-xs text-white/80 mt-0.5">
                Surat Atelier Handcrafted Couture & Certified Silk drapes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={onOpenStylistModal}
              className="px-4 py-2 rounded-full bg-white text-[#6d0026] text-xs font-bold hover:bg-[#fed9e2] transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Stylist Concierge</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenTrackOrder()}
              className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Track Orders</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Quick Order Tracking & Atelier Guarantees */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {/* Quick Order Lookup */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-[#debfc2]/40 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-[#6d0026]" />
              <h2 className="font-display font-bold text-base text-[#1c1b1b]">
                Real-Time Order Tracking
              </h2>
            </div>
            <p className="text-xs text-[#574144] mb-4">
              Enter your Zevioza Order ID (e.g. ZV-2026-9824) to view live dispatch, AWB status, and Shiprocket delivery updates.
            </p>
          </div>

          <form onSubmit={handleTrackSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={trackInput}
                onChange={(e) => setTrackInput(e.target.value)}
                placeholder="Enter Order ID (e.g. ZV-9824)"
                className="w-full bg-[#fcf9f8] border border-[#debfc2]/60 rounded-xl px-3.5 py-2.5 text-xs text-[#1c1b1b] focus:outline-none focus:ring-1 focus:ring-[#6d0026]"
              />
              <Search className="w-3.5 h-3.5 text-[#8a7174] absolute right-3 top-3 pointer-events-none" />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-[#6d0026] text-white text-xs font-bold hover:bg-[#891738] transition-colors cursor-pointer shrink-0"
            >
              Track Now
            </button>
          </form>
        </div>

        {/* Certified Quality Card */}
        <div className="bg-gradient-to-br from-[#fed9e2]/30 via-white to-[#fdf8f9] rounded-2xl border border-[#debfc2]/40 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-[#891738]" />
              <h3 className="font-display font-bold text-base text-[#6d0026]">
                Zevioza Promise
              </h3>
            </div>
            <ul className="text-[11px] text-[#574144] space-y-2 mt-2">
              <li className="flex items-start gap-1.5">
                <span className="text-[#6d0026] font-bold">✓</span>
                <span>100% Certified Silk Mark & Handloom drapes</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#6d0026] font-bold">✓</span>
                <span>Inspected 3-point QC before dispatch</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#6d0026] font-bold">✓</span>
                <span>Hassle-free replacement & exchange support</span>
              </li>
            </ul>
          </div>
          <p className="text-[10px] text-[#8a7174] mt-4 pt-3 border-t border-[#debfc2]/30">
            Assisted by master draping artisans in Surat, India.
          </p>
        </div>
      </div>

      {/* Wishlist Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between pb-4 border-b border-[#debfc2]/40 mb-6">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#6d0026] fill-[#6d0026]" />
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1c1b1b]">
              Your Saved Wishlist
            </h2>
            <span className="ml-2 text-xs font-semibold bg-[#fed9e2] text-[#6d0026] px-2.5 py-0.5 rounded-full">
              {wishlistedProducts.length} items
            </span>
          </div>

          {wishlistedProducts.length > 0 && (
            <button
              type="button"
              onClick={onShopNow}
              className="text-xs font-semibold text-[#6d0026] hover:text-[#891738] flex items-center gap-1 cursor-pointer"
            >
              <span>Explore More</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {wishlistedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlistedProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-[#debfc2]/40 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col"
              >
                {/* Image */}
                <div
                  className="relative aspect-3/4 overflow-hidden bg-[#f6f3f2] cursor-pointer"
                  onClick={() => onSelectProduct(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveWishlist(product);
                    }}
                    title="Remove from wishlist"
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#aa314e] flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#891738]">
                      {product.categoryLabel || product.category}
                    </span>
                    <h3
                      onClick={() => onSelectProduct(product)}
                      className="font-display font-semibold text-xs text-[#1c1b1b] line-clamp-2 mt-0.5 cursor-pointer hover:text-[#6d0026]"
                    >
                      {product.name}
                    </h3>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#debfc2]/30 flex items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-sm text-[#1c1b1b]">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[10px] text-[#8a7174] line-through ml-1.5">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onAddToCart(product)}
                      className="p-2 rounded-xl bg-[#6d0026] hover:bg-[#891738] text-white transition-colors cursor-pointer shadow-xs"
                      title="Add to Cart"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#debfc2]/30 p-8">
            <Heart className="w-10 h-10 text-[#debfc2] mx-auto mb-3" />
            <h3 className="font-display text-lg font-bold text-[#1c1b1b]">
              Your wishlist is waiting to be filled
            </h3>
            <p className="text-xs text-[#574144] mt-1 max-w-sm mx-auto">
              Save your favourite silk sarees, festive kurtis, and royal lehengas by clicking the heart icon on any creation.
            </p>
            <button
              type="button"
              onClick={onShopNow}
              className="mt-5 px-6 py-2.5 rounded-full bg-[#6d0026] text-white text-xs font-bold hover:bg-[#891738] transition-all cursor-pointer shadow-xs"
            >
              Start Curating
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
