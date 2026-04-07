// =============================================================================
// server/src/lib/db.ts — PostgreSQL connection pool
// =============================================================================

import { Pool, type PoolClient } from 'pg';
import { config } from '../config';

// Railway Postgres (and most cloud providers) require SSL on external connections.
// Use rejectUnauthorized:false so self-signed Railway certs are accepted.
const sslConfig = process.env['DATABASE_URL']
  ? { rejectUnauthorized: false }
  : false;

export const db = new Pool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.name,
  user: config.db.user,
  password: config.db.password,
  ssl: sslConfig,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

// ---------------------------------------------------------------------------
// Transaction helper
// ---------------------------------------------------------------------------

export async function withTransaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
