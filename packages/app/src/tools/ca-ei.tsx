import { useState } from 'react';
import { caEiEmployee, CA_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField, Select } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'Canada EI',
    desc: 'Estimate Employment Insurance premiums (2026). Quebec uses a lower rate. On-device.',
    earnings: 'Insurable earnings (CAD)',
    region: 'Region',
    outside: 'Outside Quebec',
    quebec: 'Quebec',
    premium: 'EI premium',
  },
};
const money = (n: number) => n.toLocaleString('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 });

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [earnings, setEarnings] = useState(60_000);
  const [region, setRegion] = useState('outside');
  const premium = caEiEmployee(earnings, { quebec: region === 'quebec' });
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{CA_2026.label}</span>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.earnings}</span><TextField type="number" value={earnings} onChange={(e) => setEarnings(Number(e.target.value))} /></label>
        <label className="tool__field"><span>{t.region}</span><Select value={region} onChange={setRegion} options={[{ value: 'outside', label: t.outside }, { value: 'quebec', label: t.quebec }]} ariaLabel={t.region} /></label>
      </div>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{money(premium)}</span><span className="tool__stat-label">{t.premium}</span></div>
      </div></div>
    </ToolPage>
  );
}
