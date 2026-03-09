import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticate, requireAdmin, getSupabase } from '../../_utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end();

  const user = await authenticate(req);
  if (!requireAdmin(user, res)) return;

  const { id } = req.query;
  const supabase = getSupabase();

  if (req.method === 'PUT') {
    await supabase.from('staff').update(req.body).eq('id', id);
    return res.json({ success: true });
  }

  if (req.method === 'DELETE') {
    await supabase.from('staff').delete().eq('id', id);
    return res.json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
