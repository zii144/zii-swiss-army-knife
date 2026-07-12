import { useState } from 'react';
import { caRrspTaxImpact, CA_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = { en: { title: 'Canada RRSP impact', desc: 'Estimate tax saved from an RRSP contribution at your marginal rate. On-device.', contrib: 'Contribution (CAD)', rate: 'Marginal rate (%)', saved: 'Tax saved', netCost: 'Net cost', limit: '2026 limit' } };
const money = (n: number) => n.toLocaleString('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 });

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [contrib, setContrib] = useState(10_000);
  const [rate, setRate] = useState(35);
  const r = caRrspTaxImpact(contrib, rate / 100);
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.contrib}</span><TextField type="number" value={contrib} onChange={(e) => setContrib(Number(e.target.value))} /></label>
        <label className="tool__field"><span>{t.rate}</span><TextField type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} /></label>
      </div>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{money(r.taxSaved)}</span><span className="tool__stat-label">{t.saved}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{money(r.netCost)}</span><span className="tool__stat-label">{t.netCost}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{money(CA_2026.rrspLimit2026)}</span><span className="tool__stat-label">{t.limit}</span></div>
      </div></div>
    </ToolPage>
  );
}
