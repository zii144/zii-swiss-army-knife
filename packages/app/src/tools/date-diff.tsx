import { useState } from 'react';
import { daysBetween, addDays, ageInYears } from '@zii/calc';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const iso = (d: Date): string => d.toISOString().slice(0, 10);
const today = (): string => iso(new Date());

const L = {
  en: {
    title: 'Date & age',
    desc: 'Days between two dates, add days to a date, and exact age. Runs locally.',
    between: 'Days between dates',
    from: 'From',
    to: 'To',
    daysApart: (n: number) => `${Math.abs(n)} day${Math.abs(n) === 1 ? '' : 's'} apart`,
    addTitle: 'Add days to a date',
    start: 'Start date',
    days: 'Days to add',
    lands: 'Result',
    ageTitle: 'Age',
    birth: 'Date of birth',
    years: (n: number) => `${n} year${n === 1 ? '' : 's'} old`,
  },
  'zh-TW': {
    title: '日期與年齡',
    desc: '計算兩個日期的間隔、加減天數與實際年齡，於本機執行。',
    between: '日期間隔',
    from: '起',
    to: '迄',
    daysApart: (n: number) => `相差 ${Math.abs(n)} 天`,
    addTitle: '日期加減天數',
    start: '起始日期',
    days: '加上天數',
    lands: '結果',
    ageTitle: '年齡',
    birth: '出生日期',
    years: (n: number) => `${n} 歲`,
  },
};

export default function DateDiffTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [from, setFrom] = useState(today());
  const [to, setTo] = useState(today());
  const [start, setStart] = useState(today());
  const [days, setDays] = useState(30);
  const [birth, setBirth] = useState('1990-01-01');

  const safeDate = (s: string): Date | null => {
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? null : d;
  };

  const fromD = safeDate(from);
  const toD = safeDate(to);
  const startD = safeDate(start);
  const birthD = safeDate(birth);

  const between = fromD && toD ? daysBetween(fromD, toD) : null;
  const landed = startD ? iso(addDays(startD, Math.trunc(days))) : null;
  const age = birthD ? ageInYears(birthD, new Date()) : null;

  return (
    <ToolPage
      title={t.title}
      description={t.desc}
      onBack={onBack}
      backLabel={backLabel}
      offlineLabel={offlineLabel}
    >
      <fieldset className="tool__group">
        <legend>{t.between}</legend>
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
        {between !== null ? (
          <p>
            <strong>{t.daysApart(between)}</strong>
          </p>
        ) : null}
      </fieldset>

      <fieldset className="tool__group">
        <legend>{t.addTitle}</legend>
        <div className="tool__inline">
          <label className="tool__field">
            <span>{t.start}</span>
            <TextField type="date" value={start} onChange={(e) => setStart(e.target.value)} />
          </label>
          <label className="tool__field">
            <span>{t.days}</span>
            <TextField
              type="number"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
            />
          </label>
        </div>
        {landed ? (
          <p>
            {t.lands}: <strong>{landed}</strong>
          </p>
        ) : null}
      </fieldset>

      <fieldset className="tool__group">
        <legend>{t.ageTitle}</legend>
        <label className="tool__field">
          <span>{t.birth}</span>
          <TextField type="date" value={birth} onChange={(e) => setBirth(e.target.value)} />
        </label>
        {age !== null ? (
          <p>
            <strong>{t.years(age)}</strong>
          </p>
        ) : null}
      </fieldset>
    </ToolPage>
  );
}
