import { useState } from 'react';
import { caFederalTax, caProvincialTax, CA_2026, type CaProvince } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField, Select } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const PROVINCES = Object.keys(CA_2026.provincialFlat) as CaProvince[];
const L = { en: { title: 'Canada income tax', desc: 'Estimate federal + provincial income tax (2026 simplified). On-device.', taxable: 'Taxable income (CAD)', province: 'Province', federal: 'Federal', provincial: 'Provincial', total: 'Total' } };
const money = (n: number) => n.toLocaleString('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 });

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [taxable, setTaxable] = useState(80_000);
  const [province, setProvince] = useState<CaProvince>('ON');
  const federal = caFederalTax(taxable);
  const provincial = caProvincialTax(taxable, province);
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{CA_2026.label}</span>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.taxable}</span><TextField type="number" value={taxable} onChange={(e) => setTaxable(Number(e.target.value))} /></label>
        <label className="tool__field"><span>{t.province}</span><Select value={province} onChange={(v) => setProvince(v as CaProvince)} options={PROVINCES.map((p) => ({ value: p, label: p }))} ariaLabel={t.province} /></label>
      </div>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{money(federal)}</span><span className="tool__stat-label">{t.federal}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{money(provincial)}</span><span className="tool__stat-label">{t.provincial}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{money(federal + provincial)}</span><span className="tool__stat-label">{t.total}</span></div>
      </div></div>
    </ToolPage>
  );
}
