import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

let supabaseClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!supabaseClient) {
    const url = process.env.VITE_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    console.log('[getSupabase] VITE_SUPABASE_URL set:', !!url, url ? `(${url.substring(0, 30)}...)` : '(missing)');
    console.log('[getSupabase] SUPABASE_SERVICE_ROLE_KEY set:', !!key, key ? `(${key.length} chars)` : '(missing)');
    if (!url || !key) throw new Error(`Missing Supabase credentials: url=${!!url}, key=${!!key}`);
    supabaseClient = createClient(url, key);
    console.log('[getSupabase] Client created successfully');
  }
  return supabaseClient;
}

export async function authenticate(req: VercelRequest) {
  let token = req.cookies?.['sb-access-token'];
  if (!token) {
    const auth = req.headers['authorization'];
    if (auth && auth.startsWith('Bearer ')) {
      token = auth.slice(7);
    }
  }
  if (!token) return null;

  const supabase = getSupabase();
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;

  let { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile && user.user_metadata) {
    const { username, phone } = user.user_metadata;
    if (username) {
      const { data: newProfile } = await supabase
        .from('users')
        .insert({ id: user.id, username, email: user.email, phone: phone || '', role: 'customer' })
        .select()
        .single();
      if (newProfile) profile = newProfile;
    }
  }

  return { ...user, ...profile, profileExists: !!profile };
}

export function requireAuth(user: any, res: VercelResponse): boolean {
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}

export function requireAdmin(user: any, res: VercelResponse): boolean {
  if (!requireAuth(user, res)) return false;
  if (user.role !== 'admin') {
    res.status(403).json({ error: 'Forbidden' });
    return false;
  }
  return true;
}

export const ITEM_INGREDIENTS: Record<string, string[]> = {
  'Americano': ['Espresso', 'Water'],
  'Purificacion (Sweetened Americano)': ['Espresso', 'Water', 'Simple Syrup'],
  'Vietnamese Coffee': ['Espresso', 'Sweetened Condensed Milk'],
  'Café Latte': ['Espresso', 'Standard Milk'],
  'Spanish Latte': ['Espresso', 'Standard Milk', 'Sweetened Condensed Milk'],
  'French Vanilla': ['Espresso', 'Standard Milk', 'French Vanilla Syrup'],
  'Hazelnut': ['Espresso', 'Standard Milk', 'Hazelnut Syrup'],
  'Mocha': ['Espresso', 'Standard Milk', 'Chocolate Sauce'],
  'White Chocolate Mocha': ['Espresso', 'Standard Milk', 'White Chocolate Sauce'],
  'Salted Caramel': ['Espresso', 'Standard Milk', 'Salted Caramel Sauce'],
  'Caramel Mocha': ['Espresso', 'Standard Milk', 'Caramel Sauce', 'Chocolate Sauce'],
  'Dark Mocha': ['Espresso', 'Standard Milk', 'Dark Chocolate Sauce'],
  'Caramel Macchiato': ['Espresso', 'Standard Milk', 'Vanilla Syrup', 'Caramel Sauce'],
  'Dirty Matcha': ['Espresso', 'Standard Milk', 'Matcha Powder'],
  'Tiger Sugar Milk': ['Brown Sugar', 'Standard Milk'],
  'Blueberry Latte': ['Standard Milk', 'Blueberry Syrup'],
  'Strawberry Latte': ['Standard Milk', 'Strawberry Syrup'],
  'Classic Chocolate': ['Standard Milk', 'Chocolate Sauce'],
  'Red Velvet': ['Standard Milk', 'Red Velvet Powder'],
  'Caramel Milk': ['Standard Milk', 'Caramel Sauce'],
  'Triple Chocolate': ['Standard Milk', 'Chocolate Sauce', 'White Chocolate Sauce', 'Dark Chocolate Sauce'],
  'Mixed Berries Latte': ['Standard Milk', 'Mixed Berries Syrup'],
  'Oreo Latte': ['Standard Milk', 'Crushed Oreo Cookies', 'Simple Syrup'],
  'Taro Latte': ['Standard Milk', 'Taro Powder'],
  'Strawberry Oreo Latte': ['Standard Milk', 'Strawberry Syrup', 'Crushed Oreo Cookies'],
  'Dark Berry': ['Standard Milk', 'Dark Berry Syrup'],
  'Blueberry Soda': ['Carbonated Water', 'Blueberry Jam', 'Ice'],
  'Strawberry Soda': ['Carbonated Water', 'Strawberry Jam', 'Ice'],
  'Mixed Berries Soda': ['Carbonated Water', 'Mixed Berries Jam', 'Ice'],
  'Sea Salt Latte': ['Espresso', 'Standard Milk', 'Sea Salt Cream'],
  'Sea Salt Chocolate': ['Standard Milk', 'Chocolate Sauce', 'Sea Salt Cream'],
  'Sea Salt Spanish Latte': ['Espresso', 'Standard Milk', 'Sweetened Condensed Milk', 'Sea Salt Cream'],
  'Sea Salt Spanish Oat': ['Espresso', 'Oat Milk', 'Sweetened Condensed Milk', 'Sea Salt Cream'],
  'Sea Salt Red Velvet': ['Standard Milk', 'Red Velvet Powder', 'Sea Salt Cream'],
  'Sea Salt Mocha': ['Espresso', 'Standard Milk', 'Chocolate Sauce', 'Sea Salt Cream'],
  'Sea Salt Matcha Latte': ['Standard Milk', 'Matcha Powder', 'Sea Salt Cream'],
  'Sea Salt Matcha Oat': ['Oat Milk', 'Matcha Powder', 'Sea Salt Cream'],
  'Sea Salt Caramel Latte': ['Espresso', 'Standard Milk', 'Caramel Sauce', 'Sea Salt Cream'],
  'Sea Salt Caramel Mocha': ['Espresso', 'Standard Milk', 'Caramel Sauce', 'Chocolate Sauce', 'Sea Salt Cream'],
  'Sea Salt Triple Chocolate': ['Standard Milk', 'Chocolate Sauce', 'White Chocolate Sauce', 'Dark Chocolate Sauce', 'Sea Salt Cream'],
  'Sea Salt Taro Latte': ['Standard Milk', 'Taro Powder', 'Sea Salt Cream'],
  'Matcha Latte': ['Standard Milk', 'Matcha Powder', 'Simple Syrup'],
  'Blueberry Matcha Latte': ['Standard Milk', 'Matcha Powder', 'Blueberry Syrup'],
  'Strawberry Matcha Latte': ['Standard Milk', 'Matcha Powder', 'Strawberry Syrup'],
  'Salted Caramel Matcha': ['Standard Milk', 'Matcha Powder', 'Salted Caramel Sauce'],
  'White Chocolate Matcha': ['Standard Milk', 'Matcha Powder', 'White Chocolate Sauce'],
  'Matcha Oreo Latte': ['Standard Milk', 'Matcha Powder', 'Crushed Oreo Cookies'],
  'Iced Brown': ['Espresso', 'Standard Milk', 'Brown Sugar'],
  'Espresso Cookie': ['Espresso', 'Standard Milk', 'Crushed Oreo Cookies'],
  'Oro Blanco': ['Espresso', 'Oat Milk', 'White Chocolate Sauce', 'Brown Sugar'],
  'Quad Espresso': ['Espresso', 'Chocolate Sauce'],
  'Sub-Oat': ['Oat Milk'],
  'Espresso Shot': ['Espresso'],
  'Sea Salt Cream': ['Sea Salt Cream'],
  'Sauce pump': ['Sauce'],
  'Syrup pump': ['Syrup'],
  'Jam Scoop': ['Jam']
};
