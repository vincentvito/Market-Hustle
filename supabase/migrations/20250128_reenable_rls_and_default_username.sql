-- ============================================
-- RE-ENABLE RLS AND ADD DEFAULT USERNAME
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- PART A: RE-ENABLE ROW LEVEL SECURITY
-- ============================================

-- Re-enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (clean slate)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Re-enable RLS on subscriptions table
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if any
DROP POLICY IF EXISTS "Users can view own subscription" ON subscriptions;

-- Create policy for subscriptions
CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- PART B: UPDATE TRIGGER FOR DEFAULT USERNAME
-- ============================================

-- Update the handle_new_user function to generate default username
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  default_username TEXT;
  random_suffix TEXT;
  attempts INT := 0;
BEGIN
  -- Generate Hustler_#XXXX format with collision retry
  LOOP
    random_suffix := floor(random() * 9000 + 1000)::TEXT;
    default_username := 'Hustler_#' || random_suffix;

    -- Check if username already exists
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE username = default_username) THEN
      EXIT; -- Unique username found
    END IF;

    attempts := attempts + 1;
    IF attempts > 10 THEN
      -- Fallback: use UUID prefix for guaranteed uniqueness
      default_username := 'Hustler_' || substr(new.id::TEXT, 1, 8);
      EXIT;
    END IF;
  END LOOP;

  INSERT INTO public.profiles (id, username, tier)
  VALUES (new.id, default_username, 'free')
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- VERIFICATION QUERIES (run these to verify)
-- ============================================

-- Check RLS is enabled:
-- SELECT tablename, rowsecurity FROM pg_tables
-- WHERE schemaname = 'public' AND tablename IN ('profiles', 'subscriptions');
-- Should show: rowsecurity = true for both

-- Check policies exist:
-- SELECT policyname, tablename, cmd FROM pg_policies
-- WHERE schemaname = 'public';

-- Check function is updated:
-- SELECT prosrc FROM pg_proc WHERE proname = 'handle_new_user';
