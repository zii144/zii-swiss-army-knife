import { useState } from 'react';
import { businessDaysBetween } from '@zii/calendar';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const today = (): string => new Date().toISOString().slice(0, 10);

const L = {
  en: {
    title: 'Business days',
    desc: 'Count working days (Mon–Fri, weekends excluded) between two dates. On-device.',
    from: 'From',
    to: 'To',
    result: (n: number) => `${n} business day${n === 1 ? '' : 's'}`,
  },
  'zh-TW': {
    title: '工作日計算',
    desc: '計算兩個日期之間的工作日（週一至週五，不含週末），於裝置上運算。',
    from: '起',
    to: '迄',
    result: (n: number) => `${n} 個工作日`,
  },
};

export default function BusinessDaysTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [from, setFrom] = useState(today());
  const [to, setTo] = useState(today());

  const a = new Date(from);
  const b = new Date(to);
  const valid = !Number.isNaN(a.getTime()) && !Number.isNaN(b.getTime());
  const days = valid ? businessDaysBetween(a, b, []) : null;

  return (
    <ToolPage
      title={t.title}
      description={t.desc}
      onBack={onBack}
      backLabel={backLabel}
      offlineLabel={offlineLabel}
    >
      <div className="tool__inline">
        <label className="tool__field">
          <span>{t.from}</span>
          <TextField type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label className="tool__field">
          <span>{t.to}</span>
          <TextField type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </label>
      </div>
      {days !== null ? (
        <div className="tool__result">
          <p>
            <strong style={{ fontSize: '1.2rem' }}>{t.result(days)}</strong>
          </p>
        </div>
      ) : null}
    </ToolPage>
  );
}
