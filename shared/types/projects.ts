// =============================================================================
// shared/types/projects.ts — Project management types
// =============================================================================

import type { UUID, ISODate, TaskStatus, TaskPriority, BaseEntity } from './common';

export interface Project extends BaseEntity {
  name: string;
  description: string | null;
  color: string;
  createdById: UUID;
  createdByName: string;
}

export interface Task extends BaseEntity {
  projectId: UUID;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: UUID | null;
  assigneeName: string | null;
  dueDate: ISODate | null;
  position: number;
  tags: string[];
  createdById: UUID;
  createdByName: string;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  color?: string;
}

export interface CreateTaskInput {
  projectId: UUID;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: UUID;
  dueDate?: ISODate;
  tags?: string[];
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: UUID | null;
  dueDate?: ISODate | null;
  position?: number;
  tags?: string[];
}
