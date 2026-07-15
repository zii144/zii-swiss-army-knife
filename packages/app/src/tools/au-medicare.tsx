import { useState } from 'react';
import { auMedicareLevy, auMls, AU_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField, Select } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = { en: { title: 'Australia Medicare levy', desc: 'Estimate Medicare levy (2%) and optional MLS if no private hospital cover. On-device.', taxable: 'Taxable income (AUD)', hospital: 'Private hospital', yes: 'Yes', no: 'No', levy: 'Medicare levy', mls: 'MLS', total: 'Total' } };
const money = (n: number) => n.toLocaleString('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 });

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [taxable, setTaxable] = useState(100_000);
  const [hospital, setHospital] = useState('yes');
  const levy = auMedicareLevy(taxable);
  const mls = auMls(taxable, hospital === 'yes');
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{AU_2026.label}</span>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.taxable}</span><TextField type="number" value={taxable} onChange={(e) => setTaxable(Number(e.target.value))} /></label>
        <label className="tool__field"><span>{t.hospital}</span><Select value={hospital} onChange={setHospital} options={[{ value: 'yes', label: t.yes }, { value: 'no', label: t.no }]} ariaLabel={t.hospital} /></label>
      </div>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{money(levy)}</span><span className="tool__stat-label">{t.levy}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{money(mls)}</span><span className="tool__stat-label">{t.mls}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{money(levy + mls)}</span><span className="tool__stat-label">{t.total}</span></div>
      </div></div>
    </ToolPage>
  );
}
