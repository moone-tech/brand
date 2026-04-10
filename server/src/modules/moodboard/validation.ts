// =============================================================================
// server/src/modules/moodboard/validation.ts — Zod schemas
// =============================================================================

import { z } from 'zod';

export const createBoardSchema = z.object({
  name: z.string().min(1, 'Název je povinný').max(120),
  description: z.string().max(500).optional(),
  coverColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
});

export const createItemSchema = z.object({
  boardId: z.string().uuid(),
  type: z.enum(['image', 'url', 'color', 'note', 'article', 'document']),
  title: z.string().max(200).optional(),
  note: z.string().max(10000).optional(),
  value: z.string().min(1, 'Hodnota je povinná'),
  tags: z.array(z.string()).max(10).optional(),
});

export const updateItemNoteSchema = z.object({
  note: z.string().max(10000),
});
