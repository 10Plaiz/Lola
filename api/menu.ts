import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabase } from './_utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    console.log('[menu] Handler invoked, method:', req.method);
    const supabase = getSupabase();
    console.log('[menu] Supabase client obtained, querying menu table...');
    const { data, error, status, statusText } = await supabase.from('menu').select('*');
    console.log('[menu] Supabase response - status:', status, statusText, '| error:', error?.message || 'none', '| rows:', data?.length ?? 'null');
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch menu', details: error.message, code: error.code, hint: error.hint });
    }
    res.json(data);
  } catch (err: any) {
    console.error('[menu] Handler exception:', err.message, err.stack);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
