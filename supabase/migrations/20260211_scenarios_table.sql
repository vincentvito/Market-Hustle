-- ============================================
-- SCENARIOS TABLE
-- Admin-authored game scenarios for scripted gameplay
-- ============================================

CREATE TABLE IF NOT EXISTS scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  duration SMALLINT NOT NULL CHECK (duration IN (30, 45, 60)),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  days TEXT NOT NULL DEFAULT '[]',
  initial_prices TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_scenarios_status ON scenarios(status);

-- Enable RLS
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;

-- Admin-only access (via API routes with admin check, but RLS as defense-in-depth)
CREATE POLICY "Admins can manage scenarios" ON scenarios
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Public read for published scenarios (game clients load these)
CREATE POLICY "Anyone can read published scenarios" ON scenarios
  FOR SELECT USING (status = 'published');
