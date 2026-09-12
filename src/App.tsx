import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HomeView } from './components/HomeView';
import { CategoryView } from './components/CategoryView';
import { AlertsView } from './components/AlertsView';
import { AccountView } from './components/AccountView';
import { AdminPanel } from './components/AdminPanel';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { StylistModal } from './components/StylistModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { TrackOrderModal } from './components/TrackOrderModal';
import { KoreanStoreView } from './components/KoreanStoreView';
import { CategoryId, Product, CartItem, Currency, NotificationItem } from './types';
import { PRODUCTS, INITIAL_NOTIFICATIONS } from './data/products';
import { K_PRODUCTS } from './data/koreanStoreData';

const ALL_PRODUCTS = [...PRODUCTS, ...K_PRODUCTS];

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [currency, setCurrency] = useState<Currency>('INR');

  // Order Tracking Modal State
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState<boolean>(false);
  const [trackOrderIdForModal, setTrackOrderIdForModal] = useState<string | null>(null);

  const handleOpenTrackOrder = (orderId?: string) => {
    setTrackOrderIdForModal(orderId || null);
    setIsTrackOrderOpen(true);
  };

  // Private Admin Access:
  // 1. Secret URL Query: ?admin=true or ?owner=true
  // 2. Secret URL Hash: #admin or #owner (e.g. store.com/#admin)
  // 3. Secret Hotkey: Ctrl+Shift+A (or Cmd+Shift+A)
  // 4. Secret 5-tap on footer copyright
  useEffect(() => {
    const checkPrivateAdminRoute = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const hash = window.location.hash.toLowerCase();
      const pathname = window.location.pathname.toLowerCase();
      if (
        pathname === '/admin' ||
        pathname === '/admin/' ||
        pathname.startsWith('/admin') ||
        searchParams.get('admin') === 'true' ||
        searchParams.get('owner') === 'true' ||
        searchParams.get('admin') === '9825' ||
        searchParams.get('portal') === 'owner' ||
        hash === '#admin' ||
        hash === '#owner' ||
        hash === '#portal'
      ) {
        setActiveTab('admin');
      } else if (
        pathname === '/korean' ||
        pathname === '/korean-store' ||
        pathname === '/k-aesthetic' ||
        searchParams.get('store') === 'korean' ||
        searchParams.get('korean') === 'true' ||
        hash === '#korean' ||
        hash === '#korean-store'
      ) {
        setActiveTab('korean-store');
      } else if (hash.startsWith('#korean-')) {
        const prodId = hash.replace('#korean-', '');
        const found = K_PRODUCTS.find((p) => p.id === prodId || p.id === `k-${prodId}`);
        if (found) {
          setSelectedProductModal(found);
          setActiveTab('korean-store');
        }
      }

      // Universal product deep link: ?product=<id> or #product-<id>
      const prodParam = searchParams.get('product') || searchParams.get('p') || searchParams.get('item');
      if (prodParam) {
        const found = ALL_PRODUCTS.find(
          (p) => p.id === prodParam || p.id.toLowerCase() === prodParam.toLowerCase()
        );
        if (found) {
          setSelectedProductModal(found);
          if (found.isKoreanStore || found.category === 'k-store') {
            setActiveTab('korean-store');
          }
        }
      } else if (hash.startsWith('#product-') || hash.startsWith('#item-')) {
        const idFromHash = hash.replace('#product-', '').replace('#item-', '');
        const found = ALL_PRODUCTS.find(
          (p) => p.id === idFromHash || p.id.toLowerCase() === idFromHash.toLowerCase()
        );
        if (found) {
          setSelectedProductModal(found);
          if (found.isKoreanStore || found.category === 'k-store') {
            setActiveTab('korean-store');
          }
        }
      }
      const trackParam = searchParams.get('track') || searchParams.get('order');
      if (trackParam) {
        setTrackOrderIdForModal(trackParam.toUpperCase());
        setIsTrackOrderOpen(true);
      } else if (hash.startsWith('#track')) {
        const idFromHash = hash.replace('#track-', '').replace('#track', '').replace('=', '');
        if (idFromHash) {
          setTrackOrderIdForModal(idFromHash.toUpperCase());
        }
        setIsTrackOrderOpen(true);
      }
    };

    checkPrivateAdminRoute();
    window.addEventListener('hashchange', checkPrivateAdminRoute);
    window.addEventListener('popstate', checkPrivateAdminRoute);

    const handleAdminKeyCombo = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setActiveTab((prev) => (prev === 'admin' ? 'home' : 'admin'));
      }
    };
    window.addEventListener('keydown', handleAdminKeyCombo);

    return () => {
      window.removeEventListener('hashchange', checkPrivateAdminRoute);
      window.removeEventListener('keydown', handleAdminKeyCombo);
    };
  }, []);

  const handleBackToStore = () => {
    if (window.location.pathname.toLowerCase().startsWith('/admin')) {
      try {
        window.history.pushState(null, '', '/');
      } catch {
        // ignore if iframe security restriction
      }
    }
    if (window.location.hash === '#admin' || window.location.hash === '#owner') {
      try {
        window.history.replaceState(null, '', window.location.pathname);
      } catch {
        // ignore if iframe security restriction
      }
    }
    setActiveTab('home');
  };

  // Cart State (Clean initial state for real customers with persistence)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('zevioza_cart_items_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('zevioza_cart_items_v1', JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  // Wishlist State (Clean initial state for real customers with persistence)
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('zevioza_wishlist_ids_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('zevioza_wishlist_ids_v1', JSON.stringify(wishlistIds));
    } catch {}
  }, [wishlistIds]);

  // Notifications State
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Modals & Drawers
  const [selectedProductModal, setSelectedProductModal] =
    useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isStylistModalOpen, setIsStylistModalOpen] = useState<boolean>(false);

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab, selectedCategory]);

  const handleSelectCategory = (category: CategoryId) => {
    setSelectedCategory(category);
    setActiveTab('categories');
  };

  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) =>
      prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id]
    );
  };

  const handleAddToCart = (
    product: Product,
    size?: string,
    customStitching?: boolean,
    notes?: string,
    color?: string,
    image?: string
  ) => {
    const chosenColor = color || (product.availableColors && product.availableColors[0]) || product.color || '';
    const chosenImage = image || product.image;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === product.id &&
          item.selectedSize === size &&
          item.selectedColor === chosenColor &&
          item.customStitching === customStitching
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }

      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        productId: product.id,
        product,
        quantity: 1,
        selectedSize: size,
        selectedColor: chosenColor,
        selectedImage: chosenImage,
        customStitching: customStitching || false,
        notes,
      };
      return [...prev, newItem];
    });
  };

  const handleBuyNow = (
    product: Product,
    size?: string,
    customStitching?: boolean,
    notes?: string,
    color?: string,
    image?: string
  ) => {
    handleAddToCart(product, size, customStitching, notes, color, image);
    setSelectedProductModal(null);
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const unreadAlertsCount = notifications.filter((n) => !n.read).length;
  const wishlistedProducts = ALL_PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] font-body flex flex-col antialiased">
      {/* Header (Desktop + Mobile Top Bar) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        openCart={() => setIsCartOpen(true)}
        openSearch={() => setIsSearchOpen(true)}
        currency={currency}
        setCurrency={setCurrency}
        onOpenStylistModal={() => setIsStylistModalOpen(true)}
        onOpenTrackOrder={handleOpenTrackOrder}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full pt-16 sm:pt-[108px] pb-20 md:pb-0">
        {activeTab === 'home' && (
          <HomeView
            products={PRODUCTS}
            currency={currency}
            wishlistIds={wishlistIds}
            onSelectCategory={handleSelectCategory}
            onToggleWishlist={handleToggleWishlist}
            onSelectProduct={(p) => setSelectedProductModal(p)}
            onAddToCart={(p) => handleAddToCart(p)}
            onOpenStylistModal={() => setIsStylistModalOpen(true)}
            onOpenTrackOrder={handleOpenTrackOrder}
            onOpenKoreanStore={() => setActiveTab('korean-store')}
          />
        )}

        {activeTab === 'korean-store' && (
          <KoreanStoreView
            currency={currency}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onSelectProduct={(p) => setSelectedProductModal(p)}
            onAddToCart={(p) => handleAddToCart(p)}
            onBuyNow={(p) => handleBuyNow(p)}
            onBackToStore={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'categories' && (
          <CategoryView
            products={PRODUCTS}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            currency={currency}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onSelectProduct={(p) => setSelectedProductModal(p)}
            onAddToCart={(p) => handleAddToCart(p)}
          />
        )}

        {activeTab === 'alerts' && (
          <AlertsView
            notifications={notifications}
            onMarkAllRead={handleMarkAllNotificationsRead}
            onSelectCategory={handleSelectCategory}
          />
        )}

        {activeTab === 'account' && (
          <AccountView
            wishlistedProducts={wishlistedProducts}
            currency={currency}
            onRemoveWishlist={handleToggleWishlist}
            onAddToCart={(p) => handleAddToCart(p)}
            onSelectProduct={(p) => setSelectedProductModal(p)}
            onOpenStylistModal={() => setIsStylistModalOpen(true)}
            onOpenTrackOrder={handleOpenTrackOrder}
            onShopNow={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanel
            onBackToStore={handleBackToStore}
            currency={currency}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={totalCartCount}
        unreadAlertsCount={unreadAlertsCount}
        openCart={() => setIsCartOpen(true)}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductModal}
        currency={currency}
        isWishlisted={
          selectedProductModal
            ? wishlistIds.includes(selectedProductModal.id)
            : false
        }
        onClose={() => setSelectedProductModal(null)}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {/* Cart Drawer & Checkout */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        currency={currency}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onOpenTrackOrder={handleOpenTrackOrder}
        onSelectProduct={(p) => {
          setIsCartOpen(false);
          setSelectedProductModal(p);
        }}
      />

      {/* Track Order Modal (Accessible by Customers) */}
      <TrackOrderModal
        isOpen={isTrackOrderOpen}
        onClose={() => setIsTrackOrderOpen(false)}
        currency={currency}
        initialOrderId={trackOrderIdForModal}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={ALL_PRODUCTS}
        currency={currency}
        onSelectProduct={(p) => setSelectedProductModal(p)}
        onAddToCart={(p) => handleAddToCart(p)}
      />

      {/* Stylist Concierge Modal */}
      <StylistModal
        isOpen={isStylistModalOpen}
        onClose={() => setIsStylistModalOpen(false)}
      />

      {/* Floating 1-Click WhatsApp Support Widget */}
      <FloatingWhatsApp phoneNumber="918238023498" />
    </div>
  );
}
