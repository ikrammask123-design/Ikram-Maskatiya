import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
  Copy,
  Check,
  Phone,
  MessageCircle,
  AlertCircle,
  Scissors,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { StoreOrder, Currency } from '../types';
import { findOrderForTracking, getLastPlacedOrderId, getStoredOrders } from '../utils/orderStorage';
import { formatPrice } from './ProductCard';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  initialOrderId?: string | null;
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({
  isOpen,
  onClose,
  currency,
  initialOrderId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<StoreOrder | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [recentOrderId, setRecentOrderId] = useState<string | null>(null);

  // Initialize or pre-populate if initialOrderId or recent order is present
  useEffect(() => {
    if (!isOpen) return;

    const lastId = getLastPlacedOrderId();
    setRecentOrderId(lastId);

    const targetId = initialOrderId || lastId;
    if (targetId) {
      setSearchQuery(targetId);
      const found = findOrderForTracking(targetId);
      if (found) {
        setSearchedOrder(found);
        setHasSearched(true);
        return;
      }
    }

    // If nothing pre-filled, check if any order exists to suggest
    const all = getStoredOrders();
    if (all.length > 0 && !targetId) {
      // Pick the first one as initial state if user opens tracking directly
      setSearchedOrder(all[0]);
      setSearchQuery(all[0].id);
      setHasSearched(true);
    }
  }, [isOpen, initialOrderId]);

  if (!isOpen) return null;

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    const found = findOrderForTracking(searchQuery);
    setSearchedOrder(found || null);
    setHasSearched(true);
  };

  const handleCopyTracking = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  // Stepper Calculation
  const getStepProgress = (status: string) => {
    switch (status) {
      case 'new':
        return 1; // Order Placed
      case 'processing':
        return 2; // Tailoring & Quality Check
      case 'shipped':
        return 3; // Dispatched & In-Transit
      case 'delivered':
        return 4; // Delivered
      case 'cancelled':
        return 0;
      default:
        return 1;
    }
  };

  const step = searchedOrder ? getStepProgress(searchedOrder.fulfillmentStatus) : 1;

  const handleWhatsAppInquiry = (order: StoreOrder) => {
    const text = encodeURIComponent(
      `Hello Zevioza Concierge, I want an update regarding my Order #${order.id} for ${order.items.map((i) => i.name).join(', ')}. Tracking: ${order.trackingNumber || 'Pending'}. Please advise estimated arrival.`
    );
    window.open(`https://wa.me/918238023498?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 font-body">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#debfc2]/60 relative flex flex-col">
        {/* Header Strip */}
        <div className="bg-gradient-to-r from-[#6d0026] via-[#8e1b3b] to-[#450017] text-white px-6 py-5 rounded-t-3xl relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ffdea5]/20 text-[#ffdea5] flex items-center justify-center shrink-0 border border-[#ffdea5]/30">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-white">Track Your Order</h3>
              <p className="text-xs text-[#fed9e2]/80 mt-0.5">
                Real-time dispatch, tailoring inspection & courier transit status
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-5 sm:p-6 border-b border-[#debfc2]/30 bg-[#fcf9f8]">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8a7174] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Order ID (e.g. ZV-928410), Mobile or Tracking No."
                className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-[#debfc2]/80 focus:border-[#6d0026] focus:ring-2 focus:ring-[#6d0026]/10 text-sm outline-none text-[#1c1b1b] placeholder:text-[#8a7174]"
              />
            </div>
            <button
              type="submit"
              className="bg-[#6d0026] hover:bg-[#8e1b3b] text-white px-5 sm:px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <span>Track</span>
            </button>
          </form>

          {/* Quick suggestions / Recent order pill */}
          <div className="mt-3 flex items-center gap-2 flex-wrap text-[11px] text-[#574144]">
            <span className="font-medium text-[#8a7174]">Quick Suggestions:</span>
            {recentOrderId && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery(recentOrderId);
                  const found = findOrderForTracking(recentOrderId);
                  setSearchedOrder(found || null);
                  setHasSearched(true);
                }}
                className="bg-[#fed9e2]/60 hover:bg-[#fed9e2] text-[#6d0026] px-2.5 py-1 rounded-full font-semibold border border-[#debfc2] transition-colors"
              >
                ★ Your Recent Order ({recentOrderId})
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setSearchQuery('ZV-928410');
                const found = findOrderForTracking('ZV-928410');
                setSearchedOrder(found || null);
                setHasSearched(true);
              }}
              className="bg-white hover:bg-[#f6f3f2] text-[#574144] px-2 py-0.5 rounded-full border border-[#debfc2]/60 transition-colors"
            >
              ZV-928410
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('ZV-849102');
                const found = findOrderForTracking('ZV-849102');
                setSearchedOrder(found || null);
                setHasSearched(true);
              }}
              className="bg-white hover:bg-[#f6f3f2] text-[#574144] px-2 py-0.5 rounded-full border border-[#debfc2]/60 transition-colors"
            >
              ZV-849102
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6 flex-1 overflow-y-auto space-y-6">
          {searchedOrder ? (
            <div className="space-y-6">
              {/* Order Meta Header Card */}
              <div className="bg-[#fcf9f8] p-4 sm:p-5 rounded-2xl border border-[#debfc2]/40 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-base text-[#1c1b1b]">
                      #{searchedOrder.id}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                        searchedOrder.fulfillmentStatus === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : searchedOrder.fulfillmentStatus === 'shipped'
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : searchedOrder.fulfillmentStatus === 'processing'
                          ? 'bg-purple-100 text-purple-800 border border-purple-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {searchedOrder.fulfillmentStatus === 'delivered'
                        ? '✓ Delivered'
                        : searchedOrder.fulfillmentStatus === 'shipped'
                        ? '✈ In-Transit (Dispatched)'
                        : searchedOrder.fulfillmentStatus === 'processing'
                        ? '✂ Custom Tailoring / Quality Check'
                        : '⏳ Order Confirmed'}
                    </span>
                  </div>
                  <div className="text-xs text-[#8a7174] flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      Placed on{' '}
                      {new Date(searchedOrder.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-[#1c1b1b]">
                      {searchedOrder.paymentStatus === 'paid' ? 'Paid Online' : 'Cash on Delivery'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-[#8a7174]">Order Total</div>
                  <div className="font-display text-lg font-bold text-[#6d0026]">
                    {formatPrice(searchedOrder.total, currency)}
                  </div>
                </div>
              </div>

              {/* Visual Shipment Timeline Stepper */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#debfc2]/40 shadow-xs">
                <h4 className="text-xs font-bold text-[#574144] uppercase tracking-wider mb-5 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#6d0026]" />
                  <span>Shipment & Delivery Timeline</span>
                </h4>

                <div className="relative">
                  {/* Progress Line */}
                  <div className="hidden sm:block absolute top-4 left-6 right-6 h-1 bg-[#f0eded]">
                    <div
                      className="h-full bg-gradient-to-r from-[#6d0026] to-emerald-600 transition-all duration-500 rounded-full"
                      style={{
                        width:
                          step === 1
                            ? '15%'
                            : step === 2
                            ? '45%'
                            : step === 3
                            ? '75%'
                            : step === 4
                            ? '100%'
                            : '0%',
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2">
                    {/* Stage 1 */}
                    <div className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 font-bold text-xs ${
                          step >= 1
                            ? 'bg-[#6d0026] text-white shadow-xs'
                            : 'bg-[#f0eded] text-[#8a7174]'
                        }`}
                      >
                        {step > 1 ? <Check className="w-4 h-4" /> : '1'}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#1c1b1b]">Order Confirmed</div>
                        <div className="text-[10px] text-[#8a7174]">Payment verified</div>
                      </div>
                    </div>

                    {/* Stage 2 */}
                    <div className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 font-bold text-xs ${
                          step >= 2
                            ? 'bg-[#6d0026] text-white shadow-xs'
                            : 'bg-[#f0eded] text-[#8a7174]'
                        }`}
                      >
                        {step > 2 ? <Check className="w-4 h-4" /> : '2'}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#1c1b1b]">Atelier Tailoring</div>
                        <div className="text-[10px] text-[#8a7174]">Silk mark & quality checked</div>
                      </div>
                    </div>

                    {/* Stage 3 */}
                    <div className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 font-bold text-xs ${
                          step >= 3
                            ? 'bg-[#6d0026] text-white shadow-xs'
                            : 'bg-[#f0eded] text-[#8a7174]'
                        }`}
                      >
                        {step > 3 ? <Check className="w-4 h-4" /> : '3'}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#1c1b1b]">Dispatched (Transit)</div>
                        <div className="text-[10px] text-[#8a7174]">Handed to courier</div>
                      </div>
                    </div>

                    {/* Stage 4 */}
                    <div className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 font-bold text-xs ${
                          step >= 4
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-[#f0eded] text-[#8a7174]'
                        }`}
                      >
                        {step === 4 ? <Check className="w-4 h-4" /> : '4'}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#1c1b1b]">Delivered</div>
                        <div className="text-[10px] text-[#8a7174]">Received at doorstep</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Courier Partner & AWB Card */}
                {searchedOrder.courierPartner && (
                  <div className="mt-6 bg-[#fcf9f8] p-4 rounded-xl border border-[#debfc2]/50 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#fed9e2] text-[#6d0026] flex items-center justify-center shrink-0">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-[#8a7174] tracking-wider">
                          Logistics Partner
                        </div>
                        <div className="text-xs font-bold text-[#1c1b1b]">
                          {searchedOrder.courierPartner}
                        </div>
                      </div>
                    </div>

                    {searchedOrder.trackingNumber ? (
                      <div className="flex items-center gap-2">
                        <div className="bg-white px-3 py-1.5 rounded-lg border border-[#debfc2]/60 text-xs font-mono font-bold text-[#1c1b1b]">
                          AWB: {searchedOrder.trackingNumber}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyTracking(searchedOrder.trackingNumber || '')}
                          className="p-2 bg-white hover:bg-[#fed9e2]/30 text-[#6d0026] border border-[#debfc2] rounded-lg transition-colors"
                          title="Copy AWB Number"
                        >
                          {copiedTracking ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-[#8a7174] italic">
                        AWB will be assigned upon dispatch
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Delivery Address & Customer Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-[#debfc2]/40">
                  <div className="text-xs font-bold text-[#574144] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#6d0026]" />
                    <span>Shipping Destination</span>
                  </div>
                  <div className="text-xs text-[#1c1b1b] font-medium leading-relaxed">
                    <p className="font-bold">{searchedOrder.customer.name}</p>
                    <p className="text-[#574144] mt-0.5">{searchedOrder.customer.address}</p>
                    <p className="text-[#574144]">
                      {searchedOrder.customer.city}, {searchedOrder.customer.state} -{' '}
                      {searchedOrder.customer.pincode}
                    </p>
                    <p className="text-[#8a7174] mt-1 text-[11px]">
                      Contact: {searchedOrder.customer.phone}
                    </p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#debfc2]/40">
                  <div className="text-xs font-bold text-[#574144] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#6d0026]" />
                    <span>Payment Verification</span>
                  </div>
                  <div className="text-xs text-[#1c1b1b] space-y-1.5 leading-relaxed">
                    <div className="flex justify-between">
                      <span className="text-[#8a7174]">Mode:</span>
                      <span className="font-semibold uppercase">
                        {searchedOrder.paymentMethod === 'upi'
                          ? 'Instant UPI'
                          : searchedOrder.paymentMethod === 'razorpay'
                          ? 'Card / Netbanking'
                          : 'Cash on Delivery (COD)'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8a7174]">Status:</span>
                      <span
                        className={`font-bold ${
                          searchedOrder.paymentStatus === 'paid'
                            ? 'text-emerald-700'
                            : 'text-amber-700'
                        }`}
                      >
                        {searchedOrder.paymentStatus === 'paid'
                          ? '✓ Fully Paid'
                          : 'Collect Cash at Delivery'}
                      </span>
                    </div>
                    {searchedOrder.transactionId && (
                      <div className="flex justify-between text-[11px]">
                        <span className="text-[#8a7174]">Ref ID:</span>
                        <span className="font-mono text-[#574144]">
                          {searchedOrder.transactionId}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Ordered Items List */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#debfc2]/40">
                <h4 className="text-xs font-bold text-[#574144] uppercase tracking-wider mb-3">
                  Items in this Package ({searchedOrder.items.length})
                </h4>
                <div className="divide-y divide-[#debfc2]/30">
                  {searchedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-16 object-cover rounded-xl bg-[#f6f3f2] shrink-0 border border-[#debfc2]/30"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-bold text-[#1c1b1b] truncate">{item.name}</h5>
                        <div className="text-[11px] text-[#8a7174] flex items-center gap-2 flex-wrap mt-0.5">
                          {item.selectedColor && <span>Shade: {item.selectedColor}</span>}
                          {item.selectedSize && <span>• Size: {item.selectedSize}</span>}
                          <span>• Qty: {item.quantity}</span>
                          {item.customStitching && (
                            <span className="text-[#6d0026] font-semibold flex items-center gap-0.5">
                              <Scissors className="w-3 h-3" /> Custom Stitched
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="font-display font-bold text-xs text-[#6d0026] shrink-0">
                        {formatPrice(item.price * item.quantity, currency)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* WhatsApp Support Action */}
              <div className="bg-[#e8f5e9] p-4 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-emerald-950">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold">Need Help with Delivery?</p>
                    <p className="text-emerald-800 text-[11px]">
                      Our concierge is available on WhatsApp to assist with shipment queries.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleWhatsAppInquiry(searchedOrder)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Inquire</span>
                </button>
              </div>
            </div>
          ) : hasSearched ? (
            <div className="text-center py-10">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3 border border-rose-200">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h4 className="font-display font-bold text-base text-[#1c1b1b]">
                No Shipment Found for "{searchQuery}"
              </h4>
              <p className="text-xs text-[#574144] mt-1 max-w-sm mx-auto leading-relaxed">
                Please verify your Order ID (starts with <strong>ZV-</strong>) or the 10-digit mobile number used during checkout.
              </p>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => {
                    const text = encodeURIComponent(
                      `Hello Zevioza Support, I am unable to track my order for query '${searchQuery}'. Please help me locate my booking.`
                    );
                    window.open(`https://wa.me/918238023498?text=${text}`, '_blank');
                  }}
                  className="inline-flex items-center gap-1.5 bg-[#6d0026] text-white text-xs font-semibold px-4 py-2 rounded-xl"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Contact Support on WhatsApp</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-[#8a7174]">
              <Package className="w-10 h-10 mx-auto text-[#debfc2] mb-2" />
              <p className="text-xs">Enter your Order ID above to view live shipment progress.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#debfc2]/30 bg-[#fcf9f8] flex items-center justify-between text-xs text-[#8a7174]">
          <span>Official Logistics Partners: BlueDart • Delhivery • DTDC</span>
          <button
            type="button"
            onClick={onClose}
            className="font-bold text-[#6d0026] hover:underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
