import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabase } from './_utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    console.log('[health] Handler invoked');
    const supabase = getSupabase();

    // Test users table
    const { error: usersErr } = await supabase.from('users').select('count', { count: 'exact', head: true });
    console.log('[health] users table:', usersErr ? `ERROR: ${usersErr.message}` : 'OK');

    // Test menu table
    const { data: menuData, error: menuErr } = await supabase.from('menu').select('count', { count: 'exact', head: true });
    console.log('[health] menu table:', menuErr ? `ERROR: ${menuErr.message} (code: ${menuErr.code})` : 'OK');

    const envCheck = {
      VITE_SUPABASE_URL: !!process.env.VITE_SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
    };

    res.json({
      status: 'ok',
      tables: {
        users: usersErr ? { error: usersErr.message, code: usersErr.code } : 'connected',
        menu: menuErr ? { error: menuErr.message, code: menuErr.code } : 'connected',
      },
      envVars: envCheck,
    });
  } catch (err: any) {
    console.error('[health] Handler exception:', err.message, err.stack);
    res.status(500).json({ status: 'error', message: err.message });
  }
}
