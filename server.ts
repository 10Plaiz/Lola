import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const JWT_SECRET = 'lolas-secret-key-123';
const DB_FILE = path.resolve(process.cwd(), 'database.sqlite');

let db: any;

async function initDB() {
  db = await open({
    filename: DB_FILE,
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT,
      email TEXT UNIQUE,
      phone TEXT,
      password TEXT,
      role TEXT
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      userId TEXT,
      username TEXT,
      items TEXT,
      total REAL,
      paymentMethod TEXT,
      gcashNumber TEXT,
      status TEXT,
      receiptGenerated BOOLEAN DEFAULT 0,
      revenueAdded BOOLEAN DEFAULT 0,
      riderInfo TEXT, -- JSON object { name, phone, plate }
      createdAt TEXT,
      FOREIGN KEY(userId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      stock INTEGER,
      minStock INTEGER
    );

    CREATE TABLE IF NOT EXISTS vendors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      contactPerson TEXT,
      phone TEXT,
      itemsToBuy TEXT -- JSON array of strings
    );

    CREATE TABLE IF NOT EXISTS staff (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      role TEXT,
      phone TEXT,
      schedule TEXT -- JSON object { Monday: '9am-5pm', ... }
    );

    CREATE TABLE IF NOT EXISTS product_stats (
      id TEXT PRIMARY KEY, -- Product Name
      category TEXT,
      totalSales INTEGER DEFAULT 0,
      totalRevenue REAL DEFAULT 0,
      lastSold TEXT
    );

    CREATE TABLE IF NOT EXISTS receipts (
      id TEXT PRIMARY KEY,
      orderId TEXT,
      content TEXT,
      createdAt TEXT,
      FOREIGN KEY(orderId) REFERENCES orders(id)
    );
  `);

  // Seed Admin if not exists
  const admin = await db.get('SELECT * FROM users WHERE username = ?', ['admin']);
  if (!admin) {
    await db.run(
      'INSERT INTO users (id, username, email, phone, password, role) VALUES (?, ?, ?, ?, ?, ?)',
      ['admin-id', 'admin', 'admin@lolas.com', '09170000000', bcrypt.hashSync('admin', 10), 'admin']
    );
  }

  // Seed Inventory if empty or outdated
  const espressoCheck = await db.get('SELECT * FROM inventory WHERE name = ?', ['Espresso']);
  if (!espressoCheck) {
    await db.run('DELETE FROM inventory');
    const ingredients = [
      'Espresso', 'Matcha Powder', 'Standard Milk', 'Oat Milk', 'Sweetened Condensed Milk',
      'Sea Salt Cream', 'Chocolate Sauce', 'White Chocolate Sauce', 'Caramel Sauce',
      'Salted Caramel Sauce', 'Dark Chocolate Sauce', 'Simple Syrup', 'Brown Sugar',
      'Vanilla Syrup', 'French Vanilla Syrup', 'Hazelnut Syrup', 'Strawberry Syrup',
      'Blueberry Syrup', 'Mixed Berries Syrup', 'Dark Berry Syrup', 'Strawberry Jam',
      'Blueberry Jam', 'Mixed Berries Jam', 'Taro Powder', 'Red Velvet Powder',
      'Water', 'Carbonated Water', 'Crushed Oreo Cookies', 'Ice'
    ];
    for (const name of ingredients) {
      await db.run('INSERT INTO inventory (name, stock, minStock) VALUES (?, ?, ?)', [name, 100, 20]);
    }
  }
}

const ITEM_INGREDIENTS: Record<string, string[]> = {
  'Americano': ['Espresso', 'Water'],
  'Purificacion (Sweetened Americano)': ['Espresso', 'Water', 'Simple Syrup'],
  'Vietnamese Coffee': ['Espresso', 'Sweetened Condensed Milk'],
  'Café Latte': ['Espresso', 'Standard Milk'],
  'Spanish Latte': ['Espresso', 'Standard Milk', 'Sweetened Condensed Milk'],
  'French Vanilla': ['Espresso', 'Standard Milk', 'French Vanilla Syrup'],
  'Hazelnut': ['Espresso', 'Standard Milk', 'Hazelnut Syrup'],
  'Mocha': ['Espresso', 'Standard Milk', 'Chocolate Sauce'],
  'White Chocolate Mocha': ['Espresso', 'Standard Milk', 'White Chocolate Sauce'],
  'Salted Caramel': ['Espresso', 'Standard Milk', 'Salted Caramel Sauce'],
  'Caramel Mocha': ['Espresso', 'Standard Milk', 'Caramel Sauce', 'Chocolate Sauce'],
  'Dark Mocha': ['Espresso', 'Standard Milk', 'Dark Chocolate Sauce'],
  'Caramel Macchiato': ['Espresso', 'Standard Milk', 'Vanilla Syrup', 'Caramel Sauce'],
  'Dirty Matcha': ['Espresso', 'Standard Milk', 'Matcha Powder'],
  'Tiger Sugar Milk': ['Brown Sugar', 'Standard Milk'],
  'Blueberry Latte': ['Standard Milk', 'Blueberry Syrup'],
  'Strawberry Latte': ['Standard Milk', 'Strawberry Syrup'],
  'Classic Chocolate': ['Standard Milk', 'Chocolate Sauce'],
  'Red Velvet': ['Standard Milk', 'Red Velvet Powder'],
  'Caramel Milk': ['Standard Milk', 'Caramel Sauce'],
  'Triple Chocolate': ['Standard Milk', 'Chocolate Sauce', 'White Chocolate Sauce', 'Dark Chocolate Sauce'],
  'Mixed Berries Latte': ['Standard Milk', 'Mixed Berries Syrup'],
  'Oreo Latte': ['Standard Milk', 'Crushed Oreo Cookies', 'Simple Syrup'],
  'Taro Latte': ['Standard Milk', 'Taro Powder'],
  'Strawberry Oreo Latte': ['Standard Milk', 'Strawberry Syrup', 'Crushed Oreo Cookies'],
  'Dark Berry': ['Standard Milk', 'Dark Berry Syrup'],
  'Blueberry Soda': ['Carbonated Water', 'Blueberry Jam', 'Ice'],
  'Strawberry Soda': ['Carbonated Water', 'Strawberry Jam', 'Ice'],
  'Mixed Berries Soda': ['Carbonated Water', 'Mixed Berries Jam', 'Ice'],
  'Sea Salt Latte': ['Espresso', 'Standard Milk', 'Sea Salt Cream'],
  'Sea Salt Chocolate': ['Standard Milk', 'Chocolate Sauce', 'Sea Salt Cream'],
  'Sea Salt Spanish Latte': ['Espresso', 'Standard Milk', 'Sweetened Condensed Milk', 'Sea Salt Cream'],
  'Sea Salt Spanish Oat': ['Espresso', 'Oat Milk', 'Sweetened Condensed Milk', 'Sea Salt Cream'],
  'Sea Salt Red Velvet': ['Standard Milk', 'Red Velvet Powder', 'Sea Salt Cream'],
  'Sea Salt Mocha': ['Espresso', 'Standard Milk', 'Chocolate Sauce', 'Sea Salt Cream'],
  'Sea Salt Matcha Latte': ['Standard Milk', 'Matcha Powder', 'Sea Salt Cream'],
  'Sea Salt Matcha Oat': ['Oat Milk', 'Matcha Powder', 'Sea Salt Cream'],
  'Sea Salt Caramel Latte': ['Espresso', 'Standard Milk', 'Caramel Sauce', 'Sea Salt Cream'],
  'Sea Salt Caramel Mocha': ['Espresso', 'Standard Milk', 'Caramel Sauce', 'Chocolate Sauce', 'Sea Salt Cream'],
  'Sea Salt Triple Chocolate': ['Standard Milk', 'Chocolate Sauce', 'White Chocolate Sauce', 'Dark Chocolate Sauce', 'Sea Salt Cream'],
  'Sea Salt Taro Latte': ['Standard Milk', 'Taro Powder', 'Sea Salt Cream'],
  'Matcha Latte': ['Standard Milk', 'Matcha Powder', 'Simple Syrup'],
  'Blueberry Matcha Latte': ['Standard Milk', 'Matcha Powder', 'Blueberry Syrup'],
  'Strawberry Matcha Latte': ['Standard Milk', 'Matcha Powder', 'Strawberry Syrup'],
  'Salted Caramel Matcha': ['Standard Milk', 'Matcha Powder', 'Salted Caramel Sauce'],
  'White Chocolate Matcha': ['Standard Milk', 'Matcha Powder', 'White Chocolate Sauce'],
  'Matcha Oreo Latte': ['Standard Milk', 'Matcha Powder', 'Crushed Oreo Cookies'],
  'Iced Brown': ['Espresso', 'Standard Milk', 'Brown Sugar'],
  'Espresso Cookie': ['Espresso', 'Standard Milk', 'Crushed Oreo Cookies'],
  'Oro Blanco': ['Espresso', 'Oat Milk', 'White Chocolate Sauce', 'Brown Sugar'],
  'Quad Espresso': ['Espresso', 'Chocolate Sauce']
};

async function startServer() {
  await initDB();
  const app = express();
  const PORT = 3000;

  app.use(bodyParser.json());
  app.use(cookieParser());

  // Auth Middleware
  const authenticate = (req: any, res: any, next: any) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };

  // API Routes
  app.post('/api/auth/signup', async (req, res) => {
    const { username, email, phone, password } = req.body;
    try {
      const existing = await db.get('SELECT * FROM users WHERE email = ?', [email]);
      if (existing) return res.status(400).json({ error: 'User already exists' });
      
      const id = Date.now().toString();
      const hashedPassword = bcrypt.hashSync(password, 10);
      await db.run(
        'INSERT INTO users (id, username, email, phone, password, role) VALUES (?, ?, ?, ?, ?, ?)',
        [id, username, email, phone, hashedPassword, 'customer']
      );
      
      const token = jwt.sign({ id, email, role: 'customer', username }, JWT_SECRET);
      res.cookie('token', token, { httpOnly: true, sameSite: 'none', secure: true });
      res.json({ user: { username, email, phone, role: 'customer' } });
    } catch (err) {
      res.status(500).json({ error: 'Signup failed' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await db.get('SELECT * FROM users WHERE email = ? OR (username = ? AND role = "admin")', [email, email]);
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role, username: user.username }, JWT_SECRET);
      res.cookie('token', token, { httpOnly: true, sameSite: 'none', secure: true });
      res.json({ user: { username: user.username, email: user.email, phone: user.phone, role: user.role } });
    } catch (err) {
      res.status(500).json({ error: 'Login failed' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ success: true });
  });

  app.get('/api/auth/me', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Not logged in' });
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const user = await db.get('SELECT username, email, phone, role FROM users WHERE id = ?', [decoded.id]);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json({ user });
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  });

  // Orders
  app.post('/api/orders', authenticate, async (req: any, res) => {
    const { items, total, paymentMethod, gcashNumber } = req.body;
    const id = 'ORD-' + Date.now();
    const numericTotal = parseFloat(total.replace('₱', ''));
    const createdAt = new Date().toISOString();
    
    try {
      await db.run(
        'INSERT INTO orders (id, userId, username, items, total, paymentMethod, gcashNumber, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id, req.user.id, req.user.username, JSON.stringify(items), numericTotal, paymentMethod, gcashNumber, 'pending', createdAt]
      );
      res.json({ id, status: 'pending' });
    } catch (err) {
      res.status(500).json({ error: 'Order failed' });
    }
  });

  app.get('/api/user/orders', authenticate, async (req: any, res) => {
    try {
      const orders = await db.all('SELECT * FROM orders WHERE userId = ?', [req.user.id]);
      res.json(orders.map((o: any) => ({ ...o, items: JSON.parse(o.items), total: `₱${o.total}` })));
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });

  app.get('/api/receipts/:orderId', authenticate, async (req: any, res) => {
    try {
      const receipt = await db.get('SELECT * FROM receipts WHERE orderId = ?', [req.params.orderId]);
      if (!receipt) return res.status(404).json({ error: 'Receipt not found' });
      res.json({ ...receipt, content: JSON.parse(receipt.content) });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch receipt' });
    }
  });

  // Admin Routes
  app.get('/api/admin/orders', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    try {
      const orders = await db.all('SELECT * FROM orders ORDER BY createdAt DESC');
      res.json(orders.map((o: any) => ({ ...o, items: JSON.parse(o.items), total: `₱${o.total}` })));
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });

  app.post('/api/admin/orders/:id/generate-receipt', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const orderId = req.params.id;
    try {
      const order = await db.get('SELECT * FROM orders WHERE id = ?', [orderId]);
      if (!order) return res.status(404).json({ error: 'Order not found' });
      
      const receiptId = 'REC-' + Date.now();
      const content = JSON.stringify({
        orderId,
        customer: order.username,
        items: JSON.parse(order.items),
        total: order.total,
        paymentMethod: order.paymentMethod,
        date: new Date().toISOString()
      });
      
      await db.run(
        'INSERT INTO receipts (id, orderId, content, createdAt) VALUES (?, ?, ?, ?)',
        [receiptId, orderId, content, new Date().toISOString()]
      );
      
      // For GCash, revenue increases when receipt is generated
      let updateQuery = 'UPDATE orders SET receiptGenerated = 1';
      if (order.paymentMethod === 'gcash') {
        const riderInfo = JSON.stringify({
          name: 'Kuya Jojo',
          phone: '0917-555-0123',
          plate: 'ABC 1234',
          type: 'GrabFood Rider'
        });
        updateQuery += `, revenueAdded = 1, riderInfo = '${riderInfo}'`;
      }
      updateQuery += ' WHERE id = ?';
      
      await db.run(updateQuery, [orderId]);
      res.json({ success: true, receiptId });
    } catch (err) {
      res.status(500).json({ error: 'Failed to generate receipt' });
    }
  });

  app.post('/api/admin/orders/:id/finish', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const orderId = req.params.id;
    try {
      const order = await db.get('SELECT * FROM orders WHERE id = ?', [orderId]);
      if (!order) return res.status(404).json({ error: 'Order not found' });
      
      const items = JSON.parse(order.items);
      for (const item of items) {
        const ingredients = ITEM_INGREDIENTS[item.name] || [];
        for (const ingredient of ingredients) {
          await db.run(
            'UPDATE inventory SET stock = MAX(0, stock - ?) WHERE name = ?',
            [item.quantity, ingredient]
          );
        }

        // Update Product Stats
        const price = parseFloat(item.price.replace('₱', ''));
        const revenue = price * item.quantity;
        const now = new Date().toISOString();
        
        const existingStat = await db.get('SELECT * FROM product_stats WHERE id = ?', [item.name]);
        if (existingStat) {
          await db.run(
            'UPDATE product_stats SET totalSales = totalSales + ?, totalRevenue = totalRevenue + ?, lastSold = ? WHERE id = ?',
            [item.quantity, revenue, now, item.name]
          );
        } else {
          await db.run(
            'INSERT INTO product_stats (id, category, totalSales, totalRevenue, lastSold) VALUES (?, ?, ?, ?, ?)',
            [item.name, 'Menu Item', item.quantity, revenue, now]
          );
        }
      }
      
      await db.run(
        'UPDATE orders SET status = "completed", revenueAdded = 1 WHERE id = ?',
        [orderId]
      );
      res.json({ success: true });
    } catch (err) {
      console.error('Finish order error:', err);
      res.status(500).json({ error: 'Failed to finish order' });
    }
  });

  // Staff API
  app.get('/api/admin/staff', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const staff = await db.all('SELECT * FROM staff');
    res.json(staff.map((s: any) => ({ ...s, schedule: JSON.parse(s.schedule || '{}') })));
  });

  app.post('/api/admin/staff', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const { name, role, phone, schedule } = req.body;
    await db.run(
      'INSERT INTO staff (name, role, phone, schedule) VALUES (?, ?, ?, ?)',
      [name, role, phone, JSON.stringify(schedule)]
    );
    res.json({ success: true });
  });

  app.put('/api/admin/staff/:id', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const { name, role, phone, schedule } = req.body;
    await db.run(
      'UPDATE staff SET name = ?, role = ?, phone = ?, schedule = ? WHERE id = ?',
      [name, role, phone, JSON.stringify(schedule), req.params.id]
    );
    res.json({ success: true });
  });

  app.delete('/api/admin/staff/:id', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    await db.run('DELETE FROM staff WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  });

  // Vendors API
  app.get('/api/admin/vendors', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const vendors = await db.all('SELECT * FROM vendors');
    res.json(vendors.map((v: any) => ({ ...v, itemsToBuy: JSON.parse(v.itemsToBuy || '[]') })));
  });

  app.post('/api/admin/vendors', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const { name, contactPerson, phone, itemsToBuy } = req.body;
    await db.run(
      'INSERT INTO vendors (name, contactPerson, phone, itemsToBuy) VALUES (?, ?, ?, ?)',
      [name, contactPerson, phone, JSON.stringify(itemsToBuy)]
    );
    res.json({ success: true });
  });

  app.delete('/api/admin/vendors/:id', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    await db.run('DELETE FROM vendors WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  });

  // Product Stats API
  app.get('/api/admin/product-stats', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const stats = await db.all('SELECT * FROM product_stats ORDER BY totalSales DESC');
    res.json(stats);
  });

  app.patch('/api/admin/orders/:id', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const { status } = req.body;
    try {
      await db.run('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update order' });
    }
  });

  app.get('/api/admin/inventory', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    try {
      const items = await db.all('SELECT * FROM inventory');
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch inventory' });
    }
  });

  app.patch('/api/admin/inventory/:id', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const { stock } = req.body;
    try {
      await db.run('UPDATE inventory SET stock = ? WHERE id = ?', [stock, req.params.id]);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update inventory' });
    }
  });

  app.get('/api/admin/analytics', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    try {
      const revenueData = await db.get('SELECT SUM(total) as totalRevenue FROM orders WHERE revenueAdded = 1');
      const totalOrders = await db.get('SELECT COUNT(*) as count FROM orders');
      const pendingOrders = await db.get('SELECT COUNT(*) as count FROM orders WHERE status = "pending"');
      
      // Top Products
      const allOrders = await db.all('SELECT items FROM orders WHERE status = "completed"');
      const productCounts: Record<string, number> = {};
      allOrders.forEach((o: any) => {
        const items = JSON.parse(o.items);
        items.forEach((item: any) => {
          productCounts[item.name] = (productCounts[item.name] || 0) + item.quantity;
        });
      });
      const topProducts = Object.entries(productCounts)
        .map(([name, sales]) => ({ name, sales }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5);

      // Customer Growth (Total unique users)
      const totalCustomers = await db.get('SELECT COUNT(*) as count FROM users WHERE role = "customer"');

      // Low Stock Count
      const lowStockCount = await db.get('SELECT COUNT(*) as count FROM inventory WHERE stock <= minStock');

      // Revenue by day (last 7 days)
      const dailyRevenue = await db.all(`
        SELECT date(createdAt) as date, SUM(total) as revenue 
        FROM orders 
        WHERE revenueAdded = 1 
        GROUP BY date(createdAt) 
        ORDER BY date DESC 
        LIMIT 7
      `);

      res.json({ 
        totalRevenue: revenueData.totalRevenue || 0, 
        totalOrders: totalOrders.count, 
        pendingOrders: pendingOrders.count,
        topProducts,
        totalCustomers: totalCustomers.count,
        lowStockCount: lowStockCount.count,
        dailyRevenue: dailyRevenue.reverse()
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  });

  // Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
