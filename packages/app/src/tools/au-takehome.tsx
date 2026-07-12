import { useState } from 'react';
import { auTakeHome, AU_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField, Select } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = { en: { title: 'Australia take-home pay', desc: 'Estimate net pay after income tax, Medicare, optional HELP and super guarantee (FY 2025–26). On-device — not ATO official.', gross: 'Annual gross (AUD)', help: 'HELP/HECS debt', hospital: 'Private hospital cover', yes: 'Yes', no: 'No', net: 'Net / year', tax: 'Income tax', medicare: 'Medicare', mls: 'MLS', helpAmt: 'HELP', super: 'Super (employer)' } };
const money = (n: number) => n.toLocaleString('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 });

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [gross, setGross] = useState(90_000);
  const [help, setHelp] = useState('no');
  const [hospital, setHospital] = useState('yes');
  const r = auTakeHome(gross, { help: help === 'yes', privateHospital: hospital === 'yes' });
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{AU_2026.label}</span>
      <label className="tool__field"><span>{t.gross}</span><TextField type="number" value={gross} onChange={(e) => setGross(Number(e.target.value))} /></label>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.help}</span><Select value={help} onChange={setHelp} options={[{ value: 'no', label: t.no }, { value: 'yes', label: t.yes }]} ariaLabel={t.help} /></label>
        <label className="tool__field"><span>{t.hospital}</span><Select value={hospital} onChange={setHospital} options={[{ value: 'yes', label: t.yes }, { value: 'no', label: t.no }]} ariaLabel={t.hospital} /></label>
      </div>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{money(r.net)}</span><span className="tool__stat-label">{t.net}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{money(r.incomeTax)}</span><span className="tool__stat-label">{t.tax}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{money(r.medicare)}</span><span className="tool__stat-label">{t.medicare}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{money(r.help)}</span><span className="tool__stat-label">{t.helpAmt}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{money(r.superGuarantee)}</span><span className="tool__stat-label">{t.super}</span></div>
      </div></div>
    </ToolPage>
  );
}
