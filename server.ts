import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error('Failed to create data dir:', err);
  }
}

// In-memory brute force tracker for admin verification
interface RateLimitRecord {
  failedAttempts: number;
  lockoutUntil: number;
}
const rateLimits: Map<string, RateLimitRecord> = new Map();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'STUBBORN RAT KILLER Backend' });
  });

  // API Route: Get Orders (Admin & system sync)
  app.get('/api/orders', (_req: Request, res: Response) => {
    try {
      if (fs.existsSync(ORDERS_FILE)) {
        const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
        const orders = JSON.parse(raw);
        return res.json({ success: true, orders });
      }
      return res.json({ success: true, orders: [] });
    } catch (err) {
      console.error('Error reading orders:', err);
      return res.status(500).json({ success: false, error: 'Failed to read orders' });
    }
  });

  // API Route: Create or update Order (Cross-Device Sync)
  app.post('/api/orders', (req: Request, res: Response) => {
    try {
      const newOrder = req.body;
      if (!newOrder || !newOrder.orderNumber || !newOrder.customer) {
        return res.status(400).json({ success: false, error: 'Invalid order payload' });
      }

      // Sanitize paymentStatus if unverified
      if (newOrder.paymentMethod === 'debit_card' && newOrder.paymentStatus === 'Paid') {
        newOrder.paymentStatus = 'Pending Verification';
      }

      let orders: any[] = [];
      if (fs.existsSync(ORDERS_FILE)) {
        try {
          const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
          orders = JSON.parse(raw);
        } catch {
          orders = [];
        }
      }

      const existingIdx = orders.findIndex(
        (o: any) => o.id === newOrder.id || o.orderNumber === newOrder.orderNumber
      );

      if (existingIdx >= 0) {
        orders[existingIdx] = { ...orders[existingIdx], ...newOrder };
      } else {
        orders.unshift(newOrder);
      }

      fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
      return res.json({ success: true, order: newOrder });
    } catch (err) {
      console.error('Error saving order:', err);
      return res.status(500).json({ success: false, error: 'Failed to save order' });
    }
  });

  // API Route: Update Order Status
  app.patch('/api/orders/:id', (req: Request, res: Response) => {
    try {
      const orderId = req.params.id;
      const { orderStatus, paymentStatus } = req.body;

      if (!fs.existsSync(ORDERS_FILE)) {
        return res.status(404).json({ success: false, error: 'No orders found' });
      }

      const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
      let orders = JSON.parse(raw);
      const idx = orders.findIndex((o: any) => o.id === orderId || o.orderNumber === orderId);

      if (idx === -1) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }

      if (orderStatus) orders[idx].orderStatus = orderStatus;
      if (paymentStatus) orders[idx].paymentStatus = paymentStatus;

      fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
      return res.json({ success: true, order: orders[idx] });
    } catch (err) {
      console.error('Error updating order:', err);
      return res.status(500).json({ success: false, error: 'Failed to update order' });
    }
  });

  // API Route: Privacy-Safe Order Lookup
  app.post('/api/orders/lookup', (req: Request, res: Response) => {
    try {
      const { orderNumber, phoneLast4 } = req.body;
      const cleanOrder = (orderNumber || '').trim().toLowerCase();
      if (!cleanOrder) {
        return res.status(400).json({ success: false, error: 'Order or tracking number required' });
      }

      if (!fs.existsSync(ORDERS_FILE)) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }

      const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
      const orders = JSON.parse(raw);

      const matched = orders.find(
        (o: any) =>
          o.orderNumber.toLowerCase() === cleanOrder ||
          (o.trackingNumber && o.trackingNumber.toLowerCase() === cleanOrder)
      );

      if (!matched) {
        return res.status(404).json({ success: false, error: 'No matching order found' });
      }

      const rawPhone = matched.customer.phone.replace(/[^0-9]/g, '');
      const cleanPhoneInput = (phoneLast4 || '').replace(/[^0-9]/g, '');
      const isVerified = cleanPhoneInput.length >= 4 && rawPhone.endsWith(cleanPhoneInput);

      if (isVerified) {
        return res.json({ success: true, verified: true, order: matched });
      }

      // Return privacy-masked order: hide street address, email, and middle digits of phone
      const maskedOrder = {
        ...matched,
        customer: {
          fullName: matched.customer.fullName ? `${matched.customer.fullName.charAt(0)}***` : 'Customer',
          state: matched.customer.state,
          cityOrLga: matched.customer.cityOrLga,
          deliveryAddress: 'Address protected for customer privacy. Enter last 4 digits of phone to reveal full details.',
          phone: rawPhone.length > 4 ? `${rawPhone.slice(0, 4)}****${rawPhone.slice(-2)}` : '****',
          email: '***@***'
        }
      };

      return res.json({ success: true, verified: false, order: maskedOrder });
    } catch (err) {
      console.error('Error in order lookup:', err);
      return res.status(500).json({ success: false, error: 'Lookup failed' });
    }
  });

  // API Route: Secure Admin Login with Rate-Limiting & Brute-Force Lockout
  app.post('/api/admin/login', (req: Request, res: Response) => {
    try {
      const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
      const now = Date.now();
      const record = rateLimits.get(clientIp) || { failedAttempts: 0, lockoutUntil: 0 };

      if (record.lockoutUntil > now) {
        const remainingSeconds = Math.ceil((record.lockoutUntil - now) / 1000);
        return res.status(429).json({
          success: false,
          locked: true,
          remainingSeconds,
          error: `Too many failed attempts. Locked out for ${remainingSeconds} seconds.`
        });
      }

      const { passcode } = req.body;
      const expectedPasscode = process.env.OWNER_PASSCODE || 'KILLAPEST#2026';

      // Strictly compare against configured passcode — no 7453 backdoors
      if (passcode && passcode.trim() === expectedPasscode) {
        rateLimits.delete(clientIp);
        return res.json({ success: true });
      }

      record.failedAttempts += 1;
      if (record.failedAttempts >= 5) {
        record.lockoutUntil = now + 5 * 60 * 1000;
        rateLimits.set(clientIp, record);
        return res.status(429).json({
          success: false,
          locked: true,
          remainingSeconds: 300,
          error: 'Maximum failed attempts reached. Console locked for 5 minutes.'
        });
      }

      rateLimits.set(clientIp, record);
      const remainingAttempts = 5 - record.failedAttempts;
      return res.status(401).json({
        success: false,
        remainingAttempts,
        error: `Incorrect passcode. ${remainingAttempts} attempts remaining before temporary lockout.`
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Server authentication error' });
    }
  });

  // Vite SPA middlewares in dev or static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`STUBBORN RAT KILLER secure server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
