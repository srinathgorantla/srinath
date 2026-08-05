-- =======================================================
-- AGRIWISE AI - SUPABASE POSTGRESQL SCHEMA & RLS POLICIES
-- =======================================================
-- Paste and run this SQL script in the Supabase SQL Editor

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Farms Table
CREATE TABLE IF NOT EXISTS public.farms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    size NUMERIC NOT NULL CHECK (size > 0), -- Size in acres
    soil_type TEXT NOT NULL,                -- e.g., 'Loam', 'Clay', 'Sandy', 'Silt', 'Peat', 'Chalk'
    region TEXT NOT NULL,                   -- e.g., 'Midwest', 'Sub-Saharan', 'Mediterranean', 'Tropical', etc.
    climate_notes TEXT DEFAULT '',          -- Additional field observations
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create Advisories Table
CREATE TABLE IF NOT EXISTS public.advisories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    target_crop TEXT NOT NULL,
    budget NUMERIC NOT NULL CHECK (budget >= 0),
    ai_response_json JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Automatic Updated At Trigger for Farms
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_farms_updated_at ON public.farms;
CREATE TRIGGER set_farms_updated_at
BEFORE UPDATE ON public.farms
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisories ENABLE ROW LEVEL SECURITY;

-- 6. Strict RLS Policies for Farms
-- Allow users to SELECT only their own farms
DROP POLICY IF EXISTS "Users can view their own farms" ON public.farms;
CREATE POLICY "Users can view their own farms"
ON public.farms FOR SELECT
USING (auth.uid() = user_id);

-- Allow users to INSERT their own farms
DROP POLICY IF EXISTS "Users can insert their own farms" ON public.farms;
CREATE POLICY "Users can insert their own farms"
ON public.farms FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to UPDATE their own farms
DROP POLICY IF EXISTS "Users can update their own farms" ON public.farms;
CREATE POLICY "Users can update their own farms"
ON public.farms FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow users to DELETE their own farms
DROP POLICY IF EXISTS "Users can delete their own farms" ON public.farms;
CREATE POLICY "Users can delete their own farms"
ON public.farms FOR DELETE
USING (auth.uid() = user_id);


-- 7. Strict RLS Policies for Advisories
-- Allow users to SELECT only their own advisories
DROP POLICY IF EXISTS "Users can view their own advisories" ON public.advisories;
CREATE POLICY "Users can view their own advisories"
ON public.advisories FOR SELECT
USING (auth.uid() = user_id);

-- Allow users to INSERT their own advisories
DROP POLICY IF EXISTS "Users can insert their own advisories" ON public.advisories;
CREATE POLICY "Users can insert their own advisories"
ON public.advisories FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to DELETE their own advisories
DROP POLICY IF EXISTS "Users can delete their own advisories" ON public.advisories;
CREATE POLICY "Users can delete their own advisories"
ON public.advisories FOR DELETE
USING (auth.uid() = user_id);

-- 8. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_farms_user_id ON public.farms(user_id);
CREATE INDEX IF NOT EXISTS idx_advisories_user_id ON public.advisories(user_id);
CREATE INDEX IF NOT EXISTS idx_advisories_farm_id ON public.advisories(farm_id);
