-- Existing installations only. Fresh installations include this table in schema.sql.
-- Select the database created by your hosting provider before running this file.
CREATE TABLE IF NOT EXISTS ai_rate_limits (
  client_hash CHAR(64) NOT NULL PRIMARY KEY,
  window_started_at DATETIME NOT NULL,
  request_count SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  updated_at DATETIME NOT NULL,
  INDEX idx_ai_rate_limits_updated (updated_at)
);
