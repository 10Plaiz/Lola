import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticate, requireAdmin, getSupabase } from '../../_utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const user = await authenticate(req);
  if (!requireAdmin(user, res)) return;

  const { data, error } = await getSupabase()
    .from('orders')
    .select('*')
    .order('createdAt', { ascending: false });

  if (error) return res.status(500).json({ error: 'Failed to fetch orders' });
  res.json(data.map((o: any) => ({ ...o, total: `₱${o.total}` })));
}
