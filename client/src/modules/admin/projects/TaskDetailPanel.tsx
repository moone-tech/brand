// =============================================================================
// client/src/modules/admin/projects/TaskDetailPanel.tsx
// Full-detail slide-in panel for a task — Jira/ClickUp inspired, Mo.one minimal
// =============================================================================

import { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  X, Trash2, Calendar, Tag, User, AlignLeft, ChevronRight,
  Flag, Circle, CheckCircle2, Eye, Clock,
} from 'lucide-react';
import { api } from '../../../lib/api';
import { useTranslation } from '../../../lib/i18n';
import type { Task, TaskStatus, TaskPriority, ColumnConfig } from '@shared/types';
import type { UserProfile } from '@shared/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Props {
  task: Task;
  projectId: string;
  columns: ColumnConfig[];
  users: UserProfile[];
  canEdit: boolean;
  onClose: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const PRIORITY_ICONS: Record<TaskPriority, typeof Flag> = {
  low: Flag,
  medium: Flag,
  high: Flag,
};

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: 'var(--muted)',
  medium: 'var(--warning)',
  high: 'var(--destructive)',
};

const STATUS_ICONS: Record<TaskStatus, typeof Circle> = {
  todo: Circle,
  in_progress: Clock,
  review: Eye,
  done: CheckCircle2,
};

const STATUS_COLORS: Record<TaskStatus, string> = {
  todo: 'var(--muted)',
  in_progress: 'var(--primary)',
  review: 'var(--warning)',
  done: 'var(--reward)',
};

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// ---------------------------------------------------------------------------
// TagInput
// ---------------------------------------------------------------------------

function TagInput({ tags, onChange }: { tags: string[]; onChange: (tags: string[]) => void }) {
  const { t } = useTranslation();
  const [input, setInput] = useState('');

  function addTag() {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) onChange([...tags, trimmed]);
    setInput('');
  }

  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      {tags.map(tag => (
        <span
          key={tag}
          className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
          style={{ background: 'var(--elevated)', color: 'var(--text)' }}
        >
          {tag}
          <button
            onClick={() => onChange(tags.filter(t => t !== tag))}
            className="opacity-50 hover:opacity-100 transition-opacity"
          >
            <X size={10} />
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); } }}
        onBlur={addTag}
        placeholder={tags.length === 0 ? t('task_tags_placeholder') : ''}
        className="text-xs border-none bg-transparent focus:outline-none"
        style={{ color: 'var(--text)', width: '90px' }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main panel
// ---------------------------------------------------------------------------

export function TaskDetailPanel({ task, projectId, columns, users, canEdit, onClose }: Props) {
  const { t } = useTranslation();
  const qc = useQueryClient();

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? '');
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [assigneeId, setAssigneeId] = useState<string | null>(task.assigneeId);
  const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.slice(0, 10) : '');
  const [tags, setTags] = useState<string[]>(task.tags ?? []);
  const [dirty, setDirty] = useState(false);

  const titleRef = useRef<HTMLInputElement>(null);

  // Reset local state when task changes
  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description ?? '');
    setStatus(task.status);
    setPriority(task.priority);
    setAssigneeId(task.assigneeId);
    setDueDate(task.dueDate ? task.dueDate.slice(0, 10) : '');
    setTags(task.tags ?? []);
    setDirty(false);
  }, [task.id]);

  // Mark dirty whenever any field changes (after initial mount)
  useEffect(() => { setDirty(true); }, [title, description, status, priority, assigneeId, dueDate, tags]);
  useEffect(() => { setDirty(false); }, [task.id]); // reset after task load

  // Close on Escape
  useEffect(() => {
    function handler(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const updateTask = useMutation({
    mutationFn: (data: object) => api.patch(`/projects/tasks/${task.id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks', projectId] });
      setDirty(false);
    },
  });

  const deleteTask = useMutation({
    mutationFn: () => api.delete(`/projects/tasks/${task.id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks', projectId] });
      onClose();
    },
  });

  function handleSave() {
    updateTask.mutate({
      title: title.trim() || task.title,
      description: description || null,
      status,
      priority,
      assigneeId,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      tags,
    });
  }

  const assignee = users.find(u => u.id === assigneeId);
  const StatusIcon = STATUS_ICONS[status];
  const PriorityIcon = PRIORITY_ICONS[priority];

  const PRIORITY_LABELS: Record<TaskPriority, string> = {
    low: t('task_priority_low'),
    medium: t('task_priority_medium'),
    high: t('task_priority_high'),
  };

  const STATUS_LABELS: Record<TaskStatus, string> = {
    todo: t('task_status_todo'),
    in_progress: t('task_status_in_progress'),
    review: t('task_status_review'),
    done: t('task_status_done'),
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.4)' }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed right-0 top-0 h-full z-50 flex flex-col overflow-hidden"
        style={{
          width: 'min(560px, 100vw)',
          background: 'var(--surface)',
          borderLeft: '1px solid var(--border)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <StatusIcon size={16} style={{ color: STATUS_COLORS[status], flexShrink: 0 }} />
            <span className="label-caps truncate">{t('task_detail_title')}</span>
          </div>
          <div className="flex items-center gap-2">
            {canEdit && dirty && (
              <button
                onClick={handleSave}
                disabled={updateTask.isPending}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-40"
                style={{ background: 'var(--primary)', color: 'var(--primary-fg)' }}
              >
                {updateTask.isPending ? t('task_saving') : t('task_save')}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg opacity-50 hover:opacity-100 transition-opacity"
              style={{ color: 'var(--muted)' }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* Title */}
          <div className="px-6 pt-5 pb-3">
            {canEdit ? (
              <input
                ref={titleRef}
                value={title}
                onChange={e => setTitle(e.target.value)}
                onBlur={() => { if (title.trim() !== task.title) handleSave(); }}
                className="w-full text-xl font-bold bg-transparent border-none focus:outline-none"
                style={{ color: 'var(--text)' }}
                placeholder={t('task_title_placeholder')}
              />
            ) : (
              <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>{task.title}</h2>
            )}
          </div>

          {/* Status + priority row */}
          <div className="px-6 pb-4 flex items-center gap-3 flex-wrap">
            {/* Status selector */}
            {canEdit ? (
              <select
                value={status}
                onChange={e => setStatus(e.target.value as TaskStatus)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border appearance-none focus:outline-none cursor-pointer"
                style={{
                  background: 'var(--elevated)',
                  borderColor: STATUS_COLORS[status],
                  color: STATUS_COLORS[status],
                }}
              >
                {columns.map(col => (
                  <option key={col.status} value={col.status} style={{ color: 'var(--text)', background: 'var(--surface)' }}>
                    {col.label}
                  </option>
                ))}
              </select>
            ) : (
              <span
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border"
                style={{ borderColor: STATUS_COLORS[status], color: STATUS_COLORS[status], background: 'var(--elevated)' }}
              >
                <StatusIcon size={12} /> {STATUS_LABELS[status]}
              </span>
            )}

            {/* Priority selector */}
            {canEdit ? (
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as TaskPriority)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border appearance-none focus:outline-none cursor-pointer"
                style={{
                  background: 'var(--elevated)',
                  borderColor: PRIORITY_COLORS[priority],
                  color: PRIORITY_COLORS[priority],
                }}
              >
                {(['low', 'medium', 'high'] as TaskPriority[]).map(p => (
                  <option key={p} value={p} style={{ color: 'var(--text)', background: 'var(--surface)' }}>
                    {PRIORITY_LABELS[p]}
                  </option>
                ))}
              </select>
            ) : (
              <span
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border"
                style={{ borderColor: PRIORITY_COLORS[priority], color: PRIORITY_COLORS[priority], background: 'var(--elevated)' }}
              >
                <PriorityIcon size={12} /> {PRIORITY_LABELS[priority]}
              </span>
            )}

            {/* Move forward */}
            {canEdit && status !== 'done' && (
              <button
                onClick={() => {
                  const statuses = columns.map(c => c.status);
                  const idx = statuses.indexOf(status);
                  if (idx < statuses.length - 1) {
                    const nextStatus = statuses[idx + 1];
                    setStatus(nextStatus);
                    updateTask.mutate({ status: nextStatus });
                  }
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs hover:opacity-80 transition-opacity"
                style={{ color: 'var(--primary)', background: 'color-mix(in srgb, var(--primary) 10%, transparent)' }}
              >
                {t('task_move_next')} <ChevronRight size={12} />
              </button>
            )}
          </div>

          <div className="px-6 space-y-5 pb-8">
            {/* Description */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlignLeft size={13} style={{ color: 'var(--muted)' }} />
                <span className="label-caps">{t('task_description_placeholder').split('…')[0]}</span>
              </div>
              {canEdit ? (
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2.5 rounded-xl text-sm border focus:outline-none resize-y"
                  style={{ background: 'var(--elevated)', borderColor: 'var(--border)', color: 'var(--text)', minHeight: '80px' }}
                  placeholder={t('task_description_placeholder')}
                />
              ) : (
                <p className="text-sm leading-relaxed" style={{ color: description ? 'var(--text)' : 'var(--muted)' }}>
                  {description || t('task_no_description')}
                </p>
              )}
            </div>

            {/* Metadata grid */}
            <div className="space-y-3">
              {/* Assignee */}
              <div className="flex items-center gap-3">
                <div className="w-28 flex items-center gap-1.5 flex-shrink-0">
                  <User size={13} style={{ color: 'var(--muted)' }} />
                  <span className="label-caps">{t('task_assignee')}</span>
                </div>
                {canEdit && users.length > 0 ? (
                  <select
                    value={assigneeId ?? ''}
                    onChange={e => setAssigneeId(e.target.value || null)}
                    className="flex-1 px-3 py-1.5 rounded-lg text-xs border appearance-none focus:outline-none"
                    style={{ background: 'var(--elevated)', borderColor: 'var(--border)', color: 'var(--text)' }}
                  >
                    <option value="">{t('projects_no_assignee')}</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                ) : (
                  <span className="text-sm" style={{ color: assignee ? 'var(--text)' : 'var(--muted)' }}>
                    {assignee ? (
                      <span className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: 'var(--primary)', color: 'var(--primary-fg)' }}
                        >
                          {assignee.name[0]?.toUpperCase()}
                        </div>
                        {assignee.name}
                      </span>
                    ) : t('projects_no_assignee')}
                  </span>
                )}
              </div>

              {/* Due date */}
              <div className="flex items-center gap-3">
                <div className="w-28 flex items-center gap-1.5 flex-shrink-0">
                  <Calendar size={13} style={{ color: 'var(--muted)' }} />
                  <span className="label-caps">{t('task_due_date')}</span>
                </div>
                {canEdit ? (
                  <input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="px-3 py-1.5 rounded-lg text-xs border focus:outline-none"
                    style={{ background: 'var(--elevated)', borderColor: 'var(--border)', color: 'var(--text)' }}
                  />
                ) : (
                  <span className="text-sm" style={{ color: task.dueDate ? 'var(--text)' : 'var(--muted)' }}>
                    {formatDate(task.dueDate) || '—'}
                  </span>
                )}
              </div>

              {/* Tags */}
              <div className="flex items-start gap-3">
                <div className="w-28 flex items-center gap-1.5 flex-shrink-0 mt-0.5">
                  <Tag size={13} style={{ color: 'var(--muted)' }} />
                  <span className="label-caps">{t('task_tags')}</span>
                </div>
                {canEdit ? (
                  <div className="flex-1">
                    <TagInput tags={tags} onChange={setTags} />
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {tags.length > 0 ? tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--elevated)', color: 'var(--text)' }}>
                        {tag}
                      </span>
                    )) : <span className="text-sm" style={{ color: 'var(--muted)' }}>—</span>}
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t" style={{ borderColor: 'var(--border)' }} />

            {/* Meta */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--muted)' }}>
                <span className="w-28">{t('task_created_by')}</span>
                <span style={{ color: 'var(--text)' }}>{task.createdByName}</span>
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--muted)' }}>
                <span className="w-28">{t('task_created_at')}</span>
                <span>{formatDateTime(task.createdAt)}</span>
              </div>
              {task.updatedAt && task.updatedAt !== task.createdAt && (
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--muted)' }}>
                  <span className="w-28">{t('task_updated_at')}</span>
                  <span>{formatDateTime(task.updatedAt)}</span>
                </div>
              )}
            </div>

            {/* Delete */}
            {canEdit && (
              <div className="pt-2">
                <button
                  onClick={() => {
                    if (window.confirm(t('task_delete_confirm'))) deleteTask.mutate();
                  }}
                  disabled={deleteTask.isPending}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-opacity disabled:opacity-40"
                  style={{ color: 'var(--destructive)', background: 'color-mix(in srgb, var(--destructive) 8%, transparent)' }}
                >
                  <Trash2 size={14} /> {t('task_delete')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
