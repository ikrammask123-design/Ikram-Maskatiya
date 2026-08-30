import React from 'react';
import { Home, Grid, Bell, User, ShoppingBag } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  unreadAlertsCount: number;
  openCart: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  unreadAlertsCount,
  openCart,
}) => {
  return (
    <nav
      id="mobile-bottom-nav"
      className="md:hidden fixed bottom-0 left-0 w-full z-40 flex justify-around items-center pt-2 pb-3 px-2 bg-[#fcf9f8]/95 backdrop-blur-md shadow-[0px_-4px_20px_rgba(142,27,59,0.08)] border-t border-[#debfc2]/30"
    >
      {/* Tab: Home */}
      <button
        id="btn-nav-home"
        onClick={() => setActiveTab('home')}
        className={`flex flex-col items-center justify-center transition-all duration-200 px-3 py-1 rounded-full ${
          activeTab === 'home'
            ? 'text-[#6d0026] bg-[#fed9e2]/60 font-semibold scale-100 shadow-xs'
            : 'text-[#574144] hover:bg-[#f6f3f2]'
        }`}
      >
        <span
          className="material-symbols-outlined text-2xl mb-0.5"
          style={{
            fontVariationSettings: activeTab === 'home' ? "'FILL' 1" : "'FILL' 0",
          }}
        >
          home
        </span>
        <span className="font-body text-[11px] tracking-tight">Home</span>
      </button>

      {/* Tab: Categories */}
      <button
        id="btn-nav-categories"
        onClick={() => setActiveTab('categories')}
        className={`flex flex-col items-center justify-center transition-all duration-200 px-3 py-1 rounded-full ${
          activeTab === 'categories'
            ? 'text-[#6d0026] bg-[#fed9e2]/60 font-semibold scale-100 shadow-xs'
            : 'text-[#574144] hover:bg-[#f6f3f2]'
        }`}
      >
        <span
          className="material-symbols-outlined text-2xl mb-0.5"
          style={{
            fontVariationSettings: activeTab === 'categories' ? "'FILL' 1" : "'FILL' 0",
          }}
        >
          grid_view
        </span>
        <span className="font-body text-[11px] tracking-tight">Categories</span>
      </button>

      {/* Tab: Alerts */}
      <button
        id="btn-nav-alerts"
        onClick={() => setActiveTab('alerts')}
        className={`flex flex-col items-center justify-center transition-all duration-200 px-3 py-1 rounded-full relative ${
          activeTab === 'alerts'
            ? 'text-[#6d0026] bg-[#fed9e2]/60 font-semibold scale-100 shadow-xs'
            : 'text-[#574144] hover:bg-[#f6f3f2]'
        }`}
      >
        <div className="relative">
          <span
            className="material-symbols-outlined text-2xl mb-0.5"
            style={{
              fontVariationSettings: activeTab === 'alerts' ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            notifications
          </span>
          {unreadAlertsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#aa314e] rounded-full ring-2 ring-white"></span>
          )}
        </div>
        <span className="font-body text-[11px] tracking-tight">Alerts</span>
      </button>

      {/* Tab: Account */}
      <button
        id="btn-nav-account"
        onClick={() => setActiveTab('account')}
        className={`flex flex-col items-center justify-center transition-all duration-200 px-3 py-1 rounded-full ${
          activeTab === 'account'
            ? 'text-[#6d0026] bg-[#fed9e2]/60 font-semibold scale-100 shadow-xs'
            : 'text-[#574144] hover:bg-[#f6f3f2]'
        }`}
      >
        <span
          className="material-symbols-outlined text-2xl mb-0.5"
          style={{
            fontVariationSettings: activeTab === 'account' ? "'FILL' 1" : "'FILL' 0",
          }}
        >
          person
        </span>
        <span className="font-body text-[11px] tracking-tight">Account</span>
      </button>

      {/* Tab: Cart */}
      <button
        id="btn-nav-cart"
        onClick={openCart}
        className="flex flex-col items-center justify-center transition-all duration-200 px-3 py-1 rounded-full text-[#574144] hover:bg-[#f6f3f2] relative"
      >
        <div className="relative">
          <span className="material-symbols-outlined text-2xl mb-0.5">
            shopping_bag
          </span>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-[#6d0026] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
        <span className="font-body text-[11px] tracking-tight">Cart</span>
      </button>
    </nav>
  );
};
