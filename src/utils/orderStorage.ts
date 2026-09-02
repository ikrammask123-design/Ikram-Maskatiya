import { StoreOrder, OrderFulfillmentStatus, PaymentStatus } from '../types';

const STORAGE_KEY = 'zevioza_store_orders_v1';

export const INITIAL_ORDERS: StoreOrder[] = [
  {
    id: 'ZV-928410',
    createdAt: '2026-09-02T14:15:00.000Z',
    isDemo: true,
    customer: {
      name: 'Kritika Sen (Demo Sample)',
      email: 'kritika.sen@gmail.com',
      phone: '+91 98112 45678',
      address: 'Flat 402, Shanti Heights, Greater Kailash 2',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110048',
      country: 'India',
    },
    items: [
      {
        id: 'item-mc-1',
        productId: 'zv-dress-miss-chase-01',
        name: 'Miss Chase Women Maxi Full Length Dress',
        image: '/Miss Chase  Maxi Yellow - 1.webp',
        price: 2399,
        quantity: 1,
        selectedSize: 'M',
        selectedColor: 'Yellow',
        notes: 'Gift wrap requested with personal card',
      },
    ],
    subtotal: 2399,
    discountAmount: 0,
    giftWrapAmount: 500,
    total: 2899,
    currency: 'INR',
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    fulfillmentStatus: 'shipped',
    transactionId: 'UPI/428190382910@ybl',
    courierPartner: 'BlueDart Air',
    trackingNumber: 'BD-DEL-9481920',
    adminNotes: 'Sample Order: Packed in signature luxury gift box with yellow ribbon.',
  },
  {
    id: 'ZV-849102',
    createdAt: '2026-09-01T17:40:00.000Z',
    isDemo: true,
    customer: {
      name: 'Ananya Sharma (Demo Sample)',
      email: 'ananya.sharma@example.com',
      phone: '+91 98765 43210',
      address: '42, Gulmohar Enclave, Malabar Hill',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400006',
      country: 'India',
    },
    items: [
      {
        id: 'item-saree-1',
        productId: 'zv-01',
        name: 'Rose Petal Silk Saree (Pure Mulberry Silk)',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATPfJM-tzK8EEXMRvtRBauTg1BNTOSW1kZ7yuPSOjKtQ84msbvFkfOGgdeyuhTemMclnGCdXdJ1YXwNrEoQikqqHkCsYwGZAmxOIqbKZzZkNQY2hx73kheDa7cyq5f3GWn7Tmv-OPCB0Q9doUTtY5G2BzsNDPVHS7PbdMo2wDYpJuvZoU-FWF34iLTEfZUWS9cZP89YiZJVIaq4cJtzqDF2RMgijet8LR2ADfj5zPh5UQ9azgspWZNkQ',
        price: 35500,
        quantity: 1,
        selectedSize: 'Free Size (Includes Blouse Piece)',
        selectedColor: 'Gulabi Rose',
        customStitching: true,
        notes: 'Bust: 34", Gold piping along sweetheart neckline',
      },
    ],
    subtotal: 38000,
    discountAmount: 3800,
    giftWrapAmount: 0,
    total: 34200,
    currency: 'INR',
    paymentMethod: 'razorpay',
    paymentStatus: 'paid',
    fulfillmentStatus: 'processing',
    transactionId: 'pay_Oz9381Ka83921',
    courierPartner: 'DTDC Premium Express',
    trackingNumber: 'DTDC-BOM-820192',
    adminNotes: 'Sample Order: Master artisan tailor assigned for custom blouse stitching.',
  },
  {
    id: 'ZV-729011',
    createdAt: '2026-09-01T11:20:00.000Z',
    isDemo: true,
    customer: {
      name: 'Riya Patel (Demo Sample)',
      email: 'riya.patel22@yahoo.com',
      phone: '+91 97234 11890',
      address: 'B-203, Orchid Harmony, Near Iscon Cross Road, SG Highway',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380015',
      country: 'India',
    },
    items: [
      {
        id: 'item-tckty-1',
        productId: 'zv-dress-tckty-purple-01',
        name: 'tckty Women Maxi Purple Midi/Calf Length Dress',
        image: '/tckty Women Maxi - 1.webp',
        price: 1799,
        quantity: 1,
        selectedSize: 'L',
        selectedColor: 'Purple Floral',
      },
    ],
    subtotal: 1799,
    discountAmount: 180,
    giftWrapAmount: 0,
    total: 1619,
    currency: 'INR',
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    fulfillmentStatus: 'new',
    adminNotes: 'Sample Order: Customer requested delivery before Saturday. Cash to be collected by delivery partner.',
  },
  {
    id: 'ZV-610294',
    createdAt: '2026-08-30T16:05:00.000Z',
    isDemo: true,
    customer: {
      name: 'Sunita Agarwal (Demo Sample)',
      email: 'sunita.ag@outlook.com',
      phone: '+91 94140 88231',
      address: '15, Civil Lines, Near Raj Mandir Cinema',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302006',
      country: 'India',
    },
    items: [
      {
        id: 'item-sethia-pink',
        productId: 'zv-kurti-sethia-pink-01',
        name: 'HOUSE OF SETHIA Women Cotton Blend Kurta Set',
        image: '/HOUSE OF SETHIA Pink -1.webp',
        price: 3499,
        quantity: 1,
        selectedSize: 'L',
        selectedColor: 'Baby Pink Embroidered',
      },
    ],
    subtotal: 3499,
    discountAmount: 350,
    giftWrapAmount: 0,
    total: 3149,
    currency: 'INR',
    paymentMethod: 'razorpay',
    paymentStatus: 'paid',
    fulfillmentStatus: 'delivered',
    transactionId: 'pay_Netbank_SBIN_9921',
    courierPartner: 'Delhivery Surface',
    trackingNumber: 'DEL-JAI-1029381',
    adminNotes: 'Sample Order: Delivered successfully. Customer rated 5 stars.',
  },
  {
    id: 'ZV-501928',
    createdAt: '2026-08-28T09:12:00.000Z',
    isDemo: true,
    customer: {
      name: 'Pooja Shah (Demo Sample)',
      email: 'pooja.shah@gmail.com',
      phone: '+91 98250 99124',
      address: '701, Riverfront Heights, Adajan',
      city: 'Surat',
      state: 'Gujarat',
      pincode: '395009',
      country: 'India',
    },
    items: [
      {
        id: 'item-lehenga-1',
        productId: 'zv-dress-stitched-lehenga-green-01',
        name: 'Stitched Light Green Georgette Designer Lehenga Set',
        image: '/Stitched Lehenga (Light Green.webp',
        price: 8999,
        quantity: 1,
        selectedSize: 'Free Size (Semi-Stitched Choli)',
        selectedColor: 'Mint & Gold Sage',
      },
    ],
    subtotal: 8999,
    discountAmount: 900,
    giftWrapAmount: 500,
    total: 8599,
    currency: 'INR',
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    fulfillmentStatus: 'delivered',
    transactionId: 'UPI/591820491823@okaxis',
    courierPartner: 'BlueDart Apex',
    trackingNumber: 'BD-SUR-771928',
    adminNotes: 'Sample Order: Bridal express shipment delivered on time.',
  },
];

const DEMO_CLEARED_KEY = 'zevioza_demo_cleared_v1';
export const OWNER_EMAIL = 'ikrammask123@gmail.com';
export const DEFAULT_ADMIN_PIN = '9825'; // Master PIN: 9825 (or zevioza2026)
const ADMIN_PIN_KEY = 'zevioza_admin_pin_v1';
const ADMIN_AUTH_SESSION_KEY = 'zevioza_admin_auth_active';

export function getStoredOrders(): StoreOrder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const demoCleared = localStorage.getItem(DEMO_CLEARED_KEY) === 'true';

    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }

    // If never initialized and demo not explicitly cleared, load initial demo orders
    if (!demoCleared) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }

    return [];
  } catch (e) {
    console.error('Failed to load orders from localStorage', e);
    return [];
  }
}

export function saveOrderToStore(order: StoreOrder): void {
  try {
    const existing = getStoredOrders();
    // Prepend new order, mark as real order (not demo) if not specified
    const orderWithFlag: StoreOrder = {
      ...order,
      isDemo: order.isDemo ?? false,
    };
    const updated = [orderWithFlag, ...existing.filter((o) => o.id !== order.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // Dispatch custom window event so any open admin view updates automatically
    window.dispatchEvent(new CustomEvent('zevioza_order_updated', { detail: orderWithFlag }));
  } catch (e) {
    console.error('Failed to save order to localStorage', e);
  }
}

export function clearAllDemoOrders(): StoreOrder[] {
  try {
    const existing = getStoredOrders();
    const onlyRealOrders = existing.filter((o) => !o.isDemo);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(onlyRealOrders));
    localStorage.setItem(DEMO_CLEARED_KEY, 'true');
    window.dispatchEvent(new CustomEvent('zevioza_order_updated'));
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
