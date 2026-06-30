import { useState } from 'react';
import { loanMonthlyPayment, amortizationSchedule } from '@zii/calc';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'Loan calculator',
    desc: 'Work out the monthly payment, total cost, and amortization of a loan. On-device.',
    principal: 'Loan amount',
    rate: 'Annual rate (%)',
    years: 'Term (years)',
    monthly: 'Monthly payment',
    total: 'Total paid',
    interest: 'Total interest',
    schedule: 'First 12 months',
    period: 'Month',
    payment: 'Payment',
    principalCol: 'Principal',
    interestCol: 'Interest',
    balance: 'Balance',
  },
  'zh-TW': {
    title: '貸款計算機',
    desc: '計算貸款每月還款、總成本與攤還明細，於裝置上處理。',
    principal: '貸款金額',
    rate: '年利率（%）',
    years: '期間（年）',
    monthly: '每月還款',
    total: '總還款',
    interest: '總利息',
    schedule: '前 12 個月',
    period: '月',
    payment: '還款',
    principalCol: '本金',
    interestCol: '利息',
    balance: '餘額',
  },
};

const fmt = (n: number): string => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

export default function LoanCalculatorTool({
  onBack,
  lang,
  backLabel,
  offlineLabel,
}: ToolViewProps) {
  const t = tr(L, lang);
  const [principal, setPrincipal] = useState(300000);
  const [rate, setRate] = useState(5);
  const [years, setYears] = useState(30);

  const months = Math.max(1, Math.round(years * 12));
  let monthly: number | null = null;
  let schedule: ReturnType<typeof amortizationSchedule> = [];
  let error: string | null = null;
  try {
    monthly = loanMonthlyPayment(principal, rate, months);
    schedule = amortizationSchedule(principal, rate, months);
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  const totalPaid = monthly !== null ? monthly * months : 0;
  const totalInterest = totalPaid - principal;

  return (
    <ToolPage
      title={t.title}
      description={t.desc}
      onBack={onBack}
      backLabel={backLabel}
      offlineLabel={offlineLabel}
    >
      <div className="tool__inline">
        <label className="tool__field">
          <span>{t.principal}</span>
          <TextField
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
          />
        </label>
        <label className="tool__field">
          <span>{t.rate}</span>
          <TextField type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
        </label>
        <label className="tool__field">
          <span>{t.years}</span>
          <TextField
            type="number"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
          />
        </label>
      </div>

      {error ? <p className="tool__error">{error}</p> : null}
      {monthly !== null && !error ? (
        <div className="tool__result">
          <div className="tool__stats">
            <div className="tool__stat">
              <span className="tool__stat-value">{fmt(monthly)}</span>
              <span className="tool__stat-label">{t.monthly}</span>
            </div>
            <div className="tool__stat">
              <span className="tool__stat-value">{fmt(totalPaid)}</span>
              <span className="tool__stat-label">{t.total}</span>
            </div>
            <div className="tool__stat">
              <span className="tool__stat-value">{fmt(totalInterest)}</span>
              <span className="tool__stat-label">{t.interest}</span>
            </div>
          </div>

          <p className="tool__hint">{t.schedule}</p>
          <table className="ztable">
            <thead>
              <tr>
                <th>{t.period}</th>
                <th>{t.payment}</th>
                <th>{t.principalCol}</th>
                <th>{t.interestCol}</th>
                <th>{t.balance}</th>
              </tr>
            </thead>
            <tbody>
              {schedule.slice(0, 12).map((row) => (
                <tr key={row.period}>
                  <td>{row.period}</td>
                  <td>{fmt(row.payment)}</td>
                  <td>{fmt(row.principal)}</td>
                  <td>{fmt(row.interest)}</td>
                  <td>{fmt(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </ToolPage>
  );
}
