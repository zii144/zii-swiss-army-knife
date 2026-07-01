import { useState } from 'react';
import { solarTermsInYear, type SolarTerm } from '@zii/calendar';
import { ToolPage } from '../components/ToolPage';
import { TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'Solar terms (節氣)',
    desc: 'The 24 solar terms (立春, 春分…) for a given year, with dates. On-device.',
    year: 'Year',
    term: 'Term',
    ja: 'Japanese',
    date: 'Date',
  },
  'zh-TW': {
    title: '二十四節氣',
    desc: '查詢指定年份的二十四節氣（立春、春分…）與日期，於裝置上運算。',
    year: '年份',
    term: '節氣',
    ja: '日文',
    date: '日期',
  },
};

export default function SolarTermsTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [year, setYear] = useState(new Date().getFullYear());

  let terms: SolarTerm[] = [];
  let error: string | null = null;
  try {
    terms = solarTermsInYear(year);
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  return (
    <ToolPage
      title={t.title}
      description={t.desc}
      onBack={onBack}
      backLabel={backLabel}
      offlineLabel={offlineLabel}
    >
      <label className="tool__field">
        <span>{t.year}</span>
        <TextField type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} />
      </label>
      {error ? (
        <p className="tool__error">{error}</p>
      ) : (
        <table className="ztable">
          <thead>
            <tr>
              <th>#</th>
              <th>{t.term}</th>
              <th>{t.ja}</th>
              <th>{t.date}</th>
            </tr>
          </thead>
          <tbody>
            {terms.map((tm) => (
              <tr key={tm.index}>
                <td>{tm.index}</td>
                <td>{tm.zh}</td>
                <td>{tm.ja}</td>
                <td>{tm.date.toISOString().slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </ToolPage>
  );
}
