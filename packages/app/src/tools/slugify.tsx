import { useState } from 'react';
import { slugify } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { TextArea, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'Slugify',
    desc: 'Turn a title or phrase into a URL-safe slug on your device.',
    input: 'Text',
    output: 'Slug',
    placeholder: 'My Blog Post Title',
    copy: 'Copy',
    copied: 'Copied',
  },
  'zh-TW': {
    title: 'Slug 產生器',
    desc: '將標題或片語轉為 URL 安全的 slug，於裝置上處理。',
    input: '文字',
    output: 'Slug',
    placeholder: '我的部落格文章標題',
    copy: '複製',
    copied: '已複製',
  },
};

export default function SlugifyTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [input, setInput] = useState('My Blog Post Title');
  const [copied, setCopied] = useState(false);
  const output = input ? slugify(input) : '';

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
      <label className="tool__field">
        <span>{t.input}</span>
        <TextArea rows={3} value={input} placeholder={t.placeholder} onChange={(e) => setInput(e.target.value)} />
      </label>
      {output ? (
        <div className="tool__result">
          <label className="tool__field">
            <span>{t.output}</span>
            <TextArea mono rows={2} value={output} readOnly />
          </label>
          <Button variant="ghost" onClick={copy}>
            {copied ? t.copied : t.copy}
          </Button>
        </div>
      ) : null}
    </ToolPage>
  );
}
