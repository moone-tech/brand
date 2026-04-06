// =============================================================================
// server/src/index.ts — Express application entry point
// =============================================================================

import express from 'express';
import cors from 'cors';
import { config } from './config';
import { logger } from './lib/logger';
import { errorHandler } from './middleware/errorHandler';
import { authRouter } from './modules/auth/routes';
import { ciRouter } from './modules/ci/routes';
import { moodboardRouter } from './modules/moodboard/routes';
import { projectsRouter } from './modules/projects/routes';

const app = express();

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

app.use(cors({
  origin: (origin, cb) => {
    const allowed = [
      config.server.clientUrl,
      /\.vercel\.app$/,
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

app.use(express.json({ limit: '10mb' }));

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
// Start
// ---------------------------------------------------------------------------

app.listen(config.server.port, () => {
  logger.info(
    { port: config.server.port, env: config.server.nodeEnv },
    'Mo.one Brand server started',
  );
});
