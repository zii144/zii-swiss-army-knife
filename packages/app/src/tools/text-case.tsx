import { useState } from 'react';
import {
  toCamelCase,
  toSnakeCase,
  toKebabCase,
  toTitleCase,
  toSentenceCase,
  toUpperCase,
  toLowerCase,
} from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import type { ToolViewProps } from './types';
import { tr } from './types';

type CaseKey =
  | 'camel'
  | 'snake'
  | 'kebab'
  | 'title'
  | 'sentence'
  | 'upper'
  | 'lower';

const FNS: Record<CaseKey, (s: string) => string> = {
  camel: toCamelCase,
  snake: toSnakeCase,
  kebab: toKebabCase,
  title: toTitleCase,
  sentence: toSentenceCase,
  upper: toUpperCase,
  lower: toLowerCase,
};

const L = {
  en: {
    title: 'Case converter',
    desc: 'Transform text between camelCase, snake_case, kebab-case, Title, Sentence, UPPER and lower.',
    input: 'Text',
    placeholder: 'Type or paste text…',
    copy: 'Copy',
    copied: 'Copied',
    labels: {
      camel: 'camelCase',
      snake: 'snake_case',
      kebab: 'kebab-case',
      title: 'Title Case',
      sentence: 'Sentence case',
      upper: 'UPPERCASE',
      lower: 'lowercase',
    } as Record<CaseKey, string>,
  },
  'zh-TW': {
    title: '大小寫轉換',
    desc: '在 camelCase、snake_case、kebab-case、標題、句首、全大寫與全小寫之間轉換。',
    input: '文字',
    placeholder: '輸入或貼上文字…',
    copy: '複製',
    copied: '已複製',
    labels: {
      camel: 'camelCase',
      snake: 'snake_case',
      kebab: 'kebab-case',
      title: '標題 Title',
      sentence: '句首 Sentence',
      upper: '全大寫',
      lower: '全小寫',
    } as Record<CaseKey, string>,
  },
};

const ORDER: CaseKey[] = ['camel', 'snake', 'kebab', 'title', 'sentence', 'upper', 'lower'];

export default function TextCaseTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [text, setText] = useState('hello world example');
  const [copied, setCopied] = useState<CaseKey | null>(null);

  const copy = async (key: CaseKey, value: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(null), 1200);
    } catch {
      /* clipboard unavailable — ignore */
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
      <label className="tool__field">
        <span>{t.input}</span>
        <textarea
          rows={4}
          value={text}
          placeholder={t.placeholder}
          onChange={(e) => setText(e.target.value)}
        />
      </label>
      <div className="tool__rows">
        {ORDER.map((key) => {
          const out = FNS[key](text);
          return (
            <div key={key} className="tool__row">
              <span className="tool__row-label">{t.labels[key]}</span>
              <code className="tool__row-value">{out}</code>
              <button type="button" className="tool__ghost" onClick={() => copy(key, out)}>
                {copied === key ? t.copied : t.copy}
              </button>
            </div>
          );
        })}
      </div>
    </ToolPage>
  );
}
