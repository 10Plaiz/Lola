import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticate, requireAdmin, getSupabase } from '../../_utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end();

  const user = await authenticate(req);
  if (!requireAdmin(user, res)) return;

  const supabase = getSupabase();

  if (req.method === 'GET') {
    const { data } = await supabase.from('vendors').select('*');
    return res.json(data);
  }

  if (req.method === 'POST') {
    await supabase.from('vendors').insert(req.body);
    return res.json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
