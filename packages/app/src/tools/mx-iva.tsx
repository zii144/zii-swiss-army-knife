import { useState } from 'react';
import { salesTax } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const RATE = 0.16;
const L = {
  en: {
    title: "Mexican IVA",
    desc: "Add or extract 16% IVA. On-device.",
    amount: "Amount (MXN)",
    inclusive: "Amount already includes tax",
    net: "Base",
    tax: "IVA",
    gross: "Total",
  },
};

const num = (n: number) =>
  n.toLocaleString("es-MX", { style: 'currency', currency: "MXN" });

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [amount, setAmount] = useState(100);
  const [inclusive, setInclusive] = useState(false);
  const r = salesTax(amount, RATE, { inclusive });
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.amount}</span><TextField type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} /></label>
      <label className="tool__check"><input type="checkbox" checked={inclusive} onChange={() => setInclusive((v) => !v)} />{t.inclusive}</label>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{num(r.net)}</span><span className="tool__stat-label">{t.net}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{num(r.tax)}</span><span className="tool__stat-label">{t.tax}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{num(r.gross)}</span><span className="tool__stat-label">{t.gross}</span></div>
      </div></div>
    </ToolPage>
  );
}
