// =============================================================================
// server/src/db/migrate.ts — Run all SQL migrations in order
// =============================================================================

import fs from 'fs';
import path from 'path';
import { db } from '../lib/db';
import { logger } from '../lib/logger';

async function migrate(): Promise<void> {
  const migrationsDir = path.join(__dirname, '../../db/migrations');
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

  await db.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

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
      logger.error({ file, err }, 'Migration failed');
      throw err;
    }
  }

  await db.end();
  logger.info('All migrations complete');
}

migrate().catch(err => {
  console.error(err);
  process.exit(1);
});
