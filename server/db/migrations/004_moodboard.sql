-- =============================================================================
-- 004_moodboard.sql — Mood board tables
-- =============================================================================

CREATE TABLE moodboard_boards (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  description  TEXT,
  cover_color  TEXT,
  created_by_id UUID NOT NULL REFERENCES users(id),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at   TIMESTAMPTZ
);

CREATE TRIGGER set_updated_at_moodboard_boards
  BEFORE UPDATE ON moodboard_boards
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TABLE moodboard_items (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id   UUID NOT NULL REFERENCES moodboard_boards(id) ON DELETE CASCADE,
  type       TEXT NOT NULL CHECK (type IN ('image', 'url', 'color', 'note')),
  title      TEXT,
  note       TEXT,
  value      TEXT NOT NULL,             -- file URL / external URL / hex / note text
  tags       TEXT[] NOT NULL DEFAULT '{}',
  position   INTEGER NOT NULL DEFAULT 0,
  added_by_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TRIGGER set_updated_at_moodboard_items
  BEFORE UPDATE ON moodboard_items
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
