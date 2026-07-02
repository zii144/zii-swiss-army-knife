import { useState } from 'react';
import { dedupeLines } from '@zii/text';
import { ToolPage, DownloadButton } from '../components/ToolPage';
import { Button, TextArea } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const SAMPLE = 'apple\nbanana\napple\ncherry\nbanana';

const L = {
  en: {
    title: 'Remove duplicate lines',
    desc: 'Drop repeated lines from a list while keeping the first occurrence. On your device.',
    input: 'Text (one item per line)',
    dedupe: 'Dedupe',
    output: 'Result',
    download: 'Download .txt',
  },
  'zh-TW': {
    title: '移除重複行',
    desc: '刪除重複的行，保留第一次出現，於裝置上處理。',
    input: '文字（每行一項）',
    dedupe: '去重',
    output: '結果',
    download: '下載 .txt',
  },
};

export default function LineDedupeTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [input, setInput] = useState(SAMPLE);
  const [output, setOutput] = useState('');

  const run = (): void => setOutput(dedupeLines(input));

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field">
        <span>{t.input}</span>
        <TextArea mono rows={8} value={input} onChange={(e) => setInput(e.target.value)} />
      </label>
      <div className="tool__actions">
        <Button variant="primary" onClick={run}>
          {t.dedupe}
        </Button>
      </div>
      {output ? (
        <div className="tool__result">
          <TextArea mono rows={8} value={output} readOnly />
          <DownloadButton bytes={new TextEncoder().encode(output)} filename="deduped.txt" mime="text/plain" label={t.download} />
        </div>
      ) : null}
    </ToolPage>
  );
}
