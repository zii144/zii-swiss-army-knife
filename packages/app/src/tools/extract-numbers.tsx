import { useState } from 'react';
import { extractNumbers } from '@zii/text';
import { ToolPage } from '../components/ToolPage';
import { TextArea } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: { title: 'Extract numbers', desc: 'Pull integers and decimals from text.', input: 'Text', none: 'No numbers found' },
  'zh-TW': { title: '擷取數字', desc: '從文字中擷取整數與小數。', input: '文字', none: '未找到數字' },
};

export default function ExtractNumbersTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [input, setInput] = useState('Order #42 costs $19.99 plus 3 items');
  const nums = extractNumbers(input);

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <label className="tool__field"><span>{t.input}</span><TextArea rows={4} value={input} onChange={(e) => setInput(e.target.value)} /></label>
      {nums.length ? (
        <div className="tool__rows">{nums.map((n, i) => <div key={`${n}-${i}`} className="tool__row"><span className="tool__row-value">{n}</span></div>)}</div>
      ) : <p className="tool__hint">{t.none}</p>}
    </ToolPage>
  );
}
