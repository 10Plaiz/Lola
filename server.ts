import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { createClient } from '@supabase/supabase-js';

const PORT = process.env.PORT || 3000;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Supabase URL or Service Role Key is missing. Please check your .env file.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

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
  const app = express();

  app.use(bodyParser.json());
  app.use(cookieParser());

  // Auth Middleware
  const authenticate = async (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    const token = req.cookies.token || (authHeader && authHeader.split(' ')[1]);
    
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) throw error;
      
      req.user = {
        id: user.id,
        email: user.email,
        role: user.user_metadata.role || 'customer',
        username: user.user_metadata.username || user.email?.split('@')[0]
      };
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };

  // API Routes (Auth routes are now handled by client-side Supabase Auth)
  // We keep these for backward compatibility or if needed, but they are mostly redundant now.
  app.get('/api/auth/me', authenticate, async (req: any, res) => {
    res.json({ user: req.user });
  });

  // Orders
  app.post('/api/orders', authenticate, async (req: any, res) => {
    const { items, total, paymentMethod, gcashNumber } = req.body;
    const id = 'ORD-' + Date.now();
    const numericTotal = parseFloat(total.replace('₱', ''));
    const createdAt = new Date().toISOString();
    
    try {
      const { error } = await supabase.from('orders').insert({
        id,
        userId: req.user.id,
        username: req.user.username,
        items: JSON.stringify(items),
        total: numericTotal,
        paymentMethod,
        gcashNumber,
        status: 'pending',
        createdAt
      });
      
      if (error) throw error;
      res.json({ id, status: 'pending' });
    } catch (err) {
      console.error('Order error:', err);
      res.status(500).json({ error: 'Order failed' });
    }
  });

  app.get('/api/user/orders', authenticate, async (req: any, res) => {
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .eq('userId', req.user.id);
      
      if (error) throw error;
      res.json(orders.map((o: any) => ({ ...o, items: JSON.parse(o.items), total: `₱${o.total}` })));
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });

  app.get('/api/receipts/:orderId', authenticate, async (req: any, res) => {
    try {
      const { data: receipt, error } = await supabase
        .from('receipts')
        .select('*')
        .eq('orderId', req.params.orderId)
        .single();
      
      if (error || !receipt) return res.status(404).json({ error: 'Receipt not found' });
      res.json({ ...receipt, content: JSON.parse(receipt.content) });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch receipt' });
    }
  });

  // Admin Routes
  app.get('/api/admin/orders', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .order('createdAt', { ascending: false });
      
      if (error) throw error;
      res.json(orders.map((o: any) => ({ ...o, items: JSON.parse(o.items), total: `₱${o.total}` })));
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });

  app.post('/api/admin/orders/:id/generate-receipt', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const orderId = req.params.id;
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
        
      if (orderError || !order) return res.status(404).json({ error: 'Order not found' });
      
      const receiptId = 'REC-' + Date.now();
      const content = JSON.stringify({
        orderId,
        customer: order.username,
        items: JSON.parse(order.items),
        total: order.total,
        paymentMethod: order.paymentMethod,
        date: new Date().toISOString()
      });
      
      const { error: receiptError } = await supabase.from('receipts').insert({
        id: receiptId,
        orderId,
        content,
        createdAt: new Date().toISOString()
      });
      
      if (receiptError) throw receiptError;
      
      // For GCash, revenue increases when receipt is generated
      const updates: any = { receiptGenerated: true };
      if (order.paymentMethod === 'gcash') {
        const riderInfo = JSON.stringify({
          name: 'Kuya Jojo',
          phone: '0917-555-0123',
          plate: 'ABC 1234',
          type: 'GrabFood Rider'
        });
        updates.revenueAdded = true;
        updates.riderInfo = riderInfo;
      }
      
      const { error: updateError } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId);
        
      if (updateError) throw updateError;
      res.json({ success: true, receiptId });
    } catch (err) {
      res.status(500).json({ error: 'Failed to generate receipt' });
    }
  });

  app.post('/api/admin/orders/:id/finish', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const orderId = req.params.id;
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
        
      if (orderError || !order) return res.status(404).json({ error: 'Order not found' });
      
      const items = JSON.parse(order.items);
      for (const item of items) {
        const ingredients = ITEM_INGREDIENTS[item.name] || [];
        for (const ingredient of ingredients) {
          // In Supabase, we use RPC or multiple calls for atomic updates if needed, 
          // but here we'll just do a simple update for now.
          const { data: invItem } = await supabase.from('inventory').select('stock').eq('name', ingredient).single();
          if (invItem) {
            await supabase.from('inventory').update({ stock: Math.max(0, invItem.stock - item.quantity) }).eq('name', ingredient);
          }
        }

        // Update Product Stats
        const price = parseFloat(item.price.replace('₱', ''));
        const revenue = price * item.quantity;
        const now = new Date().toISOString();
        
        const { data: existingStat } = await supabase.from('product_stats').select('*').eq('id', item.name).single();
        if (existingStat) {
          await supabase.from('product_stats').update({
            totalSales: existingStat.totalSales + item.quantity,
            totalRevenue: existingStat.totalRevenue + revenue,
            lastSold: now
          }).eq('id', item.name);
        } else {
          await supabase.from('product_stats').insert({
            id: item.name,
            category: 'Menu Item',
            totalSales: item.quantity,
            totalRevenue: revenue,
            lastSold: now
          });
        }
      }
      
      const { error: finalUpdateError } = await supabase
        .from('orders')
        .update({ status: 'completed', revenueAdded: true })
        .eq('id', orderId);
        
      if (finalUpdateError) throw finalUpdateError;
      res.json({ success: true });
    } catch (err) {
      console.error('Finish order error:', err);
      res.status(500).json({ error: 'Failed to finish order' });
    }
  });

  // Staff API
  app.get('/api/admin/staff', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const { data: staff } = await supabase.from('staff').select('*');
    res.json((staff || []).map((s: any) => ({ ...s, schedule: JSON.parse(s.schedule || '{}') })));
  });

  app.post('/api/admin/staff', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const { name, role, phone, schedule } = req.body;
    await supabase.from('staff').insert({
      name, role, phone, schedule: JSON.stringify(schedule)
    });
    res.json({ success: true });
  });

  app.put('/api/admin/staff/:id', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const { name, role, phone, schedule } = req.body;
    await supabase.from('staff').update({
      name, role, phone, schedule: JSON.stringify(schedule)
    }).eq('id', req.params.id);
    res.json({ success: true });
  });

  app.delete('/api/admin/staff/:id', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    await supabase.from('staff').delete().eq('id', req.params.id);
    res.json({ success: true });
  });

  // Vendors API
  app.get('/api/admin/vendors', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const { data: vendors } = await supabase.from('vendors').select('*');
    res.json((vendors || []).map((v: any) => ({ ...v, itemsToBuy: JSON.parse(v.itemsToBuy || '[]') })));
  });

  app.post('/api/admin/vendors', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const { name, contactPerson, phone, itemsToBuy } = req.body;
    await supabase.from('vendors').insert({
      name, contactPerson, phone, itemsToBuy: JSON.stringify(itemsToBuy)
    });
    res.json({ success: true });
  });

  app.delete('/api/admin/vendors/:id', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    await supabase.from('vendors').delete().eq('id', req.params.id);
    res.json({ success: true });
  });

  // Product Stats API
  app.get('/api/admin/product-stats', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const { data: stats } = await supabase.from('product_stats').select('*').order('totalSales', { ascending: false });
    res.json(stats || []);
  });

  app.patch('/api/admin/orders/:id', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const { status } = req.body;
    try {
      await supabase.from('orders').update({ status }).eq('id', req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update order' });
    }
  });

  app.get('/api/admin/inventory', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    try {
      const { data: items } = await supabase.from('inventory').select('*');
      res.json(items || []);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch inventory' });
    }
  });

  app.patch('/api/admin/inventory/:id', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const { stock } = req.body;
    try {
      await supabase.from('inventory').update({ stock }).eq('id', req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update inventory' });
    }
  });

  app.get('/api/admin/analytics', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    try {
      const { data: orders } = await supabase.from('orders').select('*');
      const revenueData = (orders || []).filter(o => o.revenueAdded).reduce((acc, o) => acc + o.total, 0);
      const totalOrders = (orders || []).length;
      const pendingOrders = (orders || []).filter(o => o.status === 'pending').length;
      
      // Top Products
      const productCounts: Record<string, number> = {};
      (orders || []).filter(o => o.status === 'completed').forEach((o: any) => {
        const items = JSON.parse(o.items);
        items.forEach((item: any) => {
          productCounts[item.name] = (productCounts[item.name] || 0) + item.quantity;
        });
      });
      const topProducts = Object.entries(productCounts)
        .map(([name, sales]) => ({ name, sales }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5);

      // Customer Growth
      const { count: totalCustomers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

      // Low Stock Count
      const { data: invItems } = await supabase.from('inventory').select('*');
      const lowStockCount = (invItems || []).filter(i => i.stock <= i.minStock).length;

      // Daily Revenue
      const dailyRevenueMap: Record<string, number> = {};
      (orders || []).filter(o => o.revenueAdded).forEach(o => {
        const date = o.createdAt.split('T')[0];
        dailyRevenueMap[date] = (dailyRevenueMap[date] || 0) + o.total;
      });
      const dailyRevenue = Object.entries(dailyRevenueMap)
        .map(([date, revenue]) => ({ date, revenue }))
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 7)
        .reverse();

      res.json({ 
        totalRevenue: revenueData, 
        totalOrders, 
        pendingOrders,
        topProducts,
        totalCustomers: totalCustomers || 0,
        lowStockCount,
        dailyRevenue
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
