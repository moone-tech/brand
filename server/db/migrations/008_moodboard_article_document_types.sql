-- =============================================================================
-- 008_moodboard_article_document_types.sql
-- Extend moodboard_items.type CHECK constraint to include 'article' and 'document'
-- =============================================================================

ALTER TABLE moodboard_items
  DROP CONSTRAINT IF EXISTS moodboard_items_type_check;

ALTER TABLE moodboard_items
  ADD CONSTRAINT moodboard_items_type_check
    CHECK (type IN ('image', 'url', 'color', 'note', 'article', 'document'));
