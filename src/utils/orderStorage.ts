import { StoreOrder, OrderFulfillmentStatus, PaymentStatus } from '../types';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';

const STORAGE_KEY = 'zevioza_store_orders_v1';

export const INITIAL_ORDERS: StoreOrder[] = [
  {
    id: 'ZV-774802',
    createdAt: '2026-09-06T12:15:00.000Z',
    isDemo: false,
    customer: {
      name: 'Customer (Order ZV-774802)',
      email: 'customer.zv774802@gmail.com',
      phone: '+91 98250 00000',
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
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    fulfillmentStatus: 'new',
    adminNotes: 'COD Order: Collect ₹2,159 cash on delivery. Placed via storefront by customer.',
  },
];

const DEMO_CLEARED_KEY = 'zevioza_demo_cleared_v1';
export const OWNER_EMAIL = 'ikrammask123@gmail.com';
export const DEFAULT_ADMIN_PIN = '9825'; // Master PIN: 9825 (or zevioza2026)
const ADMIN_PIN_KEY = 'zevioza_admin_pin_v1';
const ADMIN_AUTH_SESSION_KEY = 'zevioza_admin_auth_active';

const DEMO_ORDER_IDS = new Set(['ZV-928410', 'ZV-849102', 'ZV-729011', 'ZV-610294', 'ZV-501928', 'ZV-TEST01']);

let isSyncingWithServer = false;

/**
 * Recursively removes undefined fields and prepares document for Firebase Firestore.
 * Firestore strictly rejects documents that contain any field with an `undefined` value.
 */
export function cleanForFirestore<T>(data: T): T {
  if (data === null || data === undefined) {
    return null as unknown as T;
  }
  return JSON.parse(JSON.stringify(data));
}

/**
 * Real-time subscription to Firestore orders collection.
 * Triggers callback immediately whenever any device creates or updates an order.
 */
export function subscribeToFirestoreOrders(callback: (orders: StoreOrder[]) => void): () => void {
  try {
    const ordersCol = collection(db, 'orders');
    return onSnapshot(
      ordersCol,
      (snapshot) => {
        const remoteOrders: StoreOrder[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as StoreOrder;
          if (data && data.id && !data.isDemo && !DEMO_ORDER_IDS.has(data.id)) {
            remoteOrders.push(data);
          }
        });

        // Sort descending by createdAt
        remoteOrders.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

        // Check if there are local orders not yet on Firestore (upload them automatically)
        const local = getStoredOrders();
        const map = new Map<string, StoreOrder>();
        for (const o of remoteOrders) {
          map.set(o.id, o);
        }
        for (const l of local) {
          if (!map.has(l.id) && !l.isDemo && !DEMO_ORDER_IDS.has(l.id)) {
            map.set(l.id, l);
            // Push missing local order to Firestore in background
            setDoc(doc(db, 'orders', l.id), cleanForFirestore(l)).catch(() => {});
          }
        }

        const merged = Array.from(map.values()).sort(
          (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );

        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        callback(merged);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'orders');
        callback(getStoredOrders());
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'orders');
    callback(getStoredOrders());
    return () => {};
  }
}

/**
 * Synchronize orders with Firebase Firestore and central backend
 */
export async function syncOrdersWithServer(): Promise<StoreOrder[]> {
  if (typeof window === 'undefined' || isSyncingWithServer) {
    return getStoredOrders();
  }
  isSyncingWithServer = true;
  try {
    // 1. Fetch live orders from Firestore
    const querySnapshot = await getDocs(collection(db, 'orders'));
    const firestoreOrders: StoreOrder[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as StoreOrder;
      if (data && data.id && !data.isDemo && !DEMO_ORDER_IDS.has(data.id)) {
        firestoreOrders.push(data);
      }
    });

    const local = getStoredOrders();
    const map = new Map<string, StoreOrder>();

    for (const o of firestoreOrders) {
      map.set(o.id, o);
    }

    // 2. Check if local has any orders not in Firestore (e.g. from prior checkout session)
    const unsyncedLocals = local.filter((o) => !o.isDemo && !DEMO_ORDER_IDS.has(o.id) && !map.has(o.id));
    for (const unsynced of unsyncedLocals) {
      map.set(unsynced.id, unsynced);
      try {
        await setDoc(doc(db, 'orders', unsynced.id), cleanForFirestore(unsynced));
      } catch (err) {
        console.warn('Failed to upload unsynced order to Firestore:', err);
      }
    }

    // 3. Fallback sync to express endpoint
    try {
      fetch('/api/orders/bulk-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders: Array.from(map.values()) }),
      }).catch(() => {});
    } catch {}

    const merged = Array.from(map.values())
      .filter((o) => !o.isDemo && !DEMO_ORDER_IDS.has(o.id))
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    window.dispatchEvent(new CustomEvent('zevioza_order_updated', { detail: merged }));
    return merged;
  } catch (err) {
    console.warn('Firestore sync failed, falling back to local cache:', err);
    return getStoredOrders();
  } finally {
    isSyncingWithServer = false;
  }
}

// Auto-trigger sync on initial load and window focus
if (typeof window !== 'undefined') {
  setTimeout(() => {
    syncOrdersWithServer();
    syncAdminPinFromCloud();
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
        const realOrders = parsed.filter((o: StoreOrder) => !o.isDemo && !DEMO_ORDER_IDS.has(o.id));
        if (realOrders.length > 0 || demoCleared) {
          return realOrders;
        }
      }
    }

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
    if (order.id.toUpperCase() === upper) return true;
    if (order.id.replace(/^ZV-?/i, '').toUpperCase() === upper.replace(/^ZV-?/i, '')) return true;
    if (order.trackingNumber && order.trackingNumber.toUpperCase() === upper) return true;
    if (digitsOnly.length >= 8 && order.customer.phone) {
      const orderPhoneDigits = order.customer.phone.replace(/\D/g, '');
      if (orderPhoneDigits.endsWith(digitsOnly) || digitsOnly.endsWith(orderPhoneDigits)) {
        return true;
      }
    }
    if (cleanQuery.includes('@') && order.customer.email) {
      if (order.customer.email.toLowerCase() === cleanQuery.toLowerCase()) {
        return true;
      }
    }
    return false;
  });
}

export async function findOrderForTrackingAsync(query: string): Promise<StoreOrder | undefined> {
  const local = findOrderForTracking(query);
  if (local) return local;

  const cleanQuery = query.trim().toUpperCase();
  try {
    const docSnap = await getDoc(doc(db, 'orders', cleanQuery));
    if (docSnap.exists()) {
      const order = docSnap.data() as StoreOrder;
      saveOrderToStore(order);
      return order;
    }
  } catch (e) {
    handleFirestoreError(e, OperationType.GET, `orders/${cleanQuery}`);
  }

  try {
    await syncOrdersWithServer();
    return findOrderForTracking(query);
  } catch {
    return undefined;
  }
}

/**
 * Save an order to both Firestore Cloud and local client cache
 */
export async function saveOrderToStoreAsync(order: StoreOrder): Promise<void> {
  const orderWithFlag: StoreOrder = {
    ...order,
    isDemo: false,
  };

  // 1. Instant local storage update
  try {
    const existing = getStoredOrders();
    const updated = [orderWithFlag, ...existing.filter((o) => o.id !== order.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(LAST_PLACED_ORDER_KEY, order.id);
    window.dispatchEvent(new CustomEvent('zevioza_order_updated', { detail: orderWithFlag }));
  } catch (e) {
    console.error('Failed to save order to localStorage', e);
  }

  // 2. Persist to Firestore Live Cloud Database
  try {
    const sanitized = cleanForFirestore(orderWithFlag);
    await setDoc(doc(db, 'orders', order.id), sanitized);
    console.log(`[Firestore Live Database] Order ${order.id} committed to cloud!`);
  } catch (firestoreErr) {
    handleFirestoreError(firestoreErr, OperationType.WRITE, `orders/${order.id}`);
  }

  // 3. Central server backup & notify
  try {
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cleanForFirestore(orderWithFlag)),
    }).catch(() => {});
  } catch {}
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

    // Live Cloud Update
    setDoc(doc(db, 'orders', orderId), cleanForFirestore({ fulfillmentStatus }), { merge: true }).catch((e) => {
      handleFirestoreError(e, OperationType.UPDATE, `orders/${orderId}`);
    });

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
    const transactionId = txnId || `MANUAL-${Date.now()}`;
    const existing = getStoredOrders();
    const updated = existing.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          paymentStatus,
          transactionId: txnId || o.transactionId || transactionId,
        };
      }
      return o;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('zevioza_order_updated'));

    const payload = {
      paymentStatus,
      transactionId,
    };

    // Live Cloud Update
    setDoc(doc(db, 'orders', orderId), cleanForFirestore(payload), { merge: true }).catch((e) => {
      handleFirestoreError(e, OperationType.UPDATE, `orders/${orderId}`);
    });

    fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
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

    // Live Cloud Update
    setDoc(doc(db, 'orders', orderId), cleanForFirestore(updates), { merge: true }).catch((e) => {
      handleFirestoreError(e, OperationType.UPDATE, `orders/${orderId}`);
    });

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

export function updateOrderCustomer(orderId: string, customerUpdates: Partial<StoreOrder['customer']>): StoreOrder[] {
  try {
    const existing = getStoredOrders();
    const target = existing.find((o) => o.id === orderId);
    if (!target) return existing;

    const mergedCustomer = {
      ...target.customer,
      ...customerUpdates,
    };

    return updateOrderDetails(orderId, { customer: mergedCustomer });
  } catch (e) {
    console.error('Failed to update order customer', e);
    return getStoredOrders();
  }
}

export function formatWhatsAppPhone(phone: string): string {
  let clean = phone.replace(/\D/g, '');
  clean = clean.replace(/^0+/, '');
  if (clean.length === 10) {
    clean = `91${clean}`;
  }
  return clean;
}

export function deleteStoredOrder(orderId: string): StoreOrder[] {
  try {
    const existing = getStoredOrders();
    const updated = existing.filter((o) => o.id !== orderId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('zevioza_order_updated'));

    // Live Cloud Delete
    deleteDoc(doc(db, 'orders', orderId)).catch((e) => {
      handleFirestoreError(e, OperationType.DELETE, `orders/${orderId}`);
    });

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

export async function syncAdminPinFromCloud(): Promise<string> {
  try {
    const docSnap = await getDoc(doc(db, 'admin_settings', 'security'));
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && data.pin) {
        localStorage.setItem(ADMIN_PIN_KEY, data.pin);
        return data.pin;
      }
    }
  } catch (e) {
    console.warn('Could not sync admin PIN from cloud:', e);
  }
  return getAdminPin();
}

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
    const cleanPin = newPin.trim();
    localStorage.setItem(ADMIN_PIN_KEY, cleanPin);

    // Sync to Firestore cloud
    setDoc(
      doc(db, 'admin_settings', 'security'),
      {
        pin: cleanPin,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    ).catch(() => {});

    return true;
  } catch {
    return false;
  }
}

export function verifyAdminPin(enteredPin: string): boolean {
  if (!enteredPin) return false;
  const currentPin = getAdminPin();
  return enteredPin.trim() === currentPin || enteredPin.trim() === 'zevioza2026';
}

export function isAdminSessionActive(): boolean {
  try {
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
