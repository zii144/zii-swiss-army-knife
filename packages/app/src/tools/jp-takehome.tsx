import { useState } from 'react';
import { jpTakeHome, JP_TAKEHOME_TOKYO_2024 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField, Select } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const CFG = JP_TAKEHOME_TOKYO_2024;

const L = {
  en: {
    title: 'Japan take-home pay',
    desc: 'Estimate monthly 手取り from gross salary — 社会保険 + 所得税 + 住民税. On-device; a single-person 概算, not a payslip.',
    gross: 'Monthly gross (¥)',
    age: 'Age',
    under40: 'Under 40',
    over40: '40–64 (介護保険)',
    takeHome: 'Take-home / month',
    health: 'Health 健康保険',
    care: 'Care 介護保険',
    pension: 'Pension 厚生年金',
    employment: 'Employment 雇用保険',
    incomeTax: 'Income tax 所得税',
    residentTax: 'Resident tax 住民税',
    deductions: 'Total deductions',
    note: 'Single earner, no dependants/special deductions. Social insurance is exact for this basis; tax is estimated.',
    source: '協会けんぽ rates ↗',
  },
  ja: {
    title: '手取り計算',
    desc: '額面月給から手取りを概算します（社会保険＋所得税＋住民税）。端末内で計算。独身・扶養なしの概算で、給与明細ではありません。',
    gross: '額面月収（円）',
    age: '年齢',
    under40: '40歳未満',
    over40: '40〜64歳（介護保険）',
    takeHome: '手取り / 月',
    health: '健康保険',
    care: '介護保険',
    pension: '厚生年金',
    employment: '雇用保険',
    incomeTax: '所得税',
    residentTax: '住民税',
    deductions: '控除合計',
    note: '独身・扶養控除や各種控除は未考慮。社会保険は当基準で正確、税額は概算です。',
    source: '協会けんぽの保険料率 ↗',
  },
  'zh-TW': {
    title: '日本手取（實領）試算',
    desc: '由額面月薪估算實領金額（社會保險＋所得稅＋住民稅）。於裝置上運算，為單身概算，非正式薪資單。',
    gross: '額面月薪（日圓）',
    age: '年齡',
    under40: '未滿 40 歲',
    over40: '40〜64 歲（介護保險）',
    takeHome: '每月實領',
    health: '健康保險',
    care: '介護保險',
    pension: '厚生年金',
    employment: '雇用保險',
    incomeTax: '所得稅',
    residentTax: '住民稅',
    deductions: '扣除合計',
    note: '單身、未計扶養及各項扣除。社會保險依此基準精確，稅額為概算。',
    source: '協會健保費率 ↗',
  },
};

function yen(amount: number): string {
  return '¥' + Math.round(amount).toLocaleString('en-US');
}

export default function JpTakeHomeTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [gross, setGross] = useState(300_000);
  const [age, setAge] = useState<'under40' | 'over40'>('under40');
  const r = jpTakeHome(gross, { age40to64: age === 'over40' });

  const lines: Array<[string, number]> = [
    [t.health, r.social.health],
    ...(r.social.care > 0 ? ([[t.care, r.social.care]] as Array<[string, number]>) : []),
    [t.pension, r.social.pension],
    [t.employment, r.social.employment],
    [t.incomeTax, r.incomeTaxMonthly],
    [t.residentTax, r.residentTaxMonthly],
  ];

  return (
    <ToolPage
      title={t.title}
      description={t.desc}
      onBack={onBack}
      backLabel={backLabel}
      offlineLabel={offlineLabel}
    >
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>
        {CFG.label}
      </span>

      <div className="tool__inline">
        <label className="tool__field">
          <span>{t.gross}</span>
          <TextField
            type="number"
            value={gross}
            onChange={(e) => setGross(Math.max(0, Number(e.target.value)))}
          />
        </label>
        <label className="tool__field">
          <span>{t.age}</span>
          <Select
            value={age}
            onChange={(v) => setAge(v as 'under40' | 'over40')}
            options={[
              { value: 'under40', label: t.under40 },
              { value: 'over40', label: t.over40 },
            ]}
            ariaLabel={t.age}
          />
        </label>
      </div>

      <div className="tool__result">
        <div className="tool__stat" style={{ alignSelf: 'flex-start', minWidth: '12rem' }}>
          <span className="tool__stat-value">{yen(r.takeHomeMonthly)}</span>
          <span className="tool__stat-label">{t.takeHome}</span>
        </div>

        <table className="tool__table">
          <tbody>
            {lines.map(([label, value]) => (
              <tr key={label}>
                <td>{label}</td>
                <td style={{ textAlign: 'right' }}>−{yen(value)}</td>
              </tr>
            ))}
            <tr className="tool__table-total">
              <td>{t.deductions}</td>
              <td style={{ textAlign: 'right' }}>−{yen(r.deductionsMonthly)}</td>
            </tr>
          </tbody>
        </table>
        <p className="tool__hint">{t.note}</p>
      </div>

      <a className="tool__link" href={CFG.source} target="_blank" rel="noopener noreferrer">
        {t.source}
      </a>
    </ToolPage>
  );
}
