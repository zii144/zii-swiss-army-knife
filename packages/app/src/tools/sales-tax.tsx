import { useState } from 'react';
import { salesTax } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'Sales tax / VAT / GST',
    desc: 'Add or extract sales tax (VAT/GST) on an amount. Runs on your device.',
    amount: 'Amount',
    rate: 'Tax rate (%)',
    inclusive: 'Amount already includes tax',
    net: 'Net',
    tax: 'Tax',
    gross: 'Gross',
  },
  'zh-TW': {
    title: '銷售稅／VAT／GST',
    desc: '在金額上計算或拆分銷售稅（VAT／GST），於裝置上運算。',
    amount: '金額',
    rate: '稅率（%）',
    inclusive: '金額已含稅',
    net: '未稅',
    tax: '稅額',
    gross: '含稅',
  },
};

const num = (n: number): string => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

export default function SalesTaxTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [amount, setAmount] = useState(100);
  const [rate, setRate] = useState(5);
  const [inclusive, setInclusive] = useState(false);

  let r: { net: number; tax: number; gross: number } | null = null;
  let error: string | null = null;
  try {
    r = salesTax(amount, rate / 100, { inclusive });
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
          <span>{t.amount}</span>
          <TextField type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        </label>
        <label className="tool__field">
          <span>{t.rate}</span>
          <TextField type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
        </label>
      </div>
      <label className="tool__check">
        <input type="checkbox" checked={inclusive} onChange={() => setInclusive((v) => !v)} />
        {t.inclusive}
      </label>

      {error ? (
        <p className="tool__error">{error}</p>
      ) : r ? (
        <div className="tool__result">
          <div className="tool__stats">
            <div className="tool__stat">
              <span className="tool__stat-value">{num(r.net)}</span>
              <span className="tool__stat-label">{t.net}</span>
            </div>
            <div className="tool__stat">
              <span className="tool__stat-value">{num(r.tax)}</span>
              <span className="tool__stat-label">{t.tax}</span>
            </div>
            <div className="tool__stat">
              <span className="tool__stat-value">{num(r.gross)}</span>
              <span className="tool__stat-label">{t.gross}</span>
            </div>
          </div>
        </div>
      ) : null}
    </ToolPage>
  );
}
