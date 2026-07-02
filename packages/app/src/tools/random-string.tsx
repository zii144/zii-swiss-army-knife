import { useEffect, useState } from 'react';
import { randomString } from '../lib/toolkit';
import { ToolPage } from '../components/ToolPage';
import { Button, RangeSlider } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const POOLS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  digits: '0123456789',
  symbols: '-_',
};

const L = {
  en: {
    title: 'Random string',
    desc: 'Generate cryptographically random strings for tokens, IDs, and test data.',
    length: 'Length',
    lower: 'a-z',
    upper: 'A-Z',
    digits: '0-9',
    symbols: 'Symbols (-_)',
    regenerate: 'Regenerate',
    copy: 'Copy',
    copied: 'Copied',
  },
  'zh-TW': {
    title: '隨機字串',
    desc: '產生密碼學安全的隨機字串，適用於 token、ID 或測試資料。',
    length: '長度',
    lower: 'a-z',
    upper: 'A-Z',
    digits: '0-9',
    symbols: '符號 (-_)',
    regenerate: '重新產生',
    copy: '複製',
    copied: '已複製',
  },
};

export default function RandomStringTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [length, setLength] = useState(32);
  const [lower, setLower] = useState(true);
  const [upper, setUpper] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(false);
  const [value, setValue] = useState('');
  const [copied, setCopied] = useState(false);

  const pool =
    (lower ? POOLS.lower : '') +
    (upper ? POOLS.upper : '') +
    (digits ? POOLS.digits : '') +
    (symbols ? POOLS.symbols : '');

  useEffect(() => {
    setValue(pool ? randomString(length, pool) : '');
  }, [length, pool]);

  const copy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* ignore */
    }
  };

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field">
        <span>
          {t.length}: {length}
        </span>
        <RangeSlider min={4} max={128} value={length} onChange={(e) => setLength(Number(e.target.value))} />
      </label>
      <div className="tool__checks">
        <label className="tool__check">
          <input type="checkbox" checked={lower} onChange={() => setLower((v) => !v)} />
          {t.lower}
        </label>
        <label className="tool__check">
          <input type="checkbox" checked={upper} onChange={() => setUpper((v) => !v)} />
          {t.upper}
        </label>
        <label className="tool__check">
          <input type="checkbox" checked={digits} onChange={() => setDigits((v) => !v)} />
          {t.digits}
        </label>
        <label className="tool__check">
          <input type="checkbox" checked={symbols} onChange={() => setSymbols((v) => !v)} />
          {t.symbols}
        </label>
      </div>
      <div className="tool__actions">
        <Button variant="primary" onClick={() => setValue(pool ? randomString(length, pool) : '')}>
          {t.regenerate}
        </Button>
        <Button variant="ghost" disabled={!value} onClick={copy}>
          {copied ? t.copied : t.copy}
        </Button>
      </div>
      {value ? (
        <div className="tool__result">
          <code className="tool__row-value tool__row-value--mono">{value}</code>
        </div>
      ) : null}
    </ToolPage>
  );
}
