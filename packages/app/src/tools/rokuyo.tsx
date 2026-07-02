import { useState } from 'react';
import { rokuyo } from '@zii/calendar';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const today = (): string => new Date().toISOString().slice(0, 10);

const L = {
  en: {
    title: 'Rokuyō (六曜)',
    desc: 'The Japanese six-day calendar label (Taian, Butsumetsu…) for a date. On-device.',
    date: 'Date',
    result: 'Rokuyō',
  },
  'zh-TW': {
    title: '六曜',
    desc: '查詢日本六曜（大安、佛滅…）對應日期，於裝置上運算。',
    date: '日期',
    result: '六曜',
  },
};

export default function RokuyoTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [date, setDate] = useState(today());

  const d = new Date(date);
  const valid = !Number.isNaN(d.getTime());
  const r = valid ? rokuyo(d) : null;

  return (
    <ToolPage
      title={t.title}
      description={t.desc}
      onBack={onBack}
      backLabel={backLabel}
      offlineLabel={offlineLabel}
    >
      <label className="tool__field">
        <span>{t.date}</span>
        <TextField type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>
      {r ? (
        <div className="tool__result">
          <div className="tool__stat" style={{ alignSelf: 'flex-start', minWidth: '9rem' }}>
            <span className="tool__stat-value">{r.kanji}</span>
            <span className="tool__stat-label">{r.romaji}</span>
          </div>
        </div>
      ) : null}
    </ToolPage>
  );
}
