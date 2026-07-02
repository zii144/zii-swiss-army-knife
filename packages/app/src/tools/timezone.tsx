import { useState } from 'react';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const ZONES: { city: string; tz: string }[] = [
  { city: 'Los Angeles', tz: 'America/Los_Angeles' },
  { city: 'New York', tz: 'America/New_York' },
  { city: 'London', tz: 'Europe/London' },
  { city: 'Berlin', tz: 'Europe/Berlin' },
  { city: 'Dubai', tz: 'Asia/Dubai' },
  { city: 'India', tz: 'Asia/Kolkata' },
  { city: 'Singapore', tz: 'Asia/Singapore' },
  { city: 'Taipei', tz: 'Asia/Taipei' },
  { city: 'Hong Kong', tz: 'Asia/Hong_Kong' },
  { city: 'Tokyo', tz: 'Asia/Tokyo' },
  { city: 'Seoul', tz: 'Asia/Seoul' },
  { city: 'Sydney', tz: 'Australia/Sydney' },
];

const L = {
  en: {
    title: 'Time-zone planner',
    desc: 'Pick a moment in your local time and see it across major cities. On-device.',
    base: 'Your local time',
    city: 'City',
    local: 'Local time',
  },
  'zh-TW': {
    title: '時區規劃',
    desc: '選定你當地的時間，查看世界主要城市的對應時間。於裝置上運算。',
    base: '你的當地時間',
    city: '城市',
    local: '當地時間',
  },
};

function nowLocalInput(): string {
  const d = new Date();
  const pad = (n: number): string => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function TimezoneTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [base, setBase] = useState(nowLocalInput());
  const instant = new Date(base);
  const valid = !Number.isNaN(instant.getTime());

  const fmt = (tz: string): string => {
    try {
      return new Intl.DateTimeFormat(undefined, {
        timeZone: tz,
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(instant);
    } catch {
      return '—';
    }
  };

  return (
    <ToolPage
      title={t.title}
      description={t.desc}
      onBack={onBack}
      backLabel={backLabel}
      offlineLabel={offlineLabel}
    >
      <label className="tool__field">
        <span>{t.base}</span>
        <TextField
          type="datetime-local"
          value={base}
          onChange={(e) => setBase(e.target.value)}
        />
      </label>

      {valid ? (
        <table className="ztable">
          <thead>
            <tr>
              <th>{t.city}</th>
              <th>{t.local}</th>
            </tr>
          </thead>
          <tbody>
            {ZONES.map((z) => (
              <tr key={z.tz}>
                <td>{z.city}</td>
                <td>{fmt(z.tz)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </ToolPage>
  );
}
