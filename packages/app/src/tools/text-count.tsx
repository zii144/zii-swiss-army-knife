import { useState } from 'react';
import { countText } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'Character & word count',
    desc: 'Live character, word and line counts with a CJK-aware script breakdown.',
    input: 'Text',
    placeholder: 'Type or paste text…',
    chars: 'Characters',
    noSpaces: 'No spaces',
    words: 'Words',
    lines: 'Lines',
    han: 'Han 漢',
    kana: 'Kana かな',
    latin: 'Latin',
    digit: 'Digits',
  },
  'zh-TW': {
    title: '字數統計',
    desc: '即時統計字元、字詞與行數，並依文字系統分類（含中日文）。',
    input: '文字',
    placeholder: '輸入或貼上文字…',
    chars: '字元',
    noSpaces: '不含空白',
    words: '字詞',
    lines: '行數',
    han: '漢字',
    kana: '假名',
    latin: '拉丁',
    digit: '數字',
  },
};

export default function TextCountTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [text, setText] = useState('');
  const c = countText(text);

  const stat = (label: string, value: number) => (
    <div className="tool__stat">
      <span className="tool__stat-value">{value.toLocaleString()}</span>
      <span className="tool__stat-label">{label}</span>
    </div>
  );

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
          rows={8}
          value={text}
          placeholder={t.placeholder}
          onChange={(e) => setText(e.target.value)}
        />
      </label>
      <div className="tool__stats">
        {stat(t.chars, c.chars)}
        {stat(t.noSpaces, c.charsNoSpaces)}
        {stat(t.words, c.words)}
        {stat(t.lines, c.lines)}
        {stat(t.han, c.byScript.han)}
        {stat(t.kana, c.byScript.hiragana + c.byScript.katakana)}
        {stat(t.latin, c.byScript.latin)}
        {stat(t.digit, c.byScript.digit)}
      </div>
    </ToolPage>
  );
}
