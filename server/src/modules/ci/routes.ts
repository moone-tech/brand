// =============================================================================
// server/src/modules/ci/routes.ts — Corporate identity API endpoints
// =============================================================================

import { Router } from 'express';
import { authenticate, requireRole } from '../../middleware/auth';
import { getCiSettings, upsertCiSettings } from './queries';

const router = Router();

router.get('/', authenticate, async (_req, res, next) => {
  try {
    const data = await getCiSettings();
    res.json({ data });
  } catch (err) { next(err); }
});

router.put('/', authenticate, requireRole('admin', 'editor'), async (req, res, next) => {
  try {
    const data = req.body as Record<string, unknown>;
    await upsertCiSettings(data, req.user!.id);
    res.json({ data });
  } catch (err) { next(err); }
});

export { router as ciRouter };
