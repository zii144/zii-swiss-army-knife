import { useState } from 'react';
import { inIncomeTax, IN_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {"title":"India income tax","desc":"New-regime income tax on taxable income (FY 2025–26 simplified). On-device.","taxable":"Taxable income (₹ / year)","tax":"Estimated tax"},
};
const num = (n: number) =>
  n.toLocaleString("en-IN", { style: 'currency', currency: "INR", maximumFractionDigits: 0 });

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [taxable, setTaxable] = useState(900000);
  const r = { tax: inIncomeTax(taxable) };
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{IN_2026.label}</span>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.taxable}</span><TextField type="number" value={taxable} onChange={(e) => setTaxable(Number(e.target.value))} /></label>
      </div>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{num(r.tax)}</span><span className="tool__stat-label">{t.tax}</span></div>
      </div></div>
    </ToolPage>
  );
}
