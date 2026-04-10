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

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

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

// 50 MB limit — documents are stored as base64 data URLs (adds ~33% overhead)
app.use(express.json({ limit: '50mb' }));

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', version: '1.0.0', service: 'moone-brand' });
});

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/ci', ciRouter);
app.use('/api/v1/moodboard', moodboardRouter);
app.use('/api/v1/projects', projectsRouter);

// ---------------------------------------------------------------------------
// Error handler (must be last)
// ---------------------------------------------------------------------------

app.use(errorHandler);

// ---------------------------------------------------------------------------
// Startup: migrations + schema fixes
// ---------------------------------------------------------------------------

async function startup() {
  // 1. Run file-based migrations (non-fatal)
  await runMigrations().catch(err =>
    logger.error({ err }, 'runMigrations failed — continuing'),
  );

  // 2. Guarantee the moodboard type constraint includes article + document.
  //    Runs every boot, is fully idempotent. Bypasses migration file tracking
  //    so it works even if migration 008 was recorded but never fully applied.
  try {
    await db.query(`
      DO $$
      DECLARE r RECORD;
      BEGIN
        -- Drop any existing type CHECK constraint that doesn't include 'article'
        FOR r IN
          SELECT conname FROM pg_constraint
          WHERE conrelid = 'moodboard_items'::regclass
            AND contype = 'c'
            AND pg_get_constraintdef(oid) LIKE '%image%'
            AND pg_get_constraintdef(oid) NOT LIKE '%article%'
        LOOP
          EXECUTE format('ALTER TABLE moodboard_items DROP CONSTRAINT %I', r.conname);
        END LOOP;

        -- Add updated constraint only if it doesn't already exist
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint
          WHERE conrelid = 'moodboard_items'::regclass
            AND contype = 'c'
            AND pg_get_constraintdef(oid) LIKE '%article%'
        ) THEN
          ALTER TABLE moodboard_items
            ADD CONSTRAINT moodboard_items_type_check
              CHECK (type IN ('image', 'url', 'color', 'note', 'article', 'document'));
        END IF;
      END$$;
    `);
    logger.info('moodboard_items type constraint verified');
  } catch (err) {
    logger.error({ err }, 'Type constraint fix failed — article/document saves may fail');
  }

  // 3. Start listening
  app.listen(config.server.port, () => {
    logger.info(
      { port: config.server.port, env: config.server.nodeEnv },
      'Mo.one Brand server started',
    );
  });
}

startup();
