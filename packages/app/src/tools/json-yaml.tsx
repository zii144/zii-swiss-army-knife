import { useState } from 'react';
import { jsonStringToYaml, yamlToJsonString } from '@zii/text';
import { ToolPage, DownloadButton } from '../components/ToolPage';
import { Select, TextArea, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

type Dir = 'json2yaml' | 'yaml2json';

const SAMPLE = '{\n  "name": "Zii",\n  "tools": ["pdf", "image"],\n  "offline": true\n}';

const L = {
  en: {
    title: 'JSON ↔ YAML',
    desc: 'Convert configuration between JSON and YAML, on your device.',
    direction: 'Direction',
    j2y: 'JSON → YAML',
    y2j: 'YAML → JSON',
    input: 'Input',
    output: 'Output',
    convert: 'Convert',
    download: 'Download result',
  },
  'zh-TW': {
    title: 'JSON ↔ YAML',
    desc: '在裝置上於 JSON 與 YAML 之間轉換設定。',
    direction: '方向',
    j2y: 'JSON → YAML',
    y2j: 'YAML → JSON',
    input: '輸入',
    output: '輸出',
    convert: '轉換',
    download: '下載結果',
  },
};

export default function JsonYamlTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [dir, setDir] = useState<Dir>('json2yaml');
  const [input, setInput] = useState(SAMPLE);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const run = (): void => {
    setError(null);
    setOutput('');
    try {
      setOutput(dir === 'json2yaml' ? jsonStringToYaml(input) : yamlToJsonString(input));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const outName = dir === 'json2yaml' ? 'data.yaml' : 'data.json';
  const outMime = dir === 'json2yaml' ? 'text/yaml' : 'application/json';

  return (
    <ToolPage
      title={t.title}
      description={t.desc}
      onBack={onBack}
      backLabel={backLabel}
      offlineLabel={offlineLabel}
    >
      <div className="tool__field">
        <span>{t.direction}</span>
        <Select
          value={dir}
          options={[
            { value: 'json2yaml', label: t.j2y },
            { value: 'yaml2json', label: t.y2j },
          ]}
          onChange={(v) => {
            setDir(v as Dir);
            setOutput('');
            setError(null);
          }}
          ariaLabel={t.direction}
        />
      </div>
      <label className="tool__field">
        <span>{t.input}</span>
        <TextArea mono rows={8} value={input} onChange={(e) => setInput(e.target.value)} />
      </label>
      <div className="tool__actions">
        <Button variant="primary" onClick={run}>
          {t.convert}
        </Button>
      </div>
      {error ? <p className="tool__error">{error}</p> : null}
      {output ? (
        <div className="tool__result">
          <label className="tool__field">
            <span>{t.output}</span>
            <TextArea mono rows={8} value={output} readOnly />
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
