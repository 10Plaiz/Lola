import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticate, requireAuth, getSupabase } from '../_utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const user = await authenticate(req);
    if (!requireAuth(user, res)) return;

    const supabase = getSupabase();
    const { data: userOrders } = await supabase.from('orders').select('id').eq('userId', user.id);
    if (userOrders?.length) {
      await supabase.from('receipts').delete().in('orderId', userOrders.map((o: any) => o.id));
    }
    await supabase.from('orders').delete().eq('userId', user.id);

    const { error: profileError } = await supabase.from('users').delete().eq('id', user.id);
    if (profileError) return res.status(500).json({ error: 'Failed to delete profile' });

    const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
    if (authError) return res.status(500).json({ error: 'Failed to delete auth user' });

    return res.json({ success: true });
  } catch (err: any) {
    console.error('Delete account error:', err);
    return res.status(500).json({ error: err.message || 'Failed to delete account' });
  }
}
