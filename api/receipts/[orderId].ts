import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticate, requireAuth, getSupabase } from '../_utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const user = await authenticate(req);
  if (!requireAuth(user, res)) return;

  const { orderId } = req.query;
  const { data, error } = await getSupabase()
    .from('receipts')
    .select('*')
    .eq('orderId', orderId)
    .single();

  if (error) return res.status(404).json({ error: 'Receipt not found' });
  res.json(data);
}
