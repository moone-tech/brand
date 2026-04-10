-- =============================================================================
-- 008_moodboard_article_document_types.sql
-- Extend moodboard_items.type to include 'article' and 'document'.
-- Uses a DO block so it works regardless of the auto-generated constraint name.
-- =============================================================================

DO $$
DECLARE
  r RECORD;
BEGIN
  -- Drop every CHECK constraint on moodboard_items that mentions 'image'
  -- (that's the old type constraint, whatever PostgreSQL named it)
  FOR r IN
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'moodboard_items'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) LIKE '%image%'
  LOOP
    EXECUTE format('ALTER TABLE moodboard_items DROP CONSTRAINT %I', r.conname);
  END LOOP;
END$$;

ALTER TABLE moodboard_items
  ADD CONSTRAINT moodboard_items_type_check
    CHECK (type IN ('image', 'url', 'color', 'note', 'article', 'document'));
