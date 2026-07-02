import { useState } from 'react';
import { findReplace } from '@zii/text';
import { ToolPage, DownloadButton } from '../components/ToolPage';
import { Button, TextArea, TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'Find and replace',
    desc: 'Replace text literally or with a regular expression on your device.',
    input: 'Text',
    find: 'Find',
    replace: 'Replace with',
    regex: 'Use regex',
    run: 'Replace',
    output: 'Result',
    download: 'Download .txt',
    invalid: 'Invalid pattern',
  },
  'zh-TW': {
    title: '尋找與取代',
    desc: '以字面或正則表達式取代文字，於裝置上處理。',
    input: '文字',
    find: '尋找',
    replace: '取代為',
    regex: '使用正則',
    run: '取代',
    output: '結果',
    download: '下載 .txt',
    invalid: '模式無效',
  },
};

export default function FindReplaceTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [input, setInput] = useState('Hello world\nHello again');
  const [find, setFind] = useState('Hello');
  const [replacement, setReplacement] = useState('Hi');
  const [regex, setRegex] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const run = (): void => {
    setError(null);
    try {
      setOutput(findReplace(input, find, replacement, regex));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.input}</span><TextArea rows={6} value={input} onChange={(e) => setInput(e.target.value)} /></label>
      <label className="tool__field"><span>{t.find}</span><TextField value={find} onChange={(e) => setFind(e.target.value)} /></label>
      <label className="tool__field"><span>{t.replace}</span><TextField value={replacement} onChange={(e) => setReplacement(e.target.value)} /></label>
      <label className="tool__check"><input type="checkbox" checked={regex} onChange={() => setRegex((v) => !v)} />{t.regex}</label>
      <div className="tool__actions"><Button variant="primary" onClick={run}>{t.run}</Button></div>
      {error ? <p className="tool__error">{`${t.invalid}: ${error}`}</p> : null}
      {output ? (
        <div className="tool__result">
          <TextArea mono rows={6} value={output} readOnly />
          <DownloadButton bytes={new TextEncoder().encode(output)} filename="replaced.txt" mime="text/plain" label={t.download} />
        </div>
      ) : null}
    </ToolPage>
  );
}
