// =============================================================================
// client/src/modules/public/GuidelinesPage.tsx — Public brand guidelines
// Read-only version of the CI module for external audiences
// =============================================================================

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import {
  VALUES, COLORS, COLOR_SECTIONS, TYPOGRAPHY, ENTITIES,
} from '../admin/ci/data';
import type { CiEditable } from '@shared/types';

const DEFAULTS = {
  missionOne: 'Stavíme novou kategorii produktu — ekosystém, který platí zákazníkům za to, že s ním platí. PREMIUM pro každého.',
  brandPromise: '"Mo.one ti platí za to, že platíš s námi."',
  values: VALUES,
};

export function GuidelinesPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const { data: ciData } = useQuery({
    queryKey: ['ci-public'],
    queryFn: () => api.get<{ data: Partial<CiEditable> }>('/ci').then(r => r.data.data).catch(() => ({})),
    retry: false,
  });

  const ci = { ...DEFAULTS, ...(ciData ?? {}) };

  function copyHex(hex: string) {
    navigator.clipboard.writeText(hex).catch(() => {});
    setCopied(hex);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="animate-fade-in space-y-20">
      {/* Header */}
      <div>
        <p className="label-caps mb-3" style={{ color: 'var(--primary)' }}>BRAND GUIDELINES</p>
        <h1 className="text-4xl font-bold tracking-tight mb-4" style={{ color: 'var(--text)' }}>
          Mo.one Corporate Identity
        </h1>
        <p className="text-base max-w-2xl" style={{ color: 'var(--muted)' }}>
          Tento dokument definuje vizuální a verbální identitu Mo.one holdingu.
          Platí pro všechny právní entity, produkty a komunikační kanály.
        </p>
      </div>

      {/* Mission */}
      <section id="mission">
        <p className="label-caps mb-6">MISE</p>
        <blockquote
          className="text-2xl font-semibold leading-snug max-w-3xl mb-8"
          style={{ color: 'var(--text)' }}
        >
          {ci.missionOne}
        </blockquote>
        <div
          className="p-6 rounded-2xl border inline-block"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <p className="label-caps mb-2" style={{ color: 'var(--primary)' }}>BRAND PROMISE</p>
          <p className="text-lg font-semibold" style={{ color: 'var(--text)' }}>{ci.brandPromise}</p>
        </div>
      </section>

      {/* Values */}
      <section id="values">
        <p className="label-caps mb-6">HODNOTY</p>
        <div className="grid md:grid-cols-2 gap-4">
          {ci.values.map((v) => (
            <div
              key={v.num}
              className="p-6 rounded-2xl border"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="label-caps" style={{ color: 'var(--primary)' }}>{v.num}</span>
                <h3 className="font-semibold" style={{ color: 'var(--text)' }}>{v.title}</h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Colors */}
      <section id="colors">
        <p className="label-caps mb-2">BARVY</p>
        <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
          Modrá = interakce. Zelená = odměna. Nikdy naopak.
        </p>
        <div className="space-y-8">
          {COLOR_SECTIONS.map(section => (
            <div key={section.key}>
              <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>{section.label}</p>
              <div className="flex flex-wrap gap-3">
                {COLORS[section.key].map(token => (
                  <button
                    key={token.hex}
                    onClick={() => copyHex(token.hex)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-colors hover:border-[var(--primary)]"
                    style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg border flex-shrink-0"
                      style={{ background: token.hex, borderColor: 'var(--border)' }}
                    />
                    <div>
                      <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
                        {copied === token.hex ? 'Zkopírováno!' : token.hex}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--muted)' }}>{token.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section id="typography">
        <p className="label-caps mb-6">TYPOGRAFIE</p>
        <div
          className="p-6 rounded-2xl border mb-6"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <p className="label-caps mb-2">PRIMÁRNÍ PÍSMO</p>
          <p className="text-4xl font-bold" style={{ fontFamily: 'Figtree, sans-serif', color: 'var(--text)' }}>
            Figtree
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>300 – 900 váhy · Google Fonts</p>
        </div>
        <div className="space-y-3">
          {TYPOGRAPHY.map(spec => (
            <div
              key={spec.name}
              className="flex items-baseline gap-6 px-5 py-4 rounded-xl border"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <div className="w-24 flex-shrink-0">
                <p className="label-caps">{spec.name}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{spec.size} / {spec.weight}</p>
              </div>
              <p style={{ fontSize: spec.size, fontWeight: spec.weight, color: 'var(--text)', lineHeight: 1.2 }}>
                {spec.sample}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Entities */}
      <section id="entities">
        <p className="label-caps mb-6">ENTITY & SUB-BRANDY</p>
        <div className="grid md:grid-cols-2 gap-4">
          {ENTITIES.map(e => (
            <div
              key={e.name}
              className="p-6 rounded-2xl border"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 rounded-full" style={{ background: e.color }} />
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{e.name}</p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>{e.sub}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--muted)' }}>{e.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {e.products.map(p => (
                  <span
                    key={p}
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: 'var(--elevated)', color: 'var(--muted)' }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
