import { useState } from 'react';
import { gregorianToLunar, type LunarDate } from '@zii/calendar';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const today = (): string => new Date().toISOString().slice(0, 10);

const L = {
  en: {
    title: 'Lunar calendar',
    desc: 'Convert a Gregorian date to the Chinese lunar calendar (leap-month aware). On-device.',
    date: 'Gregorian date',
    lunar: 'Lunar date',
    ganzhi: 'Sexagenary year',
    zodiac: 'Zodiac',
    leap: 'leap month',
  },
  'zh-TW': {
    title: '農曆換算',
    desc: '將西元日期轉換為農曆（支援閏月），於裝置上運算。',
    date: '西元日期',
    lunar: '農曆',
    ganzhi: '干支年',
    zodiac: '生肖',
    leap: '閏月',
  },
};

export default function LunarConvertTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [date, setDate] = useState(today());

  const d = new Date(date);
  const valid = !Number.isNaN(d.getTime());
  let lunar: LunarDate | null = null;
  let error: string | null = null;
  if (valid) {
    try {
      lunar = gregorianToLunar(d);
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }
  }

  const row = (label: string, value: string) => (
    <div className="tool__row">
      <span className="tool__row-label">{label}</span>
      <code className="tool__row-value">{value}</code>
    </div>
  );

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
      {error ? <p className="tool__error">{error}</p> : null}
      {lunar ? (
        <div className="tool__result">
          <div className="tool__rows" style={{ width: '100%' }}>
            {row(
              t.lunar,
              `${lunar.year} 年 ${lunar.isLeapMonth ? `閏` : ''}${lunar.month} 月 ${lunar.day} 日`,
            )}
            {row(t.ganzhi, lunar.ganZhiYear)}
            {row(t.zodiac, lunar.zodiac)}
          </div>
        </div>
      ) : null}
    </ToolPage>
  );
}
