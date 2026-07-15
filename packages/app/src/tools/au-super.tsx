import { useState } from 'react';
import { auSuper, AU_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = { en: { title: 'Australia super guarantee', desc: 'Estimate employer Super Guarantee (12%) and concessional cap reference. On-device.', ote: 'Ordinary time earnings (AUD)', guarantee: 'SG contribution', rate: 'SG rate', cap: 'Concessional cap' } };
const money = (n: number) => n.toLocaleString('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 });

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [ote, setOte] = useState(90_000);
  const r = auSuper(ote);
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{AU_2026.label}</span>
      <label className="tool__field"><span>{t.ote}</span><TextField type="number" value={ote} onChange={(e) => setOte(Number(e.target.value))} /></label>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{money(r.guarantee)}</span><span className="tool__stat-label">{t.guarantee}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{(r.rate * 100).toFixed(0)}%</span><span className="tool__stat-label">{t.rate}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{money(AU_2026.concessionalCap)}</span><span className="tool__stat-label">{t.cap}</span></div>
      </div></div>
    </ToolPage>
  );
}
