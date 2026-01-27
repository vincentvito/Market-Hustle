-- Migration: User Lifecycle & State-Aware Architecture
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)

-- ============================================
-- 1. ADD USERNAME COLUMN TO PROFILES
-- ============================================

-- Add username column with unique constraint
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- Create index for faster username lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- ============================================
-- 2. ENABLE RLS ON PROFILES TABLE
-- ============================================

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Service role has full access to profiles" ON profiles;

-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
-- Note: tier field updates are controlled by webhook (service role), not client
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile (for initial creation)
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Service role (webhooks) bypasses RLS automatically

-- ============================================
-- 3. ENABLE RLS ON SUBSCRIPTIONS TABLE
-- ============================================

-- Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Users can view own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Service role has full access to subscriptions" ON subscriptions;

-- Users can view their own subscription
CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Only service role can insert/update/delete subscriptions (webhooks)
-- Service role bypasses RLS automatically, so no explicit policy needed

-- ============================================
-- VERIFICATION QUERIES (run these to verify)
-- ============================================

-- Check that username column exists:
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_name = 'profiles' AND column_name = 'username';

-- Check RLS is enabled:
-- SELECT tablename, rowsecurity FROM pg_tables
-- WHERE schemaname = 'public' AND tablename IN ('profiles', 'subscriptions');

-- Check policies exist:
-- SELECT tablename, policyname, cmd FROM pg_policies
-- WHERE schemaname = 'public';
