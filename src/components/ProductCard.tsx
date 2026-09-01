import React, { useState } from 'react';
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

const getColorHex = (colorName: string, explicitHex?: string): string => {
  if (explicitHex) return explicitHex;
  const lower = colorName.toLowerCase();
  if (lower.includes('navy') || lower.includes('blue')) return '#1e3a8a';
  if (lower.includes('red') || lower.includes('maroon') || lower.includes('wine') || lower.includes('plum')) return '#991b1b';
  if (lower.includes('green') || lower.includes('sea') || lower.includes('jade') || lower.includes('mint')) return '#166534';
  if (lower.includes('black')) return '#18181b';
  if (lower.includes('brown')) return '#78350f';
  if (lower.includes('beige') || lower.includes('cream') || lower.includes('ivory')) return '#e6ccb2';
  if (lower.includes('orange') || lower.includes('rust')) return '#ea580c';
  if (lower.includes('yellow') || lower.includes('mustard')) return '#ca8a04';
  if (lower.includes('pink') || lower.includes('rose')) return '#db2777';
  if (lower.includes('lavender') || lower.includes('purple')) return '#7c3aed';
  if (lower.includes('gold')) return '#d97706';
  if (lower.includes('white')) return '#f8fafc';
  return '#881337';
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  isWishlisted,
  onToggleWishlist,
  onSelectProduct,
  onAddToCart,
}) => {
  const [activeColor, setActiveColor] = useState<string>(
    product.availableColors && product.availableColors.length > 0
      ? product.availableColors[0]
      : product.color || ''
  );
  const [cardImage, setCardImage] = useState<string>(product.image);

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  const handleSelectColor = (col: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveColor(col);

    // 1. Check in colorVariants
    const variant = product.colorVariants?.find(
      (v) =>
        v.name.toLowerCase() === col.toLowerCase() ||
        col.toLowerCase().includes(v.name.toLowerCase()) ||
        v.name.toLowerCase().includes(col.toLowerCase())
    );

    if (variant) {
      setCardImage(variant.image);
      return;
    }

    // 2. Fallback: match by index
    const colorIndex = product.availableColors?.indexOf(col) ?? -1;
    if (
      colorIndex >= 0 &&
      product.galleryImages &&
      product.galleryImages[colorIndex]
    ) {
      setCardImage(product.galleryImages[colorIndex]);
    }
  };

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
          key={cardImage}
          src={cardImage}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106 animate-fadeIn"
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
          <p className="text-xs text-[#8a7174] font-body line-clamp-1 mb-2">
            {product.fabric || 'Premium handcrafted piece'}
          </p>

          {/* Interactive Color Swatches if multi-color */}
          {product.availableColors && product.availableColors.length > 1 && (
            <div className="flex items-center gap-1.5 mb-2.5 py-0.5">
              <span className="text-[10px] text-[#8a7174] font-medium mr-0.5">Shades:</span>
              <div className="flex items-center gap-1.5 overflow-x-hidden">
                {product.availableColors.slice(0, 5).map((col) => {
                  const isCurrent = activeColor === col;
                  const hex = getColorHex(col);
                  return (
                    <button
                      key={col}
                      type="button"
                      title={`View ${col}`}
                      onClick={(e) => handleSelectColor(col, e)}
                      className={`w-3.5 h-3.5 rounded-full border transition-all cursor-pointer ${
                        isCurrent
                          ? 'border-[#6d0026] scale-125 ring-2 ring-[#6d0026]/30 shadow-xs'
                          : 'border-black/20 hover:scale-115 opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: hex }}
                    />
                  );
                })}
                {product.availableColors.length > 5 && (
                  <span className="text-[10px] text-[#8a7174] font-semibold">
                    +{product.availableColors.length - 5}
                  </span>
                )}
              </div>
            </div>
          )}
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

