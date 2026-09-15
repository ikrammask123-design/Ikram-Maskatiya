import { StoreOrder } from '../types';
import { formatWhatsAppPhone } from './orderStorage';

export type WhatsAppNotificationType = 'ORDER_PLACED' | 'ORDER_SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED';

export interface WhatsAppNotificationLog {
  id: string;
  orderId: string;
  recipientPhone: string;
  recipientName: string;
  type: WhatsAppNotificationType;
  message: string;
  waLink: string;
  status: 'sent' | 'queued' | 'simulated';
  timestamp: string;
}

const NOTIFICATIONS_STORAGE_KEY = 'zevioza_whatsapp_logs_v1';

export function getBaseAppUrl(): string {
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return window.location.origin;
  }
  return 'https://zevioza.com';
}

export function getOrderTrackingUrl(orderId: string): string {
  const base = getBaseAppUrl();
  return `${base}/?track=${encodeURIComponent(orderId)}#track`;
}

/**
 * Generates the automated WhatsApp Thank You & 24-Hour Dispatch Message for newly placed orders
 */
export function generateOrderPlacedMessage(order: StoreOrder): string {
  const itemsSummary = order.items
    .map(
      (item) =>
        `• *${item.name}* (Qty: ${item.quantity}${item.selectedColor ? `, Shade: ${item.selectedColor}` : ''}${
          item.selectedSize ? `, Size: ${item.selectedSize}` : ''
        }) - ₹${item.price * item.quantity}`
    )
    .join('\n');

  const paymentDesc =
    order.paymentMethod === 'cod'
      ? `Cash on Delivery (₹${order.total.toLocaleString('en-IN')} cash at doorstep)`
      : order.paymentMethod === 'upi'
      ? 'Instant UPI'
      : 'Prepaid Online';

  const trackingLink = getOrderTrackingUrl(order.id);

  return (
    `Namaste ${order.customer.name} ji! 🙏\n\n` +
    `Thank you for shopping with *Zevioza Luxury Boutique*! ✨\n\n` +
    `Aapka order successfully place ho gaya hai! 🎉\n` +
    `• *Order ID:* #${order.id}\n` +
    `• *Total Amount:* ₹${order.total.toLocaleString('en-IN')}\n` +
    `• *Payment Mode:* ${paymentDesc}\n` +
    `• *Delivery Address:* ${order.customer.address}, ${order.customer.city} (${order.customer.pincode})\n\n` +
    `*Items in your order:*\n${itemsSummary}\n\n` +
    `⚡ *Dispatch Promise:* Aapka order agle 24 ghante (next 24 hours) me hamare Surat hub se hand-pack hokar ship ho jayega!\n` +
    `🚚 *Delivery Timeline:* 4–6 Days across India.\n\n` +
    `🔍 *Live Order Tracking Link:*\n${trackingLink}\n\n` +
    `Aapke order ki tracking details aur courier AWB dispatch hote hi aapko WhatsApp par automate send ho jayegi.\n\n` +
    `Kisi bhi customization ya order assistance ke liye aap isi WhatsApp chat par reply kar sakte hain.\n\n` +
    `Warm regards,\n*Zevioza Luxury Boutique* 🌸`
  );
}

/**
 * Generates the automated WhatsApp Shipment & Tracking Message when order is shipped
 */
export function generateOrderShippedMessage(order: StoreOrder): string {
  const courier = order.courierPartner || 'Express Logistics Partner';
  const awb = order.trackingNumber || 'Assigned / In Transit';
  const trackingLink = getOrderTrackingUrl(order.id);

  const paymentDesc =
    order.paymentStatus === 'paid'
      ? '₹0 (Order Already Paid Online ✅)'
      : `₹${order.total.toLocaleString('en-IN')} (Cash on Delivery to Courier)`;

  return (
    `Namaste ${order.customer.name} ji! 🚚\n\n` +
    `Great news! Aapka Zevioza Boutique Order *#${order.id}* successfully dispatch ho gaya hai! 📦✨\n\n` +
    `*Shipment & Tracking Details:*\n` +
    `• *Courier Partner:* ${courier}\n` +
    `• *Tracking Number (AWB):* ${awb}\n` +
    `• *Dispatch Date:* ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}\n` +
    `• *Delivery Destination:* ${order.customer.city}, ${order.customer.state || 'India'}\n` +
    `• *Amount to Pay:* ${paymentDesc}\n\n` +
    `⚡ *Estimated Delivery:* 4–6 Days me parcel aapke doorstep par deliver ho jayega.\n\n` +
    `🔍 *Live Tracking Link:*\n${trackingLink}\n\n` +
    `Aap upar diye link se apne shipment ki live movement kisi bhi time track kar sakte hain.\n\n` +
    `Kisi bhi query ke liye aap hume yahan WhatsApp par message kar sakte hain.\n\n` +
    `Warm regards,\n*Zevioza Luxury Boutique* 🌸`
  );
}

/**
 * Generates Out for Delivery WhatsApp notification
 */
export function generateOutForDeliveryMessage(order: StoreOrder): string {
  const trackingLink = getOrderTrackingUrl(order.id);
  const paymentDesc =
    order.paymentStatus === 'paid'
      ? 'Prepaid (No cash needed)'
      : `₹${order.total.toLocaleString('en-IN')} Cash on Delivery`;

  return (
    `Namaste ${order.customer.name} ji! 🛵\n\n` +
    `Aapka Zevioza Boutique Order *#${order.id}* aaj deliver hone ke liye *Out for Delivery* hai!\n\n` +
    `• *Destination:* ${order.customer.address}, ${order.customer.city}\n` +
    `• *Payment Due:* ${paymentDesc}\n\n` +
    `Kripya parcel receive karne ke liye available rahein. Courier rider aapko delivery se pehle call karega.\n\n` +
    `🔍 Track Live: ${trackingLink}\n\n` +
    `Warm regards,\n*Zevioza Luxury Boutique*`
  );
}

/**
 * Gets formatted WhatsApp message based on notification type
 */
export function getWhatsAppMessageForType(order: StoreOrder, type: WhatsAppNotificationType): string {
  switch (type) {
    case 'ORDER_PLACED':
      return generateOrderPlacedMessage(order);
    case 'ORDER_SHIPPED':
      return generateOrderShippedMessage(order);
    case 'OUT_FOR_DELIVERY':
      return generateOutForDeliveryMessage(order);
    case 'DELIVERED':
      return (
        `Namaste ${order.customer.name} ji! 🎉\n\n` +
        `Aapka Zevioza Boutique Order *#${order.id}* successfully deliver ho gaya hai! We hope you love your handcrafted ethnic wear piece. ✨\n\n` +
        `Warm regards,\n*Zevioza Luxury Boutique*`
      );
  }
}

export const generateWhatsAppMessage = getWhatsAppMessageForType;

/**
 * Builds universal WhatsApp web/app link
 */
export function buildWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = formatWhatsAppPhone(phone);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}

/**
 * Central Automated WhatsApp Trigger Function
 * 1. Synchronizes with server backend `/api/notifications/whatsapp/send`
 * 2. Stores local activity log
 * 3. Returns direct universal WhatsApp URL for immediate click or preview
 */
export async function sendAutomatedWhatsAppNotification(
  order: StoreOrder,
  type: WhatsAppNotificationType,
  overridePhone?: string
): Promise<{ success: boolean; waLink: string; message: string; log: WhatsAppNotificationLog }> {
  const targetPhone = overridePhone || order.customer.phone;
  const cleanPhone = formatWhatsAppPhone(targetPhone);
  const message = getWhatsAppMessageForType(order, type);
  const waLink = buildWhatsAppLink(cleanPhone, message);

  const logEntry: WhatsAppNotificationLog = {
    id: `WA-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    orderId: order.id,
    recipientPhone: cleanPhone,
    recipientName: order.customer.name,
    type,
    message,
    waLink,
    status: 'sent',
    timestamp: new Date().toISOString(),
  };

  // Save to client log
  try {
    const existingLogs = getLocalWhatsAppLogs();
    const updated = [logEntry, ...existingLogs.slice(0, 99)];
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('zevioza_whatsapp_sent', { detail: logEntry }));
  } catch (err) {
    console.warn('Failed to write WhatsApp log to storage:', err);
  }

  // Dispatch to Central Backend Server API
  try {
    await fetch('/api/notifications/whatsapp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: order.id,
        recipientPhone: cleanPhone,
        recipientName: order.customer.name,
        type,
        message,
        waLink,
        order,
      }),
    });
  } catch (err) {
    console.warn('Server WhatsApp notification sync non-blocking error:', err);
  }

  return {
    success: true,
    waLink,
    message,
    log: logEntry,
  };
}

export function getLocalWhatsAppLogs(): WhatsAppNotificationLog[] {
  try {
    const data = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

export function clearLocalWhatsAppLogs(): void {
  try {
    localStorage.removeItem(NOTIFICATIONS_STORAGE_KEY);
  } catch {}
}

/**
 * Fetches WhatsApp logs from server backend, with local cache fallback
 */
export async function getWhatsAppNotificationLogs(): Promise<WhatsAppNotificationLog[]> {
  try {
    const res = await fetch('/api/notifications/whatsapp/logs');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.logs) && data.logs.length > 0) {
        return data.logs;
      }
    }
  } catch (e) {
    // Fallback to local
  }
  return getLocalWhatsAppLogs();
}

/**
 * Clears WhatsApp logs both locally and on server
 */
export async function clearWhatsAppLogs(): Promise<void> {
  clearLocalWhatsAppLogs();
  try {
    await fetch('/api/notifications/whatsapp/logs', { method: 'DELETE' });
  } catch {}
}
