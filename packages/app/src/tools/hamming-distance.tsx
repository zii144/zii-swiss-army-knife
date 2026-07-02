import { useState } from 'react';
import { hammingDistance } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'Hamming distance', desc: 'Count differing characters in two equal-length strings.', a: 'String A', b: 'String B', result: (n: number) => `Distance: ${n}`, error: 'Strings must be the same length' },
  'zh-TW': { title: '漢明距離', desc: '計算兩個等長字串中不同字元的數量。', a: '字串 A', b: '字串 B', result: (n: number) => `距離：${n}`, error: '字串長度必須相同' },
};

export default function HammingDistanceTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [a, setA] = useState('karolin');
  const [b, setB] = useState('kathrin');
  let distance: number | null = null;
  let error: string | null = null;
  try {
    distance = hammingDistance(a, b);
  } catch {
    error = t.error;
  }

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.a}</span><TextField value={a} onChange={(e) => setA(e.target.value)} /></label>
      <label className="tool__field"><span>{t.b}</span><TextField value={b} onChange={(e) => setB(e.target.value)} /></label>
      {error ? <p className="tool__error">{error}</p> : distance !== null ? <p className="tool__hint"><strong>{t.result(distance)}</strong></p> : null}
    </ToolPage>
  );
}
