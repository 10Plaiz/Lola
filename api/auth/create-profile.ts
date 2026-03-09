import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticate, requireAuth, getSupabase } from '../_utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

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
  res.json({ success: true, user: data });
}
