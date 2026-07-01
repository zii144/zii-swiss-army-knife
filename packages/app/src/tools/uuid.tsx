import { useEffect, useState } from 'react';
import { uuidV4 } from '../lib/toolkit';
import { ToolPage } from '../components/ToolPage';
import { Button, RangeSlider } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'UUID generator',
    desc: 'Generate random version-4 UUIDs on your device.',
    count: 'How many',
    regenerate: 'Regenerate',
    copy: 'Copy all',
    copied: 'Copied',
  },
  'zh-TW': {
    title: 'UUID 產生器',
    desc: '在裝置上產生隨機的第 4 版 UUID。',
    count: '數量',
    regenerate: '重新產生',
    copy: '全部複製',
    copied: '已複製',
  },
};

export default function UuidTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [count, setCount] = useState(5);
  const [ids, setIds] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const gen = (): void => setIds(Array.from({ length: count }, () => uuidV4()));
  useEffect(gen, [count]);

  const copy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(ids.join('\n'));
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
        <span>
          {t.count}: {count}
        </span>
        <RangeSlider
          min={1}
          max={50}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
        />
      </label>
      <div className="tool__actions">
        <Button variant="primary" onClick={gen}>
          {t.regenerate}
        </Button>
        <Button variant="ghost" onClick={copy}>
          {copied ? t.copied : t.copy}
        </Button>
      </div>
      <div className="tool__rows">
        {ids.map((id, i) => (
          <div key={i} className="tool__row">
            <code className="tool__row-value tool__row-value--mono">{id}</code>
          </div>
        ))}
      </div>
    </ToolPage>
  );
}
