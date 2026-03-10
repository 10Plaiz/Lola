export default function handler(req: any, res: any) {
  res.json({
    ok: true,
    node: process.version,
    env: {
      VITE_SUPABASE_URL: !!process.env.VITE_SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
  });
}
