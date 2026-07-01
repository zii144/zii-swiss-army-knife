import { useState } from 'react';
import { evalExpression } from '../lib/toolkit';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const KEYS = [
  '7', '8', '9', '/', '(',
  '4', '5', '6', '*', ')',
  '1', '2', '3', '-', '^',
  '0', '.', 'pi', '+', '%',
];
const FUNCS = ['sin(', 'cos(', 'tan(', 'sqrt(', 'ln(', 'log(', 'exp(', 'abs('];

const L = {
  en: {
    title: 'Scientific calculator',
    desc: 'Evaluate math expressions with functions and constants. Radians. Runs on-device.',
    input: 'Expression',
    result: 'Result',
    clear: 'Clear',
    del: 'Del',
  },
  'zh-TW': {
    title: '科學計算機',
    desc: '計算含函數與常數的數學式（弧度），於裝置上運算。',
    input: '算式',
    result: '結果',
    clear: '清除',
    del: '刪除',
  },
};

export default function ScientificTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [expr, setExpr] = useState('2 * (3 + 4)');

  let result = '';
  let error = false;
  try {
    result = expr.trim() ? String(evalExpression(expr)) : '';
  } catch {
    error = true;
  }

  const push = (s: string): void => setExpr((e) => e + s);

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
        <TextField type="text" value={expr} onChange={(e) => setExpr(e.target.value)} />
      </label>
      <div className="tool__result" style={{ borderTop: 'none', paddingTop: 0 }}>
        <p>
          {t.result}:{' '}
          <strong style={{ fontSize: '1.3rem' }}>{error ? '—' : result || '—'}</strong>
        </p>
      </div>

      <div className="tool__checks">
        {FUNCS.map((f) => (
          <button key={f} type="button" className="ui-btn ui-btn--ghost" onClick={() => push(f)}>
            <code>{f}</code>
          </button>
        ))}
      </div>
      <div className="calc-keys">
        {KEYS.map((k) => (
          <button key={k} type="button" className="calc-key" onClick={() => push(k === 'pi' ? 'pi' : k)}>
            {k === 'pi' ? 'π' : k}
          </button>
        ))}
        <button type="button" className="calc-key" onClick={() => setExpr((e) => e.slice(0, -1))}>
          {t.del}
        </button>
        <button type="button" className="calc-key" onClick={() => setExpr('')}>
          {t.clear}
        </button>
      </div>
    </ToolPage>
  );
}
