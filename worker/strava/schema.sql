CREATE TABLE IF NOT EXISTS installations (
  id TEXT PRIMARY KEY,
  public_key_jwk TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  revoked_at INTEGER
);

CREATE TABLE IF NOT EXISTS request_nonces (
  installation_id TEXT NOT NULL,
  nonce TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  PRIMARY KEY (installation_id, nonce)
);

CREATE TABLE IF NOT EXISTS oauth_states (
  state_hash TEXT PRIMARY KEY,
  installation_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  used_at INTEGER
);

CREATE TABLE IF NOT EXISTS strava_connections (
  installation_id TEXT PRIMARY KEY,
  athlete_id TEXT,
  athlete_name TEXT,
  access_token_cipher TEXT,
  refresh_token_cipher TEXT,
  access_token_expires_at INTEGER,
  scopes TEXT,
  connected_at INTEGER,
  disconnected_at INTEGER,
  requires_reauth INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS strava_uploads (
  installation_id TEXT NOT NULL,
  external_id TEXT NOT NULL,
  upload_id TEXT,
  activity_id TEXT,
  state TEXT NOT NULL,
  last_attempt_at INTEGER,
  last_polled_at INTEGER,
  last_error TEXT,
  uploaded_at INTEGER,
  PRIMARY KEY (installation_id, external_id)
);

CREATE INDEX IF NOT EXISTS idx_request_nonces_expiry ON request_nonces(expires_at);
CREATE INDEX IF NOT EXISTS idx_oauth_states_expiry ON oauth_states(expires_at);
