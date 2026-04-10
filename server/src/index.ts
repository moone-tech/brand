// =============================================================================
// server/src/index.ts — Express application entry point
// =============================================================================

import express from 'express';
import cors from 'cors';
import { config } from './config';
import { logger } from './lib/logger';
import { db } from './lib/db';
import { errorHandler } from './middleware/errorHandler';
import { authRouter } from './modules/auth/routes';
import { ciRouter } from './modules/ci/routes';
import { moodboardRouter } from './modules/moodboard/routes';
import { projectsRouter } from './modules/projects/routes';
import { runMigrations } from './db/runMigrations';

const app = express();

app.use(cors({
  origin: (origin, cb) => {
    const allowed = [
      config.server.clientUrl,
      /\.vercel\.app$/,
      /\.mo\.one$/,
      /localhost/,
    ];
    if (!origin || allowed.some(p => typeof p === 'string' ? p === origin : p.test(origin))) {
      cb(null, true);
    } else {
      cb(new Error('CORS not allowed'));
    }
  },
  credentials: true,
}));

// 50 MB — base64 documents add ~33% overhead over raw file size
app.use(express.json({ limit: '50mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', version: '1.0.0', service: 'moone-brand' });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/ci', ciRouter);
app.use('/api/v1/moodboard', moodboardRouter);
app.use('/api/v1/projects', projectsRouter);

app.use(errorHandler);

// ---------------------------------------------------------------------------
// Bind port FIRST — Railway healthcheck must pass before any async work.
// Migrations and schema fixes run in the background after the server is up.
// ---------------------------------------------------------------------------

app.listen(config.server.port, () => {
  logger.info({ port: config.server.port, env: config.server.nodeEnv }, 'Server started');
});

// ---------------------------------------------------------------------------
// Background: fix moodboard type constraint + run file migrations
// ---------------------------------------------------------------------------

(async () => {
  // Fix the moodboard_items CHECK constraint so 'article' and 'document' are
  // allowed. Runs every boot, fully idempotent — safe to re-run.
  try {
    // Drop old constraint (scans pg_constraint by definition text, not name)
    await db.query(`
      DO $$
      DECLARE r RECORD;
      BEGIN
        FOR r IN
          SELECT conname FROM pg_constraint
          WHERE conrelid = 'moodboard_items'::regclass
            AND contype = 'c'
            AND pg_get_constraintdef(oid) LIKE '%image%'
            AND pg_get_constraintdef(oid) NOT LIKE '%article%'
        LOOP
          EXECUTE format('ALTER TABLE moodboard_items DROP CONSTRAINT %I', r.conname);
        END LOOP;
      END$$;
    `);

    // Add new constraint — ignore "already exists" so re-runs are safe
    await db.query(`
      ALTER TABLE moodboard_items
        ADD CONSTRAINT moodboard_items_type_check
          CHECK (type IN ('image', 'url', 'color', 'note', 'article', 'document'))
    `).catch((err: Error) => {
      if (err.message?.includes('already exists')) return;
      throw err;
    });

    logger.info('moodboard_items type constraint OK');
  } catch (err) {
    logger.error({ err }, 'Type constraint fix failed');
  }

  // Run file-based migrations (non-fatal)
  await runMigrations().catch(err =>
    logger.error({ err }, 'runMigrations failed'),
  );
})();
