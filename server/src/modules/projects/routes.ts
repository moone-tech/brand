// =============================================================================
// server/src/modules/projects/routes.ts — Project management HTTP handlers
// =============================================================================

import { Router } from 'express';
import { authenticate, requireRole } from '../../middleware/auth';
import * as q from './queries';
import { createProjectSchema, createTaskSchema, updateTaskSchema, updateProjectSchema } from './validation';

const router = Router();

router.use(authenticate);

// Projects
router.get('/', async (_req, res, next) => {
  try {
    const projects = await q.listProjects();
    res.json({ data: projects });
  } catch (err) { next(err); }
});

router.post('/', requireRole('admin', 'editor'), async (req, res, next) => {
  try {
    const input = createProjectSchema.parse(req.body);
    const project = await q.createProject({
      name: input.name,
      description: input.description ?? null,
      color: input.color ?? '#3b82f6',
      createdById: req.user!.id,
    });
    res.status(201).json({ data: project });
  } catch (err) { next(err); }
});

router.patch('/:id', requireRole('admin', 'editor'), async (req, res, next) => {
  try {
    const input = updateProjectSchema.parse(req.body);
    await q.updateProject(req.params.id, input);
    res.json({ data: { message: 'Projekt aktualizován.' } });
  } catch (err) { next(err); }
});

router.delete('/:id', requireRole('admin'), async (req, res, next) => {
  try {
    await q.deleteProject(req.params.id);
    res.json({ data: { message: 'Projekt byl odstraněn.' } });
  } catch (err) { next(err); }
});

// Tasks
router.get('/:projectId/tasks', async (req, res, next) => {
  try {
    const tasks = await q.listTasksByProject(req.params.projectId);
    res.json({ data: tasks });
  } catch (err) { next(err); }
});

router.post('/:projectId/tasks', requireRole('admin', 'editor'), async (req, res, next) => {
  try {
    const input = createTaskSchema.parse({ ...req.body, projectId: req.params.projectId });
    const task = await q.createTask({
      projectId: input.projectId,
      title: input.title,
      description: input.description ?? null,
      status: input.status ?? 'todo',
      priority: input.priority ?? 'medium',
      assigneeId: input.assigneeId ?? null,
      dueDate: input.dueDate ?? null,
      tags: input.tags ?? [],
      createdById: req.user!.id,
    });
    res.status(201).json({ data: task });
  } catch (err) { next(err); }
});

router.patch('/tasks/:id', requireRole('admin', 'editor'), async (req, res, next) => {
  try {
    const input = updateTaskSchema.parse(req.body);
    await q.updateTask(req.params.id, input);
    res.json({ data: { message: 'Úkol aktualizován.' } });
  } catch (err) { next(err); }
});

router.delete('/tasks/:id', requireRole('admin', 'editor'), async (req, res, next) => {
  try {
    await q.deleteTask(req.params.id);
    res.json({ data: { message: 'Úkol byl odstraněn.' } });
  } catch (err) { next(err); }
});

export { router as projectsRouter };
