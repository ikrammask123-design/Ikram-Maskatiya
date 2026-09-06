import { StoreOrder, OrderFulfillmentStatus, PaymentStatus } from '../types';

const STORAGE_KEY = 'zevioza_store_orders_v1';

export const INITIAL_ORDERS: StoreOrder[] = [
  {
    id: 'ZV-774802',
    createdAt: '2026-09-06T12:15:00.000Z',
    isDemo: false,
    customer: {
      name: 'Customer (Order ZV-774802)',
      email: 'customer.zv774802@gmail.com',
      phone: '+91 82380 23498',
      address: 'Direct Storefront Checkout - Placed via Shared Link',
      city: 'Surat',
      state: 'Gujarat',
      pincode: '395002',
      country: 'India',
    },
    items: [
      {
        id: 'item-zv-774802-1',
        productId: 'zv-dress-miss-chase-01',
        name: 'Miss Chase Women Maxi Full Length Dress',
        image: '/Miss Chase  Maxi Yellow - 1.webp',
        price: 2399,
        quantity: 1,
        selectedSize: 'M',
        selectedColor: 'Yellow',
        notes: 'Order placed via storefront',
      },
    ],
    subtotal: 2399,
    discountAmount: 240,
    giftWrapAmount: 0,
    total: 2159,
    currency: 'INR',
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    fulfillmentStatus: 'new',
    transactionId: 'UPI/774802918231@ybl',
    adminNotes: '⚡ REAL STORE ORDER ZV-774802: Placed via storefront by customer. Synced to central database.',
  },
];

const DEMO_CLEARED_KEY = 'zevioza_demo_cleared_v1';
export const OWNER_EMAIL = 'ikrammask123@gmail.com';
export const DEFAULT_ADMIN_PIN = '9825'; // Master PIN: 9825 (or zevioza2026)
const ADMIN_PIN_KEY = 'zevioza_admin_pin_v1';
const ADMIN_AUTH_SESSION_KEY = 'zevioza_admin_auth_active';

// Central server order synchronization
let isSyncingWithServer = false;

const DEMO_ORDER_IDS = new Set(['ZV-928410', 'ZV-849102', 'ZV-729011', 'ZV-610294', 'ZV-501928', 'ZV-TEST01']);

export async function syncOrdersWithServer(): Promise<StoreOrder[]> {
  if (typeof window === 'undefined' || isSyncingWithServer) {
    return getStoredOrders();
  }
  isSyncingWithServer = true;
  try {
    const res = await fetch('/api/orders');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        const local = getStoredOrders();
        // Server orders (filter out demo if any)
        const serverOrders = (data.orders as StoreOrder[]).filter((o) => !o.isDemo && !DEMO_ORDER_IDS.has(o.id));
        const map = new Map<string, StoreOrder>();

        // Populate server orders
        for (const o of serverOrders) {
          map.set(o.id, o);
        }

        // Check if there are local orders not yet on server (ONLY real customer orders)
        const unsyncedLocals = local.filter((o) => !o.isDemo && !DEMO_ORDER_IDS.has(o.id) && !map.has(o.id));
        if (unsyncedLocals.length > 0) {
          fetch('/api/orders/bulk-sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orders: unsyncedLocals }),
          }).catch((e) => console.warn('Bulk sync error', e));

          for (const u of unsyncedLocals) {
            map.set(u.id, u);
          }
        }

        const merged = Array.from(map.values()).filter((o) => !o.isDemo && !DEMO_ORDER_IDS.has(o.id));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        window.dispatchEvent(new CustomEvent('zevioza_order_updated', { detail: merged }));
        return merged;
      }
    }
  } catch (err) {
    console.warn('Central server sync offline/delayed:', err);
  } finally {
    isSyncingWithServer = false;
  }
  return getStoredOrders();
}

// Auto-trigger sync on initial load and window focus
if (typeof window !== 'undefined') {
  setTimeout(() => {
    syncOrdersWithServer();
  }, 100);

  window.addEventListener('focus', () => {
    syncOrdersWithServer();
  });
}

export function getStoredOrders(): StoreOrder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const demoCleared = localStorage.getItem(DEMO_CLEARED_KEY) === 'true';

    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Strip out any demo orders automatically
        const realOrders = parsed.filter((o: StoreOrder) => !o.isDemo && !DEMO_ORDER_IDS.has(o.id));
        if (realOrders.length > 0 || demoCleared) {
          return realOrders;
        }
      }
    }

    // Default to INITIAL_ORDERS (real orders only)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
    return INITIAL_ORDERS;
  } catch (e) {
    console.error('Failed to load orders from localStorage', e);
    return [];
  }
}

const LAST_PLACED_ORDER_KEY = 'zevioza_last_placed_order_id';

export function getLastPlacedOrderId(): string | null {
  try {
    return localStorage.getItem(LAST_PLACED_ORDER_KEY);
  } catch {
    return null;
  }
}

export function findOrderForTracking(query: string): StoreOrder | undefined {
  if (!query || !query.trim()) return undefined;
  const cleanQuery = query.trim();
  const upper = cleanQuery.toUpperCase();
  const digitsOnly = cleanQuery.replace(/\D/g, '');
  const allOrders = getStoredOrders();

  return allOrders.find((order) => {
    // Exact ID or without "ZV-" prefix
    if (order.id.toUpperCase() === upper) return true;
    if (order.id.replace(/^ZV-?/i, '').toUpperCase() === upper.replace(/^ZV-?/i, '')) return true;

    // Tracking / AWB number
    if (order.trackingNumber && order.trackingNumber.toUpperCase() === upper) return true;

    // Phone number match (last 10 digits or 8 digits)
    if (digitsOnly.length >= 8 && order.customer.phone) {
      const orderPhoneDigits = order.customer.phone.replace(/\D/g, '');
      if (orderPhoneDigits.endsWith(digitsOnly) || digitsOnly.endsWith(orderPhoneDigits)) {
        return true;
      }
    }

    // Email match
    if (cleanQuery.includes('@') && order.customer.email) {
      if (order.customer.email.toLowerCase() === cleanQuery.toLowerCase()) {
        return true;
      }
    }

    return false;
  });
}

export async function saveOrderToStoreAsync(order: StoreOrder): Promise<void> {
  try {
    const existing = getStoredOrders();
    const orderWithFlag: StoreOrder = {
      ...order,
      isDemo: false,
    };
    const updated = [orderWithFlag, ...existing.filter((o) => o.id !== order.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(LAST_PLACED_ORDER_KEY, order.id);
    window.dispatchEvent(new CustomEvent('zevioza_order_updated', { detail: orderWithFlag }));

    // Await server registration so order is guaranteed in central database
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderWithFlag),
      });
      if (res.ok) {
        console.log(`[Order Central] Successfully registered ${order.id} on server`);
      }
    } catch (netErr) {
      console.warn('Central server async registration error (cached locally):', netErr);
    }
  } catch (e) {
    console.error('Failed to save order to localStorage', e);
  }
}

export function saveOrderToStore(order: StoreOrder): void {
  saveOrderToStoreAsync(order);
}

export function clearAllDemoOrders(): StoreOrder[] {
  try {
    const existing = getStoredOrders();
    const onlyRealOrders = existing.filter((o) => !o.isDemo && !DEMO_ORDER_IDS.has(o.id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(onlyRealOrders));
    localStorage.setItem(DEMO_CLEARED_KEY, 'true');
    window.dispatchEvent(new CustomEvent('zevioza_order_updated'));

    // Call server to purge demo orders permanently
    fetch('/api/orders/clear-demo', { method: 'POST' }).catch((e) => console.warn('Failed to clear demo orders on server:', e));

    return onlyRealOrders;
  } catch (e) {
    console.error('Failed to clear demo orders', e);
    return [];
  }
}

export function clearAllOrders(): StoreOrder[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    localStorage.setItem(DEMO_CLEARED_KEY, 'true');
    window.dispatchEvent(new CustomEvent('zevioza_order_updated'));
    return [];
  } catch (e) {
    console.error('Failed to clear all orders', e);
    return [];
  }
}

export function resetToDefaultOrders(): StoreOrder[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
    localStorage.removeItem(DEMO_CLEARED_KEY);
    window.dispatchEvent(new CustomEvent('zevioza_order_updated'));
    return INITIAL_ORDERS;
  } catch (e) {
    return INITIAL_ORDERS;
  }
}

export function updateOrderFulfillment(orderId: string, fulfillmentStatus: OrderFulfillmentStatus): StoreOrder[] {
  try {
    const existing = getStoredOrders();
    const updated = existing.map((o) => (o.id === orderId ? { ...o, fulfillmentStatus } : o));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('zevioza_order_updated'));

    // Sync update to server
    fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fulfillmentStatus }),
    }).catch((err) => console.warn('Failed to sync fulfillment update to server:', err));

    return updated;
  } catch (e) {
    console.error('Failed to update order fulfillment', e);
    return getStoredOrders();
  }
}

export function updateOrderPayment(orderId: string, paymentStatus: PaymentStatus, txnId?: string): StoreOrder[] {
  try {
    const existing = getStoredOrders();
    const updated = existing.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          paymentStatus,
          transactionId: txnId || o.transactionId || `MANUAL-${Date.now()}`,
        };
      }
      return o;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('zevioza_order_updated'));

    // Sync payment update to server
    fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentStatus,
        transactionId: txnId || `MANUAL-${Date.now()}`,
      }),
    }).catch((err) => console.warn('Failed to sync payment update to server:', err));

    return updated;
  } catch (e) {
    console.error('Failed to update order payment', e);
    return getStoredOrders();
  }
}

export function updateOrderDetails(orderId: string, updates: Partial<StoreOrder>): StoreOrder[] {
  try {
    const existing = getStoredOrders();
    const updated = existing.map((o) => (o.id === orderId ? { ...o, ...updates } : o));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('zevioza_order_updated'));

    // Sync details update to server
    fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    }).catch((err) => console.warn('Failed to sync order details to server:', err));

    return updated;
  } catch (e) {
    console.error('Failed to update order details', e);
    return getStoredOrders();
  }
}

export function deleteStoredOrder(orderId: string): StoreOrder[] {
  try {
    const existing = getStoredOrders();
    const updated = existing.filter((o) => o.id !== orderId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('zevioza_order_updated'));

    // Sync delete to server
    fetch(`/api/orders/${orderId}`, {
      method: 'DELETE',
    }).catch((err) => console.warn('Failed to sync delete to server:', err));

    return updated;
  } catch (e) {
    console.error('Failed to delete order', e);
    return getStoredOrders();
  }
}

// --- ADMIN SECURITY & AUTHENTICATION METHODS ---

export function getAdminPin(): string {
  try {
    return localStorage.getItem(ADMIN_PIN_KEY) || DEFAULT_ADMIN_PIN;
  } catch {
    return DEFAULT_ADMIN_PIN;
  }
}

export function setAdminPin(newPin: string): boolean {
  try {
    if (!newPin || newPin.trim().length < 4) return false;
    localStorage.setItem(ADMIN_PIN_KEY, newPin.trim());
    return true;
  } catch {
    return false;
  }
}

export function verifyAdminPin(enteredPin: string): boolean {
  if (!enteredPin) return false;
  const currentPin = getAdminPin();
  // Allow configured PIN, or fallback master password 'zevioza2026'
  return enteredPin.trim() === currentPin || enteredPin.trim() === 'zevioza2026';
}

export function isAdminSessionActive(): boolean {
  try {
    // Check sessionStorage first (temporary tab session) or localStorage (persistent)
    const sessionActive = sessionStorage.getItem(ADMIN_AUTH_SESSION_KEY) === 'true';
    const localActive = localStorage.getItem(ADMIN_AUTH_SESSION_KEY) === 'true';
    return sessionActive || localActive;
  } catch {
    return false;
  }
}

export function setAdminSession(active: boolean, remember: boolean = false): void {
  try {
    if (active) {
      sessionStorage.setItem(ADMIN_AUTH_SESSION_KEY, 'true');
      if (remember) {
        localStorage.setItem(ADMIN_AUTH_SESSION_KEY, 'true');
      } else {
        localStorage.removeItem(ADMIN_AUTH_SESSION_KEY);
      }
    } else {
      sessionStorage.removeItem(ADMIN_AUTH_SESSION_KEY);
      localStorage.removeItem(ADMIN_AUTH_SESSION_KEY);
    }
  } catch (e) {
    console.error('Failed to update admin session', e);
  }
}

export function logoutAdmin(): void {
  setAdminSession(false, false);
}
