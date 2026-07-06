import { useState } from 'react';
import { hkSalariesTax, hkMpfEmployeeAnnual, HK_SALARIES_TAX_2024_25 } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField, Select } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const CFG = HK_SALARIES_TAX_2024_25;

const L = {
  en: {
    title: 'HK salaries tax + MPF',
    desc: `Estimate Hong Kong salaries tax (薪俸稅) and mandatory MPF for ${CFG.yearOfAssessment}, and your take-home. On-device — an estimate, not tax advice.`,
    income: 'Annual income (HK$)',
    status: 'Marital status',
    single: 'Single',
    married: 'Married (joint)',
    children: 'Children',
    tax: 'Salaries tax',
    mpf: 'MPF (employee)',
    takeHome: 'Take-home',
    effRate: 'Effective tax rate',
    basis: 'Lower of progressive & standard rate',
    source: 'IRD official rates ↗',
    ya: `Year of assessment ${CFG.yearOfAssessment}`,
  },
  'zh-HK': {
    title: '薪俸稅 + 強積金',
    desc: `估算 ${CFG.yearOfAssessment} 課稅年度的香港薪俸稅與強制性強積金，以及稅後實收。於裝置上運算，僅供參考，並非稅務意見。`,
    income: '全年入息（HK$）',
    status: '婚姻狀況',
    single: '單身',
    married: '已婚（合併評稅）',
    children: '子女數目',
    tax: '應繳薪俸稅',
    mpf: '強積金（僱員）',
    takeHome: '稅後實收',
    effRate: '實際稅率',
    basis: '取累進稅與標準稅率之較低者',
    source: '稅務局官方稅率 ↗',
    ya: `${CFG.yearOfAssessment} 課稅年度`,
  },
  'zh-TW': {
    title: '香港薪俸稅 + 強積金',
    desc: `估算 ${CFG.yearOfAssessment} 年度香港薪俸稅與強積金，以及稅後實收。於裝置上運算，僅供參考。`,
    income: '全年收入（HK$）',
    status: '婚姻狀況',
    single: '單身',
    married: '已婚（合併申報）',
    children: '子女數',
    tax: '應繳薪俸稅',
    mpf: '強積金（僱員）',
    takeHome: '稅後實收',
    effRate: '實際稅率',
    basis: '取累進稅與標準稅率之較低者',
    source: '香港稅務局官方稅率 ↗',
    ya: `${CFG.yearOfAssessment} 課稅年度`,
  },
};

function hkd(amount: number): string {
  return 'HK$' + Math.round(amount).toLocaleString('en-US');
}

export default function HkSalariesTaxTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [income, setIncome] = useState(600_000);
  const [status, setStatus] = useState<'single' | 'married'>('single');
  const [children, setChildren] = useState(0);

  const mpf = hkMpfEmployeeAnnual(income / 12, CFG);
  const result = hkSalariesTax(
    {
      annualIncome: income,
      married: status === 'married',
      children,
      mpfDeduction: mpf,
    },
    CFG,
  );
  const takeHome = Math.max(0, income - result.taxPayable - mpf);

  return (
    <ToolPage
      title={t.title}
      description={t.desc}
      onBack={onBack}
      backLabel={backLabel}
      offlineLabel={offlineLabel}
    >
      <span className="app__badge" style={{ alignSelf: 'flex-start' }}>
        {t.ya}
      </span>

      <label className="tool__field">
        <span>{t.income}</span>
        <TextField
          type="number"
          value={income}
          onChange={(e) => setIncome(Math.max(0, Number(e.target.value)))}
        />
      </label>

      <div className="tool__inline">
        <label className="tool__field">
          <span>{t.status}</span>
          <Select
            value={status}
            onChange={(v) => setStatus(v as 'single' | 'married')}
            options={[
              { value: 'single', label: t.single },
              { value: 'married', label: t.married },
            ]}
            ariaLabel={t.status}
          />
        </label>
        <label className="tool__field">
          <span>{t.children}</span>
          <TextField
            type="number"
            value={children}
            onChange={(e) => setChildren(Math.max(0, Math.floor(Number(e.target.value))))}
          />
        </label>
      </div>

      <div className="tool__result">
        <div className="tool__inline">
          <div className="tool__stat">
            <span className="tool__stat-value">{hkd(takeHome)}</span>
            <span className="tool__stat-label">{t.takeHome}</span>
          </div>
          <div className="tool__stat">
            <span className="tool__stat-value">{hkd(result.taxPayable)}</span>
            <span className="tool__stat-label">{t.tax}</span>
          </div>
          <div className="tool__stat">
            <span className="tool__stat-value">{hkd(mpf)}</span>
            <span className="tool__stat-label">{t.mpf}</span>
          </div>
          <div className="tool__stat">
            <span className="tool__stat-value">{(result.effectiveRate * 100).toFixed(1)}%</span>
            <span className="tool__stat-label">{t.effRate}</span>
          </div>
        </div>
        <p className="tool__hint">{t.basis}</p>
      </div>

      <a className="tool__link" href={CFG.source} target="_blank" rel="noopener noreferrer">
        {t.source}
      </a>
    </ToolPage>
  );
}
