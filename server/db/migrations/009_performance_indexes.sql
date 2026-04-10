-- =============================================================================
-- 009_performance_indexes.sql — Add missing indexes on hot query paths
-- Every table had zero indexes beyond the PK — full table scans on every read.
-- =============================================================================

-- users
CREATE INDEX IF NOT EXISTS idx_users_email
  ON users(email);

-- moodboard_boards  (listed in created_at DESC, filtered by deleted_at IS NULL)
CREATE INDEX IF NOT EXISTS idx_moodboard_boards_active
  ON moodboard_boards(created_at DESC)
  WHERE deleted_at IS NULL;

-- moodboard_items  (filtered by board_id + deleted_at, ordered by position)
CREATE INDEX IF NOT EXISTS idx_moodboard_items_board_active
  ON moodboard_items(board_id, position ASC, created_at ASC)
  WHERE deleted_at IS NULL;

-- projects  (filtered by deleted_at IS NULL, ordered by created_at DESC)
CREATE INDEX IF NOT EXISTS idx_projects_active
  ON projects(created_at DESC)
  WHERE deleted_at IS NULL;

-- tasks  (filtered by project_id + deleted_at, ordered by position)
CREATE INDEX IF NOT EXISTS idx_tasks_project_active
  ON tasks(project_id, position ASC, created_at ASC)
  WHERE deleted_at IS NULL;

-- tasks  (assignee lookups)
CREATE INDEX IF NOT EXISTS idx_tasks_assignee
  ON tasks(assignee_id)
  WHERE deleted_at IS NULL AND assignee_id IS NOT NULL;
