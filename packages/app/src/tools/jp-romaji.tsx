import { useState } from 'react';
import { kanaToRomaji } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { TextArea, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'Kana → romaji',
    desc: 'Convert Japanese hiragana/katakana to Hepburn rōmaji. On-device — romanizes kana (not kanji).',
    input: 'Kana',
    output: 'Rōmaji',
    placeholder: 'ひらがな・カタカナを入力…',
    copy: 'Copy',
    copied: 'Copied',
  },
  ja: {
    title: 'かな → ローマ字',
    desc: 'ひらがな・カタカナをヘボン式ローマ字に変換します。端末内で処理（かなのみ、漢字は非対応）。',
    input: 'かな',
    output: 'ローマ字',
    placeholder: 'ひらがな・カタカナを入力…',
    copy: 'コピー',
    copied: 'コピーしました',
  },
  'zh-TW': {
    title: '假名轉羅馬字',
    desc: '將日文平假名／片假名轉為赫本式羅馬字。於裝置上運算（僅假名，不含漢字）。',
    input: '假名',
    output: '羅馬字',
    placeholder: '輸入平假名或片假名…',
    copy: '複製',
    copied: '已複製',
  },
};

export default function JpRomajiTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const output = input ? kanaToRomaji(input) : '';

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
