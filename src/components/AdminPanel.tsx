import React, { useState, useEffect } from 'react';
import {
  Package,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  Search,
  Filter,
  DollarSign,
  CreditCard,
  Phone,
  MessageCircle,
  Eye,
  EyeOff,
  FileText,
  Printer,
  ChevronDown,
  RefreshCw,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck,
  ArrowLeft,
  Download,
  Calendar,
  MapPin,
  Sparkles,
  ShoppingBag,
  Check,
  X,
  UserCheck,
  AlertTriangle,
  Lock,
  LogOut,
  KeyRound,
  ShieldAlert,
  Film,
  Play,
  Edit3,
  Send,
  User,
  Copy,
} from 'lucide-react';
import { StoreOrder, OrderFulfillmentStatus, PaymentStatus, Currency } from '../types';
import {
  getStoredOrders,
  syncOrdersWithServer,
  updateOrderFulfillment,
  updateOrderPayment,
  updateOrderDetails,
  updateOrderCustomer,
  formatWhatsAppPhone,
  deleteStoredOrder,
  resetToDefaultOrders,
  saveOrderToStore,
  clearAllDemoOrders,
  clearAllOrders,
  getAdminPin,
  setAdminPin,
  verifyAdminPin,
  isAdminSessionActive,
  setAdminSession,
  logoutAdmin,
  OWNER_EMAIL,
  DEFAULT_ADMIN_PIN,
} from '../utils/orderStorage';
import { formatPrice } from './ProductCard';
import { Logo } from './Logo';

interface AdminPanelProps {
  onBackToStore: () => void;
  currency: Currency;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToStore, currency }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => isAdminSessionActive());
  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Security / Change PIN Modal State
  const [isChangePinModalOpen, setIsChangePinModalOpen] = useState(false);
  const [currentPinVerify, setCurrentPinVerify] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pinChangeError, setPinChangeError] = useState('');
  const [isForgotPinOpen, setIsForgotPinOpen] = useState(false);

  // Order Book State
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all'); // all, paid, pending, new, shipped, delivered
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<StoreOrder | null>(null);
  const [editingTrackingId, setEditingTrackingId] = useState<string | null>(null);
  const [trackingInput, setTrackingInput] = useState({ courier: '', trackingNumber: '' });
  const [isManualOrderModalOpen, setIsManualOrderModalOpen] = useState(false);
  const [isAdVideoModalOpen, setIsAdVideoModalOpen] = useState(false);
  const [adVideoTab, setAdVideoTab] = useState<'viral' | 'collection' | 'saree'>('viral');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Customer WhatsApp Notification Modal State
  const [whatsAppModalOrder, setWhatsAppModalOrder] = useState<StoreOrder | null>(null);
  const [whatsAppTargetPhone, setWhatsAppTargetPhone] = useState('');
  const [whatsAppMessageType, setWhatsAppMessageType] = useState<'confirmation' | 'dispatch' | 'cod_pending' | 'custom'>('confirmation');
  const [whatsAppCustomText, setWhatsAppCustomText] = useState('');
  const [whatsAppPhoneError, setWhatsAppPhoneError] = useState('');

  // Customer Contact Info Quick-Edit Modal State
  const [editingCustomerOrder, setEditingCustomerOrder] = useState<StoreOrder | null>(null);
  const [editCustomerForm, setEditCustomerForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  // Manual order form state
  const [manualOrder, setManualOrder] = useState({
    customerName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    productName: 'Miss Chase Women Maxi Full Length Dress',
    size: 'M',
    color: 'Yellow',
    quantity: 1,
    price: 2399,
    paymentMethod: 'upi' as const,
    paymentStatus: 'paid' as const,
    fulfillmentStatus: 'new' as const,
    notes: 'Direct WhatsApp order',
  });

  const [isSyncing, setIsSyncing] = useState(false);

  const loadOrders = async () => {
    setOrders(getStoredOrders());
    try {
      const serverList = await syncOrdersWithServer();
      if (serverList && serverList.length > 0) {
        setOrders(serverList);
      }
    } catch (e) {
      // Fallback to local
    }
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      const latest = await syncOrdersWithServer();
      setOrders(latest);
      showToast(`Central sync complete: ${latest.length} total orders!`);
    } catch {
      showToast('Central sync offline, displaying local cache');
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    loadOrders();

    const handleOrderUpdate = () => {
      setOrders(getStoredOrders());
    };

    window.addEventListener('zevioza_order_updated', handleOrderUpdate);

    // Auto-poll central server every 6 seconds so incoming orders from customers/friends appear live
    const pollTimer = setInterval(() => {
      syncOrdersWithServer().then((latest) => {
        if (latest && latest.length > 0) {
          setOrders(latest);
        }
      });
    }, 6000);

    return () => {
      clearInterval(pollTimer);
      window.removeEventListener('zevioza_order_updated', handleOrderUpdate);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Auth Handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthenticating(true);

    setTimeout(() => {
      if (verifyAdminPin(pinInput)) {
        setAdminSession(true, rememberDevice);
        setIsAuthenticated(true);
        setPinInput('');
        showToast('Access Granted: Welcome back, Store Owner!');
      } else {
        setAuthError('Incorrect PIN or Password. Please verify and try again.');
      }
      setIsAuthenticating(false);
    }, 350);
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
    showToast('Admin session locked securely.');
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeError('');

    if (!verifyAdminPin(currentPinVerify)) {
      setPinChangeError('Current master PIN is incorrect.');
      return;
    }

    if (newPinInput.length < 4) {
      setPinChangeError('New PIN must be at least 4 digits or characters.');
      return;
    }

    if (newPinInput !== confirmPinInput) {
      setPinChangeError('New PIN and Confirm PIN do not match.');
      return;
    }

    const success = setAdminPin(newPinInput);
    if (success) {
      setIsChangePinModalOpen(false);
      setCurrentPinVerify('');
      setNewPinInput('');
      setConfirmPinInput('');
      showToast('Master Admin PIN successfully updated!');
    } else {
      setPinChangeError('Failed to save new PIN. Please try again.');
    }
  };

  const handleClearDemoOrders = () => {
    if (window.confirm('Clear all 5 sample demo orders? Your dashboard will now only show real customer orders.')) {
      const remaining = clearAllDemoOrders();
      setOrders(remaining);
      showToast('All demo orders cleared! Showing only real orders.');
    }
  };

  const handleUpdateStatus = (orderId: string, status: OrderFulfillmentStatus) => {
    const updated = updateOrderFulfillment(orderId, status);
    setOrders(updated);
    showToast(`Order #${orderId} status changed to ${status.toUpperCase()}`);
  };

  const handleTogglePayment = (orderId: string, currentStatus: PaymentStatus) => {
    const nextStatus: PaymentStatus = currentStatus === 'paid' ? 'pending' : 'paid';
    const txn = nextStatus === 'paid' ? `MANUAL-CASH-${Date.now().toString().slice(-6)}` : undefined;
    const updated = updateOrderPayment(orderId, nextStatus, txn);
    setOrders(updated);
    showToast(`Order #${orderId} payment marked as ${nextStatus.toUpperCase()}`);
  };

  const handleSaveTracking = (orderId: string) => {
    const updated = updateOrderDetails(orderId, {
      courierPartner: trackingInput.courier,
      trackingNumber: trackingInput.trackingNumber,
      fulfillmentStatus: 'shipped',
    });
    setOrders(updated);
    setEditingTrackingId(null);
    showToast(`Tracking saved & marked as Shipped for #${orderId}`);
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm(`Are you sure you want to delete order ${orderId}?`)) {
      const updated = deleteStoredOrder(orderId);
      setOrders(updated);
      showToast(`Order #${orderId} deleted`);
    }
  };

  const handleCreateManualOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `ZV-${Math.floor(100000 + Math.random() * 900000)}`;
    const total = manualOrder.price * manualOrder.quantity;

    const newOrder: StoreOrder = {
      id: newId,
      createdAt: new Date().toISOString(),
      customer: {
        name: manualOrder.customerName || 'Walk-in Client',
        phone: manualOrder.phone,
        email: manualOrder.email || 'client@zevioza.in',
        address: manualOrder.address,
        city: manualOrder.city,
        state: manualOrder.state,
        pincode: manualOrder.pincode,
        country: 'India',
      },
      items: [
        {
          id: `item-${Date.now()}`,
          productId: 'manual-prod',
          name: manualOrder.productName,
          image: '/Miss Chase  Maxi Yellow - 1.webp',
          price: manualOrder.price,
          quantity: manualOrder.quantity,
          selectedSize: manualOrder.size,
          selectedColor: manualOrder.color,
        },
      ],
      subtotal: total,
      discountAmount: 0,
      giftWrapAmount: 0,
      total,
      currency: 'INR',
      paymentMethod: manualOrder.paymentMethod,
      paymentStatus: manualOrder.paymentStatus,
      fulfillmentStatus: manualOrder.fulfillmentStatus,
      transactionId: manualOrder.paymentStatus === 'paid' ? `MANUAL-${Date.now().toString().slice(-6)}` : undefined,
      adminNotes: manualOrder.notes,
    };

    saveOrderToStore(newOrder);
    setOrders(getStoredOrders());
    setIsManualOrderModalOpen(false);
    showToast(`New manual order #${newId} created!`);
  };

  const handleExportCSV = () => {
    const headers = [
      'Order ID',
      'Date',
      'Customer Name',
      'Phone',
      'Email',
      'Address',
      'City',
      'Pincode',
      'Items',
      'Total (INR)',
      'Payment Method',
      'Payment Status',
      'Transaction ID',
      'Fulfillment Status',
      'Courier',
      'Tracking Number',
    ];

    const rows = orders.map((o) => [
      `"${o.id}"`,
      `"${new Date(o.createdAt).toLocaleDateString()}"`,
      `"${o.customer.name}"`,
      `"${o.customer.phone}"`,
      `"${o.customer.email}"`,
      `"${o.customer.address.replace(/"/g, '""')}"`,
      `"${o.customer.city}"`,
      `"${o.customer.pincode}"`,
      `"${o.items.map((i) => `${i.name} (${i.quantity})`).join(', ')}"`,
      o.total,
      `"${o.paymentMethod.toUpperCase()}"`,
      `"${o.paymentStatus.toUpperCase()}"`,
      `"${o.transactionId || 'N/A'}"`,
      `"${o.fulfillmentStatus.toUpperCase()}"`,
      `"${o.courierPartner || 'N/A'}"`,
      `"${o.trackingNumber || 'N/A'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Zevioza_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Orders exported to CSV spreadsheet successfully!');
  };

  const handleOpenWhatsAppModal = (order: StoreOrder) => {
    setWhatsAppModalOrder(order);
    const digits = order.customer.phone.replace(/\D/g, '');
    const isOwnerPhone = digits.endsWith('8238023498');

    // If it's the owner's phone or invalid placeholder, clear or flag it
    setWhatsAppTargetPhone(isOwnerPhone ? '' : order.customer.phone);
    setWhatsAppMessageType('confirmation');
    setWhatsAppCustomText('');
    setWhatsAppPhoneError(
      isOwnerPhone
        ? '⚠️ Is order mein boutique ka support number (82380 23498) save tha. Kripya customer ka actual WhatsApp mobile number enter karein.'
        : ''
    );
  };

  const handleOpenEditCustomer = (order: StoreOrder) => {
    setEditingCustomerOrder(order);
    setEditCustomerForm({
      name: order.customer.name,
      phone: order.customer.phone,
      email: order.customer.email,
      address: order.customer.address,
      city: order.customer.city,
      state: order.customer.state,
      pincode: order.customer.pincode,
    });
  };

  const handleSaveCustomerDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomerOrder) return;
    updateOrderCustomer(editingCustomerOrder.id, editCustomerForm);
    loadOrders();
    showToast('Customer information updated and saved successfully!');
    setEditingCustomerOrder(null);
  };

  const getFormattedWhatsAppMessage = (order: StoreOrder, type: string): string => {
    const itemsList = order.items
      .map(
        (item) =>
          `• *${item.name}* (Qty: ${item.quantity}${item.selectedColor ? `, Shade: ${item.selectedColor}` : ''}${
            item.selectedSize ? `, Size: ${item.selectedSize}` : ''
          }) - ₹${item.price * item.quantity}`
      )
      .join('\n');

    if (type === 'confirmation') {
      return (
        `Namaste ${order.customer.name} ji,\n\n` +
        `Aapka Zevioza Boutique Order *#${order.id}* successfully confirm ho gaya hai! 🎉\n\n` +
        `• *Order Total:* ₹${order.total}\n` +
        `• *Payment Mode:* ${
          order.paymentMethod === 'cod'
            ? `Cash on Delivery (₹${order.total} to collect on delivery)`
            : order.paymentMethod === 'upi'
            ? 'Direct UPI'
            : 'Prepaid Online'
        }\n` +
        `• *Payment Status:* ${order.paymentStatus === 'paid' ? 'PAID ✅' : 'PENDING ⏳ (Pay at delivery)'}\n` +
        `• *Delivery Address:* ${order.customer.address}, ${order.customer.city} - ${order.customer.pincode}\n\n` +
        `*Items Ordered:*\n${itemsList}\n\n` +
        `Hum aapka package safely pack kar rahe hain. Dispatch hote hi aapko tracking details yahan WhatsApp par send kar di jayegi.\n\n` +
        `Kisi bhi customization ya sizing query ke liye aap is number par WhatsApp reply kar sakte hain.\n\n` +
        `Warm regards,\n*Zevioza Boutique*`
      );
    }

    if (type === 'dispatch') {
      return (
        `Namaste ${order.customer.name} ji,\n\n` +
        `Aapka Zevioza Boutique Order *#${order.id}* dispatch ho gaya hai! 🚚\n\n` +
        (order.courierPartner ? `• *Courier Partner:* ${order.courierPartner}\n` : '• *Courier:* Express Surface Delivery\n') +
        (order.trackingNumber ? `• *Tracking Number (AWB):* ${order.trackingNumber}\n` : '') +
        `• *Delivery Address:* ${order.customer.address}, ${order.customer.city}\n` +
        `• *Amount to Pay:* ${
          order.paymentStatus === 'paid'
            ? '₹0 (Order Already Paid)'
            : `₹${order.total} (Cash on Delivery)`
        }\n\n` +
        `Estimated Delivery: 3-5 business days.\n\n` +
        `Warm regards,\n*Zevioza Boutique*`
      );
    }

    if (type === 'cod_pending') {
      return (
        `Namaste ${order.customer.name} ji,\n\n` +
        `Yeh message aapke Zevioza Cash on Delivery Order *#${order.id}* ke dispatch confirmation ke liye hai.\n\n` +
        `• *Total Order Amount:* ₹${order.total} (To be paid in cash at doorstep)\n` +
        `• *Delivery Address:* ${order.customer.address}, ${order.customer.city} - ${order.customer.pincode}\n\n` +
        `Kripya confirm karein ki aap delivery lene ke liye available rahenge? Reply with *CONFIRM* to dispatch today.\n\n` +
        `Warm regards,\n*Zevioza Boutique*`
      );
    }

    return (
      whatsAppCustomText ||
      `Namaste ${order.customer.name} ji, regarding your Zevioza Boutique Order #${order.id}.`
    );
  };

  const handleSendWhatsAppToCustomer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!whatsAppModalOrder) return;

    const raw = whatsAppTargetPhone.trim();
    const digits = raw.replace(/\D/g, '');

    if (!digits || digits.length < 10) {
      setWhatsAppPhoneError('Kripya valid 10-digit customer mobile number enter karein.');
      return;
    }

    if (digits.endsWith('8238023498')) {
      setWhatsAppPhoneError(
        '⚠️ Yeh number aapka apna store number (82380 23498) hai! Kripya customer ka mobile number daliye taaki message customer ko jaye, aapko nahi.'
      );
      return;
    }

    const cleanPhone = formatWhatsAppPhone(raw);

    // Save updated phone to order permanently if changed
    if (raw !== whatsAppModalOrder.customer.phone) {
      updateOrderCustomer(whatsAppModalOrder.id, { phone: raw });
      loadOrders();
      showToast(`Customer phone number permanently saved for order #${whatsAppModalOrder.id}`);
    }

    const message = getFormattedWhatsAppMessage(whatsAppModalOrder, whatsAppMessageType);
    const encoded = encodeURIComponent(message);

    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
    setWhatsAppModalOrder(null);
    showToast(`WhatsApp chat opened for customer (${raw})!`);
  };

  // Financial calculations
  const totalOrdersCount = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const paidOrders = orders.filter((o) => o.paymentStatus === 'paid');
  const paidRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter((o) => o.paymentStatus === 'pending');
  const pendingRevenue = pendingOrders.reduce((sum, o) => sum + o.total, 0);

  const newOrdersCount = orders.filter((o) => o.fulfillmentStatus === 'new').length;
  const shippedOrdersCount = orders.filter((o) => o.fulfillmentStatus === 'shipped').length;
  const deliveredOrdersCount = orders.filter((o) => o.fulfillmentStatus === 'delivered').length;

  // Filter logic
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.phone.includes(searchQuery) ||
      order.customer.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === 'all') return true;
    if (statusFilter === 'paid') return order.paymentStatus === 'paid';
    if (statusFilter === 'pending') return order.paymentStatus === 'pending';
    if (statusFilter === 'new') return order.fulfillmentStatus === 'new';
    if (statusFilter === 'processing') return order.fulfillmentStatus === 'processing';
    if (statusFilter === 'shipped') return order.fulfillmentStatus === 'shipped';
    if (statusFilter === 'delivered') return order.fulfillmentStatus === 'delivered';

    return true;
  });

  // Check if any demo orders exist in the current database
  const hasDemoOrders = orders.some((o) => o.isDemo);
  const demoOrdersCount = orders.filter((o) => o.isDemo).length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f7f4f2] flex flex-col items-center justify-center px-4 py-12 font-body">
        {toastMessage && (
          <div className="fixed top-20 right-5 z-50 bg-[#1c1b1b] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-semibold animate-fade-in border border-white/20">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl border border-[#debfc2]/60 shadow-xl p-8 sm:p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#6d0026] via-[#a82245] to-[#ffdea5]" />

            <div className="text-center mb-7">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6d0026] to-[#450017] text-[#ffdea5] flex items-center justify-center mx-auto mb-4 shadow-md border border-[#ffdea5]/30">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="font-display text-2xl font-bold text-[#1c1b1b]">
                Merchant Atelier
              </h2>
              <p className="text-xs text-[#8a7174] mt-1">
                Zevioza Boutique • Owner & Admin Security Portal
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 bg-[#fed9e2]/50 text-[#6d0026] text-[11px] font-semibold px-3 py-1 rounded-full border border-[#debfc2]">
                <Lock className="w-3 h-3" />
                <span>Authorized Owner: {OWNER_EMAIL}</span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#574144] uppercase tracking-wider mb-2">
                  Enter Master PIN or Password
                </label>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      if (authError) setAuthError('');
                    }}
                    placeholder="Enter 4-digit PIN (e.g. 9825)"
                    autoFocus
                    required
                    className="w-full pl-4 pr-12 py-3.5 bg-[#f6f3f2] focus:bg-white rounded-xl border border-[#debfc2]/70 focus:border-[#6d0026] focus:ring-2 focus:ring-[#6d0026]/10 text-base font-mono tracking-widest text-[#1c1b1b] outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8a7174] hover:text-[#1c1b1b] p-1 cursor-pointer"
                    title={showPin ? 'Hide PIN' : 'Show PIN'}
                  >
                    {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {authError && (
                  <p className="text-xs font-semibold text-rose-600 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {authError}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[#574144]">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="w-4 h-4 rounded text-[#6d0026] focus:ring-[#6d0026]"
                  />
                  <span>Remember this device</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotPinOpen(true)}
                  className="text-xs text-[#6d0026] hover:underline font-semibold"
                >
                  Forgot PIN?
                </button>
              </div>

              <button
                type="submit"
                disabled={isAuthenticating || !pinInput.trim()}
                className="w-full bg-[#6d0026] hover:bg-[#8e1b3b] disabled:opacity-50 text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isAuthenticating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Unlock Admin Dashboard</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-[#debfc2]/40 text-center">
              <div className="bg-[#fcf9f8] p-3 rounded-xl border border-[#debfc2]/40 text-[11px] text-[#574144] leading-relaxed text-left">
                <div className="font-bold text-[#6d0026] mb-1">🔐 Master Access Info:</div>
                Default Master PIN is <code className="font-mono font-bold bg-[#fed9e2]/70 px-1.5 py-0.5 rounded text-[#6d0026]">9825</code> (or password <code className="font-mono font-bold bg-[#fed9e2]/70 px-1.5 py-0.5 rounded text-[#6d0026]">zevioza2026</code>).
                <div className="text-[10px] text-[#8a7174] mt-1">
                  Dashboard me login hone ke baad aap 'Change PIN' button se apna naya personal secret PIN set kar sakte hain.
                </div>
              </div>

              <button
                onClick={onBackToStore}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#8a7174] hover:text-[#1c1b1b] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Shopping Storefront</span>
              </button>
            </div>
          </div>
        </div>

        {isForgotPinOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#debfc2]">
              <div className="w-10 h-10 rounded-full bg-[#fed9e2] text-[#6d0026] flex items-center justify-center mb-3">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-[#1c1b1b]">Master PIN Recovery</h3>
              <p className="text-xs text-[#574144] mt-2 leading-relaxed">
                Aapka registered owner email <strong>{OWNER_EMAIL}</strong> hai. Agar aap apna custom PIN bhool gaye hain, to master default PIN <strong>9825</strong> ya password <strong>zevioza2026</strong> se login ho sakte hain.
              </p>
              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPinInput('9825');
                    setIsForgotPinOpen(false);
                  }}
                  className="flex-1 bg-[#6d0026] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#8e1b3b]"
                >
                  Fill Default PIN (9825)
                </button>
                <button
                  type="button"
                  onClick={() => setIsForgotPinOpen(false)}
                  className="px-4 py-2.5 bg-[#f6f3f2] text-[#574144] rounded-xl text-xs font-semibold hover:bg-[#ede9e8]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f4f2] text-[#1c1b1b] pb-24 font-body">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 bg-[#1c1b1b] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-semibold animate-fade-in border border-white/20">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Navigation Bar */}
      <header className="bg-white border-b border-[#debfc2]/40 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToStore}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#6d0026] hover:text-[#8e1b3b] bg-[#fed9e2]/40 hover:bg-[#fed9e2]/80 px-3.5 py-1.5 rounded-full transition-all border border-[#debfc2]/50"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Store</span>
            </button>
            <div className="h-5 w-px bg-[#debfc2]/60 hidden sm:block" />
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#6d0026] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                ZV
              </div>
              <div>
                <h1 className="font-display text-base sm:text-lg font-bold text-[#1c1b1b] flex items-center gap-2 leading-none">
                  Zevioza Merchant Central
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Store Admin
                  </span>
                </h1>
                <p className="text-[11px] text-[#8a7174] mt-0.5">Order Book & Payment Reconciliation</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Owner Email Badge */}
            <div className="hidden lg:flex items-center gap-2 bg-[#f6f3f2] px-3 py-1.5 rounded-xl border border-[#debfc2]/60 text-xs text-[#574144]">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium text-[#1c1b1b]">{OWNER_EMAIL}</span>
              <span className="text-[10px] bg-[#6d0026] text-white px-1.5 py-0.5 rounded font-bold">Owner</span>
            </div>

            {/* Change PIN Button */}
            <button
              onClick={() => setIsChangePinModalOpen(true)}
              className="flex items-center gap-1.5 text-xs font-medium bg-white hover:bg-[#f6f3f2] border border-[#debfc2]/60 text-[#574144] px-3 py-2 rounded-xl transition-all shadow-2xs cursor-pointer"
              title="Change Master Security PIN"
            >
              <Lock className="w-3.5 h-3.5 text-[#6d0026]" />
              <span className="hidden sm:inline">Change PIN</span>
            </button>

            {/* Lock / Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-semibold bg-[#fed9e2]/50 hover:bg-[#fed9e2] text-[#6d0026] border border-[#debfc2] px-3 py-2 rounded-xl transition-all cursor-pointer"
              title="Lock Admin Panel"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lock / Logout</span>
            </button>

            <button
              onClick={() => setIsAdVideoModalOpen(true)}
              className="flex items-center gap-1.5 text-xs font-semibold bg-gradient-to-r from-[#6d0026] to-[#a82046] hover:from-[#57001e] hover:to-[#8e1b3b] text-white px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
              title="Preview & Download Merged Zevioza Ad Reel"
            >
              <Film className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden md:inline">Ad Campaign Reel</span>
              <span className="bg-amber-400/20 text-amber-200 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">Ready</span>
            </button>

            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 px-3.5 py-2 rounded-xl transition-all shadow-2xs cursor-pointer"
              title="Sync orders live from Central Cloud Database"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-700 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Live Sync'}</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 text-xs font-medium bg-white hover:bg-[#f6f3f2] border border-[#debfc2]/60 text-[#574144] px-3.5 py-2 rounded-xl transition-all shadow-2xs"
              title="Download Orders CSV"
            >
              <Download className="w-3.5 h-3.5 text-[#6d0026]" />
              <span className="hidden sm:inline">Export Excel/CSV</span>
            </button>

            <button
              onClick={() => setIsManualOrderModalOpen(true)}
              className="flex items-center gap-1.5 text-xs font-semibold bg-[#6d0026] hover:bg-[#8e1b3b] text-white px-4 py-2 rounded-xl transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Manual Order</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
        {/* Demo Orders Active Warning Banner */}
        {hasDemoOrders && (
          <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-200/80 text-amber-900 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-950 flex items-center gap-2">
                  Sample Demo Orders Active ({demoOrdersCount} Sample Orders)
                </h4>
                <p className="text-xs text-amber-900/80 mt-0.5 max-w-2xl leading-relaxed">
                  Ye orders test preview ke liye placeholder data hain (real customers ne abhi place nahi kiye hain).
                  Aap in demo orders ko 1-click me remove kar sakte hain taaki aapka dashboard bilkul clean rahe aur sirf <strong>Real Live Customer Orders</strong> hi show hon!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <button
                onClick={handleClearDemoOrders}
                className="flex-1 sm:flex-initial bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Demo Orders (Start Fresh)</span>
              </button>
            </div>
          </div>
        )}
        {/* KPI Financial & Order Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Total Orders */}
          <div className="bg-white p-5 rounded-2xl border border-[#debfc2]/40 shadow-xs">
            <div className="flex items-center justify-between text-[#8a7174] mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Orders</span>
              <div className="w-8 h-8 rounded-full bg-[#f6f3f2] flex items-center justify-center text-[#6d0026]">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="font-display text-2xl sm:text-3xl font-bold text-[#1c1b1b]">
              {totalOrdersCount}
            </div>
            <div className="text-[11px] text-[#574144] mt-1 flex items-center gap-1.5">
              <span className="font-medium text-emerald-700">{newOrdersCount} New Orders</span>
              <span>•</span>
              <span>{shippedOrdersCount} In Transit</span>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white p-5 rounded-2xl border border-[#debfc2]/40 shadow-xs">
            <div className="flex items-center justify-between text-[#8a7174] mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Order Value</span>
              <div className="w-8 h-8 rounded-full bg-[#fed9e2]/50 flex items-center justify-center text-[#8e1b3b]">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="font-display text-2xl sm:text-3xl font-bold text-[#6d0026]">
              {formatPrice(totalRevenue, currency)}
            </div>
            <div className="text-[11px] text-[#8a7174] mt-1">Across all order channels</div>
          </div>

          {/* Paid Orders (KISKA PAYMENT HUA HE) */}
          <div className="bg-white p-5 rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-b from-emerald-50/40 to-white shadow-xs">
            <div className="flex items-center justify-between text-emerald-800 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Payments Received (PAID)
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {paidOrders.length} Orders
              </span>
            </div>
            <div className="font-display text-2xl sm:text-3xl font-bold text-emerald-700">
              {formatPrice(paidRevenue, currency)}
            </div>
            <div className="text-[11px] text-emerald-700/80 mt-1 font-medium">
              UPI & Online Cards Settled
            </div>
          </div>

          {/* Pending COD Orders */}
          <div className="bg-white p-5 rounded-2xl border-2 border-amber-500/30 bg-gradient-to-b from-amber-50/40 to-white shadow-xs">
            <div className="flex items-center justify-between text-amber-800 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                Payment Pending (COD)
              </span>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {pendingOrders.length} Orders
              </span>
            </div>
            <div className="font-display text-2xl sm:text-3xl font-bold text-amber-700">
              {formatPrice(pendingRevenue, currency)}
            </div>
            <div className="text-[11px] text-amber-700/80 mt-1 font-medium">
              To be collected upon doorstep delivery
            </div>
          </div>
        </div>

        {/* Filter Toolbar & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#debfc2]/40 shadow-xs mb-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8a7174] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Order ID, Customer Name, Mobile, City, or Product..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-[#f6f3f2] hover:bg-[#ede9e8] focus:bg-white rounded-xl border border-[#debfc2]/50 focus:border-[#6d0026] focus:outline-none transition-all placeholder-[#8a7174]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8a7174] hover:text-[#1c1b1b]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
                  statusFilter === 'all'
                    ? 'bg-[#6d0026] text-white shadow-2xs font-semibold'
                    : 'bg-[#f6f3f2] text-[#574144] hover:bg-[#ede9e8]'
                }`}
              >
                All ({orders.length})
              </button>
              <button
                onClick={() => setStatusFilter('paid')}
                className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all flex items-center gap-1 ${
                  statusFilter === 'paid'
                    ? 'bg-emerald-600 text-white shadow-2xs font-semibold'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200/60 hover:bg-emerald-100'
                }`}
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>Paid ({paidOrders.length})</span>
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all flex items-center gap-1 ${
                  statusFilter === 'pending'
                    ? 'bg-amber-600 text-white shadow-2xs font-semibold'
                    : 'bg-amber-50 text-amber-800 border border-amber-200/60 hover:bg-amber-100'
                }`}
              >
                <Clock className="w-3 h-3" />
                <span>Pending COD ({pendingOrders.length})</span>
              </button>
              <button
                onClick={() => setStatusFilter('new')}
                className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
                  statusFilter === 'new'
                    ? 'bg-[#1c1b1b] text-white shadow-2xs font-semibold'
                    : 'bg-[#f6f3f2] text-[#574144] hover:bg-[#ede9e8]'
                }`}
              >
                New ({newOrdersCount})
              </button>
              <button
                onClick={() => setStatusFilter('shipped')}
                className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
                  statusFilter === 'shipped'
                    ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                    : 'bg-[#f6f3f2] text-[#574144] hover:bg-[#ede9e8]'
                }`}
              >
                Shipped ({shippedOrdersCount})
              </button>
              <button
                onClick={() => setStatusFilter('delivered')}
                className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
                  statusFilter === 'delivered'
                    ? 'bg-purple-600 text-white shadow-2xs font-semibold'
                    : 'bg-[#f6f3f2] text-[#574144] hover:bg-[#ede9e8]'
                }`}
              >
                Delivered ({deliveredOrdersCount})
              </button>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#debfc2]/40 p-12 text-center shadow-xs">
            <Package className="w-12 h-12 text-[#debfc2] mx-auto mb-3" />
            <h3 className="font-display text-base font-bold text-[#1c1b1b]">
              {orders.length === 0 ? 'Your Order Book is Clean & Ready' : 'No matching orders found'}
            </h3>
            <p className="text-xs text-[#574144] mt-1 max-w-md mx-auto leading-relaxed">
              {orders.length === 0
                ? 'Aapka order management system live hai! Jab bhi koi customer store par dress purchase karega, uska live order, address aur payment status (Paid UPI/Card ya COD) turant yahan real-time me record hoga.'
                : 'Active search ya filter ke anusar koi order nahi mila. Filter reset karein.'}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              {orders.length > 0 ? (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                  className="bg-[#6d0026] text-white px-4 py-2 rounded-xl text-xs font-semibold"
                >
                  Reset Filters
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setIsManualOrderModalOpen(true)}
                    className="bg-[#6d0026] hover:bg-[#8e1b3b] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Order Manually</span>
                  </button>
                  <button
                    onClick={() => {
                      resetToDefaultOrders();
                      loadOrders();
                      showToast('Sample demo orders re-loaded for preview');
                    }}
                    className="bg-[#f6f3f2] hover:bg-[#ede9e8] text-[#574144] px-4 py-2.5 rounded-xl text-xs font-semibold border border-[#debfc2]/50 transition-all"
                  >
                    Load Sample Demo Orders
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const isPaid = order.paymentStatus === 'paid';
              const isCOD = order.paymentMethod === 'cod';

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-[#debfc2]/50 shadow-xs hover:shadow-md transition-all overflow-hidden"
                >
                  {/* Order Top Meta Strip */}
                  <div className="bg-[#fcf9f8] px-5 py-3.5 border-b border-[#debfc2]/30 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-sm text-[#1c1b1b] bg-white px-2.5 py-1 rounded-md border border-[#debfc2]/60">
                        #{order.id}
                      </span>
                      {order.isDemo ? (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded-full text-[10px]" title="This is a test placeholder order">
                          Demo Sample
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-2 py-0.5 rounded-full text-[10px]" title="This is a genuine live customer order">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Live Customer Order
                        </span>
                      )}
                      <div className="flex items-center gap-1.5 text-[#574144]">
                        <Calendar className="w-3.5 h-3.5 text-[#8a7174]" />
                        <span>
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                          {' at '}
                          {new Date(order.createdAt).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Payment Status Badge (Super prominent so owner sees "Kiska payment hua") */}
                      {isPaid ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-[11px] border border-emerald-300/60 shadow-2xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          PAID • {order.paymentMethod.toUpperCase()}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full text-[11px] border border-amber-300/60 shadow-2xs">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          {order.paymentMethod === 'cod'
                            ? 'PENDING • CASH ON DELIVERY'
                            : order.paymentMethod === 'upi'
                            ? 'PENDING • UPI VERIFICATION'
                            : 'PENDING • UNPAID'}
                        </span>
                      )}

                      {/* Fulfillment Status Badge */}
                      <span
                        className={`font-semibold text-[11px] px-2.5 py-1 rounded-full capitalize ${
                          order.fulfillmentStatus === 'delivered'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : order.fulfillmentStatus === 'shipped'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : order.fulfillmentStatus === 'processing'
                            ? 'bg-orange-100 text-orange-800 border border-orange-200'
                            : 'bg-zinc-100 text-zinc-800 border border-zinc-200'
                        }`}
                      >
                        {order.fulfillmentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Order Body Details */}
                  <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left & Middle: Items & Customer Details (8 cols) */}
                    <div className="lg:col-span-8 space-y-4">
                      {/* Customer Info Card */}
                      <div className="flex flex-wrap items-start justify-between gap-3 bg-[#fbf9f8] p-3.5 rounded-xl border border-[#debfc2]/30">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-display font-bold text-sm text-[#1c1b1b]">
                              {order.customer.name}
                            </span>
                            <span className="text-xs text-[#8a7174]">({order.customer.email})</span>
                          </div>
                          <p className="text-xs text-[#574144] mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#6d0026] shrink-0" />
                            <span>
                              {order.customer.address}, {order.customer.city}, {order.customer.state} -{' '}
                              {order.customer.pincode}
                            </span>
                          </p>
                        </div>

                        {/* Quick Contact Buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={`tel:${order.customer.phone}`}
                            className="flex items-center gap-1 text-[11px] font-semibold text-[#574144] hover:text-[#1c1b1b] bg-white border border-[#debfc2]/60 px-2.5 py-1.5 rounded-lg transition-all"
                            title="Call Customer"
                          >
                            <Phone className="w-3 h-3 text-emerald-600" />
                            <span>{order.customer.phone}</span>
                          </a>

                          <button
                            onClick={() => handleOpenWhatsAppModal(order)}
                            className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-lg transition-all shadow-2xs cursor-pointer"
                            title="Send order confirmation or updates to customer on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Send Msg to Customer</span>
                          </button>

                          <button
                            onClick={() => handleOpenEditCustomer(order)}
                            className="flex items-center gap-1 text-[11px] font-medium text-[#574144] hover:text-[#1c1b1b] bg-white hover:bg-[#fbf9f8] border border-[#debfc2]/60 px-2 py-1.5 rounded-lg transition-all cursor-pointer"
                            title="Edit Customer Phone / Name / Address"
                          >
                            <Edit3 className="w-3 h-3 text-[#6d0026]" />
                            <span>Edit Info</span>
                          </button>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="space-y-2.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8a7174]">
                          Order Items ({order.items.length})
                        </span>
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3.5 p-2.5 rounded-xl bg-white border border-[#debfc2]/30"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-14 h-18 object-cover rounded-lg bg-[#f6f3f2] shrink-0 border border-[#debfc2]/40"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-display font-semibold text-xs text-[#1c1b1b] truncate">
                                {item.name}
                              </h4>
                              <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-[#574144]">
                                {item.selectedColor && (
                                  <span className="bg-[#f6f3f2] px-2 py-0.5 rounded-md font-medium">
                                    Color: {item.selectedColor}
                                  </span>
                                )}
                                {item.selectedSize && (
                                  <span className="bg-[#f6f3f2] px-2 py-0.5 rounded-md font-medium">
                                    Size: {item.selectedSize}
                                  </span>
                                )}
                                {item.customStitching && (
                                  <span className="bg-[#fed9e2]/80 text-[#6d0026] px-2 py-0.5 rounded-md font-semibold text-[10px]">
                                    + Custom Stitching
                                  </span>
                                )}
                                <span className="text-[#8a7174]">Qty: {item.quantity}</span>
                              </div>
                              {item.notes && (
                                <p className="text-[10px] text-[#8e1b3b] mt-1 italic">
                                  Notes: {item.notes}
                                </p>
                              )}
                            </div>
                            <div className="text-right shrink-0">
                              <span className="font-display font-bold text-xs text-[#6d0026]">
                                {formatPrice(item.price * item.quantity, currency)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Courier & Tracking Section */}
                      <div className="bg-[#fcf9f8] p-3 rounded-xl border border-[#debfc2]/30 text-xs">
                        {editingTrackingId === order.id ? (
                          <div className="flex flex-wrap items-center gap-2">
                            <input
                              type="text"
                              placeholder="Courier (e.g. BlueDart / Delhivery)"
                              value={trackingInput.courier}
                              onChange={(e) =>
                                setTrackingInput({ ...trackingInput, courier: e.target.value })
                              }
                              className="px-2.5 py-1.5 text-xs bg-white border border-[#debfc2] rounded-lg focus:outline-none"
                            />
                            <input
                              type="text"
                              placeholder="AWB / Tracking Number"
                              value={trackingInput.trackingNumber}
                              onChange={(e) =>
                                setTrackingInput({
                                  ...trackingInput,
                                  trackingNumber: e.target.value,
                                })
                              }
                              className="px-2.5 py-1.5 text-xs bg-white border border-[#debfc2] rounded-lg focus:outline-none"
                            />
                            <button
                              onClick={() => handleSaveTracking(order.id)}
                              className="bg-[#6d0026] text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[#8e1b3b]"
                            >
                              Save Tracking
                            </button>
                            <button
                              onClick={() => setEditingTrackingId(null)}
                              className="text-xs text-[#8a7174] hover:text-[#1c1b1b] px-2"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Truck className="w-4 h-4 text-[#6d0026]" />
                              {order.trackingNumber ? (
                                <span className="font-medium text-[#1c1b1b]">
                                  {order.courierPartner || 'Courier'}:{' '}
                                  <span className="font-mono font-bold text-[#6d0026]">
                                    {order.trackingNumber}
                                  </span>
                                </span>
                              ) : (
                                <span className="text-[#8a7174] italic">No tracking assigned yet</span>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                setEditingTrackingId(order.id);
                                setTrackingInput({
                                  courier: order.courierPartner || '',
                                  trackingNumber: order.trackingNumber || '',
                                });
                              }}
                              className="text-xs font-semibold text-[#6d0026] hover:underline"
                            >
                              {order.trackingNumber ? 'Edit Tracking' : '+ Add Courier & AWB'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Column: Pricing Breakdown & Merchant Actions (4 cols) */}
                    <div className="lg:col-span-4 bg-[#fcf9f8] p-4 rounded-xl border border-[#debfc2]/40 flex flex-col justify-between space-y-4">
                      {/* Price Summary */}
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8a7174] block mb-2">
                          Payment & Billing Summary
                        </span>

                        <div className="space-y-1.5 text-xs text-[#574144]">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>{formatPrice(order.subtotal, currency)}</span>
                          </div>
                          {order.discountAmount > 0 && (
                            <div className="flex justify-between text-emerald-700 font-medium">
                              <span>Privilege Discount:</span>
                              <span>-{formatPrice(order.discountAmount, currency)}</span>
                            </div>
                          )}
                          {order.giftWrapAmount > 0 && (
                            <div className="flex justify-between text-[#8e1b3b]">
                              <span>Gift Packaging:</span>
                              <span>+{formatPrice(order.giftWrapAmount, currency)}</span>
                            </div>
                          )}
                          <div className="border-t border-[#debfc2]/60 pt-2 mt-2 flex justify-between items-baseline font-bold text-sm text-[#1c1b1b]">
                            <span>Grand Total:</span>
                            <span className="font-display text-base text-[#6d0026]">
                              {formatPrice(order.total, currency)}
                            </span>
                          </div>
                        </div>

                        {/* Transaction ID & Payment Method Details */}
                        <div className="mt-3 pt-3 border-t border-[#debfc2]/40 text-[11px] text-[#574144] space-y-1">
                          <div className="flex justify-between">
                            <span className="text-[#8a7174]">Payment Mode:</span>
                            <span className="font-bold text-[#1c1b1b]">
                              {order.paymentMethod === 'razorpay'
                                ? 'Cards / NetBanking'
                                : order.paymentMethod === 'upi'
                                ? 'Direct UPI (GPay/PhonePe)'
                                : 'Cash on Delivery (COD)'}
                            </span>
                          </div>
                          {order.transactionId && (
                            <div className="flex justify-between font-mono text-[10px]">
                              <span className="text-[#8a7174]">Txn Ref:</span>
                              <span className="text-[#1c1b1b] truncate max-w-[140px]" title={order.transactionId}>
                                {order.transactionId}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Controls for Admin */}
                      <div className="space-y-2 pt-3 border-t border-[#debfc2]/40">
                        {/* Quick Toggle Payment Button */}
                        <button
                          onClick={() => handleTogglePayment(order.id, order.paymentStatus)}
                          className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs ${
                            isPaid
                              ? 'bg-white border border-amber-300 text-amber-800 hover:bg-amber-50'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>
                            {isPaid
                              ? 'Revert Payment to Pending'
                              : order.paymentMethod === 'cod'
                              ? `✓ Confirm Cash Received (₹${order.total})`
                              : `✓ Confirm UPI Received (₹${order.total})`}
                          </span>
                        </button>

                        {/* Fulfillment Status Select */}
                        <div className="flex items-center gap-1.5">
                          <label className="text-[11px] font-semibold text-[#8a7174] shrink-0">
                            Status:
                          </label>
                          <select
                            value={order.fulfillmentStatus}
                            onChange={(e) =>
                              handleUpdateStatus(order.id, e.target.value as OrderFulfillmentStatus)
                            }
                            className="flex-1 bg-white border border-[#debfc2]/60 rounded-xl px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:border-[#6d0026] text-[#1c1b1b]"
                          >
                            <option value="new">New Order</option>
                            <option value="processing">Processing (Tailoring/Packing)</option>
                            <option value="shipped">Shipped / In Transit</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>

                        {/* Invoice & Delete Buttons */}
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => setSelectedOrderForInvoice(order)}
                            className="flex-1 bg-white hover:bg-[#ede9e8] text-[#574144] border border-[#debfc2]/60 py-1.5 px-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1 transition-all"
                          >
                            <Printer className="w-3.5 h-3.5 text-[#6d0026]" />
                            <span>Print Invoice</span>
                          </button>

                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-1.5 text-[#8a7174] hover:text-[#ba1a1a] hover:bg-[#fed9e2]/30 rounded-xl transition-all"
                            title="Delete Order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Invoice Printable Modal */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 print:p-0 print:shadow-none">
            {/* Modal Header Actions */}
            <div className="flex items-center justify-between pb-4 border-b border-[#debfc2]/40 mb-6 print:hidden">
              <span className="font-display font-bold text-sm text-[#6d0026] flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Tax Invoice Preview
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-[#6d0026] text-white px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-[#8e1b3b]"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print / Save PDF
                </button>
                <button
                  onClick={() => setSelectedOrderForInvoice(null)}
                  className="p-1.5 text-[#8a7174] hover:text-[#1c1b1b] rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Actual Printable Invoice Document */}
            <div id="printable-invoice" className="text-[#1c1b1b]">
              <div className="flex justify-between items-start border-b border-[#debfc2]/60 pb-6">
                <div>
                  <Logo size="md" />
                  <p className="text-xs text-[#574144] mt-2 font-medium">Zevioza Couture & Atelier</p>
                  <p className="text-[11px] text-[#8a7174]">
                    GSTIN: 24AABCS1429E1Z4 • support@zevioza.in
                  </p>
                  <p className="text-[11px] text-[#8a7174]">Surat & Mumbai Heritage Salons</p>
                </div>
                <div className="text-right">
                  <span className="font-display text-lg font-bold text-[#6d0026] block">
                    INVOICE
                  </span>
                  <span className="font-mono text-xs font-semibold text-[#1c1b1b] block">
                    #{selectedOrderForInvoice.id}
                  </span>
                  <span className="text-xs text-[#8a7174] block mt-1">
                    Date: {new Date(selectedOrderForInvoice.createdAt).toLocaleDateString('en-IN')}
                  </span>
                  <span
                    className={`inline-block mt-2 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      selectedOrderForInvoice.paymentStatus === 'paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    Payment: {selectedOrderForInvoice.paymentStatus.toUpperCase()} (
                    {selectedOrderForInvoice.paymentMethod.toUpperCase()})
                  </span>
                </div>
              </div>

              {/* Bill To Info */}
              <div className="py-4 border-b border-[#debfc2]/40 text-xs">
                <span className="font-bold text-[#8a7174] uppercase text-[10px] tracking-wider block mb-1">
                  Billed To / Delivery Destination:
                </span>
                <p className="font-display font-bold text-sm text-[#1c1b1b]">
                  {selectedOrderForInvoice.customer.name}
                </p>
                <p className="text-[#574144] mt-0.5">
                  {selectedOrderForInvoice.customer.address}, {selectedOrderForInvoice.customer.city},{' '}
                  {selectedOrderForInvoice.customer.state} -{' '}
                  {selectedOrderForInvoice.customer.pincode}
                </p>
                <p className="text-[#574144] mt-0.5">
                  Phone: {selectedOrderForInvoice.customer.phone} • Email:{' '}
                  {selectedOrderForInvoice.customer.email}
                </p>
              </div>

              {/* Items Table */}
              <div className="py-4 border-b border-[#debfc2]/40">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-[#debfc2]/60 text-[#8a7174] text-[10px] uppercase font-bold">
                      <th className="pb-2">Description</th>
                      <th className="pb-2 text-center">Qty</th>
                      <th className="pb-2 text-right">Price</th>
                      <th className="pb-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#debfc2]/20">
                    {selectedOrderForInvoice.items.map((item) => (
                      <tr key={item.id} className="py-2.5">
                        <td className="py-2.5">
                          <p className="font-medium text-[#1c1b1b]">{item.name}</p>
                          <p className="text-[10px] text-[#8a7174]">
                            {item.selectedColor ? `Shade: ${item.selectedColor} ` : ''}
                            {item.selectedSize ? `• Size: ${item.selectedSize}` : ''}
                            {item.customStitching ? ' • Custom Stitching' : ''}
                          </p>
                        </td>
                        <td className="py-2.5 text-center">{item.quantity}</td>
                        <td className="py-2.5 text-right">{formatPrice(item.price, currency)}</td>
                        <td className="py-2.5 text-right font-medium">
                          {formatPrice(item.price * item.quantity, currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="py-4 flex justify-end">
                <div className="w-64 space-y-1.5 text-xs text-[#574144]">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatPrice(selectedOrderForInvoice.subtotal, currency)}</span>
                  </div>
                  {selectedOrderForInvoice.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Privilege Discount:</span>
                      <span>-{formatPrice(selectedOrderForInvoice.discountAmount, currency)}</span>
                    </div>
                  )}
                  {selectedOrderForInvoice.giftWrapAmount > 0 && (
                    <div className="flex justify-between">
                      <span>Gift Wrap Packaging:</span>
                      <span>+{formatPrice(selectedOrderForInvoice.giftWrapAmount, currency)}</span>
                    </div>
                  )}
                  <div className="border-t border-[#debfc2]/60 pt-2 flex justify-between font-bold text-sm text-[#1c1b1b]">
                    <span>Total Invoice Value:</span>
                    <span className="text-[#6d0026]">
                      {formatPrice(selectedOrderForInvoice.total, currency)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer Stamp */}
              <div className="pt-6 border-t border-[#debfc2]/30 text-center text-[11px] text-[#8a7174]">
                <p>Thank you for choosing Zevioza for your celebrations.</p>
                <p className="mt-0.5 font-medium">This is a system-generated boutique tax invoice.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Manual Order Modal */}
      {isManualOrderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#debfc2]/40 mb-5">
              <h3 className="font-display font-bold text-base text-[#1c1b1b] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#6d0026]" />
                Create Manual Boutique Order
              </h3>
              <button
                onClick={() => setIsManualOrderModalOpen(false)}
                className="p-1.5 text-[#8a7174] hover:text-[#1c1b1b] rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualOrder} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#574144] mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={manualOrder.customerName}
                    onChange={(e) => setManualOrder({ ...manualOrder, customerName: e.target.value })}
                    placeholder="e.g. Shalini Singhania"
                    className="w-full px-3 py-2 bg-[#f6f3f2] rounded-xl border border-[#debfc2]/60 focus:outline-none focus:border-[#6d0026]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#574144] mb-1">Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    value={manualOrder.phone}
                    onChange={(e) => setManualOrder({ ...manualOrder, phone: e.target.value })}
                    placeholder="+91 98234 56789"
                    className="w-full px-3 py-2 bg-[#f6f3f2] rounded-xl border border-[#debfc2]/60 focus:outline-none focus:border-[#6d0026]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#574144] mb-1">Delivery Address *</label>
                <input
                  type="text"
                  required
                  value={manualOrder.address}
                  onChange={(e) => setManualOrder({ ...manualOrder, address: e.target.value })}
                  placeholder="Street / Flat / Colony"
                  className="w-full px-3 py-2 bg-[#f6f3f2] rounded-xl border border-[#debfc2]/60 focus:outline-none focus:border-[#6d0026]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#574144] mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={manualOrder.city}
                    onChange={(e) => setManualOrder({ ...manualOrder, city: e.target.value })}
                    placeholder="e.g. Surat"
                    className="w-full px-3 py-2 bg-[#f6f3f2] rounded-xl border border-[#debfc2]/60 focus:outline-none focus:border-[#6d0026]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#574144] mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={manualOrder.state}
                    onChange={(e) => setManualOrder({ ...manualOrder, state: e.target.value })}
                    placeholder="e.g. Gujarat"
                    className="w-full px-3 py-2 bg-[#f6f3f2] rounded-xl border border-[#debfc2]/60 focus:outline-none focus:border-[#6d0026]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#574144] mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={manualOrder.pincode}
                    onChange={(e) => setManualOrder({ ...manualOrder, pincode: e.target.value })}
                    placeholder="395007"
                    className="w-full px-3 py-2 bg-[#f6f3f2] rounded-xl border border-[#debfc2]/60 focus:outline-none focus:border-[#6d0026]"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-[#debfc2]/40">
                <label className="block font-semibold text-[#574144] mb-1">Product Description</label>
                <input
                  type="text"
                  required
                  value={manualOrder.productName}
                  onChange={(e) => setManualOrder({ ...manualOrder, productName: e.target.value })}
                  className="w-full px-3 py-2 bg-[#f6f3f2] rounded-xl border border-[#debfc2]/60 focus:outline-none focus:border-[#6d0026]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#574144] mb-1">Size</label>
                  <input
                    type="text"
                    value={manualOrder.size}
                    onChange={(e) => setManualOrder({ ...manualOrder, size: e.target.value })}
                    placeholder="M / Free Size"
                    className="w-full px-3 py-2 bg-[#f6f3f2] rounded-xl border border-[#debfc2]/60 focus:outline-none focus:border-[#6d0026]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#574144] mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={manualOrder.price}
                    onChange={(e) =>
                      setManualOrder({ ...manualOrder, price: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-[#f6f3f2] rounded-xl border border-[#debfc2]/60 focus:outline-none focus:border-[#6d0026]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#574144] mb-1">Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={manualOrder.quantity}
                    onChange={(e) =>
                      setManualOrder({ ...manualOrder, quantity: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-[#f6f3f2] rounded-xl border border-[#debfc2]/60 focus:outline-none focus:border-[#6d0026]"
                  />
                </div>
              </div>

              {/* Payment Info */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#debfc2]/40">
                <div>
                  <label className="block font-semibold text-[#574144] mb-1">Payment Method</label>
                  <select
                    value={manualOrder.paymentMethod}
                    onChange={(e) =>
                      setManualOrder({
                        ...manualOrder,
                        paymentMethod: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 bg-[#f6f3f2] rounded-xl border border-[#debfc2]/60 focus:outline-none"
                  >
                    <option value="upi">UPI (GPay/PhonePe/Paytm)</option>
                    <option value="razorpay">Card / NetBanking</option>
                    <option value="cod">Cash on Delivery (COD)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#574144] mb-1">Payment Status</label>
                  <select
                    value={manualOrder.paymentStatus}
                    onChange={(e) =>
                      setManualOrder({
                        ...manualOrder,
                        paymentStatus: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 bg-[#f6f3f2] rounded-xl border border-[#debfc2]/60 focus:outline-none"
                  >
                    <option value="paid">✅ Paid (Payment Received)</option>
                    <option value="pending">⏳ Pending (To Collect)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsManualOrderModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#8a7174] hover:text-[#1c1b1b]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#6d0026] hover:bg-[#8e1b3b] text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  Create & Save Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Send WhatsApp to Customer Modal */}
      {whatsAppModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl relative my-8 border border-[#debfc2]">
            <div className="flex items-start justify-between pb-3 border-b border-[#debfc2]/40 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-[#1c1b1b]">
                    Send Order Message to Customer
                  </h3>
                  <p className="text-xs text-[#8a7174]">
                    Order #{whatsAppModalOrder.id} • {whatsAppModalOrder.customer.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setWhatsAppModalOrder(null)}
                className="p-1.5 text-[#8a7174] hover:text-[#1c1b1b] rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendWhatsAppToCustomer} className="space-y-4 text-xs">
              {/* Recipient Phone Input */}
              <div className="bg-[#fbf9f8] p-3.5 rounded-2xl border border-[#debfc2]/50 space-y-2">
                <label className="block font-bold text-[#1c1b1b]">
                  Customer WhatsApp Number (Recipient) *
                </label>
                <div className="flex items-center gap-2">
                  <span className="bg-white border border-[#debfc2]/60 px-3 py-2 rounded-xl text-xs font-bold text-[#574144]">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    required
                    value={whatsAppTargetPhone}
                    onChange={(e) => {
                      setWhatsAppTargetPhone(e.target.value);
                      setWhatsAppPhoneError('');
                    }}
                    placeholder="Customer 10-digit mobile number enter karein"
                    className="flex-1 px-3 py-2 bg-white rounded-xl border border-[#debfc2]/60 focus:outline-none focus:border-emerald-600 font-medium text-xs text-[#1c1b1b]"
                  />
                </div>

                {whatsAppTargetPhone.replace(/\D/g, '').endsWith('8238023498') ? (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-[11px] flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>⚠️ Dhyan Dein:</strong> Yeh number aapka apna store number (82380 23498) hai! Kripya yahan customer ka actual WhatsApp mobile number likhein taaki message customer ke phone par jaye, aapke nahi.
                    </div>
                  </div>
                ) : null}

                {whatsAppPhoneError && (
                  <p className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{whatsAppPhoneError}</span>
                  </p>
                )}

                <p className="text-[11px] text-[#8a7174]">
                  💡 Customer ka mobile number likhkar send karne par yeh number is order mein permanently save ho jayega.
                </p>
              </div>

              {/* Message Type Selector */}
              <div>
                <label className="block font-semibold text-[#574144] mb-1.5">Choose Message Template</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setWhatsAppMessageType('confirmation')}
                    className={`p-2 rounded-xl border text-[11px] font-bold text-center transition-all cursor-pointer ${
                      whatsAppMessageType === 'confirmation'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900'
                        : 'bg-white border-[#debfc2]/60 text-[#574144] hover:bg-[#f6f3f2]'
                    }`}
                  >
                    🎉 Order Confirmed
                  </button>
                  <button
                    type="button"
                    onClick={() => setWhatsAppMessageType('dispatch')}
                    className={`p-2 rounded-xl border text-[11px] font-bold text-center transition-all cursor-pointer ${
                      whatsAppMessageType === 'dispatch'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900'
                        : 'bg-white border-[#debfc2]/60 text-[#574144] hover:bg-[#f6f3f2]'
                    }`}
                  >
                    🚚 Dispatched & AWB
                  </button>
                  <button
                    type="button"
                    onClick={() => setWhatsAppMessageType('cod_pending')}
                    className={`p-2 rounded-xl border text-[11px] font-bold text-center transition-all cursor-pointer ${
                      whatsAppMessageType === 'cod_pending'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900'
                        : 'bg-white border-[#debfc2]/60 text-[#574144] hover:bg-[#f6f3f2]'
                    }`}
                  >
                    📦 COD Verification
                  </button>
                  <button
                    type="button"
                    onClick={() => setWhatsAppMessageType('custom')}
                    className={`p-2 rounded-xl border text-[11px] font-bold text-center transition-all cursor-pointer ${
                      whatsAppMessageType === 'custom'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900'
                        : 'bg-white border-[#debfc2]/60 text-[#574144] hover:bg-[#f6f3f2]'
                    }`}
                  >
                    ✍️ Custom Msg
                  </button>
                </div>
              </div>

              {/* Custom Message Field */}
              {whatsAppMessageType === 'custom' && (
                <div>
                  <label className="block font-semibold text-[#574144] mb-1">Custom Message Text</label>
                  <textarea
                    rows={4}
                    value={whatsAppCustomText}
                    onChange={(e) => setWhatsAppCustomText(e.target.value)}
                    placeholder="Customer ke liye custom message likhein..."
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#debfc2]/60 focus:outline-none focus:border-emerald-600 text-xs text-[#1c1b1b]"
                  />
                </div>
              )}

              {/* Live Preview of WhatsApp Message */}
              <div>
                <label className="block font-semibold text-[#574144] mb-1">
                  Message Preview (Customer ke WhatsApp par yeh message jayega):
                </label>
                <div className="bg-[#e7fce3] border border-emerald-200 p-3.5 rounded-2xl text-[11px] text-[#1c1b1b] whitespace-pre-wrap font-sans max-h-48 overflow-y-auto shadow-inner leading-relaxed">
                  {getFormattedWhatsAppMessage(whatsAppModalOrder, whatsAppMessageType)}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#debfc2]/40">
                <button
                  type="button"
                  onClick={() => setWhatsAppModalOrder(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#8a7174] hover:text-[#1c1b1b] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Open WhatsApp & Send to Customer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Customer Contact Info Modal */}
      {editingCustomerOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative my-8 border border-[#debfc2]">
            <div className="flex items-center justify-between pb-3 border-b border-[#debfc2]/40 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#fed9e2] text-[#6d0026] flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-[#1c1b1b]">
                    Edit Customer Details
                  </h3>
                  <p className="text-xs text-[#8a7174]">Order #{editingCustomerOrder.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingCustomerOrder(null)}
                className="p-1.5 text-[#8a7174] hover:text-[#1c1b1b] rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomerDetails} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#574144] mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={editCustomerForm.name}
                  onChange={(e) => setEditCustomerForm({ ...editCustomerForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#f6f3f2] rounded-xl border border-[#debfc2]/60 focus:outline-none focus:border-[#6d0026]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#574144] mb-1">Customer Mobile / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={editCustomerForm.phone}
                    onChange={(e) => setEditCustomerForm({ ...editCustomerForm, phone: e.target.value })}
                    placeholder="e.g. +91 98250 12345"
                    className="w-full px-3 py-2 bg-[#f6f3f2] rounded-xl border border-[#debfc2]/60 focus:outline-none focus:border-[#6d0026]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#574144] mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editCustomerForm.email}
                    onChange={(e) => setEditCustomerForm({ ...editCustomerForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-[#f6f3f2] rounded-xl border border-[#debfc2]/60 focus:outline-none focus:border-[#6d0026]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#574144] mb-1">Delivery Address *</label>
                <input
                  type="text"
                  required
                  value={editCustomerForm.address}
                  onChange={(e) => setEditCustomerForm({ ...editCustomerForm, address: e.target.value })}
                  placeholder="House / Flat / Street / Area"
                  className="w-full px-3 py-2 bg-[#f6f3f2] rounded-xl border border-[#debfc2]/60 focus:outline-none focus:border-[#6d0026]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-[#574144] mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={editCustomerForm.city}
                    onChange={(e) => setEditCustomerForm({ ...editCustomerForm, city: e.target.value })}
                    className="w-full px-3 py-2 bg-[#f6f3f2] rounded-xl border border-[#debfc2]/60 focus:outline-none focus:border-[#6d0026]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#574144] mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={editCustomerForm.state}
                    onChange={(e) => setEditCustomerForm({ ...editCustomerForm, state: e.target.value })}
                    className="w-full px-3 py-2 bg-[#f6f3f2] rounded-xl border border-[#debfc2]/60 focus:outline-none focus:border-[#6d0026]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#574144] mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={editCustomerForm.pincode}
                    onChange={(e) => setEditCustomerForm({ ...editCustomerForm, pincode: e.target.value })}
                    className="w-full px-3 py-2 bg-[#f6f3f2] rounded-xl border border-[#debfc2]/60 focus:outline-none focus:border-[#6d0026]"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#debfc2]/40">
                <button
                  type="button"
                  onClick={() => setEditingCustomerOrder(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#8a7174] hover:text-[#1c1b1b] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#6d0026] hover:bg-[#8e1b3b] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Save Customer Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change PIN Modal */}
      {isChangePinModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#debfc2] relative">
            <button
              onClick={() => {
                setIsChangePinModalOpen(false);
                setPinChangeError('');
              }}
              className="absolute top-5 right-5 text-[#8a7174] hover:text-[#1c1b1b] p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-[#fed9e2] text-[#6d0026] flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-[#1c1b1b]">Change Security PIN</h3>
                <p className="text-xs text-[#8a7174]">Update master access code for {OWNER_EMAIL}</p>
              </div>
            </div>

            <form onSubmit={handleChangePin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#574144] mb-1">Current PIN / Password *</label>
                <input
                  type="password"
                  required
                  value={currentPinVerify}
                  onChange={(e) => setCurrentPinVerify(e.target.value)}
                  placeholder="Enter current PIN (default: 9825)"
                  className="w-full px-3.5 py-2.5 bg-[#f6f3f2] focus:bg-white rounded-xl border border-[#debfc2]/70 focus:border-[#6d0026] text-sm outline-none transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#574144] mb-1">New PIN / Password *</label>
                <input
                  type="password"
                  required
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value)}
                  placeholder="Enter new 4+ digit PIN or password"
                  className="w-full px-3.5 py-2.5 bg-[#f6f3f2] focus:bg-white rounded-xl border border-[#debfc2]/70 focus:border-[#6d0026] text-sm outline-none transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#574144] mb-1">Confirm New PIN *</label>
                <input
                  type="password"
                  required
                  value={confirmPinInput}
                  onChange={(e) => setConfirmPinInput(e.target.value)}
                  placeholder="Re-enter new PIN"
                  className="w-full px-3.5 py-2.5 bg-[#f6f3f2] focus:bg-white rounded-xl border border-[#debfc2]/70 focus:border-[#6d0026] text-sm outline-none transition-all font-mono"
                />
              </div>

              {pinChangeError && (
                <p className="text-xs font-semibold text-rose-600 flex items-center gap-1.5 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {pinChangeError}
                </p>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsChangePinModalOpen(false);
                    setPinChangeError('');
                  }}
                  className="px-4 py-2.5 text-xs font-semibold text-[#8a7174] hover:text-[#1c1b1b]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#6d0026] hover:bg-[#8e1b3b] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  Save New Security PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Merged Advertisement Reel Modal */}
      {isAdVideoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="bg-[#1c1b1b] text-white rounded-3xl max-w-4xl w-full p-5 sm:p-8 shadow-2xl border border-amber-500/30 relative my-auto">
            <button
              onClick={() => setIsAdVideoModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-[#6d0026] text-white flex items-center justify-center shadow-lg">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-white flex items-center gap-2">
                    Zevioza Studio Ad Campaigns
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wide">
                      HD Ready
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-400">Cinematic 9:16 Vertical Videos with Sitar Fusion Music • Instagram, Meta & WhatsApp Ads</p>
                </div>
              </div>

              {adVideoTab === 'viral' ? (
                <a
                  href="/zevioza_viral_ad_2026.mp4"
                  download="Zevioza_Viral_Model_Runway_Ad.mp4"
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Viral Model Reel (.MP4)</span>
                </a>
              ) : adVideoTab === 'collection' ? (
                <a
                  href="/zevioza_collection_ad.mp4"
                  download="Zevioza_Madhu_Lehenga_Ad_Reel.mp4"
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Collection Reel (.MP4)</span>
                </a>
              ) : (
                <a
                  href="/zevioza_ad_final.mp4"
                  download="Zevioza_Saree_Voiceover_Reel.mp4"
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Saree Reel (.MP4)</span>
                </a>
              )}
            </div>

            {/* Campaign Selector Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6 bg-white/5 p-1.5 rounded-2xl border border-white/10">
              <button
                type="button"
                onClick={() => setAdVideoTab('viral')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  adVideoTab === 'viral'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 shadow-md'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Viral Model Runway Reel (14.7s)</span>
                <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wide">Hot</span>
              </button>

              <button
                type="button"
                onClick={() => setAdVideoTab('collection')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  adVideoTab === 'collection'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 shadow-md'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Collection Showcase (19s)</span>
              </button>

              <button
                type="button"
                onClick={() => setAdVideoTab('saree')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  adVideoTab === 'saree'
                    ? 'bg-gradient-to-r from-[#6d0026] to-[#a82046] text-white shadow-md'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Classic Saree Walk (10.2s)</span>
              </button>
            </div>

            {/* Tab 0: Viral Model Runway Ad (Merged 4 Videos) */}
            {adVideoTab === 'viral' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-5 flex flex-col items-center">
                  <div className="relative w-full max-w-[280px] sm:max-w-[300px] aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/50">
                    <video
                      key="viral-model-video"
                      src="/zevioza_viral_ad_2026.mp4"
                      controls
                      autoPlay
                      playsInline
                      loop
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-[11px] text-amber-300/80 mt-2 text-center font-medium">
                    14.7s • 720x1280 (9:16) • Clean Model Showcase + Chill Boutique Luxury BGM
                  </p>
                </div>

                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-2.5">
                    <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Refined Viral Edits & Visual Enhancements
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="flex items-start gap-2 bg-black/30 p-2.5 rounded-xl border border-white/5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-white block">100% Clean & Aesthetic Model Showcase</span>
                          <span className="text-neutral-400 text-[11px]">No heavy black boxes blocking the model or outfits. Pure cinematic flow with color grading.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 bg-black/30 p-2.5 rounded-xl border border-white/5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-white block">Chill Luxury Boutique BGM</span>
                          <span className="text-neutral-400 text-[11px]">Soothing Rhodes keys, mellow warm bass, soft clicks. Zero loud or jarring tones — pleasant & premium.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 bg-black/30 p-2.5 rounded-xl border border-white/5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-white block">Minimal Mid-Video Hallmark</span>
                          <span className="text-neutral-400 text-[11px]">Subtle luxury floating badge: ✦ WWW.ZEVIOZA.IN ✦ placed elegantly without hiding the dress.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 bg-black/30 p-2.5 rounded-xl border border-white/5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-white block">Dedicated Outro Screen at Video End</span>
                          <span className="text-neutral-400 text-[11px]">Special Festive Price Drop, UP TO 60% OFF, Code ZEVIOZA10, & Shop Now CTA appear only at the end.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ready-to-use Ad Copy */}
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                        High-Converting Instagram Caption
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          const copyText = `🔥 SPECIAL FESTIVE PRICE DROP! ✨\nLook royal this season with Zevioza's Designer Couture Collection!\n\n👑 Direct from Surat's Master Artisans\n👗 Premium Georgette Twirl Gowns & Crimson Maroon Anarkalis\n🎉 FLAT 50% OFF + Extra 10% OFF with Code: ZEVIOZA10\n🚚 Free Express Shipping Across India\n💵 Cash on Delivery (COD) Available\n\n👉 Shop Now directly at: www.zevioza.in\n(Hurry, limited festive pieces in stock!)\n\n#Zevioza #FestiveFashion #IndianEthnicWear #AnarkaliSuit #DesignerGown #FestiveSale #SuratCouture #BridalWear`;
                          navigator.clipboard.writeText(copyText);
                          showToast('Viral ad caption copied to clipboard!');
                        }}
                        className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20 cursor-pointer"
                      >
                        Copy Caption
                      </button>
                    </div>
                    <pre className="text-[11px] leading-relaxed text-neutral-300 bg-black/40 p-3 rounded-xl border border-white/5 font-sans whitespace-pre-wrap select-all">
{`🔥 SPECIAL FESTIVE PRICE DROP! ✨
Look royal this season with Zevioza's Designer Couture Collection!

👑 Direct from Surat's Master Artisans
👗 Premium Georgette Twirl Gowns & Crimson Maroon Anarkalis
🎉 FLAT 50% OFF + Extra 10% OFF with Code: ZEVIOZA10
🚚 Free Express Shipping Across India
💵 Cash on Delivery (COD) Available

👉 Shop Now directly at: www.zevioza.in
(Hurry, limited festive pieces in stock!)

#Zevioza #FestiveFashion #IndianEthnicWear #AnarkaliSuit #DesignerGown #FestiveSale #SuratCouture #BridalWear`}
                    </pre>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href="/zevioza_viral_ad_2026.mp4"
                      download="Zevioza_Viral_Model_Runway_Ad.mp4"
                      className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
                    >
                      <Download className="w-4 h-4" />
                      Download Viral Reel (9.7 MB MP4)
                    </a>
                    <button
                      type="button"
                      onClick={() => setIsAdVideoModalOpen(false)}
                      className="px-5 py-3 bg-white/10 hover:bg-white/20 text-neutral-300 rounded-xl text-xs font-semibold transition-all"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 1: Collection Reel (Madhu + Stitched Lehenga) */}
            {adVideoTab === 'collection' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-5 flex flex-col items-center">
                  <div className="relative w-full max-w-[280px] sm:max-w-[300px] aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/40">
                    <video
                      key="collection-video"
                      src="/zevioza_collection_ad.mp4"
                      controls
                      autoPlay
                      playsInline
                      loop
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-[11px] text-amber-300/80 mt-2 text-center font-medium">
                    19.0s • 720x1280 (9:16) • Studio Sitar Fusion Beat
                  </p>
                </div>

                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-2.5">
                    <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Reel Features & Cinematic Directing
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="flex items-start gap-2 bg-black/30 p-2.5 rounded-xl border border-white/5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-white block">Madhu Designer Series</span>
                          <span className="text-neutral-400 text-[11px]">Dynamic slow pan-down & zoom-in on intricate mirror and thread embroidery.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 bg-black/30 p-2.5 rounded-xl border border-white/5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-white block">Pista Green Lehenga</span>
                          <span className="text-neutral-400 text-[11px]">Bridal heavy flare showcase with close-up heritage border detailing.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 bg-black/30 p-2.5 rounded-xl border border-white/5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-white block">Smooth Camera Dissolves</span>
                          <span className="text-neutral-400 text-[11px]">8 motion crossfades mimicking high-end fashion runway transitions.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 bg-black/30 p-2.5 rounded-xl border border-white/5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-white block">Attractive Fusion Music</span>
                          <span className="text-neutral-400 text-[11px]">Upbeat sitar + percussion beat looped and EQ-balanced to captivate buyers.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ready-to-use Ad Copy */}
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                        Instagram / Meta Ad Caption
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          const copyText = `✨ Elevate Your Festive Wardrobe with Zevioza ✨\nFeaturing the all-new Madhu Designer Ensemble & Stitched Pista Green Bridal Lehenga!\n\n👑 Master Surat Handcrafting\n👗 Ready-to-Wear Luxurious Flare\n🚚 Free All-India Express Delivery\n💵 Cash on Delivery Available\n\n👉 Tap link in bio to shop now: www.zevioza.in\n🔥 Special Festive Offer: Use code ZEVIOZA10 for 10% OFF!\n\n#Zevioza #StitchedLehenga #MadhuCollection #IndianEthnicWear #FestiveOutfit #SuratTextiles`;
                          navigator.clipboard.writeText(copyText);
                          showToast('Collection ad caption copied to clipboard!');
                        }}
                        className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20 cursor-pointer"
                      >
                        Copy Caption
                      </button>
                    </div>
                    <pre className="text-[11px] leading-relaxed text-neutral-300 bg-black/40 p-3 rounded-xl border border-white/5 font-sans whitespace-pre-wrap select-all">
{`✨ Elevate Your Festive Wardrobe with Zevioza ✨
Featuring the all-new Madhu Designer Ensemble & Stitched Pista Green Bridal Lehenga!

👑 Master Surat Handcrafting
👗 Ready-to-Wear Luxurious Flare
🚚 Free All-India Express Delivery
💵 Cash on Delivery Available

👉 Tap link in bio to shop now: www.zevioza.in
🔥 Special Festive Offer: Use code ZEVIOZA10 for 10% OFF!

#Zevioza #StitchedLehenga #MadhuCollection #IndianEthnicWear #FestiveOutfit #SuratTextiles`}
                    </pre>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href="/zevioza_collection_ad.mp4"
                      download="Zevioza_Madhu_Lehenga_Ad_Reel.mp4"
                      className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
                    >
                      <Download className="w-4 h-4" />
                      Download Collection Video (4.7 MB MP4)
                    </a>
                    <button
                      type="button"
                      onClick={() => setIsAdVideoModalOpen(false)}
                      className="px-5 py-3 bg-white/10 hover:bg-white/20 text-neutral-300 rounded-xl text-xs font-semibold transition-all"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Saree Walk Reel (Voiceover + Sitar BGM) */}
            {adVideoTab === 'saree' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-5 flex flex-col items-center">
                  <div className="relative w-full max-w-[280px] sm:max-w-[300px] aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10">
                    <video
                      key="saree-video"
                      src="/zevioza_ad_final.mp4"
                      controls
                      autoPlay
                      playsInline
                      loop
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-2 text-center">
                    10.2s • Dual-layer audio (Hindi Voiceover + Sitar Fusion BGM)
                  </p>
                </div>

                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-2.5">
                    <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Key Highlights
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="flex items-start gap-2 bg-black/30 p-2.5 rounded-xl border border-white/5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-white block">No "Mujeero" Watermarks</span>
                          <span className="text-neutral-400 text-[11px]">Foreign watermarks completely removed.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 bg-black/30 p-2.5 rounded-xl border border-white/5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-white block">Full Hindi Voiceover Sync</span>
                          <span className="text-neutral-400 text-[11px]">Words align precisely with model poses and website CTA.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href="/zevioza_ad_final.mp4"
                      download="Zevioza_Official_Ad_Reel.mp4"
                      className="flex-1 bg-[#6d0026] hover:bg-[#8e1b3b] text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
                    >
                      <Download className="w-4 h-4" />
                      Download Saree Video (4.3 MB MP4)
                    </a>
                    <button
                      type="button"
                      onClick={() => setIsAdVideoModalOpen(false)}
                      className="px-5 py-3 bg-white/10 hover:bg-white/20 text-neutral-300 rounded-xl text-xs font-semibold transition-all"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
