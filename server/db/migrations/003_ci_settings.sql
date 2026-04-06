-- =============================================================================
-- 003_ci_settings.sql — Corporate identity settings (single-row JSONB)
-- =============================================================================

CREATE TABLE ci_settings (
  id         INTEGER PRIMARY KEY DEFAULT 1,
  data       JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES users(id),
  CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO ci_settings (id, data) VALUES (1, '{}') ON CONFLICT (id) DO NOTHING;
