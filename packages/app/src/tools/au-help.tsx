import { useState } from 'react';
import { auHelpRepayment, AU_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = { en: { title: 'Australia HELP repayment', desc: 'Estimate compulsory HELP/HECS repayment from repayment income (FY 2025–26 tiers). On-device.', income: 'Repayment income (AUD)', repayment: 'Compulsory repayment' } };
const money = (n: number) => n.toLocaleString('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 });

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [income, setIncome] = useState(90_000);
  const repayment = auHelpRepayment(income);
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{AU_2026.label}</span>
      <label className="tool__field"><span>{t.income}</span><TextField type="number" value={income} onChange={(e) => setIncome(Number(e.target.value))} /></label>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{money(repayment)}</span><span className="tool__stat-label">{t.repayment}</span></div>
      </div></div>
    </ToolPage>
  );
}
