import { useState } from 'react';
import * as XLSX from '@e965/xlsx';
import { ToolPage, DownloadButton } from '../components/ToolPage';
import { Button, FileField, Select, TextArea } from '../components/ui';
import type { ToolViewProps } from './types';
import { readFileBytes, tr } from './types';

type Dir = 'csv2xlsx' | 'xlsx2csv';

const L = {
  en: {
    title: 'CSV ↔ Excel',
    desc: 'Convert CSV to an .xlsx workbook and back, on your device. Nothing is uploaded.',
    direction: 'Direction',
    c2x: 'CSV → Excel (.xlsx)',
    x2c: 'Excel → CSV',
    csv: 'CSV text',
    pick: 'Choose an .xlsx file',
    convert: 'Convert',
    output: 'CSV output',
    downloadXlsx: 'Download spreadsheet.xlsx',
    downloadCsv: 'Download data.csv',
  },
  'zh-TW': {
    title: 'CSV ↔ Excel',
    desc: '在裝置上將 CSV 轉為 .xlsx 活頁簿或反向轉換，完全不上傳。',
    direction: '方向',
    c2x: 'CSV → Excel（.xlsx）',
    x2c: 'Excel → CSV',
    csv: 'CSV 文字',
    pick: '選擇 .xlsx 檔案',
    convert: '轉換',
    output: 'CSV 輸出',
    downloadXlsx: '下載 spreadsheet.xlsx',
    downloadCsv: '下載 data.csv',
  },
};

export default function CsvExcelTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [dir, setDir] = useState<Dir>('csv2xlsx');
  const [csv, setCsv] = useState('name,age\nAnn,30\nBo,25');
  const [file, setFile] = useState<File | null>(null);
  const [xlsxOut, setXlsxOut] = useState<Uint8Array | null>(null);
  const [csvOut, setCsvOut] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (): Promise<void> => {
    setBusy(true);
    setError(null);
    setXlsxOut(null);
    setCsvOut('');
    try {
      if (dir === 'csv2xlsx') {
        const wb = XLSX.read(csv, { type: 'string' });
        const out = XLSX.write(wb, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer;
        setXlsxOut(new Uint8Array(out));
      } else {
        if (!file) return;
        const wb = XLSX.read(await readFileBytes(file), { type: 'array' });
        const first = wb.Sheets[wb.SheetNames[0]!];
        setCsvOut(first ? XLSX.utils.sheet_to_csv(first) : '');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
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
        <span>{t.direction}</span>
        <Select
          value={dir}
          options={[
            { value: 'csv2xlsx', label: t.c2x },
            { value: 'xlsx2csv', label: t.x2c },
          ]}
          onChange={(v) => {
            setDir(v as Dir);
            setXlsxOut(null);
            setCsvOut('');
            setError(null);
          }}
          ariaLabel={t.direction}
        />
      </div>

      {dir === 'csv2xlsx' ? (
        <label className="tool__field">
          <span>{t.csv}</span>
          <TextArea mono rows={8} value={csv} onChange={(e) => setCsv(e.target.value)} />
        </label>
      ) : (
        <div className="tool__field">
          <span>{t.pick}</span>
          <FileField
            accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            buttonLabel={t.pick}
            onFiles={(fs) => {
              setFile(fs[0] ?? null);
              setCsvOut('');
            }}
          />
        </div>
      )}

      <div className="tool__actions">
        <Button variant="primary" loading={busy} disabled={busy || (dir === 'xlsx2csv' && !file)} onClick={run}>
          {t.convert}
        </Button>
      </div>

      {error ? <p className="tool__error">{error}</p> : null}
      {xlsxOut ? (
        <div className="tool__result">
          <DownloadButton
            bytes={xlsxOut}
            filename="spreadsheet.xlsx"
            mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            label={t.downloadXlsx}
          />
        </div>
      ) : null}
      {csvOut ? (
        <div className="tool__result">
          <label className="tool__field">
            <span>{t.output}</span>
            <TextArea mono rows={8} value={csvOut} readOnly />
          </label>
          <DownloadButton
            bytes={new TextEncoder().encode(csvOut)}
            filename="data.csv"
            mime="text/csv"
            label={t.downloadCsv}
          />
        </div>
      ) : null}
    </ToolPage>
  );
}
