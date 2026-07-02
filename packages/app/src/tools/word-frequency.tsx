import { useState } from 'react';
import { wordFrequency } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { Button, TextArea } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'Word frequency', desc: 'Count how often each word appears in text on your device.', input: 'Text', count: 'Count', word: 'Word', times: 'Count' },
  'zh-TW': { title: '詞頻統計', desc: '統計文字中各詞出現次數，於裝置上處理。', input: '文字', count: '統計', word: '詞', times: '次數' },
};

export default function WordFrequencyTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [input, setInput] = useState('the quick brown fox jumps over the lazy dog');
  const [rows, setRows] = useState<{ word: string; count: number }[]>([]);

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.input}</span><TextArea rows={8} value={input} onChange={(e) => setInput(e.target.value)} /></label>
      <div className="tool__actions"><Button variant="primary" onClick={() => setRows(wordFrequency(input))}>{t.count}</Button></div>
      {rows.length > 0 ? (
        <div className="tool__rows">
          {rows.map((r) => (
            <div key={r.word} className="tool__row">
              <span className="tool__row-label">{r.word}</span>
              <span className="tool__row-value">{r.count}</span>
            </div>
          ))}
        </div>
      ) : null}
    </ToolPage>
  );
}
