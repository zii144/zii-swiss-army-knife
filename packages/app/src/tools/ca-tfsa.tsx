import { useState } from 'react';
import { caTfsaRoom, CA_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = { en: { title: 'Canada TFSA room', desc: 'Estimate remaining TFSA contribution room from unused prior room and this-year contributions. On-device; you enter history.', unused: 'Unused room carried in (CAD)', contributed: 'Contributed this year (CAD)', remaining: 'Remaining room', annual: '2026 annual limit' } };
const money = (n: number) => n.toLocaleString('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 });

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [unused, setUnused] = useState(20_000);
  const [contributed, setContributed] = useState(0);
  const r = caTfsaRoom(unused, contributed);
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.unused}</span><TextField type="number" value={unused} onChange={(e) => setUnused(Number(e.target.value))} /></label>
        <label className="tool__field"><span>{t.contributed}</span><TextField type="number" value={contributed} onChange={(e) => setContributed(Number(e.target.value))} /></label>
      </div>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{money(r.remaining)}</span><span className="tool__stat-label">{t.remaining}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{money(r.annualLimit)}</span><span className="tool__stat-label">{t.annual}</span></div>
      </div></div>
    </ToolPage>
  );
}
