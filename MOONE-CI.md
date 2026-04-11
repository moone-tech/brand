# Mo.one Corporate Identity — Single Source of Truth

> **Verze:** 1.0 · Duben 2026
> **Platí pro:** Všechny x.mo.one aplikace (brand, brain, hub, hunter, app)
> **Archetyp:** Vládce infrastruktury + Mág ekosystému
> **Filozofie:** Tesla precision. Braun purism. Dark-first. PREMIUM pro každého.

Tento soubor je kompletní CI reference. Přidej ho do rootu projektu a sdílej při vývoji, aby každý systém v ekosystému měl identický vizuální jazyk.

---

## 1. Kotva a Jiskra — Dva režimy identity

Mo.one provozuje dvě vizuální identity paralelně:

| | Kotva (Standard CI) | Jiskra (Event CI) |
|---|---|---|
| **Podíl** | 95 % času | 5 % času |
| **Cíl** | Důvěra, prémiovost, rozpoznatelnost | Hype, emoce, virální dosah |
| **Barvy** | Monochromatic + #2563EB blue | Neon, 3D, sezónní |
| **Styl** | Geometrický purismus, Dieter Rams | Extravagantní, texturovaný |
| **Příklad** | UI, onboarding, transakce | Country launch, milestone, merch |
| **Životnost** | Desítky let — Timeless | Dny až týdny — Efemérní |

**Pravidlo:** Pokud navrhované UI vyžaduje mascot, hlasitý banner nebo kýčovitou grafiku jako standardní stav — je to narušení archetypu. Přesunout do Jiskry nebo odstranit.

---

## 2. Barvy — Sémantický systém

### Kritické pravidlo: Modrá = akce. Zelená = odměna. NIKDY naopak.

```
Modrá (--primary)     → CTA, interakce, aktivní nav, in-progress
Zelená (--reward)     → odměna, earned, success, splněno — NIKDE JINDE
Červená (--destructive) → chyba, destruktivní akce POUZE
Žlutá (--warning)     → upozornění (ne chyba, ne odměna)
```

### Light theme

```css
--background:    #f5f5f5;   /* Tesla light gray */
--surface:       #ffffff;   /* White cards */
--elevated:      #ededed;   /* Secondary surface */
--border:        #d9d9d9;   /* Thin border */
--text:          #141414;   /* Near-black */
--muted:         #757575;   /* Muted text */

--primary:       #2563eb;   /* Action blue */
--primary-fg:    #ffffff;
--reward:        #16a34a;   /* Earned/success */
--reward-fg:     #ffffff;
--destructive:   #dc2626;   /* Errors only */
--warning:       #f59e0b;
```

### Dark theme (primary — dark-first design)

```css
--background:    #0d0d0d;   /* Near-black */
--surface:       #141414;   /* Card bg */
--elevated:      #1c1c1c;   /* Secondary surface */
--border:        #242424;   /* Subtle divider */
--text:          #fafafa;   /* White text */
--muted:         #6b6b6b;   /* Muted text */

--primary:       #3b82f6;   /* Action blue */
--primary-fg:    #ffffff;
--reward:        #4ade80;   /* Earned/success */
--reward-fg:     #052e16;
--destructive:   #ef4444;   /* Errors only */
--warning:       #f59e0b;
```

### Entity barvy

```
Mo.one a.s.             #4ade80 (green)  — Holding, platby
Legi.one                #7c3aed (violet) — Terminály, Hunterové
Mo.one Digital Services #0891b2 (cyan)   — Hub, SaaS
Koruna CZKT             #059669 (emerald) — Stablecoin
```

### Akční barva — stavy

```
Default:   #3b82f6 (dark) / #2563eb (light)
Hover:     #1d4ed8
Pressed:   #1e40af
Glow fill: rgba(59, 130, 246, 0.1)
```

---

## 3. Typografie

### Font: Figtree (Google Fonts)

```html
<link href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet" />
```

### Škála

| Název | Velikost | Váha | Použití |
|---|---|---|---|
| Display 1 | 56px | 700 | Hero headlines |
| Display 2 | 40px | 600 | Section headlines |
| Heading 1 | 32px | 700 | Page titles |
| Heading 2 | 24px | 600 | Card titles |
| Heading 3 | 18px | 600 | Section labels |
| Body | 16px (15px base) | 400 | Odstavce |
| Small | 13px | 400 | Captions, helper text |
| Label | 11px | 700 | Kategorie, UI meta (UPPERCASE, tracking 0.12em) |

### Typografická pravidla

```css
body {
  font-family: "Figtree", "Inter", -apple-system, BlinkMacSystemFont, Arial, sans-serif;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.6;
  letter-spacing: -0.01em;  /* Tesla tight premium feel */
  -webkit-font-smoothing: antialiased;
}
```

- **Headlingy:** `letter-spacing: -0.02em` to `-0.03em` (tighter = premium)
- **Label-caps:** `font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: var(--muted); opacity: 0.65`
- **Čísla (finance):** `font-variant-numeric: tabular-nums` — vždy pro částky a statistiky

---

## 4. Spacing

```
4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96 px
```

Base unit: **4px**. Vše je násobek čtyřky.

---

## 5. Border Radius

| Token | Pixely | Použití |
|---|---|---|
| sm | 6px | Buttons, chips, badges |
| md | 12px | Cards, inputs, tooltips |
| lg | 20px | Panels, sheets |
| xl | 32px | Modals, hero cards |
| full | 9999px | Pills, avatary |

**Poznámka:** Radius škála je shifted -4px oproti Tailwind defaults. `rounded-xl` = 8px (ne 12px).

---

## 6. Ikony

**Systém:** [Lucide Icons](https://lucide.dev/) — konzistentní, geometrické, 24×24 grid.

**Velikosti:**
- Navigation: 18–20px
- Inline s textem: 14–16px
- Dekorace: 10–12px
- Hero/empty states: 28–48px

**NIKDY nepoužívat emoji v UI.** Žádné emoji v nadpisech, buttonech, labels, navigaci. Emoji narušují archetyp Vládce. Použij Lucide ikonu.

---

## 7. Komponenty — Vzory

### Button (primární)

```css
background: var(--primary);
color: var(--primary-fg);
padding: 10px 20px;
border-radius: 12px;        /* rounded-xl */
font-size: 14px;
font-weight: 600;
transition: opacity 150ms;
```

### Card

```css
background: var(--surface);
border: 1px solid var(--border);
border-radius: 16px;         /* rounded-2xl */
padding: 20px;
```

### Input

```css
background: var(--elevated);
border: 1px solid var(--border);
border-radius: 12px;
padding: 8px 12px;
font-size: 14px;
color: var(--text);
```
Focus: `border-color: var(--primary); outline: 2px solid var(--primary); outline-offset: 2px;`

### Badge / Chip

```css
background: color-mix(in srgb, var(--primary) 10%, transparent);
color: var(--primary);
padding: 4px 10px;
border-radius: 9999px;
font-size: 12px;
font-weight: 600;
```

### Scrollbar (dark mode)

```css
::-webkit-scrollbar            { width: 4px; height: 4px; }
::-webkit-scrollbar-track      { background: transparent; }
::-webkit-scrollbar-thumb      { background: var(--border); border-radius: 2px; }
```

---

## 8. Animace a Pohyb

```css
/* Standard entry */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fade-in 0.2s ease-out; }
```

- **Přechody:** `transition: all 150ms ease` (ne linear, ne ease-in)
- **Hover:** opacity change nebo border-color change — ne transformace
- **Loading spinner:** `border-2 border-transparent; border-top-color: var(--primary); animate-spin`
- **Žádné bounce, elastic, spring animace** v Kotva CI. Tyto patří do Jiskry.

---

## 9. Layout Principy

### Dark-first

Design vždy začíná v dark mode. Light mode je odvozený. Dark mode = firemní identita Mo.one.

### Responsive breakpointy

```
sm:  640px   — velké mobily
md:  768px   — tablety, desktop sidebar zmizí
lg:  1024px  — desktop
xl:  1280px  — wide desktop
```

### Safe areas (PWA / mobilní web)

```css
padding-top: env(safe-area-inset-top, 0px);       /* Dynamic Island / notch */
padding-bottom: env(safe-area-inset-bottom, 0px);  /* Home indicator */
```

### Max-width

Hlavní obsah: `max-width: 72rem` (1152px) s `padding: 0 1.5rem`.

---

## 10. Hlas a Tón

### Pravidla

1. **Mluv jako člověk.** Ne jako banka, ne jako startup. Jako chytrý kamarád.
2. **Používej čísla.** "Ušetřil jsi 2 340 Kč" > "Ušetřil jsi peníze."
3. **Krátké věty.** Max 2 řádky na sdělení. Pokud to nejde, rozděl.
4. **Žádný corporate speak.** Žádné "v souladu s", "na základě", "prostřednictvím".
5. **Čeština s diakritikou.** Vždy správně — "Štipák" ne "Stipak".

### Příklady

| Špatně | Dobře |
|---|---|
| Váš účet je v omezeném Lite módu. Nemohou být zobrazeny zůstatky. | Vítejte! Jste pár kroků od plného Mo.one. Propojte účet a odemkněte vše. |
| Transakce byla úspěšně provedena a vypořádání proběhne v souladu s nastavením. | Hotovo. 350 Kč letí k Ondřejovi — dorazí za pár sekund. |
| Systém byl dočasně nedostupný z důvodu plánované údržby. | Dáváme si chvilku. Vrátíme se za 10 minut — slibujeme. |

---

## 11. Brand Values

| # | Hodnota | Princip |
|---|---|---|
| 01 | Jasnost nad vším | Apple standard: pokud to neumíš říct jednoduše, nerozumíš tomu dost. |
| 02 | Zákazník jako partner | Ne uživatel, ne spotřebitel. Partner. |
| 03 | Regulace jako výhoda | PSD2 licence není omezení — je to moat. |
| 04 | Systémové myšlení | Braun princip: méně, ale lépe. |
| 05 | Autenticita Hunterů | Budujeme s nimi, ne přes ně. |
| 06 | Dlouhodobé myšlení | Rozhodujeme pro rok 2030, ne pro příští čtvrtletí. |

---

## 12. Entity Ekosystém

| Entita | Subdomain | Barva | Účel |
|---|---|---|---|
| Mo.one a.s. | brand.mo.one | #4ade80 | Holding CI, investoři, brand portal |
| Mo.one Brain | brain.mo.one | #3b82f6 | Interní wiki, knowledge base |
| Mo.one Hub | hub.mo.one | #0891b2 | SaaS platforma, SuperApp dashboard |
| Mo.one Hunter | hunter.mo.one | #7c3aed | Legi.one Hunterová síť |
| Mo.one App | app.mo.one | #3b82f6 | SuperApp pro koncové uživatele |
| Koruna CZKT | — | #059669 | Stablecoin (launch 2027) |

**Pravidlo:** Všechny x.mo.one aplikace sdílejí identický design systém (tento soubor). Liší se pouze primární entity barvou v headeru/logu. Zbytek UI — neutrální škála, typografie, spacing, radius, komponenty — je 100% identický.

---

## 13. CSS Proměnné — Kompletní sada (kopíruj do projektu)

```css
:root {
  color-scheme: light;
  --background:    #f5f5f5;
  --surface:       #ffffff;
  --elevated:      #ededed;
  --border:        #d9d9d9;
  --text:          #141414;
  --muted:         #757575;
  --primary:       #2563eb;
  --primary-fg:    #ffffff;
  --reward:        #16a34a;
  --reward-fg:     #ffffff;
  --destructive:   #dc2626;
  --warning:       #f59e0b;
}

.dark {
  color-scheme: dark;
  --background:    #0d0d0d;
  --surface:       #141414;
  --elevated:      #1c1c1c;
  --border:        #242424;
  --text:          #fafafa;
  --muted:         #6b6b6b;
  --primary:       #3b82f6;
  --primary-fg:    #ffffff;
  --reward:        #4ade80;
  --reward-fg:     #052e16;
  --destructive:   #ef4444;
  --warning:       #f59e0b;
}
```

---

## 14. Zakázáno (NEVER DO)

- Emoji v UI (nadpisy, buttony, labels, navigace)
- Mascot nebo postavička jako standardní prvek
- Zelená pro CTA/interakci (zelená = POUZE odměna)
- Modrá pro success/earned stavy (modrá = POUZE akce)
- Bounce/spring/elastic animace v Kotva CI
- Corporate speak v microcopy
- Gradient buttony (výjimka: Jiskra event CI)
- Shadows na kartách (border-only design)
- Rounded corners > 32px na standardních komponentách
- Custom fonty (pouze Figtree)
- Stock fotky s lidmi usmívajícími se do kamery

---

## 15. Povinné (ALWAYS DO)

- Dark mode jako primární design surface
- `letter-spacing: -0.01em` na body textu
- `tabular-nums` na všechna čísla (částky, statistiky)
- Lucide ikony (ne FontAwesome, ne custom SVG)
- `antialiased` font rendering
- `border-color: var(--border)` na všech hranách
- Safe-area padding na mobilním webu / PWA
- `transition: all 150ms ease` na interaktivních prvcích
- Max 1 primární CTA na screen (eliminace decision fatigue)
- Sémantický color systém — `var(--primary)` ne `#3b82f6` natvrdo

---

*Mo.one a.s. — Design Bible v1.0 — Interní dokument*
*Udržováno na brand.mo.one/admin/ci*
