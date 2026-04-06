// =============================================================================
// shared/types/moodboard.ts — Mood board types
// =============================================================================

import type { UUID, MoodboardItemType, BaseEntity } from './common';

export interface MoodboardBoard extends BaseEntity {
  name: string;
  description: string | null;
  coverColor: string | null;
  createdById: UUID;
  createdByName: string;
}

export interface MoodboardItem extends BaseEntity {
  boardId: UUID;
  type: MoodboardItemType;
  title: string | null;
  note: string | null;
  /** For type=image: file URL; for type=url: external URL; for type=color: hex */
  value: string;
  tags: string[];
  position: number;
  addedById: UUID;
  addedByName: string;
}

export interface CreateBoardInput {
  name: string;
  description?: string;
  coverColor?: string;
}

export interface CreateItemInput {
  boardId: UUID;
  type: MoodboardItemType;
  title?: string;
  note?: string;
  value: string;
  tags?: string[];
}