import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticate, requireAuth, getSupabase } from '../_utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end();

  const rawPath = req.query.path;
  const route = Array.isArray(rawPath) ? rawPath[0] : rawPath;

  // GET /api/auth/me
  if (route === 'me' && req.method === 'GET') {
    const user = await authenticate(req);
    if (!requireAuth(user, res)) return;
    return res.json({ user });
  }

  // POST /api/auth/create-profile
  if (route === 'create-profile' && req.method === 'POST') {
    const user = await authenticate(req);
    if (!requireAuth(user, res)) return;

    if (user.profileExists) return res.json({ success: true, message: 'Profile already exists' });

    const { username, phone } = req.body;
    const { data, error } = await getSupabase()
      .from('users')
      .insert({ id: user.id, username, email: user.email, phone, role: 'customer' })
      .select()
      .single();

    if (error) return res.status(500).json({ error: 'Failed to create profile' });
    return res.json({ success: true, user: data });
  }

  // DELETE /api/auth/delete-account
  if (route === 'delete-account' && req.method === 'DELETE') {
    const user = await authenticate(req);
    if (!requireAuth(user, res)) return;

    try {
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
    } catch (err) {
      console.error('Delete account error:', err);
      return res.status(500).json({ error: 'Failed to delete account' });
    }
  }

  return res.status(404).json({ error: 'Not found' });
}
