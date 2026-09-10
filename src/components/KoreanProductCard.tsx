import React, { useState } from 'react';
import { Heart, ShoppingBag, Zap, Check, Share2, Star } from 'lucide-react';
import { KProduct } from '../data/koreanStoreData';
import { Currency } from '../types';
import { formatPrice } from './ProductCard';

interface KoreanProductCardProps {
  product: KProduct;
  currency: Currency;
  isWishlisted: boolean;
  onToggleWishlist: (product: KProduct) => void;
  onSelectProduct: (product: KProduct) => void;
  onAddToCart: (product: KProduct) => void;
  onBuyNow: (product: KProduct) => void;
}

export const KoreanProductCard: React.FC<KoreanProductCardProps> = ({
  product,
  currency,
  isWishlisted,
  onToggleWishlist,
  onSelectProduct,
  onAddToCart,
  onBuyNow,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount && product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleCopyIgLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const shareText = `Check out ${product.name} on Zevioza K-Aesthetic Store! Link: https://zevioza.in/#korean-${product.id}`;
      navigator.clipboard.writeText(shareText);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2400);
    } catch {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2400);
    }
  };

  return (
    <div
      onClick={() => onSelectProduct(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-3xl overflow-hidden border-2 border-[#FFE4E8] hover:border-[#FFB6C1] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1"
    >
      {/* 1. Image Container with Hover Zoom Effect & Dotted Accent */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#FFF5F7]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Soft Pastel Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Top Badges: Discount % & 100% Female Fit Indicator */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="bg-gradient-to-r from-[#FF4D6D] to-[#E11D48] text-white text-[10px] sm:text-[11px] font-black px-2.5 py-1 rounded-full shadow-md tracking-wider uppercase flex items-center gap-1">
              <span>♡</span>
              <span>{discountPercent}% OFF</span>
            </span>
          )}

          {product.hangulName && (
            <span className="hidden sm:inline-flex bg-white/95 backdrop-blur-xs text-[#7C3AED] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#DDD6FE] shadow-2xs">
              {product.hangulName.split(' ')[0]}
            </span>
          )}
        </div>

        {/* Top Right: Wishlist Heart Icon (Cute Heart Red ♡) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all z-20 ${
            isWishlisted
              ? 'bg-[#FF4D6D] text-white shadow-md scale-110'
              : 'bg-white/90 text-[#574144] hover:text-[#FF4D6D] hover:bg-white hover:scale-110 shadow-xs'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Gen-Z Interactive Badge: "Comment LINK on IG" or "Instant Checkout" */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-auto">
          {product.badgeType === 'ig-link' ? (
            <button
              type="button"
              onClick={handleCopyIgLink}
              className="bg-white/95 backdrop-blur-md text-[#BE123C] border border-[#FFCCD5] hover:bg-[#FFF5F7] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
              title="Click to copy link for Instagram DM"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3 h-3 text-[#059669]" />
                  <span className="text-[#059669]">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3 h-3 text-[#FF4D6D]" />
                  <span>Comment LINK on IG</span>
                </>
              )}
            </button>
          ) : (
            <span className="bg-white/95 backdrop-blur-md text-[#059669] border border-[#A7F3D0] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
              <Zap className="w-3 h-3 fill-[#059669]" />
              <span>Instant Checkout</span>
            </span>
          )}

          {/* COD Tag */}
          <span className="bg-[#F3EEFF]/95 backdrop-blur-md text-[#6D28D9] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#DDD6FE]">
            COD ✓
          </span>
        </div>
      </div>

      {/* 2. Product Details with Dotted Soft Pattern */}
      <div
        className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between bg-white"
        style={{
          backgroundImage: `radial-gradient(#FFE4E8 0.75px, transparent 0.75px)`,
          backgroundSize: '12px 12px',
        }}
      >
        <div>
          {/* Tagline & Rating */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[10px] font-bold tracking-wider text-[#FF4D6D] uppercase truncate flex items-center gap-1">
              <span>♡</span>
              <span>{product.koreanTagline || product.categoryLabel}</span>
            </span>
            <div className="flex items-center gap-1 bg-[#FEFCE8] px-1.5 py-0.5 rounded-lg text-[10px] font-bold text-[#854D0E] border border-[#FEF08A]">
              <Star className="w-2.5 h-2.5 fill-[#EAB308] text-[#EAB308]" />
              <span>{product.rating}</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-body font-bold text-xs sm:text-sm text-[#1C1B1B] line-clamp-2 leading-snug group-hover:text-[#FF4D6D] transition-colors">
            {product.name}
          </h3>

          {/* Fabric / Texture Note */}
          <p className="text-[11px] text-[#8A7174] mt-1 truncate">
            {product.fabric}
          </p>
        </div>

        {/* Pricing Layout */}
        <div className="mt-3 pt-2.5 border-t border-[#FFE4E8]">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-base sm:text-lg font-black text-[#1C1B1B] font-body tracking-tight">
              {formatPrice(product.price, currency)}
            </span>
            {hasDiscount && product.originalPrice && (
              <span className="text-xs text-[#A1A1AA] line-through font-medium">
                {formatPrice(product.originalPrice, currency)}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="text-[11px] font-extrabold text-[#FF4D6D]">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Free Delivery Tag */}
          <p className="text-[10px] text-[#059669] font-bold mt-0.5 flex items-center gap-1">
            <span>✨ Free Express Delivery • College Drop</span>
          </p>
        </div>

        {/* 3. Action Buttons: "Add to Bag" & "Buy Now" */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-[#FFCCD5] bg-[#FFF5F7] hover:bg-[#FFE4E8] text-[#BE123C] text-xs font-bold tracking-wide transition-all active:scale-95"
            title="Add to Shopping Bag"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Bag</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onBuyNow(product);
            }}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-gradient-to-r from-[#FF4D6D] via-[#E11D48] to-[#BE123C] hover:opacity-95 text-white text-xs font-bold tracking-wide shadow-xs hover:shadow-md transition-all active:scale-95"
            title="Instant Checkout"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
