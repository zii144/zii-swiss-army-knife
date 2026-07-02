import { useState } from 'react';
import { levenshtein } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'Levenshtein distance', desc: 'Count the minimum single-character edits between two strings.', a: 'String A', b: 'String B', result: (n: number) => `Edit distance: ${n}` },
  'zh-TW': { title: '編輯距離', desc: '計算兩字串之間的最少單字元編輯次數。', a: '字串 A', b: '字串 B', result: (n: number) => `編輯距離：${n}` },
};

export default function LevenshteinTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [a, setA] = useState('kitten');
  const [b, setB] = useState('sitting');
  const distance = levenshtein(a, b);

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.a}</span><TextField value={a} onChange={(e) => setA(e.target.value)} /></label>
      <label className="tool__field"><span>{t.b}</span><TextField value={b} onChange={(e) => setB(e.target.value)} /></label>
      <p className="tool__hint"><strong>{t.result(distance)}</strong></p>
    </ToolPage>
  );
}
