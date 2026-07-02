import { useState } from 'react';
import { compoundInterest, simpleInterest } from '@zii/calc';
import { ToolPage } from '../components/ToolPage';
import { Select, TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const FREQ = [
  { value: '1', labelKey: 'annually' },
  { value: '4', labelKey: 'quarterly' },
  { value: '12', labelKey: 'monthly' },
  { value: '365', labelKey: 'daily' },
] as const;

const L = {
  en: {
    title: 'Savings & interest',
    desc: 'Simple and compound interest earned on a deposit over time. On-device.',
    principal: 'Deposit',
    rate: 'Annual rate (%)',
    years: 'Years',
    freq: 'Compounding',
    annually: 'Annually',
    quarterly: 'Quarterly',
    monthly: 'Monthly',
    daily: 'Daily',
    simple: 'Simple interest',
    compound: 'Compound interest',
    finalC: 'Final balance (compound)',
  },
  'zh-TW': {
    title: '儲蓄與利息',
    desc: '計算存款隨時間累積的單利與複利，於裝置上運算。',
    principal: '存款',
    rate: '年利率（%）',
    years: '年數',
    freq: '複利頻率',
    annually: '每年',
    quarterly: '每季',
    monthly: '每月',
    daily: '每日',
    simple: '單利',
    compound: '複利',
    finalC: '到期本利和（複利）',
  },
};

const num = (n: number): string => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

export default function SavingsTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(4);
  const [years, setYears] = useState(5);
  const [freq, setFreq] = useState('12');

  let simple: number | null = null;
  let compound: number | null = null;
  let error: string | null = null;
  try {
    simple = simpleInterest(principal, rate, years);
    compound = compoundInterest(principal, rate, years, Number(freq));
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

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
          <span>{t.principal}</span>
          <TextField
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
          />
        </label>
        <label className="tool__field">
          <span>{t.rate}</span>
          <TextField type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
        </label>
        <label className="tool__field">
          <span>{t.years}</span>
          <TextField
            type="number"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
          />
        </label>
      </div>
      <div className="tool__field">
        <span>{t.freq}</span>
        <Select
          value={freq}
          options={FREQ.map((f) => ({ value: f.value, label: t[f.labelKey] }))}
          onChange={setFreq}
          ariaLabel={t.freq}
        />
      </div>

      {error ? <p className="tool__error">{error}</p> : null}
      {simple !== null && compound !== null && !error ? (
        <div className="tool__result">
          <div className="tool__stats">
            <div className="tool__stat">
              <span className="tool__stat-value">{num(simple)}</span>
              <span className="tool__stat-label">{t.simple}</span>
            </div>
            <div className="tool__stat">
              <span className="tool__stat-value">{num(compound)}</span>
              <span className="tool__stat-label">{t.compound}</span>
            </div>
            <div className="tool__stat">
              <span className="tool__stat-value">{num(principal + compound)}</span>
              <span className="tool__stat-label">{t.finalC}</span>
            </div>
          </div>
        </div>
      ) : null}
    </ToolPage>
  );
}
