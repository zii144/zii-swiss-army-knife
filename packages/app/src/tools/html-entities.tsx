import { useState } from 'react';
import { htmlEscape, htmlUnescape } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { Select, TextArea, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

type Mode = 'encode' | 'decode';

const L = {
  en: {
    title: 'HTML entities',
    desc: 'Escape text to HTML entities (&amp;, &lt;…) or decode them back. On-device.',
    mode: 'Mode',
    encode: 'Encode',
    decode: 'Decode',
    input: 'Input',
    output: 'Output',
    placeholder: '<a href="x">Tom & Jerry</a>',
    copy: 'Copy',
    copied: 'Copied',
  },
  'zh-TW': {
    title: 'HTML 實體',
    desc: '將文字轉為 HTML 實體（&amp;、&lt;…）或解碼還原，於裝置上處理。',
    mode: '模式',
    encode: '編碼',
    decode: '解碼',
    input: '輸入',
    output: '輸出',
    placeholder: '<a href="x">Tom & Jerry</a>',
    copy: '複製',
    copied: '已複製',
  },
};

export default function HtmlEntitiesTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const output = input ? (mode === 'encode' ? htmlEscape(input) : htmlUnescape(input)) : '';

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
        <TextArea mono rows={5} value={input} placeholder={t.placeholder} onChange={(e) => setInput(e.target.value)} />
      </label>
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
