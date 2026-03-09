import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabase } from './_utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    res.json({
      status: 'ok',
      supabaseConnected: !error,
      supabaseError: error ? error.message : null
    });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message });
  }
}
