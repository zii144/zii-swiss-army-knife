import { useState } from 'react';
import { DE_HOLIDAYS_2026_FEDERAL, DE_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'Germany public holidays',
    desc: 'Federal Feiertage for 2026 (Bundesländer may add more). On-device.',
    note: 'State-specific holidays (e.g. Heilige Drei Könige, Reformationstag) not listed.',
    copy: 'Copy list',
    copied: 'Copied',
  },
  de: {
    title: 'Feiertage Deutschland',
    desc: 'Gesetzliche bundesweite Feiertage 2026. Lokal. Länderfeiertage können fehlen.',
    note: 'Landesfeiertage (z. B. Heilige Drei Könige) sind nicht enthalten.',
    copy: 'Liste kopieren',
    copied: 'Kopiert',
  },
};

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [copied, setCopied] = useState(false);
  const text = DE_HOLIDAYS_2026_FEDERAL.map((h) => `${h.date} — ${h.name}`).join('\n');
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>
        {DE_2026.label}
      </span>
      <ul className="tool__list">
        {DE_HOLIDAYS_2026_FEDERAL.map((h) => (
          <li key={h.date}>
            <strong>{h.date}</strong> — {h.name}
          </li>
        ))}
      </ul>
      <p className="tool__hint">{t.note}</p>
      <Button
        variant="ghost"
        onClick={async () => {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        }}
      >
        {copied ? t.copied : t.copy}
      </Button>
    </ToolPage>
  );
}
