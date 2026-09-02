import React, { useState, useEffect } from 'react';
import {
  User,
  Heart,
  Package,
  Sparkles,
  Calendar,
  Shield,
  ShieldCheck,
  Scissors,
  ShoppingBag,
  Trash2,
  Clock,
  ChevronRight,
  CheckCircle,
  Truck,
} from 'lucide-react';
import { Product, Currency, StoreOrder } from '../types';
import { formatPrice } from './ProductCard';
import { getStoredOrders } from '../utils/orderStorage';

interface AccountViewProps {
  wishlistedProducts: Product[];
  currency: Currency;
  onRemoveWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onOpenStylistModal: () => void;
  onOpenTrackOrder?: (orderId?: string) => void;
}

export const AccountView: React.FC<AccountViewProps> = ({
  wishlistedProducts,
  currency,
  onRemoveWishlist,
  onAddToCart,
  onSelectProduct,
  onOpenStylistModal,
  onOpenTrackOrder,
}) => {
  const [activeTab, setActiveTab] = useState<'wishlist' | 'orders' | 'profile' | 'styling'>('wishlist');
  const [ordersList, setOrdersList] = useState<StoreOrder[]>([]);

  useEffect(() => {
    const loaded = getStoredOrders();
    setOrdersList(loaded);

    const handleUpdate = () => {
      setOrdersList(getStoredOrders());
    };
    window.addEventListener('zevioza_order_updated', handleUpdate);
    return () => window.removeEventListener('zevioza_order_updated', handleUpdate);
  }, []);

  return (
    <div id="account-view-page" className="py-8 md:py-12 px-5 md:px-16 max-w-4xl mx-auto">
      {/* Profile Header Banner */}
      <div className="bg-gradient-to-r from-[#ffd9dd]/60 via-[#fed9e2]/40 to-[#fcf9f8] p-6 sm:p-8 rounded-2xl border border-[#debfc2]/40 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#6d0026] text-white flex items-center justify-center font-display text-2xl font-bold shadow-md">
            AS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1c1b1b]">
                Ananya Sharma
              </h2>
              <span className="bg-[#453000] text-[#ffdea5] text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full uppercase">
                Gold Tier Member
              </span>
            </div>
            <p className="text-xs text-[#574144] mt-0.5">
              Client ID: ZEV-MUM-4820 • 2,450 Artisanal Privilege Points
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenTrackOrder && (
            <button
              onClick={() => onOpenTrackOrder()}
              className="bg-white hover:bg-[#fed9e2]/60 text-[#6d0026] border border-[#debfc2] px-4 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
              title="Track Package Status"
            >
              <Truck className="w-3.5 h-3.5" />
              Track Shipment
            </button>
          )}

          <button
            onClick={onOpenStylistModal}
            className="bg-[#6d0026] text-white px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase hover:bg-[#8e1b3b] shadow-xs flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Book Stylist
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-[#debfc2]/40 gap-6 sm:gap-8 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('wishlist')}
          className={`pb-3 font-body text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'wishlist'
              ? 'text-[#6d0026] border-b-2 border-[#6d0026]'
              : 'text-[#574144] hover:text-[#6d0026]'
          }`}
        >
          <Heart className="w-4 h-4" />
          Saved Wishlist ({wishlistedProducts.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 font-body text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'orders'
              ? 'text-[#6d0026] border-b-2 border-[#6d0026]'
              : 'text-[#574144] hover:text-[#6d0026]'
          }`}
        >
          <Package className="w-4 h-4" />
          Order History ({ordersList.length})
        </button>

        <button
          onClick={() => setActiveTab('styling')}
          className={`pb-3 font-body text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'styling'
              ? 'text-[#6d0026] border-b-2 border-[#6d0026]'
              : 'text-[#574144] hover:text-[#6d0026]'
          }`}
        >
          <Scissors className="w-4 h-4" />
          Bespoke Atelier
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 font-body text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'profile'
              ? 'text-[#6d0026] border-b-2 border-[#6d0026]'
              : 'text-[#574144] hover:text-[#6d0026]'
          }`}
        >
          <User className="w-4 h-4" />
          Measurements & Addresses
        </button>
      </div>

      {/* Tab: Wishlist */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlistedProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#debfc2]/30 p-8">
              <Heart className="w-10 h-10 text-[#debfc2] mx-auto mb-3" />
              <h3 className="font-display text-lg font-semibold text-[#1c1b1b] mb-1">
                Your Wishlist is Empty
              </h3>
              <p className="text-xs text-[#574144] max-w-sm mx-auto mb-6">
                Tap the heart icon on any silk saree or kurti to save it here for future consideration.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {wishlistedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white p-4 rounded-xl border border-[#debfc2]/30 flex gap-4 shadow-xs items-center"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-26 object-cover rounded-lg bg-[#f6f3f2] cursor-pointer shrink-0"
                    onClick={() => onSelectProduct(product)}
                  />
                  <div className="flex-1">
                    <span className="text-[10px] font-semibold text-[#891738] uppercase tracking-wider block">
                      {product.categoryLabel}
                    </span>
                    <h4
                      className="font-display text-sm font-semibold text-[#1c1b1b] hover:text-[#6d0026] cursor-pointer line-clamp-1"
                      onClick={() => onSelectProduct(product)}
                    >
                      {product.name}
                    </h4>
                    <span className="font-display text-sm font-bold text-[#6d0026] block mt-1">
                      {formatPrice(product.price, currency)}
                    </span>

                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => onAddToCart(product)}
                        className="bg-[#6d0026] text-white px-3 py-1.5 rounded-full text-xs font-semibold uppercase hover:bg-[#8e1b3b] flex items-center gap-1"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        Add to Bag
                      </button>
                      <button
                        onClick={() => onRemoveWishlist(product)}
                        className="text-[#8a7174] hover:text-[#ba1a1a] p-1.5 rounded-full"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Orders */}
      {activeTab === 'orders' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#debfc2]/40">
            <div>
              <h4 className="text-xs font-bold text-[#1c1b1b] uppercase tracking-wider">
                Live Order Book & Package Tracking
              </h4>
              <p className="text-[11px] text-[#8a7174]">
                Instant real-time status with BlueDart, Delhivery & DTDC
              </p>
            </div>
            {onOpenTrackOrder && (
              <button
                onClick={() => onOpenTrackOrder()}
                className="bg-[#6d0026] hover:bg-[#8e1b3b] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Track By Order ID</span>
              </button>
            )}
          </div>

          {ordersList.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl border border-[#debfc2]/30 text-center">
              <Package className="w-10 h-10 text-[#debfc2] mx-auto mb-2" />
              <p className="text-xs text-[#574144] font-medium">No past orders in this device yet.</p>
              <p className="text-[11px] text-[#8a7174] mt-1">
                When you buy any saree or gown, your order will appear here with live tracking.
              </p>
            </div>
          ) : (
            ordersList.map((ord) => {
              const firstItem = ord.items[0];
              const displayDate = new Date(ord.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });

              return (
                <div
                  key={ord.id}
                  className="bg-white p-5 rounded-2xl border border-[#debfc2]/30 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex gap-4 items-center">
                    <img
                      src={firstItem?.image || '/logo.svg'}
                      alt={firstItem?.name || 'Package'}
                      className="w-16 h-20 object-cover rounded-xl bg-[#f6f3f2] border border-[#debfc2]/30 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-mono text-xs font-bold text-[#1c1b1b] bg-[#fcf9f8] px-2 py-0.5 rounded-md border border-[#debfc2]/50">
                          #{ord.id}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                            ord.fulfillmentStatus === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.fulfillmentStatus === 'shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : ord.fulfillmentStatus === 'processing'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ord.fulfillmentStatus === 'delivered'
                            ? 'Delivered'
                            : ord.fulfillmentStatus === 'shipped'
                            ? 'Dispatched (In Transit)'
                            : ord.fulfillmentStatus === 'processing'
                            ? 'Tailoring / Quality Inspection'
                            : 'Confirmed'}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-[#1c1b1b]">
                        {firstItem?.name || 'Boutique Outfit'}
                        {ord.items.length > 1 && (
                          <span className="text-[#8a7174] font-normal">
                            {' '}
                            (+{ord.items.length - 1} more)
                          </span>
                        )}
                      </h4>
                      <span className="text-[11px] text-[#8a7174] block mt-0.5">
                        Ordered on {displayDate} • {formatPrice(ord.total, currency)}
                        {ord.trackingNumber && (
                          <span className="text-[#6d0026] ml-2 font-mono font-semibold">
                            AWB: {ord.trackingNumber}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {onOpenTrackOrder && (
                      <button
                        onClick={() => onOpenTrackOrder(ord.id)}
                        className="flex-1 sm:flex-initial px-4 py-2 bg-[#6d0026] hover:bg-[#8e1b3b] text-white text-xs font-bold rounded-full transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Track Package</span>
                      </button>
                    )}
                    <button
                      onClick={() =>
                        alert(
                          `Official Tax Invoice for Order #${ord.id}\nCustomer: ${ord.customer.name}\nTotal: ₹${ord.total}\nStatus: ${ord.paymentStatus.toUpperCase()}\nCourier: ${ord.courierPartner || 'Assigned soon'}`
                        )
                      }
                      className="px-3 py-2 border border-[#debfc2] text-xs font-semibold text-[#574144] rounded-full hover:bg-[#fed9e2]/30 transition-colors"
                    >
                      Receipt
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab: Bespoke Atelier */}
      {activeTab === 'styling' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#debfc2]/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-[#ffd9dd] text-[#6d0026] rounded-full">
              <Scissors className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-[#6d0026]">
                Bespoke Atelier & Blouse Tailoring
              </h3>
              <p className="text-xs text-[#574144]">
                Private consultations with master couturiers for bridal trousseaus, customized zari borders, and made-to-measure blouse cuts.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-[#fcf9f8] rounded-xl border border-[#debfc2]/30">
              <h4 className="text-xs font-bold text-[#1c1b1b] uppercase tracking-wider mb-1">
                Virtual Draping & Styling
              </h4>
              <p className="text-xs text-[#574144] mb-3">
                Connect via high-definition video with our Banarasi and Kanjivaram styling masters.
              </p>
              <button
                onClick={onOpenStylistModal}
                className="text-xs font-semibold text-[#6d0026] hover:underline"
              >
                Schedule Virtual Session →
              </button>
            </div>

            <div className="p-4 bg-[#fcf9f8] rounded-xl border border-[#debfc2]/30">
              <h4 className="text-xs font-bold text-[#1c1b1b] uppercase tracking-wider mb-1">
                Atelier Measurements On File
              </h4>
              <p className="text-xs text-[#574144] mb-3">
                Bust: 34", Underbust: 29", Waist: 28", Shoulder: 14.5", Blouse Length: 14.5"
              </p>
              <button
                onClick={() => alert('Measurements updated in boutique records!')}
                className="text-xs font-semibold text-[#6d0026] hover:underline"
              >
                Update Measurements →
              </button>
            </div>
            <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200">
              <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1">
                Instant WhatsApp Concierge
              </h4>
              <p className="text-xs text-emerald-800 mb-3">
                Chat 1-on-1 with our head stylist on WhatsApp for real-time recommendations, fabric swatches & custom stitching orders.
              </p>
              <a
                href="https://wa.me/918238023498?text=Namaste!%20I%20need%20assistance%20with%20custom%20styling%20and%20orders."
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5"
              >
                <span>Chat on WhatsApp (+91 82380 23498)</span> →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Profile */}
      {activeTab === 'profile' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#debfc2]/30 flex flex-col gap-6">
          <div>
            <h3 className="font-display text-lg font-bold text-[#6d0026] mb-1">
              Boutique Shipping Addresses
            </h3>
            <p className="text-xs text-[#574144] mb-4">
              Your verified vault delivery destinations
            </p>

            <div className="p-4 bg-[#fcf9f8] rounded-xl border border-[#debfc2]/40 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#1c1b1b]">Home Sanctuary</span>
                  <span className="bg-[#6d0026] text-white text-[10px] px-2 py-0.2 rounded-full">
                    Default
                  </span>
                </div>
                <p className="text-xs text-[#574144] mt-1">
                  42, Gulmohar Enclave, Malabar Hill, Mumbai, Maharashtra - 400006
                </p>
                <p className="text-xs text-[#8a7174] mt-0.5">+91 82380 23498</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
