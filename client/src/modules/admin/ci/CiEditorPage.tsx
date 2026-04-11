// =============================================================================
// client/src/modules/admin/ci/CiEditorPage.tsx — CI editor (ported from Brain)
// Corporate Identity module — brand guidelines with inline editing.
// =============================================================================

import { useState, useRef, useEffect, createContext, useContext } from 'react'
import { createPortal } from 'react-dom'
import { Pencil, Check, RotateCcw, Target, Lightbulb, Zap, Handshake, CreditCard, Smartphone, Store, Star, Monitor, Presentation, Printer, Megaphone, Mail, ShoppingBag, MessageCircle, Gift, MapPin, Wallet, ArrowLeftRight, Users, FileText, User, MoreHorizontal, Bell, Search as SearchIcon, ChevronLeft, ChevronDown, Home as HomeIcon, Play, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import {
  VALUES, VOICE_EXAMPLES, COLORS, COLOR_SECTIONS,
  TYPOGRAPHY, SPACING_SCALE, RADII, ENTITIES,
  type CiValue, type VoiceExample,
} from './data'
import { useCiStore } from './useCiStore'
import { useTranslation } from '@/lib/i18n'
import { ExperimentalSection } from './ExperimentalSection'
import { UxFlowSection } from './UxFlowSection'

type Section =
  | 'mission' | 'values' | 'positioning' | 'voice' | 'microcopy'
  | 'logo' | 'colors' | 'typography' | 'iconography'
  | 'spacing' | 'motion' | 'components' | 'imagery'
  | 'superapp' | 'entities' | 'applications'
  | 'experimental'
  | 'uxflows'

function copyHex(hex: string) {
  navigator.clipboard.writeText(hex).catch(() => undefined)
}

// ── Primitives ────────────────────────────────────────────────────
function SectionHeader({ eyebrow, title, desc }: { eyebrow: string; title: string; desc: string }) {
  return (
    <div className="mb-8 pb-5 border-b border-border">
      <p className="label-caps mb-2">{eyebrow}</p>
      <h1 className="text-2xl font-semibold mb-2">{title}</h1>
      <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">{desc}</p>
    </div>
  )
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('border border-border bg-card rounded p-5', className)}>{children}</div>
}

function CardLabel({ children }: { children: React.ReactNode }) {
  return <p className="label-caps mb-3">{children}</p>
}

// ── Editable field ────────────────────────────────────────────────
interface EditableProps {
  value: string
  onChange: (v: string) => void
  editMode: boolean
  className?: string
  multiline?: boolean
  large?: boolean
}

function Editable({ value, onChange, editMode, className, multiline, large }: EditableProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current && ref.current.textContent !== value) {
      ref.current.textContent = value
    }
  }, [value, editMode])

  if (!editMode) {
    return <p className={cn(large ? 'text-lg font-semibold leading-snug' : 'text-sm text-muted-foreground leading-relaxed', className)}>{value}</p>
  }

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => onChange(e.currentTarget.textContent ?? '')}
      className={cn(
        'outline-none rounded-lg border border-primary/40 bg-primary/5 px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all cursor-text min-h-[2rem]',
        large ? 'text-lg font-semibold leading-snug' : 'text-sm text-muted-foreground leading-relaxed',
        multiline && 'whitespace-pre-wrap',
        className,
      )}
    />
  )
}

// ── Sections ──────────────────────────────────────────────────────
interface SectionProps { editMode: boolean; data: ReturnType<typeof useCiStore>['data']; save: ReturnType<typeof useCiStore>['save'] }

function MissionSection({ editMode, data, save }: SectionProps) {
  return (
    <div>
      <SectionHeader eyebrow="Brand Core — 01" title="Mise & vize" desc="Proč Mo.one existuje, kam směřuje a co nikdy neobětuje." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        <Card>
          <CardLabel>Mise — proč existujeme</CardLabel>
          <div className="mb-3">
            <Editable large value={data.missionOne} onChange={(v) => save({ missionOne: v })} editMode={editMode} />
          </div>
          <Editable value={data.missionFull} onChange={(v) => save({ missionFull: v })} editMode={editMode} multiline />
        </Card>
        <Card>
          <CardLabel>Vize — kde chceme být</CardLabel>
          <div className="mb-3">
            <Editable large value={data.visionOne} onChange={(v) => save({ visionOne: v })} editMode={editMode} />
          </div>
          <Editable value={data.visionFull} onChange={(v) => save({ visionFull: v })} editMode={editMode} multiline />
        </Card>
      </div>
      <Card className="mb-5">
        <CardLabel>Brand Promise</CardLabel>
        <Editable large value={data.brandPromise} onChange={(v) => save({ brandPromise: v })} editMode={editMode} />
      </Card>
      <Card>
        <CardLabel>Kontext a diferenciace</CardLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <div className="text-xs font-semibold mb-2">Co Mo.one NENÍ</div>
            <p className="text-sm text-muted-foreground leading-relaxed">Nejsme banka. Nejsme platební brána. Nejsme věrnostní program přidaný na konec. Jsme první SuperApp Payment Ecosystem, který obrací logiku trhu — zákazník platí a vydělává zároveň. Nová kategorie: PREMIUM pro každého.</p>
          </div>
          <div>
            <div className="text-xs font-semibold mb-2">Naše neférová výhoda</div>
            <p className="text-sm text-muted-foreground leading-relaxed">PSD2 licence od ČNB s EU passportem. Hunter síť s nulovým CAC. Stablecoin CZKT jako nadcházející vrstva. A reward flywheel — čím více zákazníků platí, tím více vydělávají, tím méně odcházejí. Tuto kombinaci nelze zkopírovat.</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

function ValuesSection({ editMode, data, save }: SectionProps) {
  function updateValue(idx: number, patch: Partial<CiValue>) {
    const next = data.values.map((v, i) => (i === idx ? { ...v, ...patch } : v))
    save({ values: next })
  }
  return (
    <div>
      <SectionHeader eyebrow="Brand Core — 02" title="Firemní hodnoty" desc="Šest principů, které nikdy neobětujeme." />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {data.values.map((v, i) => (
          <div key={v.num} className="relative border border-border bg-card rounded p-5 hover:border-foreground/20 transition-colors">
            <div className="text-5xl font-light text-muted/30 leading-none mb-3 select-none">{v.num}</div>
            {editMode ? (
              <>
                <input
                  value={v.title}
                  onChange={(e) => updateValue(i, { title: e.target.value })}
                  className="font-semibold text-sm mb-2 w-full bg-primary/5 border border-primary/30 rounded px-2 py-1 outline-none focus:border-primary"
                />
                <textarea
                  value={v.desc}
                  onChange={(e) => updateValue(i, { desc: e.target.value })}
                  rows={4}
                  className="text-xs text-muted-foreground leading-relaxed w-full bg-primary/5 border border-primary/30 rounded px-2 py-1 outline-none focus:border-primary resize-none"
                />
              </>
            ) : (
              <>
                <div className="font-semibold text-sm mb-2">{v.title}</div>
                <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function PositioningSection({ editMode, data, save }: SectionProps) {
  const groups = [
    { label: 'K zákazníkům',        key: 'posCustomer'  as const },
    { label: 'K obchodníkům',       key: 'posMerchant'  as const },
    { label: 'K investorům',        key: 'posInvestor'  as const },
    { label: 'K regulátorům',       key: 'posRegulator' as const },
  ]
  return (
    <div>
      <SectionHeader eyebrow="Brand Core — 03" title="Positioning & příběh" desc="Jak se Mo.one umisťuje v hlavách zákazníků, partnerů a investorů." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {groups.map(({ label, key }) => (
          <Card key={key}>
            <CardLabel>{label}</CardLabel>
            <Editable value={data[key]} onChange={(v) => save({ [key]: v })} editMode={editMode} multiline />
          </Card>
        ))}
      </div>
      <Card>
        <CardLabel>Kategorie, kterou definujeme</CardLabel>
        <Editable value={data.category} onChange={(v) => save({ category: v })} editMode={editMode} className="text-base font-medium" />
      </Card>
    </div>
  )
}

function VoiceSection({ editMode, data, save }: SectionProps) {
  function updateVoice(idx: number, patch: Partial<VoiceExample>) {
    const next = data.voice.map((v, i) => (i === idx ? { ...v, ...patch } : v))
    save({ voice: next })
  }
  const dims = [
    { icon: <Target className="h-6 w-6" />,    label: 'Přímý',        desc: 'Bez omáčky. Říkáme co myslíme.' },
    { icon: <Lightbulb className="h-6 w-6" />, label: 'Srozumitelný', desc: 'Finančnictví bez žargonu.' },
    { icon: <Zap className="h-6 w-6" />,       label: 'Energický',    desc: 'Máme ambici. Je znát.' },
    { icon: <Handshake className="h-6 w-6" />, label: 'Lidský',       desc: 'Vykáme, respektujeme.' },
  ]
  return (
    <div>
      <SectionHeader eyebrow="Brand Core — 04" title="Hlas & tón" desc="Jak Mo.one mluví — konzistentní hlas buduje důvěru." />
      <Card className="mb-6">
        <CardLabel>Čtyři dimenze hlasu</CardLabel>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {dims.map((d) => (
            <div key={d.label} className="text-center p-4">
              <div className="flex justify-center mb-2 text-primary">{d.icon}</div>
              <div className="text-sm font-semibold mb-1">{d.label}</div>
              <div className="text-xs text-muted-foreground">{d.desc}</div>
            </div>
          ))}
        </div>
      </Card>
      <div className="text-xs font-bold tracking-wider text-muted-foreground uppercase mb-3">Příklady — špatně vs. správně</div>
      <div className="space-y-3">
        {data.voice.map((ex, i) => (
          <div key={i} className="grid grid-cols-2 rounded overflow-hidden border border-border">
            <div className="p-4 bg-background border-r border-border">
              <div className="label-caps mb-2 text-destructive">✗ Špatně</div>
              {editMode ? (
                <textarea value={ex.bad} onChange={(e) => updateVoice(i, { bad: e.target.value })} rows={3} className="text-sm w-full bg-transparent border border-red-300 rounded px-2 py-1 outline-none resize-none" />
              ) : (
                <p className="text-sm leading-relaxed">{ex.bad}</p>
              )}
            </div>
            <div className="p-4 bg-background">
              <div className="label-caps mb-2 text-reward">✓ Správně</div>
              {editMode ? (
                <textarea value={ex.good} onChange={(e) => updateVoice(i, { good: e.target.value })} rows={3} className="text-sm w-full bg-transparent border border-border rounded px-2 py-1 outline-none resize-none" />
              ) : (
                <p className="text-sm leading-relaxed">{ex.good}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function LogoSection() {
  return (
    <div>
      <SectionHeader eyebrow="Vizuální identita — 05" title="Logo systém" desc="Mo.one logo ve všech variantách. Pravidla ochranné zóny a zakázané úpravy." />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {/* White background — black wordmark */}
        <div className="rounded flex flex-col items-center justify-center gap-3 min-h-36 p-6 border border-border bg-white">
          <img src="/moone-logo-black.svg" alt="Mo.one" style={{ height: 28, width: 116 }} />
          <span className="text-xs font-semibold tracking-wider uppercase text-zinc-400">light bg</span>
        </div>
        {/* Dark background — white wordmark */}
        <div className="rounded flex flex-col items-center justify-center gap-3 min-h-36 p-6" style={{ background: '#0f0f0f' }}>
          <img src="/moone-logo-white.svg" alt="Mo.one" style={{ height: 28, width: 116 }} />
          <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: '#404040' }}>dark bg</span>
        </div>
        {/* Blue — action bg — white wordmark */}
        <div className="rounded flex flex-col items-center justify-center gap-3 min-h-36 p-6" style={{ background: '#3b82f6' }}>
          <img src="/moone-logo-white.svg" alt="Mo.one" style={{ height: 28, width: 116 }} />
          <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: 'rgba(255,255,255,.55)' }}>action blue</span>
        </div>
        {/* Reward green — black wordmark */}
        <div className="rounded flex flex-col items-center justify-center gap-3 min-h-36 p-6" style={{ background: '#4ade80' }}>
          <img src="/moone-logo-black.svg" alt="Mo.one" style={{ height: 28, width: 116 }} />
          <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: 'rgba(0,0,0,.40)' }}>reward green</span>
        </div>
        {/* Icon only — dark */}
        <div className="rounded flex flex-col items-center justify-center gap-3 min-h-36 p-6 border border-border bg-zinc-900">
          <img src="/favicon.svg" alt="Mo.one icon" className="w-12 h-12" />
          <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">icon only</span>
        </div>
        {/* Icon only — white */}
        <div className="rounded flex flex-col items-center justify-center gap-3 min-h-36 p-6 border border-border bg-white">
          <img src="/favicon.svg" alt="Mo.one icon" className="w-12 h-12" />
          <span className="text-xs font-semibold tracking-wider uppercase text-zinc-400">icon only</span>
        </div>
      </div>
      <Card>
        <CardLabel>Ochranná zóna a pravidla</CardLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <div className="text-xs font-semibold mb-2">✓ Povoleno</div>
            <ul className="text-sm text-muted-foreground space-y-1.5">
              {['Primární logo na bílém, černém, modrém nebo reward-green pozadí', 'Proporcionální zvětšení/zmenšení', 'Minimální velikost: 24px výška logotypu', 'Ochranná zóna: výška písmena „M"'].map(t => <li key={t}>→ {t}</li>)}
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold text-red-600 mb-2">✗ Zakázáno</div>
            <ul className="text-sm text-muted-foreground space-y-1.5">
              {['Změna barev ikony nebo wordmarku', 'Rotace, zkreslení nebo efekty', 'Logo na rušném fotopozadí bez podkladu', 'Přidávání tagline přímo k logu'].map(t => <li key={t}>→ {t}</li>)}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

function ColorsSection() {
  return (
    <div>
      <SectionHeader eyebrow="Vizuální identita — 06" title="Barevná paleta" desc="Klikni na barvu pro zkopírování hex kódu." />
      {COLOR_SECTIONS.map(({ label, key }) => (
        <div key={key} className="mb-8">
          <p className="label-caps mb-3">{label}</p>
          <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))' }}>
            {(COLORS[key] ?? []).map((c) => (
              <button key={c.hex} onClick={() => copyHex(c.hex)} className="rounded overflow-hidden border border-border text-left hover:border-foreground/30 transition-colors">
                <div className="h-16" style={{ background: c.hex }} />
                <div className="p-2.5 bg-card">
                  <div className="text-xs font-semibold">{c.name}</div>
                  <div className="text-xs font-mono text-muted-foreground">{c.hex}</div>
                  <div className="text-xs text-muted-foreground/70 mt-0.5 leading-tight">{c.role}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const FIGTREE = '"Figtree", "Inter", -apple-system, BlinkMacSystemFont, Arial, sans-serif'

const FIGTREE_WEIGHTS: { weight: number; label: string }[] = [
  { weight: 300, label: 'Light' },
  { weight: 400, label: 'Regular' },
  { weight: 500, label: 'Medium' },
  { weight: 600, label: 'SemiBold' },
  { weight: 700, label: 'Bold' },
  { weight: 800, label: 'ExtraBold' },
  { weight: 900, label: 'Black' },
]

function TypographySection() {
  return (
    <div>
      <SectionHeader eyebrow="Vizuální identita — 07" title="Typografie" desc='Figtree — variabilní font (300–900 + italic). Fallback: Inter → -apple-system → BlinkMacSystemFont → Arial.' />

      {/* Font stack */}
      <Card className="mb-6">
        <CardLabel>Font stack</CardLabel>
        <code className="block text-sm bg-muted/60 rounded-lg px-4 py-3 text-foreground leading-relaxed">
          font-family: "Figtree", "Inter", -apple-system, BlinkMacSystemFont, Arial, sans-serif;
        </code>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
          {[
            { name: 'Figtree', note: 'primární — Google Fonts, variabilní 300–900' },
            { name: 'Inter', note: 'fallback — stejné metriky, offline/blokováno' },
            { name: '-apple-system', note: 'San Francisco na Apple zařízeních' },
            { name: 'BlinkMacSystemFont', note: 'San Francisco v Chrome/Mac' },
            { name: 'Arial', note: 'poslední záchrana, univerzálně dostupná' },
            { name: 'sans-serif', note: 'systémový fallback' },
          ].map(({ name, note }) => (
            <div key={name} className="flex flex-col gap-0.5 p-2.5 rounded-lg bg-muted/40">
              <span className="font-semibold text-foreground" style={{ fontFamily: FIGTREE }}>{name}</span>
              <span className="leading-tight">{note}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Weight scale */}
      <Card className="mb-6">
        <CardLabel>Váhová škála — variabilní font 300–900</CardLabel>
        <div className="space-y-2">
          {FIGTREE_WEIGHTS.map(({ weight, label }) => (
            <div key={weight} className="flex items-baseline gap-4 py-1.5 border-b border-border/20 last:border-0">
              <span className="text-xs font-mono text-muted-foreground w-28 shrink-0">{weight} · {label}</span>
              <span style={{ fontFamily: FIGTREE, fontWeight: weight, fontSize: '20px', lineHeight: 1.2 }}>
                Mo.one — PREMIUM pro každého
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Type scale */}
      <p className="label-caps mb-3">Typografická škála</p>
      <div className="space-y-3">
        {TYPOGRAPHY.map((t) => (
          <div key={t.name} className="border border-border bg-card rounded p-4">
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
              <span className="font-bold">{t.name}</span>
              <span>{t.family} · {t.size} · {t.weight}</span>
              <span className="ml-auto">{t.usage}</span>
            </div>
            <div style={{ fontFamily: FIGTREE, fontSize: t.size, fontWeight: t.weight, lineHeight: 1.2 }}>
              {t.sample}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function IconographySection() {
  return (
    <div>
      <SectionHeader eyebrow="Vizuální identita — 08" title="Ikonografie" desc="Pravidla pro použití ikon v celém ekosystému Mo.one." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardLabel>UI ikony — Lucide / Material Symbols</CardLabel>
          <div className="flex flex-wrap gap-4 mb-4">
            {[{ icon: <CreditCard className="h-5 w-5" />, label: 'payment' }, { icon: <Smartphone className="h-5 w-5" />, label: 'nfc' }, { icon: <Store className="h-5 w-5" />, label: 'merchant' }, { icon: <Star className="h-5 w-5" />, label: 'stardust' }].map(({ icon, label }) => (
              <div key={label} className="text-center">
                <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center text-primary mx-auto mb-1">{icon}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">Filled style, rounded corners. Stroke weight 1.5px při 24px.</p>
        </Card>
        <Card>
          <CardLabel>Brand ikony — vlastní set</CardLabel>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">Konzistentní stroke weight 2px, rounded linecaps, grid 24×24px.</p>
          <div className="p-3 bg-primary/5 rounded-lg text-sm text-primary"><strong>Chystaný asset:</strong> Set 32 brand ikon pro Hunter Zone, POS, Stablecoin a Hub.</div>
        </Card>
      </div>
    </div>
  )
}

function SpacingSection() {
  return (
    <div>
      <SectionHeader eyebrow="Design systém — 09" title="Spacing & layout" desc="Braun princip: každý pixel musí mít důvod." />
      <Card className="mb-5">
        <CardLabel>Spacing scale — base 4px</CardLabel>
        <div className="space-y-1">
          {SPACING_SCALE.map((v) => (
            <div key={v} className="flex items-center gap-4 py-1.5 border-b border-border/20 last:border-0">
              <span className="text-xs font-mono text-muted-foreground w-12">{v}px</span>
              <div className="h-2 bg-primary/60 rounded-sm" style={{ width: Math.min(v * 3, 300) }} />
              <span className="text-xs font-mono text-muted-foreground">{v / 4}rem</span>
            </div>
          ))}
        </div>
      </Card>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardLabel>Border radius</CardLabel>
          <div className="space-y-3">
            {RADII.map((r) => (
              <div key={r.name} className="flex items-center gap-4">
                <div className="w-12 h-8 bg-primary/60 flex-shrink-0" style={{ borderRadius: Math.min(r.px, 16) }} />
                <div>
                  <div className="text-xs font-semibold">--radius-{r.name}: {r.px === 9999 ? '9999' : r.px}px</div>
                  <div className="text-xs text-muted-foreground">{r.usage}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardLabel>Breakpoints</CardLabel>
          <div className="text-sm text-muted-foreground space-y-2">
            {[{ k: 'xs', d: '< 480px' }, { k: 'sm', d: '480–768px' }, { k: 'md', d: '768–1024px' }, { k: 'lg', d: '1024–1280px' }, { k: 'xl', d: '> 1280px' }].map(({ k, d }) => (
              <div key={k}><code className="bg-muted px-1.5 py-0.5 rounded text-xs mr-2">{k}</code>{d}</div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

function MotionSection() {
  const [demoKey, setDemoKey] = useState(0)

  const easings: { label: string; bezier: string; desc: string; color: string }[] = [
    { label: 'Standard',   bezier: 'cubic-bezier(.4,0,.2,1)',      desc: 'Přechody, hover stavy, tab switch',      color: 'bg-primary' },
    { label: 'Decelerate', bezier: 'cubic-bezier(0,0,.2,1)',       desc: 'Příchod prvků, drawer open, reveal',     color: 'bg-primary' },
    { label: 'Accelerate', bezier: 'cubic-bezier(.4,0,1,1)',       desc: 'Odchod prvků, dismiss, exit',            color: 'bg-muted-foreground' },
    { label: 'Spring',     bezier: 'cubic-bezier(.34,1.56,.64,1)', desc: 'Reward moment, Stardust earned, bounce', color: 'bg-green-400' },
  ]

  const durations = [
    { token: '--dur-fast',   ms: 100, usage: 'Tap feedback, toggle, icon swap' },
    { token: '--dur-base',   ms: 200, usage: 'Hover, fade, přechod komponent' },
    { token: '--dur-slow',   ms: 350, usage: 'Page transition, sheet slide' },
    { token: '--dur-reveal', ms: 500, usage: 'Entry animace, onboarding reveal' },
  ]

  const maxMs = 500

  return (
    <div>
      <SectionHeader eyebrow="Design systém — 10" title="Motion principy" desc="Každý pohyb komunikuje stav. Spring = odměna. Standard = navigace. Respektuje prefers-reduced-motion." />

      {/* Easing demos */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Easing demonstrace — klikni na kartu nebo</div>
        <button
          onClick={() => setDemoKey(k => k + 1)}
          className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors px-3 py-1.5 rounded-lg border border-primary/30 hover:bg-primary/5"
        >
          ↺ Přehrát vše
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {easings.map(({ label, bezier, desc, color }) => (
          <div
            key={label}
            className="border border-border bg-card rounded p-4 cursor-pointer hover:border-foreground/20 transition-colors"
            onClick={() => setDemoKey(k => k + 1)}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm font-semibold">{label}</div>
            </div>
            <div className="text-xs text-muted-foreground mb-4 leading-relaxed">{desc}</div>
            {/* Track */}
            <div className="h-10 rounded-lg bg-muted/40 relative overflow-hidden mb-3">
              <div
                key={`${label}-${demoKey}`}
                className={cn('absolute top-1 h-8 w-8 rounded-full', color)}
                style={{ animation: `ci-slide 800ms ${bezier} forwards` }}
              />
            </div>
            <code className="text-xs font-mono text-muted-foreground">{bezier}</code>
          </div>
        ))}
      </div>

      {/* Duration tokens */}
      <p className="label-caps mb-3">Duration tokeny</p>
      <Card className="mb-6">
        <div className="space-y-4">
          {durations.map(({ token, ms, usage }) => (
            <div key={token} className="flex items-center gap-4">
              <code className="text-xs font-mono text-primary w-32 shrink-0">{token}</code>
              <div className="flex-1 h-2 bg-muted/40 rounded-full overflow-hidden">
                <div
                  key={`dur-${demoKey}`}
                  className="h-full rounded-full bg-primary/60"
                  style={{
                    animation: `ci-grow-w ${ms}ms linear forwards`,
                    '--ci-target-w': `${(ms / maxMs) * 100}%`,
                  } as React.CSSProperties}
                />
              </div>
              <span className="text-xs font-mono text-muted-foreground w-12 shrink-0 text-right">{ms}ms</span>
              <span className="text-xs text-muted-foreground flex-1">{usage}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Principles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardLabel>Principy</CardLabel>
          <ul className="text-sm text-muted-foreground space-y-1.5">
            {['Výstup (exit) je vždy rychlejší než vstup (enter)', 'Spring easing pouze pro reward/úspěch momenty', 'Scroll-triggered: threshold 20% viditelnosti', 'Respektuje prefers-reduced-motion — žádné animace if set'].map(t => <li key={t}>→ {t}</li>)}
          </ul>
        </Card>
        <Card>
          <CardLabel>Kdy NEANIMOVAT</CardLabel>
          <ul className="text-sm text-muted-foreground space-y-1.5">
            {['Chybové stavy — okamžitě viditelné, bez delay', 'Loading spinners déle než 300ms — raději skeleton', 'Více než 2 simultánní animace na jedné obrazovce', 'Pohyb, který nemá sémantický důvod'].map(t => <li key={t}>✗ {t}</li>)}
          </ul>
        </Card>
      </div>
    </div>
  )
}

function ImagerySection() {
  const SCENES = [
    {
      label: 'Ranní platba — kavárna',
      prompt: 'Editorial product photography, customer paying with phone at morning café counter, barista in background, morning light, dark moody tone, subtle green reward accent, –ar 16:9 –style raw',
      // Photo by Nathan Dumlao — barista / café counter
      img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=450&fit=crop&q=80',
    },
    {
      label: 'Obchodník u terminálu — večer',
      prompt: 'Editorial product photography, merchant at contactless POS terminal evening grocery store, warm interior light, dark moody tone, subtle green reward accent, –ar 16:9 –style raw',
      // Photo — contactless card payment at POS terminal
      img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=450&fit=crop&q=80',
    },
    {
      label: 'Restaurace — stůl, platba',
      prompt: 'Editorial product photography, hands paying at restaurant table with phone NFC, candlelight ambiance, dark moody tone, subtle green reward accent, –ar 16:9 –style raw',
      // Photo — restaurant dining table, warm ambiance
      img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=450&fit=crop&q=80',
    },
    {
      label: 'Mobilní balance — detail',
      prompt: 'Editorial product photography, hands holding smartphone showing payment balance screen, dark background, morning light, dark moody tone, subtle green reward accent, –ar 16:9 –style raw',
      // Photo — hands holding smartphone with app screen
      img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=450&fit=crop&q=80',
    },
  ]

  return (
    <div>
      <SectionHeader eyebrow="Design systém — 11" title="Fotografický styl" desc="Vizuální jazyk Mo.one: reální lidé, reálné momenty. Tmavý, kontrastní, s jemným zeleným akcentem odměny." />

      {/* Treatment spec */}
      <Card className="mb-6">
        <CardLabel>CSS treatment — jak aplikovat brand styl na fotky</CardLabel>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <div className="text-xs font-semibold mb-1">CSS filter</div>
            <code className="text-xs font-mono text-primary block bg-muted/60 rounded-lg p-3 leading-relaxed">
              {'filter: contrast(1.15)\n  saturate(0.55)\n  brightness(0.72);'}
            </code>
          </div>
          <div>
            <div className="text-xs font-semibold mb-1">Dark overlay</div>
            <code className="text-xs font-mono text-primary block bg-muted/60 rounded-lg p-3 leading-relaxed">
              {'background: linear-gradient(\n  to bottom,\n  rgba(0,0,0,.15),\n  rgba(0,0,0,.55)\n);'}
            </code>
          </div>
          <div>
            <div className="text-xs font-semibold mb-1">Green reward accent</div>
            <code className="text-xs font-mono text-primary block bg-muted/60 rounded-lg p-3 leading-relaxed">
              {'background: linear-gradient(\n  to top right,\n  rgba(74,222,128,.07),\n  transparent\n);'}
            </code>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Všechny tři vrstvy se skládají: filter na img tagu, dva overlay divy (position: absolute, inset-0) nad obrázkem.</p>
      </Card>

      {/* Photo grid */}
      <p className="label-caps mb-3">Scény — ukázky s aplikovaným treatment</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {SCENES.map(({ label, prompt, img }) => (
          <div key={img} className="rounded overflow-hidden border border-border">
            {/* Image with treatment */}
            <div className="relative aspect-video bg-zinc-900">
              <img
                src={img}
                alt={label}
                className="w-full h-full object-cover"
                style={{ filter: 'contrast(1.15) saturate(0.55) brightness(0.72)' }}
              />
              {/* Dark overlay */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,.15), rgba(0,0,0,.55))' }} />
              {/* Green reward accent */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top right, rgba(74,222,128,.07), transparent)' }} />
              {/* Label */}
              <div className="absolute bottom-3 left-4 text-white text-sm font-semibold drop-shadow">{label}</div>
            </div>
            {/* Prompt */}
            <div className="p-4 bg-card">
              <p className="label-caps mb-1.5">Prompt</p>
              <p className="text-xs font-mono text-muted-foreground leading-relaxed">{prompt}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Style rules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardLabel>Fotografický styl — pravidla</CardLabel>
          <ul className="text-sm text-muted-foreground space-y-1.5">
            {[
              'Reální lidé, autentické momenty — žádné pózování',
              'Perspektiva zákazníka nebo obchodníka, ne produktu',
              'Teplé interiérové světlo + dark moody post-processing',
              'Jemný zelený accent v rohu — reward konotace',
              'Horizontální formát 16:9 pro hero a cover images',
            ].map(t => <li key={t}>→ {t}</li>)}
          </ul>
        </Card>
        <Card>
          <CardLabel>Co nikdy nepoužíváme</CardLabel>
          <ul className="text-sm text-muted-foreground space-y-1.5">
            {[
              'Stock fotografie s vynucenými úsměvy a handshaky',
              'Gradientní pozadí fialová→růžová (generic fintech)',
              'Floating crypto coins a blockchain ikony',
              'Světlé, oversaturated fotky bez postprocessingu',
              'Fotky s viditelným logem konkurence (Visa, MC, Stripe)',
            ].map(t => <li key={t}>✗ {t}</li>)}
          </ul>
        </Card>
      </div>
    </div>
  )
}

function ComponentsSection() {
  return (
    <div>
      <SectionHeader eyebrow="Design systém — 12" title="Komponenty" desc="Základní UI stavební bloky v Mo.one design language. Modrá = akce. Zelená = odměna/stav." />

      {/* Buttons */}
      <Card className="mb-5">
        <CardLabel>Tlačítka — hierarchie</CardLabel>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <button className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">Zaplatit 350 Kč</button>
            <button className="px-5 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors">Zrušit</button>
            <button className="px-5 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Přeskočit</button>
            <button className="px-5 py-2.5 rounded-xl bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors">Potvrdit</button>
          </div>
          <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground text-center">
            <div>Level 1 — Primary<br/><span className="text-primary">bg-primary</span></div>
            <div>Level 2 — Secondary<br/><span className="text-foreground">border-border</span></div>
            <div>Level 3 — Ghost<br/><span>text-muted</span></div>
            <div>Level 4 — Subtle<br/><span className="text-primary">bg-primary/10</span></div>
          </div>
          <div className="p-3 rounded-lg bg-muted/40 text-xs text-muted-foreground">
            <strong className="text-foreground">Pravidlo:</strong> Max 1× Level 1 na obrazovce. Level 3+ pro sekundární akce. Nikdy červené CTA.
          </div>
        </div>
      </Card>

      {/* Badges */}
      <Card className="mb-5">
        <CardLabel>Badges — sémantické použití</CardLabel>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">Probíhá</span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-reward/10 text-reward border border-reward/20">+50 Stardust</span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-reward/10 text-reward border border-reward/20">✓ Splněno</span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">Čeká na potvrzení</span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">Platba zamítnuta</span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground">Plánováno</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
            {[
              { color: 'text-blue-400', label: 'Modrá', usage: 'Akce, in-progress, aktivní' },
              { color: 'text-green-400', label: 'Zelená', usage: 'Earned, reward, splněno' },
              { color: 'text-amber-400', label: 'Amber', usage: 'Čeká, upozornění, Stardust' },
              { color: 'text-red-400', label: 'Červená', usage: 'Chyba, zamítnuto — nic jiného' },
              { color: 'text-muted-foreground', label: 'Šedá', usage: 'Disabled, plánováno, locked' },
            ].map(({ color, label, usage }) => (
              <div key={label} className="flex items-center gap-2">
                <div className={cn('w-2 h-2 rounded-full bg-current', color)} />
                <span><strong className="text-foreground">{label}:</strong> {usage}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Transaction card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        <Card>
          <CardLabel>Transakční karta — příchozí platba</CardLabel>
          <div className="border border-border bg-background rounded p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-muted-foreground">Příchozí platba</div>
              <span className="text-xs font-medium text-reward">✓ Přijato</span>
            </div>
            <div className="text-2xl font-semibold text-reward mb-1">+350 Kč</div>
            <div className="text-sm text-muted-foreground">Od: Ondřej Novák</div>
            <div className="text-xs text-muted-foreground mt-1">Dnes 14:32 · #1X831S</div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-reward">
              <span>+25 Stardust earned</span>
            </div>
          </div>
        </Card>
        <Card>
          <CardLabel>Transakční karta — odchozí platba</CardLabel>
          <div className="border border-border bg-card rounded p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-muted-foreground">Odchozí platba</div>
              <span className="text-xs font-medium text-primary">Odesláno</span>
            </div>
            <div className="text-2xl font-semibold mb-1">−890 Kč</div>
            <div className="text-sm text-muted-foreground">Restaurace U Nováků</div>
            <div className="text-xs text-muted-foreground mt-1">Dnes 12:15 · #1X830A</div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-reward">
              <span>+50 Stardust earned</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Input */}
      <Card>
        <CardLabel>Form elementy</CardLabel>
        <div className="space-y-3 max-w-sm">
          <div>
            <label className="text-xs font-semibold mb-1.5 block">Částka</label>
            <div className="flex items-center gap-2 rounded border border-border bg-background px-3 py-2.5 focus-within:border-primary transition-colors">
              <span className="text-muted-foreground text-sm">Kč</span>
              <input defaultValue="350" className="flex-1 bg-transparent text-sm outline-none font-semibold" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold mb-1.5 block">Poznámka (volitelná)</label>
            <div className="rounded border border-border bg-background px-3 py-2.5 text-sm text-muted-foreground">
              Za večeři, díky!
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Focus ring: primary blue. Error ring: destructive red. Success: border-green s reward textem.</p>
        </div>
      </Card>
    </div>
  )
}

function MicrocopySection() {
  const patterns: { category: string; items: { context: string; bad?: string; good: string; note?: string }[] }[] = [
    {
      category: '💚 Platba úspěšná — reward moment',
      items: [
        { context: 'Push notifikace — příchozí platba', good: 'Ondřej ti poslal 350 Kč. +25 Stardust.', bad: 'Platba přijata. Částka: 350 CZK.' },
        { context: 'In-app — potvrzení odeslané platby', good: 'Hotovo. 890 Kč letí do Restaurace U Nováků — +50 Stardust za tuhle platbu.', bad: 'Transakce provedena úspěšně.' },
        { context: 'Stardust earned', good: '+50 Stardust za platbu v restauraci. Zbývá 320 do Explorer tier.', bad: 'Obdrželi jste 50 bodů věrnostního programu.' },
      ],
    },
    {
      category: '🔵 Onboarding — akce, výzva',
      items: [
        { context: 'První obrazovka', good: 'Vítejte! Propojte účet a za první platbu dostanete 100 Stardust.', bad: 'Dokončete registraci pro přístup k plné verzi.' },
        { context: 'Výzva k propojení banky', good: 'Propojte bankovní účet. Pak začnete platit — a vydělávat.', bad: 'Nejprve je nutné přidat bankovní účet.' },
        { context: 'KYC verifikace', good: 'Jeden krok zbývá. Ověřte identitu a odemkněte plné Mo.one.', bad: 'Vaše identita nebyla ověřena. Doplňte registraci.' },
      ],
    },
    {
      category: '🔴 Chyba — jen tehdy, kdy nastala',
      items: [
        { context: 'Neúspěšná platba', good: 'Platba neproběhla. Zkontrolujte zůstatek nebo zkuste znovu.', bad: 'Chyba: Transakce zamítnuta kódem ERR_402.' },
        { context: 'Výpadek systému', good: 'Dáváme si chvilku. Vrátíme se za pár minut — slibujeme.', bad: 'Systém dočasně nedostupný z důvodu plánované údržby infrastruktury.' },
      ],
    },
    {
      category: '⚡ Obecná pravidla microcopy',
      items: [
        { context: 'Délka', good: 'Max 2 věty. Jedna akce. Jeden cíl.', note: 'Každá slova navíc snižuje důvěru.' },
        { context: 'Čísla', good: '350 Kč, ne 350,00 CZK. Používáme přirozený formát.', note: 'Vykání, formální ale lidské.' },
        { context: 'Negace', good: 'Formuluj vždy pozitivně. Co uživatel ZÍSKÁ, ne co NEMŮŽE.', note: 'Zeigarnik efekt — progress motivuje.' },
      ],
    },
  ]

  return (
    <div>
      <SectionHeader eyebrow="Brand Core — 05" title="Microcopy & notifikace" desc="Jak Mo.one mluví v každém konkrétním UI kontextu. Každé slovo buduje nebo ničí důvěru." />
      <div className="space-y-6">
        {patterns.map(({ category, items }) => (
          <div key={category}>
            <div className="text-sm font-semibold mb-3">{category}</div>
            <div className="space-y-2">
              {items.map(({ context, bad, good, note }) => (
                <div key={context} className="border border-border bg-card rounded overflow-hidden">
                  <div className="px-4 py-2 bg-muted text-xs font-medium text-muted-foreground border-b border-border">{context}</div>
                  {bad && (
                    <div className="px-4 py-3 border-b border-border">
                      <div className="label-caps text-destructive mb-1">✗ Špatně</div>
                      <p className="text-sm text-muted-foreground">{bad}</p>
                    </div>
                  )}
                  <div className="px-4 py-3">
                    <div className="label-caps text-reward mb-1">✓ {bad ? 'Správně' : 'Pravidlo'}</div>
                    <p className="text-sm">{good}</p>
                    {note && <p className="text-xs text-muted-foreground mt-1 italic">{note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function EntitiesSection() {
  return (
    <div>
      <SectionHeader eyebrow="Holding — 14" title="Entity & sub-brands" desc="Čtyři entity holdingu — každá má vlastní roli, barvu a hlas." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ENTITIES.map((e) => (
          <div key={e.name} className="border border-border bg-card rounded p-5" style={{ borderTopColor: e.color, borderTopWidth: 2 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded flex items-center justify-center border border-border">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: e.color }} />
              </div>
              <div>
                <div className="font-semibold text-sm">{e.name}</div>
                <div className="text-xs text-muted-foreground">{e.sub}</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{e.desc}</p>
            <p className="label-caps mb-2">Produkty</p>
            <div className="flex flex-wrap gap-1.5">
              {e.products.map(p => <span key={p} className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: `${e.color}15`, color: e.color }}>{p}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── SuperApp UI ───────────────────────────────────────────────────

type AppScreen = 'home' | 'trziste' | 'detail' | 'chaty' | 'chat' | 'payment-create' | 'contacts' | 'story'
type DeviceType = 'iphone' | 'samsung'
type AppTheme = 'dark' | 'light'

interface AT {
  bg: string; surf: string; bord: string; text: string; muted: string; sub: string; inp: string; isDark: boolean
}

const DARK_T: AT  = { bg:'bg-zinc-950', surf:'bg-zinc-900', bord:'border-zinc-800', text:'text-white',     muted:'text-zinc-400', sub:'text-zinc-500', inp:'bg-zinc-800', isDark:true  }
const LIGHT_T: AT = { bg:'bg-white',    surf:'bg-gray-50',  bord:'border-gray-100', text:'text-gray-900', muted:'text-gray-500', sub:'text-gray-400', inp:'bg-gray-100', isDark:false }
const THEME_MAP: Record<AppTheme, AT> = { dark: DARK_T, light: LIGHT_T }

// True when rendering inside the full-screen PWA simulation overlay
const SimContext = createContext(false)

interface Story {
  name: string; img: string; storyImg: string
  product: string | null; price: string | null; priceVat: string | null
  stock: string | null; desc: string
  shipping: { label: string; price: string } | null
}

const APP_STORIES: Story[] = [
  {
    name:'Mo.one', img:'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=120&h=120&fit=crop&q=80',
    storyImg:'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=640&h=1136&fit=crop&q=85',
    product:null, price:null, priceVat:null, stock:null,
    desc:'Mo.one ti platí za každou platbu. Sbírej body Stardust a vyměňuj za odměny.',
    shipping:null,
  },
  {
    name:'Santhia', img:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces&q=80',
    storyImg:'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=640&h=1136&fit=crop&q=85',
    product:'Ranní káva s Mo.one bonusem', price:'89,–', priceVat:null, stock:'∞',
    desc:'Navštivte nás ráno a získejte prémiovou kávu s Mo.one cashback bonusem. Každá platba se počítá!',
    shipping:{ label:'Aktivní v Mo.one na klik', price:'Zdarma' },
  },
  {
    name:'Halipres', img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces&q=80',
    storyImg:'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=640&h=1136&fit=crop&q=85',
    product:'GELADRINK FORTE HYAL pro výživu kloubů', price:'729,–', priceVat:'bez DPH 695,–', stock:'113ks',
    desc:'Dopřejte svým kloubům regeneraci, kterou si zaslouží. Geladrink Forte Hyal je špičkový doplněk stravy, který představuje intenzivní kúru pro celý váš pohybový aparát.',
    shipping:{ label:'Zásilkovna (Z-Box)', price:'+60,–' },
  },
  {
    name:'Rock...', img:'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&h=120&fit=crop&crop=faces&q=80',
    storyImg:'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=640&h=1136&fit=crop&q=85',
    product:'Early-bid tickets 2027', price:'4 888,–', priceVat:null, stock:'8 888ks',
    desc:'Zajisti si své místo na jednom z největších a nejlepších evropských festivalů. Absolutně nejvýhodnější cena za absolutně nezapomenutelný zážitek.',
    shipping:{ label:'Virtuální účet v Mo.one', price:'Zdarma' },
  },
  {
    name:'Morav.', img:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=faces&q=80',
    storyImg:'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=640&h=1136&fit=crop&q=85',
    product:'Voucher na večeři pro dva s výběrovým vínem', price:'1 234,–', priceVat:'bez DPH 1 105,–', stock:'15ks',
    desc:'Hledáte dokonalý dárek pro milovníky gastronomie? Náš voucher vás přenese do světa, kde hrají hlavní roli precizní kuchařské umění a harmonie chutí.',
    shipping:{ label:'Zásilkovna (Z-Box)', price:'+60,–' },
  },
  {
    name:'Elegán', img:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces&q=80',
    storyImg:'https://images.unsplash.com/photo-1445205170230-053b83016050?w=640&h=1136&fit=crop&q=85',
    product:'Výhodné pohonné hmoty u Orlen (40l)', price:'1 199,–', priceVat:'bez DPH 1 059,–', stock:'35ks',
    desc:'Dopřejte svému vozu prvotřídní péči a své peněžence zasloužený oddech. Jedorázový odběr 40 litrů kvalitního paliva v síti čerpacích stanic Orlen za výhodnou cenu.',
    shipping:{ label:'Aktivní v Mo.one na klik', price:'Zdarma' },
  },
]

const APP_ICONS: { Icon: React.ElementType; label: string; bg: string; to: AppScreen | null }[] = [
  { Icon: ShoppingBag,    label:'Tržiště',    bg:'bg-blue-600',   to:'trziste' },
  { Icon: MessageCircle,  label:'Chaty',      bg:'bg-violet-700', to:'chaty'   },
  { Icon: Star,           label:'Stardust',   bg:'bg-amber-500',  to:null },
  { Icon: Gift,           label:'Dárky',      bg:'bg-rose-600',   to:null },
  { Icon: MapPin,         label:'Kde platit', bg:'bg-teal-600',   to:null },
  { Icon: Wallet,         label:'Bankovní',   bg:'bg-zinc-600',   to:null },
  { Icon: ArrowLeftRight, label:'Transakce',  bg:'bg-zinc-600',   to:null },
  { Icon: Users,          label:'Souřede',    bg:'bg-indigo-600', to:null },
  { Icon: Megaphone,      label:'Kampaně',    bg:'bg-pink-700',   to:null },
  { Icon: FileText,       label:'Dokumenty',  bg:'bg-zinc-600',   to:null },
  { Icon: User,           label:'Profil',     bg:'bg-zinc-600',   to:null },
  { Icon: MoreHorizontal, label:'Více',       bg:'bg-zinc-600',   to:null },
]

const NAV_ITEMS: { Icon: React.ElementType; label: string; to: AppScreen | null }[] = [
  { Icon: HomeIcon,      label:'Přehled',   to:'home'  },
  { Icon: MapPin,        label:'Kde platit',to:null    },
  { Icon: Star,          label:'Stardust',  to:null    },
  { Icon: MessageCircle, label:'Chaty',     to:'chaty' },
  { Icon: User,          label:'Profil',    to:null    },
]

const MKTPLACE = [
  { img:'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=150&fit=crop&q=70', title:'Voucher na večeři',    price:'1 234,–' },
  { img:'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&h=150&fit=crop&q=70', title:'Geladrine Forte',      price:'1 234,–' },
  { img:'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=200&h=150&fit=crop&q=70', title:'Výhodné pohlednice',   price:'1 234,–' },
  { img:'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=150&fit=crop&q=70', title:'MacBook Pro M4',       price:'1 234,–' },
  { img:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&h=150&fit=crop&q=70', title:'Tesla Y',              price:'1 234,–' },
  { img:'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&h=150&fit=crop&q=70', title:'Early-bird ticket 2027',price:'1 234,–' },
]

const CHAT_LIST_DATA = [
  { name:'Jana Krátká',    last:'Díky za zaplacení faktury za hlídání...', time:'6h',        unread:1, img:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces&q=80' },
  { name:'Petr Novák',     last:'Ahoj, jak se máš?',                       time:'Nyní',      unread:0, img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces&q=80' },
  { name:'Legi.one Pokec', last:'Jáchym: Právě jsem se registroval...',    time:'3h',        unread:2, img:'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=faces&q=80' },
  { name:'Nikola, Jan',    last:'Jan: Dnesko semnou nepočítej!',            time:'12h',       unread:0, img:'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&h=120&fit=crop&crop=faces&q=80' },
  { name:'Valerie Velká',  last:'Mám! Už jsem dost velká, nepouč mě',      time:'Včera',     unread:0, img:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=faces&q=80' },
  { name:'Knižní Klub',    last:'Agóta: Už jste četli nového zákazníka?',  time:'12.1.2026', unread:0, img:'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=120&h=120&fit=crop&q=80' },
]

// ── Phone Chrome ──────────────────────────────────────────────────

function PhoneStatusBar({ device, t }: { device: DeviceType; t: AT }) {
  const isSim = useContext(SimContext)
  // On mobile full-screen portal the real system status bar is already visible — hide the fake one.
  // On desktop the PhoneFrame has no real status bar, so always render it there.
  if (isSim && window.innerWidth < 768) return null
  const bars = [4, 6, 9, 12]
  const content = (
    <div className="flex items-center gap-1">
      <div className="flex items-end gap-px h-3">
        {bars.map((h, i) => (
          <div key={i} className={cn('w-[3px] rounded-sm', t.isDark ? 'bg-white' : 'bg-gray-900')}
            style={{ height: `${h}px` }} />
        ))}
      </div>
      <span className={cn('text-[10px] font-medium', t.isDark ? 'text-white' : 'text-gray-900')}>LTE</span>
      <div className={cn('border rounded-[3px] w-5 h-2.5 flex items-center p-px ml-0.5',
        t.isDark ? 'border-white/70' : 'border-gray-700')}>
        <div className={cn('h-full rounded-sm', t.isDark ? 'bg-white' : 'bg-gray-900')} style={{ width: '70%' }} />
      </div>
    </div>
  )
  if (device === 'iphone') {
    // In simulation the overlay already handles safe-area-inset-top — use minimal padding
    return (
      <div className={cn('flex justify-between items-center px-5 shrink-0', t.bg)}
        style={{ paddingTop: isSim ? 6 : 38, paddingBottom: 6 }}>
        <span className={cn('text-[12px] font-semibold', t.isDark ? 'text-white' : 'text-gray-900')}>19:02</span>
        {content}
      </div>
    )
  }
  return (
    <div className={cn('flex justify-between items-center px-4 py-2 shrink-0', t.bg)}>
      <span className={cn('text-[11px] font-semibold', t.isDark ? 'text-white' : 'text-gray-900')}>19:02</span>
      {content}
    </div>
  )
}

function AppNav({ active, t, onNav, onProfileExit }: {
  active: AppScreen; t: AT; onNav: (s: AppScreen) => void; onProfileExit?: () => void
}) {
  return (
    <div className={cn('flex items-center justify-around border-t pt-2 shrink-0', t.bord, t.bg)}
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))' }}>
      {NAV_ITEMS.map(({ Icon, label, to }, i) => {
        const isActive = to === active || (active === 'chat' && to === 'chaty') || (active === 'payment-create' && to === 'chaty') || (active === 'trziste' && i === 0) || (active === 'detail' && i === 0)
        const isProfileSlot = i === NAV_ITEMS.length - 1
        return (
          <button key={i}
            onClick={() => isProfileSlot && onProfileExit ? onProfileExit() : to ? onNav(to) : undefined}
            className="flex flex-col items-center gap-0.5 transition-opacity">
            <Icon className={cn('h-[19px] w-[19px]', isActive ? 'text-blue-500' : t.muted)} />
            <span className={cn('text-[9px]', isActive ? 'text-blue-500' : t.muted)}>{label}</span>
          </button>
        )
      })}
    </div>
  )
}

function PhoneFrame({ device, theme, children }: { device: DeviceType; theme: AppTheme; children: React.ReactNode }) {
  return (
    <div
      className={cn('relative overflow-hidden mx-auto shadow-2xl border-[2.5px]',
        device === 'iphone' ? 'rounded-[48px]' : 'rounded-[36px]',
        theme === 'dark' ? 'border-zinc-700 bg-zinc-950' : 'border-gray-300 bg-white'
      )}
      style={{ width: 320, height: 640 }}>
      {device === 'iphone' && (
        /* Dynamic Island */
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-30 bg-black rounded-full flex items-center justify-center gap-1.5"
          style={{ width: 108, height: 30 }}>
          <div className="w-[14px] h-[14px] rounded-full bg-zinc-800 border border-zinc-600" />
          <div className="w-1 h-1 rounded-full bg-zinc-700" />
        </div>
      )}
      {device === 'samsung' && (
        /* Punch-hole */
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 w-[10px] h-[10px] bg-black rounded-full ring-[1.5px] ring-zinc-800" />
      )}
      {children}
    </div>
  )
}

// ── App Screens ────────────────────────────────────────────────────

function HomeScreen({ t, device, onNav, onOpenStory, onProfileExit }: { t: AT; device: DeviceType; onNav: (s: AppScreen) => void; onOpenStory: (idx: number) => void; onProfileExit?: () => void }) {
  return (
    <div className={cn('flex flex-col h-full', t.bg)}>
      <PhoneStatusBar device={device} t={t} />
      {/* Top bar */}
      <div className="flex items-center gap-2 px-3 pb-2.5 shrink-0">
        <button className={cn('flex items-center gap-0.5 text-xs font-semibold shrink-0', t.text)}>
          Praha <ChevronDown className="h-3 w-3 opacity-50" />
        </button>
        <div className={cn('flex-1 rounded-full px-3 py-1.5 flex items-center gap-2', t.inp)}>
          <SearchIcon className={cn('h-3 w-3 shrink-0', t.sub)} />
          <span className={cn('text-[11px]', t.sub)}>Vyhledat...</span>
        </div>
        <button className="flex items-center bg-blue-600 rounded-full px-2.5 py-1 shrink-0">
          <span className="text-white text-[10px] font-bold">+130</span>
        </button>
        <button className="relative shrink-0">
          <Bell className={cn('h-[18px] w-[18px]', t.text)} />
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2"
            style={{ borderColor: t.isDark ? '#09090b' : '#ffffff' }} />
        </button>
      </div>
      {/* Stories — scrollable, clickable */}
      <div className="flex gap-3 px-3 pb-3 shrink-0 overflow-x-auto no-scrollbar scroll-smooth snap-x">
        {APP_STORIES.map((s, i) => (
          <button key={i} onClick={() => onOpenStory(i)}
            className="flex flex-col items-center gap-1 shrink-0 snap-start active:scale-95 transition-transform">
            <div className={cn('w-11 h-11 rounded-full border-[2.5px] overflow-hidden',
              i === 0 ? 'border-blue-500' : t.isDark ? 'border-zinc-700' : 'border-gray-300')}>
              <img src={s.img} alt={s.name} className="w-full h-full object-cover" />
            </div>
            <span className={cn('text-[9px] w-11 text-center truncate', t.muted)}>{s.name}</span>
          </button>
        ))}
      </div>
      {/* Scrollable content — keeps AppNav always visible */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Balance */}
        <div className={cn('mx-3 mb-3 rounded-2xl p-4 border', t.surf, t.bord)}>
          <div className="flex items-start justify-between mb-1">
            <span className={cn('text-[9px] uppercase tracking-widest font-semibold', t.sub)}>Dostupné prostředky</span>
            <div className="flex gap-1">
              <div className={cn('w-4 h-4 rounded-full border', t.isDark ? 'border-zinc-700' : 'border-gray-300')} />
              <div className={cn('w-4 h-4 rounded-full border', t.isDark ? 'border-zinc-700' : 'border-gray-300')} />
            </div>
          </div>
          <div className={cn('text-[28px] font-bold tracking-tight leading-none mb-2', t.text)}>35 125 Kč</div>
          <button className="text-[11px] text-blue-500 font-semibold">Bankovní účty →</button>
        </div>
        {/* Grid */}
        <div className="grid grid-cols-4 px-1 mb-3">
          {APP_ICONS.map(({ Icon, label, bg, to }) => (
            <button key={label} onClick={() => to && onNav(to)}
              className={cn('flex flex-col items-center gap-1 py-2.5 rounded-2xl transition-transform active:scale-95',
                to ? 'cursor-pointer' : 'cursor-default')}>
              <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', bg)}>
                <Icon className="h-[15px] w-[15px] text-white" />
              </div>
              <span className={cn('text-[9px] text-center leading-tight', t.muted)}>{label}</span>
            </button>
          ))}
        </div>
        {/* Stardust */}
        <div className={cn('mx-3 mb-3 rounded-2xl p-3.5 border',
          t.isDark ? 'bg-blue-950 border-blue-900/50' : 'bg-blue-50 border-blue-200')}>
          <div className="flex items-center justify-between mb-2.5">
            <div>
              <div className={cn('text-[9px] font-bold uppercase tracking-widest mb-0.5',
                t.isDark ? 'text-blue-300' : 'text-blue-600')}>Stardust Explorer</div>
              <div className={cn('text-[13px] font-bold leading-tight', t.text)}>
                Sbírej body Stardust<br/>a vydělávej!
              </div>
            </div>
            <div className="flex gap-1.5 shrink-0">
              <div className="bg-amber-500/20 border border-amber-400/40 rounded-xl px-2.5 py-1.5 text-center">
                <div className="text-white text-base font-bold leading-none">3</div>
                <div className="text-amber-400 text-[8px] font-bold mt-0.5">STREAK</div>
              </div>
              <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl px-2.5 py-1.5 text-center">
                <div className="text-green-400 text-[11px] font-bold leading-none">+15</div>
                <div className={cn('text-[8px] mt-0.5', t.isDark ? 'text-blue-300' : 'text-blue-600')}>PLAYED</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn('flex-1 h-1.5 rounded-full overflow-hidden', t.isDark ? 'bg-blue-900' : 'bg-blue-200')}>
              <div className="h-full bg-reward rounded-full shadow-[0_0_6px_rgba(74,222,128,0.7)]" style={{ width: '24%' }} />
            </div>
            <span className={cn('text-[10px] font-semibold', t.isDark ? 'text-blue-300' : 'text-blue-600')}>24/100</span>
          </div>
        </div>
      </div>
      <AppNav active="home" t={t} onNav={onNav} {...(onProfileExit ? { onProfileExit } : {})} />
    </div>
  )
}

function TrzisteScreen({ t, device, onNav, onProfileExit }: { t: AT; device: DeviceType; onNav: (s: AppScreen) => void; onProfileExit?: () => void }) {
  return (
    <div className={cn('flex flex-col h-full', t.bg)}>
      <PhoneStatusBar device={device} t={t} />
      <div className={cn('flex items-center gap-2 px-3 pb-2 pt-1 border-b shrink-0', t.bord)}>
        <button onClick={() => onNav('home')} className="p-1 -ml-1">
          <ChevronLeft className={cn('h-4 w-4', t.muted)} />
        </button>
        <span className={cn('font-bold text-sm flex-1', t.text)}>Tržiště</span>
        <SearchIcon className={cn('h-4 w-4', t.muted)} />
      </div>
      {/* Featured */}
      <div className="mx-3 mt-3 rounded-2xl overflow-hidden relative shrink-0 cursor-pointer"
        onClick={() => onNav('detail')}>
        <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=180&fit=crop&q=75"
          alt="Featured" className="w-full h-24 object-cover"
          style={{ filter: 'brightness(0.6) saturate(0.65)' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
        <div className="absolute inset-0 p-3 flex items-end justify-between">
          <div>
            <div className="text-[10px] text-zinc-300">Víkendový pobyt v lázních</div>
            <div className="text-white text-[12px] font-bold">Luhačovice pro dva</div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-white font-bold text-sm">2 449,–</div>
            <div className="text-zinc-400 text-[9px]">bez DPH 2 019,–</div>
          </div>
        </div>
      </div>
      {/* Pills */}
      <div className="flex gap-1.5 px-3 py-2 overflow-x-hidden shrink-0">
        {['Vše','Relax','Cestování','Sport','Jídlo','Auto'].map((c, i) => (
          <span key={c} className={cn('text-[10px] px-2.5 py-1 rounded-full shrink-0 font-medium',
            i === 0 ? 'bg-blue-600 text-white' : t.isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-gray-100 text-gray-600')}>
            {c}
          </span>
        ))}
      </div>
      {/* Grid */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3 pb-2">
        <div className="grid grid-cols-2 gap-2.5">
          {MKTPLACE.map((item, i) => (
            <button key={i} onClick={() => onNav('detail')}
              className={cn('rounded-2xl overflow-hidden border text-left active:scale-[0.97] transition-transform', t.surf, t.bord)}>
              <div className="relative">
                <img src={item.img} alt={item.title} className="w-full h-20 object-cover"
                  style={{ filter: 'brightness(0.7) saturate(0.6)' }} />
                <div className="absolute top-1.5 left-1.5 bg-black/50 rounded-full p-1">
                  <Play className="h-2 w-2 text-white fill-white" />
                </div>
              </div>
              <div className="p-2">
                <div className={cn('text-[10px] leading-tight mb-0.5 line-clamp-1', t.muted)}>{item.title}</div>
                <div className={cn('text-[12px] font-bold', t.text)}>{item.price}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <AppNav active="trziste" t={t} onNav={onNav} {...(onProfileExit ? { onProfileExit } : {})} />
    </div>
  )
}

function DetailScreen({ t, device, onNav, onProfileExit: _onProfileExit }: { t: AT; device: DeviceType; onNav: (s: AppScreen) => void; onProfileExit?: () => void }) {
  return (
    <div className={cn('flex flex-col h-full', t.bg)}>
      <PhoneStatusBar device={device} t={t} />
      <div className="relative shrink-0">
        <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=640&h=220&fit=crop&q=80"
          alt="Product" className="w-full h-36 object-cover"
          style={{ filter: 'brightness(0.55) saturate(0.6)' }} />
        <div className={cn('absolute inset-0 bg-gradient-to-b to-90%',
          t.isDark ? 'from-transparent to-zinc-950/90' : 'from-transparent to-white/90')} />
        <button onClick={() => onNav('trziste')}
          className="absolute top-2.5 left-3 bg-black/40 rounded-full p-1.5 backdrop-blur-sm">
          <X className="h-3.5 w-3.5 text-white" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-3 pb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 pr-3">
            <h2 className={cn('font-bold text-[15px] leading-tight mb-1.5', t.text)}>
              Voucher na večeři pro dva s výběrovým vínem
            </h2>
            <span className="text-[10px] bg-amber-500/20 text-amber-500 border border-amber-500/30 rounded-full px-2 py-0.5 font-semibold">
              Zbývá: 15ks
            </span>
          </div>
          <div className="text-right shrink-0">
            <div className={cn('font-bold text-xl leading-none', t.text)}>1 234,–</div>
            <div className={cn('text-[10px]', t.sub)}>bez DPH 1 105,–</div>
          </div>
        </div>
        <p className={cn('text-[11px] leading-relaxed mb-4', t.muted)}>
          Hledáte dokonalý dárek pro milovníky gastronomie, nebo si chcete užít romantickou chvíli v příjemném prostředí? Náš dárkový voucher vás přenese do světa precizní kuchyně a harmonie chutí.
        </p>
        <div className={cn('flex items-center justify-between rounded-xl px-3 py-2.5 mb-3 border', t.surf, t.bord)}>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-rose-600 rounded-full flex items-center justify-center">
              <span className="text-white text-[9px] font-bold">Z</span>
            </div>
            <span className={cn('text-[11px]', t.text)}>Zásilkovna (Z-Box)</span>
          </div>
          <span className={cn('text-[11px]', t.muted)}>+60,–</span>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <button className={cn('w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold', t.inp, t.text)}>–</button>
          <span className={cn('font-semibold text-sm w-4 text-center', t.text)}>1</span>
          <button className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold">+</button>
          <div className={cn('flex-1 text-right text-[11px]', t.muted)}>
            Celkem: <span className={cn('font-bold', t.text)}>1 294,–</span>
          </div>
        </div>
        <div className={cn('flex items-center gap-2 rounded-xl px-3 py-2.5 mb-4 border', t.surf, t.bord)}>
          <MessageCircle className={cn('h-3.5 w-3.5 shrink-0', t.sub)} />
          <span className={cn('text-[11px] flex-1', t.sub)}>Zahájit konverzaci s obchodníkem...</span>
          <ChevronLeft className={cn('h-3 w-3 rotate-180', t.sub)} />
        </div>
        <button className="w-full bg-blue-600 active:bg-blue-700 text-white font-bold text-sm rounded-2xl py-3.5 transition-colors tracking-wide">
          OBJEDNAT A ZAPLATIT
        </button>
      </div>
    </div>
  )
}

function ChatyScreen({ t, device, onNav, onProfileExit }: { t: AT; device: DeviceType; onNav: (s: AppScreen) => void; onProfileExit?: () => void }) {
  return (
    <div className={cn('flex flex-col h-full', t.bg)}>
      <PhoneStatusBar device={device} t={t} />
      {/* Top bar */}
      <div className="flex items-center gap-2 px-3 pb-2 shrink-0">
        <button className={cn('flex items-center gap-0.5 text-xs font-semibold shrink-0', t.text)}>
          Praha <ChevronDown className="h-3 w-3 opacity-50" />
        </button>
        <div className={cn('flex-1 rounded-full px-2.5 py-1.5 flex items-center gap-2', t.inp)}>
          <SearchIcon className={cn('h-3 w-3', t.sub)} />
          <span className={cn('text-[11px]', t.sub)}>Vyhledat...</span>
        </div>
        <button className="flex items-center bg-blue-600 rounded-full px-2.5 py-1 shrink-0">
          <span className="text-white text-[10px] font-bold">+130</span>
        </button>
        <button className="relative shrink-0">
          <Bell className={cn('h-[17px] w-[17px]', t.text)} />
          <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>
      </div>
      {/* Header */}
      <div className="flex items-center justify-between px-3 pb-2 shrink-0">
        <span className={cn('font-bold text-base', t.text)}>Chaty</span>
        <button onClick={() => onNav('contacts')}>
          <Users className={cn('h-4 w-4', t.muted)} />
        </button>
      </div>
      {/* Friend stories */}
      <div className="flex gap-2.5 px-3 pb-2.5 overflow-x-hidden shrink-0">
        {CHAT_LIST_DATA.slice(0, 5).map((c, i) => (
          <div key={i} className="flex flex-col items-center gap-1 shrink-0">
            <div className={cn('w-10 h-10 rounded-full border-[2px] overflow-hidden',
              i === 0 ? 'border-blue-500' : t.isDark ? 'border-zinc-700' : 'border-gray-300')}>
              <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
            </div>
            <span className={cn('text-[9px] w-10 text-center truncate', t.muted)}>{c.name.split(' ')[0]}</span>
          </div>
        ))}
      </div>
      {/* Filter pills */}
      <div className="flex gap-1.5 px-3 pb-2 overflow-x-hidden shrink-0">
        {['Vše','Přátelé','Nákupy','Skupiny','Žádosti'].map((f, i) => (
          <span key={f} className={cn('text-[10px] px-2.5 py-1 rounded-full shrink-0 font-medium',
            i === 0 ? 'bg-blue-600 text-white' : t.isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-gray-100 text-gray-600')}>
            {f}
          </span>
        ))}
      </div>
      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {CHAT_LIST_DATA.map((c, i) => (
          <button key={i} onClick={() => onNav('chat')}
            className={cn('w-full flex items-center gap-3 px-3 py-2.5 hover:opacity-80 transition-opacity border-b', t.bord)}>
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
              <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between mb-0.5">
                <span className={cn('text-[12px] font-semibold', t.text)}>{c.name}</span>
                <span className={cn('text-[9px]', t.sub)}>{c.time}</span>
              </div>
              <span className={cn('text-[10px] block truncate', t.muted)}>{c.last}</span>
            </div>
            {c.unread > 0 && (
              <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                <span className="text-white text-[8px] font-bold">{c.unread}</span>
              </div>
            )}
          </button>
        ))}
      </div>
      <AppNav active="chaty" t={t} onNav={onNav} {...(onProfileExit ? { onProfileExit } : {})} />
    </div>
  )
}

function ChatScreen({ t, device, onNav, onProfileExit: _onProfileExit }: { t: AT; device: DeviceType; onNav: (s: AppScreen) => void; onProfileExit?: () => void }) {
  const [showMenu, setShowMenu] = useState(false)
  return (
    <div className={cn('flex flex-col h-full', t.bg)}>
      <PhoneStatusBar device={device} t={t} />
      {/* Chat header */}
      <div className={cn('flex items-center gap-2 px-3 py-2 border-b shrink-0', t.bord)}>
        <button onClick={() => onNav('chaty')}>
          <ChevronLeft className={cn('h-4 w-4', t.muted)} />
        </button>
        <div className="w-7 h-7 rounded-full overflow-hidden shrink-0">
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces&q=80" alt="Jana Krátká" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <div className={cn('text-[12px] font-bold leading-tight', t.text)}>Jana Krátká</div>
          <div className={cn('text-[9px]', t.sub)}>@jratka.hildars</div>
        </div>
        <div className="flex gap-2">
          <button><User className={cn('h-4 w-4', t.muted)} /></button>
          <button><MoreHorizontal className={cn('h-4 w-4', t.muted)} /></button>
        </div>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3 py-3 space-y-2 relative">
        {/* Time stamp */}
        <div className={cn('text-center text-[9px] mb-2', t.sub)}>22:21</div>
        {/* User message */}
        <div className="flex justify-end">
          <div className="bg-blue-600 rounded-2xl rounded-br-sm px-3 py-2 max-w-[70%]">
            <p className="text-white text-[11px] leading-relaxed">Dobrý den, chtěla bych si objednat hlídání na pondělí 21.1 od 14:00 do 22:00, bylo by to možné?</p>
          </div>
        </div>
        {/* Other message */}
        <div className="flex justify-start">
          <div className={cn('rounded-2xl rounded-bl-sm px-3 py-2 max-w-[70%]', t.surf, t.isDark ? '' : 'border border-gray-100')}>
            <p className={cn('text-[11px] leading-relaxed', t.text)}>Ano, na jaké adrese hlídání potřebujete?</p>
          </div>
        </div>
        {/* User message */}
        <div className="flex justify-end">
          <div className="bg-blue-600 rounded-2xl rounded-br-sm px-3 py-2">
            <p className="text-white text-[11px]">Hanácká 23/1, Mohelnice</p>
          </div>
        </div>
        <div className="flex justify-start">
          <div className={cn('rounded-2xl rounded-bl-sm px-3 py-2', t.surf)}>
            <p className={cn('text-[11px]', t.text)}>Skvělé, počítám s tím.</p>
          </div>
        </div>
        {/* Time stamp */}
        <div className={cn('text-center text-[9px] py-1', t.sub)}>11:37</div>
        {/* Payment bubble — reward moment */}
        <div className="flex justify-start">
          <div className={cn('rounded-2xl rounded-bl-sm p-3 max-w-[80%] border', t.surf, t.isDark ? 'border-zinc-700' : 'border-gray-200')}>
            <div className={cn('text-[9px] font-semibold uppercase tracking-wider mb-1.5', t.sub)}>Jana Krátká</div>
            <div className={cn('text-[9px] mb-0.5', t.sub)}>VS: 968990 · ID: EVFVPP</div>
            <div className={cn('text-xl font-bold tracking-tight mb-2', t.text)}>1 249,00 Kč</div>
            <div className="flex items-center justify-center gap-1.5 bg-reward rounded-xl px-3 py-2">
              <span className="text-[13px]">🎉</span>
              <span className="text-white text-[11px] font-bold tracking-wide">Zaplaceno!</span>
            </div>
          </div>
        </div>
        <div className="flex justify-start">
          <div className={cn('rounded-2xl rounded-bl-sm px-3 py-2 max-w-[75%]', t.surf)}>
            <p className={cn('text-[11px] leading-relaxed', t.text)}>Právě jsem zaplatila přes Mo.one za včerejší hlídání.</p>
          </div>
        </div>
        <div className="flex justify-start">
          <div className={cn('rounded-2xl rounded-bl-sm px-3 py-2 max-w-[80%]', t.surf)}>
            <p className={cn('text-[11px] leading-relaxed', t.text)}>Díky za zaplacení faktury za hlídání, vidíme se příští týden. Pěkný víkend.</p>
          </div>
        </div>
        {/* Context menu overlay */}
        {showMenu && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20">
            <div className={cn('rounded-2xl border shadow-lg overflow-hidden min-w-[160px]', t.surf, t.isDark ? 'border-zinc-700' : 'border-gray-200')}>
              <button onClick={() => { setShowMenu(false); onNav('payment-create') }}
                className={cn('flex items-center gap-2 w-full px-4 py-3 text-left hover:opacity-80 border-b', t.text, t.bord)}>
                <Wallet className="h-3.5 w-3.5 text-blue-500" />
                <span className="text-[12px]">Platba uživateli</span>
              </button>
              <button onClick={() => { setShowMenu(false); onNav('payment-create') }}
                className={cn('flex items-center gap-2 w-full px-4 py-3 text-left hover:opacity-80', t.text)}>
                <ArrowLeftRight className="h-3.5 w-3.5 text-blue-500" />
                <span className="text-[12px]">Vytvořit platbu</span>
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Input bar */}
      <div className={cn('flex items-center gap-2 px-3 py-2.5 border-t shrink-0', t.bord, t.bg)}>
        <button><SearchIcon className={cn('h-4 w-4', t.muted)} /></button>
        <div className={cn('flex-1 rounded-full px-3 py-1.5 text-[11px]', t.inp, t.sub)}>Zpráva...</div>
        <button><User className={cn('h-4 w-4', t.muted)} /></button>
        <button><SearchIcon className={cn('h-4 w-4', t.muted)} /></button>
        <button onClick={() => setShowMenu(v => !v)}
          className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white text-base font-bold leading-none" style={{ marginTop: -1 }}>+</span>
        </button>
      </div>
    </div>
  )
}

function PaymentCreateScreen({ t, device, onNav, onProfileExit: _onProfileExit }: { t: AT; device: DeviceType; onNav: (s: AppScreen) => void; onProfileExit?: () => void }) {
  return (
    <div className={cn('flex flex-col h-full', t.bg)}>
      <PhoneStatusBar device={device} t={t} />
      {/* Dimmed chat background hint */}
      <div className={cn('flex-1 relative', t.isDark ? 'bg-zinc-900/40' : 'bg-black/10')}>
        {/* Bottom sheet */}
        <div className={cn('absolute bottom-0 left-0 right-0 rounded-t-3xl border-t', t.bg, t.bord)}>
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className={cn('w-10 h-1 rounded-full', t.isDark ? 'bg-zinc-700' : 'bg-gray-300')} />
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className={cn('text-[11px] font-bold uppercase tracking-widest', t.sub)}>Vytvoření platby</span>
            <button onClick={() => onNav('chat')}>
              <X className={cn('h-4 w-4', t.muted)} />
            </button>
          </div>
          <div className="px-4 pb-6">
            <div className={cn('text-[11px] font-semibold uppercase tracking-wider mb-2', t.sub)}>Částka</div>
            <div className={cn('text-4xl font-bold tracking-tight mb-5', t.text)}>120,00 Kč</div>
            {/* Account selector */}
            <div className={cn('text-[10px] font-semibold uppercase tracking-wider mb-2', t.sub)}>Vyber příchozí účet</div>
            <div className={cn('flex items-center gap-3 rounded-2xl px-4 py-3 mb-4 border', t.surf, t.bord)}>
              <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-[8px] font-bold">Č</span>
              </div>
              <div className="flex-1">
                <div className={cn('text-[12px] font-semibold', t.text)}>Běžný účet</div>
                <div className={cn('text-[10px]', t.sub)}>1000053019/3030</div>
              </div>
              <div className="text-right">
                <div className={cn('text-[12px] font-bold text-green-500')}>38 749 Kč</div>
                <ChevronDown className={cn('h-3 w-3 ml-auto', t.muted)} />
              </div>
            </div>
            {/* Note */}
            <div className={cn('rounded-2xl px-4 py-3 mb-5 border text-[11px]', t.surf, t.bord, t.sub)}>
              Přidat poznámku...
            </div>
            <button className="w-full bg-blue-600 active:bg-blue-700 text-white font-bold text-sm rounded-2xl py-4 transition-colors tracking-widest">
              VYTVOŘIT A ODESLAT
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ContactsScreen({ t, device, onNav, onProfileExit }: { t: AT; device: DeviceType; onNav: (s: AppScreen) => void; onProfileExit?: () => void }) {
  return (
    <div className={cn('flex flex-col h-full', t.bg)}>
      <PhoneStatusBar device={device} t={t} />
      {/* Top bar */}
      <div className="flex items-center gap-2 px-3 pb-2 shrink-0">
        <button className={cn('flex items-center gap-0.5 text-xs font-semibold shrink-0', t.text)}>
          Praha <ChevronDown className="h-3 w-3 opacity-50" />
        </button>
        <div className={cn('flex-1 rounded-full px-2.5 py-1.5 flex items-center gap-2', t.inp)}>
          <SearchIcon className={cn('h-3 w-3', t.sub)} />
          <span className={cn('text-[11px]', t.sub)}>Vyhledat...</span>
        </div>
        <button className="flex items-center bg-blue-600 rounded-full px-2.5 py-1 shrink-0">
          <span className="text-white text-[10px] font-bold">+130</span>
        </button>
      </div>
      {/* Header */}
      <div className={cn('flex items-center gap-2 px-3 pb-3 border-b shrink-0', t.bord)}>
        <button onClick={() => onNav('chaty')} className="-ml-1">
          <ChevronLeft className={cn('h-4 w-4', t.muted)} />
        </button>
        <span className={cn('font-bold text-sm flex-1', t.text)}>Přidat přátele</span>
      </div>
      {/* Section label */}
      <div className={cn('flex items-center justify-between px-3 py-2.5 shrink-0')}>
        <span className={cn('text-[10px] font-bold uppercase tracking-widest', t.sub)}>Lidi v Mo.one</span>
        <button className={cn('flex items-center gap-1 text-blue-500 text-[10px] font-semibold')}>
          <ArrowLeftRight className="h-3 w-3" />
          Sync kontaktů
        </button>
      </div>
      {/* Search */}
      <div className={cn('mx-3 mb-2 rounded-full px-3 py-1.5 flex items-center gap-2 shrink-0', t.inp)}>
        <SearchIcon className={cn('h-3 w-3', t.sub)} />
        <span className={cn('text-[11px]', t.sub)}>Vyhledat přátele...</span>
      </div>
      {/* Contact list */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {([
          { name:'Valerie Velká',    region:'Olomoucký kraj',       bg:'bg-rose-600'    },
          { name:'Jana Horáková',    region:'Praha',                bg:'bg-emerald-600' },
          { name:'Petr Svoboda',     region:'Brno - střed',         bg:'bg-blue-600'    },
          { name:'Tomáš Novák',      region:'Jihomoravský kraj',    bg:'bg-violet-600'  },
          { name:'Marta Blažková',   region:'Plzeňský kraj',        bg:'bg-amber-600'   },
          { name:'Adam Krejčí',      region:'Středočeský kraj',     bg:'bg-teal-600'    },
          { name:'Eva Procházková',  region:'Moravskoslezský kraj', bg:'bg-pink-600'    },
          { name:'Lucie Dvořák',     region:'Pardubický kraj',      bg:'bg-indigo-600'  },
        ] as const).map((c, i) => (
          <div key={i} className={cn('flex items-center gap-3 px-3 py-2.5 border-b', t.bord)}>
            <div className={cn('w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0', c.bg)}>
              {c.name.split(' ').map(n => n[0]).join('').slice(0,2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className={cn('text-[12px] font-semibold', t.text)}>{c.name}</div>
              <div className={cn('text-[10px]', t.sub)}>{c.region}</div>
            </div>
            <div className="flex gap-2">
              <button><MessageCircle className="h-4 w-4 text-blue-500" /></button>
              <button><Users className={cn('h-4 w-4', t.muted)} /></button>
            </div>
          </div>
        ))}
      </div>
      <AppNav active="chaty" t={t} onNav={onNav} {...(onProfileExit ? { onProfileExit } : {})} />
    </div>
  )
}

// ── SuperApp Section ──────────────────────────────────────────────

// ── Story Viewer ──────────────────────────────────────────────────

function StoryScreen({ story, idx, total, t, device, onPrev, onNext, onClose }:
  { story: Story; idx: number; total: number; t: AT; device: DeviceType
    onPrev: () => void; onNext: () => void; onClose: () => void }) {
  const [showDetail, setShowDetail] = useState(false)
  const [progress, setProgress] = useState(0)
  const [qty, setQty] = useState(1)

  // Auto-progress bar — restarts on story change via key in parent
  useEffect(() => {
    setProgress(0)
    setShowDetail(false)
    setQty(1)
    const iv = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { onNext(); return 0 }
        return p + 100 / 60  // 6 s per story
      })
    }, 100)
    return () => clearInterval(iv)
  }, [idx])  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col h-full relative bg-black text-white">
      <PhoneStatusBar device={device} t={DARK_T} />

      {/* Full-screen image */}
      <div className="absolute inset-0 z-0">
        <img src={story.storyImg} alt={story.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />
      </div>

      {/* Tap zones: prev / next */}
      <div className="absolute inset-0 z-10 flex">
        <div className="flex-1 cursor-pointer" onClick={onPrev} />
        <div className="flex-1 cursor-pointer" onClick={() => { if (!showDetail) onNext() }} />
      </div>

      {/* Progress bars */}
      <div className="relative z-20 flex gap-1 px-3 pt-1 pb-2 shrink-0">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className="flex-1 h-[2px] bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-none"
              style={{ width: i < idx ? '100%' : i === idx ? `${Math.min(progress, 100)}%` : '0%' }} />
          </div>
        ))}
      </div>

      {/* Top bar */}
      <div className="relative z-20 flex items-center gap-2 px-3 pb-3 shrink-0">
        <div className="w-7 h-7 rounded-full overflow-hidden border border-white/40 shrink-0">
          <img src={story.img} alt={story.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <span className="text-white text-[11px] font-bold">{story.name}</span>
          <span className="text-white/60 text-[10px] ml-1.5">6h</span>
        </div>
        <button className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full px-2 py-1 text-[10px] text-white/90 font-medium border border-white/20">
          Zahájit chat <ChevronLeft className="h-2.5 w-2.5 rotate-180" />
        </button>
        <div className="flex gap-1.5 ml-1">
          {[Play, X].map((Icon, i) => (
            <button key={i} onClick={i === 1 ? onClose : undefined}
              className="w-6 h-6 flex items-center justify-center text-white/70 hover:text-white">
              <Icon className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>
      </div>

      {/* Bottom product info */}
      {story.product && !showDetail && (
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
          <div className="flex items-end justify-between mb-1">
            <div className="flex-1 pr-3">
              <p className="text-white font-bold text-[14px] leading-tight">{story.product}</p>
              {story.priceVat && <p className="text-white/60 text-[10px] mt-0.5">{story.priceVat}</p>}
              {story.stock && (
                <span className="inline-block mt-1 text-[10px] bg-blue-600/80 text-white rounded-full px-2 py-0.5 font-medium">
                  Zbývá: {story.stock}
                </span>
              )}
            </div>
            {story.price && (
              <div className="text-right shrink-0">
                <div className="text-white font-bold text-xl leading-none">{story.price}</div>
              </div>
            )}
          </div>
          <button onClick={() => setShowDetail(true)}
            className="w-full bg-white text-zinc-900 font-bold text-[13px] rounded-2xl py-3 mt-2 tracking-wide active:opacity-90 transition-opacity">
            KOUPIT S MO.ONE
          </button>
        </div>
      )}

      {/* Product detail bottom sheet */}
      {showDetail && (
        <div className="absolute inset-0 z-30 flex flex-col justify-end">
          <div className="flex-1" onClick={() => setShowDetail(false)} />
          <div className="bg-white rounded-t-3xl px-4 pt-3 pb-5">
            <div className="flex justify-center mb-3">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 pr-3">
                <h3 className="text-gray-900 font-bold text-[14px] leading-snug">{story.product}</h3>
                {story.priceVat && <p className="text-gray-400 text-[10px] mt-0.5">{story.priceVat}</p>}
                {story.stock && (
                  <span className="inline-block mt-1.5 text-[10px] text-blue-600 font-semibold">Zbývá: {story.stock}</span>
                )}
              </div>
              <div className="flex items-start gap-2 shrink-0">
                {story.price && <span className="text-gray-900 font-bold text-lg leading-none">{story.price}</span>}
                <button onClick={() => setShowDetail(false)} className="mt-0.5">
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
            <p className="text-gray-500 text-[11px] leading-relaxed mb-4">{story.desc}</p>
            {/* Stepper */}
            <div className="flex items-center gap-3 mb-3">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-900 text-lg font-bold">–</button>
              <span className="text-gray-900 font-semibold text-sm w-6 text-center">{qty}</span>
              <button onClick={() => setQty(q => q + 1)}
                className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold">+</button>
            </div>
            {/* Shipping */}
            {story.shipping && (
              <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-blue-600 rounded-md flex items-center justify-center">
                    <span className="text-white text-[8px] font-bold">M</span>
                  </div>
                  <span className="text-gray-700 text-[11px]">{story.shipping.label}</span>
                </div>
                <span className="text-gray-500 text-[11px] font-medium">{story.shipping.price}</span>
              </div>
            )}
            <button className="w-full bg-blue-600 text-white font-bold text-sm rounded-2xl py-3.5 tracking-widest">
              OBJEDNAT A ZAPLATIT
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const SCREEN_TABS: { id: AppScreen; label: string; group: string }[] = [
  { id:'home',            label:'Přehled',       group:'App' },
  { id:'trziste',         label:'Tržiště',        group:'App' },
  { id:'detail',          label:'Produkt',        group:'App' },
  { id:'story',           label:'Story viewer',   group:'App' },
  { id:'chaty',           label:'Chaty',          group:'Chat' },
  { id:'chat',            label:'Konverzace',     group:'Chat' },
  { id:'payment-create',  label:'Platba v chatu', group:'Chat' },
  { id:'contacts',        label:'Kontakty',       group:'Chat' },
]

// ── Desktop device simulation modal ────────────────────────────────
function DesktopDeviceModal({
  device, theme, simScreen, setSimScreen, simStory, setSimStory,
  openSimStory, simPrevStory, simNextStory, onClose,
}: {
  device: DeviceType; theme: AppTheme
  simScreen: AppScreen; setSimScreen: (s: AppScreen) => void
  simStory: number; setSimStory: React.Dispatch<React.SetStateAction<number>>
  openSimStory: (idx: number) => void
  simPrevStory: () => void; simNextStory: () => void
  onClose: () => void
}) {
  const isIphone = device === 'iphone'
  const t = THEME_MAP[theme]
  const sp = { t, device, onNav: setSimScreen }

  // ── Shared screen renderer ─────────────────────────────────────
  const screens = (
    <SimContext.Provider value={true}>
      <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
        {simScreen === 'home'           && <HomeScreen           {...sp} onOpenStory={openSimStory} onProfileExit={onClose} />}
        {simScreen === 'trziste'        && <TrzisteScreen        {...sp} onProfileExit={onClose} />}
        {simScreen === 'detail'         && <DetailScreen         {...sp} onProfileExit={onClose} />}
        {simScreen === 'chaty'          && <ChatyScreen          {...sp} onProfileExit={onClose} />}
        {simScreen === 'chat'           && <ChatScreen           {...sp} onProfileExit={onClose} />}
        {simScreen === 'payment-create' && <PaymentCreateScreen  {...sp} onProfileExit={onClose} />}
        {simScreen === 'contacts'       && <ContactsScreen       {...sp} onProfileExit={onClose} />}
        {simScreen === 'story' && APP_STORIES[simStory] && (
          <StoryScreen key={simStory} story={APP_STORIES[simStory]!}
            idx={simStory} total={APP_STORIES.length} t={t} device={device}
            onPrev={simPrevStory} onNext={simNextStory} onClose={() => setSimScreen('home')} />
        )}
      </div>
    </SimContext.Provider>
  )

  // ── Shared modal backdrop ──────────────────────────────────────
  const backdrop: React.CSSProperties = {
    position: 'fixed', inset: 0, zIndex: 9999,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflowY: 'auto', padding: '2rem 1rem',
    background: 'rgba(0,0,0,.9)',
    backdropFilter: 'blur(32px) saturate(.3)',
  }

  // ═══════════════════════════════════════════════════════════════
  // iPhone 17 Pro — real PNG device frame (transparent screen area)
  //
  // PNG: apple-iphone-17-pro-max-2025-medium.png, 365×750 px
  // Screen area is FULLY TRANSPARENT in the PNG (alpha=0).
  // Measured pixel bounds: left=17 top=13 right=348 bottom=736
  // → screen 331×723 px inside 365×750 PNG.
  //
  // Scale 0.9668 so screen width = exactly 320 CSS px:
  //   Container: 353×725 px
  //   Screen:    left=16 top=13 width=320 height=699 px
  // ═══════════════════════════════════════════════════════════════
  if (isIphone) {
    return createPortal(
      <div style={backdrop} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
        <button onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/55 hover:text-white transition-all z-10">
          <X className="h-5 w-5" />
        </button>
        <span className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] font-medium text-white/28 uppercase tracking-[.18em] select-none pointer-events-none whitespace-nowrap">
          iPhone 17 Pro Max · Natural Titanium
        </span>

        {/* Device wrapper — sized to scaled PNG */}
        <div style={{
          position: 'relative', width: 353, height: 725, flexShrink: 0,
          // drop-shadow follows the actual device silhouette (not a rectangle)
          filter: 'drop-shadow(0 60px 80px rgba(0,0,0,.7)) drop-shadow(0 20px 30px rgba(0,0,0,.5)) drop-shadow(0 4px 8px rgba(0,0,0,.6))',
        }}>
          {/* App content — positioned at exact transparent screen area */}
          <div style={{
            position: 'absolute', left: 16, top: 13, width: 320, height: 699,
            // Match the screen corner radius from the PNG (~42 px at this scale)
            borderRadius: 42, overflow: 'hidden', background: '#000',
          }}>
            {screens}
          </div>

          {/* Real iPhone PNG overlaid on top — transparent screen shows app beneath */}
          <img
            src="/iphone-17-pro-frame.png"
            alt=""
            draggable={false}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              pointerEvents: 'none', userSelect: 'none',
              // No mix-blend-mode needed — screen is naturally transparent in the PNG
            }}
          />
        </div>
      </div>,
      document.body
    )
  }

  // ═══════════════════════════════════════════════════════════════
  // Samsung Galaxy S26 — precise CSS device shell
  //   Body: 340×708 px (ratio 70.4:146.8 mm = 0.4795)
  //   Screen: 320×680 px, side bezel 10 px, top bezel 7 px
  // ═══════════════════════════════════════════════════════════════
  const DW=340, DH=708, DR=38, SX=10, ST=7, SR=30, SW=320, SH=680

  const samsungBody = 'linear-gradient(172deg,#2a2c2e 0%,#1e2022 6%,#161618 22%,#141416 55%,#181a1c 80%,#202224 94%,#282a2c 100%)'
  const samsungShadow = [
    '0 0 0 0.5px rgba(255,255,255,.1)',
    '0 1px 3px rgba(0,0,0,.9)','0 6px 20px rgba(0,0,0,.75)',
    '0 24px 64px rgba(0,0,0,.65)','0 60px 120px rgba(0,0,0,.55)',
    'inset 0 2px 0 rgba(255,255,255,.2)','inset 1px 0 0 rgba(255,255,255,.08)',
    'inset -1px 0 0 rgba(255,255,255,.06)','inset 0 -1px 0 rgba(0,0,0,.35)',
  ].join(',')

  const btnStyle = (side: 'left'|'right', top: number, h: number): React.CSSProperties => ({
    position: 'absolute', [side]: -4, top, width: 4, height: h,
    borderRadius: side==='left' ? '3px 0 0 3px' : '0 3px 3px 0',
    background: side==='left'
      ? 'linear-gradient(90deg,#121214 0%,#202224 60%,#1a1c1e 100%)'
      : 'linear-gradient(90deg,#1a1c1e 0%,#202224 60%,#121214 100%)',
    boxShadow: side==='left'
      ? '-1px 0 3px rgba(0,0,0,.7),inset 0 1px 0 rgba(255,255,255,.1)'
      : '1px 0 3px rgba(0,0,0,.7),inset 0 1px 0 rgba(255,255,255,.1)',
  })

  return createPortal(
    <div style={backdrop} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <button onClick={onClose}
        className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/55 hover:text-white transition-all z-10">
        <X className="h-5 w-5" />
      </button>
      <span className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] font-medium text-white/28 uppercase tracking-[.18em] select-none pointer-events-none whitespace-nowrap">
        Samsung Galaxy S26 · Titanium Black
      </span>

      <div style={{ position: 'relative', width: DW, height: DH, flexShrink: 0 }}>
        {/* Body */}
        <div style={{ position: 'absolute', inset: 0, borderRadius: DR, background: samsungBody, boxShadow: samsungShadow }} />
        {/* Highlight ring */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: DR, pointerEvents: 'none',
          boxShadow: 'inset 0 0 0 1px rgba(80,80,88,.7),inset 0 2px 0 rgba(255,255,255,.24)',
          background: 'linear-gradient(180deg,rgba(255,255,255,.04) 0%,transparent 14%,transparent 86%,rgba(255,255,255,.025) 100%)',
        }} />
        {/* Buttons */}
        <div style={btnStyle('left', 176, 76)} />
        <div style={btnStyle('right', 194, 62)} />
        {/* Screen */}
        <div style={{
          position: 'absolute', left: SX, top: ST, width: SW, height: SH,
          borderRadius: SR, overflow: 'hidden', background: '#000',
        }}>
          {screens}
          {/* Punch-hole camera */}
          <div style={{
            position: 'absolute', top: 13, left: '50%', transform: 'translateX(-50%)',
            width: 13, height: 13, borderRadius: '50%', background: '#000', zIndex: 50,
            boxShadow: '0 0 0 1.5px rgba(255,255,255,.07)',
          }}>
            <div style={{
              position: 'absolute', inset: 2, borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%,#1e2830,#080c10)',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.04)',
            }} />
          </div>
          {/* Glass sheen */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: SR, zIndex: 55, pointerEvents: 'none',
            background: 'linear-gradient(135deg,rgba(255,255,255,.045) 0%,rgba(255,255,255,.015) 30%,transparent 55%)',
          }} />
        </div>
        {/* USB-C */}
        <div style={{
          position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)',
          width: 46, height: 6, borderRadius: 3, zIndex: 5,
          background: 'rgba(0,0,0,.7)',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,.9),0 1px 0 rgba(255,255,255,.04)',
        }} />
        {/* Speaker dots */}
        {(['left','right'] as const).map(side => (
          <div key={side} style={{
            position: 'absolute', bottom: 12, left: '50%',
            marginLeft: side==='left' ? -76 : 52,
            display: 'flex', gap: 5, zIndex: 5,
          }}>
            {[0,1,2,3,4,5].map(i => (
              <div key={i} style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,.08)' }} />
            ))}
          </div>
        ))}
      </div>
    </div>,
    document.body
  )
}

function SuperAppSection() {
  const [screen,   setScreen  ] = useState<AppScreen>('home')
  const [device,   setDevice  ] = useState<DeviceType>('iphone')
  const [appTheme, setAppTheme] = useState<AppTheme>('dark')
  const [storyIdx, setStoryIdx] = useState(0)
  const [simMode,  setSimMode ] = useState(false)
  const [simScreen,setSimScreen] = useState<AppScreen>('home')
  const [simStory, setSimStory ] = useState(0)
  const [isDesktop,setIsDesktop] = useState(false)
  const t = THEME_MAP[appTheme]

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    setIsDesktop(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const groups = ['App','Chat']

  const openStory = (idx: number) => { setStoryIdx(idx); setScreen('story') }
  const goPrevStory = () => storyIdx > 0 ? setStoryIdx(i => i - 1) : setScreen('home')
  const goNextStory = () => storyIdx < APP_STORIES.length - 1 ? setStoryIdx(i => i + 1) : setScreen('home')

  const openSimStory = (idx: number) => { setSimStory(idx); setSimScreen('story') }
  const simPrevStory = () => { if (simStory > 0) setSimStory(i => i - 1); else setSimScreen('home') }
  const simNextStory = () => { if (simStory < APP_STORIES.length - 1) setSimStory(i => i + 1); else setSimScreen('home') }

  const screenProps = { t, device, onNav: setScreen }
  const simProps    = { t: THEME_MAP[appTheme], device, onNav: setSimScreen }

  const enterSim = () => { setSimScreen('home'); setSimMode(true) }
  const exitSim  = () => setSimMode(false)

  return (
    <div>
      <SectionHeader eyebrow="Mo.one App — 13" title="SuperApp UI"
        desc="Design systém v akci. Přepínej zařízení, světlý/tmavý režim a obrazovky." />

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        {/* Device */}
        <div className="flex rounded-xl border border-border overflow-hidden text-sm">
          {(['iphone','samsung'] as DeviceType[]).map(d => (
            <button key={d} onClick={() => setDevice(d)}
              className={cn('px-3 py-1.5 font-medium transition-colors',
                device === d ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted')}>
              {d === 'iphone' ? 'iPhone 17 Pro' : 'Samsung S26'}
            </button>
          ))}
        </div>
        {/* Theme */}
        <div className="flex rounded-xl border border-border overflow-hidden text-sm">
          {(['dark','light'] as AppTheme[]).map(th => (
            <button key={th} onClick={() => setAppTheme(th)}
              className={cn('px-3 py-1.5 font-medium transition-colors flex items-center gap-1.5',
                appTheme === th ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted')}>
              <span>{th === 'dark' ? '◾' : '◽'}</span>
              <span className="capitalize">{th}</span>
            </button>
          ))}
        </div>
        {/* Simulace CTA */}
        <button onClick={enterSim}
          className="flex items-center gap-2 bg-reward hover:bg-reward/90 active:bg-reward/80 text-white font-bold text-sm px-4 py-1.5 rounded-xl transition-colors">
          <Smartphone className="h-4 w-4" />
          Simulace
        </button>
      </div>

      {/* Screen tabs by group */}
      <div className="flex flex-wrap gap-2 mb-6">
        {groups.map(g => (
          <div key={g} className="flex items-center gap-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mr-1">{g}</span>
            {SCREEN_TABS.filter(s => s.group === g).map(s => (
              <button key={s.id} onClick={() => setScreen(s.id)}
                className={cn('px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
                  screen === s.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent')}>
                {s.label}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* ── Desktop simulation — device frame modal ──────────────── */}
      {simMode && isDesktop && (
        <DesktopDeviceModal
          device={device} theme={appTheme}
          simScreen={simScreen} setSimScreen={setSimScreen}
          simStory={simStory} setSimStory={setSimStory}
          openSimStory={openSimStory}
          simPrevStory={simPrevStory} simNextStory={simNextStory}
          onClose={exitSim}
        />
      )}

      {/* ── Mobile simulation — full-screen portal using system status bar ────
           PhoneStatusBar returns null when isSim=true, so the real device
           status bar is visible. paddingTop pushes content below it.      */}
      {simMode && !isDesktop && createPortal(
        <SimContext.Provider value={true}>
          <div className="fixed inset-0 z-[9999] bg-zinc-950 flex flex-col"
            style={{ paddingTop: 'env(safe-area-inset-top, 0px)', height: '100dvh' }}>
            {simScreen === 'home'           && <HomeScreen           {...simProps} onOpenStory={openSimStory} onProfileExit={exitSim} />}
            {simScreen === 'trziste'        && <TrzisteScreen        {...simProps} onProfileExit={exitSim} />}
            {simScreen === 'detail'         && <DetailScreen         {...simProps} onProfileExit={exitSim} />}
            {simScreen === 'chaty'          && <ChatyScreen          {...simProps} onProfileExit={exitSim} />}
            {simScreen === 'chat'           && <ChatScreen           {...simProps} onProfileExit={exitSim} />}
            {simScreen === 'payment-create' && <PaymentCreateScreen  {...simProps} onProfileExit={exitSim} />}
            {simScreen === 'contacts'       && <ContactsScreen       {...simProps} onProfileExit={exitSim} />}
            {simScreen === 'story'          && APP_STORIES[simStory] && (
              <StoryScreen key={simStory} story={APP_STORIES[simStory]!}
                idx={simStory} total={APP_STORIES.length} t={THEME_MAP[appTheme]} device={device}
                onPrev={simPrevStory} onNext={simNextStory} onClose={() => setSimScreen('home')} />
            )}
          </div>
        </SimContext.Provider>,
        document.body
      )}

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Phone */}
        <div className="shrink-0 mx-auto lg:mx-0">
          <PhoneFrame device={device} theme={appTheme}>
            {screen === 'home'           && <HomeScreen           {...screenProps} onOpenStory={openStory} />}
            {screen === 'trziste'        && <TrzisteScreen        {...screenProps} />}
            {screen === 'detail'         && <DetailScreen         {...screenProps} />}
            {screen === 'chaty'          && <ChatyScreen          {...screenProps} />}
            {screen === 'chat'           && <ChatScreen           {...screenProps} />}
            {screen === 'payment-create' && <PaymentCreateScreen  {...screenProps} />}
            {screen === 'contacts'       && <ContactsScreen       {...screenProps} />}
            {screen === 'story'          && APP_STORIES[storyIdx] && (
              <StoryScreen key={storyIdx} story={APP_STORIES[storyIdx]!}
                idx={storyIdx} total={APP_STORIES.length} t={t} device={device}
                onPrev={goPrevStory} onNext={goNextStory} onClose={() => setScreen('home')} />
            )}
          </PhoneFrame>
          <div className="flex justify-center mt-3">
            <div className={cn('h-1 rounded-full w-24', device === 'iphone' ? 'bg-zinc-700' : 'bg-zinc-800')} />
          </div>
          <div className="text-center mt-2">
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
              {device === 'iphone' ? 'iPhone 17 Pro — Dynamic Island' : 'Samsung S26 — Punch-hole'}
            </span>
          </div>
        </div>

        {/* Annotations */}
        <div className="flex-1 space-y-4">
          <Card>
            <CardLabel>Dual-color semantic v akci</CardLabel>
            <div className="space-y-3">
              {[
                { dot:'bg-blue-500', label:'Modrá — interakce', items:['Bottom nav aktivní tab','CTA: OBJEDNAT, VYTVOŘIT','Stories border (nový obsah)','+130 Stardust badge','Filter pills: aktivní stav'] },
                { dot:'bg-green-400', label:'Zelená — odměna',  items:['Stardust progress bar (glow)','Zaplaceno badge v chatu','Streak / earned badges','Příchozí zůstatek v účtu'] },
              ].map(({ dot, label, items }) => (
                <div key={label}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className={cn('w-2.5 h-2.5 rounded-full shrink-0', dot)} />
                    <span className="text-sm font-semibold">{label}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 ml-4">
                    {items.map(it => <span key={it} className="text-[11px] bg-muted text-muted-foreground rounded-md px-2 py-0.5">{it}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <CardLabel>Zařízení & OS adaptace</CardLabel>
            <div className="space-y-2 text-[12px]">
              {[
                { label:'iPhone 17 Pro', val:'Dynamic Island (110×30px pill) · rounded-[48px] · iOS status bar (time left, battery right) · bottom home indicator' },
                { label:'Samsung S26',  val:'Punch-hole kamera (10px circle) · rounded-[36px] · Android status bar (time left, icons right) · bez home indicator' },
              ].map(({ label, val }) => (
                <div key={label}>
                  <span className="font-semibold">{label} — </span>
                  <span className="text-muted-foreground">{val}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <CardLabel>Chat & platby — design pravidla</CardLabel>
            <div className="space-y-1.5 text-[12px] text-muted-foreground">
              {[
                'Odeslané zprávy: bg-blue-600, right-aligned, border-radius bez pravého dolního rohu',
                'Přijaté zprávy: surface barva, left-aligned, border-radius bez levého dolního rohu',
                'Payment bubble: surface karta → velká částka → zelené Zaplaceno badge',
                'Platba v chatu: + tlačítko (modrý kruh) otevírá menu → Vytvořit platbu',
                'Kontakty: message (modrá) + add-user (muted) — akce vpravo od jména',
              ].map((tip, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-primary font-mono shrink-0">→</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function ApplicationsSection() {
  return (
    <div>
      <SectionHeader eyebrow="Holding — 15" title="Aplikace identity" desc="Kde a jak se identita Mo.one projevuje." />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { icon: <Smartphone className="h-5 w-5" />,   title: 'Digitální produkty',    desc: 'Mo.one App, Hunter Zone, POS, Hub, CZKT wallet. Jednotný design token set. Dark-first. Modrá = interakce, Zelená = odměna.' },
          { icon: <Printer className="h-5 w-5" />,      title: 'Dokumenty & tiskoviny', desc: 'Investor materials, ČNB dokumentace, smlouvy. Šablona v Notion + Google Docs.' },
          { icon: <Presentation className="h-5 w-5" />, title: 'Prezentace',            desc: 'Investor pitch, franchise prezentace, ČNB. Keynote + Slides šablony. Cover slide vždy černá.' },
          { icon: <Monitor className="h-5 w-5" />,      title: 'Terminály & fyzické',   desc: 'Legi.one POS terminály, NFC štítky, merchandising. Co-branding pro Hunter síť.' },
          { icon: <Megaphone className="h-5 w-5" />,    title: 'Social & marketing',    desc: 'Instagram, LinkedIn, Prima ROK kreativy. Grid konzistentní s brand barvami.' },
          { icon: <Mail className="h-5 w-5" />,         title: 'Email komunikace',      desc: 'Transaktionální (Resend) + marketingové (Brevo). HTML šablony, podpis email template.' },
        ].map(({ icon, title, desc }) => (
          <Card key={title}>
            <div className="text-primary mb-3">{icon}</div>
            <CardLabel>{title}</CardLabel>
            <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ── Root ──────────────────────────────────────────────────────────
export function CiEditorPage() {
  const [active, setActive] = useState<Section>('mission')
  const [editMode, setEditMode] = useState(false)
  const { data, save, reset } = useCiStore()
  const { t } = useTranslation()

  const SIDEBAR: { label: string; items: { id: Section; name: string }[] }[] = [
    { label: t('ci_section_brand_core'), items: [
      { id: 'mission',     name: t('ci_nav_mission') },
      { id: 'values',      name: t('ci_nav_values') },
      { id: 'positioning', name: t('ci_nav_positioning') },
      { id: 'voice',       name: t('ci_nav_voice') },
      { id: 'microcopy',   name: t('ci_nav_microcopy') },
    ]},
    { label: t('ci_section_visual'), items: [
      { id: 'logo',        name: t('ci_nav_logo') },
      { id: 'colors',      name: t('ci_nav_colors') },
      { id: 'typography',  name: t('ci_nav_typography') },
      { id: 'iconography', name: t('ci_nav_iconography') },
    ]},
    { label: t('ci_section_design'), items: [
      { id: 'spacing',    name: t('ci_nav_spacing') },
      { id: 'motion',     name: t('ci_nav_motion') },
      { id: 'components', name: t('ci_nav_components') },
      { id: 'imagery',    name: t('ci_nav_photography') },
    ]},
    { label: t('ci_section_app'), items: [
      { id: 'superapp',      name: t('ci_nav_superapp') },
      { id: 'experimental',  name: 'Dashboard Lab' },
      { id: 'uxflows',       name: 'UX Flow Simulator' },
    ]},
    { label: t('ci_section_holding'), items: [
      { id: 'entities',     name: t('ci_nav_entities') },
      { id: 'applications', name: t('ci_nav_applications') },
    ]},
  ]

  const sectionProps: SectionProps = { editMode, data, save }

  const SECTION_MAP: Record<Section, React.ReactNode> = {
    mission:      <MissionSection     {...sectionProps} />,
    values:       <ValuesSection      {...sectionProps} />,
    positioning:  <PositioningSection {...sectionProps} />,
    voice:        <VoiceSection       {...sectionProps} />,
    microcopy:    <MicrocopySection />,
    logo:         <LogoSection />,
    colors:       <ColorsSection />,
    typography:   <TypographySection />,
    iconography:  <IconographySection />,
    spacing:      <SpacingSection />,
    motion:       <MotionSection />,
    components:   <ComponentsSection />,
    imagery:      <ImagerySection />,
    superapp:      <SuperAppSection />,
    experimental:  <ExperimentalSection />,
    uxflows:       <UxFlowSection />,
    entities:      <EntitiesSection />,
    applications: <ApplicationsSection />,
  }

  const editableSections = new Set<Section>(['mission', 'values', 'positioning', 'voice'] as Section[])

  return (
    <div className="flex h-full flex-col md:flex-row">
      {/* ── Mobile: horizontal pill nav ───────────────────────── */}
      <div className="md:hidden shrink-0 border-b border-border bg-background">
        <div className="flex overflow-x-auto gap-px px-3 py-2 no-scrollbar">
          {SIDEBAR.flatMap(g => g.items).map(({ id, name }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={cn(
                'shrink-0 px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors',
                active === id
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {name}
            </button>
          ))}
        </div>
        {/* Mobile edit button */}
        <div className="flex gap-2 px-3 pb-2">
          <button
            onClick={() => setEditMode(!editMode)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors',
              editMode ? 'bg-foreground text-background' : 'border border-border text-muted-foreground',
            )}
          >
            {editMode ? <><Check className="h-3 w-3" /> Hotovo</> : <><Pencil className="h-3 w-3" /> Editovat</>}
          </button>
        </div>
      </div>

      {/* ── Desktop: inner sidebar ─────────────────────────────── */}
      <aside className="hidden md:flex w-48 flex-shrink-0 border-r border-border overflow-y-auto py-4 flex-col">
        <div className="flex-1 px-2">
          {SIDEBAR.map((group) => (
            <div key={group.label} className="mb-3">
              <p className="label-caps px-2 mb-1">{group.label}</p>
              {group.items.map(({ id, name }) => (
                <button
                  key={id}
                  onClick={() => setActive(id)}
                  className={cn(
                    'w-full flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-left transition-colors rounded',
                    active === id
                      ? 'bg-card text-foreground border border-border shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-card/60',
                  )}
                >
                  {name}
                  {editableSections.has(id) && editMode && (
                    <Pencil className="h-2.5 w-2.5 ml-auto text-primary/60" />
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="px-3 pb-4 pt-2 border-t border-border mt-2 space-y-2">
          <button
            onClick={() => setEditMode(!editMode)}
            className={cn(
              'w-full flex items-center justify-center gap-2 py-1.5 rounded text-xs font-medium transition-colors',
              editMode
                ? 'bg-foreground text-background'
                : 'border border-border text-muted-foreground hover:text-foreground hover:bg-muted',
            )}
          >
            {editMode ? <><Check className="h-3.5 w-3.5" /> {t('ci_saved')}</> : <><Pencil className="h-3.5 w-3.5" /> {t('ci_save')}</>}
          </button>
          {editMode && (
            <button
              onClick={() => { if (confirm(t('cancel'))) { reset(); setEditMode(false) } }}
              className="w-full flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              <RotateCcw className="h-3 w-3" /> {t('reset_request_new')}
            </button>
          )}
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 max-w-4xl">
        {editMode && editableSections.has(active) && (
          <div className="mb-4 flex items-center gap-2 px-4 py-2.5 rounded border border-border bg-card text-xs text-muted-foreground">
            <Pencil className="h-3.5 w-3.5 flex-shrink-0" />
            {t('ci_subtitle')}
          </div>
        )}
        {SECTION_MAP[active]}
      </main>
    </div>
  )
}
