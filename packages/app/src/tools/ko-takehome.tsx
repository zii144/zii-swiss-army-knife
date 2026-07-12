import { useState } from 'react';
import { koTakeHome, KO_2026 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = { en: { title: 'Korea take-home pay', desc: 'Estimate 실수령액 after 4대보험 + income/local tax (2026). On-device approximation — not 간이세액표.', gross: 'Monthly gross (₩)', nontax: 'Non-taxable (₩)', takeHome: 'Take-home', insurance: '4 insurances', tax: 'Income tax', local: 'Local tax' }, ko: { title: '실수령액 계산', desc: '4대보험과 소득세·지방소득세를 반영한 월 실수령액 개산(2026). 단말기에서 계산하며 공식 간이세액표가 아닙니다.', gross: '세전 월급 (원)', nontax: '비과세 (원)', takeHome: '실수령액', insurance: '4대보험', tax: '소득세', local: '지방소득세' } };
const won = (n: number) => '₩' + Math.round(n).toLocaleString('ko-KR');

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [gross, setGross] = useState(3_500_000);
  const [nontax, setNontax] = useState(200_000);
  const r = koTakeHome(gross, nontax);
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>{KO_2026.label}</span>
      <div className="tool__inline">
        <label className="tool__field"><span>{t.gross}</span><TextField type="number" value={gross} onChange={(e) => setGross(Number(e.target.value))} /></label>
        <label className="tool__field"><span>{t.nontax}</span><TextField type="number" value={nontax} onChange={(e) => setNontax(Number(e.target.value))} /></label>
      </div>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{won(r.takeHome)}</span><span className="tool__stat-label">{t.takeHome}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{won(r.insurances.total)}</span><span className="tool__stat-label">{t.insurance}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{won(r.incomeTax)}</span><span className="tool__stat-label">{t.tax}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{won(r.localTax)}</span><span className="tool__stat-label">{t.local}</span></div>
      </div></div>
    </ToolPage>
  );
}
