import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { loginWithGoogle, loginWithEmail, registerWithEmail } from '../utils/firebaseAuth';
import { loginUser } from '../utils/authStorage';
import { UserAccount } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: UserAccount) => void;
  initialMode?: 'login' | 'register';
  redirectMessage?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
  redirectMessage,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>(initialMode);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Login form state
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [showAddressFields, setShowAddressFields] = useState(false);
  const [registerAddress, setRegisterAddress] = useState('');
  const [registerCity, setRegisterCity] = useState('Surat');
  const [registerState, setRegisterState] = useState('Gujarat');
  const [registerPincode, setRegisterPincode] = useState('395002');

  if (!isOpen) return null;

  // Handle Google Dual-Auth Login
  const handleGoogleAuth = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsGoogleLoading(true);

    try {
      const res = await loginWithGoogle();
      if (res.success && res.user) {
        setSuccessMsg(`Welcome, ${res.user.name}! Your profile and saved addresses are active.`);
        setTimeout(() => {
          if (onSuccess) onSuccess(res.user!);
          onClose();
        }, 900);
      } else {
        setErrorMsg(res.error || 'Could not complete Google authentication.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Google sign-in error. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Handle Email/Password Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    const input = loginEmailOrPhone.trim();

    // If input is purely a phone number (e.g. 10 digits) without password, use quick mobile lookup
    if (!input.includes('@') && /^\d{10}$/.test(input.replace(/\D/g, '')) && !loginPassword) {
      const res = loginUser(input);
      setIsSubmitting(false);
      if (res.success && res.user) {
        setSuccessMsg(`Welcome back, ${res.user.name}!`);
        setTimeout(() => {
          if (onSuccess) onSuccess(res.user!);
          onClose();
        }, 800);
      } else {
        setErrorMsg(res.error || 'Account not found with this mobile number.');
      }
      return;
    }

    // Standard Email + Password Login
    const res = await loginWithEmail(input, loginPassword);
    setIsSubmitting(false);

    if (res.success && res.user) {
      setSuccessMsg(`Welcome back, ${res.user.name}!`);
      setTimeout(() => {
        if (onSuccess) onSuccess(res.user!);
        onClose();
      }, 800);
    } else {
      setErrorMsg(res.error || 'Invalid credentials. Please verify and try again.');
    }
  };

  // Handle Email/Password Registration
  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    const res = await registerWithEmail({
      name: registerName,
      email: registerEmail,
      password: registerPassword,
      phone: registerPhone,
      address: registerAddress,
      city: registerCity,
      state: registerState,
      pincode: registerPincode,
    });
    setIsSubmitting(false);

    if (res.success && res.user) {
      setSuccessMsg(`Account created! Welcome to Zevioza Couture, ${res.user.name}.`);
      setTimeout(() => {
        if (onSuccess) onSuccess(res.user!);
        onClose();
      }, 900);
    } else {
      setErrorMsg(res.error || 'Registration failed. Please check your details.');
    }
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-body animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="auth-modal-container"
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-[#debfc2]/60 overflow-hidden relative"
      >
        {/* Top Header Banner */}
        <div className="bg-gradient-to-br from-[#6d0026] via-[#8e1b3b] to-[#57001e] text-white p-6 sm:p-7 relative">
          <button
            id="btn-close-auth-modal"
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center border border-white/20">
              <Sparkles className="w-4 h-4 text-[#ffdea5]" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#ffdea5]">
              Zevioza Couture
            </span>
          </div>

          <h3 className="font-display text-2xl font-bold tracking-tight text-white">
            {authMode === 'login' ? 'Sign In to Your Account' : 'Join Zevioza Privilege'}
          </h3>
          <p className="text-xs text-rose-100/90 mt-1 leading-relaxed">
            {redirectMessage ||
              (authMode === 'login'
                ? 'Sign in to access your orders, live Shiprocket tracking, and saved delivery addresses.'
                : 'Enjoy member-only couture previews, personalized bridal styling, and 1-click checkout.')}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-5">
          {/* Alerts */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="font-medium">{successMsg}</span>
            </div>
          )}

          {/* 1. DUAL AUTH: PROMINENT 'CONTINUE WITH GOOGLE' BUTTON */}
          <div>
            <button
              id="btn-google-auth"
              type="button"
              onClick={handleGoogleAuth}
              disabled={isGoogleLoading || isSubmitting}
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
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Instant 1-click verification • Auto-prefills checkout address</span>
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#debfc2]/60 w-full" />
            <span className="bg-white px-3 text-[10px] font-bold uppercase tracking-widest text-[#8a7174] shrink-0">
              or continue with email
            </span>
            <div className="border-t border-[#debfc2]/60 w-full" />
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 bg-[#f6f3f2] p-1 rounded-2xl border border-[#debfc2]/60 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMsg('');
              }}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
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
                setErrorMsg('');
              }}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                authMode === 'register'
                  ? 'bg-[#6d0026] text-white shadow-xs'
                  : 'text-[#574144] hover:text-[#1c1b1b]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* TAB 1: SIGN IN FORM */}
          {authMode === 'login' && (
            <form onSubmit={handleEmailLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#1c1b1b] mb-1">
                  Email Address or Mobile Number *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8a7174] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={loginEmailOrPhone}
                    onChange={(e) => setLoginEmailOrPhone(e.target.value)}
                    placeholder="name@gmail.com or 10-digit mobile"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#fbf9f8] rounded-xl border border-[#debfc2]/60 focus:outline-none focus:border-[#6d0026] text-xs text-[#1c1b1b]"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-[#1c1b1b]">Password</label>
                  <span className="text-[10px] text-[#8a7174]">
                    (Leave empty if logging in with phone)
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8a7174] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#fbf9f8] rounded-xl border border-[#debfc2]/60 focus:outline-none focus:border-[#6d0026] text-xs text-[#1c1b1b]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a7174] hover:text-[#1c1b1b]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                id="btn-submit-email-login"
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#6d0026] hover:bg-[#8e1b3b] text-white py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 2: CREATE ACCOUNT FORM */}
          {authMode === 'register' && (
            <form onSubmit={handleEmailRegister} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#1c1b1b] mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8a7174] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    placeholder="e.g. Ananya Sharma"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#fbf9f8] rounded-xl border border-[#debfc2]/60 focus:outline-none focus:border-[#6d0026] text-xs text-[#1c1b1b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-[#1c1b1b] mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-[#8a7174] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full pl-8 pr-2.5 py-2 bg-[#fbf9f8] rounded-xl border border-[#debfc2]/60 focus:outline-none focus:border-[#6d0026] text-xs text-[#1c1b1b]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#1c1b1b] mb-1">Mobile (WhatsApp)</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-[#8a7174] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      maxLength={10}
                      value={registerPhone}
                      onChange={(e) => setRegisterPhone(e.target.value)}
                      placeholder="10-digit number"
                      className="w-full pl-8 pr-2.5 py-2 bg-[#fbf9f8] rounded-xl border border-[#debfc2]/60 focus:outline-none focus:border-[#6d0026] text-xs text-[#1c1b1b]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1c1b1b] mb-1">Password * (Min 6 chars)</label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-[#8a7174] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-8 pr-8 py-2 bg-[#fbf9f8] rounded-xl border border-[#debfc2]/60 focus:outline-none focus:border-[#6d0026] text-xs text-[#1c1b1b]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8a7174]"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Optional: Add Delivery Address for Instant Checkout Prefill */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddressFields(!showAddressFields)}
                  className="text-[11px] font-bold text-[#6d0026] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <MapPin className="w-3 h-3" />
                  <span>{showAddressFields ? 'Hide delivery address' : '+ Pre-save delivery address for 1-click checkout'}</span>
                </button>

                {showAddressFields && (
                  <div className="mt-2 p-3 bg-[#fcf9f8] rounded-xl border border-[#debfc2]/50 space-y-2">
                    <input
                      type="text"
                      value={registerAddress}
                      onChange={(e) => setRegisterAddress(e.target.value)}
                      placeholder="Street / Flat / House No."
                      className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-[#debfc2]/60 text-xs"
                    />
                    <div className="grid grid-cols-3 gap-1.5">
                      <input
                        type="text"
                        value={registerCity}
                        onChange={(e) => setRegisterCity(e.target.value)}
                        placeholder="City"
                        className="w-full px-2 py-1.5 bg-white rounded-lg border border-[#debfc2]/60 text-xs"
                      />
                      <input
                        type="text"
                        value={registerState}
                        onChange={(e) => setRegisterState(e.target.value)}
                        placeholder="State"
                        className="w-full px-2 py-1.5 bg-white rounded-lg border border-[#debfc2]/60 text-xs"
                      />
                      <input
                        type="text"
                        value={registerPincode}
                        onChange={(e) => setRegisterPincode(e.target.value)}
                        placeholder="Pincode"
                        className="w-full px-2 py-1.5 bg-white rounded-lg border border-[#debfc2]/60 text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                id="btn-submit-register"
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#6d0026] hover:bg-[#8e1b3b] text-white py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Create Boutique Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
