import { useEffect, useState } from 'react';
import { randomPassword, passwordBits, type PasswordOptions } from '../lib/toolkit';
import { ToolPage } from '../components/ToolPage';
import { Button, RangeSlider } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'Password generator',
    desc: 'Generate strong random passwords in your browser. Nothing is sent anywhere.',
    length: 'Length',
    lower: 'a-z',
    upper: 'A-Z',
    digits: '0-9',
    symbols: 'Symbols',
    regenerate: 'Regenerate',
    copy: 'Copy',
    copied: 'Copied',
    strength: (bits: number) => `≈ ${bits} bits of entropy`,
  },
  'zh-TW': {
    title: '密碼產生器',
    desc: '在瀏覽器中產生高強度隨機密碼，不會傳送到任何地方。',
    length: '長度',
    lower: 'a-z',
    upper: 'A-Z',
    digits: '0-9',
    symbols: '符號',
    regenerate: '重新產生',
    copy: '複製',
    copied: '已複製',
    strength: (bits: number) => `約 ${bits} 位元熵`,
  },
};

export default function PasswordTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [opts, setOpts] = useState<PasswordOptions>({
    length: 16,
    lower: true,
    upper: true,
    digits: true,
    symbols: true,
  });
  const [pw, setPw] = useState('');
  const [copied, setCopied] = useState(false);

  const gen = (): void => setPw(randomPassword(opts));
  useEffect(gen, [opts]);

  const toggle = (k: keyof PasswordOptions): void =>
    setOpts((o) => ({ ...o, [k]: !o[k as 'lower'] }));

  const copy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(pw);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* ignore */
    }
  };

  return (
    <ToolPage
      title={t.title}
      description={t.desc}
      onBack={onBack}
      backLabel={backLabel}
      offlineLabel={offlineLabel}
    >
      <div className="tool__result" style={{ borderTop: 'none', paddingTop: 0 }}>
        <code className="tool__row-value tool__row-value--mono" style={{ fontSize: '1.15rem' }}>
          {pw || '—'}
        </code>
        <div className="tool__actions">
          <Button variant="primary" onClick={gen}>
            {t.regenerate}
          </Button>
          <Button variant="ghost" onClick={copy}>
            {copied ? t.copied : t.copy}
          </Button>
          <span className="tool__hint">{t.strength(passwordBits(opts))}</span>
        </div>
      </div>

      <label className="tool__field">
        <span>
          {t.length}: {opts.length}
        </span>
        <RangeSlider
          min={4}
          max={64}
          value={opts.length}
          onChange={(e) => setOpts((o) => ({ ...o, length: Number(e.target.value) }))}
        />
      </label>
      <div className="tool__checks">
        {(['lower', 'upper', 'digits', 'symbols'] as const).map((k) => (
          <label key={k} className="tool__check">
            <input type="checkbox" checked={opts[k]} onChange={() => toggle(k)} />
            {t[k]}
          </label>
        ))}
      </div>
    </ToolPage>
  );
}
