import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticate, requireAdmin, getSupabase } from '../../../_utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const user = await authenticate(req);
  if (!requireAdmin(user, res)) return;

  const { id } = req.query;
  const supabase = getSupabase();

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

  const { error: receiptError } = await supabase
    .from('receipts')
    .insert({ id: receiptId, orderId: id, content });

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
  res.json({ success: true, receiptId });
}
