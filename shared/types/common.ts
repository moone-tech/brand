// =============================================================================
// shared/types/common.ts — Primitive types shared across client and server
// =============================================================================

export type UUID = string;
export type ISODate = string;

/** User role in the Brand workspace */
export type UserRole = 'admin' | 'editor' | 'viewer';

/** Status of an invitation */
export type InvitationStatus = 'pending' | 'accepted' | 'expired';

/** Kanban task status */
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

/** Kanban task priority */
export type TaskPriority = 'low' | 'medium' | 'high';

/** Moodboard item type */
export type MoodboardItemType = 'image' | 'url' | 'color' | 'note';

/** Base entity with audit timestamps */
export interface BaseEntity {
  id: UUID;
  createdAt: ISODate;
  updatedAt: ISODate;
  deletedAt: ISODate | null;
}
