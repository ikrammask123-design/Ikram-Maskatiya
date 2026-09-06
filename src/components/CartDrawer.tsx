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
  QrCode,
  Banknote,
  Copy,
  Check,
  MessageCircle,
  ExternalLink,
  Lock,
  AlertCircle,
} from 'lucide-react';
import { CartItem, Currency, StoreOrder, PaymentStatus } from '../types';
import { formatPrice } from './ProductCard';
import { CURRENCY_RATES } from '../data/products';
import { Logo } from './Logo';
import { saveOrderToStoreAsync, formatWhatsAppPhone } from '../utils/orderStorage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: Currency;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onSelectProduct: (product: any) => void;
  onOpenTrackOrder?: (orderId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenTrackOrder,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [giftWrap, setGiftWrap] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');

  // Checkout Form State: initialized empty or from customer's previous checkout
  const [shippingInfo, setShippingInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('zevioza_customer_shipping');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.name) return parsed;
      }
    } catch {}
    return {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: 'Gujarat',
      pincode: '',
      country: 'India',
    };
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'razorpay'>('cod');
  const [upiUtr, setUpiUtr] = useState('');
  const [checkoutError, setCheckoutError] = useState('');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('gpay');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
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

  const handleCopyUpi = () => {
    navigator.clipboard.writeText('ikrammask2709@sbi');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError('');

    // Strict validation: Delivery address fields cannot be blank
    if (!shippingInfo.name.trim()) {
      setCheckoutError('Please enter recipient full name');
      return;
    }
    const cleanPhone = shippingInfo.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setCheckoutError('Please enter a valid 10-digit mobile number for dispatch updates');
      return;
    }
    if (!shippingInfo.address.trim()) {
      setCheckoutError('Please enter complete delivery street address');
      return;
    }
    if (!shippingInfo.city.trim()) {
      setCheckoutError('Please enter city name');
      return;
    }
    if (!shippingInfo.pincode.trim() || shippingInfo.pincode.length < 5) {
      setCheckoutError('Please enter a valid delivery postal pincode');
      return;
    }

    // Save shipping info for future checkout convenience
    try {
      localStorage.setItem('zevioza_customer_shipping', JSON.stringify(shippingInfo));
    } catch {}

    setIsProcessingPayment(true);
    const newId = `ZV-${Math.floor(100000 + Math.random() * 900000)}`;

    const recordOrder = async (
      id: string,
      status: PaymentStatus,
      txn?: string,
      customAdminNotes?: string
    ) => {
      const storeOrder: StoreOrder = {
        id,
        createdAt: new Date().toISOString(),
        customer: { ...shippingInfo },
        items: items.map((item) => ({
          id: item.id,
          productId: item.productId,
          name: item.product.name,
          image: item.selectedImage || item.product.image,
          price: item.product.price + (item.customStitching ? 2500 : 0),
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
          customStitching: item.customStitching,
          notes: item.notes,
        })),
        subtotal: rawSubtotal,
        discountAmount,
        giftWrapAmount: giftWrapCost,
        total: grandTotal,
        currency,
        paymentMethod,
        paymentStatus: status, // STRICT: Only 'paid' when verified by gateway or money is physically collected
        fulfillmentStatus: 'new',
        transactionId: txn,
        adminNotes:
          customAdminNotes ||
          (paymentMethod === 'cod'
            ? `COD Order: Collect ₹${grandTotal} cash upon delivery.`
            : paymentMethod === 'upi'
            ? upiUtr.trim()
              ? `UPI Order (Customer UTR: ${upiUtr.trim()}). Verify ₹${grandTotal} in bank before dispatch.`
              : `UPI Order placed. Verification required before dispatch.`
            : 'Online Order via Gateway.'),
        isDemo: false,
      };
      await saveOrderToStoreAsync(storeOrder);
    };

    if (paymentMethod === 'cod') {
      // CASH ON DELIVERY: Payment is strictly PENDING until delivered and cash is collected
      setOrderId(newId);
      await recordOrder(
        newId,
        'pending',
        undefined,
        `COD Order: Collect ₹${grandTotal} cash on delivery from customer.`
      );
      setIsProcessingPayment(false);
      setCheckoutStep('success');
    } else if (paymentMethod === 'upi') {
      // DIRECT UPI / QR: Customer pays to UPI ID. Payment is strictly PENDING verification
      setOrderId(newId);
      const cleanUtr = upiUtr.trim();
      await recordOrder(
        newId,
        'pending',
        cleanUtr ? `UTR: ${cleanUtr}` : undefined,
        cleanUtr
          ? `UPI Payment submitted. Customer UTR: ${cleanUtr}. Check SBI YONO / Bank SMS for ₹${grandTotal} before shipping.`
          : `UPI Payment selected (no UTR provided). Payment verification required before dispatch.`
      );
      setIsProcessingPayment(false);
      setCheckoutStep('success');
    } else if (paymentMethod === 'razorpay') {
      // RAZORPAY GATEWAY: Only mark paid if real payment ID is returned
      if (typeof (window as any).Razorpay !== 'undefined') {
        const options = {
          key: 'rzp_test_placeholder',
          amount: grandTotal * 100,
          currency: currency === 'INR' ? 'INR' : currency,
          name: 'Zevioza Boutique',
          description: `Boutique Order - ${newId}`,
          image: '/logo.svg',
          handler: async function (response: any) {
            if (response?.razorpay_payment_id) {
              setOrderId(newId);
              await recordOrder(
                newId,
                'paid',
                response.razorpay_payment_id,
                `Verified Online Payment via Razorpay ID: ${response.razorpay_payment_id}`
              );
              setIsProcessingPayment(false);
              setCheckoutStep('success');
            } else {
              setIsProcessingPayment(false);
              setCheckoutError('Payment was not verified by gateway. Please choose UPI or Cash on Delivery.');
            }
          },
          prefill: {
            name: shippingInfo.name,
            email: shippingInfo.email,
            contact: shippingInfo.phone,
          },
          theme: {
            color: '#6d0026',
          },
          modal: {
            ondismiss: function () {
              setIsProcessingPayment(false);
              setCheckoutError('Payment cancelled. You can complete your order using Cash on Delivery (COD) or Instant UPI.');
            },
          },
        };

        try {
          const rzp = new (window as any).Razorpay(options);
          rzp.on('payment.failed', function (err: any) {
            setIsProcessingPayment(false);
            setCheckoutError(
              `Payment failed: ${err?.error?.description || 'Gateway transaction declined'}. Please try Cash on Delivery or UPI.`
            );
          });
          rzp.open();
        } catch {
          setIsProcessingPayment(false);
          setCheckoutError('Online gateway is not active for live transactions. Please choose Cash on Delivery (COD) or Instant UPI.');
        }
      } else {
        setIsProcessingPayment(false);
        setCheckoutError('Payment gateway unavailable. Please choose Cash on Delivery (COD) or Instant UPI.');
      }
    }
  };

  const handleWhatsAppOrder = () => {
    const itemsList = items
      .map(
        (i) =>
          `• ${i.product.name} (Qty: ${i.quantity}${
            i.selectedColor ? `, Shade: ${i.selectedColor}` : ''
          }${i.selectedSize ? `, Size: ${i.selectedSize}` : ''}${
            i.customStitching ? ', +Custom Stitching' : ''
          }) - ₹${
            (i.product.price + (i.customStitching ? 2500 : 0)) * i.quantity
          }`
      )
      .join('\n');

    const trackingNotice = orderId ? `*Order ID:* ${orderId}\n` : '';

    const paymentStatusNotice =
      paymentMethod === 'cod'
        ? `*Payment Status:* ⏳ Cash to be collected at doorstep (₹${grandTotal})\n`
        : paymentMethod === 'upi'
        ? `*Payment Status:* 🔍 UPI Verification Required${upiUtr.trim() ? ` (UTR: ${upiUtr.trim()})` : ''}\n`
        : '*Payment Status:* ✅ Paid Online via Gateway\n';

    const message = encodeURIComponent(
      `🛍️ *New Order Confirmation - Zevioza Boutique*\n\n` +
        trackingNotice +
        `*Customer Name:* ${shippingInfo.name}\n` +
        `*Phone:* ${shippingInfo.phone}\n` +
        `*Email:* ${shippingInfo.email}\n` +
        `*Delivery Address:* ${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.pincode}, ${shippingInfo.country}\n\n` +
        `*Order Items:*\n${itemsList}\n\n` +
        `*Subtotal:* ₹${rawSubtotal}\n` +
        (discountApplied ? `*Discount (10%):* -₹${discountAmount}\n` : '') +
        (giftWrap ? `*Gift Packaging:* +₹500\n` : '') +
        `*Total Amount:* ₹${grandTotal}\n` +
        `*Payment Choice:* ${
          paymentMethod === 'razorpay'
            ? 'Razorpay (Cards / Netbanking)'
            : paymentMethod === 'upi'
            ? `UPI (${selectedUpiApp.toUpperCase()})`
            : 'Cash on Delivery (COD)'
        }\n` +
        paymentStatusNotice +
        `\nPlease confirm order acceptance and dispatch schedule!`
    );

    window.open(`https://wa.me/918238023498?text=${message}`, '_blank');
  };

  const handleSendToCustomerWhatsApp = () => {
    const raw = shippingInfo.phone.trim();
    const cleanPhone = formatWhatsAppPhone(raw);
    if (!cleanPhone || cleanPhone.length < 10) {
      handleWhatsAppOrder();
      return;
    }

    const itemsList = items
      .map(
        (i) =>
          `• ${i.product.name} (Qty: ${i.quantity}${
            i.selectedColor ? `, Shade: ${i.selectedColor}` : ''
          }${i.selectedSize ? `, Size: ${i.selectedSize}` : ''}) - ₹${
            (i.product.price + (i.customStitching ? 2500 : 0)) * i.quantity
          }`
      )
      .join('\n');

    const paymentText =
      paymentMethod === 'cod'
        ? `Cash on Delivery (₹${grandTotal} to collect on delivery)`
        : paymentMethod === 'upi'
        ? 'Direct UPI'
        : 'Prepaid Online';

    const msg = encodeURIComponent(
      `Namaste ${shippingInfo.name} ji,\n\n` +
        `Aapka Zevioza Boutique Order *#${orderId}* successfully place ho gaya hai! 🎉\n\n` +
        `• *Total Amount:* ₹${grandTotal}\n` +
        `• *Payment Mode:* ${paymentText}\n` +
        `• *Payment Status:* ${paymentMethod === 'cod' ? 'PENDING ⏳ (Pay at delivery)' : 'PENDING VERIFICATION / PREPAID'}\n` +
        `• *Delivery Address:* ${shippingInfo.address}, ${shippingInfo.city} - ${shippingInfo.pincode}\n\n` +
        `*Items Ordered:*\n${itemsList}\n\n` +
        `Track your order anytime at: ${window.location.origin}\n\n` +
        `Thank you for shopping with Zevioza Boutique!`
    );

    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  const handleFinishSuccess = () => {
    onClearCart();
    setCheckoutStep('cart');
    onClose();
  };

  const upiDeepLink = `upi://pay?pa=ikrammask2709@sbi&pn=Ikram%20Maskatiya&am=${grandTotal}&cu=INR&tn=Zevioza%20Boutique%20Order`;
  const upiQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=1&data=${encodeURIComponent(
    upiDeepLink
  )}`;

  return (
    <div
      id="cart-drawer-overlay"
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end"
    >
      <div className="w-full max-w-md bg-[#fcf9f8] h-full shadow-2xl flex flex-col justify-between animate-slideLeft">
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
                        src={item.selectedImage || item.product.image}
                        alt={`${item.product.name}${item.selectedColor ? ` - ${item.selectedColor}` : ''}`}
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
                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            {item.selectedColor && (
                              <span className="text-[10px] font-semibold text-[#6d0026] bg-[#ffd9dd]/60 px-2 py-0.5 rounded-full">
                                Shade: {item.selectedColor}
                              </span>
                            )}
                            {item.selectedSize && (
                              <span className="text-[10px] font-semibold text-[#574144] bg-[#f0eded] px-2 py-0.5 rounded-full">
                                Size: {item.selectedSize}
                              </span>
                            )}
                          </div>
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
              {/* Checkout Alert / Error Notification */}
              {checkoutError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                  <span className="leading-snug">{checkoutError}</span>
                </div>
              )}

              {/* Step 1: Shipping Address */}
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
                      placeholder="Phone Number (for SMS & Tracking)"
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
                    placeholder="Street Address, House / Flat No, Landmark"
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
                      placeholder="Pincode"
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

              {/* Step 2: Payment Method Selection */}
              <div className="p-3 bg-white rounded-xl border border-[#debfc2]/30">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-[#6d0026] uppercase tracking-wider block">
                    2. Select Payment Method
                  </span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> 100% Secure
                  </span>
                </div>

                <div className="flex flex-col gap-2.5">
                  {/* Option 1: Razorpay Gateway */}
                  <label
                    onClick={() => setPaymentMethod('razorpay')}
                    className={`p-3 rounded-xl border transition-all cursor-pointer text-xs ${
                      paymentMethod === 'razorpay'
                        ? 'border-[#6d0026] bg-[#fed9e2]/25 shadow-xs'
                        : 'border-[#debfc2]/40 hover:bg-[#f6f3f2]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#3395ff]/15 flex items-center justify-center text-[#0761e2] font-bold text-xs">
                          <CreditCard className="w-4 h-4 text-[#0761e2]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-[#1c1b1b]">
                              Razorpay (Cards, NetBanking, EMI)
                            </span>
                            <span className="text-[9px] bg-[#3395ff]/20 text-[#0761e2] font-bold px-1.5 py-0.2 rounded">
                              OFFICIAL
                            </span>
                          </div>
                          <p className="text-[10px] text-[#574144] mt-0.5">
                            Visa, Mastercard, RuPay, Amex & All Indian Banks
                          </p>
                        </div>
                      </div>
                      <span className="w-4 h-4 rounded-full border border-[#6d0026] flex items-center justify-center shrink-0">
                        {paymentMethod === 'razorpay' && (
                          <span className="w-2 h-2 rounded-full bg-[#6d0026]"></span>
                        )}
                      </span>
                    </div>
                  </label>

                  {/* Option 2: Instant UPI */}
                  <label
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border transition-all cursor-pointer text-xs ${
                      paymentMethod === 'upi'
                        ? 'border-[#6d0026] bg-[#fed9e2]/25 shadow-xs'
                        : 'border-[#debfc2]/40 hover:bg-[#f6f3f2]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#4b9e4b]/15 flex items-center justify-center text-[#237023] font-bold text-xs">
                          <QrCode className="w-4 h-4 text-[#237023]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-[#1c1b1b]">
                              Instant UPI / QR Code
                            </span>
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                              0% FEE
                            </span>
                          </div>
                          <p className="text-[10px] text-[#574144] mt-0.5">
                            Google Pay, PhonePe, Paytm, CRED & BHIM
                          </p>
                        </div>
                      </div>
                      <span className="w-4 h-4 rounded-full border border-[#6d0026] flex items-center justify-center shrink-0">
                        {paymentMethod === 'upi' && (
                          <span className="w-2 h-2 rounded-full bg-[#6d0026]"></span>
                        )}
                      </span>
                    </div>

                    {/* UPI Sub-Options when active */}
                    {paymentMethod === 'upi' && (
                      <div className="mt-3 pt-3 border-t border-[#debfc2]/30 flex flex-col items-center">
                        <div className="w-full grid grid-cols-4 gap-1.5 mb-3">
                          {[
                            { id: 'gpay', label: 'Google Pay' },
                            { id: 'phonepe', label: 'PhonePe' },
                            { id: 'paytm', label: 'Paytm' },
                            { id: 'qr', label: 'Show QR' },
                          ].map((app) => (
                            <button
                              key={app.id}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedUpiApp(app.id as any);
                              }}
                              className={`py-1.5 px-1 rounded-lg text-[10px] font-semibold text-center transition-all ${
                                selectedUpiApp === app.id
                                  ? 'bg-[#6d0026] text-white'
                                  : 'bg-[#f6f3f2] text-[#574144] hover:bg-[#e8e4e3]'
                              }`}
                            >
                              {app.label}
                            </button>
                          ))}
                        </div>

                        {/* QR Code Container */}
                        <div className="p-3 bg-white rounded-xl border border-[#debfc2]/40 flex flex-col items-center text-center shadow-xs">
                          <img
                            src={upiQrCodeUrl}
                            alt="Zevioza Boutique UPI QR"
                            className="w-32 h-32 rounded-lg mb-2"
                          />
                          <span className="text-[11px] font-bold text-[#6d0026]">
                            Scan to Pay {formatPrice(grandTotal, currency)}
                          </span>
                          <span className="text-[9px] text-[#8a7174] mt-0.5">
                            UPI ID: <span className="font-mono font-semibold text-[#1c1b1b]">ikrammask2709@sbi</span>
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyUpi();
                            }}
                            className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-[#6d0026] hover:bg-[#fed9e2]/40 px-2.5 py-1 rounded-full border border-[#debfc2]/60"
                          >
                            {copiedUpi ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-700">UPI ID Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy UPI ID</span>
                              </>
                            )}
                          </button>

                          {/* Customer UTR / Transaction Input */}
                          <div className="w-full mt-3 pt-2.5 border-t border-[#debfc2]/40 text-left">
                            <label className="text-[10px] font-bold text-[#6d0026] block mb-1">
                              UPI UTR / Ref Number (Enter after making payment):
                            </label>
                            <input
                              type="text"
                              maxLength={24}
                              placeholder="e.g. 428190382910 (12 digits)"
                              value={upiUtr}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => setUpiUtr(e.target.value)}
                              className="w-full text-xs p-2 bg-[#f6f3f2] rounded-lg border border-[#debfc2]/70 focus:outline-none focus:border-[#6d0026] font-mono"
                            />
                            <p className="text-[9px] text-[#8a7174] mt-1 leading-snug">
                              * Store admin will verify payment in bank account using this UTR before packing your order.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </label>

                  {/* Option 3: Cash on Delivery (COD) */}
                  <label
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-xl border transition-all cursor-pointer text-xs ${
                      paymentMethod === 'cod'
                        ? 'border-[#6d0026] bg-[#fed9e2]/25 shadow-xs'
                        : 'border-[#debfc2]/40 hover:bg-[#f6f3f2]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#b45309]/15 flex items-center justify-center text-[#b45309] font-bold text-xs">
                          <Banknote className="w-4 h-4 text-[#b45309]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-[#1c1b1b]">
                              Cash on Delivery (COD)
                            </span>
                            <span className="text-[9px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded">
                              PAY AT DOORSTEP
                            </span>
                          </div>
                          <p className="text-[10px] text-[#574144] mt-0.5">
                            Pay via Cash or UPI upon package inspection
                          </p>
                        </div>
                      </div>
                      <span className="w-4 h-4 rounded-full border border-[#6d0026] flex items-center justify-center shrink-0">
                        {paymentMethod === 'cod' && (
                          <span className="w-2 h-2 rounded-full bg-[#6d0026]"></span>
                        )}
                      </span>
                    </div>

                    {paymentMethod === 'cod' && (
                      <div className="mt-2.5 p-2 bg-amber-50/80 rounded-lg border border-amber-200 text-[10px] text-amber-900 leading-relaxed">
                        ✓ No advance payment required. Delivery executive will verify your contact number before arrival.
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* WhatsApp Fast-Track Checkout Button */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-700" />
                  <div>
                    <span className="text-xs font-semibold text-emerald-950 block">
                      Prefer WhatsApp Assistance?
                    </span>
                    <span className="text-[10px] text-emerald-800">
                      Send your cart directly to our boutique stylists
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-semibold px-3 py-1.5 rounded-full shadow-xs flex items-center gap-1"
                >
                  <span>Order via WhatsApp</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              {/* Security Guarantee Badge */}
              <div className="flex items-center gap-2 text-[11px] text-[#574144] px-1">
                <ShieldCheck className="w-4 h-4 text-[#6d0026]" />
                <span>256-bit Bank-Grade Encryption with Zevioza Authenticity Guarantee</span>
              </div>
            </form>
          )}

          {checkoutStep === 'success' && (
            <div className="text-center py-8 flex flex-col items-center">
              <div className="mb-3">
                <Logo size="md" />
              </div>
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 shadow-xs">
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
              <p className="text-xs text-[#574144] max-w-xs leading-relaxed mb-5">
                Thank you for choosing Zevioza. Your handcrafted pieces are being prepared and will be dispatched to {shippingInfo.city}.
              </p>

              {/* Order Receipt Card */}
              <div className="w-full p-4 bg-white rounded-xl border border-[#debfc2]/30 text-left text-xs mb-5 flex flex-col gap-2 shadow-xs">
                <div className="flex items-center justify-between text-[#574144]">
                  <span>Payment Mode:</span>
                  <span className="font-semibold text-[#1c1b1b]">
                    {paymentMethod === 'razorpay'
                      ? 'Razorpay (Online Payment)'
                      : paymentMethod === 'upi'
                      ? `Instant UPI (${selectedUpiApp.toUpperCase()})`
                      : 'Cash on Delivery (COD)'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#574144]">
                  <span>Payment Status:</span>
                  {paymentMethod === 'cod' ? (
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                      PENDING • Pay {formatPrice(grandTotal, currency)} at Doorstep
                    </span>
                  ) : paymentMethod === 'upi' ? (
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded">
                      PENDING • Store Verification Required
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                      PAID • Verified by Gateway
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-[#574144]">
                  <span>Delivery Address:</span>
                  <span className="font-semibold text-[#1c1b1b] text-right truncate max-w-[180px]">
                    {shippingInfo.address}, {shippingInfo.city}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#574144]">
                  <span>Estimated Delivery:</span>
                  <span className="font-semibold text-[#1c1b1b]">3-5 Business Days</span>
                </div>
                <div className="flex items-center justify-between text-[#574144]">
                  <span>Packaging:</span>
                  <span className="font-semibold text-[#1c1b1b]">
                    {giftWrap ? 'Signature Rose Velvet Box' : 'Luxury Silk Pouch'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#574144] pt-2 border-t border-[#f0eded]">
                  <span>Total Amount:</span>
                  <span className="font-display font-bold text-base text-[#6d0026]">
                    {formatPrice(grandTotal, currency)}
                  </span>
                </div>
              </div>

              {/* Live Tracking Action */}
              {onOpenTrackOrder && orderId && (
                <button
                  type="button"
                  onClick={() => {
                    const currentId = orderId;
                    handleFinishSuccess();
                    onOpenTrackOrder(currentId);
                  }}
                  className="w-full mb-2 bg-[#6d0026] hover:bg-[#8e1b3b] text-white py-3 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Truck className="w-4 h-4" />
                  <span>Track This Order Live</span>
                </button>
              )}

              {/* WhatsApp Receipt to Customer */}
              {shippingInfo.phone && (
                <button
                  type="button"
                  onClick={handleSendToCustomerWhatsApp}
                  className="w-full mb-2.5 bg-emerald-700 hover:bg-emerald-800 text-white py-3 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Receipt to Customer WhatsApp ({shippingInfo.phone})</span>
                </button>
              )}

              {/* Chat with Boutique Support */}
              <button
                type="button"
                onClick={handleWhatsAppOrder}
                className="w-full mb-3 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Contact Boutique Helpdesk (82380 23498)</span>
              </button>

              <button
                onClick={handleFinishSuccess}
                className="w-full bg-[#f0eded] hover:bg-[#e5e2e1] text-[#574144] py-3 rounded-full text-xs font-semibold uppercase tracking-widest transition-all"
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
                  disabled={isProcessingPayment}
                  className="flex-1 bg-[#6d0026] text-white py-3.5 rounded-full font-body text-xs font-semibold tracking-widest uppercase hover:bg-[#8e1b3b] active:scale-98 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isProcessingPayment ? (
                    <span>Processing Payment...</span>
                  ) : paymentMethod === 'cod' ? (
                    <span>CONFIRM CASH ON DELIVERY ({formatPrice(grandTotal, currency)})</span>
                  ) : paymentMethod === 'upi' ? (
                    <span>SUBMIT UPI ORDER ({formatPrice(grandTotal, currency)})</span>
                  ) : (
                    <span>PAY VIA RAZORPAY ({formatPrice(grandTotal, currency)})</span>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

