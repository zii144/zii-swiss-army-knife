import { useState } from 'react';
import { caTakeHome, CA_2026, type CaProvince } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField, Select } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const PROVINCES = Object.keys(CA_2026.gstHst) as CaProvince[];
const L = {
  en: {
    title: 'Canada take-home pay',
    desc: 'Estimate net pay after federal/provincial tax, CPP and EI (2026). Provincial tax uses ON brackets or approximate flat rates — not CRA.',
    gross: 'Annual gross (CAD)',
    province: 'Province',
    net: 'Net / year',
    federal: 'Federal tax',
    provincial: 'Provincial tax',
    cpp: 'CPP',
    ei: 'EI',
  },
};
const money = (n: number) => n.toLocaleString('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 });

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [gross, setGross] = useState(80_000);
  const [province, setProvince] = useState<string>('ON');
  const r = caTakeHome(gross, { province: province as CaProvince });
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{CA_2026.label}</span>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.gross}</span><TextField type="number" value={gross} onChange={(e) => setGross(Number(e.target.value))} /></label>
        <label className="tool__field"><span>{t.province}</span><Select value={province} onChange={setProvince} options={PROVINCES.map((p) => ({ value: p, label: p }))} ariaLabel={t.province} /></label>
      </div>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{money(r.net)}</span><span className="tool__stat-label">{t.net}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{money(r.federalTax)}</span><span className="tool__stat-label">{t.federal}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{money(r.provincialTax)}</span><span className="tool__stat-label">{t.provincial}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{money(r.cpp + r.cpp2)}</span><span className="tool__stat-label">{t.cpp}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{money(r.ei)}</span><span className="tool__stat-label">{t.ei}</span></div>
      </div></div>
    </ToolPage>
  );
}
