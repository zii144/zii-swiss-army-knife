import { useState } from 'react';
import { sortLines, type SortLinesOrder } from '@zii/text';
import { ToolPage, DownloadButton } from '../components/ToolPage';
import { Button, Select, TextArea } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const SAMPLE = 'cherry\napple\nbanana';

const L = {
  en: {
    title: 'Sort lines',
    desc: 'Sort lines A→Z, Z→A, or reverse line order on your device.',
    input: 'Text',
    order: 'Order',
    asc: 'A → Z',
    descOrder: 'Z → A',
    reverse: 'Reverse lines',
    sort: 'Sort',
    download: 'Download .txt',
  },
  'zh-TW': {
    title: '排序行',
    desc: '將文字行依 A→Z、Z→A 或反轉順序排列，於裝置上處理。',
    input: '文字',
    order: '順序',
    asc: 'A → Z',
    descOrder: 'Z → A',
    reverse: '反轉行序',
    sort: '排序',
    download: '下載 .txt',
  },
};

export default function SortLinesTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [input, setInput] = useState(SAMPLE);
  const [order, setOrder] = useState<SortLinesOrder>('asc');
  const [output, setOutput] = useState('');

  const run = (): void => setOutput(sortLines(input, order));

  return (
    <ToolPage title={t.title} description={t.desc} onBack={onBack} backLabel={backLabel} offlineLabel={offlineLabel}>
      <div className="tool__field">
        <span>{t.order}</span>
        <Select
          value={order}
          options={[
            { value: 'asc', label: t.asc },
            { value: 'desc', label: t.descOrder },
            { value: 'reverse', label: t.reverse },
          ]}
          onChange={(v) => setOrder(v as SortLinesOrder)}
          ariaLabel={t.order}
        />
      </div>
      <label className="tool__field">
        <span>{t.input}</span>
        <TextArea mono rows={8} value={input} onChange={(e) => setInput(e.target.value)} />
      </label>
      <div className="tool__actions">
        <Button variant="primary" onClick={run}>
          {t.sort}
        </Button>
      </div>
      {output ? (
        <div className="tool__result">
          <TextArea mono rows={8} value={output} readOnly />
          <DownloadButton bytes={new TextEncoder().encode(output)} filename="sorted.txt" mime="text/plain" label={t.download} />
        </div>
      ) : null}
    </ToolPage>
  );
}
