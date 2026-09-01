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
  Palette,
  Eye,
} from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice } from './ProductCard';
import { FlipkartProductDetails } from './FlipkartProductDetails';

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
    notes?: string,
    color?: string,
    image?: string
  ) => void;
  onBuyNow: (
    product: Product,
    size?: string,
    customStitching?: boolean,
    notes?: string,
    color?: string,
    image?: string
  ) => void;
}

// Helper to determine background hex/style for color name
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

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  currency,
  isWishlisted,
  onClose,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>(
    product?.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Free Size'
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    product?.availableColors && product.availableColors.length > 0
      ? product.availableColors[0]
      : product?.color || ''
  );
  const [customStitching, setCustomStitching] = useState<boolean>(false);
  const [customNotes, setCustomNotes] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string>(product?.image || '');
  const [activeGallery, setActiveGallery] = useState<string[]>([]);
  const [addedToast, setAddedToast] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showReviewsTab, setShowReviewsTab] = useState(false);

  React.useEffect(() => {
    if (product) {
      const initialColor =
        product.availableColors && product.availableColors.length > 0
          ? product.availableColors[0]
          : product.color || '';

      setSelectedColor(initialColor);
      setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Free Size');
      setCustomStitching(false);
      setCustomNotes('');
      setShowSizeGuide(false);
      setShowReviewsTab(false);

      // Check if variant matches initial color
      const matchingVariant = product.colorVariants?.find(
        (v) =>
          v.name.toLowerCase() === initialColor.toLowerCase() ||
          initialColor.toLowerCase().includes(v.name.toLowerCase()) ||
          v.name.toLowerCase().includes(initialColor.toLowerCase())
      );

      if (matchingVariant) {
        setSelectedImage(matchingVariant.image);
        setActiveGallery(matchingVariant.galleryImages || product.galleryImages || [product.image]);
      } else {
        setSelectedImage(product.image || '');
        setActiveGallery(product.galleryImages && product.galleryImages.length > 0 ? product.galleryImages : [product.image]);
      }
    }
  }, [product]);

  if (!product) return null;

  const handleColorSelect = (col: string) => {
    setSelectedColor(col);

    // 1. Look for variant image
    const variant = product.colorVariants?.find(
      (v) =>
        v.name.toLowerCase() === col.toLowerCase() ||
        col.toLowerCase().includes(v.name.toLowerCase()) ||
        v.name.toLowerCase().includes(col.toLowerCase())
    );

    if (variant) {
      setSelectedImage(variant.image);
      if (variant.galleryImages && variant.galleryImages.length > 0) {
        setActiveGallery(variant.galleryImages);
      }
      return;
    }

    // 2. Fallback: match by index from galleryImages
    const colorIndex = product.availableColors?.indexOf(col) ?? -1;
    if (
      colorIndex >= 0 &&
      product.galleryImages &&
      product.galleryImages[colorIndex]
    ) {
      setSelectedImage(product.galleryImages[colorIndex]);
    }
  };

  const displayImage = selectedImage || product.image;
  const images = (activeGallery.length > 0
    ? activeGallery
    : product.galleryImages && product.galleryImages.length > 0
    ? product.galleryImages
    : [product.image]).filter(Boolean);

  const handleAdd = () => {
    onAddToCart(product, selectedSize, customStitching, customNotes, selectedColor, displayImage);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleBuy = () => {
    onBuyNow(product, selectedSize, customStitching, customNotes, selectedColor, displayImage);
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
              key={displayImage}
              src={displayImage}
              alt={`${product.name} - ${selectedColor}`}
              className="w-full h-full object-cover object-center transition-all duration-300 animate-fadeIn"
            />

            {/* Selected Shade Indicator Badge */}
            {selectedColor && (
              <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-medium text-white flex items-center gap-1.5 shadow-md">
                <span
                  className="w-2.5 h-2.5 rounded-full border border-white/40 shadow-xs"
                  style={{ backgroundColor: getColorHex(selectedColor) }}
                />
                <span>Shade: {selectedColor}</span>
              </div>
            )}

            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-semibold text-[#6d0026] flex items-center gap-1.5 shadow-xs">
              <Sparkles className="w-3 h-3 text-[#aa314e]" />
              Artisan Weave
            </div>
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto py-1 max-w-full">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    selectedImage === img
                      ? 'border-[#6d0026] scale-105 shadow-sm ring-2 ring-[#6d0026]/20'
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

            {/* Available Colors with Instant Photo Switching */}
            {product.availableColors && product.availableColors.length > 0 && (
              <div className="mb-5 p-3.5 bg-[#fff8f8] rounded-xl border border-[#debfc2]/50">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-[#1c1b1b] uppercase tracking-wider flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-[#6d0026]" />
                    Select Shade: <span className="text-[#6d0026] capitalize font-bold">{selectedColor}</span>
                  </span>
                  <span className="text-[11px] text-[#8a7174]">
                    Tap shade to view color
                  </span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.availableColors.map((col) => {
                    const isSelected = selectedColor === col;
                    const hexCode = getColorHex(col);
                    return (
                      <button
                        key={col}
                        type="button"
                        onClick={() => handleColorSelect(col)}
                        className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#6d0026] bg-[#6d0026] text-white shadow-sm ring-2 ring-[#6d0026]/20 scale-102'
                            : 'border-[#debfc2] text-[#574144] bg-white hover:border-[#6d0026] hover:bg-[#ffd9dd]/30'
                        }`}
                      >
                        <span
                          className={`w-3.5 h-3.5 rounded-full shrink-0 border transition-transform ${
                            isSelected ? 'border-white scale-110 shadow-xs' : 'border-black/20 group-hover:scale-110'
                          }`}
                          style={{ backgroundColor: hexCode }}
                        />
                        <span>{col}</span>
                        {isSelected && <Check className="w-3 h-3 text-white ml-0.5 stroke-[2.5]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sizes (if available) */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-[#1c1b1b] uppercase tracking-wider">
                    Select Size
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="text-xs text-[#6d0026] hover:text-[#891738] underline font-medium cursor-pointer flex items-center gap-1"
                  >
                    <span>{showSizeGuide ? 'Hide Size Chart' : 'Bespoke Size Guide'}</span>
                  </button>
                </div>

                {/* Size guide table */}
                {showSizeGuide && (
                  <div className="mb-3 p-3 bg-[#f6f3f2] rounded-xl border border-[#debfc2]/50 text-xs animate-fadeIn">
                    <div className="flex justify-between items-center mb-2 font-semibold text-[#6d0026]">
                      <span>Standard Sizing Chart (Inches)</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 text-[11px] text-center bg-white/70 p-2 rounded-lg border border-[#debfc2]/30">
                      <span className="font-bold text-[#1c1b1b]">Size</span>
                      <span className="font-bold text-[#1c1b1b]">Bust</span>
                      <span className="font-bold text-[#1c1b1b]">Waist</span>
                      <span className="font-bold text-[#1c1b1b]">Length</span>

                      <span className="py-0.5 font-medium">S</span>
                      <span className="py-0.5">34"</span>
                      <span className="py-0.5">30"</span>
                      <span className="py-0.5">44" / Maxi</span>

                      <span className="py-0.5 font-medium">M</span>
                      <span className="py-0.5">36"</span>
                      <span className="py-0.5">32"</span>
                      <span className="py-0.5">44" / Maxi</span>

                      <span className="py-0.5 font-medium">L</span>
                      <span className="py-0.5">38"</span>
                      <span className="py-0.5">34"</span>
                      <span className="py-0.5">45" / Maxi</span>

                      <span className="py-0.5 font-medium">XL</span>
                      <span className="py-0.5">40"</span>
                      <span className="py-0.5">36"</span>
                      <span className="py-0.5">45" / Maxi</span>

                      <span className="py-0.5 font-medium">XXL</span>
                      <span className="py-0.5">42"</span>
                      <span className="py-0.5">38"</span>
                      <span className="py-0.5">46" / Maxi</span>
                    </div>
                  </div>
                )}

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

            {/* Flipkart-Style "All details" Specifications Section */}
            <FlipkartProductDetails product={product} />

            {/* Verified Customer Reviews Section (if available) */}
            {product.reviews && product.reviews.length > 0 && (
              <div className="mb-5 p-3.5 bg-[#fcf9f8] rounded-xl border border-[#debfc2]/40">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-[#1c1b1b] uppercase tracking-wider flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-[#dbb46b] text-[#dbb46b]" />
                    Verified Customer Reviews ({product.reviewCount || 115})
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowReviewsTab(!showReviewsTab)}
                    className="text-xs text-[#6d0026] hover:text-[#891738] font-semibold underline"
                  >
                    {showReviewsTab ? 'Hide Reviews' : 'Read Reviews'}
                  </button>
                </div>

                {showReviewsTab && (
                  <div className="space-y-3 max-h-56 overflow-y-auto pr-1 text-xs divide-y divide-[#debfc2]/30 animate-fadeIn">
                    {product.reviews.map((rev) => (
                      <div key={rev.id} className="pt-2 first:pt-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-[#1c1b1b]">{rev.author}</span>
                            {rev.verified && (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-medium flex items-center gap-0.5">
                                <Check className="w-2.5 h-2.5" /> Verified
                              </span>
                            )}
                          </div>
                          <div className="flex text-[#dbb46b]">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-[#574144] italic leading-relaxed text-[11.5px]">
                          "{rev.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
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

            {/* WhatsApp Direct Inquiry */}
            <div className="mt-3 text-center">
              <a
                id="btn-modal-whatsapp-inquiry"
                href={`https://wa.me/918238023498?text=${encodeURIComponent(
                  `Namaste! 🙏 I am interested in ordering: *${product.name}* (Price: ₹${product.price}${
                    selectedColor ? `, Color/Shade: ${selectedColor}` : ''
                  }${selectedSize ? `, Size: ${selectedSize}` : ''}${
                    customStitching ? ', with Custom Stitching' : ''
                  }). Please confirm stock and delivery timeline!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-semibold bg-emerald-50 hover:bg-emerald-100/80 px-4 py-2 rounded-full border border-emerald-200 transition-all"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2ZM12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.04 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15ZM16.56 14.39C16.31 14.26 15.09 13.66 14.86 13.58C14.63 13.5 14.47 13.46 14.31 13.7C14.15 13.94 13.68 14.5 13.54 14.66C13.4 14.82 13.26 14.84 13.01 14.72C12.76 14.6 11.96 14.34 11.01 13.49C10.27 12.83 9.77 12.01 9.63 11.77C9.49 11.53 9.61 11.4 9.74 11.27C9.85 11.16 9.99 10.98 10.12 10.83C10.25 10.68 10.29 10.57 10.37 10.41C10.45 10.25 10.41 10.11 10.35 9.99C10.29 9.87 9.81 8.69 9.61 8.21C9.41 7.73 9.21 7.8 9.06 7.79C8.92 7.78 8.76 7.78 8.6 7.78C8.44 7.78 8.18 7.84 7.96 8.08C7.74 8.32 7.12 8.9 7.12 10.08C7.12 11.26 7.98 12.4 8.1 12.56C8.22 12.72 9.8 15.15 12.22 16.19C12.8 16.44 13.25 16.59 13.6 16.7C14.18 16.89 14.71 16.86 15.13 16.8C15.6 16.73 16.56 16.22 16.76 15.65C16.96 15.08 16.96 14.6 16.9 14.5C16.84 14.4 16.71 14.34 16.56 14.21V14.39Z" />
                </svg>
                <span>Ask Stylist on WhatsApp</span>
              </a>
            </div>

            {/* Delivery Assurance */}
            <div className="flex items-center justify-center gap-4 mt-3 text-[11px] text-[#8a7174]">
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
