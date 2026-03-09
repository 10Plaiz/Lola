import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticate, requireAdmin, getSupabase, ITEM_INGREDIENTS } from '../../../_utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const user = await authenticate(req);
  if (!requireAdmin(user, res)) return;

  const { id } = req.query;
  const supabase = getSupabase();

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
        id: item.name,
        category: 'Menu Item',
        totalSales: item.quantity,
        totalRevenue: revenue,
        lastSold: now
      });
    }
  }

  await supabase.from('orders').update({ status: 'completed', revenueAdded: true }).eq('id', id);
  res.json({ success: true });
}
