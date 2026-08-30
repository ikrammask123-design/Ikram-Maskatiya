import React from 'react';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { Product, Currency } from '../types';
import { CURRENCY_RATES } from '../data/products';

interface ProductCardProps {
  product: Product;
  currency: Currency;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const formatPrice = (priceInINR: number, currency: Currency): string => {
  const rateObj = CURRENCY_RATES[currency] || CURRENCY_RATES.INR;
  const converted = Math.round(priceInINR * rateObj.rate);
  if (currency === 'INR') {
    return `₹${priceInINR.toLocaleString('en-IN')}.00`;
  }
  return `${rateObj.symbol}${converted.toLocaleString()}`;
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  isWishlisted,
  onToggleWishlist,
  onSelectProduct,
  onAddToCart,
}) => {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-[#debfc2]/40 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(109,0,38,0.12)] transition-all duration-300"
    >
      {/* Image & Badges */}
      <div
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#f6f3f2] cursor-pointer"
        onClick={() => onSelectProduct(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106"
          loading="lazy"
        />

        {/* Wishlist Button */}
        <button
          id={`btn-wishlist-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all ${
            isWishlisted
              ? 'bg-[#8e1b3b] text-white shadow-md'
              : 'bg-white/85 text-[#574144] hover:text-[#6d0026] hover:bg-white shadow-xs'
          } z-10 focus:outline-none cursor-pointer`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart
            className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`}
          />
        </button>

        {/* Tags on top-left (Sale / New / Bestseller) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {hasDiscount && (
            <span className="bg-[#aa314e] text-white text-[10px] tracking-wider uppercase font-bold px-2.5 py-1 rounded-full shadow-xs">
              Sale
            </span>
          )}
          {product.isNewArrival && !hasDiscount && (
            <span className="bg-[#2e7d32] text-white text-[10px] tracking-wider uppercase font-bold px-2.5 py-1 rounded-full shadow-xs">
              New
            </span>
          )}
          {product.isBestSeller && !hasDiscount && !product.isNewArrival && (
            <span className="bg-[#6d0026] text-white text-[10px] tracking-wider uppercase font-bold px-2.5 py-1 rounded-full shadow-xs">
              Best Seller
            </span>
          )}
        </div>

        {/* Hover Quick Actions Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <button
            id={`btn-quickview-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            className="flex-1 bg-white hover:bg-[#f6f3f2] text-[#6d0026] py-2 px-3 rounded-full text-xs font-bold tracking-wide flex items-center justify-center gap-1.5 shadow-md transition-all hover:scale-102 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>
          <button
            id={`btn-quickadd-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="bg-[#6d0026] hover:bg-[#8e1b3b] text-white p-2.5 rounded-full shadow-md transition-all hover:scale-105 cursor-pointer"
            title="Add to shopping bag"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div
        className="p-4 sm:p-5 flex flex-col flex-grow justify-between cursor-pointer"
        onClick={() => onSelectProduct(product)}
      >
        <div>
          {/* Rating Line */}
          <div className="flex items-center gap-1.5 text-xs text-[#574144] mb-1.5">
            <div className="flex items-center text-[#e5a93c]">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="font-bold text-[#1c1b1b] text-xs">
              {product.rating}
            </span>
            <span className="text-[11px] text-[#8a7174]">
              ({product.reviewCount})
            </span>
          </div>

          {/* Product Title */}
          <h3 className="font-display text-base font-bold text-[#1c1b1b] group-hover:text-[#6d0026] transition-colors leading-snug line-clamp-1 mb-1">
            {product.name}
          </h3>

          {/* Subtitle / Craft detail */}
          <p className="text-xs text-[#8a7174] font-body line-clamp-1 mb-3">
            {product.fabric || 'Premium handcrafted piece'}
          </p>
        </div>

        {/* Pricing & Add to Cart button */}
        <div className="flex items-center justify-between pt-2 border-t border-[#debfc2]/30 mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-base sm:text-lg font-extrabold text-[#6d0026]">
              {formatPrice(product.price, currency)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-[#8a7174] line-through font-body">
                {formatPrice(product.originalPrice, currency)}
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="text-[11px] font-bold text-[#6d0026] hover:text-[#8e1b3b] uppercase tracking-wider underline cursor-pointer"
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
};
