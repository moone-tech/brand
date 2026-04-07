// =============================================================================
// client/src/components/HeroIllustration.tsx — Mo.one A2A network illustration
// Anchor-first: neutral palette only. One subtle primary accent on the hub.
// =============================================================================

export function HeroIllustration() {
  const cx = 260;
  const cy = 215;
  const OUTER_R = 158;
  const INNER_R  = 88;
  const CENTER_R = 44;

  const outerLabels = ['A2A', 'Hub', 'CZKT', 'Legi.one', 'Hunter', 'POS'];
  const outerNodes = outerLabels.map((label, i) => {
    const angle = (i * 60 - 90) * (Math.PI / 180);
    return {
      x: cx + OUTER_R * Math.cos(angle),
      y: cy + OUTER_R * Math.sin(angle),
      label,
    };
  });

  const innerNodes = Array.from({ length: 3 }, (_, i) => {
    const angle = (i * 120 - 30) * (Math.PI / 180);
    return {
      x: cx + INNER_R * Math.cos(angle),
      y: cy + INNER_R * Math.sin(angle),
    };
  });

  // Two dots per spoke at 30 % and 68 % along each outer connection
  const flowDots = outerNodes.flatMap((n, i) => [
    { x: cx + (n.x - cx) * 0.30, y: cy + (n.y - cy) * 0.30, key: `fd-${i}-a` },
    { x: cx + (n.x - cx) * 0.68, y: cy + (n.y - cy) * 0.68, key: `fd-${i}-b` },
  ]);

  // Label anchor: push the text slightly beyond the outer node
  function labelPos(n: { x: number; y: number }) {
    const dx = n.x - cx;
    const dy = n.y - cy;
    const len = Math.sqrt(dx * dx + dy * dy);
    const scale = (OUTER_R + 26) / len;
    return { x: cx + dx * scale, y: cy + dy * scale };
  }

  return (
    <svg
      viewBox="0 0 520 430"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      {/* ── Subtle dot grid (background texture) ─────────────────────────────── */}
      {Array.from({ length: 7 }, (_, row) =>
        Array.from({ length: 9 }, (_, col) => (
          <circle
            key={`dot-${row}-${col}`}
            cx={48 + col * 56}
            cy={28 + row * 62}
            r={1}
            fill="var(--border)"
            opacity="0.45"
          />
        ))
      )}

      {/* ── Outer guide ring (faint, wide dashes) ───────────────────────────── */}
      <circle
        cx={cx} cy={cy} r={OUTER_R + 22}
        stroke="var(--border)" strokeWidth="0.5" strokeDasharray="2 9"
        opacity="0.35"
      />

      {/* ── Outer orbit ring ────────────────────────────────────────────────── */}
      <circle
        cx={cx} cy={cy} r={OUTER_R}
        stroke="var(--border)" strokeWidth="1" strokeDasharray="3 8"
        opacity="0.55"
      />

      {/* ── Inner orbit ring ────────────────────────────────────────────────── */}
      <circle
        cx={cx} cy={cy} r={INNER_R}
        stroke="var(--border)" strokeWidth="0.5"
        opacity="0.45"
      />

      {/* ── Spokes: center → outer nodes ────────────────────────────────────── */}
      {outerNodes.map((n, i) => (
        <line
          key={`spoke-${i}`}
          x1={cx} y1={cy}
          x2={n.x} y2={n.y}
          stroke="var(--border)" strokeWidth="0.75"
          opacity="0.6"
        />
      ))}

      {/* ── Spokes: center → inner nodes ────────────────────────────────────── */}
      {innerNodes.map((n, i) => (
        <line
          key={`ispoke-${i}`}
          x1={cx} y1={cy}
          x2={n.x} y2={n.y}
          stroke="var(--border)" strokeWidth="0.5"
          opacity="0.35"
        />
      ))}

      {/* ── Flow markers along spokes ───────────────────────────────────────── */}
      {flowDots.map(d => (
        <circle key={d.key} cx={d.x} cy={d.y} r={1.8} fill="var(--muted)" opacity="0.5" />
      ))}

      {/* ── Inner nodes ─────────────────────────────────────────────────────── */}
      {innerNodes.map((n, i) => (
        <circle
          key={`in-${i}`}
          cx={n.x} cy={n.y} r={5}
          fill="var(--elevated)" stroke="var(--border)" strokeWidth="1"
        />
      ))}

      {/* ── Outer nodes + labels ────────────────────────────────────────────── */}
      {outerNodes.map((n, i) => {
        const lp = labelPos(n);
        return (
          <g key={`on-${i}`}>
            <circle
              cx={n.x} cy={n.y} r={11}
              fill="var(--surface)" stroke="var(--border)" strokeWidth="1"
            />
            <text
              x={lp.x} y={lp.y + 3.5}
              textAnchor="middle"
              fill="var(--muted)"
              fontSize="8.5"
              fontFamily="Figtree, sans-serif"
              fontWeight="600"
              letterSpacing="0.07em"
            >
              {n.label.toUpperCase()}
            </text>
          </g>
        );
      })}

      {/* ── Center hub glow ─────────────────────────────────────────────────── */}
      <circle cx={cx} cy={cy} r={CENTER_R + 10} fill="var(--elevated)" opacity="0.5" />

      {/* ── Center hub ──────────────────────────────────────────────────────── */}
      <circle
        cx={cx} cy={cy} r={CENTER_R}
        fill="var(--elevated)" stroke="var(--text)" strokeWidth="1.5"
      />

      {/* ── Hub label ───────────────────────────────────────────────────────── */}
      <text
        x={cx} y={cy - 5}
        textAnchor="middle"
        fill="var(--text)"
        fontSize="13"
        fontFamily="Figtree, sans-serif"
        fontWeight="700"
        letterSpacing="0.04em"
      >
        Mo.one
      </text>
      <text
        x={cx} y={cy + 12}
        textAnchor="middle"
        fill="var(--muted)"
        fontSize="7.5"
        fontFamily="Figtree, sans-serif"
        fontWeight="500"
        letterSpacing="0.1em"
      >
        A2A NETWORK
      </text>
    </svg>
  );
}
