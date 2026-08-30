import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Gift,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Truck,
  CreditCard,
} from 'lucide-react';
import { CartItem, Currency } from '../types';
import { formatPrice } from './ProductCard';
import { CURRENCY_RATES } from '../data/products';
import { Logo } from './Logo';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: Currency;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onSelectProduct: (product: any) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [giftWrap, setGiftWrap] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');

  // Checkout Form State
  const [shippingInfo, setShippingInfo] = useState({
    name: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    phone: '+91 98765 43210',
    address: '42, Gulmohar Enclave, Malabar Hill',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400006',
    country: 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'vault'>('card');
  const [orderId, setOrderId] = useState('');

  if (!isOpen) return null;

  const rawSubtotal = items.reduce((sum, item) => {
    let price = item.product.price;
    if (item.customStitching) price += 2500;
    return sum + price * item.quantity;
  }, 0);

  const discountAmount = discountApplied ? Math.round(rawSubtotal * 0.1) : 0;
  const giftWrapCost = giftWrap ? 500 : 0;
  const grandTotal = Math.max(0, rawSubtotal - discountAmount + giftWrapCost);

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'ZEVIOZA10') {
      setDiscountApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid privilege code. Try "ZEVIOZA10"');
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `ZV-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(newId);
    setCheckoutStep('success');
  };

  const handleFinishSuccess = () => {
    onClearCart();
    setCheckoutStep('cart');
    onClose();
  };

  return (
    <div
      id="cart-drawer-overlay"
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end"
    >
      <div
        className="w-full max-w-md bg-[#fcf9f8] h-full shadow-2xl flex flex-col justify-between animate-slideLeft"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#debfc2]/30 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <span className="font-display text-xl font-bold text-[#6d0026]">
              {checkoutStep === 'cart'
                ? 'Your Shopping Bag'
                : checkoutStep === 'checkout'
                ? 'Boutique Checkout'
                : 'Order Confirmed'}
            </span>
            {checkoutStep === 'cart' && (
              <span className="text-xs font-semibold text-[#8a7174] bg-[#f0eded] px-2 py-0.5 rounded-full">
                {items.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#574144] hover:bg-[#fed9e2]/30 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-5">
          {checkoutStep === 'cart' && (
            <>
              {items.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 rounded-full bg-[#fed9e2]/50 mx-auto flex items-center justify-center text-[#6d0026] mb-4">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-[#1c1b1b] mb-1">
                    Your bag is empty
                  </h3>
                  <p className="text-xs text-[#574144] mb-6">
                    Explore our handwoven sarees and artisanal kurtis to curate your wardrobe.
                  </p>
                  <button
                    onClick={onClose}
                    className="bg-[#6d0026] text-white px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#8e1b3b]"
                  >
                    Explore Curations
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3 bg-white rounded-xl border border-[#debfc2]/30 shadow-xs"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-26 object-cover rounded-lg bg-[#f6f3f2] shrink-0"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-display text-sm font-semibold text-[#1c1b1b] line-clamp-1">
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() => onRemoveItem(item.id)}
                              className="text-[#8a7174] hover:text-[#ba1a1a] p-1"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="text-[11px] text-[#8a7174] block mt-0.5">
                            {item.product.fabric}
                          </span>
                          {item.selectedSize && (
                            <span className="text-[11px] font-semibold text-[#6d0026] block">
                              Size: {item.selectedSize}
                            </span>
                          )}
                          {item.customStitching && (
                            <span className="text-[10px] text-[#891738] bg-[#ffd9dd]/50 px-1.5 py-0.5 rounded mt-1 inline-block">
                              + Custom Blouse (₹2,500)
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#f0eded]">
                          <span className="font-display text-sm font-bold text-[#6d0026]">
                            {formatPrice(
                              (item.product.price + (item.customStitching ? 2500 : 0)) *
                                item.quantity,
                              currency
                            )}
                          </span>

                          <div className="flex items-center gap-2 bg-[#f6f3f2] rounded-full px-2 py-0.5">
                            <button
                              onClick={() => onUpdateQuantity(item.id, -1)}
                              className="p-1 hover:text-[#6d0026]"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-semibold px-1">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              className="p-1 hover:text-[#6d0026]"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Gift Wrap Add-on */}
                  <div className="p-3 bg-[#ffd9dd]/30 rounded-xl border border-[#debfc2]/40 flex items-center justify-between">
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs text-[#574144]">
                      <Gift className="w-4 h-4 text-[#891738]" />
                      <span>Signature Rose Velvet Gift Box (+₹500)</span>
                    </label>
                    <input
                      type="checkbox"
                      checked={giftWrap}
                      onChange={(e) => setGiftWrap(e.target.checked)}
                      className="rounded text-[#6d0026] focus:ring-[#6d0026] w-4 h-4"
                    />
                  </div>

                  {/* Promo Code Box */}
                  <div className="p-3 bg-white rounded-xl border border-[#debfc2]/30">
                    <span className="text-[11px] font-semibold text-[#8a7174] uppercase tracking-wider block mb-2">
                      Privilege Code
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. ZEVIOZA10"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1 text-xs px-3 py-2 bg-[#f6f3f2] border border-[#debfc2]/40 rounded-lg focus:outline-none focus:border-[#6d0026]"
                      />
                      <button
                        onClick={handleApplyPromo}
                        className="bg-[#6d0026] text-white px-3 py-2 rounded-lg text-xs font-semibold uppercase hover:bg-[#8e1b3b]"
                      >
                        Apply
                      </button>
                    </div>
                    {discountApplied && (
                      <span className="text-xs text-emerald-700 font-semibold block mt-1.5">
                        ✓ 10% VIP Privilege Discount applied!
                      </span>
                    )}
                    {promoError && (
                      <span className="text-xs text-red-600 font-medium block mt-1.5">
                        {promoError}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {checkoutStep === 'checkout' && (
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="flex flex-col gap-4">
              <div className="p-3 bg-white rounded-xl border border-[#debfc2]/30">
                <span className="text-xs font-semibold text-[#6d0026] uppercase tracking-wider block mb-3">
                  1. Boutique Delivery Address
                </span>
                <div className="flex flex-col gap-2.5">
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={shippingInfo.name}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, name: e.target.value })
                    }
                    className="text-xs p-2.5 bg-[#f6f3f2] rounded-lg border border-[#debfc2]/40 focus:outline-none focus:border-[#6d0026]"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="email"
                      required
                      placeholder="Email"
                      value={shippingInfo.email}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, email: e.target.value })
                      }
                      className="text-xs p-2.5 bg-[#f6f3f2] rounded-lg border border-[#debfc2]/40 focus:outline-none focus:border-[#6d0026]"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Phone"
                      value={shippingInfo.phone}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, phone: e.target.value })
                      }
                      className="text-xs p-2.5 bg-[#f6f3f2] rounded-lg border border-[#debfc2]/40 focus:outline-none focus:border-[#6d0026]"
                    />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Street Address, Apt / Villa"
                    value={shippingInfo.address}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, address: e.target.value })
                    }
                    className="text-xs p-2.5 bg-[#f6f3f2] rounded-lg border border-[#debfc2]/40 focus:outline-none focus:border-[#6d0026]"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="City"
                      value={shippingInfo.city}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, city: e.target.value })
                      }
                      className="text-xs p-2.5 bg-[#f6f3f2] rounded-lg border border-[#debfc2]/40 focus:outline-none focus:border-[#6d0026]"
                    />
                    <input
                      type="text"
                      placeholder="Pincode / ZIP"
                      value={shippingInfo.pincode}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, pincode: e.target.value })
                      }
                      className="text-xs p-2.5 bg-[#f6f3f2] rounded-lg border border-[#debfc2]/40 focus:outline-none focus:border-[#6d0026]"
                    />
                    <input
                      type="text"
                      placeholder="Country"
                      value={shippingInfo.country}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, country: e.target.value })
                      }
                      className="text-xs p-2.5 bg-[#f6f3f2] rounded-lg border border-[#debfc2]/40 focus:outline-none focus:border-[#6d0026]"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Selector */}
              <div className="p-3 bg-white rounded-xl border border-[#debfc2]/30">
                <span className="text-xs font-semibold text-[#6d0026] uppercase tracking-wider block mb-3">
                  2. Payment Method
                </span>
                <div className="flex flex-col gap-2">
                  <label
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer text-xs ${
                      paymentMethod === 'card'
                        ? 'border-[#6d0026] bg-[#ffd9dd]/30 font-semibold'
                        : 'border-[#debfc2]/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#6d0026]" />
                      <span>Credit / Debit Card (Visa, Mastercard, Amex)</span>
                    </div>
                    <span className="w-3 h-3 rounded-full border border-[#6d0026] flex items-center justify-center">
                      {paymentMethod === 'card' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6d0026]"></span>
                      )}
                    </span>
                  </label>

                  <label
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer text-xs ${
                      paymentMethod === 'upi'
                        ? 'border-[#6d0026] bg-[#ffd9dd]/30 font-semibold'
                        : 'border-[#debfc2]/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#dbb46b]" />
                      <span>UPI / Net Banking / Razorpay</span>
                    </div>
                    <span className="w-3 h-3 rounded-full border border-[#6d0026] flex items-center justify-center">
                      {paymentMethod === 'upi' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6d0026]"></span>
                      )}
                    </span>
                  </label>
                </div>
              </div>

              {/* Security Badge */}
              <div className="flex items-center gap-2 text-[11px] text-[#574144] px-1">
                <ShieldCheck className="w-4 h-4 text-[#6d0026]" />
                <span>256-bit Encrypted Boutique Checkout with Authenticity Guarantee</span>
              </div>
            </form>
          )}

          {checkoutStep === 'success' && (
            <div className="text-center py-10 flex flex-col items-center">
              <div className="mb-3">
                <Logo size="md" />
              </div>
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <CheckCircle className="w-8 h-8" />
              </div>
              <span className="text-xs font-semibold text-[#8a7174] uppercase tracking-widest">
                Congratulations
              </span>
              <h3 className="font-display text-2xl font-bold text-[#6d0026] mt-1 mb-2">
                Order Confirmed!
              </h3>
              <p className="text-xs font-medium text-[#1c1b1b] bg-[#ffd9dd]/50 px-3 py-1 rounded-full mb-4">
                Order ID: {orderId}
              </p>
              <p className="text-xs text-[#574144] max-w-xs leading-relaxed mb-6">
                Thank you for selecting Zevioza. Your artisanal drapes are being prepared in our climate-controlled vault and will be dispatched to {shippingInfo.city}.
              </p>

              <div className="w-full p-4 bg-white rounded-xl border border-[#debfc2]/30 text-left text-xs mb-6 flex flex-col gap-2">
                <div className="flex items-center justify-between text-[#574144]">
                  <span>Delivery Estimate:</span>
                  <span className="font-semibold text-[#1c1b1b]">3-5 Business Days</span>
                </div>
                <div className="flex items-center justify-between text-[#574144]">
                  <span>Packaging:</span>
                  <span className="font-semibold text-[#1c1b1b]">
                    {giftWrap ? 'Signature Velvet Box' : 'Luxury Silk Pouch'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#574144]">
                  <span>Amount Paid:</span>
                  <span className="font-display font-bold text-[#6d0026]">
                    {formatPrice(grandTotal, currency)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleFinishSuccess}
                className="w-full bg-[#6d0026] text-white py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-[#8e1b3b]"
              >
                Return to Boutique
              </button>
            </div>
          )}
        </div>

        {/* Footer with Calculations */}
        {checkoutStep !== 'success' && items.length > 0 && (
          <div className="p-5 border-t border-[#debfc2]/30 bg-white">
            <div className="flex flex-col gap-1.5 text-xs text-[#574144] mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(rawSubtotal, currency)}</span>
              </div>
              {discountApplied && (
                <div className="flex justify-between text-emerald-700">
                  <span>VIP Discount (10%)</span>
                  <span>-{formatPrice(discountAmount, currency)}</span>
                </div>
              )}
              {giftWrap && (
                <div className="flex justify-between text-[#6d0026]">
                  <span>Velvet Box Packaging</span>
                  <span>+{formatPrice(giftWrapCost, currency)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Express Vault Delivery</span>
                <span className="text-emerald-700 font-medium">COMPLIMENTARY</span>
              </div>
              <div className="flex justify-between font-display text-base font-bold text-[#6d0026] pt-2 border-t border-[#f0eded]">
                <span>Total Amount</span>
                <span>{formatPrice(grandTotal, currency)}</span>
              </div>
            </div>

            {checkoutStep === 'cart' ? (
              <button
                id="btn-proceed-checkout"
                onClick={() => setCheckoutStep('checkout')}
                className="w-full bg-[#6d0026] text-white py-3.5 rounded-full font-body text-xs font-semibold tracking-widest uppercase hover:bg-[#8e1b3b] active:scale-98 transition-all flex items-center justify-center gap-2 shadow-md"
              >
                PROCEED TO CHECKOUT
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCheckoutStep('cart')}
                  className="bg-[#f0eded] text-[#574144] px-4 py-3.5 rounded-full text-xs font-semibold uppercase hover:bg-[#e5e2e1]"
                >
                  Back
                </button>
                <button
                  type="submit"
                  form="checkout-form"
                  className="flex-1 bg-[#6d0026] text-white py-3.5 rounded-full font-body text-xs font-semibold tracking-widest uppercase hover:bg-[#8e1b3b] active:scale-98 transition-all shadow-md"
                >
                  CONFIRM & PAY {formatPrice(grandTotal, currency)}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
