-- =============================================================================
-- 006_projects_owner_team_columns.sql — Add owner, team, custom columns to projects
-- =============================================================================

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS team_member_ids UUID[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS columns JSONB;
