import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

let supabaseClient: any = null;

function getSupabase() {
  if (!supabaseClient) {
    const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase credentials (VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY) are missing in environment variables.');
    }
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  }
  return supabaseClient;
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
  const app = express();
  const PORT = 3000;

  app.use(bodyParser.json());
  app.use(cookieParser());

  // Auth Middleware - Verify Supabase Token
  const authenticate = async (req: any, res: any, next: any) => {
    const token = req.cookies['sb-access-token'];
    if (!token) {
      console.log('Auth failed: No sb-access-token cookie found');
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    console.log(`Authenticating token starting with: ${token.substring(0, 10)}...`);
    
    try {
      const { data: { user }, error } = await getSupabase().auth.getUser(token);
      if (error || !user) {
        console.error('Auth failed: Supabase error or no user', error);
        return res.status(401).json({ error: 'Invalid token' });
      }
      
      // Fetch user profile from public.users
      let { data: profile, error: profileError } = await getSupabase()
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile fetch error:', profileError);
      }
        
      // Auto-create profile if missing and we have metadata
      if (!profile && user.user_metadata) {
        const { username, phone } = user.user_metadata;
        if (username) {
          const { data: newProfile, error: insertError } = await getSupabase()
            .from('users')
            .insert({
              id: user.id,
              username,
              email: user.email,
              phone: phone || '',
              role: 'customer'
            })
            .select()
            .single();
          
          if (!insertError) {
            profile = newProfile;
          }
        }
      }

      req.user = { ...user, ...profile, profileExists: !!profile };
      next();
    } catch (err) {
      console.error('Auth error:', err);
      res.status(401).json({ error: 'Authentication failed' });
    }
  };

  // API Routes
  app.get('/api/health', async (req, res) => {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
      res.json({ 
        status: 'ok', 
        supabaseConnected: !error,
        supabaseError: error ? error.message : null,
        envCheck: {
          hasUrl: !!process.env.VITE_SUPABASE_URL,
          hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
          url: process.env.VITE_SUPABASE_URL ? `${process.env.VITE_SUPABASE_URL.substring(0, 15)}...` : 'missing'
        }
      });
    } catch (err: any) {
      res.status(500).json({ status: 'error', message: err.message });
    }
  });

  app.post('/api/auth/create-profile', authenticate, async (req: any, res) => {
    const { username, phone } = req.body;
    
    if (req.user.profileExists) {
      return res.json({ success: true, message: 'Profile already exists' });
    }

    const { data, error } = await getSupabase()
      .from('users')
      .insert({
        id: req.user.id,
        username,
        email: req.user.email,
        phone,
        role: 'customer'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      return res.status(500).json({ error: 'Failed to create profile' });
    }

    res.json({ success: true, user: data });
  });

  app.get('/api/auth/me', authenticate, async (req: any, res) => {
    res.json({ user: req.user });
  });

  // Orders
  app.post('/api/orders', authenticate, async (req: any, res) => {
    const { items, total, paymentMethod, gcashNumber } = req.body;
    const id = 'ORD-' + Date.now();
    const numericTotal = parseFloat(total.replace('₱', ''));
    
    const { data, error } = await getSupabase()
      .from('orders')
      .insert({
        id,
        userId: req.user.id,
        username: req.user.username,
        items,
        total: numericTotal,
        paymentMethod,
        gcashNumber,
        status: 'pending'
      })
      .select()
      .single();

    if (error) return res.status(500).json({ error: 'Order failed' });
    res.json(data);
  });

  app.get('/api/user/orders', authenticate, async (req: any, res) => {
    const { data, error } = await getSupabase()
      .from('orders')
      .select('*')
      .eq('userId', req.user.id)
      .order('createdAt', { ascending: false });

    if (error) return res.status(500).json({ error: 'Failed to fetch orders' });
    res.json(data.map(o => ({ ...o, total: `₱${o.total}` })));
  });

  app.get('/api/receipts/:orderId', authenticate, async (req: any, res) => {
    const { data, error } = await getSupabase()
      .from('receipts')
      .select('*')
      .eq('orderId', req.params.orderId)
      .single();

    if (error) return res.status(404).json({ error: 'Receipt not found' });
    res.json(data);
  });

  // Admin Routes
  app.get('/api/admin/orders', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const { data, error } = await getSupabase()
      .from('orders')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) return res.status(500).json({ error: 'Failed to fetch orders' });
    res.json(data.map(o => ({ ...o, total: `₱${o.total}` })));
  });

  app.post('/api/admin/orders/:id/generate-receipt', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const orderId = req.params.id;
    
    const { data: order } = await getSupabase()
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (!order) return res.status(404).json({ error: 'Order not found' });
    
    const receiptId = 'REC-' + Date.now();
    const content = {
      orderId,
      customer: order.username,
      items: order.items,
      total: order.total,
      paymentMethod: order.paymentMethod,
      date: new Date().toISOString()
    };
    
    const { error: receiptError } = await getSupabase()
      .from('receipts')
      .insert({
        id: receiptId,
        orderId,
        content,
      });

    if (receiptError) return res.status(500).json({ error: 'Failed to generate receipt' });
    
    let updateData: any = { receiptGenerated: true };
    if (order.paymentMethod === 'gcash') {
      updateData.revenueAdded = true;
      updateData.riderInfo = {
        name: 'Kuya Jojo',
        phone: '0917-555-0123',
        plate: 'ABC 1234',
        type: 'GrabFood Rider'
      };
    }
    
    await getSupabase().from('orders').update(updateData).eq('id', orderId);
    res.json({ success: true, receiptId });
  });

  app.post('/api/admin/orders/:id/finish', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const orderId = req.params.id;
    
    const { data: order } = await getSupabase()
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (!order) return res.status(404).json({ error: 'Order not found' });
    
    for (const item of order.items) {
      const ingredients = ITEM_INGREDIENTS[item.name] || [];
      for (const ingredient of ingredients) {
        // In Supabase/Postgres, we can use RPC or a transaction for atomic updates
        // For simplicity here, we'll do it sequentially
        const { data: inv } = await getSupabase().from('inventory').select('stock').eq('name', ingredient).single();
        if (inv) {
          await getSupabase().from('inventory').update({ stock: Math.max(0, inv.stock - item.quantity) }).eq('name', ingredient);
        }
      }

      const price = typeof item.price === 'string' ? parseFloat(item.price.replace('₱', '')) : item.price;
      const revenue = price * item.quantity;
      const now = new Date().toISOString();
      
      const { data: existingStat } = await getSupabase().from('product_stats').select('*').eq('id', item.name).single();
      if (existingStat) {
        await getSupabase().from('product_stats').update({
          totalSales: existingStat.totalSales + item.quantity,
          totalRevenue: existingStat.totalRevenue + revenue,
          lastSold: now
        }).eq('id', item.name);
      } else {
        await getSupabase().from('product_stats').insert({
          id: item.name,
          category: 'Menu Item',
          totalSales: item.quantity,
          totalRevenue: revenue,
          lastSold: now
        });
      }
    }
    
    await getSupabase().from('orders').update({ status: 'completed', revenueAdded: true }).eq('id', orderId);
    res.json({ success: true });
  });

  // Staff API
  app.get('/api/admin/staff', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const { data } = await getSupabase().from('staff').select('*');
    res.json(data);
  });

  app.post('/api/admin/staff', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    await getSupabase().from('staff').insert(req.body);
    res.json({ success: true });
  });

  app.put('/api/admin/staff/:id', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    await getSupabase().from('staff').update(req.body).eq('id', req.params.id);
    res.json({ success: true });
  });

  app.delete('/api/admin/staff/:id', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    await getSupabase().from('staff').delete().eq('id', req.params.id);
    res.json({ success: true });
  });

  // Vendors API
  app.get('/api/admin/vendors', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const { data } = await getSupabase().from('vendors').select('*');
    res.json(data);
  });

  app.post('/api/admin/vendors', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    await getSupabase().from('vendors').insert(req.body);
    res.json({ success: true });
  });

  app.delete('/api/admin/vendors/:id', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    await getSupabase().from('vendors').delete().eq('id', req.params.id);
    res.json({ success: true });
  });

  // Product Stats API
  app.get('/api/admin/product-stats', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const { data } = await getSupabase().from('product_stats').select('*').order('totalSales', { ascending: false });
    res.json(data);
  });

  app.patch('/api/admin/orders/:id', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    await getSupabase().from('orders').update({ status: req.body.status }).eq('id', req.params.id);
    res.json({ success: true });
  });

  app.get('/api/admin/inventory', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const { data } = await getSupabase().from('inventory').select('*');
    res.json(data);
  });

  app.patch('/api/admin/inventory/:id', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    await getSupabase().from('inventory').update({ stock: req.body.stock }).eq('id', req.params.id);
    res.json({ success: true });
  });

  app.get('/api/admin/analytics', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    try {
      const { data: revenueData } = await getSupabase().from('orders').select('total').eq('revenueAdded', true);
      const { count: totalOrders } = await getSupabase().from('orders').select('*', { count: 'exact', head: true });
      const { count: pendingOrders } = await getSupabase().from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending');
      
      const totalRevenue = (revenueData || []).reduce((sum: number, o: any) => sum + Number(o.total), 0);

      const { data: completedOrders } = await getSupabase().from('orders').select('items').eq('status', 'completed');
      const productCounts: Record<string, number> = {};
      (completedOrders || []).forEach((o: any) => {
        o.items.forEach((item: any) => {
          productCounts[item.name] = (productCounts[item.name] || 0) + item.quantity;
        });
      });
      const topProducts = Object.entries(productCounts)
        .map(([name, sales]) => ({ name, sales }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5);

      const { count: totalCustomers } = await getSupabase().from('users').select('*', { count: 'exact', head: true }).eq('role', 'customer');
      const { count: lowStockCount } = await getSupabase().from('inventory').select('*', { count: 'exact', head: true }).lte('stock', 'minStock');

      // Daily revenue logic would need more complex SQL or multiple queries
      // For now returning empty or simplified
      const dailyRevenue: any[] = [];

      res.json({ 
        totalRevenue, 
        totalOrders: totalOrders || 0, 
        pendingOrders: pendingOrders || 0,
        topProducts,
        totalCustomers: totalCustomers || 0,
        lowStockCount: lowStockCount || 0,
        dailyRevenue
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  });

  app.get('/api/admin/users', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    try {
      const { data, error } = await getSupabase()
        .from('users')
        .select('*')
        .order('username');
      if (error) throw error;
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.patch('/api/admin/users/:id/role', authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const { role } = req.body;
    try {
      const { data, error } = await getSupabase()
        .from('users')
        .update({ role })
        .eq('id', req.params.id)
        .select()
        .single();
      if (error) throw error;
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
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

