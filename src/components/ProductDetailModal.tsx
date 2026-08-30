import React, { useState } from 'react';
import {
  X,
  Heart,
  ShoppingBag,
  Star,
  Check,
  ShieldCheck,
  Truck,
  Sparkles,
  Scissors,
  Share2,
} from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice } from './ProductCard';

interface ProductDetailModalProps {
  product: Product | null;
  currency: Currency;
  isWishlisted: boolean;
  onClose: () => void;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (
    product: Product,
    size?: string,
    customStitching?: boolean,
    notes?: string
  ) => void;
  onBuyNow: (
    product: Product,
    size?: string,
    customStitching?: boolean,
    notes?: string
  ) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  currency,
  isWishlisted,
  onClose,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
}) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes ? product.sizes[0] : 'Free Size'
  );
  const [customStitching, setCustomStitching] = useState<boolean>(false);
  const [customNotes, setCustomNotes] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [addedToast, setAddedToast] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const images = product.galleryImages && product.galleryImages.length > 0
    ? product.galleryImages
    : [product.image];

  const handleAdd = () => {
    onAddToCart(product, selectedSize, customStitching, customNotes);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleBuy = () => {
    onBuyNow(product, selectedSize, customStitching, customNotes);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div
      id="product-detail-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
    >
      <div
        id="product-detail-modal-container"
        className="relative bg-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-[#debfc2]/30 max-h-[92vh] flex flex-col md:flex-row my-auto animate-scaleUp"
      >
        {/* Close Button */}
        <button
          id="btn-close-modal"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-white/80 hover:bg-white text-[#574144] p-2 rounded-full shadow-md backdrop-blur-md transition-all focus:outline-none"
          aria-label="Close product view"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Gallery Section */}
        <div className="md:w-1/2 bg-[#f6f3f2] p-5 sm:p-8 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-[#f0eded]">
          <div className="relative aspect-3/4 w-full max-h-[380px] md:max-h-[460px] rounded-xl overflow-hidden bg-white shadow-xs">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />

            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-semibold text-[#6d0026] flex items-center gap-1.5 shadow-xs">
              <Sparkles className="w-3 h-3 text-[#aa314e]" />
              Artisan Weave
            </div>
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto py-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === img
                      ? 'border-[#6d0026] scale-105 shadow-sm'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} preview ${idx}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details & Purchase */}
        <div className="md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between">
          <div>
            {/* Category & Ratings */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#8a7174] uppercase tracking-widest font-body">
                {product.categoryLabel} • {product.fabric}
              </span>
              <div className="flex items-center gap-1 text-xs text-[#6d0026] font-medium bg-[#ffd9dd]/50 px-2.5 py-0.5 rounded-full">
                <Star className="w-3.5 h-3.5 fill-[#dbb46b] text-[#dbb46b]" />
                <span>{product.rating}</span>
                <span className="text-[#8a7174]">({product.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1c1b1b] mb-2 leading-tight">
              {product.name}
            </h2>

            {/* Weave highlight */}
            {product.weave && (
              <p className="text-xs font-medium text-[#891738] bg-[#ffd9dd]/30 inline-block px-2.5 py-1 rounded-md mb-4">
                {product.weave}
              </p>
            )}

            {/* Pricing */}
            <div className="flex items-baseline gap-3 mb-5">
              <span className="font-display text-2xl sm:text-3xl font-bold text-[#6d0026]">
                {formatPrice(product.price, currency)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-sm text-[#8a7174] line-through font-body">
                    {formatPrice(product.originalPrice, currency)}
                  </span>
                  <span className="text-xs font-semibold text-[#453000] bg-[#ffdea5] px-2 py-0.5 rounded-full">
                    {Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100
                    )}
                    % OFF
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-[#574144] font-body leading-relaxed mb-4">
              {product.description}
            </p>

            {/* Artisanal Heritage Note */}
            <div className="p-3.5 bg-[#f6f3f2] rounded-xl border border-[#debfc2]/30 mb-5">
              <div className="flex items-start gap-2.5 text-xs text-[#574144]">
                <ShieldCheck className="w-4 h-4 text-[#aa314e] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#1c1b1b] block">
                    Artisanal Craftsmanship:
                  </span>
                  {product.craftDetails}
                </div>
              </div>
            </div>

            {/* Sizes (if available) */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-[#1c1b1b] uppercase tracking-wider">
                    Select Size
                  </span>
                  <span className="text-xs text-[#6d0026] underline cursor-pointer">
                    Bespoke Size Guide
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all ${
                        selectedSize === size
                          ? 'bg-[#6d0026] text-white shadow-xs'
                          : 'bg-[#f0eded] text-[#574144] hover:bg-[#ffd9dd]/50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Blouse Tailoring (for Sarees & Dresses) */}
            {(product.category === 'sarees' || product.includesBlousePiece) && (
              <div className="mb-5 p-3 rounded-xl border border-[#debfc2]/40 bg-[#fcf9f8]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customStitching}
                    onChange={(e) => setCustomStitching(e.target.checked)}
                    className="rounded text-[#6d0026] focus:ring-[#6d0026] w-4 h-4"
                  />
                  <span className="text-xs font-semibold text-[#1c1b1b] flex items-center gap-1.5">
                    <Scissors className="w-3.5 h-3.5 text-[#6d0026]" />
                    Include Custom Blouse Tailoring (+INR 2,500)
                  </span>
                </label>
                {customStitching && (
                  <input
                    type="text"
                    placeholder="Enter bust, waist measurements or styling notes..."
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    className="mt-2 w-full text-xs p-2 bg-white border border-[#debfc2] rounded-lg focus:outline-none focus:border-[#6d0026]"
                  />
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#f0eded]">
            {addedToast && (
              <div className="mb-3 text-center text-xs font-semibold text-emerald-800 bg-emerald-50 py-2 rounded-lg flex items-center justify-center gap-1.5 animate-fadeIn">
                <Check className="w-4 h-4 text-emerald-600" />
                Added to your boutique bag!
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                id="btn-modal-add-to-cart"
                onClick={handleAdd}
                className="flex-1 bg-[#6d0026] text-white py-3.5 px-4 rounded-full font-body text-xs font-semibold tracking-widest uppercase hover:bg-[#8e1b3b] active:scale-98 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <ShoppingBag className="w-4 h-4" />
                ADD TO BAG
              </button>

              <button
                id="btn-modal-buy-now"
                onClick={handleBuy}
                className="bg-[#ffd9dd] text-[#6d0026] py-3.5 px-5 rounded-full font-body text-xs font-semibold tracking-widest uppercase hover:bg-[#fed9e2] active:scale-98 transition-all"
              >
                BUY NOW
              </button>

              <button
                id="btn-modal-wishlist"
                onClick={() => onToggleWishlist(product)}
                className={`p-3 rounded-full border transition-all ${
                  isWishlisted
                    ? 'bg-[#8e1b3b] text-white border-[#8e1b3b]'
                    : 'border-[#debfc2] text-[#574144] hover:text-[#6d0026] hover:bg-[#ffd9dd]/30'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                className="p-3 rounded-full border border-[#debfc2] text-[#574144] hover:text-[#6d0026] hover:bg-[#ffd9dd]/30 transition-all relative"
                title="Share piece"
              >
                <Share2 className="w-4 h-4" />
                {copiedLink && (
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-0.5 px-2 rounded whitespace-nowrap">
                    Link Copied!
                  </span>
                )}
              </button>
            </div>

            {/* Delivery Assurance */}
            <div className="flex items-center justify-center gap-4 mt-4 text-[11px] text-[#8a7174]">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#6d0026]" /> Complimentary Luxury Packaging
              </span>
              <span>•</span>
              <span>Global Express Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
