import { useState } from 'react';
import { charFrequency } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { TextArea, TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'Character frequency', desc: 'Count how often each character appears.', input: 'Text', limit: 'Top N', char: 'Character', times: 'Count' },
  'zh-TW': { title: '字元頻率', desc: '統計各字元出現次數。', input: '文字', limit: '前 N 名', char: '字元', times: '次數' },
};

export default function CharFrequencyTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [input, setInput] = useState('hello world');
  const [limit, setLimit] = useState(20);
  const rows = charFrequency(input, limit);

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.input}</span><TextArea rows={4} value={input} onChange={(e) => setInput(e.target.value)} /></label>
      <label className="tool__field"><span>{t.limit}</span><TextField type="number" min={1} value={limit} onChange={(e) => setLimit(Number(e.target.value))} /></label>
      {rows.length > 0 ? (
        <div className="tool__rows">
          {rows.map((r) => (
            <div key={r.word} className="tool__row">
              <span className="tool__row-label">{JSON.stringify(r.word)}</span>
              <span className="tool__row-value">{r.count}</span>
            </div>
          ))}
        </div>
      ) : null}
    </ToolPage>
  );
}
