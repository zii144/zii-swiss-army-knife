import { useState } from 'react';
import {
  checkTwInvoice,
  TW_INVOICE_DRAWINGS,
  type TwInvoiceDrawing,
  type TwInvoiceResult,
  type TwPrizeTier,
} from '@zii/receipt';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'Taiwan invoice lottery',
    desc: 'Check a 統一發票 receipt against the period’s winning numbers. Runs entirely on your device — nothing is uploaded.',
    winning: 'Winning numbers',
    winningHint:
      'No numbers are bundled. Enter this period’s numbers from the official source, then check your receipts.',
    source: 'Official winning numbers ↗',
    special: '特別獎 (8 digits)',
    grand: '特獎 (8 digits)',
    first: '頭獎 (8 digits)',
    additional: '增開六獎 (3-digit, comma-separated)',
    receipt: 'Your receipt number',
    receiptHint: 'The 8-digit number (the 2-letter prefix is ignored).',
    won: 'You won',
    noPrize: 'No prize this time.',
    invalid: 'Enter a valid 8-digit invoice number.',
    matched: 'matched',
    tiers: {
      special: '特別獎 Special Prize',
      grand: '特獎 Grand Prize',
      first: '頭獎 First Prize',
      second: '二獎 Second Prize',
      third: '三獎 Third Prize',
      fourth: '四獎 Fourth Prize',
      fifth: '五獎 Fifth Prize',
      sixth: '六獎 Sixth Prize',
      additionalSixth: '增開六獎 Additional Sixth',
      none: '—',
    } as Record<TwPrizeTier, string>,
  },
  'zh-TW': {
    title: '統一發票對獎',
    desc: '輸入本期中獎號碼與你的發票號碼即可對獎。全程於裝置上運算，不上傳任何資料。',
    winning: '本期中獎號碼',
    winningHint: '未內建號碼。請至官方網站抄錄本期號碼後即可對獎。',
    source: '官方中獎號碼 ↗',
    special: '特別獎（8 碼）',
    grand: '特獎（8 碼）',
    first: '頭獎（8 碼）',
    additional: '增開六獎（3 碼，以逗號分隔）',
    receipt: '你的發票號碼',
    receiptHint: '輸入 8 位數號碼（前兩碼英文字軌會自動忽略）。',
    won: '恭喜中獎',
    noPrize: '這張沒有中獎。',
    invalid: '請輸入有效的 8 位數發票號碼。',
    matched: '對中',
    tiers: {
      special: '特別獎',
      grand: '特獎',
      first: '頭獎',
      second: '二獎',
      third: '三獎',
      fourth: '四獎',
      fifth: '五獎',
      sixth: '六獎',
      additionalSixth: '增開六獎',
      none: '—',
    } as Record<TwPrizeTier, string>,
  },
};

const SOURCE_URL = 'https://invoice.etax.nat.gov.tw/';

function formatTwd(amount: number): string {
  return 'NT$' + amount.toLocaleString('en-US');
}

export default function TwInvoiceTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const bundled = TW_INVOICE_DRAWINGS[0];

  const [special, setSpecial] = useState(bundled?.specialPrize ?? '');
  const [grand, setGrand] = useState(bundled?.grandPrize ?? '');
  const [first, setFirst] = useState<string[]>([
    bundled?.firstPrizes[0] ?? '',
    bundled?.firstPrizes[1] ?? '',
    bundled?.firstPrizes[2] ?? '',
  ]);
  const [additional, setAdditional] = useState((bundled?.additionalSixth ?? []).join(', '));
  const [receipt, setReceipt] = useState('');

  const drawing: TwInvoiceDrawing = {
    period: bundled?.period ?? 'manual',
    specialPrize: special,
    grandPrize: grand,
    firstPrizes: first,
    additionalSixth: additional
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    drawnOn: bundled?.drawnOn ?? '',
    source: bundled?.source ?? SOURCE_URL,
  };

  const result: TwInvoiceResult | null = receipt.trim() ? checkTwInvoice(receipt, drawing) : null;

  const setFirstAt = (i: number, value: string): void => {
    setFirst((prev) => prev.map((v, j) => (j === i ? value : v)));
  };

  return (
    <ToolPage
      title={t.title}
      description={t.desc}
      onBack={onBack}
      backLabel={backLabel}
      offlineLabel={offlineLabel}
    >
      <fieldset className="tool__group">
        <legend className="tool__hint">{t.winning}</legend>
        {!bundled ? <p className="tool__hint">{t.winningHint}</p> : null}
        <a className="tool__link" href={SOURCE_URL} target="_blank" rel="noopener noreferrer">
          {t.source}
        </a>
        <label className="tool__field">
          <span>{t.special}</span>
          <TextField
            inputMode="numeric"
            value={special}
            placeholder="12345678"
            onChange={(e) => setSpecial(e.target.value)}
          />
        </label>
        <label className="tool__field">
          <span>{t.grand}</span>
          <TextField
            inputMode="numeric"
            value={grand}
            placeholder="87654321"
            onChange={(e) => setGrand(e.target.value)}
          />
        </label>
        {first.map((v, i) => (
          <label className="tool__field" key={i}>
            <span>
              {t.first} #{i + 1}
            </span>
            <TextField
              inputMode="numeric"
              value={v}
              placeholder="11223344"
              onChange={(e) => setFirstAt(i, e.target.value)}
            />
          </label>
        ))}
        <label className="tool__field">
          <span>{t.additional}</span>
          <TextField
            inputMode="numeric"
            value={additional}
            placeholder="789, 456"
            onChange={(e) => setAdditional(e.target.value)}
          />
        </label>
      </fieldset>

      <label className="tool__field">
        <span>{t.receipt}</span>
        <TextField
          inputMode="numeric"
          value={receipt}
          placeholder="AB-12345678"
          onChange={(e) => setReceipt(e.target.value)}
        />
      </label>
      <p className="tool__hint">{t.receiptHint}</p>

      {receipt.trim() && result === null ? (
        <p className="tool__error">{t.invalid}</p>
      ) : result && result.tier !== 'none' ? (
        <div className="tool__result">
          <p className="tool__hint">{t.won}</p>
          <div className="tool__stat" style={{ alignSelf: 'flex-start', minWidth: '10rem' }}>
            <span className="tool__stat-value">{formatTwd(result.amountTwd)}</span>
            <span className="tool__stat-label">{t.tiers[result.tier]}</span>
          </div>
          {result.matched ? (
            <p className="tool__hint">
              {t.matched}: <code>{result.matched}</code>
            </p>
          ) : null}
        </div>
      ) : result ? (
        <p className="tool__hint">{t.noPrize}</p>
      ) : null}
    </ToolPage>
  );
}
