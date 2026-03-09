import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticate, requireAuth } from '../_utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const user = await authenticate(req);
  if (!requireAuth(user, res)) return;
  res.json({ user });
}
