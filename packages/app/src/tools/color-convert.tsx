import { useState } from 'react';
import { parseColor, rgbToHex, rgbToHsl } from '../lib/toolkit';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'Color converter',
    desc: 'Convert a color between HEX, RGB and HSL. On-device.',
    input: 'Color',
    placeholder: '#3b82f6, rgb(59,130,246)…',
    invalid: "Couldn't parse that color.",
  },
  'zh-TW': {
    title: '色彩轉換',
    desc: '在 HEX、RGB、HSL 之間轉換色彩，於裝置上運算。',
    input: '色彩',
    placeholder: '#3b82f6、rgb(59,130,246)…',
    invalid: '無法解析此色彩。',
  },
};

export default function ColorConvertTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [input, setInput] = useState('#3b82f6');
  const rgb = parseColor(input);

  const row = (label: string, value: string) => (
    <div className="tool__row">
      <span className="tool__row-label">{label}</span>
      <code className="tool__row-value tool__row-value--mono">{value}</code>
    </div>
  );

  return (
    <ToolPage
      title={t.title}
      description={t.desc}
      onBack={onBack}
      backLabel={backLabel}
      offlineLabel={offlineLabel}
    >
      <label className="tool__field">
        <span>{t.input}</span>
        <TextField type="text" value={input} onChange={(e) => setInput(e.target.value)} />
      </label>
      {rgb ? (
        <div className="tool__result">
          <span
            aria-hidden="true"
            style={{
              display: 'inline-block',
              width: '3rem',
              height: '3rem',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              background: rgbToHex(rgb),
            }}
          />
          <div className="tool__rows" style={{ width: '100%' }}>
            {row('HEX', rgbToHex(rgb))}
            {row('RGB', `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
            {(() => {
              const { h, s, l } = rgbToHsl(rgb);
              return row('HSL', `hsl(${h}, ${s}%, ${l}%)`);
            })()}
          </div>
        </div>
      ) : (
        <p className="tool__hint">{t.invalid}</p>
      )}
    </ToolPage>
  );
}
