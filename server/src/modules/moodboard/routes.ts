// =============================================================================
// server/src/modules/moodboard/routes.ts — Moodboard HTTP handlers
// =============================================================================

import { Router } from 'express';
import { authenticate, requireRole } from '../../middleware/auth';
import * as q from './queries';
import { createBoardSchema, createItemSchema, updateItemNoteSchema } from './validation';

const router = Router();

// All moodboard routes require authentication
router.use(authenticate);

// Boards
router.get('/boards', async (_req, res, next) => {
  try {
    const boards = await q.listBoards();
    res.json({ data: boards });
  } catch (err) { next(err); }
});

router.post('/boards', requireRole('admin', 'editor'), async (req, res, next) => {
  try {
    const input = createBoardSchema.parse(req.body);
    const board = await q.createBoard({
      name: input.name,
      description: input.description ?? null,
      coverColor: input.coverColor ?? null,
      createdById: req.user!.id,
    });
    res.status(201).json({ data: board });
  } catch (err) { next(err); }
});

router.delete('/boards/:id', requireRole('admin', 'editor'), async (req, res, next) => {
  try {
    await q.deleteBoard(req.params.id);
    res.json({ data: { message: 'Board byl odstraněn.' } });
  } catch (err) { next(err); }
});

// Items
router.get('/boards/:boardId/items', async (req, res, next) => {
  try {
    const items = await q.listItems(req.params.boardId);
    res.json({ data: items });
  } catch (err) { next(err); }
});

router.post('/items', requireRole('admin', 'editor'), async (req, res, next) => {
  try {
    const input = createItemSchema.parse(req.body);
    const item = await q.createItem({
      boardId: input.boardId,
      type: input.type,
      title: input.title ?? null,
      note: input.note ?? null,
      value: input.value,
      tags: input.tags ?? [],
      addedById: req.user!.id,
    });
    res.status(201).json({ data: item });
  } catch (err) { next(err); }
});

router.patch('/items/:id/note', requireRole('admin', 'editor'), async (req, res, next) => {
  try {
    const { note } = updateItemNoteSchema.parse(req.body);
    await q.updateItemNote(req.params.id, note);
    res.json({ data: { message: 'Poznámka aktualizována.' } });
  } catch (err) { next(err); }
});

router.delete('/items/:id', requireRole('admin', 'editor'), async (req, res, next) => {
  try {
    await q.deleteItem(req.params.id);
    res.json({ data: { message: 'Item byl odstraněn.' } });
  } catch (err) { next(err); }
});

export { router as moodboardRouter };
