import { useState } from 'react';
import { applyPercent, percentageChange, tip } from '@zii/calc';
import { ToolPage } from '../components/ToolPage';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'Percentage & tip',
    desc: 'Quick percentage, percentage-change and tip-split math. Runs entirely on your device.',
    percentOf: 'Percentage of',
    is: 'What is',
    ofWhole: '% of',
    change: 'Percentage change',
    from: 'From',
    to: 'To',
    tip: 'Tip & split',
    bill: 'Bill',
    rate: 'Tip %',
    people: 'Split between',
    result: 'Result',
    tipAmt: 'Tip',
    total: 'Total',
    perPerson: 'Per person',
    increase: 'increase',
    decrease: 'decrease',
  },
  'zh-TW': {
    title: '百分比與小費',
    desc: '快速計算百分比、增減率與小費分攤，全部在裝置上運算。',
    percentOf: '百分比計算',
    is: '求',
    ofWhole: '% 等於',
    change: '增減率',
    from: '從',
    to: '到',
    tip: '小費與分攤',
    bill: '帳單',
    rate: '小費 %',
    people: '分攤人數',
    result: '結果',
    tipAmt: '小費',
    total: '總計',
    perPerson: '每人',
    increase: '增加',
    decrease: '減少',
  },
};

const num = (n: number): string =>
  Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '—';

export default function PercentTipTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [pct, setPct] = useState(15);
  const [whole, setWhole] = useState(200);
  const [from, setFrom] = useState(100);
  const [to, setTo] = useState(125);
  const [bill, setBill] = useState(100);
  const [rate, setRate] = useState(18);
  const [people, setPeople] = useState(2);

  const ofResult = applyPercent(whole, pct);
  const change = percentageChange(from, to);
  const split = Math.max(1, Math.trunc(people));
  const tipResult = tip(bill, rate, split);

  return (
    <ToolPage
      title={t.title}
      description={t.desc}
      onBack={onBack}
      backLabel={backLabel}
      offlineLabel={offlineLabel}
    >
      <fieldset className="tool__group">
        <legend>{t.percentOf}</legend>
        <div className="tool__inline">
          <span>{t.is}</span>
          <input
            type="number"
            value={pct}
            onChange={(e) => setPct(Number(e.target.value))}
            aria-label="percent"
          />
          <span>{t.ofWhole}</span>
          <input
            type="number"
            value={whole}
            onChange={(e) => setWhole(Number(e.target.value))}
            aria-label="whole"
          />
          <strong>= {num(ofResult)}</strong>
        </div>
      </fieldset>

      <fieldset className="tool__group">
        <legend>{t.change}</legend>
        <div className="tool__inline">
          <span>{t.from}</span>
          <input
            type="number"
            value={from}
            onChange={(e) => setFrom(Number(e.target.value))}
            aria-label="from"
          />
          <span>{t.to}</span>
          <input
            type="number"
            value={to}
            onChange={(e) => setTo(Number(e.target.value))}
            aria-label="to"
          />
          <strong>
            {num(Math.abs(change))}% {change >= 0 ? t.increase : t.decrease}
          </strong>
        </div>
      </fieldset>

      <fieldset className="tool__group">
        <legend>{t.tip}</legend>
        <label className="tool__field">
          <span>{t.bill}</span>
          <input type="number" value={bill} onChange={(e) => setBill(Number(e.target.value))} />
        </label>
        <label className="tool__field">
          <span>{t.rate}</span>
          <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
        </label>
        <label className="tool__field">
          <span>{t.people}</span>
          <input
            type="number"
            min={1}
            value={people}
            onChange={(e) => setPeople(Number(e.target.value))}
          />
        </label>
        <div className="tool__result">
          <p>
            {t.tipAmt}: <strong>{num(tipResult.tip)}</strong> · {t.total}:{' '}
            <strong>{num(tipResult.total)}</strong> · {t.perPerson}:{' '}
            <strong>{num(tipResult.perPerson)}</strong>
          </p>
        </div>
      </fieldset>
    </ToolPage>
  );
}
