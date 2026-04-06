# SKILL: UX/UI Design — Mo.one product design principles

## Source

Based on UX/UI Design Review by Elif Erkmen, March 17, 2026.
Applies to: Mo.one App, Mo.one Hub, Mo.one Brain, and all future Mo.one products.

---

## Core design philosophy

### 1. Contextuality over feature density

The strength of a Super App lies in contextual precision, not feature abundance.
Every screen must answer: "What is the ONE thing the user needs right now?"

- Show only actions the user can currently take
- Hide actions whose prerequisites are not yet met
- Reveal features progressively as the user's state changes
- Never show a user a section they cannot interact with

```
WRONG: Show "Set Primary Account" to user who has not yet linked a bank account
RIGHT: Show "Set Primary Account" only after a bank account has been linked
```

### 2. Positive framing — always

Never communicate in terms of what the user cannot do.
Always communicate in terms of what the user will gain.

```
WRONG: "You cannot see balances on your accounts"
WRONG: "Payments can only be sent to merchants"
WRONG: Red warning icons on a newly registered user's screen

RIGHT: "Complete registration to unlock full balances"
RIGHT: "Link your bank account to start sending payments to anyone"
RIGHT: Progress bar showing 10% completion with reward list below
```

The Zeigarnik Effect: showing 10% progress motivates completion more than
showing a list of restrictions. Use this deliberately.

### 3. Dopamine loop design

Every completed action must provide immediate positive feedback.

Sequence: action → visual confirmation → reward signal → next goal revealed

- Completed steps: green indicator + checkmark
- Progress bar transitions to 100% with celebration state
- Next goal revealed only after current goal is achieved (Dynamic Contextual Unlocking)
- Never show all steps at once if steps are sequential — show the next step only

---

## Onboarding design rules

### Progressive disclosure in onboarding

Onboarding has exactly ONE primary action visible at any time.
Secondary actions are grayed out or hidden until prerequisites are met.

```
Phase 1: Only "Link Your First Bank Account" is actionable
Phase 2: After bank linked → "Enter Personal Details" becomes actionable
Phase 3: After details entered → "Verify Identity" becomes actionable
Phase 4: After all steps → "Set Primary Account" is revealed (hidden until now)
```

### Reward-based completion screen

When onboarding is complete:
- Show ALL completed steps with green indicators simultaneously
- Display the full list of unlocked benefits (positive framing)
- Never end onboarding on a neutral or ambiguous screen

### Cognitive load rules

- Max 3 onboarding steps visible at once
- Each step has exactly one action button
- Never show two CTAs of equal visual weight on the same screen
- Primary CTA: **Mo.one blue** (`#3b82f6` dark / `#2563eb` light) — full width, prominent
- Secondary actions: text links, never buttons

---

## Navigation architecture (Super App)

### The 5-function navigation model

Super App navigation must be broken into exactly 5 distinct functions
to distribute cognitive load. Mixing functions in navigation = confusion.

For Mo.one App:
```
Home     — personalized overview, contextual actions
Activity — transaction history, statements
Services — all available miniApps and services
Chat     — social layer (Díky tobě, Stories)
Profile  — settings, identity, loyalty tier
```

### Visual hierarchy in navigation

- Stardust points: highlighted with color distinction from other nav elements
- Active tab: clearly differentiated (fill or accent, not just underline)
- Notification badges: only for actionable items, never decorative

### Progressive disclosure in navigation

Home shows max 4 "Services for you" (personalized, not static).
Full catalog lives in Services tab.
Never crowd all services onto the home screen.

---

## Gamification design rules

### Stardust — from numbers to narrative

Stardust points must never be presented as just a number.
They are a story the user is living.

```
WRONG: "You have 130 points"
RIGHT: "130 Stars collected · 370 stars until Explorer Planet"
```

Every Stardust interaction has three layers:
1. Immediate reward — points earned (+10, +40), shown at moment of action
2. Progress context — where they are in their constellation journey
3. Next goal — specific, achievable, one step ahead

### Challenge card design (Stardust Widgets)

- Badge: DAILY TASK or WEEKLY GOAL (amber/blue respectively)
- Challenge name: large, bold, 2 words max
- Description: one line, action-oriented ("Make any payment today")
- Progress: X/N format + progress bar
- Reward: +N prominent, bottom left

### Constellation Map

The Stardust detail page is a journey, not a dashboard.
- Show current constellation with visual progress
- Show next milestone goal prominently
- Tabs: Daily / Weekly / All Time
- Completed challenges: always visible with green indicator
- Uncompleted challenges: always visible with neutral state

### Gamified Narrative principle

Metaphors like "Constellations" and "Explorer Planet" foster emotional investment.
This is the retention mechanism, not decoration.
Never reduce gamification to plain numbers in any UI copy.

---

## Social Finance design rules

Financial transactions are social interactions, not cold utility.

- Payment confirmations include social context
- "Díky tobě" tipping is a social moment, not a form
- Stories are peer activity, not marketing — keep them authentic
- Chat is a first-class navigation item, not buried in Settings

---

## Component-level rules

### Color usage — DUAL-COLOR SEMANTIC SYSTEM

Mo.one filosofie: **"PREMIUM pro každého"**. Modrá = akce/důvěra. Zelená = odměna/empowerment.

**🔵 Blue — interakce a akce (primary)**
- Všechny klikatelné elementy: buttons, links, aktivní nav položky
- In-progress stavy, aktuálně probíhající procesy
- RACI Responsible (přiřazená akce), certifikace (požadavek k akci)
- Chart linky pro data na která reagujeme (historical, trend)

**🟢 Green (reward) — earned, splněno, odměna**
- Příchozí platba, příjem na účet
- KPI achievement ≥ 100% (splněno/překročeno)
- Completed checkmarks, dokončené kroky onboardingu
- Opportunities v SWOT (potenciál = budoucí reward)
- Scale/growth fáze produktu (úspěch = earned)
- Stardust earned (+X stardust), reward milestone

**🔴 Red — POUZE chyby a destrukce**
- Nikdy pro informační stavy nového uživatele
- Nikdy jako CTA barva

**🟡 Amber/yellow — upozornění a Stardust milestone**

### Button hierarchy

```
Level 1 — Primary CTA:  blue (bg-primary text-primary-foreground), full width, 48px, one per screen
Level 2 — Secondary:    outlined (border-border, transparent bg), same width, use sparingly
Level 3 — Tertiary:     text link, no border, non-critical actions
```

Never use two Level 1 buttons on the same screen.
Never use red for a CTA.

### Available Funds section

- Balance: large, prominent, always visible when account is connected
- Action buttons (Pay Me, Payment): large enough to tap with thumb
- When account not connected: show placeholder with single CTA to connect

---

## Anti-patterns — never do these

```
WRONG: Red warning block as the first thing a new user sees
WRONG: List of "you cannot" restrictions on the overview screen
WRONG: Two equal-weight CTAs fighting for attention
WRONG: "No primary account set" shown before bank account is linked
WRONG: Stardust as a plain number with no narrative context
WRONG: Crowding all services onto the home screen
WRONG: Navigation items without clear, distinct functions
WRONG: Hiding completed onboarding steps after completion
WRONG: Progress bar at 0% with no encouragement copy
```

---

## Design review checklist

Before shipping any screen:

- [ ] Does the screen show only what the user can currently do?
- [ ] Is every message framed positively (gain, not lose)?
- [ ] Is there exactly ONE primary CTA?
- [ ] If progress indicator exists, does it start above 0% or show encouragement?
- [ ] Are completed actions visually confirmed (green, checkmark)?
- [ ] Is the next goal clearly visible after task completion?
- [ ] Is Stardust presented as narrative, not just a number?
- [ ] Does the navigation follow the 5-function model?
- [ ] Are services progressively disclosed?
- [ ] Is red used ONLY for errors and destructive actions?
