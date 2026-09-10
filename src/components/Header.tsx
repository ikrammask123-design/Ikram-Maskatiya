import React, { useState, useEffect } from 'react';
import { Menu, Search, ShoppingBag, Heart, User, X, Sparkles, SlidersHorizontal, Truck } from 'lucide-react';
import { CategoryId, Currency } from '../types';
import { CURRENCY_RATES } from '../data/products';
import { Logo } from './Logo';
import { getCurrentUser, AUTH_CHANGE_EVENT } from '../utils/authStorage';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCategory: CategoryId;
  setSelectedCategory: (category: CategoryId) => void;
  cartCount: number;
  wishlistCount: number;
  openCart: () => void;
  openSearch: () => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  onOpenStylistModal?: () => void;
  onOpenTrackOrder?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedCategory,
  setSelectedCategory,
  cartCount,
  wishlistCount,
  openCart,
  openSearch,
  currency,
  setCurrency,
  onOpenStylistModal,
  onOpenTrackOrder,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickSearchInput, setQuickSearchInput] = useState('');
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  useEffect(() => {
    const handleAuth = () => setCurrentUser(getCurrentUser());
    window.addEventListener(AUTH_CHANGE_EVENT, handleAuth);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, handleAuth);
  }, []);

  const handleNavClick = (tab: string, category?: CategoryId) => {
    setActiveTab(tab);
    if (category) {
      setSelectedCategory(category);
    }
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    openSearch();
  };

  return (
    <>
      {/* Top Banner / Privilege Strip (Subtle & Elegant) */}
      <div className="hidden sm:flex bg-[#6d0026] text-[#fed9e2] text-[11px] font-body tracking-widest uppercase py-1.5 px-4 justify-between items-center z-50 relative">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-[#ffdea5]" />
            <span>Autumn Silk Salon 2026 Live • Complimentary Express Shipping on Orders Over ₹2,000</span>
          </div>
          <div className="flex items-center gap-4 text-[10px]">
            {onOpenTrackOrder && (
              <>
                <button
                  onClick={onOpenTrackOrder}
                  className="hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                  title="Track Order Status"
                >
                  <Truck className="w-3 h-3 text-[#ffdea5]" />
                  <span>Track Order</span>
                </button>
                <span>•</span>
              </>
            )}
            {onOpenStylistModal && (
              <>
                <button
                  onClick={onOpenStylistModal}
                  className="hover:text-white underline cursor-pointer"
                >
                  Book Private Stylist
                </button>
                <span>•</span>
              </>
            )}
            <div className="flex items-center gap-1">
              <span>Currency:</span>
              <select
                id="currency-top-strip"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="bg-transparent border-none text-[#ffdea5] font-semibold text-[10px] focus:outline-none cursor-pointer"
              >
                {Object.keys(CURRENCY_RATES).map((curr) => (
                  <option key={curr} value={curr} className="text-[#1c1b1b]">
                    {curr} ({CURRENCY_RATES[curr].symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main App Bar Header (Exact design from video) */}
      <header
        id="main-header"
        className="fixed top-0 sm:top-[28px] left-0 w-full z-40 bg-[#fcf9f8]/95 backdrop-blur-md border-b border-[#debfc2]/30 shadow-xs transition-all duration-200"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 h-16 sm:h-18 flex items-center justify-between gap-3 sm:gap-8">
          {/* 1. Left: Mobile Menu & Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden text-[#574144] hover:text-[#6d0026] p-1.5 focus:outline-none"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 text-[#1c1b1b]" />
            </button>

            <button
              id="btn-header-logo"
              onClick={() => handleNavClick('home', 'all')}
              className="focus:outline-none flex items-center group cursor-pointer"
              aria-label="Zevioza Home"
            >
              <Logo size="md" />
            </button>
          </div>

          {/* 2. Center: Prominent Search Bar (Just like in the video) */}
          <div className="flex-1 max-w-xl hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-[#8a7174] absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search sarees, kurtis, dresses..."
                  value={quickSearchInput}
                  onChange={(e) => setQuickSearchInput(e.target.value)}
                  onClick={openSearch}
                  className="w-full bg-[#f6f3f2] hover:bg-[#ede9e8] text-[#1c1b1b] text-xs font-body pl-11 pr-10 py-2.5 rounded-full border border-[#debfc2]/50 focus:outline-none focus:border-[#6d0026] focus:bg-white transition-all shadow-2xs placeholder-[#8a7174]"
                />
                {quickSearchInput && (
                  <button
                    type="button"
                    onClick={() => setQuickSearchInput('')}
                    className="absolute right-3 text-[#8a7174] hover:text-[#1c1b1b]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* 3. Right: Icons Action Row */}
          <div className="flex items-center gap-2 sm:gap-4 text-[#574144]">
            {/* Mobile Search Button */}
            <button
              id="btn-mobile-search-open"
              onClick={openSearch}
              className="md:hidden p-2 text-[#574144] hover:text-[#6d0026] hover:bg-[#fed9e2]/30 rounded-full transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Icon */}
            <button
              id="btn-nav-wishlist"
              onClick={() => setActiveTab('account')}
              className="p-2 hover:text-[#6d0026] hover:bg-[#fed9e2]/30 rounded-full transition-colors relative"
              title="Saved Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#8e1b3b] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Account Icon */}
            <button
              id="btn-nav-user-account"
              onClick={() => setActiveTab('account')}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 hover:text-[#6d0026] hover:bg-[#fed9e2]/40 rounded-full transition-colors flex items-center gap-1.5 ${
                currentUser ? 'text-[#6d0026] bg-[#fed9e2]/40 font-semibold' : ''
              }`}
              title={currentUser ? `Logged in as ${currentUser.name}` : 'Account & Orders'}
            >
              <User className="w-5 h-5" />
              {currentUser && (
                <span className="hidden lg:inline text-xs truncate max-w-[90px]">
                  {currentUser.name.split(' ')[0]}
                </span>
              )}
            </button>

            {/* Track Order Button */}
            {onOpenTrackOrder && (
              <button
                id="btn-nav-track-order"
                onClick={onOpenTrackOrder}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all border bg-white hover:bg-[#f6f3f2] text-[#574144] hover:text-[#6d0026] border-[#debfc2]"
                title="Track Your Shipment"
              >
                <Truck className="w-3.5 h-3.5 text-[#6d0026]" />
                <span>Track Order</span>
              </button>
            )}

            {/* Shopping Bag Icon */}
            <button
              id="btn-nav-shopping-cart"
              onClick={openCart}
              className="p-2 hover:text-[#6d0026] hover:bg-[#fed9e2]/30 rounded-full transition-colors relative"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#6d0026] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Desktop Quick Category Links button or Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="hidden lg:flex items-center gap-1.5 pl-3 border-l border-[#debfc2]/60 text-xs font-semibold text-[#6d0026] hover:opacity-80 py-1"
            >
              <Menu className="w-4 h-4" />
              <span className="text-[11px] tracking-wider uppercase">Menu</span>
            </button>
          </div>
        </div>

        {/* Secondary Category Navigation Bar */}
        <div className="hidden md:flex border-t border-[#debfc2]/25 bg-white/70 backdrop-blur-xs justify-center items-center gap-8 py-2 px-6">
          <button
            onClick={() => handleNavClick('home', 'all')}
            className={`text-[11px] tracking-[0.15em] uppercase font-semibold transition-all ${
              activeTab === 'home'
                ? 'text-[#6d0026] border-b-2 border-[#6d0026] pb-0.5'
                : 'text-[#574144] hover:text-[#6d0026]'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('categories', 'sarees')}
            className={`text-[11px] tracking-[0.15em] uppercase font-semibold transition-all ${
              activeTab === 'categories' && selectedCategory === 'sarees'
                ? 'text-[#6d0026] border-b-2 border-[#6d0026] pb-0.5'
                : 'text-[#574144] hover:text-[#6d0026]'
            }`}
          >
            Sarees
          </button>
          <button
            onClick={() => handleNavClick('categories', 'kurtis')}
            className={`text-[11px] tracking-[0.15em] uppercase font-semibold transition-all ${
              activeTab === 'categories' && selectedCategory === 'kurtis'
                ? 'text-[#6d0026] border-b-2 border-[#6d0026] pb-0.5'
                : 'text-[#574144] hover:text-[#6d0026]'
            }`}
          >
            Kurtis
          </button>
          <button
            onClick={() => handleNavClick('categories', 'dresses')}
            className={`text-[11px] tracking-[0.15em] uppercase font-semibold transition-all ${
              activeTab === 'categories' && selectedCategory === 'dresses'
                ? 'text-[#6d0026] border-b-2 border-[#6d0026] pb-0.5'
                : 'text-[#574144] hover:text-[#6d0026]'
            }`}
          >
            Dresses
          </button>
          <button
            onClick={() => handleNavClick('categories', 'accessories')}
            className={`text-[11px] tracking-[0.15em] uppercase font-semibold transition-all ${
              activeTab === 'categories' && selectedCategory === 'accessories'
                ? 'text-[#6d0026] border-b-2 border-[#6d0026] pb-0.5'
                : 'text-[#574144] hover:text-[#6d0026]'
            }`}
          >
            Accessories
          </button>
          <button
            onClick={() => handleNavClick('categories', 'all')}
            className="text-[11px] tracking-[0.15em] uppercase font-semibold text-[#891738] hover:text-[#6d0026] flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#aa314e] animate-ping"></span>
            New Arrivals
          </button>
          {/* Korean Store Tab (Flipkart Inspired Gen-Z Section) */}
          <button
            id="btn-nav-korean-store"
            onClick={() => handleNavClick('korean-store')}
            className={`text-[11px] tracking-[0.12em] uppercase font-bold transition-all px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs ${
              activeTab === 'korean-store'
                ? 'bg-gradient-to-r from-[#ec4899] via-[#d946ef] to-[#8b5cf6] text-white shadow-sm ring-2 ring-[#f472b6]/40'
                : 'bg-gradient-to-r from-[#fdf2f8] to-[#f3e8ff] text-[#db2777] hover:text-[#9333ea] border border-[#fbcfe8] hover:border-[#f472b6]'
            }`}
          >
            <Sparkles className="w-3 h-3 text-[#eab308] fill-[#eab308]" />
            <span>K-Aesthetic Store</span>
            <span className="text-[9px] bg-white text-[#db2777] font-extrabold px-1.5 py-0.2 rounded-full shadow-2xs">
              HOT
            </span>
          </button>
        </div>
      </header>

      {/* Side Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-sm bg-[#fcf9f8] h-full shadow-2xl z-50 flex flex-col p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#debfc2]/40">
              <button
                onClick={() => handleNavClick('home', 'all')}
                className="text-left focus:outline-none"
              >
                <Logo size="sm" withTagline={true} />
              </button>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-[#574144] hover:text-[#6d0026] rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-6 flex flex-col gap-4">
              {/* Highlighted Korean Store Banner Item */}
              <button
                onClick={() => handleNavClick('korean-store')}
                className="text-left p-3.5 rounded-2xl bg-gradient-to-r from-[#fdf2f8] via-[#fce7f3] to-[#f3e8ff] border border-[#fbcfe8] shadow-xs flex items-center justify-between transition-transform active:scale-98"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-black text-[#db2777] tracking-wider uppercase">
                    <Sparkles className="w-3.5 h-3.5 fill-[#db2777]" />
                    <span>Korean Store (K-Aesthetic)</span>
                  </div>
                  <span className="text-[11px] text-[#7c3aed] font-medium block mt-0.5">
                    K-Drama Fits, Bow Bags & Kurtis @ ₹149
                  </span>
                </div>
                <span className="bg-[#db2777] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                  NEW
                </span>
              </button>

              <button
                onClick={() => handleNavClick('home', 'all')}
                className="text-left font-display text-lg text-[#1c1b1b] hover:text-[#6d0026] py-1 font-semibold"
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('categories', 'sarees')}
                className="text-left font-display text-lg text-[#1c1b1b] hover:text-[#6d0026] py-1 font-semibold flex items-center justify-between"
              >
                <span>Sarees Collection</span>
                <span className="text-xs font-body text-[#8a7174]">Pure Silk & Zari</span>
              </button>
              <button
                onClick={() => handleNavClick('categories', 'kurtis')}
                className="text-left font-display text-lg text-[#1c1b1b] hover:text-[#6d0026] py-1 font-semibold flex items-center justify-between"
              >
                <span>Kurtis & Sets</span>
                <span className="text-xs font-body text-[#8a7174]">Chikankari & Chanderi</span>
              </button>
              <button
                onClick={() => handleNavClick('categories', 'dresses')}
                className="text-left font-display text-lg text-[#1c1b1b] hover:text-[#6d0026] py-1 font-semibold flex items-center justify-between"
              >
                <span>Ethnic Dresses & Gowns</span>
                <span className="text-xs font-body text-[#8a7174]">Organza & Flared</span>
              </button>
              <button
                onClick={() => handleNavClick('categories', 'accessories')}
                className="text-left font-display text-lg text-[#1c1b1b] hover:text-[#6d0026] py-1 font-semibold flex items-center justify-between"
              >
                <span>Temple Jewellery & Bangles</span>
                <span className="text-xs font-body text-[#8a7174]">Kundan & Gold</span>
              </button>
              <button
                onClick={() => handleNavClick('categories', 'all')}
                className="text-left font-display text-lg text-[#891738] hover:text-[#6d0026] py-1 font-semibold"
              >
                ✨ Trending & New Arrivals
              </button>
              {onOpenTrackOrder && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenTrackOrder();
                  }}
                  className="text-left font-display text-sm text-[#1c1b1b] bg-[#f6f3f2] hover:bg-[#ede9e8] p-3 rounded-xl border border-[#debfc2]/60 font-semibold flex items-center justify-between mt-2"
                >
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#6d0026]" />
                    <span>Track Your Order</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold bg-[#6d0026] text-white px-2 py-0.5 rounded-full">
                    Live Status
                  </span>
                </button>
              )}
            </div>

            <div className="mt-auto pt-6 border-t border-[#debfc2]/40 flex flex-col gap-3 text-xs text-[#574144]">
              {onOpenStylistModal && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenStylistModal();
                  }}
                  className="w-full bg-[#ffd9dd] text-[#6d0026] py-2.5 rounded-full font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#891738]" />
                  Book Private Stylist
                </button>
              )}
              <div className="flex justify-between items-center py-2">
                <span>Currency</span>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                  className="bg-transparent border border-[#debfc2] rounded-md px-2 py-1 text-xs font-semibold"
                >
                  {Object.keys(CURRENCY_RATES).map((curr) => (
                    <option key={curr} value={curr}>
                      {curr} ({CURRENCY_RATES[curr].symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
