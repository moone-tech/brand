// client/src/modules/ci/data.ts
// Corporate Identity data model — brand guidelines for Mo.one holding.

export interface CiValue {
  num: string
  title: string
  desc: string
}

export interface VoiceExample {
  bad: string
  good: string
}

export interface ColorToken {
  name: string
  hex: string
  role: string
}

export interface TypographySpec {
  name: string
  family: string
  size: string
  weight: string
  usage: string
  sample: string
}

export interface RadiusToken {
  name: string
  px: number
  usage: string
}

export interface CiEntity {
  name: string
  sub: string
  color: string
  desc: string
  products: string[]
}

export const VALUES: CiValue[] = [
  { num: '01', title: 'Jasnost nad vším', desc: 'Říkáme pravdu — zákazníkovi, investorovi i ČNB. Složitost nevysvětluje, jasnost buduje důvěru. Apple standard: pokud to neumíš říct jednoduše, nerozumíš tomu dost.' },
  { num: '02', title: 'Zákazník jako partner', desc: 'Ne uživatel, ne spotřebitel. Partner. Rozhodujeme s ním, ne za něj. Každá funkce musí mít odpověď na otázku: kdo z toho profituje zákazník?' },
  { num: '03', title: 'Regulace jako výhoda', desc: 'PSD2 licence není omezení — je to moat. Jiní hráči regulaci obcházejí, my ji vítáme. Compliance je součást produktu, ne vedlejší náklad.' },
  { num: '04', title: 'Systémové myšlení', desc: 'Neoptimalizujeme jeden prvek. Optimalizujeme celek. Každé rozhodnutí se ptá: jak to ovlivní ostatní části ekosystému? Braun princip: méně, ale lépe.' },
  { num: '05', title: 'Autenticita Hunterů', desc: 'Legi.one síť je lidský kapitál, ne distribuční kanál. Respektujeme autonomii franšízantů. Budujeme s nimi, ne přes ně.' },
  { num: '06', title: 'Dlouhodobé myšlení', desc: 'Tomáš Baťa: „Sloužiti lidem znamená dobro jim přinášeti." Rozhodujeme pro rok 2030, ne pro příští čtvrtletí. Stablecoin CZKT je investice do dekády.' },
]

export const VOICE_EXAMPLES: VoiceExample[] = [
  { bad: 'Váš účet je v omezeném Lite módu. Nemohou být zobrazeny zůstatky. Doplňte registraci.', good: 'Vítejte! Jste pár kroků od plného Mo.one. Propojte účet a odemkněte vše.' },
  { bad: 'Transakce byla úspěšně provedena a vypořádání proběhne v souladu s nastavením.', good: 'Hotovo. 350 Kč letí k Ondřejovi — dorazí za pár sekund.' },
  { bad: 'Systém byl dočasně nedostupný z důvodu plánované údržby infrastruktury.', good: 'Dáváme si chvilku. Vrátíme se za 10 minut — slibujeme.' },
]

export const COLORS: Record<string, ColorToken[]> = {
  action: [
    { name: 'Mo.one Blue (dark)',  hex: '#3b82f6', role: 'Primární akce, CTA, aktivní navigace — dark mode' },
    { name: 'Mo.one Blue (light)', hex: '#2563eb', role: 'Primární akce, CTA, aktivní navigace — light mode' },
    { name: 'Blue Hover',          hex: '#1d4ed8', role: 'Hover, pressed states' },
    { name: 'Blue Glow',           hex: 'rgba(59,130,246,0.1)', role: 'Active state fills, focus rings' },
  ],
  reward: [
    { name: 'Reward Green (dark)',  hex: '#4ade80', role: 'Odměna, příchozí platba, KPI splněno, úspěch — dark mode' },
    { name: 'Reward Green (light)', hex: '#16a34a', role: 'Odměna, příchozí platba, KPI splněno, úspěch — light mode' },
    { name: 'Green Glow',           hex: 'rgba(74,222,128,0.07)', role: 'Success backgrounds, earned states' },
  ],
  neutral: [
    { name: 'Black',    hex: '#0f0f0f', role: 'Page background (dark-first)' },
    { name: 'Surface',  hex: '#171717', role: 'Cards, panels' },
    { name: 'Elevated', hex: '#1f1f1f', role: 'Modals, popovers' },
    { name: 'Border',   hex: '#262626', role: 'Borders, dividers' },
    { name: 'Muted',    hex: '#737373', role: 'Secondary text, placeholders' },
    { name: 'White',    hex: '#ffffff', role: 'Primary text, logo, headings' },
  ],
  semantic: [
    { name: 'Reward',   hex: '#4ade80', role: 'Earned, success, completed — POUZE pro odměny a výsledky' },
    { name: 'Warning',  hex: '#f59e0b', role: 'Attention, Stardust reward milestones' },
    { name: 'Danger',   hex: '#ef4444', role: 'Chyba, destruktivní akce — NIKDE JINDE' },
    { name: 'Info',     hex: '#a78bfa', role: 'Informační, CZKT stablecoin brand' },
  ],
  entities: [
    { name: 'Legi.one', hex: '#7c3aed', role: 'Terminal & franchise brand' },
    { name: 'Hub / DS', hex: '#0891b2', role: 'SaaS platform brand' },
    { name: 'CZKT',     hex: '#059669', role: 'Stablecoin brand' },
  ],
}

export const COLOR_SECTIONS: { label: string; key: keyof typeof COLORS }[] = [
  { label: 'Akční barva — modrá (interakce)', key: 'action' },
  { label: 'Reward barva — zelená (odměna)', key: 'reward' },
  { label: 'Neutrální škála', key: 'neutral' },
  { label: 'Sémantické barvy', key: 'semantic' },
  { label: 'Entity barvy', key: 'entities' },
]

export const TYPOGRAPHY: TypographySpec[] = [
  { name: 'Display 1', family: 'Figtree', size: '56px', weight: '700', usage: 'Hero headlines',            sample: 'PREMIUM pro každého' },
  { name: 'Display 2', family: 'Figtree', size: '40px', weight: '600', usage: 'Section headlines',         sample: 'Platební identita' },
  { name: 'Heading 1', family: 'Figtree', size: '32px', weight: '700', usage: 'Page titles',               sample: 'Mo.one Brand Guidelines' },
  { name: 'Heading 2', family: 'Figtree', size: '24px', weight: '600', usage: 'Card titles',               sample: 'Vizuální identita' },
  { name: 'Heading 3', family: 'Figtree', size: '18px', weight: '600', usage: 'Section labels',            sample: 'Barevná paleta a typografie' },
  { name: 'Body',      family: 'Figtree', size: '16px', weight: '400', usage: 'Paragraphs',                sample: 'Mo.one ti platí za každou platbu. Přijímáš platby jako zákazník — a teď z nich těžíš i ty.' },
  { name: 'Small',     family: 'Figtree', size: '13px', weight: '400', usage: 'Captions, helper text',     sample: 'Poslední aktualizace: 4. dubna 2026' },
  { name: 'Label',     family: 'Figtree', size: '11px', weight: '700', usage: 'Category labels, UI meta',  sample: 'BRAND CORE — 01' },
]

export const SPACING_SCALE: number[] = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96]

export const RADII: RadiusToken[] = [
  { name: 'sm',   px: 6,    usage: 'Buttons, chips, badges' },
  { name: 'md',   px: 12,   usage: 'Cards, inputs, tooltips' },
  { name: 'lg',   px: 20,   usage: 'Panels, sheets' },
  { name: 'xl',   px: 32,   usage: 'Modals, hero cards' },
  { name: 'full', px: 9999, usage: 'Pills, avatars' },
]

export const ENTITIES: CiEntity[] = [
  {
    name: 'Mo.one a.s.',
    sub: 'Platební infrastruktura',
    color: '#4ade80',
    desc: 'Mateřská holding s PSD2 licencí ČNB (AIS+PIS). A2A platební infrastruktura pro celou EU. Primární brand.',
    products: ['Mo.one App', 'A2A platby', 'Virtuální účty', 'Stardust loyalty'],
  },
  {
    name: 'Legi.one',
    sub: 'Distribuce & terminály',
    color: '#7c3aed',
    desc: 'Franšízová distribuční síť Hunterů. POS terminály, karetní infrastruktura. Sub-brand s vlastní barvou.',
    products: ['POS terminály N92/P300/N62', 'Hunter síť', 'Franšízový program'],
  },
  {
    name: 'Mo.one Digital Services',
    sub: 'Hub & SaaS platforma',
    color: '#0891b2',
    desc: 'Operátor Hub SuperAppu. Stories Engine, Marketplace, Chat, SimplePOS. B2B SaaS vrstva.',
    products: ['Hub platform', 'MiniApps', 'Stories Engine', 'SimplePOS'],
  },
  {
    name: 'Koruna CZKT',
    sub: 'Stablecoin — launch 2027',
    color: '#059669',
    desc: 'CZK-pegged stablecoin pro platební ekosystém. Největší příjmový potenciál holdingu dle finančních modelů.',
    products: ['CZKT token', 'Segregované účty', 'EU stablecoin licence'],
  },
]
