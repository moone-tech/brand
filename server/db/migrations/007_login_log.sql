-- =============================================================================
-- 007_login_log.sql — Login / activity tracking for attendance module
-- =============================================================================

CREATE TABLE login_log (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  logged_in_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_login_log_user_time ON login_log (user_id, logged_in_at DESC);
CREATE INDEX idx_login_log_time      ON login_log (logged_in_at DESC);
