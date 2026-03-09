import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticate, requireAdmin, getSupabase } from '../../_utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const user = await authenticate(req);
  if (!requireAdmin(user, res)) return;

  try {
    const { name, description, price, category, imageUrl } = req.body;
    const { data, error } = await getSupabase()
      .from('menu')
      .insert({ name, description, price, category, imageUrl: imageUrl || null })
      .select()
      .single();

    if (error) return res.status(500).json({ error: 'Failed to add menu item' });
    res.json({ success: true, id: data.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add menu item' });
  }
}
