# SKILL: Code Readability — Human-like, auditable code

## Philosophy

Code is written once, read hundreds of times.
Every file must be understandable by a new developer in under 5 minutes.
If a function needs a comment to explain WHAT it does, rename it.
Comments explain WHY, not WHAT.

## File length limits

| File type       | Soft limit | Hard limit | Action if exceeded          |
|-----------------|-----------|------------|-----------------------------|
| `routes.ts`     | 80 lines  | 120 lines  | Split by resource            |
| `service.ts`    | 100 lines | 150 lines  | Split by use case group      |
| `queries.ts`    | 120 lines | 200 lines  | Split by entity              |
| `domain/rules.ts` | 80 lines | 120 lines | Split by rule domain        |
| React component | 100 lines | 150 lines  | Extract sub-components       |
| Any other file  | 80 lines  | 120 lines  | Refactor                     |

When approaching the limit: split, do not compress.

## Naming rules

### Functions — verb + noun, intention-revealing

```typescript
// CORRECT — reads like English
getUserById()
calculateBonusForPosition()
isEligibleForPromotion()
formatCzechCurrency()
findOverloadedEmployees()

// WRONG — vague, abbreviated, unclear
getData()
calc()
check()
process()
handleStuff()
```

### Variables — noun phrases, no abbreviations

```typescript
// CORRECT
const activePositions = await findActivePositions()
const totalTransactionVolume = transactions.reduce(...)
const isKpiAchieved = actual >= target
const employeeWithMultipleRoles = positions.filter(hasMultipleRoles)

// WRONG
const data = await findActivePositions()
const total = transactions.reduce(...)
const ok = actual >= target
const emp = positions.filter(...)
```

### Constants — SCREAMING_SNAKE_CASE with module prefix

```typescript
export const HR_BONUS_THRESHOLD_PERCENT = 0.7
export const PRODUCT_MAX_LIFECYCLE_DAYS = 90
export const HUNTER_DEFAULT_FEE_PERCENT = 0.004
```

### Types and interfaces — PascalCase, descriptive nouns

```typescript
// CORRECT
interface HrPositionWithEmployee { ... }
interface ProductLifecycleStage { ... }
type KpiAchievementStatus = 'below_threshold' | 'partial' | 'full'

// WRONG
interface IPosition { ... }
interface PositionData { ... }
type Status = 'a' | 'b' | 'c'
```

## Function rules

### One function = one responsibility

```typescript
// CORRECT — each function does one thing
async function findPositionsAboveThreshold(threshold: number) { ... }
function groupPositionsByEntity(positions: HrPosition[]) { ... }
function formatForDashboard(groups: GroupedPositions) { ... }

// WRONG — one function doing three things
async function getDashboardData() {
  const positions = await db.query(...)
  const grouped = positions.reduce(...)
  return grouped.map(g => ({ ...g, formatted: ... }))
}
```

### Max 3 parameters — use an input object for more

```typescript
// CORRECT
function calculateBonus(input: BonusCalculationInput): number { ... }
interface BonusCalculationInput {
  kpiActual: number
  kpiTarget: number
  baseSalary: number
  bonusPercent: number
}

// WRONG
function calculateBonus(
  kpiActual: number,
  kpiTarget: number,
  baseSalary: number,
  bonusPercent: number,
  period: string,
  override: boolean
): number { ... }
```

### Early returns over nested ifs

```typescript
// CORRECT — flat, readable
function calculateBonus(input: BonusCalculationInput): number {
  if (input.kpiActual <= 0) return 0
  if (input.kpiTarget <= 0) return 0

  const achievement = input.kpiActual / input.kpiTarget
  if (achievement < HR_BONUS_THRESHOLD_PERCENT) return 0

  const rate = Math.min(achievement, 1.0)
  return input.baseSalary * input.bonusPercent * rate
}

// WRONG — deeply nested
function calculateBonus(...): number {
  if (input.kpiActual > 0) {
    if (input.kpiTarget > 0) {
      const achievement = input.kpiActual / input.kpiTarget
      if (achievement >= HR_BONUS_THRESHOLD_PERCENT) {
        ...
      }
    }
  }
  return 0
}
```

## File header (mandatory on every file)

Every file starts with a comment block:

```typescript
/**
 * hr/service.ts
 *
 * Use cases for the HR module.
 * Orchestrates domain rules and database queries.
 *
 * Dependencies:
 *   - hr/domain/rules.ts  (business logic)
 *   - hr/queries.ts       (data access)
 *   - shared/types/hr.ts  (interfaces)
 *
 * Used by:
 *   - hr/routes.ts
 */
```

## React component rules

### Component = display only

```typescript
// CORRECT — component only renders, logic is in hook
export function PositionCard({ positionId }: Props) {
  const { position, isLoading } = usePosition(positionId)
  if (isLoading) return <Skeleton />
  return <Card>...</Card>
}

// WRONG — fetching and rendering mixed
export function PositionCard({ positionId }: Props) {
  const [position, setPosition] = useState(null)
  useEffect(() => {
    fetch(`/api/v1/hr/positions/${positionId}`)
      .then(r => r.json())
      .then(setPosition)
  }, [positionId])
  return <Card>...</Card>
}
```

### Custom hooks extract all logic

```typescript
// hooks/usePosition.ts
export function usePosition(id: string) {
  return useQuery({
    queryKey: ['position', id],
    queryFn: () => api.hr.getPosition(id)
  })
}
```

### Props interfaces always named and exported

```typescript
// CORRECT
export interface PositionCardProps {
  positionId: string
  onEdit?: (id: string) => void
  compact?: boolean
}

export function PositionCard(props: PositionCardProps) { ... }

// WRONG
function PositionCard({ positionId, onEdit, compact }: {
  positionId: string
  onEdit?: (id: string) => void
  compact?: boolean
}) { ... }
```

## Error handling

Always use typed errors in domain, never throw strings:

```typescript
// domain/errors.ts
export class PositionNotFoundError extends Error {
  constructor(id: string) {
    super(`HR position not found: ${id}`)
    this.name = 'PositionNotFoundError'
  }
}

export class DuplicatePositionError extends Error {
  constructor(name: string) {
    super(`HR position already exists: ${name}`)
    this.name = 'DuplicatePositionError'
  }
}
```

In routes, map domain errors to HTTP status codes:

```typescript
try {
  const result = await createPosition(input)
  res.status(201).json({ data: result })
} catch (err) {
  if (err instanceof DuplicatePositionError) {
    return res.status(409).json({ error: { code: 'DUPLICATE', message: err.message } })
  }
  if (err instanceof ValidationError) {
    return res.status(400).json({ error: { code: 'VALIDATION', message: err.message } })
  }
  throw err  // let global error handler catch unexpected errors
}
```

## What NOT to do — anti-patterns

```typescript
// No magic numbers
if (achievement > 0.7) { ... }           // WRONG
if (achievement > HR_BONUS_THRESHOLD) { ... }  // CORRECT

// No boolean parameters
createPosition(name, entity, true, false)  // WRONG — what do true/false mean?
createPosition({ name, entity, isOpen: true, isShared: false })  // CORRECT

// No commented-out code — use git
// const oldCalculation = salary * 0.1  // WRONG — delete it

// No console.log in committed code — use the logger
console.log('position:', position)         // WRONG
logger.debug('Position created', { position })  // CORRECT
```
