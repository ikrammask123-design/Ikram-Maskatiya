import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
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
let inMemoryOrders: any[] = [];

function ensureDataDir(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(ORDERS_FILE)) {
      fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('Filesystem access limited, using in-memory orders store:', err);
  }
}

function readOrders(): any[] {
  try {
    ensureDataDir();
    if (fs.existsSync(ORDERS_FILE)) {
      const data = fs.readFileSync(ORDERS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
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

const DEMO_IDS = new Set(['ZV-928410', 'ZV-849102', 'ZV-729011', 'ZV-610294', 'ZV-501928', 'ZV-TEST01']);

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

    orders[index] = { ...orders[index], ...updates };
    writeOrders(orders);
    res.json({ success: true, order: orders[index] });
  });

  // DELETE /api/orders/:id - Remove order
  app.delete('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    const orders = readOrders();
    const filtered = orders.filter((o) => o.id !== id);
    writeOrders(filtered);
    res.json({ success: true, remaining: filtered.length });
  });

  // POST /api/orders/bulk-sync - Merge client local orders into server database
  app.post('/api/orders/bulk-sync', (req, res) => {
    const { orders: clientOrders } = req.body;
    if (!Array.isArray(clientOrders)) {
      return res.status(400).json({ success: false, error: 'Array of orders expected' });
    }

    const serverOrders = readOrders();
    const orderMap = new Map<string, any>();

    // Server orders first (only real non-demo orders)
    for (const order of serverOrders) {
      if (!order.isDemo && !DEMO_IDS.has(order.id)) {
        orderMap.set(order.id, order);
      }
    }

    // Client orders (add if not present, but NEVER upload demo orders)
    let addedCount = 0;
    for (const order of clientOrders) {
      if (order.isDemo || DEMO_IDS.has(order.id)) continue; // Skip demo orders
      if (!orderMap.has(order.id)) {
        orderMap.set(order.id, order);
        addedCount++;
      }
    }

    const merged = Array.from(orderMap.values());
    writeOrders(merged);
    res.json({ success: true, total: merged.length, added: addedCount, orders: merged });
  });

  // POST /api/orders/clear-demo - Delete all demo orders from server database
  app.post('/api/orders/clear-demo', (req, res) => {
    const orders = readOrders();
    const filtered = orders.filter((o) => !o.isDemo && !DEMO_IDS.has(o.id));
    writeOrders(filtered);
    console.log(`[Order Central] Purged demo orders. Remaining real orders: ${filtered.length}`);
    res.json({ success: true, remaining: filtered.length, orders: filtered });
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
        // Update order in server storage
        const orders = readOrders();
        const idx = orders.findIndex((o) => o.id === order.id);
        if (idx >= 0) {
          orders[idx].shiprocketOrderId = result.order_id;
          orders[idx].shiprocketShipmentId = result.shipment_id;
          orders[idx].shiprocketStatus = result.status || 'NEW';
          writeOrders(orders);
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

  const hasDist = fs.existsSync(path.join(distPath, 'index.html'));
  const isProduction = process.env.NODE_ENV === 'production' || hasDist;

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
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
