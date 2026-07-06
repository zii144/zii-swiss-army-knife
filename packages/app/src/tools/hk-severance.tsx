import { useState } from 'react';
import { hkSeverancePayment, HK_SEVERANCE } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'HK severance / long-service',
    desc: 'Estimate a statutory 遣散費 / 長服金 payment. On-device — an estimate, not legal advice.',
    wages: 'Last month wages (HK$)',
    years: 'Years of service',
    months: 'Extra months',
    payment: 'Estimated payment',
    perYear: 'Per year of service',
    cappedNote: 'Capped at the HK$390,000 statutory maximum.',
    formula: '2/3 × wages (capped at HK$22,500/mo) × years.',
    eligibility:
      'Severance needs ≥24 months’ service (redundancy); long-service needs ≥5 years. Same formula for both.',
    source: 'Labour Dept guide ↗',
  },
  'zh-HK': {
    title: '遣散費 / 長服金',
    desc: '估算法定遣散費或長期服務金。於裝置上運算，僅供參考，並非法律意見。',
    wages: '最後一個月工資（HK$）',
    years: '服務年資（年）',
    months: '額外月數',
    payment: '估算金額',
    perYear: '每年服務金額',
    cappedNote: '已封頂於法定上限 HK$390,000。',
    formula: '2/3 × 工資（每月上限 HK$22,500）× 年資。',
    eligibility: '遣散費需連續受僱滿 24 個月（裁員）；長服金需滿 5 年。兩者計法相同。',
    source: '勞工處指南 ↗',
  },
  'zh-TW': {
    title: '香港遣散費 / 長服金',
    desc: '估算香港法定遣散費或長期服務金。於裝置上運算，僅供參考。',
    wages: '最後一個月工資（HK$）',
    years: '服務年資（年）',
    months: '額外月數',
    payment: '估算金額',
    perYear: '每年服務金額',
    cappedNote: '已封頂於法定上限 HK$390,000。',
    formula: '2/3 × 工資（每月上限 HK$22,500）× 年資。',
    eligibility: '遣散費需連續受僱滿 24 個月；長服金需滿 5 年。兩者計法相同。',
    source: '香港勞工處指南 ↗',
  },
};

function hkd(amount: number): string {
  return 'HK$' + Math.round(amount).toLocaleString('en-US');
}

export default function HkSeveranceTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [wages, setWages] = useState(20_000);
  const [years, setYears] = useState(5);
  const [months, setMonths] = useState(0);
  const r = hkSeverancePayment(wages, years, months);

  return (
    <ToolPage
      title={t.title}
      description={t.desc}
      onBack={onBack}
      backLabel={backLabel}
      offlineLabel={offlineLabel}
    >
      <label className="tool__field">
        <span>{t.wages}</span>
        <TextField
          type="number"
          value={wages}
          onChange={(e) => setWages(Math.max(0, Number(e.target.value)))}
        />
      </label>
      <div className="tool__inline">
        <label className="tool__field">
          <span>{t.years}</span>
          <TextField
            type="number"
            value={years}
            onChange={(e) => setYears(Math.max(0, Math.floor(Number(e.target.value))))}
          />
        </label>
        <label className="tool__field">
          <span>{t.months}</span>
          <TextField
            type="number"
            value={months}
            onChange={(e) => setMonths(Math.max(0, Math.min(11, Math.floor(Number(e.target.value)))))}
          />
        </label>
      </div>

      <div className="tool__result">
        <div className="tool__inline">
          <div className="tool__stat" style={{ minWidth: '10rem' }}>
            <span className="tool__stat-value">{hkd(r.payment)}</span>
            <span className="tool__stat-label">{t.payment}</span>
          </div>
          <div className="tool__stat">
            <span className="tool__stat-value">{hkd(r.perYear)}</span>
            <span className="tool__stat-label">{t.perYear}</span>
          </div>
        </div>
        <p className="tool__hint">{t.formula}</p>
        {r.capped ? <p className="tool__hint">{t.cappedNote}</p> : null}
      </div>

      <p className="tool__hint">{t.eligibility}</p>
      <a className="tool__link" href={HK_SEVERANCE.source} target="_blank" rel="noopener noreferrer">
        {t.source}
      </a>
    </ToolPage>
  );
}
