import { useState } from 'react';
import { toHalfWidth, toFullWidth, nfkcNormalize } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { Select, TextArea, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

type Mode = 'half' | 'full' | 'nfkc';

const FNS: Record<Mode, (s: string) => string> = {
  half: toHalfWidth,
  full: toFullWidth,
  nfkc: nfkcNormalize,
};

const L = {
  en: {
    title: 'Full / half-width',
    desc: 'Convert between full-width (ＡＢＣ１２３) and half-width (ABC123) characters, or normalize with NFKC.',
    mode: 'Mode',
    half: 'To half-width',
    full: 'To full-width',
    nfkc: 'NFKC normalize',
    input: 'Input',
    output: 'Output',
    copy: 'Copy',
    copied: 'Copied',
    placeholder: 'Ｈｅｌｌｏ　Ｗｏｒｌｄ１２３',
  },
  'zh-TW': {
    title: '全形／半形轉換',
    desc: '在全形（ＡＢＣ１２３）與半形（ABC123）字元之間轉換，或以 NFKC 正規化。',
    mode: '模式',
    half: '轉半形',
    full: '轉全形',
    nfkc: 'NFKC 正規化',
    input: '輸入',
    output: '輸出',
    copy: '複製',
    copied: '已複製',
    placeholder: 'Ｈｅｌｌｏ　Ｗｏｒｌｄ１２３',
  },
};

export default function FullwidthTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [mode, setMode] = useState<Mode>('half');
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
            { value: 'half', label: t.half },
            { value: 'full', label: t.full },
            { value: 'nfkc', label: t.nfkc },
          ]}
          onChange={(v) => setMode(v as Mode)}
          ariaLabel={t.mode}
        />
      </div>
      <label className="tool__field">
        <span>{t.input}</span>
        <TextArea
          rows={5}
          value={input}
          placeholder={t.placeholder}
          onChange={(e) => setInput(e.target.value)}
        />
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
