-- Run this in Supabase SQL Editor AFTER 01-create-menu-table.sql
-- Creates a storage bucket for menu images

-- Create the storage bucket (run via Supabase Dashboard > Storage > New Bucket instead if this fails)
-- Bucket name: menu-images, Public: true

-- If tables already exist (users, orders, receipts, inventory, etc.), you can skip those.
-- This script ensures RLS policies allow the serverless functions (service_role) to work.

-- Ensure the menu table allows service_role full access for admin operations
-- (The service_role key bypasses RLS, so these policies are for the anon/authenticated roles)

-- Public read for menu (already set in 01, safe to re-run)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Menu is publicly readable' AND tablename = 'menu') THEN
    EXECUTE 'CREATE POLICY "Menu is publicly readable" ON menu FOR SELECT USING (true)';
  END IF;
END $$;
