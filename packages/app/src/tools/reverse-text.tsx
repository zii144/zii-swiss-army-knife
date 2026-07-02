import { useState } from 'react';
import { reverseText } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { Button, Select, TextArea } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'Reverse text',
    desc: 'Reverse characters or flip line order on your device.',
    input: 'Text',
    mode: 'Mode',
    chars: 'Reverse characters',
    lines: 'Reverse line order',
    reverse: 'Reverse',
    output: 'Result',
    copy: 'Copy',
    copied: 'Copied',
  },
  'zh-TW': {
    title: '反轉文字',
    desc: '反轉字元或行順序，於裝置上處理。',
    input: '文字',
    mode: '模式',
    chars: '反轉字元',
    lines: '反轉行序',
    reverse: '反轉',
    output: '結果',
    copy: '複製',
    copied: '已複製',
  },
};

export default function ReverseTextTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [input, setInput] = useState('Hello\nWorld');
  const [byLine, setByLine] = useState(false);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const run = (): void => setOutput(reverseText(input, byLine));

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
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <div className="tool__field">
        <span>{t.mode}</span>
        <Select
          value={byLine ? 'lines' : 'chars'}
          options={[
            { value: 'chars', label: t.chars },
            { value: 'lines', label: t.lines },
          ]}
          onChange={(v) => setByLine(v === 'lines')}
          ariaLabel={t.mode}
        />
      </div>
      <label className="tool__field">
        <span>{t.input}</span>
        <TextArea rows={5} value={input} onChange={(e) => setInput(e.target.value)} />
      </label>
      <div className="tool__actions">
        <Button variant="primary" onClick={run}>
          {t.reverse}
        </Button>
      </div>
      {output ? (
        <div className="tool__result">
          <TextArea rows={5} value={output} readOnly />
          <Button variant="ghost" onClick={copy}>
            {copied ? t.copied : t.copy}
          </Button>
        </div>
      ) : null}
    </ToolPage>
  );
}
