import { useState } from 'react';
import { MX_HOLIDAYS_2026, MX_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: "Mexico public holidays",
    desc: "Federal días de descanso obligatorio for 2026. On-device.",
    copy: 'Copy list',
    copied: 'Copied',
  },
};

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [copied, setCopied] = useState(false);
  const text = MX_HOLIDAYS_2026.map((h) => `${h.date} — ${h.name}`).join('\n');
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{MX_2026.label}</span>
      <ul className="tool__list">
        {MX_HOLIDAYS_2026.map((h) => (
          <li key={h.date + h.name}><strong>{h.date}</strong> — {h.name}</li>
        ))}
      </ul>
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
