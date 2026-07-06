import { useState } from 'react';
import { furusatoLimit, FURUSATO_STANDARD } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'Furusato tax limit',
    desc: 'Estimate your ふるさと納税 donation ceiling — the amount where only ¥2,000 is not refunded. On-device; an estimate, not tax advice.',
    income: 'Taxable income 課税所得 (¥)',
    incomeHint: 'The “課税される所得金額” on your 源泉徴収票 — using it makes this exact.',
    limit: 'Recommended limit',
    rate: 'Income-tax marginal rate',
    levy: 'Resident-tax levy (10%)',
    selfPay: 'Of which ¥2,000 is your self-pay.',
    source: '総務省 official method ↗',
  },
  ja: {
    title: 'ふるさと納税 上限額',
    desc: '自己負担2,000円で済む、ふるさと納税の寄附上限額の目安を計算します。端末内で計算。あくまで目安で、税務アドバイスではありません。',
    income: '課税所得（円）',
    incomeHint: '源泉徴収票の「課税される所得金額」を入力すると正確になります。',
    limit: '寄附上限額の目安',
    rate: '所得税の限界税率',
    levy: '住民税所得割（10%）',
    selfPay: 'うち2,000円は自己負担です。',
    source: '総務省の計算方法 ↗',
  },
  'zh-TW': {
    title: '日本故鄉稅上限',
    desc: '估算「ふるさと納税」的捐款上限（僅自付 2,000 日圓的額度）。於裝置上運算，僅供參考。',
    income: '課稅所得（日圓）',
    incomeHint: '請填入源泉徵收票上的「課税される所得金額」，結果最準確。',
    limit: '建議捐款上限',
    rate: '所得稅邊際稅率',
    levy: '住民稅所得割（10%）',
    selfPay: '其中 2,000 日圓為自付額。',
    source: '日本總務省官方算式 ↗',
  },
};

function yen(amount: number): string {
  return '¥' + Math.round(amount).toLocaleString('en-US');
}

export default function JpFurusatoTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [income, setIncome] = useState(3_000_000);
  const r = furusatoLimit(income);

  return (
    <ToolPage
      title={t.title}
      description={t.desc}
      onBack={onBack}
      backLabel={backLabel}
      offlineLabel={offlineLabel}
    >
      <label className="tool__field">
        <span>{t.income}</span>
        <TextField
          type="number"
          value={income}
          onChange={(e) => setIncome(Math.max(0, Number(e.target.value)))}
        />
      </label>
      <p className="tool__hint">{t.incomeHint}</p>

      <div className="tool__result">
        <div className="tool__stat" style={{ alignSelf: 'flex-start', minWidth: '12rem' }}>
          <span className="tool__stat-value">{yen(r.limit)}</span>
          <span className="tool__stat-label">{t.limit}</span>
        </div>
        <div className="tool__inline">
          <div className="tool__stat">
            <span className="tool__stat-value">{(r.marginalRate * 100).toFixed(0)}%</span>
            <span className="tool__stat-label">{t.rate}</span>
          </div>
          <div className="tool__stat">
            <span className="tool__stat-value">{yen(r.residentTaxIncomeLevy)}</span>
            <span className="tool__stat-label">{t.levy}</span>
          </div>
        </div>
        <p className="tool__hint">{t.selfPay}</p>
      </div>

      <a className="tool__link" href={FURUSATO_STANDARD.source} target="_blank" rel="noopener noreferrer">
        {t.source}
      </a>
    </ToolPage>
  );
}
