# SKILL: Scalability — patterns for long-term growth

## Core principle

Build for the next developer, not for the next deadline.
Every decision must answer: "Can a new developer understand and extend this in 1 day?"

## Module independence

Each module is a self-contained vertical slice:

```
module/
├── domain/          — what the business cares about
├── queries.ts       — how we store it
├── service.ts       — what we can do with it
├── routes.ts        — how the outside world asks for it
├── schema.sql       — what shape it takes in the DB
└── README.md        — why this module exists (mandatory)
```

### Module README (mandatory for every module)

```markdown
# HR Module

## Purpose
Manages the organizational structure, positions, KPI definitions,
and bonus calculations across all Mo.one holding entities.

## Key concepts
- Position: a role in the org chart, may or may not have a current employee
- KPI: a measurable target attached to a position, evaluated per period
- Bonus: calculated from KPI achievement at end of each period

## Entry points
- GET  /api/v1/hr/positions          — list all active positions
- POST /api/v1/hr/positions          — create a position
- GET  /api/v1/hr/positions/:id/kpis — get KPIs for a position

## Dependencies
- None (HR is a foundational module)

## Depended on by
- Products module (ownership / RACI assignments)
- Loop Engine (initiative owners)
- Finance module (salary and bonus costs)

## Known limitations / tech debt
- Employee assignments are currently manual (no HRIS integration)
- Bonus calculation does not yet handle pro-rata periods
```

## API versioning

All routes are versioned from day 1: `/api/v1/...`

When breaking changes are needed:
- Add `/api/v2/...` routes alongside v1
- Keep v1 working for minimum 3 months
- Document deprecation in route comment
- Never modify an existing v1 response shape

```typescript
// routes.ts — version prefix applied at router registration
// server/index.ts
app.use('/api/v1/hr', hrRouterV1)
app.use('/api/v2/hr', hrRouterV2)  // when needed
```

## Pagination — mandatory for all list endpoints

Never return unbounded lists. All list endpoints must support:

```typescript
// Query params: ?page=1&limit=20&sort=name&order=asc
interface PaginationInput {
  page: number    // default 1
  limit: number   // default 20, max 100
  sort?: string
  order?: 'asc' | 'desc'
}

interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
```

## Feature flags

Use a simple feature flag system for unfinished features:

```typescript
// shared/config/features.ts
export const FEATURES = {
  HR_BONUS_CALCULATOR:    true,
  PRODUCT_ECONOMICS:      true,
  LOOP_ENGINE:            true,
  FINANCE_MODULE:         false,  // v2
  STABLECOIN_MODULE:      false,  // 2027
  EXTERNAL_INTEGRATIONS:  false,  // needs API keys
} as const

// Usage in routes
if (!FEATURES.FINANCE_MODULE) {
  return res.status(503).json({
    error: { code: 'NOT_AVAILABLE', message: 'Finance module not yet available' }
  })
}
```

## Environment configuration

Never hardcode environment-specific values. All config goes through env:

```typescript
// server/config.ts — single source of truth for all env vars
export const config = {
  db: {
    host:     requireEnv('DB_HOST'),
    port:     parseInt(requireEnv('DB_PORT')),
    database: requireEnv('DB_NAME'),
    user:     requireEnv('DB_USER'),
    password: requireEnv('DB_PASSWORD'),
  },
  server: {
    port:    parseInt(process.env.PORT ?? '3001'),
    isDev:   process.env.NODE_ENV === 'development',
  },
  auth: {
    jwtSecret: requireEnv('JWT_SECRET'),
    jwtExpiry: process.env.JWT_EXPIRY ?? '7d',
  }
}

function requireEnv(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`Missing required environment variable: ${key}`)
  return value
}
```

## Adding a new module — checklist

When Claude Code or a developer adds a new module, follow this exact sequence:

1. **Schema first** — write `schema.sql` with all tables, indexes, FK constraints
2. **Migration** — create numbered migration file in `/server/db/migrations/`
3. **Shared types** — add interfaces to `/shared/types/{module}.ts`
4. **Domain** — write `domain/entities.ts`, `domain/rules.ts`, `domain/errors.ts`
5. **Queries** — write typed SQL functions in `queries.ts`
6. **Service** — write use cases in `service.ts`, calling only domain + queries
7. **Routes** — write HTTP handlers in `routes.ts`, calling only service
8. **Register route** — add to `server/index.ts`
9. **Seed data** — add to `/server/db/seeds/`
10. **Client module** — create `client/src/modules/{module}/` with components + hooks
11. **Add to navigation** — register in `client/src/layouts/Navigation.tsx`
12. **Write README** — `server/modules/{module}/README.md`

Never skip steps. Never reorder steps.

## Dependency management

```
client/ → shared/types/          ✓ allowed
client/ → server/                ✗ never (use API)
server/ → shared/types/          ✓ allowed
server/module-a/ → server/module-b/  ✗ never (use API or shared service)
shared/ → client/                ✗ never
shared/ → server/                ✗ never
```

## Performance rules

- Never fetch inside a loop — batch queries instead
- Never N+1 queries — use JOINs or `WHERE id = ANY($1)`
- Add `EXPLAIN ANALYZE` comment for queries on large tables
- Paginate all list queries — default 20, max 100

```typescript
// CORRECT — single query with IN
const positions = await db.query<HrPosition>(
  'SELECT * FROM hr_positions WHERE id = ANY($1)',
  [positionIds]
)

// WRONG — N queries in a loop
const positions = await Promise.all(
  positionIds.map(id => findPositionById(id))
)
```

## Logging standards

Use structured logging, never plain console.log:

```typescript
// server/lib/logger.ts
import pino from 'pino'
export const logger = pino({ level: process.env.LOG_LEVEL ?? 'info' })

// Usage
logger.info({ positionId, module: 'hr' }, 'Position created')
logger.error({ err, input }, 'Failed to calculate bonus')
logger.debug({ query, params }, 'Executing query')
```

Log levels:
- `error` — something broke, needs immediate attention
- `warn`  — something unexpected, but recovered
- `info`  — significant business events (created, deleted, calculated)
- `debug` — detailed flow for debugging (queries, transformations)
