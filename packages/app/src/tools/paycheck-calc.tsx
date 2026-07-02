import { useMemo, useState } from 'react';
import { grossForNet, makeFlatRateModule } from '@zii/payroll';
import type { PayrollBreakdown } from '@zii/payroll';
import { ToolPage } from '../components/ToolPage';
import { Select, TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

type Mode = 'gross-to-net' | 'net-to-gross';

const L = {
  en: {
    title: 'Paycheck calculator',
    desc: 'Estimate take-home pay from gross, or find the gross needed for a target net. Uses flat-rate deductions you configure — runs on your device.',
    mode: 'Mode',
    grossToNet: 'Gross → net',
    netToGross: 'Net → gross (reverse)',
    amount: 'Amount',
    incomeTax: 'Income tax (%)',
    pension: 'Pension / retirement (%)',
    other: 'Other deductions (%)',
    gross: 'Gross pay',
    net: 'Net pay',
    deductions: 'Deductions',
    totalDeductions: 'Total deductions',
    requiredGross: 'Required gross',
    error: 'Could not compute — check your inputs.',
  },
  'zh-TW': {
    title: '薪資試算',
    desc: '由税前薪資估算實領，或由目標實領反推税前薪資。依您設定的固定比例扣款計算，於裝置上運算。',
    mode: '模式',
    grossToNet: '税前 → 實領',
    netToGross: '實領 → 税前（反推）',
    amount: '金額',
    incomeTax: '所得稅（%）',
    pension: '退休金（%）',
    other: '其他扣款（%）',
    gross: '税前薪資',
    net: '實領',
    deductions: '扣款明細',
    totalDeductions: '扣款合計',
    requiredGross: '所需税前薪資',
    error: '無法計算 — 請檢查輸入。',
  },
};

const num = (n: number): string => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

function buildModule(incomeTax: number, pension: number, other: number) {
  const rates: Record<string, number> = {};
  if (incomeTax > 0) rates.incomeTax = incomeTax / 100;
  if (pension > 0) rates.pension = pension / 100;
  if (other > 0) rates.other = other / 100;
  return makeFlatRateModule({ market: 'custom', version: 1, rates });
}

export default function PaycheckCalcTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [mode, setMode] = useState<Mode>('gross-to-net');
  const [amount, setAmount] = useState(50000);
  const [incomeTax, setIncomeTax] = useState(10);
  const [pension, setPension] = useState(6);
  const [other, setOther] = useState(2);

  const module = useMemo(
    () => buildModule(incomeTax, pension, other),
    [incomeTax, pension, other],
  );

  let breakdown: PayrollBreakdown | null = null;
  let requiredGross: number | null = null;
  let error: string | null = null;

  try {
    if (mode === 'gross-to-net') {
      breakdown = module.computeNet({ gross: amount });
    } else {
      requiredGross = grossForNet(module, amount);
      breakdown = module.computeNet({ gross: requiredGross });
    }
  } catch {
    error = t.error;
  }

  const modeOptions = [
    { value: 'gross-to-net', label: t.grossToNet },
    { value: 'net-to-gross', label: t.netToGross },
  ];

  return (
    <ToolPage
      title={t.title}
      description={t.desc}
      onBack={onBack}
      backLabel={backLabel}
      offlineLabel={offlineLabel}
    >
      <div className="tool__field">
        <span>{t.mode}</span>
        <Select
          value={mode}
          options={modeOptions}
          onChange={(v) => setMode(v as Mode)}
          ariaLabel={t.mode}
        />
      </div>
      <label className="tool__field">
        <span>{t.amount}</span>
        <TextField type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
      </label>
      <div className="tool__inline">
        <label className="tool__field">
          <span>{t.incomeTax}</span>
          <TextField
            type="number"
            value={incomeTax}
            onChange={(e) => setIncomeTax(Number(e.target.value))}
          />
        </label>
        <label className="tool__field">
          <span>{t.pension}</span>
          <TextField type="number" value={pension} onChange={(e) => setPension(Number(e.target.value))} />
        </label>
        <label className="tool__field">
          <span>{t.other}</span>
          <TextField type="number" value={other} onChange={(e) => setOther(Number(e.target.value))} />
        </label>
      </div>

      {error ? (
        <p className="tool__error">{error}</p>
      ) : breakdown ? (
        <div className="tool__result">
          {mode === 'net-to-gross' && requiredGross !== null ? (
            <div className="tool__stat">
              <span className="tool__stat-value">{num(requiredGross)}</span>
              <span className="tool__stat-label">{t.requiredGross}</span>
            </div>
          ) : null}
          <div className="tool__stats">
            <div className="tool__stat">
              <span className="tool__stat-value">{num(breakdown.gross)}</span>
              <span className="tool__stat-label">{t.gross}</span>
            </div>
            <div className="tool__stat">
              <span className="tool__stat-value">{num(breakdown.net)}</span>
              <span className="tool__stat-label">{t.net}</span>
            </div>
            <div className="tool__stat">
              <span className="tool__stat-value">{num(breakdown.totalDeductions)}</span>
              <span className="tool__stat-label">{t.totalDeductions}</span>
            </div>
          </div>
          {Object.keys(breakdown.deductions).length > 0 ? (
            <div className="tool__field">
              <span>{t.deductions}</span>
              <div className="tool__rows">
                {Object.entries(breakdown.deductions).map(([name, value]) => (
                  <div key={name} className="tool__row">
                    <span className="tool__row-label">{name}</span>
                    <span className="tool__row-value">{num(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </ToolPage>
  );
}
