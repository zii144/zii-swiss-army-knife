import { useState } from 'react';
import { explainCron } from '../lib/toolkit';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const EXAMPLES = ['0 9 * * 1-5', '*/15 * * * *', '0 0 1 * *', '30 3 * * 0'];

const L = {
  en: {
    title: 'Cron explainer',
    desc: 'Turn a 5-field cron expression into plain language. On-device.',
    input: 'Cron expression',
    meaning: 'Meaning',
    examples: 'Examples',
    fields: 'minute · hour · day-of-month · month · day-of-week',
  },
  'zh-TW': {
    title: 'Cron 說明',
    desc: '將 5 欄位的 cron 表達式轉為白話說明，於裝置上處理。',
    input: 'Cron 表達式',
    meaning: '意義',
    examples: '範例',
    fields: '分 · 時 · 日 · 月 · 星期',
  },
};

export default function CronTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [expr, setExpr] = useState('0 9 * * 1-5');

  let meaning = '';
  let error: string | null = null;
  try {
    meaning = expr.trim() ? explainCron(expr) : '';
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

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
        <span className="tool__hint">{t.fields}</span>
      </label>
      {error ? (
        <p className="tool__error">{error}</p>
      ) : meaning ? (
        <div className="tool__result">
          <p className="tool__hint">{t.meaning}</p>
          <p>
            <strong>{meaning}</strong>
          </p>
        </div>
      ) : null}
      <div className="tool__field">
        <span>{t.examples}</span>
        <div className="tool__checks">
          {EXAMPLES.map((ex) => (
            <button key={ex} type="button" className="ui-btn ui-btn--ghost" onClick={() => setExpr(ex)}>
              <code>{ex}</code>
            </button>
          ))}
        </div>
      </div>
    </ToolPage>
  );
}
