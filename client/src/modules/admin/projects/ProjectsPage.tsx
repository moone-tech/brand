// =============================================================================
// client/src/modules/admin/projects/ProjectsPage.tsx — Kanban project board
// =============================================================================

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { api } from '../../../lib/api';
import type { Project, Task, TaskStatus } from '@shared/types';
import { useAuth } from '../../../hooks/useAuth';

const COLUMNS: { status: TaskStatus; label: string; color: string }[] = [
  { status: 'todo', label: 'To Do', color: 'var(--muted)' },
  { status: 'in_progress', label: 'In Progress', color: 'var(--primary)' },
  { status: 'review', label: 'Review', color: 'var(--warning)' },
  { status: 'done', label: 'Done', color: 'var(--reward)' },
];

const PRIORITY_COLORS: Record<Task['priority'], string> = {
  low: 'var(--muted)',
  medium: 'var(--warning)',
  high: 'var(--destructive)',
};

export function ProjectsPage() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const canEdit = user?.role !== 'viewer';

  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [addingTaskIn, setAddingTaskIn] = useState<TaskStatus | null>(null);

  const { data: projectsData } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.get<{ data: Project[] }>('/projects').then(r => r.data.data),
  });

  const projects = projectsData ?? [];
  const activeProjectId = selectedProject ?? projects[0]?.id ?? null;

  const { data: tasksData } = useQuery({
    queryKey: ['tasks', activeProjectId],
    queryFn: () => api.get<{ data: Task[] }>(`/projects/${activeProjectId}/tasks`).then(r => r.data.data),
    enabled: !!activeProjectId,
  });

  const tasks = tasksData ?? [];

  const createProject = useMutation({
    mutationFn: (name: string) => api.post('/projects', { name }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['projects'] }); setNewProjectName(''); },
  });

  const createTask = useMutation({
    mutationFn: ({ status }: { status: TaskStatus }) =>
      api.post(`/projects/${activeProjectId}/tasks`, { title: newTaskTitle, status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks', activeProjectId] });
      setNewTaskTitle('');
      setAddingTaskIn(null);
    },
  });

  const moveTask = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      api.patch(`/projects/tasks/${id}`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks', activeProjectId] }),
  });

  const deleteTask = useMutation({
    mutationFn: (id: string) => api.delete(`/projects/tasks/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks', activeProjectId] }),
  });

  return (
    <div className="p-8 animate-fade-in h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>Projekty</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>Kanban board pro CI úkoly</p>
        </div>
        {canEdit && (
          <form
            onSubmit={e => { e.preventDefault(); if (newProjectName) createProject.mutate(newProjectName); }}
            className="flex items-center gap-2"
          >
            <input
              value={newProjectName}
              onChange={e => setNewProjectName(e.target.value)}
              placeholder="Nový projekt…"
              className="px-3 py-2 rounded-xl text-sm border focus:outline-none w-44"
              style={{ background: 'var(--elevated)', borderColor: 'var(--border)', color: 'var(--text)' }}
            />
            <button
              type="submit"
              disabled={!newProjectName}
              className="p-2 rounded-xl disabled:opacity-40"
              style={{ background: 'var(--primary)', color: 'var(--primary-fg)' }}
            >
              <Plus size={16} />
            </button>
          </form>
        )}
      </div>

      {/* Project tabs */}
      {projects.length > 0 && (
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {projects.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedProject(p.id)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
              style={{
                background: activeProjectId === p.id ? 'var(--primary)' : 'var(--surface)',
                color: activeProjectId === p.id ? 'var(--primary-fg)' : 'var(--muted)',
                border: `1px solid ${activeProjectId === p.id ? 'transparent' : 'var(--border)'}`,
              }}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}

      {/* Kanban board */}
      {!activeProjectId ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle size={32} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--muted)' }} />
            <p style={{ color: 'var(--muted)' }}>Vytvoř první projekt výše.</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-4 gap-4 overflow-hidden">
          {COLUMNS.map(col => {
            const colTasks = tasks.filter(t => t.status === col.status);
            return (
              <div key={col.status} className="flex flex-col gap-3 overflow-hidden">
                {/* Column header */}
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                  <span className="label-caps">{col.label}</span>
                  <span
                    className="ml-auto text-xs rounded-full px-2 py-0.5"
                    style={{ background: 'var(--elevated)', color: 'var(--muted)' }}
                  >
                    {colTasks.length}
                  </span>
                </div>

                {/* Tasks */}
                <div className="flex-1 space-y-2 overflow-y-auto">
                  {colTasks.map(task => (
                    <div
                      key={task.id}
                      className="p-3 rounded-xl border group"
                      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium leading-snug" style={{ color: 'var(--text)' }}>
                          {task.title}
                        </p>
                        {canEdit && (
                          <button
                            onClick={() => deleteTask.mutate(task.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                          >
                            <Trash2 size={12} style={{ color: 'var(--destructive)' }} />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs" style={{ color: PRIORITY_COLORS[task.priority] }}>
                          {task.priority}
                        </span>
                        {canEdit && col.status !== 'done' && (
                          <button
                            onClick={() => {
                              const next: TaskStatus[] = ['todo', 'in_progress', 'review', 'done'];
                              const idx = next.indexOf(task.status);
                              if (idx < next.length - 1) moveTask.mutate({ id: task.id, status: next[idx + 1] });
                            }}
                            className="text-xs hover:underline"
                            style={{ color: 'var(--primary)' }}
                          >
                            →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Add task */}
                  {canEdit && (
                    addingTaskIn === col.status ? (
                      <form
                        onSubmit={e => {
                          e.preventDefault();
                          if (newTaskTitle) createTask.mutate({ status: col.status });
                        }}
                        className="space-y-2"
                      >
                        <input
                          autoFocus
                          value={newTaskTitle}
                          onChange={e => setNewTaskTitle(e.target.value)}
                          placeholder="Název úkolu…"
                          className="w-full px-3 py-2 rounded-xl text-sm border focus:outline-none"
                          style={{ background: 'var(--elevated)', borderColor: 'var(--border)', color: 'var(--text)' }}
                        />
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            disabled={!newTaskTitle}
                            className="flex-1 py-1.5 rounded-lg text-xs font-medium disabled:opacity-40"
                            style={{ background: 'var(--primary)', color: 'var(--primary-fg)' }}
                          >
                            Přidat
                          </button>
                          <button
                            type="button"
                            onClick={() => setAddingTaskIn(null)}
                            className="px-3 py-1.5 rounded-lg text-xs"
                            style={{ color: 'var(--muted)' }}
                          >
                            Zrušit
                          </button>
                        </div>
                      </form>
                    ) : (
                      <button
                        onClick={() => { setAddingTaskIn(col.status); setNewTaskTitle(''); }}
                        className="flex items-center gap-1.5 text-xs w-full px-2 py-1.5 rounded-lg transition-colors hover:opacity-80"
                        style={{ color: 'var(--muted)' }}
                      >
                        <Plus size={13} /> Přidat úkol
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
