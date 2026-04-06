# SKILL: TypeScript Types — strict, consistent, auditable

## Philosophy

Types are the contract between layers.
A new developer must be able to understand the entire data model
by reading `/shared/types/` alone — without touching the database or the UI.

If a type is unclear, the code is unclear.
If a type is duplicated, the contract is broken.
If `any` is used, the contract does not exist.

---

## The golden rule

**Every piece of data that crosses a boundary has an explicit type.**

Boundaries are:
- HTTP request → server (input validation via zod)
- Server → database (query return type)
- Database → service (typed query result)
- Service → route (typed return value)
- API → client (typed API response)
- Component → hook (typed return value)
- Component → component (typed props)

If data crosses a boundary without a type, it is a bug waiting to happen.

---

## File structure for types

```
shared/
└── types/
    ├── index.ts          — re-exports everything (single import point)
    ├── common.ts         — shared primitives (UUID, ISODate, Money, LegalEntity...)
    ├── hr.ts             — HR module types
    ├── products.ts       — Products module types
    ├── loop-engine.ts    — Loop Engine types
    ├── finance.ts        — Finance module types
    └── api.ts            — API response wrappers (ApiResponse<T>, ApiError, Paginated<T>)
```

Client and server both import from `shared/types`:
```typescript
import type { HrPosition, KpiDefinition } from '@shared/types'
```

---

## common.ts — primitives (mandatory foundation)

```typescript
// shared/types/common.ts

/** UUID v4 string — all primary keys */
export type UUID = string

/** ISO 8601 datetime string — all timestamps */
export type ISODate = string

/** Czech koruna amount stored as number with 2 decimal places */
export type CZK = number

/** Legal entities within Mo.one holding */
export type LegalEntity =
  | 'moone_as'           // Mo.one a.s. — parent holding
  | 'moone_digital'      // Mo.one Digital Services s.r.o.
  | 'legi_one'           // Legi.one — terminal distribution
  | 'czkt'               // Koruna CZKT — stablecoin (2027)

/** Lifecycle stages for products and initiatives */
export type LifecycleStage =
  | 'idea'
  | 'pilot'
  | 'launch'
  | 'scale'
  | 'sunset'

/** Review cadence periods */
export type ReviewPeriod = 'weekly' | 'monthly' | 'quarterly'

/** RACI responsibility types */
export type RaciRole = 'responsible' | 'accountable' | 'consulted' | 'informed'

/** KPI achievement status thresholds */
export type KpiStatus =
  | 'not_started'     // no data yet
  | 'below_threshold' // < 70% of target
  | 'partial'         // 70–99% of target
  | 'achieved'        // 100–119% of target
  | 'exceeded'        // >= 120% of target

/** Soft-deletable base — all DB entities extend this */
export interface BaseEntity {
  id: UUID
  createdAt: ISODate
  updatedAt: ISODate
  deletedAt: ISODate | null
}
```

---

## api.ts — response wrappers (mandatory for all API responses)

```typescript
// shared/types/api.ts

import type { UUID } from './common'

/** Standard success response — all API endpoints return this */
export interface ApiResponse<T> {
  data: T
  meta?: ApiMeta
}

/** Pagination metadata */
export interface ApiMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

/** Standard error response */
export interface ApiError {
  error: {
    code: string        // machine-readable: 'NOT_FOUND', 'DUPLICATE', 'VALIDATION'
    message: string     // human-readable Czech message for UI
    field?: string      // optional: which field caused the error
    requestId?: UUID    // optional: for log tracing
  }
}

/** Paginated list — use for all list endpoints */
export type Paginated<T> = ApiResponse<T[]> & { meta: Required<ApiMeta> }
```

---

## Module type patterns

### Always define three variants per entity

```typescript
// shared/types/hr.ts

import type { BaseEntity, UUID, CZK, LegalEntity, KpiStatus } from './common'

// 1. FULL entity — what comes from the database (includes all relations)
export interface HrPosition extends BaseEntity {
  name: string
  title: string                    // display title (Czech)
  entity: LegalEntity
  reportsTo: UUID | null           // FK to another HrPosition
  employeeId: UUID | null          // FK to HrEmployee, null = open position
  isOpen: boolean                  // true = actively hiring
  isShared: boolean                // true = person holds multiple roles
  activeRoleCount: number          // how many active roles this person holds
}

// 2. CREATE input — what the API accepts to create a new entity
export interface CreateHrPositionInput {
  name: string
  title: string
  entity: LegalEntity
  reportsTo?: UUID
  employeeId?: UUID
  isOpen?: boolean
}

// 3. UPDATE input — what the API accepts to update (all fields optional)
export type UpdateHrPositionInput = Partial<CreateHrPositionInput>

// 4. SUMMARY — lightweight version for lists and dropdowns
export interface HrPositionSummary {
  id: UUID
  name: string
  title: string
  entity: LegalEntity
  isOpen: boolean
  employeeName: string | null
}
```

### KPI types — example of nested domain types

```typescript
export interface KpiDefinition extends BaseEntity {
  positionId: UUID
  name: string                     // e.g. "Počet aktivovaných merchantů"
  description: string
  unit: string                     // e.g. "merchantů", "Kč", "%", "NPS"
  targetValue: number
  period: ReviewPeriod
  bonusPercentIfAchieved: number   // e.g. 0.15 = 15% of base salary
  weight: number                   // 0–1, all KPIs for a position must sum to 1.0
}

export interface KpiRecord extends BaseEntity {
  kpiDefinitionId: UUID
  periodLabel: string              // e.g. "2026-Q1", "2026-03", "2026-W12"
  targetValue: number              // snapshot of target at time of measurement
  actualValue: number
  achievedPercent: number          // computed: actualValue / targetValue * 100
  status: KpiStatus                // computed from achievedPercent
  bonusAmount: CZK                 // computed: baseSalary * bonusPercent * rate
  notes: string | null
}

export interface KpiSummary {
  kpiId: UUID
  name: string
  unit: string
  last6Periods: Array<{
    label: string
    target: number
    actual: number
    status: KpiStatus
  }>
  trend: 'improving' | 'stable' | 'declining'
}
```

---

## Zod schemas — mandatory for all API inputs

Every `Create*Input` and `Update*Input` type has a corresponding zod schema.
The zod schema IS the single source of truth — the TypeScript type is inferred from it.

```typescript
// server/modules/hr/validation.ts

import { z } from 'zod'
import type { CreateHrPositionInput } from '@shared/types'

export const CreateHrPositionSchema = z.object({
  name: z.string().min(2).max(100),
  title: z.string().min(2).max(150),
  entity: z.enum(['moone_as', 'moone_digital', 'legi_one', 'czkt']),
  reportsTo: z.string().uuid().optional(),
  employeeId: z.string().uuid().optional(),
  isOpen: z.boolean().default(false),
})

// Type is INFERRED from schema — never write the type manually for input objects
export type CreateHrPositionInputValidated = z.infer<typeof CreateHrPositionSchema>

// Compile-time check: inferred type must match shared type
// If this line errors, the shared type and zod schema are out of sync
const _typeCheck: CreateHrPositionInputValidated = {} as CreateHrPositionInput
```

---

## Forbidden patterns

```typescript
// 1. NO `any` — ever
const result: any = await db.query(...)          // WRONG
const result = await db.query<HrPosition>(...)   // CORRECT

// 2. NO type assertions without justification
const pos = data as HrPosition                   // WRONG (silent failure)
const pos = HrPositionSchema.parse(data)         // CORRECT (validated)

// 3. NO inline object types in function signatures
function create(input: {                         // WRONG
  name: string
  entity: string
}) { ... }
function create(input: CreateHrPositionInput) { ... }  // CORRECT

// 4. NO duplicate types across modules
// If Products and HR both need a "person reference", define it ONCE in common.ts

// 5. NO `object` or `{}` as a type
function process(data: object) { ... }           // WRONG
function process(data: Record<string, unknown>) { ... }  // CORRECT (explicit)

// 6. NO optional chaining to hide missing types
const name = position?.employee?.name ?? 'N/A'  // might be hiding a type gap
// Ask: should employee always be loaded here? If yes, fix the type.
// If no, make it explicit: position: HrPositionWithOptionalEmployee

// 7. NO enums — use union types (enums have runtime overhead and import issues)
enum Status { Active, Inactive }                 // WRONG
type Status = 'active' | 'inactive'              // CORRECT
```

---

## Type audit checklist — run before every PR

- [ ] All function parameters have explicit types (no implicit `any`)
- [ ] All function return types are explicit (especially async functions)
- [ ] All DB query results are typed with `db.query<T>(...)`
- [ ] All API inputs are validated with a zod schema before use
- [ ] No `any`, no `object`, no `{}`
- [ ] Every new entity has: Full type, Create input, Update input, Summary type
- [ ] New types are in `shared/types/`, not scattered in module files
- [ ] `shared/types/index.ts` exports all new types
- [ ] Zod schemas exist for all Create/Update inputs
- [ ] TypeScript compiles with zero errors (`tsc --noEmit`)

---

## tsconfig rules (mandatory settings)

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

These settings are non-negotiable. If the project currently compiles with errors
under these settings, fix the errors — do not loosen the config.
