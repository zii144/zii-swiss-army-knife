import { useState } from 'react';
import { frCongesAccrual, FR_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = { en: { title: 'France paid leave', desc: 'Accrue congés payés (25 days / year full-time equivalent). On-device.', months: 'Months worked', days: 'Accrued days' }, fr: { title: 'Congés payés', desc: 'Acquisition des congés payés (25 jours / an équivalent temps plein). Local.', months: 'Mois travaillés', days: 'Jours acquis' } };

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [months, setMonths] = useState(12);
  const r = frCongesAccrual(months);
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{FR_2026.label}</span>
      <label className="tool__field"><span>{t.months}</span><TextField type="number" value={months} onChange={(e) => setMonths(Number(e.target.value))} /></label>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{r.days.toFixed(1)}</span><span className="tool__stat-label">{t.days}</span></div>
      </div></div>
    </ToolPage>
  );
}
