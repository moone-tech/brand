// =============================================================================
// UxFlowSection.tsx — UX/UI Flow Simulator based on Mo.one Design Bible v1.0
// Interactive step-through mockups of all core SuperApp user journeys
// =============================================================================

import { useState } from 'react'
import {
  Fingerprint, CreditCard, Smartphone, Wifi, Battery, Star, ChevronRight, ChevronLeft,
  MapPin, MessageCircle, Phone, Video, ShoppingBag, Car, Bike, Lock, Unlock, Bell,
  Heart, Share2, ArrowUpRight, ArrowDownLeft, Zap, Shield, QrCode, Nfc, Radio,
  Trophy, Flame, Gift, Camera, Play, Send, Navigation, Clock, CheckCircle2,
  Home, User, Download, Sparkles, Eye, Volume2, Activity,
} from 'lucide-react'
import { cn } from '@/lib/cn'

// ── Types & tokens ─────────────────────────────────────────────────

interface FlowStep {
  title: string
  subtitle: string
  render: () => React.ReactNode
}

interface Flow {
  id: string
  module: string
  title: string
  phase: string
  jtbd: string
  sharingMoment: string
  tech: string[]
  color: string
  Icon: React.ElementType
  steps: FlowStep[]
}

const BG = 'bg-zinc-950'
const SURF = 'bg-zinc-900'
const BORD = 'border-zinc-800'
const TXT = 'text-white'
const MUT = 'text-zinc-400'

// ── Shared phone chrome ────────────────────────────────────────────

function SBar() {
  return (
    <div className={cn('relative flex items-center justify-between px-5 shrink-0', BG)} style={{ height: 44, paddingTop: 12 }}>
      <span className={cn('text-[11px] font-semibold z-20', TXT)}>9:41</span>
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 bg-black rounded-full" style={{ width: 108, height: 30 }} />
      <div className="flex items-center gap-1 z-20">
        <Wifi size={10} className={TXT} />
        <Battery size={10} className={TXT} />
      </div>
    </div>
  )
}

function PhoneMock({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn('relative overflow-hidden mx-auto rounded-[48px] border-[2.5px] border-zinc-700 shadow-2xl', BG)} style={{ width: 320, height: 640 }}>
      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-30 bg-black rounded-full" style={{ width: 108, height: 30 }} />
      {children}
    </div>
  )
}

function Chip({ Icon, label, color }: { Icon: React.ElementType; label: string; color: string }) {
  return (
    <div className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-lg', color)}>
      <Icon size={11} className="text-white" />
      <span className="text-[10px] font-semibold text-white">{label}</span>
    </div>
  )
}

function ActionBtn({ label, primary = false }: { label: string; primary?: boolean }) {
  return (
    <div className={cn('flex-1 py-2.5 rounded-xl text-center', primary ? 'bg-blue-600' : SURF)}>
      <p className={cn('text-[11px] font-bold', primary ? 'text-white' : MUT)}>{label}</p>
    </div>
  )
}

// ── Flow step screens ──────────────────────────────────────────────

// FLOW 1: A2A Payment
const a2aPayment: Flow = {
  id: 'a2a', module: 'III. Platby', title: 'A2A Platba', phase: 'Phase 1 — RN',
  jtbd: 'Zbavit se tření mezi záměrem a transakcí. Biometrie  NFC  konfety. Tři akce maximum.',
  sharingMoment: 'Post-payment: "Ušetřil jsi X Kč oproti kartě" + Stardust v reálném čase.',
  tech: ['react-native-biometrics', 'PIS API', 'Mo.one Backend', 'Haptic Feedback'],
  color: 'bg-blue-600', Icon: CreditCard,
  steps: [
    { title: 'Merchant Screen', subtitle: 'Uživatel vidí částku', render: () => (
      <div className={cn('flex flex-col h-full', BG)}>
        <SBar />
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/20 flex items-center justify-center mb-4">
            <ShoppingBag size={28} className="text-blue-400" />
          </div>
          <p className={MUT + ' text-[10px] uppercase tracking-widest mb-1'}>Santhia Coffee</p>
          <p className="text-white text-5xl font-bold tracking-tight mb-1">89,–</p>
          <p className={MUT + ' text-xs'}>CZK</p>
          <div className="mt-8 w-full"><ActionBtn label="Zaplatit Mo.one" primary /></div>
          <p className={MUT + ' text-[9px] mt-3'}>Poplatek 0,66 % · Kartou byste platili 1,5 %</p>
        </div>
      </div>
    )},
    { title: 'Biometrie', subtitle: 'FaceID / TouchID ověření', render: () => (
      <div className={cn('flex flex-col h-full', BG)}>
        <SBar />
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-24 h-24 rounded-full border-2 border-blue-500 flex items-center justify-center mb-6 animate-pulse">
            <Fingerprint size={44} className="text-blue-400" />
          </div>
          <p className="text-white text-lg font-bold mb-1">Potvrďte platbu</p>
          <p className={MUT + ' text-xs mb-2'}>89,– CZK pro Santhia Coffee</p>
          <div className="flex items-center gap-1.5 mt-2">
            <Shield size={12} className="text-green-400" />
            <p className="text-green-400 text-[10px] font-semibold">Secure Enclave ověření</p>
          </div>
        </div>
      </div>
    )},
    { title: 'Zpracování', subtitle: 'PIS API direct call', render: () => (
      <div className={cn('flex flex-col h-full', BG)}>
        <SBar />
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="relative w-20 h-20 mb-6">
            <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90 animate-spin" style={{ animationDuration: '2s' }}>
              <circle cx="40" cy="40" r="34" fill="none" stroke="#27272a" strokeWidth="6" />
              <circle cx="40" cy="40" r="34" fill="none" stroke="#3b82f6" strokeWidth="6" strokeDasharray="80 214" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap size={24} className="text-blue-400" />
            </div>
          </div>
          <p className="text-white text-sm font-bold mb-1">Zpracovávám platbu</p>
          <p className={MUT + ' text-[10px]'}>PIS API  CERTIS  Banka</p>
          <div className="mt-6 w-full space-y-2">
            {['Biometrie ověřena', 'PIS autorizace', 'Odesláno do CERTIS'].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-green-400" />
                <p className="text-[10px] text-zinc-300">{s}</p>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
              <p className="text-[10px] text-zinc-400">Potvrzení banky…</p>
            </div>
          </div>
        </div>
      </div>
    )},
    { title: 'Konfirmace', subtitle: 'Stardust + sharing moment', render: () => (
      <div className={cn('flex flex-col h-full', BG)}>
        <SBar />
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
            <CheckCircle2 size={32} className="text-green-400" />
          </div>
          <p className="text-white text-lg font-bold mb-1">Zaplaceno</p>
          <p className="text-white text-3xl font-bold tracking-tight">89,–</p>
          <p className={MUT + ' text-xs mt-1'}>Santhia Coffee</p>
          <div className="mt-4 flex items-center gap-2 bg-amber-500/15 px-3 py-1.5 rounded-full">
            <Star size={14} className="text-amber-400" />
            <p className="text-amber-300 text-[11px] font-bold">+18 Stardust</p>
          </div>
          <div className="mt-2 bg-green-500/10 px-3 py-1.5 rounded-full">
            <p className="text-green-400 text-[10px] font-semibold">Ušetřil jsi 0,75 Kč oproti kartě</p>
          </div>
          <div className="flex gap-2 mt-6 w-full">
            <ActionBtn label="Sdílet" />
            <ActionBtn label="Hotovo" primary />
          </div>
        </div>
      </div>
    )},
  ],
}

// FLOW 2: AppClip Acquisition
const appClipFlow: Flow = {
  id: 'appclip', module: 'XII. AppClip', title: 'AppClip Akvizice', phase: 'Phase 2 — Swift',
  jtbd: 'Zaplatit bez instalace. Každý Legi terminál = acquisition touchpoint. NFC tag  mini app  platba  install CTA.',
  sharingMoment: 'Post-payment výzva k instalaci + deep link pro sdílení.',
  tech: ['App Clip Framework', 'NFC Trigger', 'PassKit', 'Universal Links'],
  color: 'bg-violet-600', Icon: Nfc,
  steps: [
    { title: 'NFC Trigger', subtitle: 'Legi terminál s NFC tagem', render: () => (
      <div className={cn('flex flex-col h-full', BG)}>
        <SBar />
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-32 h-32 rounded-3xl border-2 border-dashed border-zinc-600 flex items-center justify-center mb-6">
            <Nfc size={48} className="text-violet-400 animate-pulse" />
          </div>
          <p className="text-white text-lg font-bold mb-1">Přiložte telefon</p>
          <p className={MUT + ' text-xs text-center leading-relaxed'}>Legi terminál s NFC tagem spustí Mo.one AppClip bez instalace</p>
          <div className="mt-4 flex items-center gap-1.5">
            <Radio size={12} className="text-violet-400" />
            <p className="text-violet-400 text-[10px] font-semibold">NFC detekováno</p>
          </div>
        </div>
      </div>
    )},
    { title: 'AppClip Load', subtitle: '<10 MB mini app, 3 sekundy', render: () => (
      <div className={cn('flex flex-col h-full', BG)}>
        <SBar />
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center mb-4">
            <p className="text-white text-2xl font-black">M</p>
          </div>
          <p className="text-white text-sm font-bold mb-1">Mo.one</p>
          <p className={MUT + ' text-[10px] mb-4'}>App Clip · 8.2 MB</p>
          <div className="w-48 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
            <div className="h-full w-3/4 rounded-full bg-violet-500" />
          </div>
          <p className={MUT + ' text-[9px] mt-2'}>Načítání… 3s</p>
        </div>
      </div>
    )},
    { title: 'Rychlá platba', subtitle: 'Zaplaťte jedním tapnutím', render: () => (
      <div className={cn('flex flex-col h-full', BG)}>
        <SBar />
        <div className="flex-1 px-5 pt-4 overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
              <p className="text-white text-sm font-black">M</p>
            </div>
            <div>
              <p className="text-white text-xs font-bold">Mo.one AppClip</p>
              <p className={MUT + ' text-[9px]'}>Santhia Coffee</p>
            </div>
          </div>
          <div className={cn('rounded-2xl p-5 text-center mb-4', SURF)}>
            <p className={MUT + ' text-[9px] uppercase tracking-widest mb-1'}>K úhradě</p>
            <p className="text-white text-4xl font-bold">89,–</p>
            <p className={MUT + ' text-xs'}>CZK</p>
          </div>
          <div className="bg-blue-600 rounded-xl py-3 text-center mb-3">
            <p className="text-white text-sm font-bold">Zaplatit přes Mo.one</p>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <Shield size={11} className="text-green-400" />
            <p className="text-[9px] text-zinc-500">ČNB licencovaná platební instituce</p>
          </div>
        </div>
      </div>
    )},
    { title: 'Install CTA', subtitle: 'Akvizice do full app', render: () => (
      <div className={cn('flex flex-col h-full', BG)}>
        <SBar />
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <CheckCircle2 size={40} className="text-green-400 mb-4" />
          <p className="text-white text-lg font-bold mb-1">Zaplaceno</p>
          <p className={MUT + ' text-xs mb-6'}>89,– CZK  Santhia Coffee</p>
          <div className={cn('w-full rounded-2xl p-4 mb-3 border', SURF, BORD)}>
            <p className="text-white text-xs font-bold mb-1">Stáhněte Mo.one</p>
            <p className={MUT + ' text-[10px] leading-relaxed mb-3'}>Platby, cashback, Stardust odměny a 330+ obchodníků na jednom místě.</p>
            <div className="bg-blue-600 rounded-xl py-2.5 text-center">
              <p className="text-white text-[11px] font-bold">Stáhnout z App Store</p>
            </div>
          </div>
          <button className={MUT + ' text-[10px]'}>Teď ne</button>
        </div>
      </div>
    )},
  ],
}

// FLOW 3: Chat + Payment
const chatPaymentFlow: Flow = {
  id: 'chat', module: 'IV. Chat', title: 'Chat + Platba', phase: 'Phase 1 — RN',
  jtbd: 'Propojit se s kamarádem a v jednom flow zaplatit. Chat je kontext pro transakci.',
  sharingMoment: '"Díky tobě" sociální tipping. Příjemce dostane notifikaci s animací.',
  tech: ['CallKit/ConnectionService', 'WebRTC', 'PushKit', 'react-native-callkeep'],
  color: 'bg-sky-600', Icon: MessageCircle,
  steps: [
    { title: 'Konverzace', subtitle: 'Chat s payment shortcutem', render: () => (
      <div className={cn('flex flex-col h-full', BG)}>
        <SBar />
        <div className="flex items-center gap-3 px-4 py-2 shrink-0 border-b border-zinc-800">
          <ChevronLeft size={18} className={MUT} />
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">JK</div>
          <div className="flex-1">
            <p className="text-white text-xs font-bold">Jana Krátká</p>
            <p className={MUT + ' text-[9px]'}>online</p>
          </div>
          <Phone size={16} className={MUT} />
          <Video size={16} className={MUT} />
        </div>
        <div className="flex-1 px-4 py-3 space-y-3 overflow-hidden">
          <div className="flex justify-end"><div className="bg-blue-600 rounded-2xl rounded-br-sm px-3 py-2 max-w-[70%]"><p className="text-white text-[11px]">Díky za oběd! Kolik ti dlužím?</p></div></div>
          <div className="flex justify-start"><div className={cn('rounded-2xl rounded-bl-sm px-3 py-2 max-w-[70%]', SURF)}><p className="text-zinc-200 text-[11px]">185 Kč za oba</p></div></div>
          <div className="flex justify-end"><div className="bg-blue-600 rounded-2xl rounded-br-sm px-3 py-2 max-w-[70%]"><p className="text-white text-[11px]">Posílám!</p></div></div>
        </div>
        <div className="px-4 pb-3 pt-1 flex items-center gap-2 shrink-0">
          <div className={cn('flex-1 rounded-xl px-3 py-2', SURF)}><p className={MUT + ' text-[10px]'}>Zpráva…</p></div>
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
            <Send size={14} className="text-white" />
          </div>
          <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center">
            <CreditCard size={14} className="text-white" />
          </div>
        </div>
      </div>
    )},
    { title: 'Odeslat platbu', subtitle: 'Částka + potvrzení', render: () => (
      <div className={cn('flex flex-col h-full', BG)}>
        <SBar />
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-bold mb-3">JK</div>
          <p className="text-white text-xs font-semibold mb-4">Jana Krátká</p>
          <p className="text-white text-5xl font-bold tracking-tight mb-1">185,–</p>
          <p className={MUT + ' text-xs mb-6'}>CZK</p>
          <div className="flex gap-2 w-full">
            <ActionBtn label="Zrušit" />
            <ActionBtn label="Odeslat" primary />
          </div>
        </div>
      </div>
    )},
    { title: 'Odesláno', subtitle: 'Stardust + "Díky tobě" moment', render: () => (
      <div className={cn('flex flex-col h-full', BG)}>
        <SBar />
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <CheckCircle2 size={40} className="text-green-400 mb-3" />
          <p className="text-white text-lg font-bold mb-1">Odesláno</p>
          <p className="text-white text-2xl font-bold">185,–</p>
          <p className={MUT + ' text-xs mt-1 mb-4'}>Jana Krátká</p>
          <div className="flex items-center gap-2 bg-amber-500/15 px-3 py-1.5 rounded-full mb-4">
            <Star size={14} className="text-amber-400" />
            <p className="text-amber-300 text-[11px] font-bold">+37 Stardust</p>
          </div>
          <div className={cn('w-full rounded-2xl p-3 text-center', SURF)}>
            <p className="text-white text-[11px] font-semibold mb-1">Pošli "Díky tobě"</p>
            <p className={MUT + ' text-[9px]'}>Jana dostane animaci + Stardust bonus</p>
          </div>
        </div>
      </div>
    )},
  ],
}

// FLOW 4: Merchant Stories
const storiesFlow: Flow = {
  id: 'stories', module: 'V. Stories', title: 'Merchant Stories', phase: 'Phase 1 — RN',
  jtbd: 'Vědět, co se děje u obchodníků v okolí. Bez algoritmického feedu.',
  sharingMoment: 'Lokalizovaná akce shareovatelná přes deep link. Bez app = AppClip.',
  tech: ['AVPlayer/ExoPlayer', 'HLS', 'react-native-video', 'Prefetch'],
  color: 'bg-rose-600', Icon: Camera,
  steps: [
    { title: 'Stories Feed', subtitle: 'Obchodníci v okolí', render: () => (
      <div className={cn('flex flex-col h-full', BG)}>
        <SBar />
        <div className="px-4 pt-2 pb-3 shrink-0">
          <p className="text-white text-base font-bold mb-3">Stories</p>
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {[
              { n: 'Santhia', c: 'ring-rose-500' }, { n: 'Rock...', c: 'ring-blue-500' },
              { n: 'Halipres', c: 'ring-amber-500' }, { n: 'Albert', c: 'ring-green-500' },
              { n: 'Elegán', c: 'ring-violet-500' },
            ].map(s => (
              <div key={s.n} className="flex flex-col items-center gap-1 shrink-0">
                <div className={cn('w-14 h-14 rounded-full ring-2 p-0.5 bg-zinc-800', s.c)} />
                <p className="text-[8px] text-zinc-300">{s.n}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 px-4 space-y-3 overflow-hidden">
          <p className={MUT + ' text-[9px] font-bold uppercase tracking-widest'}>V okolí</p>
          {[
            { t: 'Santhia Coffee', s: 'Dnes 2x Stardust za ranní kávu', d: '120m' },
            { t: 'Rock Burger', s: 'Novinka: BBQ Smash menu', d: '350m' },
          ].map(m => (
            <div key={m.t} className={cn('rounded-xl p-3 flex items-center gap-3', SURF)}>
              <div className="w-12 h-12 rounded-xl bg-zinc-800 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-white text-[11px] font-semibold">{m.t}</p>
                <p className={MUT + ' text-[9px] truncate'}>{m.s}</p>
              </div>
              <p className={MUT + ' text-[9px] shrink-0'}>{m.d}</p>
            </div>
          ))}
        </div>
      </div>
    )},
    { title: 'Story View', subtitle: 'Full-screen merchant story', render: () => (
      <div className="flex flex-col h-full relative bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
        <SBar />
        <div className="absolute top-12 left-0 right-0 px-4 z-10">
          <div className="flex gap-1 mb-2">{[1,2,3].map(i => <div key={i} className={cn('flex-1 h-0.5 rounded-full', i===1?'bg-white':'bg-white/30')} />)}</div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-zinc-700 ring-2 ring-rose-500" />
            <p className="text-white text-[11px] font-semibold">Santhia Coffee</p>
            <p className="text-white/50 text-[9px]">2h</p>
          </div>
        </div>
        <div className="flex-1" />
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-6 z-10">
          <p className="text-white text-base font-bold mb-1">2x Stardust dnes</p>
          <p className="text-white/70 text-[10px] mb-3">Za každou platbu v Santhia dostanete dvojnásobek Stardust bodů. Jen dnes.</p>
          <div className="flex gap-2">
            <div className="flex-1 bg-blue-600 rounded-xl py-2.5 text-center">
              <p className="text-white text-[11px] font-bold">Navigovat  120m</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Share2 size={16} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    )},
  ],
}

// FLOW 5: Taxi / Live Activity
const taxiFlow: Flow = {
  id: 'taxi', module: 'VII. Taxi', title: 'Taxi + Live Activity', phase: 'Phase 2 — Swift',
  jtbd: 'Vědět kde je jízda a kdy přijede bez otevření app. Dynamic Island + Lock Screen.',
  sharingMoment: 'Post-ride: celková úspora oproti kartě + Stardust earned.',
  tech: ['ActivityKit', 'Dynamic Island', 'Background GPS', 'WebSocket'],
  color: 'bg-orange-600', Icon: Car,
  steps: [
    { title: 'Objednání', subtitle: 'Odkud  Kam', render: () => (
      <div className={cn('flex flex-col h-full', BG)}>
        <SBar />
        <div className="flex-1 px-4 pt-3 overflow-hidden">
          <p className="text-white text-base font-bold mb-3">Kam jedete?</p>
          <div className={cn('rounded-xl p-3 mb-3 space-y-2', SURF)}>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" /><p className="text-white text-[11px]">Smíchovské nádraží</p></div>
            <div className="h-px bg-zinc-700" />
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500" /><p className={MUT + ' text-[11px]'}>Kam?</p></div>
          </div>
          <p className={MUT + ' text-[9px] font-bold uppercase tracking-widest mb-2'}>Oblíbené</p>
          {['Domů  Praha 5', 'Kancelář  Karlín'].map(l => (
            <div key={l} className={cn('flex items-center gap-3 py-2.5 border-b last:border-0', BORD)}>
              <Clock size={14} className={MUT} />
              <p className="text-white text-[11px]">{l}</p>
            </div>
          ))}
        </div>
      </div>
    )},
    { title: 'Live Activity', subtitle: 'Dynamic Island — řidič blíží se', render: () => (
      <div className={cn('flex flex-col h-full', BG)}>
        {/* Custom status bar with live activity pill */}
        <div className={cn('relative flex items-center justify-between px-5 shrink-0', BG)} style={{ height: 56, paddingTop: 12 }}>
          <span className={cn('text-[11px] font-semibold z-20', TXT)}>9:41</span>
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 bg-zinc-800 rounded-full flex items-center px-3 gap-2" style={{ width: 200, height: 36 }}>
            <Car size={14} className="text-orange-400" />
            <p className="text-white text-[10px] font-semibold flex-1">Martin  2 min</p>
            <Navigation size={12} className="text-blue-400" />
          </div>
          <div className="flex items-center gap-1 z-20">
            <Wifi size={10} className={TXT} />
            <Battery size={10} className={TXT} />
          </div>
        </div>
        <div className="flex-1 px-4 pt-2 overflow-hidden">
          {/* Map placeholder */}
          <div className="rounded-2xl bg-zinc-800 h-48 flex items-center justify-center mb-3 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,_#3b82f6_1px,_transparent_1px)] bg-[size:20px_20px]" />
            <div className="flex flex-col items-center z-10">
              <Car size={24} className="text-orange-400 mb-1" />
              <p className="text-white text-[10px] font-bold">2 min</p>
            </div>
          </div>
          <div className={cn('rounded-xl p-3', SURF)}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-white text-sm font-bold">M</div>
              <div className="flex-1">
                <p className="text-white text-[11px] font-bold">Martin N.</p>
                <p className={MUT + ' text-[9px]'}>Škoda Octavia  2AB 1234</p>
              </div>
              <div className="flex gap-1.5">
                <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center"><Phone size={12} className={MUT} /></div>
                <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center"><MessageCircle size={12} className={MUT} /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )},
    { title: 'Auto-platba', subtitle: 'Platba + Stardust po jízdě', render: () => (
      <div className={cn('flex flex-col h-full', BG)}>
        <SBar />
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <CheckCircle2 size={36} className="text-green-400 mb-3" />
          <p className="text-white text-lg font-bold mb-1">Jízda dokončena</p>
          <p className="text-white text-3xl font-bold tracking-tight">187,–</p>
          <p className={MUT + ' text-xs mt-1'}>14 min  6.2 km</p>
          <div className="flex gap-2 mt-4">
            <Chip Icon={Star} label="+37 SD" color="bg-amber-500/20" />
            <Chip Icon={ArrowDownLeft} label="-12 Kč vs Bolt" color="bg-green-500/20" />
          </div>
          <div className={cn('w-full rounded-xl p-3 mt-4 text-center', SURF)}>
            <p className="text-white text-[10px] font-semibold">Zaplaceno automaticky Mo.one A2A</p>
          </div>
          <div className="flex gap-2 mt-4 w-full">
            <ActionBtn label="Sdílet" />
            <ActionBtn label="Hotovo" primary />
          </div>
        </div>
      </div>
    )},
  ],
}

// FLOW 6: BLE Micromobility
const bleFlow: Flow = {
  id: 'ble', module: 'X. Mikromobilita', title: 'BLE Unlock + Ride', phase: 'Phase 1 — RN',
  jtbd: 'Odemknout kolo/skútr a zaplatit v jedné app. BLE = unlock + payment v jednom.',
  sharingMoment: 'Post-ride: vzdálenost + úspora + Stardust. Shareovatelný tile.',
  tech: ['react-native-ble-plx', 'CoreBluetooth', 'Background BLE', 'Auto-charge'],
  color: 'bg-lime-600', Icon: Bike,
  steps: [
    { title: 'BLE Scan', subtitle: 'Skenování vozidel v okolí', render: () => (
      <div className={cn('flex flex-col h-full', BG)}>
        <SBar />
        <div className="flex-1 px-4 pt-3 overflow-hidden">
          <p className="text-white text-base font-bold mb-1">Mikromobilita</p>
          <p className={MUT + ' text-xs mb-4'}>Vozidla v okolí</p>
          <div className="relative h-40 rounded-2xl bg-zinc-800 mb-4 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,_#84cc16_1px,_transparent_1px)] bg-[size:24px_24px]" />
            <div className="flex flex-col items-center z-10">
              <Radio size={24} className="text-lime-400 animate-pulse" />
              <p className="text-[9px] text-zinc-400 mt-1">BLE skenování…</p>
            </div>
          </div>
          {['E-Koloběžka Mo.one  15m', 'E-Kolo Mo.one  45m'].map((v, i) => (
            <div key={v} className={cn('flex items-center gap-3 p-3 rounded-xl mb-2', SURF)}>
              <Bike size={18} className="text-lime-400" />
              <p className="text-white text-[11px] flex-1">{v}</p>
              <div className={cn('px-2 py-0.5 rounded-full text-[9px] font-bold', i===0?'bg-lime-500/20 text-lime-300':'bg-zinc-700 text-zinc-400')}>{i===0?'BLE':'BLE'}</div>
            </div>
          ))}
        </div>
      </div>
    )},
    { title: 'Odemčení', subtitle: 'BLE pairing + unlock', render: () => (
      <div className={cn('flex flex-col h-full', BG)}>
        <SBar />
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-24 h-24 rounded-full border-2 border-lime-400 flex items-center justify-center mb-4">
            <Unlock size={36} className="text-lime-400" />
          </div>
          <p className="text-white text-lg font-bold mb-1">Odemčeno</p>
          <p className={MUT + ' text-xs mb-4'}>E-Koloběžka  15m od vás</p>
          <div className={cn('w-full rounded-xl p-3 space-y-2', SURF)}>
            <div className="flex justify-between"><p className={MUT + ' text-[10px]'}>Baterie</p><p className="text-lime-300 text-[10px] font-bold">78 %</p></div>
            <div className="flex justify-between"><p className={MUT + ' text-[10px]'}>Cena</p><p className="text-white text-[10px] font-bold">2,50 Kč/min</p></div>
            <div className="flex justify-between"><p className={MUT + ' text-[10px]'}>Platba</p><p className="text-blue-400 text-[10px] font-bold">Mo.one A2A</p></div>
          </div>
          <div className="w-full mt-4"><ActionBtn label="Zahájit jízdu" primary /></div>
        </div>
      </div>
    )},
    { title: 'Konec jízdy', subtitle: 'BLE disconnect  auto-platba', render: () => (
      <div className={cn('flex flex-col h-full', BG)}>
        <SBar />
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <Lock size={28} className="text-zinc-400 mb-3" />
          <p className="text-white text-lg font-bold mb-1">Jízda ukončena</p>
          <p className="text-white text-3xl font-bold tracking-tight">42,50</p>
          <p className={MUT + ' text-xs mt-1'}>17 min  2.1 km</p>
          <div className="flex gap-2 mt-3">
            <Chip Icon={Star} label="+9 SD" color="bg-amber-500/20" />
            <Chip Icon={Activity} label="320 kcal" color="bg-rose-500/20" />
          </div>
          <div className="w-full mt-4"><ActionBtn label="Hotovo" primary /></div>
        </div>
      </div>
    )},
  ],
}

// FLOW 7: Tier Upgrade (Gamification)
const tierFlow: Flow = {
  id: 'tier', module: 'IX. Gamifikace', title: 'Tier Upgrade', phase: 'Phase 1 — RN',
  jtbd: 'Cítit, že platím chytře a jsem odměněn. Neviditelná gamifikace.',
  sharingMoment: 'Tier upgrade = full-screen animace + konfety + shareovatelná karta.',
  tech: ['CoreHaptics', 'Lottie', 'react-native-reanimated', 'Local Notifications'],
  color: 'bg-amber-500', Icon: Trophy,
  steps: [
    { title: 'Progress', subtitle: 'Blížící se tier upgrade', render: () => (
      <div className={cn('flex flex-col h-full', BG)}>
        <SBar />
        <div className="flex-1 px-5 pt-3 overflow-hidden">
          <p className="text-white text-base font-bold mb-4">Stardust</p>
          <div className="flex flex-col items-center mb-4">
            <div className="relative w-28 h-28">
              <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
                <circle cx="64" cy="64" r="56" fill="none" stroke="#27272a" strokeWidth="8" />
                <circle cx="64" cy="64" r="56" fill="none" stroke="#eab308" strokeWidth="8" strokeDasharray={`${2*Math.PI*56*0.92} ${2*Math.PI*56}`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Star size={16} className="text-amber-400 mb-0.5" />
                <p className="text-white text-lg font-bold">14 250</p>
                <p className={MUT + ' text-[8px]'}>/ 15 000</p>
              </div>
            </div>
          </div>
          <div className={cn('rounded-xl p-3 text-center mb-3', SURF)}>
            <p className="text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-1">Gold  Silver</p>
            <p className="text-white text-xs">Chybí 750 Stardust</p>
            <p className={MUT + ' text-[9px] mt-0.5'}>3 platby u obchodníka</p>
          </div>
          <div className={cn('rounded-xl p-3', SURF)}>
            <div className="flex items-center gap-2 mb-2">
              <Flame size={14} className="text-orange-400" />
              <p className="text-white text-[11px] font-bold">7 dní streak</p>
            </div>
            <p className={MUT + ' text-[9px]'}>Zaplať oběd a udržíš sérii</p>
          </div>
        </div>
      </div>
    )},
    { title: 'Upgrade', subtitle: 'Bronze  Silver moment', render: () => (
      <div className="flex flex-col h-full bg-gradient-to-b from-zinc-900 via-amber-950/30 to-zinc-900">
        <SBar />
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center mb-4 shadow-lg shadow-amber-500/30">
            <Trophy size={40} className="text-white" />
          </div>
          <p className="text-amber-300 text-[10px] uppercase tracking-widest font-bold mb-1">Nový tier</p>
          <p className="text-white text-3xl font-black tracking-tight mb-1">SILVER</p>
          <p className={MUT + ' text-xs mb-4'}>15 000 Stardust dosaženo</p>
          <div className="flex gap-3 mb-4">
            <div className="text-center"><p className="text-white text-lg font-bold">2.8%</p><p className={MUT + ' text-[8px]'}>Cashback</p></div>
            <div className="w-px bg-zinc-700" />
            <div className="text-center"><p className="text-white text-lg font-bold">47</p><p className={MUT + ' text-[8px]'}>Plateb</p></div>
            <div className="w-px bg-zinc-700" />
            <div className="text-center"><p className="text-white text-lg font-bold">3.2k</p><p className={MUT + ' text-[8px]'}>Ušetřeno</p></div>
          </div>
          <div className="flex gap-2 w-full">
            <div className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/10">
              <Share2 size={14} className="text-white" />
              <p className="text-white text-[11px] font-bold">Sdílet</p>
            </div>
            <ActionBtn label="Pokračovat" primary />
          </div>
        </div>
      </div>
    )},
  ],
}

// FLOW 8: Offline CZKT
const czktFlow: Flow = {
  id: 'czkt', module: 'VIII. CZKT', title: 'Offline CZKT Platba', phase: 'Phase 2 — Native',
  jtbd: 'Platit CZKT tak snadno jako Apple Pay. Bezpečnostní tření = 0. Vše pod 2 sekundy.',
  sharingMoment: 'Offline platba funguje i v metru. "Zkus zaplatit kartou bez signálu."',
  tech: ['Secure Enclave', 'CryptoKit', 'HSM Counter', 'Nonce Replay Protection'],
  color: 'bg-emerald-600', Icon: Shield,
  steps: [
    { title: 'Offline detekce', subtitle: 'Bez připojení  CZKT mode', render: () => (
      <div className={cn('flex flex-col h-full', BG)}>
        <div className={cn('relative flex items-center justify-between px-5 shrink-0', BG)} style={{ height: 44, paddingTop: 12 }}>
          <span className="text-[11px] font-semibold z-20 text-white">9:41</span>
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 bg-black rounded-full" style={{ width: 108, height: 30 }} />
          <div className="flex items-center gap-1 z-20">
            <p className="text-[9px] text-orange-400 font-bold">Offline</p>
            <Battery size={10} className="text-white" />
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-4">
            <Shield size={28} className="text-emerald-400" />
          </div>
          <p className="text-white text-lg font-bold mb-1">CZKT Offline</p>
          <p className={MUT + ' text-xs text-center mb-4'}>Můžete platit i bez internetu. Secure Enclave chrání transakce.</p>
          <div className={cn('w-full rounded-xl p-3 space-y-2', SURF)}>
            <div className="flex justify-between"><p className={MUT + ' text-[10px]'}>Offline limit</p><p className="text-white text-[10px] font-bold">500,– Kč</p></div>
            <div className="flex justify-between"><p className={MUT + ' text-[10px]'}>Využito</p><p className="text-emerald-300 text-[10px] font-bold">89,– Kč</p></div>
            <div className="flex justify-between"><p className={MUT + ' text-[10px]'}>Zbývá</p><p className="text-white text-[10px] font-bold">411,– Kč</p></div>
          </div>
        </div>
      </div>
    )},
    { title: 'HSM podpis', subtitle: 'Biometrie  Secure Enclave  nonce', render: () => (
      <div className={cn('flex flex-col h-full', BG)}>
        <SBar />
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-20 h-20 rounded-full border-2 border-emerald-400 flex items-center justify-center mb-4">
            <Fingerprint size={36} className="text-emerald-400" />
          </div>
          <p className="text-white text-sm font-bold mb-4">Offline platba 120,–</p>
          <div className="w-full space-y-2">
            {[
              { l: 'Biometrie', done: true },
              { l: 'HSM podpis (Secure Enclave)', done: true },
              { l: 'Nonce generován', done: true },
              { l: 'Transakce podepsána', done: false },
            ].map(s => (
              <div key={s.l} className="flex items-center gap-2">
                {s.done ? <CheckCircle2 size={14} className="text-emerald-400" /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />}
                <p className={cn('text-[10px]', s.done ? 'text-zinc-300' : 'text-zinc-500')}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )},
    { title: 'Offline potvrzení', subtitle: 'Sync při reconnect', render: () => (
      <div className={cn('flex flex-col h-full', BG)}>
        <SBar />
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <CheckCircle2 size={36} className="text-emerald-400 mb-3" />
          <p className="text-white text-lg font-bold mb-1">Offline zaplaceno</p>
          <p className="text-white text-2xl font-bold">120,–</p>
          <p className={MUT + ' text-[10px] mt-1 mb-4'}>Sync proběhne automaticky při připojení</p>
          <div className={cn('w-full rounded-xl p-3 space-y-1.5', SURF)}>
            <p className={MUT + ' text-[9px] font-bold uppercase tracking-widest'}>Bezpečnostní vrstva</p>
            <div className="flex items-center gap-1.5"><Shield size={10} className="text-emerald-400" /><p className="text-[9px] text-zinc-300">HSM klíč — nelze extrahovat</p></div>
            <div className="flex items-center gap-1.5"><Lock size={10} className="text-emerald-400" /><p className="text-[9px] text-zinc-300">Unique nonce — replay protection</p></div>
            <div className="flex items-center gap-1.5"><Eye size={10} className="text-emerald-400" /><p className="text-[9px] text-zinc-300">Counter — server ověří při syncu</p></div>
          </div>
        </div>
      </div>
    )},
  ],
}

// ── All flows ──────────────────────────────────────────────────────

const FLOWS: Flow[] = [
  a2aPayment, appClipFlow, chatPaymentFlow, storiesFlow,
  taxiFlow, bleFlow, tierFlow, czktFlow,
]

// ── Main export ────────────────────────────────────────────────────

export function UxFlowSection() {
  const [selectedFlow, setSelectedFlow] = useState(0)
  const [step, setStep] = useState(0)

  const flow = FLOWS[selectedFlow]!
  const currentStep = flow.steps[step]!
  const totalSteps = flow.steps.length

  function selectFlow(i: number) {
    setSelectedFlow(i)
    setStep(0)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 pb-5 border-b border-border">
        <p className="label-caps mb-2">Mo.one App — 17</p>
        <h1 className="text-2xl font-semibold mb-2">UX Flow Simulator</h1>
        <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
          Interaktivní průchod klíčovými user journeys z Design Bible v1.0.
          Každý flow mapuje JTBD, tech stack a Sharing Moment.
        </p>
      </div>

      {/* Flow selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
        {FLOWS.map((f, i) => (
          <button
            key={f.id}
            onClick={() => selectFlow(i)}
            className={cn(
              'text-left p-3 rounded-xl border transition-all',
              selectedFlow === i
                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                : 'border-border hover:border-primary/40 hover:bg-muted/30',
            )}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className={cn('w-6 h-6 rounded-md flex items-center justify-center', f.color)}>
                <f.Icon size={12} className="text-white" />
              </div>
              <span className="text-[8px] font-bold text-muted-foreground">{f.phase}</span>
            </div>
            <p className="text-xs font-semibold leading-tight">{f.title}</p>
          </button>
        ))}
      </div>

      {/* Phone + step nav + info */}
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Phone + controls */}
        <div className="shrink-0 mx-auto lg:mx-0">
          <PhoneMock>{currentStep.render()}</PhoneMock>

          {/* Step indicator + nav */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
              className="p-2 rounded-lg border border-border disabled:opacity-20 hover:bg-muted/30 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex gap-1.5">
              {flow.steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  className={cn('w-2 h-2 rounded-full transition-colors', i === step ? 'bg-primary' : 'bg-border')}
                />
              ))}
            </div>
            <button
              onClick={() => setStep(s => Math.min(totalSteps - 1, s + 1))}
              disabled={step === totalSteps - 1}
              className="p-2 rounded-lg border border-border disabled:opacity-20 hover:bg-muted/30 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <p className="text-center text-[10px] text-muted-foreground mt-2 uppercase tracking-widest">
            {step + 1}/{totalSteps} — {currentStep.title}
          </p>
        </div>

        {/* Flow info */}
        <div className="flex-1 space-y-4">
          {/* Current step */}
          <div className="border border-border bg-card rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', flow.color)}>
                <flow.Icon size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold">{flow.title}</h2>
                <p className="text-xs text-muted-foreground">{flow.module} — {flow.phase}</p>
              </div>
            </div>
            <div className="space-y-1 mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Krok {step + 1}: {currentStep.title}</p>
              <p className="text-sm">{currentStep.subtitle}</p>
            </div>
          </div>

          {/* JTBD */}
          <div className="border border-border bg-card rounded-xl p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Jobs to be Done</p>
            <p className="text-sm leading-relaxed">{flow.jtbd}</p>
          </div>

          {/* Sharing Moment */}
          <div className="border border-border bg-card rounded-xl p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Sharing Moment</p>
            <p className="text-sm leading-relaxed">{flow.sharingMoment}</p>
          </div>

          {/* Tech Stack */}
          <div className="border border-border bg-card rounded-xl p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Tech Stack</p>
            <div className="flex flex-wrap gap-1.5">
              {flow.tech.map(t => (
                <span key={t} className="px-2 py-1 rounded-md bg-muted/30 text-xs font-medium">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
