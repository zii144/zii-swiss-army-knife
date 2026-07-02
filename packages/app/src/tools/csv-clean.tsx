import { useState } from 'react';
import { cleanCsv, type CleanCsvOptions } from '@zii/text';
import { ToolPage, DownloadButton } from '../components/ToolPage';
import { Button, Select, TextArea } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const SAMPLE = 'name , email , role\nAnn , ann@example.com , admin\nAnn , ann@example.com , admin\n , ,\nBo,bo@example.com,user';

const L = {
  en: {
    title: 'CSV cleaner',
    desc: 'Trim fields, drop blank rows, and remove duplicates from CSV on your device.',
    input: 'CSV input',
    dedupe: 'Remove duplicates',
    dedupeNone: 'Keep all rows',
    dedupeAll: 'By full row',
    dedupeFirst: 'By first column',
    clean: 'Clean',
    output: 'Cleaned CSV',
    download: 'Download cleaned.csv',
    invalid: 'Could not parse CSV',
  },
  'zh-TW': {
    title: 'CSV 清理',
    desc: '在裝置上修剪欄位、移除空白列與重複列。',
    input: 'CSV 輸入',
    dedupe: '移除重複',
    dedupeNone: '保留全部',
    dedupeAll: '依整列',
    dedupeFirst: '依第一欄',
    clean: '清理',
    output: '清理結果',
    download: '下載 cleaned.csv',
    invalid: '無法解析 CSV',
  },
};

export default function CsvCleanTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [input, setInput] = useState(SAMPLE);
  const [dedupe, setDedupe] = useState<CleanCsvOptions['dedupe']>('all');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const dedupeOptions = [
    { value: 'all', label: t.dedupeAll },
    { value: 'first-column', label: t.dedupeFirst },
    { value: 'none', label: t.dedupeNone },
  ];

  const run = (): void => {
    setError(null);
    setOutput('');
    try {
      setOutput(cleanCsv(input, { trimFields: true, dropEmptyRows: true, dedupe }));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
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
      <div className="tool__field">
        <span>{t.dedupe}</span>
        <Select
          value={dedupe ?? 'all'}
          options={dedupeOptions}
          onChange={(v) => setDedupe(v as CleanCsvOptions['dedupe'])}
          ariaLabel={t.dedupe}
        />
      </div>
      <label className="tool__field">
        <span>{t.input}</span>
        <TextArea mono rows={10} value={input} onChange={(e) => setInput(e.target.value)} />
      </label>
      <div className="tool__actions">
        <Button variant="primary" onClick={run}>
          {t.clean}
        </Button>
      </div>
      {error ? <p className="tool__error">{`${t.invalid}: ${error}`}</p> : null}
      {output ? (
        <div className="tool__result">
          <label className="tool__field">
            <span>{t.output}</span>
            <TextArea mono rows={10} value={output} readOnly />
          </label>
          <DownloadButton
            bytes={new TextEncoder().encode(output)}
            filename="cleaned.csv"
            mime="text/csv"
            label={t.download}
          />
        </div>
      ) : null}
    </ToolPage>
  );
}
