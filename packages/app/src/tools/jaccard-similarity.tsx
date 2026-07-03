import { useState } from 'react';
import { jaccardSimilarity } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { TextArea } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'Jaccard similarity', desc: 'Compare word overlap between two texts (0–100%).', a: 'Text A', b: 'Text B', result: (n: number) => `Similarity: ${n.toFixed(1)}%` },
  'zh-TW': { title: 'Jaccard 相似度', desc: '比較兩段文字的詞彙重疊（0–100%）。', a: '文字 A', b: '文字 B', result: (n: number) => `相似度：${n.toFixed(1)}%` },
};

export default function JaccardSimilarityTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [a, setA] = useState('the quick brown fox');
  const [b, setB] = useState('the slow brown dog');
  const score = jaccardSimilarity(a, b) * 100;

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.a}</span><TextArea rows={3} value={a} onChange={(e) => setA(e.target.value)} /></label>
      <label className="tool__field"><span>{t.b}</span><TextArea rows={3} value={b} onChange={(e) => setB(e.target.value)} /></label>
      <p className="tool__hint"><strong>{t.result(score)}</strong></p>
    </ToolPage>
  );
}
