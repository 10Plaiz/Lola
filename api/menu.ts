import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabase } from './_utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { data, error } = await getSupabase().from('menu').select('*');
  if (error) return res.status(500).json({ error: 'Failed to fetch menu' });
  res.json(data);
}
