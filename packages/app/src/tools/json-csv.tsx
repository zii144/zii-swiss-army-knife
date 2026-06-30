import { useState } from 'react';
import { jsonToCsv, csvToJson, prettyJson } from '@zii/text';
import { ToolPage, DownloadButton } from '../components/ToolPage';
import type { ToolViewProps } from './types';
import { tr } from './types';

type Dir = 'json2csv' | 'csv2json';

const SAMPLE = '[\n  { "name": "Ann", "age": 30 },\n  { "name": "Bo", "age": 25 }\n]';

const L = {
  en: {
    title: 'JSON ↔ CSV',
    desc: 'Convert an array of JSON objects to CSV and back, on your device.',
    direction: 'Direction',
    j2c: 'JSON → CSV',
    c2j: 'CSV → JSON',
    input: 'Input',
    output: 'Output',
    convert: 'Convert',
    download: 'Download result',
    needArray: 'JSON input must be an array of objects.',
  },
  'zh-TW': {
    title: 'JSON ↔ CSV',
    desc: '在裝置上將 JSON 物件陣列與 CSV 互相轉換。',
    direction: '方向',
    j2c: 'JSON → CSV',
    c2j: 'CSV → JSON',
    input: '輸入',
    output: '輸出',
    convert: '轉換',
    download: '下載結果',
    needArray: 'JSON 輸入必須是物件陣列。',
  },
};

export default function JsonCsvTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [dir, setDir] = useState<Dir>('json2csv');
  const [input, setInput] = useState(SAMPLE);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const run = (): void => {
    setError(null);
    setOutput('');
    try {
      if (dir === 'json2csv') {
        const parsed = JSON.parse(input);
        if (!Array.isArray(parsed)) throw new Error(t.needArray);
        setOutput(jsonToCsv(parsed as Record<string, unknown>[]));
      } else {
        setOutput(prettyJson(csvToJson(input)));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const outName = dir === 'json2csv' ? 'data.csv' : 'data.json';
  const outMime = dir === 'json2csv' ? 'text/csv' : 'application/json';

  return (
    <ToolPage
      title={t.title}
      description={t.desc}
      onBack={onBack}
      backLabel={backLabel}
      offlineLabel={offlineLabel}
    >
      <label className="tool__field">
        <span>{t.direction}</span>
        <select
          value={dir}
          onChange={(e) => {
            setDir(e.target.value as Dir);
            setOutput('');
            setError(null);
          }}
        >
          <option value="json2csv">{t.j2c}</option>
          <option value="csv2json">{t.c2j}</option>
        </select>
      </label>
      <label className="tool__field">
        <span>{t.input}</span>
        <textarea rows={8} value={input} onChange={(e) => setInput(e.target.value)} />
      </label>
      <div className="tool__actions">
        <button type="button" className="tool__primary" onClick={run}>
          {t.convert}
        </button>
      </div>

      {error ? <p className="tool__error">{error}</p> : null}
      {output ? (
        <div className="tool__result">
          <label className="tool__field">
            <span>{t.output}</span>
            <textarea rows={8} value={output} readOnly />
          </label>
          <DownloadButton
            bytes={new TextEncoder().encode(output)}
            filename={outName}
            mime={outMime}
            label={t.download}
          />
        </div>
      ) : null}
    </ToolPage>
  );
}
