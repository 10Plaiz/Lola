import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticate, requireAuth, getSupabase } from './_utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const user = await authenticate(req);
  if (!requireAuth(user, res)) return;

  const { items, total, paymentMethod, gcashNumber, gcashReceipt } = req.body;
  const id = 'ORD-' + Date.now();
  const numericTotal = parseFloat(total.replace('₱', ''));

  const { data, error } = await getSupabase()
    .from('orders')
    .insert({
      id,
      userId: user.id,
      username: user.username,
      items,
      total: numericTotal,
      paymentMethod,
      gcashNumber,
      gcashReceipt: gcashReceipt || null,
      status: 'pending'
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: 'Order failed' });
  res.json(data);
}
