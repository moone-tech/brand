// =============================================================================
// server/src/modules/projects/queries.ts — Projects & tasks SQL queries
// =============================================================================

import { db } from '../../lib/db';
import type { UUID, TaskStatus, TaskPriority, UserRole } from '@shared/types';

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export async function listProjects() {
  const { rows } = await db.query(
    `SELECT
       p.id,
       p.name,
       p.description,
       p.color,
       p.columns,
       p.created_by_id  AS "createdById",
       p.owner_id       AS "ownerId",
       p.team_member_ids AS "teamMemberIds",
       p.created_at     AS "createdAt",
       p.updated_at     AS "updatedAt",
       u.name           AS "createdByName",
       o.name           AS "ownerName",
       COUNT(t.id) FILTER (WHERE t.deleted_at IS NULL) AS "taskCount"
     FROM projects p
     JOIN users u ON u.id = p.created_by_id
     LEFT JOIN users o ON o.id = p.owner_id
     LEFT JOIN tasks t ON t.project_id = p.id
     WHERE p.deleted_at IS NULL
     GROUP BY p.id, u.name, o.name
     ORDER BY p.created_at DESC`,
  );
  return rows;
}

export async function createProject(data: {
  name: string;
  description: string | null;
  color: string;
  createdById: UUID;
}) {
  const { rows } = await db.query(
    `INSERT INTO projects (name, description, color, created_by_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [data.name, data.description, data.color, data.createdById],
  );
  return rows[0];
}

export async function deleteProject(id: UUID) {
  await db.query('UPDATE projects SET deleted_at = NOW() WHERE id = $1', [id]);
}

export async function updateProject(id: UUID, data: {
  name?: string;
  description?: string | null;
  color?: string;
  ownerId?: UUID | null;
  teamMemberIds?: UUID[];
  columns?: { status: string; label: string }[];
}) {
  const sets: string[] = [];
  const vals: unknown[] = [];
  let i = 1;

  if (data.name !== undefined) { sets.push(`name = $${i++}`); vals.push(data.name); }
  if (data.description !== undefined) { sets.push(`description = $${i++}`); vals.push(data.description); }
  if (data.color !== undefined) { sets.push(`color = $${i++}`); vals.push(data.color); }
  if (data.ownerId !== undefined) { sets.push(`owner_id = $${i++}`); vals.push(data.ownerId); }
  if (data.teamMemberIds !== undefined) { sets.push(`team_member_ids = $${i++}`); vals.push(data.teamMemberIds); }
  if (data.columns !== undefined) { sets.push(`columns = $${i++}`); vals.push(JSON.stringify(data.columns)); }

  if (sets.length === 0) return;
  vals.push(id);

  await db.query(
    `UPDATE projects SET ${sets.join(', ')} WHERE id = $${i} AND deleted_at IS NULL`,
    vals,
  );
}

// ---------------------------------------------------------------------------
// Tasks
// ---------------------------------------------------------------------------

export async function listTasksByProject(projectId: UUID) {
  const { rows } = await db.query(
    `SELECT
       t.id,
       t.title,
       t.description,
       t.status,
       t.priority,
       t.position,
       t.tags,
       t.project_id   AS "projectId",
       t.assignee_id  AS "assigneeId",
       t.due_date     AS "dueDate",
       t.created_by_id AS "createdById",
       t.created_at   AS "createdAt",
       t.updated_at   AS "updatedAt",
       u.name         AS "createdByName",
       a.name         AS "assigneeName"
     FROM tasks t
     JOIN users u ON u.id = t.created_by_id
     LEFT JOIN users a ON a.id = t.assignee_id
     WHERE t.project_id = $1 AND t.deleted_at IS NULL
     ORDER BY t.position ASC, t.created_at ASC`,
    [projectId],
  );
  return rows;
}

export async function createTask(data: {
  projectId: UUID;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: UUID | null;
  dueDate: string | null;
  tags: string[];
  createdById: UUID;
}) {
  const { rows } = await db.query(
    `INSERT INTO tasks (project_id, title, description, status, priority, assignee_id, due_date, tags, created_by_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [data.projectId, data.title, data.description, data.status, data.priority,
     data.assigneeId, data.dueDate, data.tags, data.createdById],
  );
  return rows[0];
}

export async function updateTask(id: UUID, data: {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: UUID | null;
  dueDate?: string | null;
  position?: number;
  tags?: string[];
}) {
  const sets: string[] = [];
  const vals: unknown[] = [];
  let i = 1;

  if (data.title !== undefined) { sets.push(`title = $${i++}`); vals.push(data.title); }
  if (data.description !== undefined) { sets.push(`description = $${i++}`); vals.push(data.description); }
  if (data.status !== undefined) { sets.push(`status = $${i++}`); vals.push(data.status); }
  if (data.priority !== undefined) { sets.push(`priority = $${i++}`); vals.push(data.priority); }
  if (data.assigneeId !== undefined) { sets.push(`assignee_id = $${i++}`); vals.push(data.assigneeId); }
  if (data.dueDate !== undefined) { sets.push(`due_date = $${i++}`); vals.push(data.dueDate); }
  if (data.position !== undefined) { sets.push(`position = $${i++}`); vals.push(data.position); }
  if (data.tags !== undefined) { sets.push(`tags = $${i++}`); vals.push(data.tags); }

  if (sets.length === 0) return;
  vals.push(id);

  await db.query(
    `UPDATE tasks SET ${sets.join(', ')} WHERE id = $${i} AND deleted_at IS NULL`,
    vals,
  );
}

export async function deleteTask(id: UUID) {
  await db.query('UPDATE tasks SET deleted_at = NOW() WHERE id = $1', [id]);
}
