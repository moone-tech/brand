// =============================================================================
// server/src/db/runMigrations.ts — Inline migration runner for server startup
// Called once before app.listen(). Does NOT close the DB pool.
// =============================================================================

import fs from 'fs';
import path from 'path';
import { db } from '../lib/db';
import { logger } from '../lib/logger';

export async function runMigrations(): Promise<void> {
  // Locate migrations directory — works in both tsx (dev) and compiled (prod)
  const candidates = [
    path.join(__dirname, '../../db/migrations'),        // tsx: src/db → server/db/migrations
    path.join(process.cwd(), 'server/db/migrations'),   // compiled, cwd = repo root
    path.join(process.cwd(), 'db/migrations'),           // compiled, cwd = server dir
  ];
  const migrationsDir = candidates.find(d => fs.existsSync(d));

  if (!migrationsDir) {
    logger.warn({ candidates }, 'Migrations directory not found — skipping');
    return;
  }

  await db.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename   TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

  for (const file of files) {
    const { rows } = await db.query(
      'SELECT filename FROM schema_migrations WHERE filename = $1',
      [file],
    );
    if (rows.length > 0) {
      logger.debug({ file }, 'Migration already applied, skipping');
      continue;
    }

    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
    await db.query('BEGIN');
    try {
      await db.query(sql);
      await db.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [file]);
      await db.query('COMMIT');
      logger.info({ file }, 'Migration applied');
    } catch (err) {
      await db.query('ROLLBACK');
      logger.error({ file, err }, 'Migration failed — server will exit');
      throw err;
    }
  }

  logger.info('All migrations up to date');
}
