import { useState } from 'react';
import { convertCurrency } from '@zii/calc';
import { fetchLiveFxRate } from '../lib/backend';
import { ToolPage } from '../components/ToolPage';
import { Button, Select, TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const CURRENCIES = [
  'USD',
  'EUR',
  'GBP',
  'JPY',
  'CNY',
  'TWD',
  'HKD',
  'KRW',
  'AUD',
  'CAD',
  'CHF',
  'SGD',
] as const;

const L = {
  en: {
    title: 'Currency converter',
    desc: 'Convert an amount between currencies using a rate you provide. Runs on your device — enter a live rate or one from your bank.',
    amount: 'Amount',
    from: 'From',
    to: 'To',
    rate: 'Exchange rate (1 unit of “from” = … “to”)',
    swap: 'Swap',
    fetchRate: 'Fetch live rate',
    fetching: 'Fetching…',
    result: 'Converted amount',
    hint: 'Use a manual rate or fetch a live mid-market rate (Frankfurter API, or your backend when VITE_BACKEND_URL is set).',
  },
  'zh-TW': {
    title: '匯率換算',
    desc: '以您提供的匯率換算金額，於裝置上運算。可輸入即時匯率或銀行牌告。',
    amount: '金額',
    from: '來源幣別',
    to: '目標幣別',
    rate: '匯率（1 單位「來源」＝ … 「目標」）',
    swap: '對調',
    fetchRate: '取得即時匯率',
    fetching: '取得中…',
    result: '換算結果',
    hint: '可手動輸入匯率，或取得即時中間價（Frankfurter API，或已設定 VITE_BACKEND_URL 時走後端）。',
  },
};

const num = (n: number): string =>
  n.toLocaleString(undefined, { maximumFractionDigits: 6, minimumFractionDigits: 0 });

export default function CurrencyConvertTool({
  onBack,
  lang,
  backLabel,
  offlineLabel,
}: ToolViewProps) {
  const t = tr(L, lang);
  const [amount, setAmount] = useState(100);
  const [from, setFrom] = useState<string>('USD');
  const [to, setTo] = useState<string>('EUR');
  const [rate, setRate] = useState(0.92);
  const [rateBusy, setRateBusy] = useState(false);
  const [rateError, setRateError] = useState<string | null>(null);

  let converted: number | null = null;
  let error: string | null = null;
  try {
    if (from !== to && rate > 0) {
      converted = convertCurrency(amount, from, to, rate);
    } else if (from === to) {
      converted = amount;
    }
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  const swap = (): void => {
    setFrom(to);
    setTo(from);
    if (rate > 0) setRate(1 / rate);
  };

  const fetchRate = async (): Promise<void> => {
    setRateBusy(true);
    setRateError(null);
    try {
      setRate(await fetchLiveFxRate(from, to));
    } catch (e) {
      setRateError(e instanceof Error ? e.message : String(e));
    } finally {
      setRateBusy(false);
    }
  };

  const currencyOptions = CURRENCIES.map((c) => ({ value: c, label: c }));

  return (
    <ToolPage
      title={t.title}
      description={t.desc}
      onBack={onBack}
      backLabel={backLabel}
      offlineLabel={offlineLabel}
    >
      <p className="tool__hint">{t.hint}</p>
      <div className="tool__inline">
        <label className="tool__field">
          <span>{t.amount}</span>
          <TextField
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </label>
        <label className="tool__field">
          <span>{t.from}</span>
          <Select value={from} options={currencyOptions} onChange={setFrom} ariaLabel={t.from} />
        </label>
        <label className="tool__field">
          <span>{t.to}</span>
          <Select value={to} options={currencyOptions} onChange={setTo} ariaLabel={t.to} />
        </label>
      </div>
      <div className="tool__inline">
        <label className="tool__field">
          <span>{t.rate}</span>
          <TextField
            type="number"
            step="any"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
          />
        </label>
        <div className="tool__actions">
          <Button variant="ghost" onClick={swap}>
            {t.swap}
          </Button>
          <Button variant="ghost" loading={rateBusy} disabled={from === to || rateBusy} onClick={fetchRate}>
            {rateBusy ? t.fetching : t.fetchRate}
          </Button>
        </div>
      </div>
      {rateError ? <p className="tool__error">{rateError}</p> : null}

      {error ? (
        <p className="tool__error">{error}</p>
      ) : converted !== null ? (
        <div className="tool__result">
          <div className="tool__stat">
            <span className="tool__stat-value">
              {num(converted)} {to}
            </span>
            <span className="tool__stat-label">{t.result}</span>
          </div>
        </div>
      ) : null}
    </ToolPage>
  );
}
