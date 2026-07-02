import { useState } from 'react';
import { extractZip } from '@zii/compute-wasm/archive';
import { ToolPage, DownloadButton } from '../components/ToolPage';
import { FileField, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { readFileBytes, tr } from './types';

interface Entry {
  path: string;
  bytes: Uint8Array;
}

const L = {
  en: {
    title: 'Extract ZIP',
    desc: 'Open a ZIP archive and download the files inside — all on your device.',
    pick: 'Choose a ZIP',
    extract: 'Extract',
    extracting: 'Extracting…',
    none: 'Choose a .zip file.',
    found: (n: number) => `${n} file${n === 1 ? '' : 's'} inside`,
    empty: 'The archive is empty.',
  },
  'zh-TW': {
    title: '解壓 ZIP',
    desc: '開啟 ZIP 壓縮檔並下載其中的檔案，全部在裝置上處理。',
    pick: '選擇 ZIP',
    extract: '解壓',
    extracting: '解壓中…',
    none: '請選擇 .zip 檔案。',
    found: (n: number) => `內含 ${n} 個檔案`,
    empty: '壓縮檔是空的。',
  },
};

function fmt(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function ZipExtractTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [file, setFile] = useState<File | null>(null);
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (): Promise<void> => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setEntries(null);
    try {
      const out = extractZip(await readFileBytes(file));
      setEntries(Object.entries(out).map(([path, bytes]) => ({ path, bytes })));
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
        <span>{t.pick}</span>
        <FileField
          accept="application/zip,.zip"
          buttonLabel={t.pick}
          onFiles={(fs) => {
            setFile(fs[0] ?? null);
            setEntries(null);
          }}
        />
      </div>
      <div className="tool__actions">
        <Button variant="primary" loading={busy} disabled={!file || busy} onClick={run}>
          {busy ? t.extracting : t.extract}
        </Button>
        {!file ? <span className="tool__hint">{t.none}</span> : null}
      </div>

      {error ? <p className="tool__error">{error}</p> : null}
      {entries ? (
        <div className="tool__result">
          <p className="tool__hint">{entries.length === 0 ? t.empty : t.found(entries.length)}</p>
          <div className="tool__rows">
            {entries.map((e, i) => (
              <div key={i} className="tool__row">
                <code className="tool__row-value">{e.path}</code>
                <span className="tool__row-label">{fmt(e.bytes.byteLength)}</span>
                <DownloadButton
                  bytes={e.bytes}
                  filename={e.path.split('/').pop() || 'file'}
                  mime="application/octet-stream"
                  label="↓"
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </ToolPage>
  );
}
