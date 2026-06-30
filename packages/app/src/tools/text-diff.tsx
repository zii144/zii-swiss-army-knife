import { useState } from 'react';
import { lineDiff } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { TextArea } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'Text diff',
    desc: 'Compare two blocks of text line by line and highlight what changed. On-device.',
    left: 'Original',
    right: 'Changed',
    result: 'Differences',
    same: 'The two texts are identical.',
    summary: (add: number, rem: number) => `${add} added · ${rem} removed`,
  },
  'zh-TW': {
    title: '文字比對',
    desc: '逐行比較兩段文字並標示差異，於裝置上處理。',
    left: '原始',
    right: '變更後',
    result: '差異',
    same: '兩段文字完全相同。',
    summary: (add: number, rem: number) => `新增 ${add} 行 · 刪除 ${rem} 行`,
  },
};

export default function TextDiffTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');

  const diff = lineDiff(left, right);
  const added = diff.filter((d) => d.type === 'add').length;
  const removed = diff.filter((d) => d.type === 'remove').length;
  const changed = added > 0 || removed > 0;

  const prefix = (type: string): string => (type === 'add' ? '+ ' : type === 'remove' ? '- ' : '  ');

  return (
    <ToolPage
      title={t.title}
      description={t.desc}
      onBack={onBack}
      backLabel={backLabel}
      offlineLabel={offlineLabel}
    >
      <div className="tool__inline">
        <label className="tool__field" style={{ flex: 1 }}>
          <span>{t.left}</span>
          <TextArea mono rows={8} value={left} onChange={(e) => setLeft(e.target.value)} />
        </label>
        <label className="tool__field" style={{ flex: 1 }}>
          <span>{t.right}</span>
          <TextArea mono rows={8} value={right} onChange={(e) => setRight(e.target.value)} />
        </label>
      </div>

      <div className="tool__result">
        <p className="tool__hint">{changed ? t.summary(added, removed) : t.same}</p>
        {changed ? (
          <pre className="diff">
            {diff.map((d, i) => (
              <div key={i} className={`diff__line diff__line--${d.type}`}>
                {prefix(d.type)}
                {d.line}
              </div>
            ))}
          </pre>
        ) : null}
      </div>
    </ToolPage>
  );
}
