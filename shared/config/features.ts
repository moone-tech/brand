// =============================================================================
// shared/config/features.ts — Feature flags for Brand workspace
// =============================================================================

export const FEATURES = {
  /** Public-facing brand portal */
  publicPortal: true,
  /** Corporate identity editor (admin) */
  ciEditor: true,
  /** Mood board (admin) */
  moodboard: true,
  /** Project management / Kanban (admin) */
  projects: true,
  /** User management (admin only) */
  userManagement: true,
  /** Asset library for downloads (public) */
  assetLibrary: true,
} as const;

export type FeatureKey = keyof typeof FEATURES;
