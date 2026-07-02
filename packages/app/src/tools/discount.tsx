import { useState } from 'react';
import { discount } from '@zii/calc';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'Discount calculator',
    desc: 'Work out a sale price and how much you save. Runs on your device.',
    price: 'Original price',
    pct: 'Discount (%)',
    final: 'You pay',
    saved: 'You save',
  },
  'zh-TW': {
    title: '折扣計算機',
    desc: '計算折扣後價格與省下的金額，於裝置上運算。',
    price: '原價',
    pct: '折扣（%）',
    final: '實付',
    saved: '省下',
  },
};

const num = (n: number): string => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

export default function DiscountTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [price, setPrice] = useState(100);
  const [pct, setPct] = useState(25);

  let result: { amount: number; final: number } | null = null;
  let error: string | null = null;
  try {
    result = discount(price, pct);
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
          <span>{t.price}</span>
          <TextField type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
        </label>
        <label className="tool__field">
          <span>{t.pct}</span>
          <TextField type="number" value={pct} onChange={(e) => setPct(Number(e.target.value))} />
        </label>
      </div>

      {error ? (
        <p className="tool__error">{error}</p>
      ) : result ? (
        <div className="tool__result">
          <div className="tool__stats">
            <div className="tool__stat">
              <span className="tool__stat-value">{num(result.final)}</span>
              <span className="tool__stat-label">{t.final}</span>
            </div>
            <div className="tool__stat">
              <span className="tool__stat-value">{num(result.amount)}</span>
              <span className="tool__stat-label">{t.saved}</span>
            </div>
          </div>
        </div>
      ) : null}
    </ToolPage>
  );
}
