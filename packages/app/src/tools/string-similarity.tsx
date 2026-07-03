import { useState } from 'react';
import { levenshteinSimilarity } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'String similarity', desc: 'Levenshtein-based similarity percentage between two strings.', a: 'String A', b: 'String B', result: (n: number) => `Similarity: ${n}%` },
  'zh-TW': { title: '字串相似度', desc: '以 Levenshtein 距離計算兩字串的相似百分比。', a: '字串 A', b: '字串 B', result: (n: number) => `相似度：${n}%` },
};

export default function StringSimilarityTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [a, setA] = useState('kitten');
  const [b, setB] = useState('sitting');
  const score = levenshteinSimilarity(a, b);

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.a}</span><TextField value={a} onChange={(e) => setA(e.target.value)} /></label>
      <label className="tool__field"><span>{t.b}</span><TextField value={b} onChange={(e) => setB(e.target.value)} /></label>
      <p className="tool__hint"><strong>{t.result(score)}</strong></p>
    </ToolPage>
  );
}
