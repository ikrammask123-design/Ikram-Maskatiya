import React, { useState, useEffect } from 'react';
import {
  User,
  Heart,
  Package,
  Sparkles,
  Scissors,
  ShoppingBag,
  Trash2,
  ChevronRight,
  Truck,
  LogOut,
  Plus,
  MapPin,
  Edit3,
  Phone,
  Mail,
  ArrowRight,
  ShieldCheck,
  Check,
  AlertCircle,
  Clock,
  Ruler,
  ExternalLink,
} from 'lucide-react';
import { Product, Currency, StoreOrder, UserAccount, UserAddress } from '../types';
import { formatPrice } from './ProductCard';
import {
  getCurrentUser,
  setCurrentUser,
  loginUser,
  registerUser,
  logoutUser,
  updateUserProfile,
  addUserAddress,
  deleteUserAddress,
  getUserOrders,
  AUTH_CHANGE_EVENT,
} from '../utils/authStorage';
import { loginWithGoogle } from '../utils/firebaseAuth';
import { getStoredOrders } from '../utils/orderStorage';

interface AccountViewProps {
  wishlistedProducts: Product[];
  currency: Currency;
  onRemoveWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onOpenStylistModal: () => void;
  onOpenTrackOrder?: (orderId?: string) => void;
  onShopNow?: () => void;
}

export const AccountView: React.FC<AccountViewProps> = ({
  wishlistedProducts,
  currency,
  onRemoveWishlist,
  onAddToCart,
  onSelectProduct,
  onOpenStylistModal,
  onOpenTrackOrder,
  onShopNow,
}) => {
  const [currentUser, setCurrentUserState] = useState<UserAccount | null>(getCurrentUser());
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile' | 'styling'>('orders');
  const [ordersList, setOrdersList] = useState<StoreOrder[]>([]);

  // Auth form state (for logged out users)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loginInput, setLoginInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Register form fields
  const [registerForm, setRegisterForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'Gujarat',
    pincode: '',
  });

  // Profile Edit modal/state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfileName, setEditProfileName] = useState('');
  const [editProfilePhone, setEditProfilePhone] = useState('');
  const [editProfileEmail, setEditProfileEmail] = useState('');

  // Add Address Modal state
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState({
    tag: 'Home',
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: true,
  });

  // Measurements state
  const [measurements, setMeasurements] = useState({
    bust: '34',
    waist: '28',
    hip: '38',
    shoulder: '14.5',
    blouseLength: '14.5',
  });
  const [isSavingMeasurements, setIsSavingMeasurements] = useState(false);
  const [measurementsSavedMsg, setMeasurementsSavedMsg] = useState(false);

  // Sync user state and user-specific orders
  useEffect(() => {
    const syncUser = () => {
      const user = getCurrentUser();
      setCurrentUserState(user);
      if (user) {
        setOrdersList(getUserOrders(user));
        if (user.savedMeasurements) {
          setMeasurements((prev) => ({ ...prev, ...user.savedMeasurements }));
        }
      } else {
        setOrdersList([]);
      }
    };

    syncUser();

    const handleAuthChange = () => syncUser();
    const handleOrderUpdate = () => {
      const u = getCurrentUser();
      if (u) {
        setOrdersList(getUserOrders(u));
      }
    };

    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    window.addEventListener('zevioza_order_updated', handleOrderUpdate);

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
      window.removeEventListener('zevioza_order_updated', handleOrderUpdate);
    };
  }, []);

  // Handle Google Dual-Auth
  const handleGoogleAuth = async () => {
    setAuthError('');
    setAuthSuccess('');
    setIsGoogleLoading(true);

    try {
      const res = await loginWithGoogle();
      if (res.success && res.user) {
        setCurrentUserState(res.user);
        setOrdersList(getUserOrders(res.user));
        setAuthSuccess(`Welcome, ${res.user.name}! Connected with Google.`);
      } else {
        setAuthError(res.error || 'Google authentication could not be completed.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Google authentication error.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Handle Login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    const res = loginUser(loginInput);
    if (res.success && res.user) {
      setCurrentUserState(res.user);
      setOrdersList(getUserOrders(res.user));
      setAuthSuccess(`Welcome back, ${res.user.name}!`);
      setLoginInput('');
    } else {
      setAuthError(res.error || 'Could not find an account. Please create an account below.');
    }
  };

  // Handle Register submission
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!registerForm.name.trim()) {
      setAuthError('Please enter your full name');
      return;
    }
    const cleanPhone = registerForm.phone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length < 10) {
      setAuthError('Please enter a valid 10-digit mobile number');
      return;
    }

    const res = registerUser(registerForm);
    if (res.success && res.user) {
      setCurrentUserState(res.user);
      setOrdersList(getUserOrders(res.user));
      setAuthSuccess(`Account created successfully! Welcome to Zevioza, ${res.user.name}.`);
    } else {
      setAuthError(res.error || 'Failed to create account. Please try again.');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    logoutUser();
    setCurrentUserState(null);
    setOrdersList([]);
    setActiveTab('orders');
    setAuthMode('login');
    setAuthError('');
    setAuthSuccess('');
  };

  // Profile update save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const updated = updateUserProfile({
      name: editProfileName.trim() || currentUser.name,
      phone: editProfilePhone.trim() || currentUser.phone,
      email: editProfileEmail.trim() || currentUser.email,
    });
    if (updated) {
      setCurrentUserState(updated);
      setIsEditingProfile(false);
    }
  };

  // Save new address
  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const updated = addUserAddress({
      ...newAddressForm,
      name: newAddressForm.name.trim() || currentUser.name,
      phone: newAddressForm.phone.trim() || currentUser.phone,
    });
    if (updated) {
      setCurrentUserState(updated);
      setIsAddingAddress(false);
      setNewAddressForm({
        tag: 'Home',
        name: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false,
      });
    }
  };

  // Save measurements
  const handleSaveMeasurements = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingMeasurements(true);
    updateUserProfile({ savedMeasurements: measurements });
    setTimeout(() => {
      setIsSavingMeasurements(false);
      setMeasurementsSavedMsg(true);
      setTimeout(() => setMeasurementsSavedMsg(false), 3000);
    }, 400);
  };

  const getUserInitials = (name: string): string => {
    if (!name) return 'Z';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // ==========================================
  // VIEW: LOGGED OUT (SIGN IN / REGISTER VIEW)
  // ==========================================
  if (!currentUser) {
    return (
      <div id="account-login-page" className="py-8 md:py-16 px-4 sm:px-6 max-w-xl mx-auto">
        <div className="bg-white rounded-3xl border border-[#debfc2]/60 shadow-xl overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#ffd9dd]/70 via-[#fed9e2]/50 to-[#fcf9f8] p-6 sm:p-8 text-center border-b border-[#debfc2]/40">
            <div className="w-14 h-14 rounded-2xl bg-[#6d0026] text-[#fed9e2] flex items-center justify-center mx-auto mb-3 shadow-md">
              <User className="w-7 h-7" />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1c1b1b]">
              {authMode === 'login' ? 'Sign In to Your Account' : 'Create Your Boutique Account'}
            </h2>
            <p className="text-xs sm:text-sm text-[#574144] mt-1.5 max-w-sm mx-auto">
              {authMode === 'login'
                ? 'Access your orders, live courier tracking, saved addresses, and bridal wishlist.'
                : 'Join Zevioza to enjoy personalized couturier styling, instant order tracking, and member benefits.'}
            </p>

            {/* Toggle Switch */}
            <div className="mt-6 inline-flex bg-[#f6f3f2] p-1 rounded-2xl border border-[#debfc2]/60">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setAuthError('');
                  setAuthSuccess('');
                }}
                className={`px-6 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-[#6d0026] text-white shadow-xs'
                    : 'text-[#574144] hover:text-[#1c1b1b]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setAuthError('');
                  setAuthSuccess('');
                }}
                className={`px-6 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  authMode === 'register'
                    ? 'bg-[#6d0026] text-white shadow-xs'
                    : 'text-[#574144] hover:text-[#1c1b1b]'
                }`}
              >
                New User / Register
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* Feedback Alerts */}
            {authError && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{authError}</div>
              </div>
            )}
            {authSuccess && (
              <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{authSuccess}</div>
              </div>
            )}

            {/* DUAL AUTH: PROMINENT 'CONTINUE WITH GOOGLE' BUTTON */}
            <div className="mb-6">
              <button
                id="btn-account-google-auth"
                type="button"
                onClick={handleGoogleAuth}
                disabled={isGoogleLoading}
                className="w-full flex items-center justify-center gap-3.5 bg-white hover:bg-[#fcf9f8] text-[#1c1b1b] border-2 border-[#debfc2] hover:border-[#6d0026] py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold tracking-wide transition-all shadow-sm hover:shadow-md cursor-pointer group disabled:opacity-60"
              >
                {isGoogleLoading ? (
                  <div className="w-5 h-5 border-2 border-[#6d0026] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span className="group-hover:text-[#6d0026] transition-colors">
                  {isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google'}
                </span>
              </button>
              <div className="flex items-center justify-center gap-1.5 mt-2 text-[11px] text-[#8a7174]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Dual Authentication • 1-click sync with Firestore & saved addresses</span>
              </div>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center mb-6">
              <div className="border-t border-[#debfc2]/60 w-full" />
              <span className="bg-white px-3 text-[10px] font-bold uppercase tracking-widest text-[#8a7174] shrink-0">
                or use email / phone
              </span>
              <div className="border-t border-[#debfc2]/60 w-full" />
            </div>

            {/* TAB: LOGIN */}
            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#1c1b1b] mb-1.5">
                    Mobile Number or Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={loginInput}
                      onChange={(e) => {
                        setLoginInput(e.target.value);
                        setAuthError('');
                      }}
                      placeholder="e.g. 98250 12345 or yourname@gmail.com"
                      className="w-full px-4 py-3 bg-[#fbf9f8] rounded-xl border border-[#debfc2]/60 focus:outline-none focus:border-[#6d0026] text-xs sm:text-sm text-[#1c1b1b] transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-[#8a7174] mt-1.5">
                    💡 If you already placed an order on Zevioza, simply enter your 10-digit mobile number to view your orders.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#6d0026] hover:bg-[#8e1b3b] text-white py-3.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>Sign In to Account</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* TAB: REGISTER / CREATE ACCOUNT */}
            {authMode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[#1c1b1b] mb-1">
                    Full Name (Aapka Naam) *
                  </label>
                  <input
                    type="text"
                    required
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    placeholder="e.g. Ikram Khan"
                    className="w-full px-3.5 py-2.5 bg-[#fbf9f8] rounded-xl border border-[#debfc2]/60 focus:outline-none focus:border-[#6d0026] text-xs text-[#1c1b1b]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#1c1b1b] mb-1">
                      Mobile Number (WhatsApp) *
                    </label>
                    <div className="flex items-center gap-1.5">
                      <span className="bg-[#f6f3f2] border border-[#debfc2]/60 px-2.5 py-2 rounded-xl text-xs font-bold text-[#574144]">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={registerForm.phone}
                        onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                        placeholder="10-digit mobile number"
                        className="flex-1 px-3 py-2 bg-[#fbf9f8] rounded-xl border border-[#debfc2]/60 focus:outline-none focus:border-[#6d0026] text-xs text-[#1c1b1b]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#1c1b1b] mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      placeholder="e.g. name@domain.com"
                      className="w-full px-3 py-2 bg-[#fbf9f8] rounded-xl border border-[#debfc2]/60 focus:outline-none focus:border-[#6d0026] text-xs text-[#1c1b1b]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#1c1b1b] mb-1">
                    Delivery Address (Ghar / Flat / Area)
                  </label>
                  <input
                    type="text"
                    value={registerForm.address}
                    onChange={(e) => setRegisterForm({ ...registerForm, address: e.target.value })}
                    placeholder="House / Flat No., Society, Landmark"
                    className="w-full px-3 py-2 bg-[#fbf9f8] rounded-xl border border-[#debfc2]/60 focus:outline-none focus:border-[#6d0026] text-xs text-[#1c1b1b]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-bold text-[#1c1b1b] mb-1">City</label>
                    <input
                      type="text"
                      value={registerForm.city}
                      onChange={(e) => setRegisterForm({ ...registerForm, city: e.target.value })}
                      placeholder="e.g. Surat"
                      className="w-full px-3 py-2 bg-[#fbf9f8] rounded-xl border border-[#debfc2]/60 focus:outline-none focus:border-[#6d0026] text-xs text-[#1c1b1b]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#1c1b1b] mb-1">State</label>
                    <input
                      type="text"
                      value={registerForm.state}
                      onChange={(e) => setRegisterForm({ ...registerForm, state: e.target.value })}
                      placeholder="e.g. Gujarat"
                      className="w-full px-3 py-2 bg-[#fbf9f8] rounded-xl border border-[#debfc2]/60 focus:outline-none focus:border-[#6d0026] text-xs text-[#1c1b1b]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#1c1b1b] mb-1">Pincode</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={registerForm.pincode}
                      onChange={(e) => setRegisterForm({ ...registerForm, pincode: e.target.value })}
                      placeholder="6 digits"
                      className="w-full px-3 py-2 bg-[#fbf9f8] rounded-xl border border-[#debfc2]/60 focus:outline-none focus:border-[#6d0026] text-xs text-[#1c1b1b]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#6d0026] hover:bg-[#8e1b3b] text-white py-3.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-3"
                >
                  <span>Create Account & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Guest Order Tracking Shortcut */}
            <div className="mt-6 pt-5 border-t border-[#debfc2]/40 text-center">
              <p className="text-xs text-[#574144] mb-2">
                Have an Order ID from a recent purchase?
              </p>
              {onOpenTrackOrder && (
                <button
                  type="button"
                  onClick={() => onOpenTrackOrder()}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6d0026] hover:underline cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Track Your Order Directly without Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: LOGGED IN USER ACCOUNT
  // ==========================================
  return (
    <div id="account-view-page" className="py-8 md:py-12 px-4 sm:px-6 md:px-12 max-w-4xl mx-auto">
      {/* Dynamic Profile Header Banner with User's Own Details */}
      <div className="bg-gradient-to-r from-[#ffd9dd]/70 via-[#fed9e2]/50 to-[#fcf9f8] p-5 sm:p-8 rounded-3xl border border-[#debfc2]/60 mb-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#6d0026] text-white flex items-center justify-center font-display text-2xl font-bold shadow-md shrink-0">
              {getUserInitials(currentUser.name)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1c1b1b]">
                  {currentUser.name}
                </h2>
                <span className="bg-[#453000] text-[#ffdea5] text-[10px] font-semibold tracking-wider px-2.5 py-0.5 rounded-full uppercase">
                  {currentUser.memberTier || 'Member'}
                </span>
              </div>
              <p className="text-xs text-[#574144] mt-1 flex items-center gap-2 flex-wrap">
                <span>Phone: {currentUser.phone}</span>
                {currentUser.email && <span>• {currentUser.email}</span>}
              </p>
              <p className="text-[11px] text-[#8a7174] mt-0.5">
                Client ID: {currentUser.id} • {currentUser.loyaltyPoints || 100} Artisanal Points
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap justify-start sm:justify-end">
            {onOpenTrackOrder && (
              <button
                onClick={() => onOpenTrackOrder()}
                className="bg-white hover:bg-[#fed9e2]/60 text-[#6d0026] border border-[#debfc2] px-3.5 py-2 rounded-xl text-xs font-bold tracking-wider uppercase shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
                title="Track Live Shipment"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Track Order</span>
              </button>
            )}

            <button
              onClick={onOpenStylistModal}
              className="bg-[#6d0026] text-white px-4 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase hover:bg-[#8e1b3b] shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Stylist</span>
            </button>

            <button
              onClick={handleLogout}
              className="bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 px-3 py-2 rounded-xl text-xs font-semibold tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ml-auto sm:ml-0"
              title="Sign Out of Account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-[#debfc2]/50 gap-4 sm:gap-8 mb-8 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3.5 font-body text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'orders'
              ? 'text-[#6d0026] border-b-2 border-[#6d0026]'
              : 'text-[#574144] hover:text-[#6d0026]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders ({ordersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`pb-3.5 font-body text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'wishlist'
              ? 'text-[#6d0026] border-b-2 border-[#6d0026]'
              : 'text-[#574144] hover:text-[#6d0026]'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Wishlist ({wishlistedProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3.5 font-body text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'profile'
              ? 'text-[#6d0026] border-b-2 border-[#6d0026]'
              : 'text-[#574144] hover:text-[#6d0026]'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile & Addresses</span>
        </button>

        <button
          onClick={() => setActiveTab('styling')}
          className={`pb-3.5 font-body text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'styling'
              ? 'text-[#6d0026] border-b-2 border-[#6d0026]'
              : 'text-[#574144] hover:text-[#6d0026]'
          }`}
        >
          <Scissors className="w-4 h-4" />
          <span>Measurements & Atelier</span>
        </button>
      </div>

      {/* ========================================= */}
      {/* TAB: ORDERS                               */}
      {/* ========================================= */}
      {activeTab === 'orders' && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-white p-4 rounded-2xl border border-[#debfc2]/40 shadow-2xs">
            <div>
              <h4 className="text-xs font-bold text-[#1c1b1b] uppercase tracking-wider">
                My Orders & Live Courier Dispatch
              </h4>
              <p className="text-[11px] text-[#8a7174]">
                Real-time tracking linked to your phone ({currentUser.phone})
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
            <div className="bg-white p-12 rounded-3xl border border-[#debfc2]/40 text-center shadow-xs">
              <Package className="w-12 h-12 text-[#debfc2] mx-auto mb-3" />
              <h3 className="font-display text-base font-bold text-[#1c1b1b] mb-1">
                No Orders Placed Yet
              </h3>
              <p className="text-xs text-[#574144] max-w-md mx-auto mb-5">
                Aapke account mein abhi tak koi order nahi hai. Jab aap Zevioza par koi saree ya kurti order karenge, wo yahan live tracking ke sath show hoga.
              </p>
              {onShopNow && (
                <button
                  onClick={onShopNow}
                  className="bg-[#6d0026] hover:bg-[#8e1b3b] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Start Shopping</span>
                </button>
              )}
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
                  className="bg-white p-5 rounded-2xl border border-[#debfc2]/40 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex gap-4 items-center">
                    <img
                      src={firstItem?.image || '/Gemini_Generated_Image_j96aohj96aohj96a-removebg-preview.png'}
                      alt={firstItem?.name || 'Package'}
                      className="w-16 h-20 object-cover rounded-xl bg-[#f6f3f2] border border-[#debfc2]/30 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-mono text-xs font-bold text-[#1c1b1b] bg-[#fcf9f8] px-2 py-0.5 rounded-md border border-[#debfc2]/50">
                          #{ord.id}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
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
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            ord.paymentStatus === 'paid'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {ord.paymentStatus === 'paid' ? 'Paid ✅' : 'Payment Pending (COD) ⏳'}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-[#1c1b1b]">
                        {firstItem?.name || 'Boutique Outfit'}
                        {ord.items.length > 1 && (
                          <span className="text-[#8a7174] font-normal">
                            {' '}
                            (+{ord.items.length - 1} more items)
                          </span>
                        )}
                      </h4>
                      <span className="text-[11px] text-[#8a7174] block mt-0.5">
                        Ordered on {displayDate} • {formatPrice(ord.total, currency)}
                        {ord.courierPartner && (
                          <span className="text-[#574144] ml-2 font-medium">
                            • {ord.courierPartner}
                          </span>
                        )}
                        {ord.trackingNumber && (
                          <span className="text-[#6d0026] ml-2 font-mono font-semibold">
                            AWB: {ord.trackingNumber}
                          </span>
                        )}
                      </span>
                      <p className="text-[11px] text-[#8a7174] mt-0.5">
                        Delivering to: {ord.customer.address}, {ord.customer.city}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {onOpenTrackOrder && (
                      <button
                        onClick={() => onOpenTrackOrder(ord.id)}
                        className="flex-1 sm:flex-initial px-4 py-2 bg-[#6d0026] hover:bg-[#8e1b3b] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Track Package</span>
                      </button>
                    )}
                    <button
                      onClick={() =>
                        alert(
                          `Official Tax Invoice for Order #${ord.id}\nCustomer: ${ord.customer.name}\nTotal: ₹${ord.total}\nPayment: ${ord.paymentStatus.toUpperCase()} (${ord.paymentMethod.toUpperCase()})\nCourier: ${ord.courierPartner || 'Assigned on dispatch'}\nTracking: ${ord.trackingNumber || 'Available upon pickup'}`
                        )
                      }
                      className="px-3.5 py-2 border border-[#debfc2] text-xs font-semibold text-[#574144] rounded-xl hover:bg-[#fed9e2]/30 transition-colors cursor-pointer"
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

      {/* ========================================= */}
      {/* TAB: WISHLIST                             */}
      {/* ========================================= */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlistedProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#debfc2]/40 p-8 shadow-xs">
              <Heart className="w-10 h-10 text-[#debfc2] mx-auto mb-3" />
              <h3 className="font-display text-lg font-semibold text-[#1c1b1b] mb-1">
                Your Wishlist is Empty
              </h3>
              <p className="text-xs text-[#574144] max-w-sm mx-auto mb-6">
                Tap the heart icon on any silk saree or kurti to save it here for future consideration.
              </p>
              {onShopNow && (
                <button
                  onClick={onShopNow}
                  className="bg-[#6d0026] text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider"
                >
                  Explore Collection
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {wishlistedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white p-4 rounded-2xl border border-[#debfc2]/40 flex gap-4 shadow-xs items-center"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-26 object-cover rounded-xl bg-[#f6f3f2] cursor-pointer shrink-0 border border-[#debfc2]/30"
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
                        className="bg-[#6d0026] text-white px-3 py-1.5 rounded-xl text-xs font-semibold uppercase hover:bg-[#8e1b3b] flex items-center gap-1 cursor-pointer"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        Add to Bag
                      </button>
                      <button
                        onClick={() => onRemoveWishlist(product)}
                        className="text-[#8a7174] hover:text-[#ba1a1a] p-1.5 rounded-full cursor-pointer"
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

      {/* ========================================= */}
      {/* TAB: PROFILE & ADDRESSES                  */}
      {/* ========================================= */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          {/* Profile Details Card */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#debfc2]/40 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#debfc2]/40 mb-5">
              <div>
                <h3 className="font-display text-base sm:text-lg font-bold text-[#1c1b1b]">
                  Personal Profile Details
                </h3>
                <p className="text-xs text-[#8a7174]">Manage your name, mobile, and communication email</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditProfileName(currentUser.name);
                  setEditProfilePhone(currentUser.phone);
                  setEditProfileEmail(currentUser.email || '');
                  setIsEditingProfile(!isEditingProfile);
                }}
                className="text-xs font-bold text-[#6d0026] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditingProfile ? 'Cancel' : 'Edit Profile'}</span>
              </button>
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-[#1c1b1b] mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={editProfileName}
                      onChange={(e) => setEditProfileName(e.target.value)}
                      className="w-full px-3 py-2 bg-[#fbf9f8] rounded-xl border border-[#debfc2]/60 focus:outline-none focus:border-[#6d0026]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#1c1b1b] mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      value={editProfilePhone}
                      onChange={(e) => setEditProfilePhone(e.target.value)}
                      className="w-full px-3 py-2 bg-[#fbf9f8] rounded-xl border border-[#debfc2]/60 focus:outline-none focus:border-[#6d0026]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#1c1b1b] mb-1">Email</label>
                    <input
                      type="email"
                      value={editProfileEmail}
                      onChange={(e) => setEditProfileEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-[#fbf9f8] rounded-xl border border-[#debfc2]/60 focus:outline-none focus:border-[#6d0026]"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2 text-xs text-[#8a7174] hover:text-[#1c1b1b]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#6d0026] text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-[#8e1b3b]"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 bg-[#fbf9f8] rounded-2xl border border-[#debfc2]/30">
                  <span className="text-[11px] text-[#8a7174] font-medium block mb-0.5">Full Name</span>
                  <p className="font-bold text-sm text-[#1c1b1b]">{currentUser.name}</p>
                </div>
                <div className="p-3.5 bg-[#fbf9f8] rounded-2xl border border-[#debfc2]/30">
                  <span className="text-[11px] text-[#8a7174] font-medium block mb-0.5">Mobile Number</span>
                  <p className="font-bold text-sm text-[#1c1b1b]">{currentUser.phone}</p>
                </div>
                <div className="p-3.5 bg-[#fbf9f8] rounded-2xl border border-[#debfc2]/30">
                  <span className="text-[11px] text-[#8a7174] font-medium block mb-0.5">Email Address</span>
                  <p className="font-bold text-sm text-[#1c1b1b]">{currentUser.email || 'Not provided'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Delivery Addresses Card */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#debfc2]/40 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#debfc2]/40 mb-5">
              <div>
                <h3 className="font-display text-base sm:text-lg font-bold text-[#1c1b1b]">
                  Saved Delivery Addresses
                </h3>
                <p className="text-xs text-[#8a7174]">Your verified delivery destinations for fast checkout</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingAddress(!isAddingAddress)}
                className="bg-[#6d0026] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold hover:bg-[#8e1b3b] flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Address</span>
              </button>
            </div>

            {/* Add Address Form */}
            {isAddingAddress && (
              <form onSubmit={handleSaveNewAddress} className="mb-6 p-4 bg-[#fbf9f8] rounded-2xl border border-[#debfc2]/60 space-y-3 text-xs">
                <h4 className="font-bold text-xs text-[#1c1b1b]">Add New Address</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#574144] mb-1">Tag / Label</label>
                    <select
                      value={newAddressForm.tag}
                      onChange={(e) => setNewAddressForm({ ...newAddressForm, tag: e.target.value })}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-[#debfc2]/60"
                    >
                      <option value="Home">Home</option>
                      <option value="Work">Work / Office</option>
                      <option value="Family">Family / Relatives</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-[#574144] mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      value={newAddressForm.phone}
                      onChange={(e) => setNewAddressForm({ ...newAddressForm, phone: e.target.value })}
                      placeholder={currentUser.phone}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-[#debfc2]/60"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#574144] mb-1">Full Street Address *</label>
                  <input
                    type="text"
                    required
                    value={newAddressForm.address}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, address: e.target.value })}
                    placeholder="House / Flat No., Road, Landmark"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#debfc2]/60"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-semibold text-[#574144] mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={newAddressForm.city}
                      onChange={(e) => setNewAddressForm({ ...newAddressForm, city: e.target.value })}
                      placeholder="e.g. Surat"
                      className="w-full px-3 py-2 bg-white rounded-xl border border-[#debfc2]/60"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#574144] mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={newAddressForm.state}
                      onChange={(e) => setNewAddressForm({ ...newAddressForm, state: e.target.value })}
                      placeholder="e.g. Gujarat"
                      className="w-full px-3 py-2 bg-white rounded-xl border border-[#debfc2]/60"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#574144] mb-1">Pincode *</label>
                    <input
                      type="text"
                      required
                      value={newAddressForm.pincode}
                      onChange={(e) => setNewAddressForm({ ...newAddressForm, pincode: e.target.value })}
                      placeholder="e.g. 395003"
                      className="w-full px-3 py-2 bg-white rounded-xl border border-[#debfc2]/60"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(false)}
                    className="px-4 py-2 text-xs text-[#8a7174]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#6d0026] text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-[#8e1b3b]"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}

            {/* Address List */}
            {(!currentUser.addresses || currentUser.addresses.length === 0) ? (
              <div className="text-center py-8 bg-[#fbf9f8] rounded-2xl border border-dashed border-[#debfc2]/60">
                <MapPin className="w-8 h-8 text-[#debfc2] mx-auto mb-2" />
                <p className="text-xs text-[#574144]">No saved address yet.</p>
                <p className="text-[11px] text-[#8a7174] mt-0.5">
                  When you checkout or click "Add Address" above, your address will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {currentUser.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-4 bg-[#fbf9f8] rounded-2xl border border-[#debfc2]/50 flex justify-between items-start"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-[#1c1b1b]">{addr.tag || 'Home'}</span>
                        {addr.isDefault && (
                          <span className="bg-[#6d0026] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#574144] font-medium leading-relaxed">
                        {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                      <p className="text-[11px] text-[#8a7174] mt-1">Contact: {addr.phone || currentUser.phone}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = deleteUserAddress(addr.id);
                        if (updated) setCurrentUserState(updated);
                      }}
                      className="text-[#8a7174] hover:text-rose-600 p-1 rounded-lg"
                      title="Delete Address"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* TAB: MEASUREMENTS & ATELIER               */}
      {/* ========================================= */}
      {activeTab === 'styling' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#debfc2]/40 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#ffd9dd] text-[#6d0026] rounded-2xl">
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

          {/* Measurements Form */}
          <div className="p-5 bg-[#fbf9f8] rounded-2xl border border-[#debfc2]/40">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-[#1c1b1b] uppercase tracking-wider flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-[#6d0026]" />
                <span>Your Bespoke Measurements On File (Inches)</span>
              </h4>
              {measurementsSavedMsg && (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Saved successfully!
                </span>
              )}
            </div>

            <form onSubmit={handleSaveMeasurements} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                <div>
                  <label className="block text-[#574144] font-semibold mb-1">Bust (in)</label>
                  <input
                    type="text"
                    value={measurements.bust}
                    onChange={(e) => setMeasurements({ ...measurements, bust: e.target.value })}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#debfc2]/60 text-xs font-bold text-[#1c1b1b]"
                  />
                </div>
                <div>
                  <label className="block text-[#574144] font-semibold mb-1">Waist (in)</label>
                  <input
                    type="text"
                    value={measurements.waist}
                    onChange={(e) => setMeasurements({ ...measurements, waist: e.target.value })}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#debfc2]/60 text-xs font-bold text-[#1c1b1b]"
                  />
                </div>
                <div>
                  <label className="block text-[#574144] font-semibold mb-1">Hip (in)</label>
                  <input
                    type="text"
                    value={measurements.hip}
                    onChange={(e) => setMeasurements({ ...measurements, hip: e.target.value })}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#debfc2]/60 text-xs font-bold text-[#1c1b1b]"
                  />
                </div>
                <div>
                  <label className="block text-[#574144] font-semibold mb-1">Shoulder (in)</label>
                  <input
                    type="text"
                    value={measurements.shoulder}
                    onChange={(e) => setMeasurements({ ...measurements, shoulder: e.target.value })}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#debfc2]/60 text-xs font-bold text-[#1c1b1b]"
                  />
                </div>
                <div>
                  <label className="block text-[#574144] font-semibold mb-1">Blouse Length</label>
                  <input
                    type="text"
                    value={measurements.blouseLength}
                    onChange={(e) => setMeasurements({ ...measurements, blouseLength: e.target.value })}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#debfc2]/60 text-xs font-bold text-[#1c1b1b]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={isSavingMeasurements}
                  className="bg-[#6d0026] hover:bg-[#8e1b3b] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  {isSavingMeasurements ? 'Saving...' : 'Update Measurements'}
                </button>
              </div>
            </form>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-[#fcf9f8] rounded-2xl border border-[#debfc2]/30">
              <h4 className="text-xs font-bold text-[#1c1b1b] uppercase tracking-wider mb-1">
                Virtual Draping & Styling
              </h4>
              <p className="text-xs text-[#574144] mb-3">
                Connect via high-definition video with our Banarasi and Kanjivaram styling masters.
              </p>
              <button
                onClick={onOpenStylistModal}
                className="text-xs font-semibold text-[#6d0026] hover:underline cursor-pointer"
              >
                Schedule Virtual Session →
              </button>
            </div>

            <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200">
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
    </div>
  );
};
