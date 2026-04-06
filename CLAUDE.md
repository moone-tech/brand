# Mo.one Brand — Claude Code Instructions

## Project overview

Mo.one Brand je veřejný brand portál a interní CI workspace pro Mo.one a.s. holding.
Vystaveno na `brand.mo.one`. Vychází ze stejné technologie jako Brain (moone-tech/brain).

**Dvě části jedné aplikace:**

1. **Public Brand Portal** (`/`, `/guidelines`, `/assets`) — veřejně přístupné
   - Pro zaměstnance, merchanty, média, franšízanty
   - Ukazuje brand identity: mise, hodnoty, barvy, typografie, entity

2. **Admin CI Workspace** (`/admin`) — přihlášení povinné
   - CI Editor — textové editory (mise, hodnoty, positioning, hlas)
   - Mood Board — vizuální reference pro CI tým
   - Projekty — Kanban board pro CI úkoly
   - Správa uživatelů — pozvánky přes Brevo email

## CI tým

- **Elif Erkmen** — UX/UI designérka
- **Richard** — Project Owner
- **onvision** — kreativní agentura (editor/viewer role)
- **Patrik Štípák** — admin

## Tech stack

Identický s Brain:
- **Frontend:** React 19 + Vite, TypeScript, Tailwind CSS v4
- **Backend:** Express.js, TypeScript, REST API
- **Database:** PostgreSQL
- **Auth:** JWT (access 15m + refresh 7d) + Brevo email (pozvánky, reset)
- **Package manager:** npm workspaces
- **Port conventions:** frontend 5173, backend 3001

## Project structure

```
moone-brand/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── modules/
│   │   │   ├── public/      # Veřejné stránky (HomePage, GuidelinesPage, AssetsPage)
│   │   │   └── admin/       # Admin workspace
│   │   │       ├── ci/      # CI Editor (ported from Brain)
│   │   │       ├── moodboard/
│   │   │       ├── projects/
│   │   │       └── users/
│   │   ├── components/
│   │   ├── layouts/         # PublicLayout, AdminLayout
│   │   ├── pages/auth/      # Login, AcceptInvite, ForgotPassword, ResetPassword
│   │   ├── hooks/           # useAuth
│   │   └── lib/             # api, auth, cn
├── server/                  # Express backend
│   ├── src/modules/
│   │   ├── auth/            # JWT + Brevo (login, invite, reset)
│   │   ├── ci/              # CI settings (JSONB)
│   │   ├── moodboard/       # Boards + items
│   │   └── projects/        # Projects + Kanban tasks
│   ├── db/migrations/       # 001–005 SQL
│   └── src/lib/             # db, logger, email (Brevo)
├── shared/                  # Shared TypeScript types
│   ├── types/               # common, auth, ci, moodboard, projects, api
│   └── config/features.ts
├── skills/                  # Architecture guides (copied from Brain)
└── CLAUDE.md                # This file
```

## Auth flow

1. Admin pozve uživatele přes `/admin/users` (email + jméno + role)
2. Brevo pošle invitation email s tokenem (platnost 72h)
3. Uživatel klikne odkaz → `/auth/accept-invite?token=XXX` → nastaví heslo
4. Login: JWT access token (15m) + refresh token (7d) v localStorage
5. Password reset: email s tokenem (platnost 1h) přes Brevo

## Roles

| Role    | Přístup |
|---------|---------|
| `admin` | Vše — správa uživatelů, editace, čtení |
| `editor` | CI editor, Mood board, Projekty — editace |
| `viewer` | Vše jen pro čtení (onvision pro schvalování) |

## Design system

Identický s Brain — viz CLAUDE.md v brain repozitáři.

**Dark-first.** `:root` = light, `.dark` = dark. Default: dark.

| Token | Dark | Light | Kdy použít |
|-------|------|-------|-----------|
| Primary blue | `#3b82f6` | `#2563eb` | Akce, CTA, aktivní nav |
| Reward green | `#4ade80` | `#16a34a` | Úspěch, earned, odměna |
| Destructive | `#ef4444` | `#dc2626` | Chyby a destruktivní akce |
| Warning | `#f59e0b` | `#d97706` | Upozornění |

## API conventions

- Prefix: `/api/v1/{module}/{resource}`
- Response: `{ data: T, meta?: { total, page } }`
- Error: `{ error: { code, message } }`
- Auth header: `Authorization: Bearer {accessToken}`

## Database conventions

- UUIDs pro všechny PK
- `created_at`, `updated_at`, `deleted_at` — soft deletes
- Czech komentáře, English column names
- Migrace v `/server/db/migrations/` číslované sekvenčně

## Deployment

- **Frontend:** Vercel — dočasně generic doména, pak `brand.mo.one`
- **Backend:** Railway — `server/railway.json` konfigurace

## Environment variables

Viz `.env.example`. Povinné v produkci:
- `JWT_SECRET` + `JWT_REFRESH_SECRET`
- `BREVO_API_KEY` + `BREVO_FROM_EMAIL`
- `DB_*` (PostgreSQL na Railway)
- `CLIENT_URL` (Vercel URL)
- `APP_URL` (pro email links)

## First deploy checklist

1. `npm install` v root
2. Nastav `.env` ze `.env.example`
3. Vytvoř DB na Railway PostgreSQL
4. `npm run db:migrate --workspace=server`
5. Vlož prvního admin uživatele přímo do DB:
   ```sql
   INSERT INTO users (email, name, role, password_hash)
   VALUES ('patrik@mo.one', 'Patrik Štípák', 'admin', '<bcrypt-hash>');
   ```
6. Deploy server na Railway, frontend na Vercel

## Skills — mandatory reading before writing code

Před každým souborem přečti relevantní skill file ze `/skills/`:

| Skill file              | Čti před…                                 |
|-------------------------|-------------------------------------------|
| `SKILL-types.md`        | Každým typem, interface nebo zod schéma   |
| `SKILL-architecture.md` | Přidáním modulu, route, service, query    |
| `SKILL-database.md`     | SQL, migrace, query helpers               |
| `SKILL-readability.md`  | Každým souborem (headers, line limits)    |
| `SKILL-scalability.md`  | Logování, config, pagination              |
| `SKILL-ux-design.md`    | UI/UX komponenty a obrazovky             |

**Non-negotiable:**
- No `any`, no `object`, no `{}`
- No SQL v `routes.ts` — pouze v `queries.ts`
- Každý soubor začíná header comment blokem
- `routes.ts` ≤ 120 řádků, React komponenty ≤ 150 řádků
- Shared types žijí v `shared/types/` — nikde jinde
- `tsc --noEmit` musí projít bez chyb
