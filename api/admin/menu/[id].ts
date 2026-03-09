import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticate, requireAdmin, getSupabase } from '../../_utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end();

  const user = await authenticate(req);
  if (!requireAdmin(user, res)) return;

  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      const { name, description, price, category, imageUrl } = req.body;
      const updateData: any = { name, description, price, category };
      if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

      const { error } = await getSupabase().from('menu').update(updateData).eq('id', id);
      if (error) return res.status(500).json({ error: 'Failed to update menu item' });
      return res.json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to update menu item' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { error } = await getSupabase().from('menu').delete().eq('id', id);
      if (error) return res.status(500).json({ error: 'Failed to delete menu item' });
      return res.json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to delete menu item' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
