-- ==============================================================================
-- BRAND MY MAC — SUPABASE DATABASE SCHEMA
-- Copy and run this entire file in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/rlpyzofaulakcqaiiyxh/sql/new
-- ==============================================================================

-- 1. CLAIMED SPOTS TABLE (Core table for Brand My Mac laptop advertising)
CREATE TABLE IF NOT EXISTS public.claimed_spots (
  id BIGSERIAL PRIMARY KEY,
  spot_id INTEGER NOT NULL UNIQUE,
  website_url TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.claimed_spots ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow public read access (anon and authenticated users can view all claimed spots)
DROP POLICY IF EXISTS "Allow public read access" ON public.claimed_spots;
CREATE POLICY "Allow public read access" ON public.claimed_spots
  FOR SELECT TO anon, authenticated
  USING (true);

-- Policy 2: Allow public insert (allows checkout and webhook claim submissions)
DROP POLICY IF EXISTS "Allow public insert" ON public.claimed_spots;
CREATE POLICY "Allow public insert" ON public.claimed_spots
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Policy 3: Allow updates
DROP POLICY IF EXISTS "Allow public update" ON public.claimed_spots;
CREATE POLICY "Allow public update" ON public.claimed_spots
  FOR UPDATE TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Grant table & sequence permissions to anon and authenticated roles
GRANT ALL ON TABLE public.claimed_spots TO anon, authenticated, service_role;
GRANT USAGE, SELECT ON SEQUENCE public.claimed_spots_id_seq TO anon, authenticated, service_role;

-- Enable Realtime for claimed_spots
ALTER PUBLICATION supabase_realtime ADD TABLE public.claimed_spots;


-- ==============================================================================
-- 2. TODOS TABLE (Sample table from Supabase Next.js quickstart tutorial)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.todos (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on todos" ON public.todos;
CREATE POLICY "Allow public read access on todos" ON public.todos
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow public insert on todos" ON public.todos;
CREATE POLICY "Allow public insert on todos" ON public.todos
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

GRANT ALL ON TABLE public.todos TO anon, authenticated, service_role;
GRANT USAGE, SELECT ON SEQUENCE public.todos_id_seq TO anon, authenticated, service_role;

-- Seed some initial sample todos
INSERT INTO public.todos (name) VALUES 
  ('Check out MacBook lid spots'),
  ('Claim spot #1 for brand launch')
ON CONFLICT DO NOTHING;
