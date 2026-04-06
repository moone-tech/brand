// =============================================================================
// client/src/components/ThemeToggle.tsx — Dark / light mode switcher
// =============================================================================

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [isDark, setIsDark] = useState(() => {
    return (localStorage.getItem('brand-theme') ?? 'dark') === 'dark';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('brand-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(d => !d)}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors hover:opacity-80"
      style={{ color: 'var(--muted)', background: 'var(--elevated)' }}
    >
      {isDark ? <Sun size={15} /> : <Moon size={15} />}
      {!compact && (
        <span className="text-xs font-medium">{isDark ? 'Light' : 'Dark'}</span>
      )}
    </button>
  );
}
