import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticate, requireAdmin, getSupabase } from '../_utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const user = await authenticate(req);
  if (!requireAdmin(user, res)) return;

  try {
    const supabase = getSupabase();

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
      .from('orders')
      .select('total, createdAt')
      .eq('revenueAdded', true)
      .gte('createdAt', sevenDaysAgo.toISOString());

    const dailyRevenueMap: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dailyRevenueMap[dateStr] = 0;
    }

    (recentRevenueData || []).forEach((o: any) => {
      const dateStr = new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (dailyRevenueMap[dateStr] !== undefined) {
        dailyRevenueMap[dateStr] += Number(o.total);
      }
    });

    const dailyRevenue = Object.entries(dailyRevenueMap).map(([date, revenue]) => ({ date, revenue }));

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
}
