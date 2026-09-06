import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const DATA_DIR = path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

function readOrders(): any[] {
  try {
    ensureDataDir();
    const data = fs.readFileSync(ORDERS_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error reading orders from disk:', err);
    return [];
  }
}

function writeOrders(orders: any[]): boolean {
  try {
    ensureDataDir();
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing orders to disk:', err);
    return false;
  }
}

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
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      orderCount: orders.length,
    });
  });

  // GET /api/orders - Fetch all orders from central store
  app.get('/api/orders', (req, res) => {
    const orders = readOrders();
    res.json({ success: true, orders });
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

    // Server orders first
    for (const order of serverOrders) {
      orderMap.set(order.id, order);
    }

    // Client orders (add if not present, or if client has newer edits)
    let addedCount = 0;
    for (const order of clientOrders) {
      if (!orderMap.has(order.id)) {
        orderMap.set(order.id, order);
        addedCount++;
      }
    }

    const merged = Array.from(orderMap.values());
    writeOrders(merged);
    res.json({ success: true, total: merged.length, added: addedCount, orders: merged });
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

  // Vite middleware for development vs static for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Zevioza Central Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
