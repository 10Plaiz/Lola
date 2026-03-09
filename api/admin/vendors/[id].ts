import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticate, requireAdmin, getSupabase } from '../../_utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });

  const user = await authenticate(req);
  if (!requireAdmin(user, res)) return;

  const { id } = req.query;
  await getSupabase().from('vendors').delete().eq('id', id);
  res.json({ success: true });
}
