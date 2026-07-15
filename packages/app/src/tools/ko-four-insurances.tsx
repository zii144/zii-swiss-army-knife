import { useState } from 'react';
import { koFourInsurances, KO_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = { en: { title: 'Korea four insurances', desc: 'Break down 국민연금·건강보험·장기요양·고용보험 (2026 employee rates). On-device.', base: 'Monthly taxable (₩)', np: 'National pension', hi: 'Health', ltc: 'Long-term care', ei: 'Employment', total: 'Total' }, ko: { title: '4대보험 계산', desc: '국민연금·건강보험·장기요양·고용보험 근로자 부담(2026). 단말기 계산.', base: '과세 월급 (원)', np: '국민연금', hi: '건강보험', ltc: '장기요양', ei: '고용보험', total: '합계' } };
const won = (n: number) => '₩' + Math.round(n).toLocaleString('ko-KR');

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [base, setBase] = useState(3_500_000);
  const r = koFourInsurances(base);
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{KO_2026.label}</span>
      <label className="tool__field"><span>{t.base}</span><TextField type="number" value={base} onChange={(e) => setBase(Number(e.target.value))} /></label>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{won(r.nationalPension)}</span><span className="tool__stat-label">{t.np}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{won(r.healthInsurance)}</span><span className="tool__stat-label">{t.hi}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{won(r.longTermCare)}</span><span className="tool__stat-label">{t.ltc}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{won(r.employmentInsurance)}</span><span className="tool__stat-label">{t.ei}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{won(r.total)}</span><span className="tool__stat-label">{t.total}</span></div>
      </div></div>
    </ToolPage>
  );
}
