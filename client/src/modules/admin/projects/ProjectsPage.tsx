// =============================================================================
// client/src/modules/admin/projects/ProjectsPage.tsx — Kanban project board
// =============================================================================

import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, AlertCircle, Settings, Check, X, ChevronDown, UserCircle } from 'lucide-react';
import { api } from '../../../lib/api';
import type { Project, Task, TaskStatus, ColumnConfig } from '@shared/types';
import type { UserProfile } from '@shared/types';
import { useAuth } from '../../../hooks/useAuth';
import { useTranslation } from '../../../lib/i18n';
import { TaskDetailPanel } from './TaskDetailPanel';

const DEFAULT_COLUMNS: ColumnConfig[] = [
  { status: 'todo', label: 'To Do' },
  { status: 'in_progress', label: 'In Progress' },
  { status: 'review', label: 'Review' },
  { status: 'done', label: 'Done' },
];

const COLUMN_COLORS: Record<TaskStatus, string> = {
  todo: 'var(--muted)',
  in_progress: 'var(--primary)',
  review: 'var(--warning)',
  done: 'var(--reward)',
};

const PRIORITY_COLORS: Record<Task['priority'], string> = {
  low: 'var(--muted)',
  medium: 'var(--warning)',
  high: 'var(--destructive)',
};

// ---------------------------------------------------------------------------
// Inline editable text
// ---------------------------------------------------------------------------

function InlineEdit({
  value,
  onSave,
  className,
  style,
}: {
  value: string;
  onSave: (v: string) => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  function commit() {
    if (draft.trim() && draft.trim() !== value) onSave(draft.trim());
    setEditing(false);
  }

  return editing ? (
    <input
      ref={inputRef}
      value={draft}
      onChange={e => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false); }}
      className={className}
      style={{ ...style, background: 'transparent', borderBottom: '1px solid var(--primary)', outline: 'none' }}
    />
  ) : (
    <span
      onClick={() => { setDraft(value); setEditing(true); }}
      className={className}
      style={{ ...style, cursor: 'text' }}
      title="Click to rename"
    >
      {value}
    </span>
  );
}

// ---------------------------------------------------------------------------
// User picker dropdown
// ---------------------------------------------------------------------------

function UserPicker({
  users,
  selectedId,
  onSelect,
  placeholder,
  multi = false,
  selectedIds,
  onToggle,
}: {
  users: UserProfile[];
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  placeholder: string;
  multi?: boolean;
  selectedIds?: string[];
  onToggle?: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const selectedUser = !multi ? users.find(u => u.id === selectedId) : undefined;
  const selectedCount = multi ? (selectedIds?.length ?? 0) : 0;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs border transition-colors hover:opacity-80"
        style={{ background: 'var(--elevated)', borderColor: 'var(--border)', color: 'var(--text)' }}
      >
        <UserCircle size={12} style={{ color: 'var(--muted)' }} />
        <span className="max-w-24 truncate">
          {multi
            ? (selectedCount > 0 ? `${selectedCount}` : placeholder)
            : (selectedUser ? selectedUser.name : placeholder)
          }
        </span>
        <ChevronDown size={10} style={{ color: 'var(--muted)' }} />
      </button>

      {open && (
        <div
          className="absolute z-50 top-full mt-1 min-w-44 rounded-xl border shadow-lg py-1 overflow-hidden"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          {!multi && (
            <button
              onClick={() => { onSelect?.(null); setOpen(false); }}
              className="flex items-center gap-2 w-full px-3 py-2 text-xs text-left hover:opacity-70 transition-opacity"
              style={{ color: 'var(--muted)' }}
            >
              <X size={11} /> {placeholder}
            </button>
          )}
          {users.map(u => {
            const isSelected = multi ? selectedIds?.includes(u.id) : selectedId === u.id;
            return (
              <button
                key={u.id}
                onClick={() => {
                  if (multi) { onToggle?.(u.id); }
                  else { onSelect?.(u.id); setOpen(false); }
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-xs text-left hover:opacity-70 transition-opacity"
                style={{ color: 'var(--text)' }}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: 'var(--primary)', color: 'var(--primary-fg)' }}
                >
                  {u.name[0]?.toUpperCase()}
                </div>
                <span className="flex-1 truncate">{u.name}</span>
                {isSelected && <Check size={11} style={{ color: 'var(--primary)' }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export function ProjectsPage() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const { t } = useTranslation();
  const canEdit = user?.role !== 'viewer';

  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [addingTaskIn, setAddingTaskIn] = useState<TaskStatus | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const { data: projectsData } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.get<{ data: Project[] }>('/projects').then(r => r.data.data),
  });

  const { data: usersData } = useQuery({
    queryKey: ['all-users'],
    queryFn: () => api.get<{ data: UserProfile[] }>('/auth/users').then(r => r.data.data),
    enabled: user?.role === 'admin' || user?.role === 'editor',
  });

  const projects = projectsData ?? [];
  const allUsers = usersData ?? [];
  const activeProjectId = selectedProject ?? projects[0]?.id ?? null;
  const activeProject = projects.find(p => p.id === activeProjectId) ?? null;

  const columns: ColumnConfig[] = activeProject?.columns ?? DEFAULT_COLUMNS;

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

  const updateProject = useMutation({
    mutationFn: (data: object) => api.patch(`/projects/${activeProjectId}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });

  const deleteProjectMut = useMutation({
    mutationFn: (id: string) => api.delete(`/projects/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] });
      setSelectedProject(null);
      setShowSettings(false);
    },
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

  const updateTask = useMutation({
    mutationFn: ({ id, ...data }: { id: string; assigneeId?: string | null }) =>
      api.patch(`/projects/tasks/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks', activeProjectId] }),
  });

  const deleteTask = useMutation({
    mutationFn: (id: string) => api.delete(`/projects/tasks/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks', activeProjectId] }),
  });

  function handleRenameColumn(status: TaskStatus, label: string) {
    const updated = columns.map(c => c.status === status ? { ...c, label } : c);
    updateProject.mutate({ columns: updated });
  }

  return (
    <div className="p-8 animate-fade-in h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>{t('projects_title')}</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>{t('projects_subtitle')}</p>
        </div>
        {canEdit && (
          <form
            onSubmit={e => { e.preventDefault(); if (newProjectName) createProject.mutate(newProjectName); }}
            className="flex items-center gap-2"
          >
            <input
              value={newProjectName}
              onChange={e => setNewProjectName(e.target.value)}
              placeholder={t('projects_new')}
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
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {projects.map(p => (
            <button
              key={p.id}
              onClick={() => { setSelectedProject(p.id); setShowSettings(false); }}
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

      {/* Project toolbar */}
      {activeProject && canEdit && (
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <InlineEdit
            value={activeProject.name}
            onSave={name => updateProject.mutate({ name })}
            className="text-sm font-semibold"
            style={{ color: 'var(--text)' }}
          />

          {allUsers.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs" style={{ color: 'var(--muted)' }}>{t('projects_owner')}:</span>
              <UserPicker
                users={allUsers}
                selectedId={activeProject.ownerId}
                onSelect={id => updateProject.mutate({ ownerId: id })}
                placeholder={t('projects_no_owner')}
              />
            </div>
          )}

          {allUsers.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs" style={{ color: 'var(--muted)' }}>{t('projects_team')}:</span>
              <UserPicker
                users={allUsers}
                multi
                selectedIds={activeProject.teamMemberIds ?? []}
                onToggle={id => {
                  const current = activeProject.teamMemberIds ?? [];
                  const updated = current.includes(id)
                    ? current.filter(x => x !== id)
                    : [...current, id];
                  updateProject.mutate({ teamMemberIds: updated });
                }}
                placeholder={t('projects_team')}
              />
            </div>
          )}

          <button
            onClick={() => setShowSettings(s => !s)}
            className="ml-auto p-2 rounded-lg transition-colors"
            style={{ background: showSettings ? 'var(--elevated)' : 'transparent', color: 'var(--muted)' }}
          >
            <Settings size={15} />
          </button>
        </div>
      )}

      {/* Settings panel */}
      {showSettings && activeProject && (
        <div
          className="mb-4 p-4 rounded-2xl border"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <p className="text-xs font-medium mb-3" style={{ color: 'var(--text)' }}>{t('projects_settings')}</p>
          <button
            onClick={() => {
              if (window.confirm(t('projects_delete_confirm'))) deleteProjectMut.mutate(activeProject.id);
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
            style={{ color: 'var(--destructive)', background: 'color-mix(in srgb, var(--destructive) 8%, transparent)' }}
          >
            <Trash2 size={14} /> {t('projects_delete')}
          </button>
        </div>
      )}

      {/* Kanban board */}
      {!activeProjectId ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle size={32} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--muted)' }} />
            <p style={{ color: 'var(--muted)' }}>{t('projects_empty')}</p>
          </div>
        </div>
      ) : (
        <div
          className="flex-1 grid gap-4 overflow-hidden"
          style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
        >
          {columns.map(col => {
            const colTasks = tasks.filter(task => task.status === col.status);
            return (
              <div key={col.status} className="flex flex-col gap-3 overflow-hidden">
                {/* Column header */}
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: COLUMN_COLORS[col.status] }} />
                  {canEdit ? (
                    <InlineEdit
                      value={col.label}
                      onSave={label => handleRenameColumn(col.status, label)}
                      className="label-caps"
                      style={{ color: 'var(--muted)' }}
                    />
                  ) : (
                    <span className="label-caps">{col.label}</span>
                  )}
                  <span
                    className="ml-auto text-xs rounded-full px-2 py-0.5"
                    style={{ background: 'var(--elevated)', color: 'var(--muted)' }}
                  >
                    {colTasks.length}
                  </span>
                </div>

                {/* Tasks */}
                <div className="flex-1 space-y-2 overflow-y-auto">
                  {colTasks.map(task => {
                    const assignee = allUsers.find(u => u.id === task.assigneeId);
                    return (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTask(task)}
                        className="p-3 rounded-xl border group cursor-pointer transition-colors hover:border-[var(--primary)]"
                        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium leading-snug" style={{ color: 'var(--text)' }}>
                            {task.title}
                          </p>
                          {canEdit && (
                            <button
                              onClick={e => { e.stopPropagation(); deleteTask.mutate(task.id); }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                            >
                              <Trash2 size={12} style={{ color: 'var(--destructive)' }} />
                            </button>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-2 gap-1.5 flex-wrap">
                          <span className="text-xs" style={{ color: PRIORITY_COLORS[task.priority] }}>
                            {t(`task_priority_${task.priority}` as 'task_priority_low')}
                          </span>

                          {canEdit && allUsers.length > 0 ? (
                            <div onClick={e => e.stopPropagation()}>
                              <UserPicker
                                users={allUsers}
                                selectedId={task.assigneeId}
                                onSelect={id => updateTask.mutate({ id: task.id, assigneeId: id })}
                                placeholder={t('projects_no_assignee')}
                              />
                            </div>
                          ) : assignee ? (
                            <span className="text-xs" style={{ color: 'var(--muted)' }}>{assignee.name}</span>
                          ) : null}
                        </div>

                        {canEdit && col.status !== 'done' && (
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              const statuses = columns.map(c => c.status);
                              const idx = statuses.indexOf(task.status);
                              if (idx < statuses.length - 1) moveTask.mutate({ id: task.id, status: statuses[idx + 1] });
                            }}
                            className="mt-1 text-xs hover:underline"
                            style={{ color: 'var(--primary)' }}
                          >
                            →
                          </button>
                        )}
                      </div>
                    );
                  })}

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
                          placeholder={t('projects_task_title_placeholder')}
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
                            {t('projects_add_btn')}
                          </button>
                          <button
                            type="button"
                            onClick={() => setAddingTaskIn(null)}
                            className="px-3 py-1.5 rounded-lg text-xs"
                            style={{ color: 'var(--muted)' }}
                          >
                            {t('projects_cancel')}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <button
                        onClick={() => { setAddingTaskIn(col.status); setNewTaskTitle(''); }}
                        className="flex items-center gap-1.5 text-xs w-full px-2 py-1.5 rounded-lg transition-colors hover:opacity-80"
                        style={{ color: 'var(--muted)' }}
                      >
                        <Plus size={13} /> {t('projects_add_task')}
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task detail slide-in panel */}
      {selectedTask && activeProjectId && (
        <TaskDetailPanel
          task={selectedTask}
          projectId={activeProjectId}
          columns={columns}
          users={allUsers}
          canEdit={canEdit}
          onClose={() => {
            setSelectedTask(null);
            qc.invalidateQueries({ queryKey: ['tasks', activeProjectId] });
          }}
        />
      )}
    </div>
  );
}
