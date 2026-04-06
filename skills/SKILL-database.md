# SKILL: Database — PostgreSQL conventions

## Core rules

Every table follows these rules without exception:

```sql
CREATE TABLE module_entity_name (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- ... business columns ...
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at  TIMESTAMPTZ          -- soft delete, NULL = active
);

-- Auto-update updated_at on every UPDATE
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON module_entity_name
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
```

The `trigger_set_updated_at()` function must exist in `000_init.sql`:
```sql
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## Naming conventions

| Object       | Convention              | Example                        |
|-------------|-------------------------|--------------------------------|
| Table        | `module_entity`         | `hr_positions`, `product_steps`|
| Column       | `snake_case`            | `employee_id`, `created_at`    |
| FK column    | `referenced_table_singular_id` | `position_id`, `product_id` |
| Index        | `idx_table_column`      | `idx_hr_positions_entity`      |
| Constraint   | `chk_table_rule`        | `chk_kpi_target_positive`      |
| Enum type    | `module_entity_status`  | `product_lifecycle_status`     |

## Column rules

- UUIDs for all PKs — never serial/integer IDs (not guessable, safe for external exposure)
- TIMESTAMPTZ always (never TIMESTAMP without timezone)
- TEXT for variable strings (never VARCHAR with arbitrary limits unless enforced by domain rule)
- NUMERIC(precision, scale) for money — never FLOAT (rounding errors)
- BOOLEAN with explicit DEFAULT (never nullable boolean)
- JSONB for flexible metadata — always with a comment describing expected shape

```sql
-- CORRECT
amount      NUMERIC(12, 2)  NOT NULL,
is_active   BOOLEAN         NOT NULL DEFAULT true,
metadata    JSONB           NOT NULL DEFAULT '{}',
-- Expected metadata shape: { source: string, channel: string }

-- WRONG
amount      FLOAT,
is_active   BOOLEAN,
metadata    JSON,
```

## Soft deletes

NEVER hard delete. Always:
```sql
UPDATE table SET deleted_at = NOW() WHERE id = $1;
```

All SELECT queries MUST include `WHERE deleted_at IS NULL` unless explicitly querying deleted records.

Create a view for every frequently queried table to enforce this:
```sql
CREATE VIEW active_hr_positions AS
  SELECT * FROM hr_positions WHERE deleted_at IS NULL;
```

## Foreign keys

Always explicit with named constraint and ON DELETE behaviour:
```sql
position_id UUID NOT NULL
  REFERENCES hr_positions(id)
  ON DELETE RESTRICT,  -- or SET NULL / CASCADE — choose explicitly

CONSTRAINT fk_kpi_position
  FOREIGN KEY (position_id) REFERENCES hr_positions(id)
```

## Migrations

Location: `/server/db/migrations/`
Naming: `NNN_description.sql` where NNN is zero-padded sequence

```
001_init_functions.sql
002_hr_positions.sql
003_hr_kpi_definitions.sql
004_products.sql
005_product_lifecycle.sql
```

Rules:
- Each migration is IRREVERSIBLE by default (write a separate rollback file if needed)
- Never modify an existing migration — always add a new one
- Migration must be idempotent where possible (use `IF NOT EXISTS`, `CREATE OR REPLACE`)
- Add a comment block at the top of every migration:

```sql
-- Migration: 004_products.sql
-- Description: Create products table and lifecycle stages enum
-- Author: Claude Code / Mo.one Brain
-- Date: YYYY-MM-DD
-- Dependencies: 002_hr_positions.sql (references hr_positions)
```

## Index strategy

Create indexes for:
1. All FK columns (PostgreSQL does not auto-index FKs)
2. Columns used in WHERE clauses in queries.ts
3. Columns used in ORDER BY for paginated lists

```sql
CREATE INDEX idx_products_entity       ON products(legal_entity);
CREATE INDEX idx_products_lifecycle    ON products(lifecycle_stage);
CREATE INDEX idx_products_deleted_at   ON products(deleted_at)
  WHERE deleted_at IS NULL;  -- partial index — only active rows
```

## TypeScript ↔ SQL type mapping

| PostgreSQL     | TypeScript          |
|----------------|---------------------|
| UUID           | string              |
| TEXT           | string              |
| NUMERIC        | number (use parseFloat on result) |
| BOOLEAN        | boolean             |
| TIMESTAMPTZ    | string (ISO 8601)   |
| JSONB          | Record<string, unknown> or specific interface |
| Enum type      | TypeScript enum or union type in shared/types |

## Query patterns

All queries return typed results. Use the generic query helper:

```typescript
// In queries.ts
export async function findActiveProducts(): Promise<Product[]> {
  const result = await db.query<Product>(
    `SELECT
       p.id,
       p.name,
       p.legal_entity,
       p.lifecycle_stage,
       p.created_at
     FROM products p
     WHERE p.deleted_at IS NULL
     ORDER BY p.name ASC`
  )
  return result.rows
}
```

Never use `SELECT *` in production queries — always name columns explicitly.

## Seed data rules

Location: `/server/db/seeds/`
Naming: `NNN_module_description.ts`

```typescript
// seeds/001_hr_positions.ts
export async function seed(db: Pool): Promise<void> {
  await db.query(`
    INSERT INTO hr_positions (id, name, legal_entity, is_open)
    VALUES
      ('uuid-here', 'CEO', 'moone_as', false),
      ('uuid-here', 'CIO/COO', 'moone_as', false)
    ON CONFLICT (id) DO NOTHING;
  `)
}
```

Use fixed UUIDs in seeds (generate once, hardcode) so re-runs are idempotent.
