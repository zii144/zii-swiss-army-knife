import { useMemo, useState } from 'react';
import { prettyJson, minifyJson } from '@zii/text';
import { ToolPage, DownloadButton } from '../components/ToolPage';
import { Select, TextArea, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const SAMPLE = '{\n  "name": "Zii",\n  "tools": ["pdf", "image"],\n  "offline": true\n}';

type Mode = 'pretty' | 'minify';

const L = {
  en: {
    title: 'JSON formatter',
    desc: 'Validate, pretty-print, or minify JSON on your device.',
    mode: 'Mode',
    pretty: 'Pretty-print',
    minify: 'Minify',
    input: 'JSON input',
    indent: 'Indent',
    spaces: (n: number) => `${n} spaces`,
    format: 'Format',
    output: 'Output',
    download: 'Download .json',
    invalid: 'Invalid JSON',
  },
  'zh-TW': {
    title: 'JSON 格式化',
    desc: '在裝置上驗證、美化或壓縮 JSON。',
    mode: '模式',
    pretty: '美化',
    minify: '壓縮',
    input: 'JSON 輸入',
    indent: '縮排',
    spaces: (n: number) => `${n} 空格`,
    format: '格式化',
    output: '輸出',
    download: '下載 .json',
    invalid: 'JSON 無效',
  },
};

export default function JsonFormatTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [input, setInput] = useState(SAMPLE);
  const [mode, setMode] = useState<Mode>('pretty');
  const [indent, setIndent] = useState(2);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const modeOptions = useMemo(
    () => [
      { value: 'pretty', label: t.pretty },
      { value: 'minify', label: t.minify },
    ],
    [t],
  );

  const indentOptions = useMemo(
    () => [2, 4, 0].map((n) => ({ value: String(n), label: t.spaces(n) })),
    [t],
  );

  const run = (): void => {
    setError(null);
    setOutput('');
    try {
      const parsed: unknown = JSON.parse(input);
      setOutput(mode === 'minify' ? minifyJson(parsed) : prettyJson(parsed, indent));
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
        <span>{t.mode}</span>
        <Select
          value={mode}
          options={modeOptions}
          onChange={(v) => setMode(v as Mode)}
          ariaLabel={t.mode}
        />
      </div>
      {mode === 'pretty' ? (
        <div className="tool__field">
          <span>{t.indent}</span>
          <Select
            value={String(indent)}
            options={indentOptions}
            onChange={(v) => setIndent(Number(v))}
            ariaLabel={t.indent}
          />
        </div>
      ) : null}
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
            filename={mode === 'minify' ? 'minified.json' : 'formatted.json'}
            mime="application/json"
            label={t.download}
          />
        </div>
      ) : null}
    </ToolPage>
  );
}
