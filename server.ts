import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import {
  getShiprocketToken,
  createShiprocketOrder,
  assignCourierAndAwb,
  trackShipment,
} from './server/shiprocket';

// Safely derive directory name in both ESM (tsx) and CJS (bundled esbuild) environments
const serverFilename = typeof __filename !== 'undefined' ? __filename : process.cwd();
const serverDirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(serverFilename);

const DATA_DIR = path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const WA_LOGS_FILE = path.join(DATA_DIR, 'whatsapp_logs.json');
let inMemoryOrders: any[] = [];
let inMemoryWaLogs: any[] = [];

function ensureDataDir(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(ORDERS_FILE)) {
      fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
    if (!fs.existsSync(WA_LOGS_FILE)) {
      fs.writeFileSync(WA_LOGS_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('Filesystem access limited, using in-memory store:', err);
  }
}

function readWaLogs(): any[] {
  try {
    ensureDataDir();
    if (fs.existsSync(WA_LOGS_FILE)) {
      const data = fs.readFileSync(WA_LOGS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        inMemoryWaLogs = parsed;
        return parsed;
      }
    }
    return inMemoryWaLogs;
  } catch (err) {
    return inMemoryWaLogs;
  }
}

function writeWaLogs(logs: any[]): boolean {
  inMemoryWaLogs = logs;
  try {
    ensureDataDir();
    fs.writeFileSync(WA_LOGS_FILE, JSON.stringify(logs, null, 2), 'utf-8');
    return true;
  } catch (err) {
    return false;
  }
}

function formatPhoneForWhatsApp(phone: string): string {
  let clean = (phone || '').replace(/\D/g, '').replace(/^0+/, '');
  if (clean.length === 10) clean = `91${clean}`;
  return clean;
}

function buildWaText(order: any, type: string): string {
  const customerName = order.customer?.name || 'Customer';
  const orderId = order.id;
  const total = order.total || 0;
  const trackingUrl = `https://zevioza.com/?track=${encodeURIComponent(orderId)}#track`;

  if (type === 'ORDER_PLACED') {
    const itemsList = (order.items || [])
      .map((i: any) => `• *${i.name}* (Qty: ${i.quantity}) - ₹${i.price * i.quantity}`)
      .join('\n');

    return (
      `Namaste ${customerName} ji! 🙏\n\n` +
      `Thank you for shopping with *Zevioza Luxury Boutique*! ✨\n\n` +
      `Aapka order successfully place ho gaya hai! 🎉\n` +
      `• *Order ID:* #${orderId}\n` +
      `• *Total Amount:* ₹${total.toLocaleString('en-IN')} (${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Prepaid Online'})\n` +
      `• *Delivery Address:* ${order.customer?.address || ''}, ${order.customer?.city || ''} (${order.customer?.pincode || ''})\n\n` +
      `*Ordered Items:*\n${itemsList}\n\n` +
      `⚡ *Dispatch Promise:* Aapka order agle 24 ghante (next 24 hours) me hamare Surat hub se pack hokar ship ho jayega!\n` +
      `🚚 *Estimated Delivery:* 4–6 Days across India.\n\n` +
      `🔍 *Live Order Tracking Link:*\n${trackingUrl}\n\n` +
      `Order ship hote hi courier AWB number aapko WhatsApp par update kiya jayega.\n\n` +
      `Warm regards,\n*Zevioza Luxury Boutique* 🌸`
    );
  }

  if (type === 'ORDER_SHIPPED') {
    const courier = order.courierPartner || 'Express Air Partner';
    const awb = order.trackingNumber || 'Assigned';

    return (
      `Namaste ${customerName} ji! 🚚\n\n` +
      `Great news! Aapka Zevioza Boutique Order *#${orderId}* successfully dispatch ho gaya hai! 📦✨\n\n` +
      `*Shipment & Tracking Details:*\n` +
      `• *Courier Partner:* ${courier}\n` +
      `• *Tracking Number (AWB):* ${awb}\n` +
      `• *Delivery City:* ${order.customer?.city || ''}\n` +
      `• *Amount to Pay:* ${order.paymentStatus === 'paid' ? '₹0 (Paid Online ✅)' : `₹${total.toLocaleString('en-IN')} (COD)`}\n\n` +
      `⚡ *Estimated Delivery:* 4–6 Days me parcel aapke doorstep par deliver hoga.\n\n` +
      `🔍 *Live Tracking Link:*\n${trackingUrl}\n\n` +
      `Warm regards,\n*Zevioza Luxury Boutique* 🌸`
    );
  }

  return `Namaste ${customerName} ji! Update regarding your Zevioza Order #${orderId}. Track here: ${trackingUrl}`;
}

function recordWaLog(order: any, type: string, recipientPhone?: string) {
  try {
    const phone = formatPhoneForWhatsApp(recipientPhone || order.customer?.phone || '');
    if (!phone || phone.length < 10) return null;

    const message = buildWaText(order, type);
    const waLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    const log = {
      id: `WA-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      orderId: order.id,
      recipientPhone: phone,
      recipientName: order.customer?.name || 'Customer',
      type,
      message,
      waLink,
      status: 'sent',
      timestamp: new Date().toISOString(),
    };

    const logs = readWaLogs();
    logs.unshift(log);
    writeWaLogs(logs.slice(0, 200));

    console.log(`[WhatsApp Automated Notification] Dispatched [${type}] for Order ${order.id} to +${phone}`);
    return log;
  } catch (err) {
    console.error('Error logging WhatsApp notification:', err);
    return null;
  }
}

function readOrders(): any[] {
  try {
    ensureDataDir();
    if (fs.existsSync(ORDERS_FILE)) {
      const data = fs.readFileSync(ORDERS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        inMemoryOrders = parsed;
        return parsed;
      }
    }
    return inMemoryOrders;
  } catch (err) {
    console.error('Error reading orders from disk, falling back to memory:', err);
    return inMemoryOrders;
  }
}

function writeOrders(orders: any[]): boolean {
  inMemoryOrders = orders;
  try {
    ensureDataDir();
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing orders to disk, cached in memory:', err);
    return false;
  }
}

const DEMO_IDS = new Set([
  'ZV-928410',
  'ZV-849102',
  'ZV-729011',
  'ZV-610294',
  'ZV-501928',
  'ZV-TEST01',
  'ZV-236526',
  'ZV-343192',
  'ZV-346370',
  'ZV-613665',
  'ZV-774802',
]);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Parse JSON payloads up to 10MB
  app.use(express.json({ limit: '10mb' }));

  // CORS headers for seamless cross-client access
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Health check
  app.get('/api/health', (req, res) => {
    const orders = readOrders();
    const clean = orders.filter((o) => !o.isDemo && !DEMO_IDS.has(o.id));
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      orderCount: clean.length,
    });
  });

  // GET /api/orders - Fetch all orders from central store (always filtered)
  app.get('/api/orders', (req, res) => {
    const orders = readOrders();
    const cleanOrders = orders.filter((o) => !o.isDemo && !DEMO_IDS.has(o.id));
    res.json({ success: true, orders: cleanOrders });
  });

  // POST /api/orders - Create or register an order centrally
  app.post('/api/orders', (req, res) => {
    const newOrder = req.body;
    if (!newOrder || !newOrder.id) {
      return res.status(400).json({ success: false, error: 'Order ID is required' });
    }

    const orders = readOrders();
    const existingIndex = orders.findIndex((o) => o.id === newOrder.id);

    if (existingIndex >= 0) {
      // Update existing
      orders[existingIndex] = { ...orders[existingIndex], ...newOrder };
    } else {
      // Prepend new order
      orders.unshift(newOrder);
      // Automatically trigger ORDER_PLACED WhatsApp notification with Thank You & 24hr Dispatch promise
      recordWaLog(newOrder, 'ORDER_PLACED');
    }

    writeOrders(orders);
    console.log(`[Order Central] Saved order ${newOrder.id} - Total: ₹${newOrder.total}`);
    res.json({ success: true, order: newOrder, totalOrders: orders.length });
  });

  // PUT /api/orders/:id - Update fulfillment or payment details
  app.put('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const orders = readOrders();
    const index = orders.findIndex((o) => o.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const previousStatus = orders[index].fulfillmentStatus;
    const previousTracking = orders[index].trackingNumber;

    orders[index] = { ...orders[index], ...updates };
    writeOrders(orders);

    // If order was marked as shipped or tracking number was assigned/updated, trigger automated ORDER_SHIPPED WhatsApp notification
    if (
      (updates.fulfillmentStatus === 'shipped' && previousStatus !== 'shipped') ||
      (updates.trackingNumber && updates.trackingNumber !== previousTracking)
    ) {
      recordWaLog(orders[index], 'ORDER_SHIPPED');
    }

    res.json({ success: true, order: orders[index] });
  });

  // DELETE /api/orders/all - Delete all orders (wipe orders database)
  app.delete('/api/orders/all', (req, res) => {
    writeOrders([]);
    console.log(`[Order Central] All orders purged successfully.`);
    res.json({ success: true, count: 0, orders: [] });
  });

  // POST /api/orders/clear-all - Also support POST to clear all orders
  app.post('/api/orders/clear-all', (req, res) => {
    writeOrders([]);
    console.log(`[Order Central] All orders purged successfully.`);
    res.json({ success: true, count: 0, orders: [] });
  });

  // DELETE /api/orders/:id - Remove order
  app.delete('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    const orders = readOrders();
    const filtered = orders.filter((o) => o.id !== id);
    writeOrders(filtered);
    res.json({ success: true, remaining: filtered.length });
  });

  // GET /api/orders/track - Track order by query
  app.get('/api/orders/track', (req, res) => {
    const query = ((req.query.q as string) || '').trim();
    if (!query) {
      return res.status(400).json({ success: false, error: 'Query parameter q is required' });
    }

    const orders = readOrders();
    const upper = query.toUpperCase();
    const digitsOnly = query.replace(/\D/g, '');

    const found = orders.find((order) => {
      if (order.id.toUpperCase() === upper) return true;
      if (order.id.replace(/^ZV-?/i, '').toUpperCase() === upper.replace(/^ZV-?/i, '')) return true;
      if (order.trackingNumber && order.trackingNumber.toUpperCase() === upper) return true;
      if (digitsOnly.length >= 8 && order.customer?.phone) {
        const p = order.customer.phone.replace(/\D/g, '');
        if (p.endsWith(digitsOnly) || digitsOnly.endsWith(p)) return true;
      }
      if (query.includes('@') && order.customer?.email) {
        if (order.customer.email.toLowerCase() === query.toLowerCase()) return true;
      }
      return false;
    });

    if (found) {
      res.json({ success: true, order: found });
    } else {
      res.status(404).json({ success: false, error: 'Order not found' });
    }
  });

  // ================= SHIPROCKET API ROUTES =================

  // GET /api/shiprocket/status - Check connection and token
  app.get('/api/shiprocket/status', async (req, res) => {
    res.type('application/json');
    try {
      const token = await getShiprocketToken();
      res.json({
        success: true,
        connected: !!token,
        email: process.env.SHIPROCKET_EMAIL || 'alexmask09@gmail.com',
        pickup_location: 'Home (Surat Boutique Hub)',
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error('[Shiprocket] status check error:', err.message);
      res.status(500).json({ success: false, error: err.message || 'Shiprocket authentication failed' });
    }
  });

  // POST /api/shiprocket/create-order - Create shipment on Shiprocket
  app.post('/api/shiprocket/create-order', async (req, res) => {
    res.type('application/json');
    const order = req.body.order || req.body;
    if (!order || !order.id) {
      return res.status(400).json({ success: false, error: 'Order payload with id is required' });
    }

    try {
      const result = await createShiprocketOrder(order);
      if (result.success && result.shipment_id) {
        // Attempt automatic courier assignment & AWB generation for zero-manual effort
        let autoAwbData: any = null;
        try {
          autoAwbData = await assignCourierAndAwb({ order, shipmentId: result.shipment_id });
        } catch (awbErr: any) {
          console.warn('[Shiprocket] Auto AWB assignment pending:', awbErr?.message || awbErr);
        }

        // Update order in server storage
        const orders = readOrders();
        const idx = orders.findIndex((o) => o.id === order.id);
        if (idx >= 0) {
          orders[idx].shiprocketOrderId = result.order_id;
          orders[idx].shiprocketShipmentId = result.shipment_id;
          orders[idx].shiprocketStatus = autoAwbData?.awb_code ? 'SHIPPED' : (result.status || 'NEW');

          if (autoAwbData?.awb_code) {
            orders[idx].trackingNumber = autoAwbData.awb_code;
            orders[idx].courierPartner = autoAwbData.courier_name;
            orders[idx].shiprocketAwb = autoAwbData.awb_code;
            orders[idx].shiprocketCourier = autoAwbData.courier_name;
            orders[idx].shiprocketTrackingUrl = autoAwbData.tracking_url;
            orders[idx].fulfillmentStatus = 'shipped';

            // Automatically record notification log
            recordWaLog(orders[idx], 'ORDER_SHIPPED');
          }
          writeOrders(orders);
        }

        if (autoAwbData && autoAwbData.awb_code) {
          return res.json({
            ...result,
            ...autoAwbData,
            autoDispatched: true,
          });
        }
      }
      res.json(result);
    } catch (err: any) {
      console.error('[Shiprocket] create-order endpoint error:', err.message);
      res.status(500).json({ success: false, error: err.message || 'Order creation failed' });
    }
  });

  // POST /api/shiprocket/assign-awb - Ship Order & Fetch/Assign AWB tracking code
  app.post('/api/shiprocket/assign-awb', async (req, res) => {
    res.type('application/json');
    const order = req.body.order || req.body;
    const shipmentId = req.body.shipmentId || order?.shiprocketShipmentId;

    if (!order || !order.id) {
      return res.status(400).json({ success: false, error: 'Order payload with id is required' });
    }

    try {
      const result = await assignCourierAndAwb({ order, shipmentId });

      // Update order in server storage
      const orders = readOrders();
      const idx = orders.findIndex((o) => o.id === order.id);
      if (idx >= 0) {
        orders[idx].trackingNumber = result.awb_code;
        orders[idx].courierPartner = result.courier_name;
        orders[idx].shiprocketAwb = result.awb_code;
        orders[idx].shiprocketCourier = result.courier_name;
        orders[idx].shiprocketTrackingUrl = result.tracking_url;
        orders[idx].shiprocketShipmentId = result.shipment_id || orders[idx].shiprocketShipmentId;
        orders[idx].fulfillmentStatus = 'shipped';
        writeOrders(orders);

        // Automatically trigger ORDER_SHIPPED WhatsApp tracking notification
        recordWaLog(orders[idx], 'ORDER_SHIPPED');
      }

      console.log(`[Shiprocket] AWB assigned for Order ${order.id}: ${result.awb_code} (${result.courier_name})`);
      res.json({
        ...result,
        orderId: order.id,
        fulfillmentStatus: 'shipped',
      });
    } catch (err: any) {
      console.error('[Shiprocket] assign-awb endpoint error:', err.message);
      res.status(500).json({ success: false, error: err.message || 'AWB assignment failed' });
    }
  });

  // GET /api/shiprocket/track/:awb - Fetch live tracking from Shiprocket
  app.get('/api/shiprocket/track/:awb', async (req, res) => {
    res.type('application/json');
    const awb = req.params.awb;
    if (!awb) {
      return res.status(400).json({ success: false, error: 'AWB code is required' });
    }

    try {
      const liveData = await trackShipment(awb);
      res.json({
        success: true,
        awb,
        trackingUrl: `https://shiprocket.co/tracking/${awb}`,
        liveData,
      });
    } catch (err: any) {
      console.error('[Shiprocket] track endpoint error:', err.message);
      res.status(500).json({ success: false, error: err.message || 'Tracking fetch failed' });
    }
  });

  // ================= WHATSAPP AUTOMATION API ROUTES =================

  // POST /api/notifications/whatsapp/send - Trigger an automated WhatsApp notification
  app.post('/api/notifications/whatsapp/send', (req, res) => {
    res.type('application/json');
    const { order, orderId, type, recipientPhone, message: customMessage } = req.body;

    let targetOrder = order;
    if (!targetOrder && orderId) {
      const orders = readOrders();
      targetOrder = orders.find((o) => o.id === orderId);
    }

    if (!targetOrder && !customMessage) {
      return res.status(400).json({ success: false, error: 'Order or orderId required' });
    }

    const notifType = type || 'ORDER_PLACED';
    const log = recordWaLog(targetOrder || { id: orderId || 'MANUAL', customer: { phone: recipientPhone, name: 'Customer' } }, notifType, recipientPhone);

    res.json({
      success: true,
      log,
      status: 'dispatched',
      message: log?.message || customMessage,
      waLink: log?.waLink,
    });
  });

  // GET /api/notifications/whatsapp/logs - Get WhatsApp notification logs
  app.get('/api/notifications/whatsapp/logs', (req, res) => {
    res.type('application/json');
    const logs = readWaLogs();
    res.json({ success: true, logs });
  });

  // POST /api/notifications/whatsapp/test - Test send WhatsApp notification
  app.post('/api/notifications/whatsapp/test', (req, res) => {
    res.type('application/json');
    const { phone, type } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, error: 'Mobile phone number required' });
    }

    const testOrder = {
      id: `ZV-TEST-${Math.floor(1000 + Math.random() * 9000)}`,
      total: 2499,
      paymentMethod: 'cod',
      customer: {
        name: 'Valued Customer',
        phone,
        address: 'Ring Road, Surat',
        city: 'Surat',
        pincode: '395002',
      },
      items: [{ name: 'Handcrafted Silk Saree', quantity: 1, price: 2499 }],
      courierPartner: 'Blue Dart / Delhivery Express',
      trackingNumber: 'BLUEDART-882391024',
    };

    const notifType = type || 'ORDER_PLACED';
    const log = recordWaLog(testOrder, notifType, phone);

    res.json({
      success: true,
      log,
      waLink: log?.waLink,
      message: `Test automated message created for ${phone}`,
    });
  });

  // POST /api/notifications/whatsapp/clear-logs - Clear WhatsApp notification logs
  app.post('/api/notifications/whatsapp/clear-logs', (req, res) => {
    writeWaLogs([]);
    res.json({ success: true, message: 'WhatsApp logs cleared' });
  });

  // Vite middleware for development vs static for production
  const candidateDistPaths = [
    path.join(process.cwd(), 'dist'),
    path.resolve('dist'),
    path.join(serverDirname, '..', 'dist'),
    serverDirname,
  ];
  const distPath = candidateDistPaths.find((p) => {
    try {
      return fs.existsSync(path.join(p, 'index.html'));
    } catch {
      return false;
    }
  }) || path.join(process.cwd(), 'dist');

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      // Prevent serving index.html for missing static assets or API calls
      if (req.path.startsWith('/api/') || req.path.startsWith('/assets/') || path.extname(req.path)) {
        return res.status(404).send('Not found');
      }
      const indexFile = path.join(distPath, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Application build output not found. Please verify npm run build.');
      }
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Zevioza Central Server] Running on http://0.0.0.0:${PORT}`);
  });

  server.on('error', (err: any) => {
    console.error('[Zevioza Central Server] Server listen error:', err);
  });
}

startServer().catch((err) => {
  console.error('[Zevioza Central Server] Fatal error during startup:', err);
  process.exit(1);
});
