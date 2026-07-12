import { useState } from 'react';
import { caGstHst, CA_2026, type CaProvince } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField, Select } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const PROVINCES = Object.keys(CA_2026.gstHst) as CaProvince[];
const L = {
  en: {
    title: 'Canada GST / HST',
    desc: 'Add or extract GST/HST by province. On-device.',
    amount: 'Amount (CAD)',
    province: 'Province',
    inclusive: 'Amount already includes tax',
    net: 'Net',
    tax: 'Tax',
    gross: 'Gross',
    rate: 'Rate',
  },
};
const money = (n: number) => n.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' });

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [amount, setAmount] = useState(100);
  const [province, setProvince] = useState('ON');
  const [inclusive, setInclusive] = useState(false);
  const r = caGstHst(amount, province as CaProvince, { inclusive });
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.amount}</span><TextField type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} /></label>
        <label className="tool__field"><span>{t.province}</span><Select value={province} onChange={setProvince} options={PROVINCES.map((p) => ({ value: p, label: p }))} ariaLabel={t.province} /></label>
      </div>
      <label className="tool__check"><input type="checkbox" checked={inclusive} onChange={() => setInclusive((v) => !v)} />{t.inclusive}</label>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{money(r.net)}</span><span className="tool__stat-label">{t.net}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{money(r.tax)}</span><span className="tool__stat-label">{t.tax}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{money(r.gross)}</span><span className="tool__stat-label">{t.gross}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{(r.rate * 100).toFixed(2)}%</span><span className="tool__stat-label">{t.rate}</span></div>
      </div></div>
    </ToolPage>
  );
}
