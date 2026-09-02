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
import { CategoryId, Product, CartItem, Currency, NotificationItem } from './types';
import { PRODUCTS, INITIAL_NOTIFICATIONS } from './data/products';

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
      if (
        searchParams.get('admin') === 'true' ||
        searchParams.get('owner') === 'true' ||
        searchParams.get('admin') === '9825' ||
        searchParams.get('portal') === 'owner' ||
        hash === '#admin' ||
        hash === '#owner' ||
        hash === '#portal'
      ) {
        setActiveTab('admin');
      }
    };

    checkPrivateAdminRoute();
    window.addEventListener('hashchange', checkPrivateAdminRoute);

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
    if (window.location.hash === '#admin' || window.location.hash === '#owner') {
      try {
        window.history.replaceState(null, '', window.location.pathname);
      } catch {
        // ignore if iframe security restriction
      }
    }
    setActiveTab('home');
  };

  // Cart State (Initialized with 1 flagship item to showcase high-fidelity experience)
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'cart-init-1',
      productId: 'zv-01',
      product: PRODUCTS[0],
      quantity: 1,
      selectedSize: 'Free Size (Includes Blouse Piece)',
      customStitching: true,
      notes: 'Bust: 34", Gold piping along neckline',
    },
  ]);

  // Wishlist State
  const [wishlistIds, setWishlistIds] = useState<string[]>(['zv-01', 'zv-04']);

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
  const wishlistedProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));

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
        products={PRODUCTS}
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
