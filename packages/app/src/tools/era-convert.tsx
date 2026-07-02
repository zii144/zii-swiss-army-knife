import { useState } from 'react';
import { gregorianToRoc, toJapaneseEra } from '@zii/calendar';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const today = (): string => new Date().toISOString().slice(0, 10);

const L = {
  en: {
    title: 'Era converter',
    desc: 'Convert a Gregorian date to the ROC (Minguo) year and the Japanese era. On-device.',
    date: 'Gregorian date',
    roc: 'ROC (Minguo)',
    jp: 'Japanese era',
    rocYear: (y: number) => `Minguo ${y}`,
  },
  'zh-TW': {
    title: '紀年轉換',
    desc: '將西元日期轉換為民國年與日本和曆，於裝置上運算。',
    date: '西元日期',
    roc: '民國',
    jp: '和曆',
    rocYear: (y: number) => `民國 ${y} 年`,
  },
};

export default function EraConvertTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [date, setDate] = useState(today());

  const d = new Date(date);
  const valid = !Number.isNaN(d.getTime());
  const roc = valid ? gregorianToRoc(d.getUTCFullYear()) : null;
  const jp = valid ? toJapaneseEra(d) : null;

  return (
    <ToolPage
      title={t.title}
      description={t.desc}
      onBack={onBack}
      backLabel={backLabel}
      offlineLabel={offlineLabel}
    >
      <label className="tool__field">
        <span>{t.date}</span>
        <TextField type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>
      {valid && roc !== null && jp ? (
        <div className="tool__result">
          <div className="tool__rows" style={{ width: '100%' }}>
            <div className="tool__row">
              <span className="tool__row-label">{t.roc}</span>
              <code className="tool__row-value">{t.rocYear(roc)}</code>
            </div>
            <div className="tool__row">
              <span className="tool__row-label">{t.jp}</span>
              <code className="tool__row-value">{jp.label}</code>
            </div>
          </div>
        </div>
      ) : null}
    </ToolPage>
  );
}
