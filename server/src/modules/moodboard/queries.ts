// =============================================================================
// server/src/modules/moodboard/queries.ts — Moodboard SQL queries
// =============================================================================

import { db } from '../../lib/db';
import type { UUID, MoodboardItemType } from '@shared/types';

// ---------------------------------------------------------------------------
// Boards
// ---------------------------------------------------------------------------

export async function listBoards() {
  const { rows } = await db.query(
    `SELECT b.*, u.name AS created_by_name
     FROM moodboard_boards b
     JOIN users u ON u.id = b.created_by_id
     WHERE b.deleted_at IS NULL
     ORDER BY b.created_at DESC`,
  );
  return rows;
}

export async function findBoardById(id: UUID) {
  const { rows } = await db.query(
    `SELECT b.*, u.name AS created_by_name
     FROM moodboard_boards b
     JOIN users u ON u.id = b.created_by_id
     WHERE b.id = $1 AND b.deleted_at IS NULL`,
    [id],
  );
  return rows[0] ?? null;
}

export async function createBoard(data: {
  name: string;
  description: string | null;
  coverColor: string | null;
  createdById: UUID;
}) {
  const { rows } = await db.query(
    `INSERT INTO moodboard_boards (name, description, cover_color, created_by_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [data.name, data.description, data.coverColor, data.createdById],
  );
  return rows[0];
}

export async function deleteBoard(id: UUID) {
  await db.query(
    'UPDATE moodboard_boards SET deleted_at = NOW() WHERE id = $1',
    [id],
  );
}

// ---------------------------------------------------------------------------
// Items
// ---------------------------------------------------------------------------

export async function listItems(boardId: UUID) {
  // Return lightweight list — strip value for document/article types (can be
  // megabytes of base64). Client fetches full value via getItemValue() on demand.
  const { rows } = await db.query(
    `SELECT
       i.id, i.board_id, i.type, i.title, i.note, i.tags, i.position,
       i.added_by_id, i.created_at, i.updated_at,
       CASE
         WHEN i.type IN ('document', 'article') THEN ''
         ELSE i.value
       END AS value,
       u.name AS added_by_name
     FROM moodboard_items i
     JOIN users u ON u.id = i.added_by_id
     WHERE i.board_id = $1 AND i.deleted_at IS NULL
     ORDER BY i.position ASC, i.created_at ASC`,
    [boardId],
  );
  return rows;
}

export async function getItemValue(id: UUID) {
  const { rows } = await db.query(
    'SELECT id, value FROM moodboard_items WHERE id = $1 AND deleted_at IS NULL',
    [id],
  );
  return rows[0] ?? null;
}

export async function createItem(data: {
  boardId: UUID;
  type: MoodboardItemType;
  title: string | null;
  note: string | null;
  value: string;
  tags: string[];
  addedById: UUID;
}) {
  const { rows } = await db.query(
    `INSERT INTO moodboard_items (board_id, type, title, note, value, tags, added_by_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [data.boardId, data.type, data.title, data.note, data.value, data.tags, data.addedById],
  );
  return rows[0];
}

export async function deleteItem(id: UUID) {
  await db.query(
    'UPDATE moodboard_items SET deleted_at = NOW() WHERE id = $1',
    [id],
  );
}

export async function updateItemNote(id: UUID, note: string) {
  await db.query(
    'UPDATE moodboard_items SET note = $1 WHERE id = $2 AND deleted_at IS NULL',
    [note, id],
  );
}
