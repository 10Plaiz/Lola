import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticate, requireAdmin, getSupabase, ITEM_INGREDIENTS } from '../_utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end();

  const user = await authenticate(req);
  if (!requireAdmin(user, res)) return;

  const supabase = getSupabase();
  const pathSegments = Array.isArray(req.query.path) ? req.query.path : [req.query.path];
  const [resource, id, action] = pathSegments;

  // --- ORDERS ---
  if (resource === 'orders') {
    // GET /api/admin/orders
    if (!id && req.method === 'GET') {
      const { data, error } = await supabase.from('orders').select('*').order('createdAt', { ascending: false });
      if (error) return res.status(500).json({ error: 'Failed to fetch orders' });
      return res.json(data.map((o: any) => ({ ...o, total: `₱${o.total}` })));
    }

    // PATCH /api/admin/orders/:id
    if (id && !action && req.method === 'PATCH') {
      await supabase.from('orders').update({ status: req.body.status }).eq('id', id);
      return res.json({ success: true });
    }

    // POST /api/admin/orders/:id/generate-receipt
    if (id && action === 'generate-receipt' && req.method === 'POST') {
      const { data: order } = await supabase.from('orders').select('*').eq('id', id).single();
      if (!order) return res.status(404).json({ error: 'Order not found' });

      const receiptId = 'REC-' + Date.now();
      const content = {
        orderId: id,
        customer: order.username,
        items: order.items,
        total: order.total,
        paymentMethod: order.paymentMethod,
        date: new Date().toISOString()
      };

      const { error: receiptError } = await supabase.from('receipts').insert({ id: receiptId, orderId: id, content });
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

      await supabase.from('orders').update(updateData).eq('id', id);
      return res.json({ success: true, receiptId });
    }

    // POST /api/admin/orders/:id/finish
    if (id && action === 'finish' && req.method === 'POST') {
      const { data: order } = await supabase.from('orders').select('*').eq('id', id).single();
      if (!order) return res.status(404).json({ error: 'Order not found' });

      for (const item of order.items) {
        const ingredients = ITEM_INGREDIENTS[item.name] || [];
        for (const ingredient of ingredients) {
          const { data: inv } = await supabase.from('inventory').select('stock').eq('name', ingredient).single();
          if (inv) {
            await supabase.from('inventory').update({ stock: Math.max(0, inv.stock - item.quantity) }).eq('name', ingredient);
          }
        }

        const price = typeof item.price === 'string' ? parseFloat(item.price.replace('₱', '')) : item.price;
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
            id: item.name, category: 'Menu Item',
            totalSales: item.quantity, totalRevenue: revenue, lastSold: now
          });
        }
      }

      await supabase.from('orders').update({ status: 'completed', revenueAdded: true }).eq('id', id);
      return res.json({ success: true });
    }
  }

  // --- INVENTORY ---
  if (resource === 'inventory') {
    // GET /api/admin/inventory
    if (!id && req.method === 'GET') {
      const { data } = await supabase.from('inventory').select('*').order('id', { ascending: true });
      return res.json(data);
    }
    // PATCH /api/admin/inventory/:id
    if (id && req.method === 'PATCH') {
      await supabase.from('inventory').update({ stock: req.body.stock }).eq('id', id);
      return res.json({ success: true });
    }
  }

  // --- STAFF ---
  if (resource === 'staff') {
    if (!id && req.method === 'GET') {
      const { data } = await supabase.from('staff').select('*');
      return res.json(data);
    }
    if (!id && req.method === 'POST') {
      await supabase.from('staff').insert(req.body);
      return res.json({ success: true });
    }
    if (id && req.method === 'PUT') {
      await supabase.from('staff').update(req.body).eq('id', id);
      return res.json({ success: true });
    }
    if (id && req.method === 'DELETE') {
      await supabase.from('staff').delete().eq('id', id);
      return res.json({ success: true });
    }
  }

  // --- VENDORS ---
  if (resource === 'vendors') {
    if (!id && req.method === 'GET') {
      const { data } = await supabase.from('vendors').select('*');
      return res.json(data);
    }
    if (!id && req.method === 'POST') {
      await supabase.from('vendors').insert(req.body);
      return res.json({ success: true });
    }
    if (id && req.method === 'DELETE') {
      await supabase.from('vendors').delete().eq('id', id);
      return res.json({ success: true });
    }
  }

  // --- MENU (admin) ---
  if (resource === 'menu') {
    if (!id && req.method === 'POST') {
      const { name, description, price, category, imageUrl } = req.body;
      const { data, error } = await supabase
        .from('menu')
        .insert({ name, description, price, category, imageUrl: imageUrl || null })
        .select()
        .single();
      if (error) return res.status(500).json({ error: 'Failed to add menu item' });
      return res.json({ success: true, id: data.id });
    }
    if (id && req.method === 'PUT') {
      const { name, description, price, category, imageUrl } = req.body;
      const updateData: any = { name, description, price, category };
      if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
      const { error } = await supabase.from('menu').update(updateData).eq('id', id);
      if (error) return res.status(500).json({ error: 'Failed to update menu item' });
      return res.json({ success: true });
    }
    if (id && req.method === 'DELETE') {
      const { error } = await supabase.from('menu').delete().eq('id', id);
      if (error) return res.status(500).json({ error: 'Failed to delete menu item' });
      return res.json({ success: true });
    }
  }

  // --- PRODUCT STATS ---
  if (resource === 'product-stats' && req.method === 'GET') {
    const { data } = await supabase.from('product_stats').select('*').order('totalSales', { ascending: false });
    return res.json(data);
  }

  // --- ANALYTICS ---
  if (resource === 'analytics' && req.method === 'GET') {
    try {
      const { data: revenueData } = await supabase.from('orders').select('total').eq('revenueAdded', true);
      const { count: totalOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true });
      const { count: pendingOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending');
      const totalRevenue = (revenueData || []).reduce((sum: number, o: any) => sum + Number(o.total), 0);

      const { data: completedOrders } = await supabase.from('orders').select('items').eq('status', 'completed');
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

      const { count: totalCustomers } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'customer');
      const { count: lowStockCount } = await supabase.from('inventory').select('*', { count: 'exact', head: true }).lte('stock', 'minStock');

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const { data: recentRevenueData } = await supabase
        .from('orders').select('total, createdAt').eq('revenueAdded', true).gte('createdAt', sevenDaysAgo.toISOString());

      const dailyRevenueMap: Record<string, number> = {};
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dailyRevenueMap[d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })] = 0;
      }
      (recentRevenueData || []).forEach((o: any) => {
        const dateStr = new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (dailyRevenueMap[dateStr] !== undefined) dailyRevenueMap[dateStr] += Number(o.total);
      });

      return res.json({
        totalRevenue, totalOrders: totalOrders || 0, pendingOrders: pendingOrders || 0,
        topProducts, totalCustomers: totalCustomers || 0, lowStockCount: lowStockCount || 0,
        dailyRevenue: Object.entries(dailyRevenueMap).map(([date, revenue]) => ({ date, revenue }))
      });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  }

  return res.status(404).json({ error: 'Not found' });
}
