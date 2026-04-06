// =============================================================================
// server/src/lib/db.ts — PostgreSQL connection pool
// =============================================================================

import { Pool } from 'pg';
import { config } from '../config';

export const db = new Pool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.name,
  user: config.db.user,
  password: config.db.password,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 2_000,
});
