# SKILL: Architecture — Onion / Clean Architecture

## Mandatory layer structure

Every feature in Mo.one Brain follows strict onion layering.
Dependencies point INWARD only. Outer layers know about inner layers, never the reverse.

```
┌─────────────────────────────────────┐
│  4. Infrastructure (DB, HTTP, ext.) │  ← knows about everything inside
│  ┌───────────────────────────────┐  │
│  │  3. Application (use cases)   │  │  ← knows about domain only
│  │  ┌─────────────────────────┐  │  │
│  │  │  2. Domain (entities,   │  │  │  ← knows nothing outside
│  │  │     business rules)     │  │  │
│  │  │  ┌───────────────────┐  │  │  │
│  │  │  │  1. Shared types  │  │  │  │  ← pure TypeScript, no deps
│  │  │  └───────────────────┘  │  │  │
│  │  └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

## Layer 1 — Shared types `/shared/types/`

- Pure TypeScript interfaces and enums ONLY
- No imports from any other layer
- No business logic, no validation, no DB references
- Exported and used by both client and server

```typescript
// CORRECT
export interface HrPosition {
  id: string
  name: string
  entity: LegalEntity
  employeeId: string | null
}

// WRONG — business logic does not belong here
export function isOverloaded(position: HrPosition): boolean { ... }
```

## Layer 2 — Domain `/server/modules/{module}/domain/`

Files: `entities.ts`, `rules.ts`, `errors.ts`

- Contains business rules as pure functions
- No database access, no HTTP, no external services
- Input: plain objects. Output: plain objects or domain errors
- 100% unit testable without mocks

```typescript
// CORRECT — pure function, no side effects
export function calculateBonus(
  kpiAchieved: number,
  kpiTarget: number,
  baseSalary: number,
  bonusPercent: number
): number {
  const achievement = kpiAchieved / kpiTarget
  if (achievement < 0.7) return 0
  if (achievement >= 1.0) return baseSalary * bonusPercent
  return baseSalary * bonusPercent * achievement
}

// WRONG — DB access in domain layer
export async function calculateBonus(positionId: string) {
  const pos = await db.query('SELECT ...')  // never in domain
}
```

## Layer 3 — Application `/server/modules/{module}/`

Files: `service.ts`, `queries.ts`

- Orchestrates domain logic + infrastructure
- One service method = one use case
- Calls domain functions, calls repository functions
- No SQL here — delegate to queries.ts
- No HTTP concerns (req/res) — delegate to routes.ts

```typescript
// CORRECT — service orchestrates, does not implement details
export async function createPosition(
  input: CreatePositionInput
): Promise<HrPosition> {
  validateCreatePosition(input)          // domain rule
  const existing = await findByName(input.name)  // query
  if (existing) throw new DuplicatePositionError(input.name)
  return insertPosition(input)           // query
}
```

## Layer 4 — Infrastructure

### Routes `/server/modules/{module}/routes.ts`
- HTTP only: parse req, call service, send res
- No business logic
- Always use zod for input parsing before calling service

```typescript
router.post('/positions', async (req, res) => {
  const input = CreatePositionSchema.parse(req.body)  // validate
  const result = await createPosition(input)          // delegate
  res.json({ data: result })                          // respond
})
```

### Queries `/server/modules/{module}/queries.ts`
- SQL only — no business logic
- Named exports matching the operation exactly
- Return typed results using shared types

```typescript
export async function findPositionById(id: string): Promise<HrPosition | null> {
  const result = await db.query<HrPosition>(
    'SELECT * FROM hr_positions WHERE id = $1 AND deleted_at IS NULL',
    [id]
  )
  return result.rows[0] ?? null
}
```

## Module folder structure (mandatory)

```
server/modules/{module}/
├── domain/
│   ├── entities.ts      — business entity definitions
│   ├── rules.ts         — pure business rule functions
│   └── errors.ts        — domain-specific error classes
├── queries.ts           — all SQL for this module
├── service.ts           — use cases (orchestration)
├── routes.ts            — HTTP handlers
└── schema.sql           — DB schema for this module
```

## Cross-module rules

- Modules do NOT import from each other's domain or queries
- Cross-module data access goes through a service interface only
- Shared data lives in `/shared/types/` and `/server/db/`
- If two modules need the same data, extract to a shared query, do not duplicate

## Violation checklist — before every commit

- [ ] Does any domain file import from infrastructure? → BLOCK
- [ ] Does any route file contain SQL? → BLOCK
- [ ] Does any query file contain business logic? → BLOCK
- [ ] Does any module import from another module's internals? → BLOCK
- [ ] Are all inputs validated with zod before reaching service? → REQUIRED
