import { useEffect, useState } from 'react';
import { sha256Hex, sha1Hex } from '@zii/compute';
import { ToolPage } from '../components/ToolPage';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'Hash (SHA-256 / SHA-1)',
    desc: 'Compute SHA-256 and SHA-1 digests of text using the browser crypto engine. Nothing leaves your device.',
    input: 'Text',
    placeholder: 'Type or paste text…',
    copy: 'Copy',
    copied: 'Copied',
  },
  'zh-TW': {
    title: '雜湊（SHA-256 / SHA-1）',
    desc: '使用瀏覽器加密引擎計算文字的 SHA-256 與 SHA-1 雜湊值，資料不離開裝置。',
    input: '文字',
    placeholder: '輸入或貼上文字…',
    copy: '複製',
    copied: '已複製',
  },
};

export default function HashTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [text, setText] = useState('');
  const [sha256, setSha256] = useState('');
  const [sha1, setSha1] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void (async () => {
      const [a, b] = await Promise.all([sha256Hex(text), sha1Hex(text)]);
      if (active) {
        setSha256(a);
        setSha1(b);
      }
    })();
    return () => {
      active = false;
    };
  }, [text]);

  const copy = async (key: string, value: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(null), 1200);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };

  const row = (label: string, value: string) => (
    <div className="tool__row">
      <span className="tool__row-label">{label}</span>
      <code className="tool__row-value tool__row-value--mono">{value}</code>
      <button type="button" className="tool__ghost" onClick={() => copy(label, value)}>
        {copied === label ? t.copied : t.copy}
      </button>
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
          rows={5}
          value={text}
          placeholder={t.placeholder}
          onChange={(e) => setText(e.target.value)}
        />
      </label>
      <div className="tool__rows">
        {row('SHA-256', sha256)}
        {row('SHA-1', sha1)}
      </div>
    </ToolPage>
  );
}
