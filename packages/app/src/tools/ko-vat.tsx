import { useState } from 'react';
import { salesTax } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const RATE = 0.1;
const L = {
  en: {
    title: 'Korea VAT (부가세)',
    desc: 'Add or extract 10% VAT on an amount. On-device.',
    amount: 'Amount (₩)',
    inclusive: 'Amount already includes VAT',
    net: 'Net',
    tax: 'VAT',
    gross: 'Gross',
  },
  ko: {
    title: '부가가치세 10%',
    desc: '금액에 부가세 10%를 더하거나 분리합니다. 기기에서 계산.',
    amount: '금액 (원)',
    inclusive: '금액에 부가세 포함',
    net: '공급가액',
    tax: '부가세',
    gross: '합계',
  },
};

const num = (n: number) => Math.round(n).toLocaleString('ko-KR');

export default function Tool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [amount, setAmount] = useState(100_000);
  const [inclusive, setInclusive] = useState(false);
  const r = salesTax(amount, RATE, { inclusive });
  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.amount}</span><TextField type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} /></label>
      <label className="tool__check"><input type="checkbox" checked={inclusive} onChange={() => setInclusive((v) => !v)} />{t.inclusive}</label>
      <div className="tool__result"><div className="tool__stats">
        <div className="tool__stat"><span className="tool__stat-value">{num(r.net)}</span><span className="tool__stat-label">{t.net}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{num(r.tax)}</span><span className="tool__stat-label">{t.tax}</span></div>
        <div className="tool__stat"><span className="tool__stat-value">{num(r.gross)}</span><span className="tool__stat-label">{t.gross}</span></div>
      </div></div>
    </ToolPage>
  );
}
