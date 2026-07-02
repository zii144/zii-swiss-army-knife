import { useState } from 'react';
import { shuffleLines } from '@zii/text';
import { ToolPage, DownloadButton } from '../components/ToolPage';
import { Button, TextArea } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'Shuffle lines', desc: 'Randomly shuffle the order of lines on your device.', input: 'Text', shuffle: 'Shuffle', download: 'Download .txt' },
  'zh-TW': { title: '隨機打亂行', desc: '在裝置上隨機打亂各行順序。', input: '文字', shuffle: '打亂', download: '下載 .txt' },
};

export default function ShuffleLinesTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [input, setInput] = useState('Alice\nBob\nCarol\nDave');
  const [output, setOutput] = useState('');

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.input}</span><TextArea mono rows={8} value={input} onChange={(e) => setInput(e.target.value)} /></label>
      <div className="tool__actions"><Button variant="primary" onClick={() => setOutput(shuffleLines(input))}>{t.shuffle}</Button></div>
      {output ? (
        <div className="tool__result">
          <TextArea mono rows={8} value={output} readOnly />
          <DownloadButton bytes={new TextEncoder().encode(output)} filename="shuffled.txt" mime="text/plain" label={t.download} />
        </div>
      ) : null}
    </ToolPage>
  );
}
