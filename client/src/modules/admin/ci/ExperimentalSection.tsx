// =============================================================================
// ExperimentalSection.tsx — Dashboard Lab: 20 Mo.one SuperApp home-screen concepts
// Design: Tesla / Apple / Braun — zero emoji, Lucide icons, precise typography
// =============================================================================

import { useState } from 'react'
import {
  Star, Bell, Home, MapPin, MessageCircle, User, ShoppingBag, CreditCard,
  Zap, TrendingUp, Clock, ArrowUpRight, ArrowDownLeft, Plus, Heart,
  Share2, Play, ChevronRight, Wifi, Battery, Repeat2, Gift, Sparkles,
  Car, Coffee, Utensils, Bike, Moon, Sun, BarChart2, Layers,
  Trophy, Flame, Music2, Package, Ticket, Plane, Globe, Store,
  Building2, Target, FileText, Users, Wallet, Send, Download,
} from 'lucide-react'
import { cn } from '@/lib/cn'

// ── Shared phone-chrome types & tokens ─────────────────────────────

interface AT {
  bg: string; surf: string; bord: string; text: string
  muted: string; sub: string; inp: string; isDark: boolean
}
const DARK: AT = { bg:'bg-zinc-950', surf:'bg-zinc-900', bord:'border-zinc-800', text:'text-white',     muted:'text-zinc-400', sub:'text-zinc-500', inp:'bg-zinc-800', isDark:true }
const LIGHT: AT = { bg:'bg-white',   surf:'bg-gray-50',  bord:'border-gray-100', text:'text-gray-900', muted:'text-gray-500', sub:'text-gray-400', inp:'bg-gray-100', isDark:false }
const THEMES: Record<'dark'|'light', AT> = { dark: DARK, light: LIGHT }

// ── Minimal reusable chrome ─────────────────────────────────────────

function SBar({ t }: { t: AT }) {
  return (
    <div className={cn('relative flex items-center justify-between px-5 shrink-0', t.bg)} style={{ height: 44, paddingTop: 12 }}>
      <span className={cn('text-[11px] font-semibold z-20', t.text)}>9:41</span>
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 bg-black rounded-full" style={{ width: 108, height: 30 }} />
      <div className="flex items-center gap-1 z-20">
        <Wifi size={10} className={t.text} />
        <Battery size={10} className={t.text} />
      </div>
    </div>
  )
}

function BNav({ t, act = 'home' }: { t: AT; act?: string }) {
  const items = [
    { Icon: Home,          label: 'Přehled', id: 'home'  },
    { Icon: MapPin,        label: 'Mapa',    id: 'map'   },
    { Icon: Star,          label: 'Stardust',id: 'star'  },
    { Icon: MessageCircle, label: 'Chaty',   id: 'chat'  },
    { Icon: User,          label: 'Profil',  id: 'profil'},
  ]
  return (
    <div className={cn('flex items-center justify-around border-t shrink-0 pt-1.5 pb-2.5', t.bord, t.bg)}>
      {items.map(({ Icon, label, id }) => (
        <div key={id} className="flex flex-col items-center gap-0.5">
          <Icon size={18} className={id === act ? 'text-blue-500' : t.muted} />
          <span className={cn('text-[8px]', id === act ? 'text-blue-500' : t.muted)}>{label}</span>
        </div>
      ))}
    </div>
  )
}

function PhoneMock({ t, children }: { t: AT; children: React.ReactNode }) {
  return (
    <div
      className={cn('relative overflow-hidden mx-auto rounded-[48px] border-[2.5px] border-zinc-700 shadow-2xl', t.bg)}
      style={{ width: 320, height: 640 }}
    >
      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-30 bg-black rounded-full" style={{ width: 108, height: 30 }} />
      {children}
    </div>
  )
}

// ── Transaction icon helper ─────────────────────────────────────────

function TxIcon({ icon: Icon, color }: { icon: React.ElementType; color: string }) {
  return (
    <div className={cn('w-6 h-6 rounded-lg flex items-center justify-center shrink-0', color)}>
      <Icon size={12} className="text-white" />
    </div>
  )
}

// ── 20 Dashboard Screen Implementations ────────────────────────────

// 01 Balance Focus
function D01({ t }: { t: AT }) {
  return (
    <div className={cn('flex flex-col h-full', t.bg)}>
      <SBar t={t} />
      <div className="flex-1 overflow-hidden px-4 pt-2">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className={cn('text-[9px]', t.muted)}>Vítej zpět</p>
            <p className={cn('text-sm font-bold', t.text)}>Patrik Štipák</p>
          </div>
          <div className="flex gap-2 items-center">
            <Bell size={15} className={t.muted} />
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">P</div>
          </div>
        </div>
        {/* Balance hero */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-4 mb-3">
          <p className="text-blue-200 text-[9px] uppercase tracking-wider mb-1">Dostupný zůstatek</p>
          <p className="text-white text-4xl font-bold tracking-tight leading-none">12 450<span className="text-2xl">,–</span></p>
          <p className="text-blue-200 text-[9px] mt-0.5">CZK · CZKT účet · Mo.one</p>
          <div className="flex gap-1.5 mt-3">
            {[
              { label: 'Zaplatit', Icon: CreditCard, primary: true },
              { label: 'Poslat', Icon: ArrowUpRight, primary: false },
              { label: 'Přijmout', Icon: ArrowDownLeft, primary: false },
            ].map((a) => (
              <div key={a.label} className={cn('flex-1 py-1.5 rounded-xl flex flex-col items-center gap-0.5', a.primary ? 'bg-white' : 'bg-blue-500/50')}>
                <a.Icon size={10} className={a.primary ? 'text-blue-700' : 'text-white'} />
                <span className={cn('text-[8px] font-semibold', a.primary ? 'text-blue-700' : 'text-white')}>{a.label}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Stardust strip */}
        <div className={cn('rounded-xl p-2.5 mb-3 flex items-center gap-2.5', t.surf)}>
          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center shrink-0"><Star size={14} className="text-white" /></div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <p className={cn('text-[10px] font-semibold', t.text)}>14 250 Stardust</p>
              <p className="text-[9px] text-green-400">+130 dnes</p>
            </div>
            <div className="h-1.5 rounded-full bg-zinc-700 overflow-hidden"><div className="h-full w-3/4 rounded-full bg-green-400" /></div>
          </div>
        </div>
        {/* Transactions */}
        <p className={cn('text-[9px] font-bold uppercase tracking-widest mb-2', t.muted)}>Nedávné</p>
        {[
          { n: 'Santhia Coffee', Icon: Coffee, color: 'bg-amber-600', a: '-89,–', c: 'text-red-400' },
          { n: 'Mo.one Cashback', Icon: Star, color: 'bg-green-600', a: '+22,–', c: 'text-green-400' },
          { n: 'Festival 2027', Icon: Music2, color: 'bg-violet-600', a: '-4 888,–', c: 'text-red-400' },
        ].map(tx => (
          <div key={tx.n} className={cn('flex items-center gap-2.5 py-2 border-b last:border-0', t.bord)}>
            <TxIcon icon={tx.Icon} color={tx.color} />
            <p className={cn('flex-1 text-[11px] font-medium', t.text)}>{tx.n}</p>
            <p className={cn('text-[11px] font-semibold', tx.c)}>{tx.a}</p>
          </div>
        ))}
      </div>
      <BNav t={t} />
    </div>
  )
}

// 02 Stories Discovery
function D02({ t }: { t: AT }) {
  const stories = [
    { name: 'Mo.one', img: '1556742049-0cfed4f6a45d', ring: 'ring-amber-500' },
    { name: 'Santhia', img: '1494790108377-be9c29b29330', ring: 'ring-blue-500' },
    { name: 'Rock...', img: '1539571696357-5a69c17a67c6', ring: 'ring-blue-500' },
    { name: 'Halipres', img: '1507003211169-0a1dd7228f2d', ring: 'ring-blue-500' },
    { name: 'Morav.', img: '1438761681033-6461ffad8d80', ring: 'ring-blue-500' },
    { name: 'Elegán', img: '1534528741775-53994a69daeb', ring: 'ring-blue-500' },
  ]
  const deals = [
    { img:'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=280&h=160&fit=crop&q=70', title:'Voucher na večeři', price:'1 234,–', merchant:'Moravská kuchyně' },
    { img:'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=280&h=160&fit=crop&q=70', title:'Ranní káva s bonusem', price:'89,–', merchant:'Santhia' },
  ]
  return (
    <div className={cn('flex flex-col h-full', t.bg)}>
      <SBar t={t} />
      <div className="flex items-center justify-between px-4 pt-1 pb-2 shrink-0">
        <p className={cn('text-base font-bold', t.text)}>Objevuj</p>
        <div className="flex gap-2">
          <Bell size={15} className={t.muted} />
          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">P</div>
        </div>
      </div>
      {/* Stories row — clean circles, no text ring labels */}
      <div className="flex gap-3 px-4 pb-3 overflow-x-auto shrink-0 no-scrollbar">
        {stories.map((s) => (
          <div key={s.name} className="flex flex-col items-center gap-1 shrink-0">
            <div className={cn('w-12 h-12 rounded-full ring-2 p-0.5', s.ring)}>
              <img
                src={`https://images.unsplash.com/photo-${s.img}?w=48&h=48&fit=crop&crop=faces&q=80`}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <p className={cn('text-[8px] font-medium', t.text)}>{s.name}</p>
          </div>
        ))}
      </div>
      {/* Deal cards */}
      <div className="flex-1 overflow-hidden px-4 space-y-3">
        <p className={cn('text-[9px] font-bold uppercase tracking-widest', t.muted)}>Aktuální nabídky</p>
        {deals.map(d => (
          <div key={d.title} className={cn('rounded-2xl overflow-hidden border', t.surf, t.bord)}>
            <img src={d.img} className="w-full h-20 object-cover" />
            <div className="p-2.5">
              <p className={cn('text-[11px] font-semibold', t.text)}>{d.title}</p>
              <div className="flex items-center justify-between mt-1">
                <p className={cn('text-[9px]', t.muted)}>{d.merchant}</p>
                <div className="bg-blue-600 px-2 py-0.5 rounded-full"><p className="text-white text-[9px] font-bold">{d.price}</p></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <BNav t={t} />
    </div>
  )
}

// 03 Activity Stream
function D03({ t }: { t: AT }) {
  const events = [
    { Icon: CreditCard, iconBg: 'bg-blue-600', title: 'Zaplaceno v Santhia', sub: 'před 12 min', badge: '-89 Kč', bc: 'text-red-400' },
    { Icon: Star,       iconBg: 'bg-amber-500', title: '+130 Stardust', sub: 'za platbu · před 12 min', badge: 'Odměna', bc: 'text-amber-400' },
    { Icon: MessageCircle, iconBg: 'bg-blue-500', title: 'Jana Krátká', sub: 'Díky za fakturu!', badge: '', bc: '' },
    { Icon: Package,    iconBg: 'bg-gray-600',  title: 'Zásilkovna', sub: 'před 2h', badge: '-60 Kč', bc: 'text-red-400' },
    { Icon: Target,     iconBg: 'bg-green-600', title: 'Streak 7 dní', sub: 'Bonus: +500 Stardust', badge: '+500', bc: 'text-green-400' },
    { Icon: Building2,  iconBg: 'bg-indigo-600', title: 'CZKT limit navýšen', sub: 'Nový limit: 50 000 Kč/měs', badge: '', bc: '' },
    { Icon: ArrowDownLeft, iconBg: 'bg-green-600', title: 'Petr Novák', sub: 'Posílá ti 400 Kč', badge: '+400 Kč', bc: 'text-green-400' },
  ]
  return (
    <div className={cn('flex flex-col h-full', t.bg)}>
      <SBar t={t} />
      <div className="px-4 pt-2 pb-3 flex items-center justify-between shrink-0">
        <p className={cn('text-base font-bold', t.text)}>Aktivita</p>
        <div className={cn('text-[9px] px-2 py-1 rounded-full font-semibold', t.surf, t.muted)}>dnes</div>
      </div>
      <div className="flex-1 overflow-hidden px-4 space-y-1">
        {events.map((ev, i) => (
          <div key={i} className={cn('flex items-center gap-3 p-2.5 rounded-xl', t.surf)}>
            <div className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0', ev.iconBg)}>
              <ev.Icon size={13} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn('text-[11px] font-semibold truncate', t.text)}>{ev.title}</p>
              <p className={cn('text-[9px] truncate', t.muted)}>{ev.sub}</p>
            </div>
            {ev.badge && <p className={cn('text-[10px] font-bold shrink-0', ev.bc)}>{ev.badge}</p>}
          </div>
        ))}
      </div>
      <BNav t={t} />
    </div>
  )
}

// 04 Stardust Galaxy
function D04({ t }: { t: AT }) {
  return (
    <div className={cn('flex flex-col h-full', t.bg)}>
      <SBar t={t} />
      <div className="flex-1 flex flex-col items-center px-4 pt-3 overflow-hidden">
        {/* Level ring */}
        <div className="relative w-32 h-32 mb-3">
          <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
            <circle cx="64" cy="64" r="56" fill="none" stroke={t.isDark ? '#27272a' : '#f3f4f6'} strokeWidth="10" />
            <circle cx="64" cy="64" r="56" fill="none" stroke="#22c55e" strokeWidth="10" strokeDasharray={`${2*Math.PI*56*0.72} ${2*Math.PI*56}`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Star size={18} className="text-amber-400 mb-0.5" />
            <p className={cn('text-xl font-bold leading-none', t.text)}>14 250</p>
            <p className={cn('text-[9px]', t.muted)}>Stardust</p>
          </div>
        </div>
        {/* Tier + streak */}
        <div className="flex gap-2 mb-4 w-full">
          <div className={cn('flex-1 rounded-xl p-2.5 text-center', t.surf)}>
            <p className="text-amber-400 text-base font-bold">Gold</p>
            <p className={cn('text-[9px]', t.muted)}>Úroveň</p>
          </div>
          <div className={cn('flex-1 rounded-xl p-2.5 text-center flex flex-col items-center', t.surf)}>
            <div className="flex items-center gap-1">
              <Flame size={14} className="text-orange-400" />
              <p className={cn('text-base font-bold', t.text)}>7</p>
            </div>
            <p className={cn('text-[9px]', t.muted)}>Dní streak</p>
          </div>
          <div className={cn('flex-1 rounded-xl p-2.5 text-center', t.surf)}>
            <p className="text-green-400 text-base font-bold">2.4%</p>
            <p className={cn('text-[9px]', t.muted)}>Cashback</p>
          </div>
        </div>
        {/* Rewards */}
        <p className={cn('text-[9px] font-bold uppercase tracking-widest self-start mb-2', t.muted)}>Dostupné odměny</p>
        {[
          { Icon: Coffee, iconBg: 'bg-amber-600', name: 'Káva zdarma', cost: '500 SD', pct: 100 },
          { Icon: Ticket, iconBg: 'bg-violet-600', name: 'Festival sleva 10%', cost: '2 000 SD', pct: 72 },
          { Icon: Plane,  iconBg: 'bg-blue-600',  name: 'Business lounge', cost: '10 000 SD', pct: 15 },
        ].map(r => (
          <div key={r.name} className={cn('w-full rounded-xl p-2.5 mb-2 flex items-center gap-2.5', t.surf)}>
            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', r.iconBg)}>
              <r.Icon size={14} className="text-white" />
            </div>
            <div className="flex-1">
              <p className={cn('text-[11px] font-semibold', t.text)}>{r.name}</p>
              <div className="h-1 rounded-full bg-zinc-700 mt-1 overflow-hidden"><div className="h-full rounded-full bg-green-400" style={{width:`${r.pct}%`}} /></div>
            </div>
            <div className={cn('px-2 py-0.5 rounded-full text-[9px] font-bold', r.pct===100?'bg-green-500 text-white':'bg-zinc-700 text-zinc-300')}>{r.pct===100?'Vyměnit':r.cost}</div>
          </div>
        ))}
      </div>
      <BNav t={t} act="star" />
    </div>
  )
}

// 05 Nearby Map
function D05({ t }: { t: AT }) {
  const pins = [
    { label:'Santhia', x:60, y:120, color:'bg-blue-500', sub:'Káva · 300m' },
    { label:'Orlen', x:190, y:95, color:'bg-blue-600', sub:'Pohonné hmoty' },
    { label:'Morav.', x:110, y:200, color:'bg-blue-500', sub:'Restaurace · 450m' },
    { label:'Mall CZ', x:220, y:185, color:'bg-blue-700', sub:'E-shop pickup' },
  ]
  return (
    <div className={cn('flex flex-col h-full', t.bg)}>
      <SBar t={t} />
      <div className="px-4 pt-1 pb-2 flex items-center gap-2 shrink-0">
        <MapPin size={14} className="text-blue-500 shrink-0" />
        <p className={cn('text-sm font-bold flex-1', t.text)}>Kde platit</p>
        <div className={cn('text-[10px] px-2.5 py-1 rounded-full', t.surf, t.muted)}>Praha 5</div>
      </div>
      {/* Map area */}
      <div className="mx-4 rounded-2xl overflow-hidden relative mb-3" style={{height:220}}>
        <div className={cn('absolute inset-0', t.isDark ? 'bg-zinc-800' : 'bg-gray-200')} />
        {[40,100,160,210].map(y => <div key={y} className={cn('absolute h-[6px] left-0 right-0', t.isDark?'bg-zinc-700':'bg-gray-300')} style={{top:y}} />)}
        {[60,130,200,250].map(x => <div key={x} className={cn('absolute w-[6px] top-0 bottom-0', t.isDark?'bg-zinc-700':'bg-gray-300')} style={{left:x}} />)}
        {[{x:12,y:12,w:42,h:22},{x:66,y:12,w:55,h:32},{x:135,y:12,w:48,h:22},{x:215,y:12,w:62,h:22},{x:12,y:50,w:28,h:42},{x:12,y:115,w:35,h:35},{x:170,y:55,w:30,h:38},{x:215,y:55,w:62,h:30},{x:62,y:160,w:58,h:38},{x:215,y:110,w:62,h:50}].map((b,i)=>(
          <div key={i} className={cn('absolute rounded-sm', t.isDark?'bg-zinc-900':'bg-gray-100')} style={{left:b.x,top:b.y,width:b.w,height:b.h}} />
        ))}
        {pins.map(p => (
          <div key={p.label} className="absolute flex flex-col items-center" style={{left:p.x-16, top:p.y-22}}>
            <div className={cn('px-2 py-0.5 rounded-full text-white text-[8px] font-bold mb-0.5', p.color)}>{p.label}</div>
            <div className={cn('w-2 h-2 rounded-full', p.color)} />
          </div>
        ))}
        <div className="absolute" style={{left:130,top:135}}>
          <div className="w-4 h-4 rounded-full bg-blue-500 ring-4 ring-blue-500/30 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>
        </div>
      </div>
      {/* Nearby list */}
      <div className="flex-1 overflow-hidden px-4 space-y-2">
        <p className={cn('text-[9px] font-bold uppercase tracking-widest', t.muted)}>Nejbližší</p>
        {pins.map(p => (
          <div key={p.label} className={cn('flex items-center gap-2.5 p-2 rounded-xl', t.surf)}>
            <div className={cn('w-6 h-6 rounded-full flex items-center justify-center', p.color)}><MapPin size={10} className="text-white" /></div>
            <div className="flex-1"><p className={cn('text-[11px] font-semibold', t.text)}>{p.label}</p><p className={cn('text-[9px]', t.muted)}>{p.sub}</p></div>
            <div className="bg-blue-600 px-2 py-0.5 rounded-full"><p className="text-[9px] font-bold text-white">Platit</p></div>
          </div>
        ))}
      </div>
      <BNav t={t} act="map" />
    </div>
  )
}

// 06 Chat-First
function D06({ t }: { t: AT }) {
  const chats = [
    { n:'Jana Krátká', last:'Díky za zaplacení!', time:'6h', u:1, img:'1494790108377-be9c29b29330' },
    { n:'Petr Novák', last:'Posílám ti 400 Kč', time:'Nyní', u:0, img:'1507003211169-0a1dd7228f2d' },
    { n:'Legi.one Pokec', last:'Jáchym: Jdu platit Mo.one!', time:'3h', u:2, img:'1472099645785-5658abf4ff4e' },
    { n:'Valerie Velká', last:'Mám dost velkých výdajů', time:'Včera', u:0, img:'1438761681033-6461ffad8d80' },
    { n:'Knižní Klub', last:'Agóta: Kdo zaplatí sraz?', time:'12.1.', u:0, img:'1481627834876-b7833e8f5570' },
  ]
  return (
    <div className={cn('flex flex-col h-full', t.bg)}>
      <SBar t={t} />
      <div className="px-4 pt-1 pb-2 flex items-center justify-between shrink-0">
        <p className={cn('text-base font-bold', t.text)}>Zprávy</p>
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 px-2.5 py-1 rounded-full flex items-center gap-1"><p className="text-white text-[9px] font-bold">12 450 Kč</p><ChevronRight size={10} className="text-blue-200" /></div>
          <Plus size={16} className="text-blue-500" />
        </div>
      </div>
      <div className={cn('mx-4 mb-2 px-3 py-1.5 rounded-xl flex items-center gap-2 shrink-0', t.surf)}>
        <p className={cn('text-[11px]', t.muted)}>Hledat konverzace…</p>
      </div>
      <div className="flex-1 overflow-hidden">
        {chats.map(c => (
          <div key={c.n} className={cn('flex items-center gap-3 px-4 py-2.5 border-b', t.bord)}>
            <div className="relative shrink-0">
              <img src={`https://images.unsplash.com/photo-${c.img}?w=40&h=40&fit=crop&crop=faces&q=80`} className="w-10 h-10 rounded-full object-cover" />
              {c.u > 0 && <div className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center"><p className="text-white text-[8px] font-bold">{c.u}</p></div>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between"><p className={cn('text-[12px] font-semibold', t.text)}>{c.n}</p><p className={cn('text-[9px]', t.muted)}>{c.time}</p></div>
              <p className={cn('text-[10px] truncate', t.muted)}>{c.last}</p>
            </div>
          </div>
        ))}
      </div>
      <BNav t={t} act="chat" />
    </div>
  )
}

// 07 AI Concierge
function D07({ t }: { t: AT }) {
  const chips = ['Zaplatit Petrovi 400 Kč','Objednat taxi domů','Ušetřit na kávě','Stav zůstatku']
  return (
    <div className={cn('flex flex-col h-full', t.bg)}>
      <SBar t={t} />
      <div className="flex-1 overflow-hidden flex flex-col px-4 pt-3">
        {/* AI greeting */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center"><Sparkles size={12} className="text-white" /></div>
            <p className={cn('text-[10px] font-semibold', t.muted)}>Mo.one AI · právě teď</p>
          </div>
          <div className={cn('rounded-2xl rounded-tl-sm p-3', t.surf)}>
            <p className={cn('text-[12px] font-semibold mb-1', t.text)}>Dobré ráno, Patrik</p>
            <p className={cn('text-[11px] leading-relaxed', t.muted)}>Tento týden jsi utratil <span className="text-white font-semibold">3 200 Kč</span> — o 15 % méně než minulý. Santhia tě čeká s <span className="text-green-400 font-semibold">+50 Stardust bonusem</span>.</p>
          </div>
        </div>
        {/* Quick chips */}
        <p className={cn('text-[9px] font-bold uppercase tracking-widest mb-2', t.muted)}>Co chceš udělat?</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {chips.map(c => (
            <div key={c} className={cn('px-2.5 py-1.5 rounded-full text-[10px] font-medium', t.surf, t.muted)}>{c}</div>
          ))}
        </div>
        {/* Context cards */}
        <div className={cn('rounded-xl p-3 mb-2 flex items-center gap-3', t.surf)}>
          <Coffee size={16} className="text-amber-400 shrink-0" />
          <div><p className={cn('text-[11px] font-semibold', t.text)}>Santhia je 300m od tebe</p><p className={cn('text-[9px]', t.muted)}>+50 Stardust bonus dnes ráno</p></div>
          <ChevronRight size={12} className={t.muted} />
        </div>
        <div className={cn('rounded-xl p-3 mb-2 flex items-center gap-3', t.surf)}>
          <Zap size={16} className="text-blue-400 shrink-0" />
          <div><p className={cn('text-[11px] font-semibold', t.text)}>Petr ti posílá 400 Kč</p><p className={cn('text-[9px]', t.muted)}>Přijmout nebo odepsat?</p></div>
          <div className="flex gap-1 ml-auto"><div className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-bold">Přijmout</div></div>
        </div>
        <div className={cn('rounded-xl p-3 flex items-center gap-3', t.surf)}>
          <div className="flex items-center gap-1">
            <Star size={16} className="text-amber-400 shrink-0" />
          </div>
          <div><p className={cn('text-[11px] font-semibold', t.text)}>Streak: 7 dní</p><p className={cn('text-[9px]', t.muted)}>Zítra: dvojnásobné body</p></div>
          <ChevronRight size={12} className={t.muted} />
        </div>
      </div>
      <BNav t={t} />
    </div>
  )
}

// 08 Mini-App Grid (WeChat-style)
function D08({ t }: { t: AT }) {
  const apps = [
    { icon: CreditCard, label:'Platit', color:'bg-blue-600' },
    { icon: ArrowUpRight, label:'Poslat', color:'bg-blue-500' },
    { icon: ArrowDownLeft, label:'Přijmout', color:'bg-green-600' },
    { icon: Star, label:'Stardust', color:'bg-amber-500' },
    { icon: ShoppingBag, label:'Tržiště', color:'bg-violet-600' },
    { icon: Car, label:'Taxi', color:'bg-orange-600' },
    { icon: Bike, label:'Mikro', color:'bg-teal-600' },
    { icon: Utensils, label:'Jídlo', color:'bg-rose-600' },
    { icon: MapPin, label:'Kde platit', color:'bg-cyan-600' },
    { icon: Gift, label:'Dárky', color:'bg-pink-600' },
    { icon: BarChart2, label:'Výdaje', color:'bg-indigo-600' },
    { icon: Layers, label:'Mini Apps', color:'bg-zinc-600' },
  ]
  return (
    <div className={cn('flex flex-col h-full', t.bg)}>
      <SBar t={t} />
      <div className="px-4 pt-2 pb-2 flex items-center justify-between shrink-0">
        <p className={cn('text-sm font-bold', t.text)}>Mo.one</p>
        <div className="flex items-center gap-2">
          <div className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', t.surf, t.muted)}>12 450 Kč</div>
          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">P</div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden px-4 pt-1">
        <div className="grid grid-cols-4 gap-3">
          {apps.map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center', color)}><Icon size={20} className="text-white" /></div>
              <p className={cn('text-[8px] text-center leading-tight', t.text)}>{label}</p>
            </div>
          ))}
        </div>
        <div className={cn('mt-4 rounded-xl p-3', t.surf)}>
          <p className={cn('text-[9px] font-bold uppercase tracking-widest mb-2', t.muted)}>Poslední platby</p>
          {[{n:'Santhia',a:'-89 Kč', Icon: Coffee, bg:'bg-amber-600'},{n:'Mo.one Cashback',a:'+22 Kč', Icon: Star, bg:'bg-green-600'}].map(tx=>(
            <div key={tx.n} className="flex items-center gap-2 py-1.5">
              <TxIcon icon={tx.Icon} color={tx.bg} />
              <p className={cn('flex-1 text-[11px]', t.text)}>{tx.n}</p>
              <p className={cn('text-[11px] font-semibold', tx.a[0]==='-'?'text-red-400':'text-green-400')}>{tx.a}</p>
            </div>
          ))}
        </div>
      </div>
      <BNav t={t} />
    </div>
  )
}

// 09 Card Wallet (Apple Wallet Stack)
function D09({ t }: { t: AT }) {
  return (
    <div className={cn('flex flex-col h-full', t.bg)}>
      <SBar t={t} />
      <div className="px-4 pt-2 pb-1 shrink-0">
        <p className={cn('text-base font-bold', t.text)}>Peněženka</p>
        <p className={cn('text-[10px]', t.muted)}>3 karty</p>
      </div>
      <div className="flex-1 overflow-hidden relative px-4 pt-2">
        <div className="absolute inset-x-4 rounded-2xl bg-zinc-600 shadow-lg" style={{top:72, height:170}}>
          <div className="p-4"><p className="text-zinc-300 text-[9px]">Bankovní karta</p><p className="text-white font-bold text-sm">Monobank CZK</p></div>
        </div>
        <div className="absolute inset-x-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 shadow-xl" style={{top:36, height:170}}>
          <div className="p-4"><p className="text-indigo-200 text-[9px]">EMV karta · Mo.one</p><p className="text-white font-bold text-sm">CZKT Limited</p></div>
        </div>
        <div className="absolute inset-x-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-2xl" style={{top:0, height:170}}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-blue-200 text-[9px]">Mo.one · CZKT</p>
              <CreditCard size={16} className="text-blue-200" />
            </div>
            <p className="text-white font-mono text-sm tracking-widest mb-3">•••• •••• •••• 4291</p>
            <div className="flex items-end justify-between">
              <div><p className="text-blue-200 text-[8px]">PLATITEL</p><p className="text-white text-[10px] font-semibold">PATRIK ŠTIPÁK</p></div>
              <div><p className="text-blue-200 text-[8px]">ZŮSTATEK</p><p className="text-white text-[12px] font-bold">12 450,–</p></div>
            </div>
          </div>
          <div className="absolute bottom-3 right-4"><Repeat2 size={20} className="text-blue-200 opacity-60" /></div>
        </div>
        <div className="absolute inset-x-4" style={{top:185}}>
          <div className="flex gap-2 mt-3">
            <div className="flex-1 bg-blue-600 rounded-xl py-2.5 flex items-center justify-center gap-1.5">
              <CreditCard size={12} className="text-white" />
              <p className="text-white text-[11px] font-bold">Zaplatit NFC</p>
            </div>
            <div className={cn('flex-1 rounded-xl py-2.5 text-center', t.surf)}><p className={cn('text-[11px] font-semibold', t.text)}>+ Přidat kartu</p></div>
          </div>
          <div className={cn('mt-3 rounded-xl p-2.5 flex items-center gap-2', t.surf)}>
            <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center"><Star size={12} className="text-white" /></div>
            <p className={cn('flex-1 text-[10px] font-medium', t.text)}>14 250 Stardust · Gold tier</p>
            <p className="text-green-400 text-[9px] font-bold">2.4%</p>
          </div>
          <p className={cn('text-[9px] font-bold uppercase tracking-widest mt-3 mb-1', t.muted)}>Nedávné</p>
          {[
            {n:'Santhia', a:'-89 Kč', Icon: Coffee, bg:'bg-amber-600'},
            {n:'Cashback', a:'+22 Kč', Icon: Star, bg:'bg-green-600'},
          ].map(tx=>(
            <div key={tx.n} className="flex items-center gap-2 py-1.5">
              <TxIcon icon={tx.Icon} color={tx.bg} />
              <p className={cn('flex-1 text-[11px]', t.text)}>{tx.n}</p>
              <p className={cn('text-[11px] font-semibold', tx.a[0]==='-'?'text-red-400':'text-green-400')}>{tx.a}</p>
            </div>
          ))}
        </div>
      </div>
      <BNav t={t} />
    </div>
  )
}

// 10 Merchant Reel (TikTok/Reels commerce) — TRULY FULL-SCREEN, no BNav
function D10({ t: _t }: { t: AT }) {
  return (
    <div className="flex flex-col h-full relative bg-black">
      {/* Full-bleed merchant image — fills entire 640px, no nav */}
      <img
        src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=640&h=1136&fit=crop&q=85"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90" />
      {/* Status bar */}
      <div className="relative flex items-center justify-between px-5 shrink-0 z-10" style={{ height: 44, paddingTop: 12 }}>
        <span className="text-[11px] font-semibold text-white">9:41</span>
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 bg-black rounded-full" style={{ width: 108, height: 30 }} />
        <div className="flex items-center gap-1 z-10"><Wifi size={10} className="text-white" /><Battery size={10} className="text-white" /></div>
      </div>
      {/* Top controls */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-1 shrink-0">
        <p className="text-white font-bold text-sm">Nabídky</p>
        <div className="flex gap-3"><ShoppingBag size={16} className="text-white" /><Bell size={16} className="text-white" /></div>
      </div>
      {/* Right actions */}
      <div className="absolute right-3 z-10 flex flex-col items-center gap-4" style={{ bottom: 120 }}>
        {[{I:Heart,l:'248'},{I:Share2,l:'Sdílet'},{I:CreditCard,l:'Koupit'}].map(({I,l})=>(
          <div key={l} className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center"><I size={18} className="text-white" /></div>
            <p className="text-white text-[9px]">{l}</p>
          </div>
        ))}
      </div>
      {/* Bottom info — no nav, content goes to bottom of screen */}
      <div className="absolute left-0 right-12 px-4 z-10" style={{ bottom: 32 }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-full ring-2 ring-white overflow-hidden"><img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=28&h=28&fit=crop&crop=faces&q=80" className="w-full h-full object-cover" /></div>
          <p className="text-white text-[11px] font-semibold">Moravská kuchyně</p>
          <div className="bg-blue-600 px-2 py-0.5 rounded-full"><p className="text-white text-[9px] font-bold">Sledovat</p></div>
        </div>
        <p className="text-white text-xs font-semibold mb-0.5">Voucher na večeři pro dva</p>
        <p className="text-white/80 text-[10px]">Špičkový výběr vín a precizní kuchyně...</p>
        <div className="flex items-center gap-2 mt-2">
          <div className="bg-blue-600 px-4 py-1.5 rounded-xl"><p className="text-white text-[10px] font-bold">Koupit · 1 234,–</p></div>
          <div className="flex items-center gap-1 bg-white/20 px-2 py-1.5 rounded-xl backdrop-blur">
            <Star size={10} className="text-amber-400" />
            <p className="text-white text-[9px] font-semibold">+200 SD</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// 11 Morning Brief (Newspaper)
function D11({ t }: { t: AT }) {
  const agenda = [
    { Icon: Coffee,  iconBg: 'bg-amber-600', title: 'Santhia +50 SD bonus', sub: 'Ráno · platnost do 11:00', color: 'text-amber-400' },
    { Icon: Music2,  iconBg: 'bg-violet-600', title: 'Festival 2027 — Early Bird', sub: 'Poslední tickets za 4 888 Kč', color: 'text-blue-400' },
    { Icon: Send,    iconBg: 'bg-green-600',  title: 'Petr: 400 Kč k vyrovnání', sub: 'Čeká na tvoje přijetí', color: 'text-green-400' },
  ]
  return (
    <div className={cn('flex flex-col h-full', t.bg)}>
      <SBar t={t} />
      <div className="flex-1 overflow-hidden px-4 pt-2">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className={cn('text-[10px] uppercase tracking-widest', t.muted)}>Sobota · 10. dubna 2026</p>
            <p className={cn('text-base font-bold', t.text)}>Tvůj přehled</p>
          </div>
          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">P</div>
        </div>
        {/* Main summary card */}
        <div className={cn('rounded-2xl p-3.5 mb-3 border', t.surf, t.bord)}>
          <p className={cn('text-[9px] font-bold uppercase tracking-widest mb-2', t.muted)}>Včera</p>
          <div className="flex items-baseline gap-2">
            <p className={cn('text-2xl font-bold', t.text)}>1 234,–</p>
            <p className={cn('text-[10px]', t.muted)}>Kč utraceno</p>
          </div>
          <div className="flex gap-2 mt-2">
            <div className={cn('flex-1 rounded-xl p-2 text-center', t.isDark?'bg-zinc-800':'bg-gray-100')}>
              <p className="text-green-400 text-sm font-bold">+87</p>
              <p className={cn('text-[8px]', t.muted)}>Stardust</p>
            </div>
            <div className={cn('flex-1 rounded-xl p-2 text-center', t.isDark?'bg-zinc-800':'bg-gray-100')}>
              <p className={cn('text-sm font-bold', t.text)}>3</p>
              <p className={cn('text-[8px]', t.muted)}>Platby</p>
            </div>
            <div className={cn('flex-1 rounded-xl p-2 text-center', t.isDark?'bg-zinc-800':'bg-gray-100')}>
              <p className="text-amber-400 text-sm font-bold">2.4%</p>
              <p className={cn('text-[8px]', t.muted)}>Cashback</p>
            </div>
          </div>
        </div>
        {/* Today agenda */}
        <p className={cn('text-[9px] font-bold uppercase tracking-widest mb-2', t.muted)}>Dnes tě čeká</p>
        {agenda.map(ev => (
          <div key={ev.title} className={cn('flex items-center gap-3 p-2.5 rounded-xl mb-2', t.surf)}>
            <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0', ev.iconBg)}>
              <ev.Icon size={13} className="text-white" />
            </div>
            <div className="flex-1">
              <p className={cn('text-[11px] font-semibold', t.text)}>{ev.title}</p>
              <p className={cn('text-[9px]', t.muted)}>{ev.sub}</p>
            </div>
            <ChevronRight size={12} className={ev.color} />
          </div>
        ))}
        {/* Cashback highlight */}
        <div className="rounded-xl bg-gradient-to-r from-green-600/20 to-green-500/10 border border-green-500/20 p-2.5 flex items-center gap-2">
          <TrendingUp size={14} className="text-green-400 shrink-0" />
          <p className={cn('text-[10px]', t.muted)}>Tento měsíc jsi ušetřil <span className="text-green-400 font-bold">340 Kč</span> cashbackem.</p>
        </div>
      </div>
      <BNav t={t} />
    </div>
  )
}

// 12 Spending Donut
function D12({ t }: { t: AT }) {
  const cats = [
    { label:'Jídlo',     pct:32, color:'#3b82f6', amt:'2 100 Kč' },
    { label:'Doprava',   pct:18, color:'#8b5cf6', amt:'1 180 Kč' },
    { label:'Shopping',  pct:28, color:'#f59e0b', amt:'1 830 Kč' },
    { label:'Zábava',    pct:14, color:'#10b981', amt:'920 Kč' },
    { label:'Ostatní',   pct:8,  color:'#6b7280', amt:'520 Kč' },
  ]
  const total = 6550
  let cumPct = 0
  const r = 54, cx = 80, cy = 80, circ = 2 * Math.PI * r
  return (
    <div className={cn('flex flex-col h-full', t.bg)}>
      <SBar t={t} />
      <div className="px-4 pt-2 pb-1 shrink-0">
        <p className={cn('text-base font-bold', t.text)}>Výdaje · Duben</p>
        <p className={cn('text-[10px]', t.muted)}>1. – 10. dubna 2026</p>
      </div>
      <div className="flex items-center gap-4 px-4 mb-3 shrink-0">
        <svg width={160} height={160} viewBox="0 0 160 160" className="shrink-0">
          {cats.map((c, i) => {
            const dash = (c.pct / 100) * circ
            const offset = -((cumPct / 100) * circ) + circ * 0.25
            cumPct += c.pct
            return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={c.color} strokeWidth="20"
              strokeDasharray={`${dash} ${circ}`} strokeDashoffset={offset} strokeLinecap="butt" />
          })}
          <text x={cx} y={cy - 6} textAnchor="middle" fill={t.isDark ? '#fff' : '#111'} fontSize="14" fontWeight="700">{(total/1000).toFixed(1)}k</text>
          <text x={cx} y={cy + 10} textAnchor="middle" fill={t.isDark ? '#999' : '#666'} fontSize="9">Kč celkem</text>
        </svg>
        <div className="flex flex-col gap-1.5 flex-1">
          {cats.map(c => (
            <div key={c.label} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full shrink-0" style={{background:c.color}} />
              <p className={cn('flex-1 text-[10px]', t.text)}>{c.label}</p>
              <p className={cn('text-[10px] font-semibold', t.text)}>{c.pct}%</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-hidden px-4 space-y-1.5">
        {cats.map(c => (
          <div key={c.label} className={cn('rounded-xl p-2.5 flex items-center gap-2.5', t.surf)}>
            <div className="w-2 h-8 rounded-full" style={{background:c.color}} />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className={cn('text-[11px] font-semibold', t.text)}>{c.label}</p>
                <p className={cn('text-[11px] font-bold', t.text)}>{c.amt}</p>
              </div>
              <div className={cn('h-1 rounded-full', t.isDark?'bg-zinc-800':'bg-gray-200')} >
                <div className="h-full rounded-full" style={{width:`${c.pct*2.5}%`, background:c.color}} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <BNav t={t} />
    </div>
  )
}

// 13 Context Aware (Evening mode)
function D13({ t }: { t: AT }) {
  const nearby = [
    { Icon: Utensils, iconBg: 'bg-rose-600', title: 'Pizza Napoletana', sub: '350m · Sleva 15% s Mo.one', tag: 'Jídlo', tcolor: 'bg-rose-600' },
    { Icon: Music2,   iconBg: 'bg-amber-600', title: 'Craft Beer Bar', sub: '200m · Happy hour do 20:00', tag: 'Zábava', tcolor: 'bg-amber-600' },
    { Icon: Store,    iconBg: 'bg-blue-600',  title: 'Albert 24h', sub: '120m · +10 SD za nákup', tag: 'Shop', tcolor: 'bg-blue-600' },
  ]
  return (
    <div className={cn('flex flex-col h-full', t.bg)}>
      <SBar t={t} />
      <div className="flex-1 overflow-hidden px-4 pt-2">
        <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-full self-start mb-3', t.surf)} style={{display:'inline-flex'}}>
          <Moon size={11} className="text-indigo-400" />
          <p className={cn('text-[10px] font-semibold', t.muted)}>Večer · 18:12 · Praha 5</p>
        </div>
        {/* Hero context card */}
        <div className="rounded-2xl bg-gradient-to-br from-indigo-900 to-zinc-900 p-4 mb-3 border border-indigo-700/40">
          <p className="text-indigo-300 text-[10px] mb-1">Jak se ti daří cestou domů?</p>
          <div className="flex items-center gap-2 mb-3">
            <Car size={20} className="text-orange-400" />
            <p className="text-white text-lg font-bold leading-snug">Objednat taxi na 1 klik</p>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 bg-blue-600 rounded-xl py-2 text-center"><p className="text-white text-[11px] font-bold">Potvrdit cestu</p></div>
            <div className={cn('flex-1 rounded-xl py-2 text-center', t.surf)}><p className={cn('text-[11px]', t.muted)}>Zrušit</p></div>
          </div>
        </div>
        {/* Contextual suggestions */}
        <p className={cn('text-[9px] font-bold uppercase tracking-widest mb-2', t.muted)}>Právě teď v okolí</p>
        {nearby.map(s => (
          <div key={s.title} className={cn('flex items-center gap-3 p-2.5 rounded-xl mb-2', t.surf)}>
            <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0', s.iconBg)}>
              <s.Icon size={13} className="text-white" />
            </div>
            <div className="flex-1">
              <p className={cn('text-[11px] font-semibold', t.text)}>{s.title}</p>
              <p className={cn('text-[9px]', t.muted)}>{s.sub}</p>
            </div>
            <div className={cn('px-2 py-0.5 rounded-full text-white text-[8px] font-bold', s.tcolor)}>{s.tag}</div>
          </div>
        ))}
        {/* Balance chip */}
        <div className={cn('rounded-xl p-2.5 flex items-center gap-2 mt-1', t.surf)}>
          <CreditCard size={13} className="text-blue-400" />
          <p className={cn('flex-1 text-[10px]', t.muted)}>Zůstatek</p>
          <p className={cn('text-[12px] font-bold', t.text)}>12 450 Kč</p>
        </div>
      </div>
      <BNav t={t} />
    </div>
  )
}

// 14 Widget Matrix (iOS widget grid)
function D14({ t }: { t: AT }) {
  return (
    <div className={cn('flex flex-col h-full', t.bg)}>
      <SBar t={t} />
      <div className="px-4 pt-2 pb-2 flex items-center justify-between shrink-0">
        <p className={cn('text-base font-bold', t.text)}>Přehled</p>
        <div className="flex gap-2"><Bell size={15} className={t.muted} /><div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">P</div></div>
      </div>
      <div className="flex-1 overflow-hidden px-4 space-y-2">
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-3 flex items-center gap-3">
          <div className="flex-1">
            <p className="text-blue-200 text-[9px]">Zůstatek · CZKT</p>
            <p className="text-white text-2xl font-bold tracking-tight">12 450<span className="text-base">,–</span></p>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="bg-white/20 rounded-lg px-2.5 py-1 text-center"><p className="text-white text-[9px] font-bold">Poslat</p></div>
            <div className="bg-white/20 rounded-lg px-2.5 py-1 text-center"><p className="text-white text-[9px] font-bold">Přijmout</p></div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className={cn('flex-1 rounded-2xl p-3', t.surf)}>
            <div className="flex items-center gap-1.5 mb-1"><Star size={12} className="text-amber-400" /><p className={cn('text-[9px] font-semibold', t.muted)}>Stardust</p></div>
            <p className={cn('text-xl font-bold', t.text)}>14 250</p>
            <div className="h-1.5 rounded-full bg-zinc-700 mt-2 overflow-hidden"><div className="h-full w-3/4 rounded-full bg-green-400" /></div>
            <p className="text-green-400 text-[9px] mt-1">+130 dnes</p>
          </div>
          <div className={cn('flex-1 rounded-2xl p-3', t.surf)}>
            <div className="flex items-center gap-1.5 mb-1"><TrendingUp size={12} className="text-green-400" /><p className={cn('text-[9px] font-semibold', t.muted)}>Cashback</p></div>
            <p className="text-green-400 text-xl font-bold">340 Kč</p>
            <p className={cn('text-[9px] mt-1', t.muted)}>tento měsíc</p>
            <p className={cn('text-[9px] mt-0.5', t.muted)}>sazba 2.4%</p>
          </div>
        </div>
        <div className={cn('rounded-2xl p-3 flex items-center gap-3', t.surf)}>
          <MessageCircle size={16} className="text-blue-500 shrink-0" />
          <div className="flex-1">
            <p className={cn('text-[11px] font-semibold', t.text)}>Jana Krátká</p>
            <p className={cn('text-[9px] truncate', t.muted)}>Díky za zaplacení faktury!</p>
          </div>
          <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center"><p className="text-white text-[8px] font-bold">1</p></div>
        </div>
        <div className={cn('rounded-2xl p-3 flex items-center gap-3', t.surf)}>
          <div className="w-8 h-8 rounded-full bg-teal-600/20 flex items-center justify-center shrink-0"><MapPin size={14} className="text-teal-400" /></div>
          <div className="flex-1">
            <p className={cn('text-[11px] font-semibold', t.text)}>Santhia · 300m</p>
            <p className="text-amber-400 text-[9px]">+50 SD bonus ráno</p>
          </div>
          <div className="bg-blue-600 px-2 py-1 rounded-lg"><p className="text-white text-[9px] font-bold">Platit</p></div>
        </div>
        <div className="flex gap-2">
          {[{Icon: CreditCard, label:'NFC'},{Icon: Play, label:'QR'},{Icon: User, label:'Kontakt'}].map(a => (
            <div key={a.label} className={cn('flex-1 rounded-xl py-2 flex flex-col items-center gap-0.5', t.surf)}>
              <a.Icon size={12} className={t.muted} />
              <p className={cn('text-[9px] font-semibold', t.text)}>{a.label}</p>
            </div>
          ))}
        </div>
      </div>
      <BNav t={t} />
    </div>
  )
}

// 15 Social Payments
function D15({ t }: { t: AT }) {
  return (
    <div className={cn('flex flex-col h-full', t.bg)}>
      <SBar t={t} />
      <div className="px-4 pt-2 pb-2 flex items-center justify-between shrink-0">
        <p className={cn('text-base font-bold', t.text)}>Sociální</p>
        <div className="flex gap-2"><Bell size={15} className={t.muted} /><Plus size={15} className="text-blue-500" /></div>
      </div>
      <div className="flex-1 overflow-hidden px-4 space-y-2">
        <p className={cn('text-[9px] font-bold uppercase tracking-widest', t.muted)}>Čeká na tebe</p>
        {[
          { name:'Petr Novák', action:'posílá ti', amt:'+400 Kč', img:'1507003211169-0a1dd7228f2d', accept:true },
          { name:'Jana Krátká', action:'žádá', amt:'-120 Kč', img:'1494790108377-be9c29b29330', accept:true },
        ].map(r => (
          <div key={r.name} className={cn('rounded-xl p-3', t.surf)}>
            <div className="flex items-center gap-2.5 mb-2">
              <img src={`https://images.unsplash.com/photo-${r.img}?w=32&h=32&fit=crop&crop=faces&q=80`} className="w-8 h-8 rounded-full object-cover shrink-0" />
              <div className="flex-1"><p className={cn('text-[11px] font-semibold', t.text)}>{r.name} <span className={cn('font-normal', t.muted)}>{r.action}</span></p></div>
              <p className={cn('text-base font-bold', r.amt[0]==='+' ? 'text-green-400' : 'text-red-400')}>{r.amt}</p>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 bg-blue-600 rounded-lg py-1.5 text-center"><p className="text-white text-[10px] font-bold">Přijmout</p></div>
              <div className={cn('flex-1 rounded-lg py-1.5 text-center', t.isDark?'bg-zinc-800':'bg-gray-100')}><p className={cn('text-[10px]', t.muted)}>Odmítnout</p></div>
            </div>
          </div>
        ))}
        <p className={cn('text-[9px] font-bold uppercase tracking-widest', t.muted)}>Skupinový fond</p>
        <div className={cn('rounded-xl p-3', t.surf)}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Trophy size={13} className="text-amber-400" />
              <p className={cn('text-[11px] font-semibold', t.text)}>Narozeniny Jana</p>
            </div>
            <p className="text-green-400 text-[11px] font-bold">1 200 / 2 000 Kč</p>
          </div>
          <div className={cn('h-2 rounded-full overflow-hidden', t.isDark?'bg-zinc-800':'bg-gray-200')}>
            <div className="h-full rounded-full bg-green-400" style={{width:'60%'}} />
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex -space-x-1.5">{['1494790108377-be9c29b29330','1507003211169-0a1dd7228f2d','1539571696357-5a69c17a67c6'].map((img,i)=><img key={i} src={`https://images.unsplash.com/photo-${img}?w=20&h=20&fit=crop&crop=faces&q=80`} className="w-5 h-5 rounded-full ring-1 ring-zinc-900 object-cover" />)}</div>
            <div className="bg-blue-600 px-2.5 py-1 rounded-lg"><p className="text-white text-[9px] font-bold">+ Přispět</p></div>
          </div>
        </div>
        <p className={cn('text-[9px] font-bold uppercase tracking-widest', t.muted)}>Přátelé platili</p>
        {[{n:'Nikola J.',a:'zaplatila v Santhia',time:'před 30 min'},{n:'Jan K.',a:'přispěl 300 Kč Janovi',time:'1h'}].map(a=>(
          <div key={a.n} className="flex items-center gap-2 py-1">
            <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center text-[9px] font-bold text-white">{a.n[0]}</div>
            <p className={cn('flex-1 text-[10px]', t.muted)}><span className={cn('font-semibold', t.text)}>{a.n}</span> {a.a}</p>
            <p className={cn('text-[9px]', t.muted)}>{a.time}</p>
          </div>
        ))}
      </div>
      <BNav t={t} />
    </div>
  )
}

// 16 Reward Engine
function D16({ t }: { t: AT }) {
  const opportunities = [
    { Icon: Coffee, iconBg: 'bg-amber-600', name: 'Santhia', bonus: '2× Stardust', expiry: 'do 11:00', active: true },
    { Icon: Store,  iconBg: 'bg-blue-600',  name: 'Albert', bonus: '+100 SD', expiry: 'do 22:00', active: true },
    { Icon: Music2, iconBg: 'bg-violet-600', name: 'Festival 2027', bonus: '+500 SD', expiry: '24h', active: false },
  ]
  return (
    <div className={cn('flex flex-col h-full', t.bg)}>
      <SBar t={t} />
      <div className="flex-1 overflow-hidden px-4 pt-3">
        {/* Big reward hero */}
        <div className="rounded-2xl bg-gradient-to-br from-green-700 to-emerald-900 p-4 mb-3 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-green-500/20" />
          <div className="absolute -right-2 -bottom-2 w-16 h-16 rounded-full bg-green-400/10" />
          <p className="text-green-300 text-[10px] uppercase tracking-wider mb-1">Tvůj cashback rate</p>
          <p className="text-white text-5xl font-black leading-none tracking-tight">2.4%</p>
          <p className="text-green-300 text-[10px] mt-1">Gold tier · aktivní</p>
          <div className="flex items-center gap-2 mt-3">
            <div className="bg-green-500/30 rounded-lg px-3 py-1.5"><p className="text-white text-[10px] font-bold">340 Kč tento měsíc</p></div>
            <div className="bg-green-500/30 rounded-lg px-3 py-1.5"><p className="text-white text-[10px] font-bold">14 250 SD celkem</p></div>
          </div>
        </div>
        {/* Tier progress */}
        <div className={cn('rounded-xl p-3 mb-3', t.surf)}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Trophy size={13} className="text-amber-400" />
              <p className={cn('text-[11px] font-semibold', t.text)}>Gold → Platinum</p>
            </div>
            <p className={cn('text-[9px]', t.muted)}>35 750 / 50 000 SD</p>
          </div>
          <div className={cn('h-2 rounded-full overflow-hidden', t.isDark?'bg-zinc-800':'bg-gray-200')}>
            <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-500" style={{width:'72%'}} />
          </div>
          <p className="text-amber-400 text-[9px] mt-1">+14 250 SD do Platinum (cashback 3.2%)</p>
        </div>
        {/* Earn opportunities */}
        <p className={cn('text-[9px] font-bold uppercase tracking-widest mb-2', t.muted)}>Vydělej víc dnes</p>
        {opportunities.map(op => (
          <div key={op.name} className={cn('flex items-center gap-3 p-2.5 rounded-xl mb-2', t.surf)}>
            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', op.iconBg)}>
              <op.Icon size={14} className="text-white" />
            </div>
            <div className="flex-1">
              <p className={cn('text-[11px] font-semibold', t.text)}>{op.name}</p>
              <p className="text-green-400 text-[9px] font-semibold">{op.bonus}</p>
            </div>
            <div className={cn('px-2 py-0.5 rounded-full text-[8px] font-bold', op.active?'bg-green-500/20 text-green-400':'bg-zinc-700/50 text-zinc-400')}>{op.expiry}</div>
          </div>
        ))}
      </div>
      <BNav t={t} act="star" />
    </div>
  )
}

// 17 Command Center (Power user, dense)
function D17({ t }: { t: AT }) {
  return (
    <div className={cn('flex flex-col h-full font-mono', t.bg)}>
      <SBar t={t} />
      <div className="flex-1 overflow-hidden px-3 pt-2 space-y-1.5 text-[10px]">
        <div className="flex items-center justify-between border-b pb-1.5" style={{borderColor:'#27272a'}}>
          <p className="text-blue-400 font-bold text-[11px]">MO.ONE ▸ DASHBOARD</p>
          <p className={t.muted}>10 APR 2026 · 09:41</p>
        </div>
        <div className={cn('rounded-lg p-2.5', t.surf)}>
          <div className="flex items-center justify-between">
            <p className={t.muted}>CZKT_BALANCE</p>
            <p className={cn('font-bold text-[14px]', t.text)}>12 450,– Kč</p>
          </div>
          <div className="flex gap-4 mt-1">
            <span className="text-green-400">↑ IN: +22,–</span>
            <span className="text-red-400">↓ OUT: -89,–</span>
            <span className="text-amber-400">★ SD: 14 250</span>
          </div>
        </div>
        <div className={cn('rounded-lg p-2.5', t.surf)}>
          <p className={cn('mb-1.5', t.muted)}>SPEND_7D (Kč)</p>
          <div className="flex items-end gap-1 h-8">
            {[40,65,30,80,55,90,45].map((h,i) => (
              <div key={i} className="flex-1 rounded-sm bg-blue-600 opacity-80" style={{height:`${h}%`}} />
            ))}
          </div>
          <div className="flex justify-between mt-0.5">
            {['Po','Út','St','Čt','Pá','So','Ne'].map(d=><span key={d} className={cn('flex-1 text-center text-[7px]', t.muted)}>{d}</span>)}
          </div>
        </div>
        <div className={cn('rounded-lg p-2', t.surf)}>
          <p className={cn('mb-1', t.muted)}>RECENT_TXN</p>
          {[
            {t:'09:28','desc':'SANTHIA_COFFEE','amt':'-89'},
            {t:'09:28','desc':'STARDUST_BONUS','amt':'+130'},
            {t:'Včera','desc':'FESTIVAL_2027','amt':'-4888'},
            {t:'Včera','desc':'CASHBACK_SETTLE','amt':'+22'},
          ].map(tx => (
            <div key={tx.desc} className="flex gap-2 py-0.5">
              <span className={t.sub}>{tx.t}</span>
              <span className={cn('flex-1 truncate', t.text)}>{tx.desc}</span>
              <span className={tx.amt[0]==='-'?'text-red-400':'text-green-400'}>{tx.amt}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            {k:'STREAK', v:'7d', Icon: Flame, c:'text-amber-400'},
            {k:'CASHBACK',v:'2.4%', Icon: TrendingUp, c:'text-green-400'},
            {k:'TIER',   v:'GOLD', Icon: Trophy, c:'text-yellow-400'},
            {k:'CHATS',  v:'3 unrd', Icon: MessageCircle, c:'text-blue-400'},
            {k:'NFC',    v:'READY', Icon: CreditCard, c:'text-green-400'},
            {k:'LIMIT',  v:'50k/m', Icon: Building2, c:t.muted},
          ].map(s => (
            <div key={s.k} className={cn('rounded-lg p-2', t.surf)}>
              <div className="flex items-center gap-1 mb-0.5">
                <s.Icon size={8} className={s.c} />
                <p className={cn('text-[7px]', t.sub)}>{s.k}</p>
              </div>
              <p className={cn('text-[11px] font-bold', s.c)}>{s.v}</p>
            </div>
          ))}
        </div>
      </div>
      <BNav t={t} />
    </div>
  )
}

// 18 Minimal Pay (Zen)
function D18({ t }: { t: AT }) {
  return (
    <div className={cn('flex flex-col h-full', t.bg)}>
      <SBar t={t} />
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8">
        <p className={cn('text-[11px] tracking-widest uppercase', t.muted)}>Zůstatek</p>
        <p className={cn('text-5xl font-black tracking-tight', t.text)}>12 450<span className="text-3xl font-bold">,–</span></p>
        <p className={cn('text-[11px]', t.muted)}>CZK · CZKT · Mo.one</p>
        <div className="w-44 h-44 rounded-full bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/40 mt-2 cursor-pointer active:scale-95 transition-transform">
          <div className="text-center">
            <CreditCard size={32} className="text-white mx-auto mb-2" />
            <p className="text-white text-xl font-black">Zaplatit</p>
            <p className="text-blue-200 text-[10px] mt-0.5">NFC · QR · Kontakt</p>
          </div>
        </div>
        <div className="flex gap-6 mt-2">
          <div className="flex items-center gap-1">
            <ArrowUpRight size={12} className={t.muted} />
            <p className={cn('text-[11px]', t.muted)}>Poslat</p>
          </div>
          <div className="flex items-center gap-1">
            <ArrowDownLeft size={12} className={t.muted} />
            <p className={cn('text-[11px]', t.muted)}>Přijmout</p>
          </div>
          <div className="flex items-center gap-1">
            <Star size={12} className="text-amber-400" />
            <p className={cn('text-[11px]', t.muted)}>14 250</p>
          </div>
        </div>
      </div>
      <BNav t={t} />
    </div>
  )
}

// 19 Live Activities (Dynamic Island expansion)
function D19({ t }: { t: AT }) {
  return (
    <div className={cn('flex flex-col h-full', t.bg)}>
      <SBar t={t} />
      {/* Expanded Dynamic Island */}
      <div className="mx-4 -mt-1 mb-3 rounded-2xl bg-black p-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center shrink-0"><Car size={18} className="text-white" /></div>
          <div className="flex-1">
            <p className="text-white text-[11px] font-bold">Taxi · přijíždí za 3 min</p>
            <div className="flex items-center gap-1 mt-0.5">
              <div className="h-1.5 flex-1 rounded-full bg-zinc-700 overflow-hidden"><div className="h-full rounded-full bg-orange-500 animate-pulse" style={{width:'75%'}} /></div>
              <p className="text-orange-400 text-[9px] font-bold shrink-0">ETA 3'</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white text-[10px] font-bold">89 Kč</p>
            <p className="text-zinc-400 text-[8px]">Mo.one Pay</p>
          </div>
        </div>
      </div>
      {/* Recent live events */}
      <div className="px-4 flex-1 overflow-hidden space-y-2">
        <p className={cn('text-[9px] font-bold uppercase tracking-widest mb-1', t.muted)}>Živé aktivity</p>
        {/* Active payment */}
        <div className={cn('rounded-2xl p-3 border-l-2 border-green-500', t.surf)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center"><CreditCard size={14} className="text-green-400" /></div>
              <div><p className={cn('text-[11px] font-bold', t.text)}>Platba v průběhu</p><p className={cn('text-[9px]', t.muted)}>Santhia Coffee · NFC</p></div>
            </div>
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
          </div>
        </div>
        {/* Delivery tracking */}
        <div className={cn('rounded-2xl p-3 border-l-2 border-blue-500', t.surf)}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center"><Package size={14} className="text-blue-400" /></div>
            <div><p className={cn('text-[11px] font-bold', t.text)}>Zásilkovna doručení</p><p className={cn('text-[9px]', t.muted)}>Geladrink Forte · balík</p></div>
          </div>
          <div className="flex items-center gap-1">
            {['Odesláno','Přepravce','V Praze','Doručení'].map((step, i) => (
              <div key={step} className="flex-1 text-center">
                <div className={cn('h-1.5 rounded-full mb-1', i<=2?'bg-blue-500':'bg-zinc-700')} />
                <p className={cn('text-[7px]', i<=2?'text-blue-400':t.muted)}>{step}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Stardust earning */}
        <div className={cn('rounded-2xl p-3 border-l-2 border-amber-500', t.surf)}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center"><Star size={14} className="text-amber-400" /></div>
            <div>
              <p className={cn('text-[11px] font-bold', t.text)}>+130 Stardust earned</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Flame size={9} className="text-orange-400" />
                <p className={cn('text-[9px]', t.muted)}>Streak: 7 dní · Double XP aktivní</p>
              </div>
            </div>
          </div>
        </div>
        {/* Balance */}
        <div className={cn('rounded-2xl p-3', t.surf)}>
          <div className="flex items-center justify-between">
            <p className={cn('text-[11px]', t.muted)}>Zůstatek po platbě</p>
            <p className={cn('text-[16px] font-bold', t.text)}>12 361,– Kč</p>
          </div>
        </div>
      </div>
      <BNav t={t} />
    </div>
  )
}

// 20 Tabbed Universe
function D20({ t }: { t: AT }) {
  const [tab, setTab] = useState<'platit'|'vydelat'|'objevit'>('platit')
  const tabs = [
    { id: 'platit' as const,  Icon: CreditCard, label: 'Platit' },
    { id: 'vydelat' as const, Icon: Star,        label: 'Vydělat' },
    { id: 'objevit' as const, Icon: Globe,       label: 'Objevit' },
  ]
  return (
    <div className={cn('flex flex-col h-full', t.bg)}>
      <SBar t={t} />
      <div className="px-4 pt-2 pb-0 flex items-center justify-between shrink-0">
        <p className={cn('text-base font-bold', t.text)}>Mo.one</p>
        <div className="flex gap-2"><Bell size={15} className={t.muted} /><div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">P</div></div>
      </div>
      {/* Tabs with icons */}
      <div className={cn('flex px-4 py-2 gap-1 shrink-0 border-b', t.bord)}>
        {tabs.map(({ id, Icon, label }) => (
          <button key={id} onClick={() => setTab(id)}
            className={cn('flex-1 py-1.5 rounded-xl flex items-center justify-center gap-1 text-[10px] font-bold transition-colors', tab===id?'bg-blue-600 text-white':cn(t.surf,t.muted))}>
            <Icon size={10} />
            {label}
          </button>
        ))}
      </div>
      {/* Tab content */}
      <div className="flex-1 overflow-hidden px-4 pt-3">
        {tab==='platit' && (
          <div className="space-y-3">
            <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-4">
              <p className="text-blue-200 text-[9px]">Zůstatek</p>
              <p className="text-white text-3xl font-bold">12 450<span className="text-xl">,–</span></p>
              <div className="flex gap-2 mt-3">
                {[
                  { Icon: CreditCard, label:'NFC', primary:true },
                  { Icon: Play, label:'QR', primary:false },
                  { Icon: Send, label:'Poslat', primary:false },
                ].map((a,i)=>(
                  <div key={i} className={cn('flex-1 py-1.5 rounded-xl flex flex-col items-center gap-0.5', a.primary?'bg-white':'bg-blue-500/50')}>
                    <a.Icon size={10} className={a.primary?'text-blue-700':'text-white'} />
                    <span className={cn('text-[8px] font-bold', a.primary?'text-blue-700':'text-white')}>{a.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className={cn('text-[9px] font-bold uppercase tracking-widest', t.muted)}>Nedávné</p>
            {[
              {n:'Santhia', a:'-89 Kč', Icon: Coffee, bg:'bg-amber-600'},
              {n:'Cashback', a:'+22 Kč', Icon: Star, bg:'bg-green-600'},
              {n:'Zásilkovna', a:'-60 Kč', Icon: Package, bg:'bg-gray-600'},
            ].map(tx=>(
              <div key={tx.n} className="flex items-center gap-2.5">
                <TxIcon icon={tx.Icon} color={tx.bg} />
                <p className={cn('flex-1 text-[11px]', t.text)}>{tx.n}</p>
                <p className={cn('text-[11px] font-semibold', tx.a[0]==='-'?'text-red-400':'text-green-400')}>{tx.a}</p>
              </div>
            ))}
          </div>
        )}
        {tab==='vydelat' && (
          <div className="space-y-2">
            <div className="rounded-2xl bg-gradient-to-br from-green-700 to-emerald-900 p-3 mb-1">
              <p className="text-green-200 text-[9px]">Cashback rate</p>
              <p className="text-white text-4xl font-black">2.4%</p>
              <p className="text-green-300 text-[9px] mt-0.5">Gold tier · 14 250 Stardust</p>
            </div>
            {[
              {Icon: Coffee, bg:'bg-amber-600', n:'Santhia dnes', b:'2× Stardust'},
              {Icon: Store,  bg:'bg-blue-600',  n:'Albert nákup', b:'+100 SD'},
              {Icon: Music2, bg:'bg-violet-600',n:'Festival ticket',b:'+500 SD'},
            ].map(op=>(
              <div key={op.n} className={cn('flex items-center gap-2.5 p-2.5 rounded-xl', t.surf)}>
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', op.bg)}>
                  <op.Icon size={14} className="text-white" />
                </div>
                <div className="flex-1"><p className={cn('text-[11px] font-semibold', t.text)}>{op.n}</p><p className="text-green-400 text-[9px]">{op.b}</p></div>
                <div className="bg-blue-600 px-2 py-0.5 rounded-full"><p className="text-white text-[9px] font-bold">Platit</p></div>
              </div>
            ))}
          </div>
        )}
        {tab==='objevit' && (
          <div className="space-y-2">
            <div className={cn('rounded-2xl overflow-hidden border', t.surf, t.bord)}>
              <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=280&h=100&fit=crop&q=70" className="w-full h-20 object-cover" />
              <div className="p-2.5"><p className={cn('text-[11px] font-bold', t.text)}>Voucher na večeři</p><div className="flex items-center justify-between mt-1"><p className={cn('text-[9px]', t.muted)}>Moravská kuchyně</p><div className="bg-blue-600 px-2 py-0.5 rounded-full"><p className="text-white text-[9px] font-bold">1 234,–</p></div></div></div>
            </div>
            {[
              {Icon: Car,  bg:'bg-orange-600', n:'Taxi · Domů', sub:'Odhadovaná cena: 89 Kč'},
              {Icon: Utensils, bg:'bg-rose-600', n:'Jídlo · Rozvoz', sub:'Doručení do 30 min'},
              {Icon: Bike, bg:'bg-teal-600', n:'Mikro mobilita', sub:'E-kolo 200m od tebe'},
            ].map(s=>(
              <div key={s.n} className={cn('flex items-center gap-2.5 p-2.5 rounded-xl', t.surf)}>
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', s.bg)}>
                  <s.Icon size={14} className="text-white" />
                </div>
                <div className="flex-1"><p className={cn('text-[11px] font-semibold', t.text)}>{s.n}</p><p className={cn('text-[9px]', t.muted)}>{s.sub}</p></div>
                <ChevronRight size={12} className={t.muted} />
              </div>
            ))}
          </div>
        )}
      </div>
      <BNav t={t} />
    </div>
  )
}

// ── Dashboard concept metadata ──────────────────────────────────────

interface DashConcept {
  id: string; num: string; title: string
  tag: string; tagColor: string
  desc: string; insight: string
  render: (t: AT) => React.ReactNode
}

const CONCEPTS: DashConcept[] = [
  { id:'balance', num:'01', title:'Balance Focus', tag:'Wallet', tagColor:'bg-blue-600',
    desc:'iOS Wallet-style. Velký zůstatek dominuje. Rychlé akce a transakce s ikonami.', insight:'Nejpřirozenější pro uživatele z bankovních aplikací.',
    render: (t) => <D01 t={t} /> },
  { id:'stories', num:'02', title:'Stories Discovery', tag:'Social', tagColor:'bg-violet-600',
    desc:'Stories nahoře jako Instagram — čisté kruhy s foto, bez textových prstenců. Merchant deal cards scrollují níže.', insight:'Zvyšuje engagement s merchant obsahem přes story formát.',
    render: (t) => <D02 t={t} /> },
  { id:'stream', num:'03', title:'Activity Stream', tag:'Feed', tagColor:'bg-indigo-600',
    desc:'Chronologický feed: platby, zprávy a odměny v jednom proudu. Každá položka má barevnou ikonu.', insight:'Ukazuje kontextové spojení mezi akcemi v reálném čase.',
    render: (t) => <D03 t={t} /> },
  { id:'stardust', num:'04', title:'Stardust Central', tag:'Gamify', tagColor:'bg-amber-500',
    desc:'Celá plocha je o gamifikaci: XP ring, streak s ikonou, tier, odměny s Lucide ikonami.', insight:'Maximalizuje engagement přes odměnový loop.',
    render: (t) => <D04 t={t} /> },
  { id:'map', num:'05', title:'Nearby Map', tag:'Location', tagColor:'bg-teal-600',
    desc:'Mapa jako primární obsah. Merchant piny, Platit tady CTA.', insight:'Pro uživatele v pohybu. Konverze v místě fyzické přítomnosti.',
    render: (t) => <D05 t={t} /> },
  { id:'chat', num:'06', title:'Chat-First', tag:'Messaging', tagColor:'bg-purple-600',
    desc:'Chat list je primární UI. Balance jako malý badge v headeru.', insight:'Pro uživatele, kteří platí hlavně přes P2P přátelé.',
    render: (t) => <D06 t={t} /> },
  { id:'ai', num:'07', title:'AI Concierge', tag:'AI', tagColor:'bg-cyan-600',
    desc:'AI morning brief: kontext, smart návrhy, proaktivní akce. Bez emoji v textu.', insight:'Personalizace bez konfigurace — AI čte chování.',
    render: (t) => <D07 t={t} /> },
  { id:'miniapps', num:'08', title:'Mini-App Grid', tag:'Platform', tagColor:'bg-orange-600',
    desc:'WeChat-style launcher: 4x3 grid mini apps. Platforma nad vším.', insight:'Škáluje na integrované partnery přes Mini-App SDK.',
    render: (t) => <D08 t={t} /> },
  { id:'cards', num:'09', title:'Card Stack Wallet', tag:'Cards', tagColor:'bg-blue-700',
    desc:'Apple Wallet styl: karty stackované, CZKT a EMV v popředí.', insight:'Fyzická a digitální karta jako primární identita uživatele.',
    render: (t) => <D09 t={t} /> },
  { id:'reel', num:'10', title:'Merchant Reel', tag:'Commerce', tagColor:'bg-rose-600',
    desc:'TikTok/Reels commerce: full-bleed merchant foto bez navigace. Obraz vyplňuje celých 640px.', insight:'Nejvyšší konverzní potenciál přes impulsní nákup.',
    render: (t) => <D10 t={t} /> },
  { id:'brief', num:'11', title:'Morning Brief', tag:'Summary', tagColor:'bg-zinc-600',
    desc:'Novinový formát: shrnutí včera a co tě čeká dnes. Každá položka má ikonu, nula emoji.', insight:'Denní ritual. Buduje návyk otevírat app každé ráno.',
    render: (t) => <D11 t={t} /> },
  { id:'donut', num:'12', title:'Spending Donut', tag:'Analytics', tagColor:'bg-blue-500',
    desc:'Donut chart: výdaje dle kategorie. Finanční přehled v centru.', insight:'Pro analytické uživatele, kteří sledují budget.',
    render: (t) => <D12 t={t} /> },
  { id:'context', num:'13', title:'Context Aware', tag:'Smart', tagColor:'bg-indigo-500',
    desc:'Večerní mode: taxi suggestion s Car ikonou, nearby restaurants a store s Lucide ikonami, čas-based.', insight:'Kontextuální UI mění obsah dle hodiny, polohy, zvyků.',
    render: (t) => <D13 t={t} /> },
  { id:'widgets', num:'14', title:'Widget Matrix', tag:'Modular', tagColor:'bg-violet-500',
    desc:'iOS 16+ widget tiles: balance, Stardust, chat, nearby v mřížce. Ikony místo emoji.', insight:'Každý widget klikatelný. Nejrychlejší přístup k akcím.',
    render: (t) => <D14 t={t} /> },
  { id:'social', num:'15', title:'Social Payments', tag:'P2P', tagColor:'bg-pink-600',
    desc:'Přátelé, splity, group fondy s Trophy ikonou, P2P žádosti v centru. Čisté bez emoji.', insight:'Virální growth: platba jako social akce, ne jen transakce.',
    render: (t) => <D15 t={t} /> },
  { id:'reward', num:'16', title:'Reward Engine', tag:'Cashback', tagColor:'bg-green-600',
    desc:'Velký cashback rate, tier progress s Trophy, daily earn s kategoriálními ikonami.', insight:'Motivuje uživatele platit Mo.one co nejčastěji.',
    render: (t) => <D16 t={t} /> },
  { id:'command', num:'17', title:'Command Center', tag:'Power', tagColor:'bg-zinc-700',
    desc:'Bloomberg-style dense UI. Vše najednou, pro power users. Status grid s mini ikonami.', insight:'B2B/hunter segment: maximální informace, nulové scroll.',
    render: (t) => <D17 t={t} /> },
  { id:'minimal', num:'18', title:'Zero-Friction Pay', tag:'Minimal', tagColor:'bg-blue-800',
    desc:'Jeden velký Zaplatit button. Zen design, nula položek. Čisté ikony pro akce.', insight:'Conversion-first. Odstraňuje veškerou kognitivní zátěž.',
    render: (t) => <D18 t={t} /> },
  { id:'live', num:'19', title:'Live Activities', tag:'Dynamic', tagColor:'bg-orange-500',
    desc:'Dynamic Island rozšířený: taxi tracking s Car ikonou, platba live, delivery s Package ikonou.', insight:'iOS 16+ Live Activities API — realtime bez odemknutí.',
    render: (t) => <D19 t={t} /> },
  { id:'tabs', num:'20', title:'Tabbed Universe', tag:'Navigation', tagColor:'bg-sky-600',
    desc:'3 tahy: Platit (CreditCard) / Vydělat (Star) / Objevit (Globe) — kompletní ekosystém s ikonami v tabech.', insight:'Rozděluje intent. Každý tab má jasný úkol a ikonu.',
    render: (t) => <D20 t={t} /> },
]

// ── Shared card + label (copy the primitives locally) ──────────────

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

// ── ExperimentalSection ─────────────────────────────────────────────

export function ExperimentalSection() {
  const [selected, setSelected] = useState(0)
  const [appTheme, setAppTheme] = useState<'dark'|'light'>('dark')
  const t = THEMES[appTheme]
  const concept = CONCEPTS[selected]!

  return (
    <div>
      <SectionHeader
        eyebrow="Experimental — 16"
        title="Dashboard Lab"
        desc="20 konceptů home screen pro Mo.one SuperApp. Každý layout testuje jiný způsob, jak uživatel vnímá platby, odměny a každodenní život s Mo.one." />

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex rounded-xl border border-border overflow-hidden text-sm">
          {(['dark','light'] as const).map(th => (
            <button key={th} onClick={() => setAppTheme(th)}
              className={cn('px-3 py-1.5 font-medium transition-colors capitalize',
                appTheme === th ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted')}>
              {th === 'dark' ? '◾ Dark' : '◽ Light'}
            </button>
          ))}
        </div>
        <span className="text-sm text-muted-foreground">— vyberte koncept níže a procházejte layouts</span>
      </div>

      {/* Concept selector grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 mb-8">
        {CONCEPTS.map((c, i) => (
          <button
            key={c.id}
            onClick={() => setSelected(i)}
            className={cn(
              'text-left p-3 rounded-xl border transition-all',
              selected === i
                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                : 'border-border hover:border-primary/40 hover:bg-muted/30',
            )}
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-[9px] font-mono text-muted-foreground">{c.num}</span>
              <span className={cn('text-[8px] font-bold px-1.5 py-0.5 rounded text-white', c.tagColor)}>{c.tag}</span>
            </div>
            <p className="text-xs font-semibold leading-tight">{c.title}</p>
          </button>
        ))}
      </div>

      {/* Phone + detail */}
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Phone mockup */}
        <div className="shrink-0 mx-auto lg:mx-0">
          <PhoneMock t={t}>
            {concept.render(t)}
          </PhoneMock>
          <div className="flex justify-center mt-3">
            <div className="h-1 rounded-full w-24 bg-zinc-700" />
          </div>
          <div className="text-center mt-2">
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
              iPhone 17 Pro — {concept.num} {concept.title}
            </span>
          </div>
        </div>

        {/* Concept detail */}
        <div className="flex-1 space-y-4">
          <Card>
            <div className="flex items-start gap-3 mb-4">
              <span className="text-4xl font-black text-muted-foreground/20 leading-none">{concept.num}</span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold">{concept.title}</h2>
                  <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full text-white', concept.tagColor)}>{concept.tag}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{concept.desc}</p>
              </div>
            </div>
            <div className="border-t border-border pt-4">
              <CardLabel>Strategický insight</CardLabel>
              <p className="text-sm text-muted-foreground leading-relaxed">{concept.insight}</p>
            </div>
          </Card>

          <Card>
            <CardLabel>Všechny koncepty</CardLabel>
            <div className="space-y-1.5">
              {CONCEPTS.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => setSelected(i)}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors text-sm',
                    selected === i ? 'bg-primary/10 text-foreground' : 'hover:bg-muted text-muted-foreground',
                  )}
                >
                  <span className="font-mono text-[10px] w-6 shrink-0">{c.num}</span>
                  <span className={cn('text-[8px] font-bold px-1.5 py-0.5 rounded text-white shrink-0', c.tagColor)}>{c.tag}</span>
                  <span className="font-medium truncate">{c.title}</span>
                  {selected === i && <span className="ml-auto text-primary text-xs">←</span>}
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <CardLabel>Mobile tech stack relevance</CardLabel>
            <div className="space-y-1.5 text-[11px] text-muted-foreground">
              {[
                { Icon: CreditCard, label: 'NFC / AppClip', desc: 'Layouts 01, 09, 18 — přímá NFC platba jako primární akce' },
                { Icon: MapPin,     label: 'Location Services', desc: 'Layout 05, 13 — kontextová mapa a smart suggestions' },
                { Icon: Bell,       label: 'Live Activities', desc: 'Layout 19 — Dynamic Island taxi/payment tracking' },
                { Icon: Star,       label: 'Gamify / Stardust', desc: 'Layout 04 — Stardust streak, pohybové senzory a body' },
                { Icon: Sparkles,   label: 'AI / Mini Apps', desc: 'Layout 07, 08 — AI concierge a WeChat SDK platforma' },
                { Icon: MessageCircle, label: 'CallKit / P2P', desc: 'Layout 06, 15 — chat-first, P2P platby v konverzaci' },
                { Icon: Zap,        label: 'Offline Payments', desc: 'Layout 18 — minimální UI = nejnižší latence, offline ready' },
              ].map(({ Icon, label, desc }) => (
                <div key={label} className="flex gap-2 items-start">
                  <Icon size={11} className="shrink-0 mt-0.5 text-foreground/40" />
                  <span><strong className="text-foreground">{label}</strong> — {desc}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
