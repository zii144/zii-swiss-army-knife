import { useState } from 'react';
import { caRrspTaxImpact, CA_2026, type CaProvince } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField, Select } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const PROVINCES = Object.keys(CA_2026.gstHst) as CaProvince[];
const L = {
  en: {
    title: 'Canada RRSP impact',
    desc: 'Estimate tax saved from an RRSP contribution (2026). On-device — not advice.',
    income: 'Taxable income (CAD)',
    contribution: 'Contribution (CAD)',
    province: 'Province',
    saved: 'Tax saved',
    marginal: 'Approx. marginal rate',
  },
};
const money = (n: number) => n.toLocaleString('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 });

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [income, setIncome] = useState(90_000);
  const [contribution, setContribution] = useState(10_000);
  const [province, setProvince] = useState('ON');
  const r = caRrspTaxImpact(contribution, income, province as CaProvince);
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{CA_2026.label}</span>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.income}</span><TextField type="number" value={income} onChange={(e) => setIncome(Number(e.target.value))} /></label>
        <label className="tool__field"><span>{t.contribution}</span><TextField type="number" value={contribution} onChange={(e) => setContribution(Number(e.target.value))} /></label>
        <label className="tool__field"><span>{t.province}</span><Select value={province} onChange={setProvince} options={PROVINCES.map((p) => ({ value: p, label: p }))} ariaLabel={t.province} /></label>
      </div>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{money(r.taxSaved)}</span><span className="tool__stat-label">{t.saved}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{(r.marginalRate * 100).toFixed(1)}%</span><span className="tool__stat-label">{t.marginal}</span></div>
      </div></div>
    </ToolPage>
  );
}
