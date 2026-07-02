import { useState } from 'react';
import { normalizeText } from '@zii/text';
import { ToolPage, DownloadButton } from '../components/ToolPage';
import { Button, TextArea } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const SAMPLE = '  hello   \n\n\n\n  world  \n  ';

const L = {
  en: {
    title: 'Clean up text',
    desc: 'Trim lines, collapse extra blank lines, and tidy whitespace on your device.',
    input: 'Text',
    clean: 'Clean',
    output: 'Result',
    download: 'Download .txt',
  },
  'zh-TW': {
    title: '文字整理',
    desc: '修剪行首尾空白、合併多餘空行，於裝置上處理。',
    input: '文字',
    clean: '整理',
    output: '結果',
    download: '下載 .txt',
  },
};

export default function TextNormalizeTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [input, setInput] = useState(SAMPLE);
  const [output, setOutput] = useState('');

  const run = (): void => setOutput(normalizeText(input));

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field">
        <span>{t.input}</span>
        <TextArea rows={8} value={input} onChange={(e) => setInput(e.target.value)} />
      </label>
      <div className="tool__actions">
        <Button variant="primary" onClick={run}>
          {t.clean}
        </Button>
      </div>
      {output ? (
        <div className="tool__result">
          <TextArea rows={8} value={output} readOnly />
          <DownloadButton bytes={new TextEncoder().encode(output)} filename="clean.txt" mime="text/plain" label={t.download} />
        </div>
      ) : null}
    </ToolPage>
  );
}
