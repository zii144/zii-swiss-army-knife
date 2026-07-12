import { useState } from 'react';
import { salesTax } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const RATE = 0.1;
const L = {
  en: {
    title: "Korea VAT (부가세)",
    desc: "Add or extract Korean VAT at 10%. On-device.",
    amount: 'Amount',
    inclusive: 'Amount already includes tax',
    net: 'Net',
    tax: "VAT 10%",
    gross: 'Gross',
    note: 'Rate fixed at 10.0% for this market. Estimate only.',
  },
};
const num = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [amount, setAmount] = useState(100);
  const [inclusive, setInclusive] = useState(false);
  const r = salesTax(amount, RATE, { inclusive });
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.amount}</span>
        <TextField type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
      </label>
      <label className="tool__check">
        <input type="checkbox" checked={inclusive} onChange={() => setInclusive((v) => !v)} />{t.inclusive}
      </label>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{num(r.net)}</span><span className="tool__stat-label">{t.net}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{num(r.tax)}</span><span className="tool__stat-label">{t.tax}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{num(r.gross)}</span><span className="tool__stat-label">{t.gross}</span></div>
      </div><p className="tool__hint">{t.note}</p></div>
    </ToolPage>
  );
}
