import { useState } from 'react';
import { urlEncode, urlDecode } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { Select, TextArea, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

type Mode = 'encode' | 'decode';

const L = {
  en: {
    title: 'URL encode / decode',
    desc: 'Percent-encode text so it is safe in a URL, or decode it back. On-device.',
    mode: 'Mode',
    encode: 'Encode',
    decode: 'Decode',
    input: 'Input',
    output: 'Output',
    copy: 'Copy',
    copied: 'Copied',
    placeholder: 'name=John Doe&city=Taipei',
  },
  'zh-TW': {
    title: 'URL 編碼／解碼',
    desc: '將文字進行網址百分比編碼或解碼還原，於裝置上處理。',
    mode: '模式',
    encode: '編碼',
    decode: '解碼',
    input: '輸入',
    output: '輸出',
    copy: '複製',
    copied: '已複製',
    placeholder: 'name=John Doe&city=Taipei',
  },
};

export default function UrlEncodeTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  let output = '';
  let error: string | null = null;
  try {
    output = input ? (mode === 'encode' ? urlEncode(input) : urlDecode(input)) : '';
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  const copy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* ignore */
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
          options={[
            { value: 'encode', label: t.encode },
            { value: 'decode', label: t.decode },
          ]}
          onChange={(v) => setMode(v as Mode)}
          ariaLabel={t.mode}
        />
      </div>
      <label className="tool__field">
        <span>{t.input}</span>
        <TextArea
          mono
          rows={5}
          value={input}
          placeholder={t.placeholder}
          onChange={(e) => setInput(e.target.value)}
        />
      </label>
      {error ? <p className="tool__error">{error}</p> : null}
      {output ? (
        <div className="tool__result">
          <label className="tool__field">
            <span>{t.output}</span>
            <TextArea mono rows={5} value={output} readOnly />
          </label>
          <Button variant="ghost" onClick={copy}>
            {copied ? t.copied : t.copy}
          </Button>
        </div>
      ) : null}
    </ToolPage>
  );
}
