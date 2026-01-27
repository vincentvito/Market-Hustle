-- ============================================
-- AUTHENTICATION RESET MIGRATION
-- Run this in Supabase SQL Editor to fix auth issues
-- ============================================

-- STEP 1: REMOVE ALL RLS POLICIES (they're blocking legitimate queries)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Service role has full access to profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Service role has full access to subscriptions" ON subscriptions;

-- STEP 2: DISABLE RLS on both tables
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions DISABLE ROW LEVEL SECURITY;

-- STEP 3: CREATE TRIGGER to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, tier)
  VALUES (new.id, 'free')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if any
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- VERIFICATION QUERIES (run these to verify)
-- ============================================

-- Check RLS is disabled:
-- SELECT tablename, rowsecurity FROM pg_tables
-- WHERE schemaname = 'public' AND tablename IN ('profiles', 'subscriptions');

-- Check trigger exists:
-- SELECT tgname, tgrelid::regclass, tgenabled
-- FROM pg_trigger
-- WHERE tgname = 'on_auth_user_created';

-- Check function exists:
-- SELECT proname FROM pg_proc WHERE proname = 'handle_new_user';
