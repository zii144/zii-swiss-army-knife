import { useMemo, useState } from 'react';
import { prettyJson } from '@zii/text';
import { ToolPage, DownloadButton } from '../components/ToolPage';
import { Select, TextArea, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const SAMPLE = '{\n  "name": "Zii",\n  "tools": ["pdf", "image"],\n  "offline": true\n}';

const L = {
  en: {
    title: 'JSON formatter',
    desc: 'Validate and pretty-print JSON on your device.',
    input: 'JSON input',
    indent: 'Indent',
    spaces: (n: number) => `${n} spaces`,
    format: 'Format',
    output: 'Formatted output',
    download: 'Download .json',
    invalid: 'Invalid JSON',
  },
  'zh-TW': {
    title: 'JSON 格式化',
    desc: '在裝置上驗證並美化 JSON。',
    input: 'JSON 輸入',
    indent: '縮排',
    spaces: (n: number) => `${n} 空格`,
    format: '格式化',
    output: '格式化結果',
    download: '下載 .json',
    invalid: 'JSON 無效',
  },
};

export default function JsonFormatTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [input, setInput] = useState(SAMPLE);
  const [indent, setIndent] = useState(2);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const indentOptions = useMemo(
    () => [2, 4, 0].map((n) => ({ value: String(n), label: t.spaces(n) })),
    [t],
  );

  const run = (): void => {
    setError(null);
    setOutput('');
    try {
      const parsed: unknown = JSON.parse(input);
      setOutput(prettyJson(parsed, indent));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <ToolPage
      title={t.title}
      description={t.desc}
      onBack={onBack}
      backLabel={backLabel}
      offlineLabel={offlineLabel}
    >
      <div className="tool__field">
        <span>{t.indent}</span>
        <Select
          value={String(indent)}
          options={indentOptions}
          onChange={(v) => setIndent(Number(v))}
          ariaLabel={t.indent}
        />
      </div>
      <label className="tool__field">
        <span>{t.input}</span>
        <TextArea mono rows={10} value={input} onChange={(e) => setInput(e.target.value)} />
      </label>
      <div className="tool__actions">
        <Button variant="primary" onClick={run}>
          {t.format}
        </Button>
      </div>
      {error ? <p className="tool__error">{`${t.invalid}: ${error}`}</p> : null}
      {output ? (
        <div className="tool__result">
          <label className="tool__field">
            <span>{t.output}</span>
            <TextArea mono rows={10} value={output} readOnly />
          </label>
          <DownloadButton
            bytes={new TextEncoder().encode(output)}
            filename="formatted.json"
            mime="application/json"
            label={t.download}
          />
        </div>
      ) : null}
    </ToolPage>
  );
}
