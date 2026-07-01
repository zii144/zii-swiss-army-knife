import { useState } from 'react';
import { toSimplified, toTraditional, toTraditionalTaiwan } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { Select, TextArea, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

type Mode = 'simp' | 'trad' | 'tw';

const FNS: Record<Mode, (s: string) => string> = {
  simp: toSimplified,
  trad: toTraditional,
  tw: toTraditionalTaiwan,
};

const L = {
  en: {
    title: 'Chinese converter',
    desc: 'Convert between Simplified and Traditional Chinese (with Taiwan idioms). On-device via OpenCC.',
    mode: 'Convert to',
    simp: 'Simplified (简体)',
    trad: 'Traditional (繁體)',
    tw: 'Traditional — Taiwan',
    input: 'Input',
    output: 'Output',
    placeholder: '输入或贴上中文…',
    copy: 'Copy',
    copied: 'Copied',
  },
  'zh-TW': {
    title: '繁簡轉換',
    desc: '在簡體與繁體中文之間轉換（含台灣用語），透過 OpenCC 於裝置上處理。',
    mode: '轉換為',
    simp: '簡體（简体）',
    trad: '繁體',
    tw: '繁體（台灣用語）',
    input: '輸入',
    output: '輸出',
    placeholder: '輸入或貼上中文…',
    copy: '複製',
    copied: '已複製',
  },
};

export default function CjkConvertTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [mode, setMode] = useState<Mode>('tw');
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const output = input ? FNS[mode](input) : '';

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
            { value: 'simp', label: t.simp },
            { value: 'trad', label: t.trad },
            { value: 'tw', label: t.tw },
          ]}
          onChange={(v) => setMode(v as Mode)}
          ariaLabel={t.mode}
        />
      </div>
      <label className="tool__field">
        <span>{t.input}</span>
        <TextArea rows={5} value={input} placeholder={t.placeholder} onChange={(e) => setInput(e.target.value)} />
      </label>
      {output ? (
        <div className="tool__result">
          <label className="tool__field">
            <span>{t.output}</span>
            <TextArea rows={5} value={output} readOnly />
          </label>
          <Button variant="ghost" onClick={copy}>
            {copied ? t.copied : t.copy}
          </Button>
        </div>
      ) : null}
    </ToolPage>
  );
}
