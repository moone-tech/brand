// =============================================================================
// client/src/modules/public/HomePage.tsx — Public brand portal landing page
// =============================================================================

import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Heart, Globe } from 'lucide-react';

const PILLARS = [
  {
    icon: Zap,
    title: 'A2A platby',
    desc: 'Přímé platby z účtu na účet bez poplatků. Nová kategorie platební infrastruktury.',
    color: 'var(--primary)',
  },
  {
    icon: Heart,
    title: 'Pravidelný příjem',
    desc: 'Mo.one platí uživatelům za to, že platí. Cashback a věrnostní program bez kompromisů.',
    color: 'var(--reward)',
  },
  {
    icon: Globe,
    title: 'SuperApp ekosystém',
    desc: 'Hub, Marketplace, Stories, MiniApps — jeden ekosystém pro celý finanční život.',
    color: 'var(--warning)',
  },
];

const AUDIENCES = [
  { label: 'Zaměstnanci', href: '/guidelines', desc: 'Brand guidelines a identity systém' },
  { label: 'Merchanté', href: '/guidelines#entities', desc: 'Legi.one a Mo.one Digital logo kit' },
  { label: 'Média', href: '/assets', desc: 'Press kit a vizuální assety ke stažení' },
  { label: 'Franšízanti', href: '/guidelines#entities', desc: 'Hunter franchise brand manuál' },
];

export function HomePage() {
  return (
    <div className="animate-fade-in space-y-24">
      {/* Hero */}
      <section className="pt-12 pb-4">
        <div className="max-w-3xl">
          <p className="label-caps mb-4" style={{ color: 'var(--primary)' }}>PREMIUM PRO KAŽDÉHO</p>
          <h1
            className="text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6"
            style={{ color: 'var(--text)' }}
          >
            Nová kategorie
            <br />
            <span style={{ color: 'var(--primary)' }}>finanční svobody.</span>
          </h1>
          <p className="text-lg max-w-xl" style={{ color: 'var(--muted)' }}>
            Mo.one mění pravidla hry — z platby děláme odměnu. Tento portál předává
            vše, co tvoří brand Mo.one: vizuální identitu, hodnoty, hlas a vizi.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link
              to="/guidelines"
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
              style={{ background: 'var(--primary)', color: 'var(--primary-fg)' }}
            >
              Brand Guidelines <ArrowRight size={16} />
            </Link>
            <Link
              to="/assets"
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              Stáhnout assety
            </Link>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section>
        <p className="label-caps mb-8">CO DĚLÁME JINAK</p>
        <div className="grid md:grid-cols-3 gap-4">
          {PILLARS.map(p => (
            <div
              key={p.title}
              className="p-6 rounded-2xl border"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `color-mix(in srgb, ${p.color} 15%, transparent)` }}
              >
                <p.icon size={20} style={{ color: p.color }} />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--text)' }}>{p.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Audiences */}
      <section>
        <p className="label-caps mb-8">PRO KOHO JE TENTO PORTÁL</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {AUDIENCES.map(a => (
            <Link
              key={a.label}
              to={a.href}
              className="group p-5 rounded-2xl border transition-colors hover:border-[var(--primary)]"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{a.label}</span>
                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--primary)' }} />
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>{a.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section
        className="p-10 rounded-3xl border text-center"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <p className="label-caps mb-4" style={{ color: 'var(--primary)' }}>MISE</p>
        <blockquote
          className="text-2xl md:text-3xl font-semibold tracking-tight max-w-2xl mx-auto leading-snug"
          style={{ color: 'var(--text)' }}
        >
          "Platit přináší pravidelný příjem — to je nová normálnost."
        </blockquote>
        <p className="text-sm mt-6" style={{ color: 'var(--muted)' }}>Mo.one a.s. — PSD2 platební instituce, ČNB</p>
      </section>
    </div>
  );
}
