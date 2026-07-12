import { useState } from 'react';
import { caEiEmployee, CA_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField, Select } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = { en: { title: 'Canada EI', desc: 'Estimate Employment Insurance premiums (2026). Quebec uses a lower EI rate with QPIP. On-device.', gross: 'Annual gross (CAD)', region: 'Region', ei: 'EI premium' } };
const money = (n: number) => n.toLocaleString('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 });

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [gross, setGross] = useState(60_000);
  const [qc, setQc] = useState('no');
  const ei = caEiEmployee(gross, qc === 'yes');
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{CA_2026.label}</span>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.gross}</span><TextField type="number" value={gross} onChange={(e) => setGross(Number(e.target.value))} /></label>
        <label className="tool__field"><span>{t.region}</span><Select value={qc} onChange={setQc} options={[{ value: 'no', label: 'Outside Quebec' }, { value: 'yes', label: 'Quebec' }]} ariaLabel={t.region} /></label>
      </div>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{money(ei)}</span><span className="tool__stat-label">{t.ei}</span></div>
      </div></div>
    </ToolPage>
  );
}
