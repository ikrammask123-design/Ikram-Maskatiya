import React, { useState } from 'react';
import { Heart, ShoppingBag, Star, Sparkles, Check, Share2 } from 'lucide-react';
import { Product, Currency } from '../types';

export const formatPrice = (price: number, currency: Currency = 'INR'): string => {
  switch (currency) {
    case 'USD':
      return `$${(price / 83).toFixed(2)}`;
    case 'EUR':
      return `€${(price / 90).toFixed(2)}`;
    case 'GBP':
      return `£${(price / 105).toFixed(2)}`;
    case 'AED':
      return `AED ${(price / 22.6).toFixed(0)}`;
    case 'INR':
    default:
      return `₹${price.toLocaleString('en-IN')}`;
  }
};

interface ProductCardProps {
  product: Product;
  currency: Currency;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  isWishlisted,
  onToggleWishlist,
  onSelectProduct,
  onAddToCart,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount && product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const directUrl = `${window.location.origin}${window.location.pathname}?product=${product.id}`;
    const shareText = `Check out ${product.name} on Zevioza! ${directUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.name} | Zevioza Couture`,
          text: shareText,
          url: directUrl,
        });
        return;
      } catch {}
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="group relative bg-white rounded-2xl overflow-hidden border border-[#debfc2]/40 hover:border-[#6d0026]/30 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-0.5"
    >
      {/* 1. Image Container */}
      <div className="relative aspect-3/4 w-full overflow-hidden bg-[#f6f3f2]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-xs hover:bg-white transition-all cursor-pointer z-10"
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted
                ? 'fill-[#6d0026] text-[#6d0026]'
                : 'text-[#8a7174] group-hover:text-[#6d0026]'
            }`}
          />
        </button>

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShare}
          className="absolute top-12 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-xs hover:bg-white text-[#8a7174] hover:text-[#6d0026] transition-all cursor-pointer opacity-0 group-hover:opacity-100 z-10"
          title="Share Product"
        >
          {copiedLink ? (
            <Check className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <Share2 className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Badge: Best Seller / New Arrival / Discount */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {product.isBestSeller && (
            <span className="bg-[#6d0026] text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase shadow-xs flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 fill-current" />
              <span>Bestseller</span>
            </span>
          )}
          {product.isNewArrival && !product.isBestSeller && (
            <span className="bg-[#453000] text-[#ffdea5] text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase shadow-xs">
              New Arrival
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-[#fed9e2] text-[#6d0026] text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.5 rounded-md self-start">
              {discountPercent}% OFF
            </span>
          )}
        </div>
      </div>

      {/* 2. Product Details */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[10px] font-bold tracking-wider text-[#891738] uppercase truncate">
              {product.categoryLabel || product.category}
            </span>
            {product.rating > 0 && (
              <div className="flex items-center gap-1 bg-[#fff8eb] px-1.5 py-0.5 rounded-md text-[10px] font-bold text-[#b45309] border border-[#fed7aa]/50">
                <Star className="w-2.5 h-2.5 fill-[#f59e0b] text-[#f59e0b]" />
                <span>{product.rating}</span>
              </div>
            )}
          </div>

          {/* Product Title */}
          <h3 className="font-display font-semibold text-xs sm:text-sm text-[#1c1b1b] line-clamp-2 leading-snug group-hover:text-[#6d0026] transition-colors">
            {product.name}
          </h3>

          {/* Fabric / Craft Details */}
          {product.fabric && (
            <p className="text-[11px] text-[#8a7174] mt-1 truncate">
              {product.fabric}
            </p>
          )}
        </div>

        {/* Price & Action */}
        <div className="mt-3 pt-2.5 border-t border-[#debfc2]/30 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-sm sm:text-base font-bold text-[#1c1b1b] font-body">
                {formatPrice(product.price, currency)}
              </span>
              {hasDiscount && product.originalPrice && (
                <span className="text-[11px] text-[#8a7174] line-through">
                  {formatPrice(product.originalPrice, currency)}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#6d0026] hover:bg-[#891738] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
            title="Add to Bag"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
