import { useState } from 'react';
import { splitPdf } from '@zii/compute-wasm/pdf';
import { ToolPage, DownloadButton } from '../components/ToolPage';
import { FileField, Button } from '../components/ui';
import type { ToolViewProps } from './types';
import { readFileBytes, tr } from './types';

const L = {
  en: {
    title: 'Split PDF',
    desc: 'Split a PDF into one file per page, all on your device. Nothing is uploaded.',
    pick: 'Choose a PDF',
    split: 'Split',
    splitting: 'Splitting…',
    none: 'Choose a PDF to split.',
    done: (n: number) => `${n} page${n === 1 ? '' : 's'} ready.`,
    page: (n: number) => `Page ${n}`,
  },
  'zh-TW': {
    title: '分割 PDF',
    desc: '將 PDF 依頁拆成多個檔案，全部在裝置上處理，完全不上傳。',
    pick: '選擇 PDF',
    split: '分割',
    splitting: '分割中…',
    none: '請選擇要分割的 PDF。',
    done: (n: number) => `已產生 ${n} 頁。`,
    page: (n: number) => `第 ${n} 頁`,
  },
};

export default function PdfSplitTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<Uint8Array[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (): Promise<void> => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setPages(null);
    try {
      setPages(await splitPdf(await readFileBytes(file)));
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
          accept="application/pdf,.pdf"
          buttonLabel={t.pick}
          onFiles={(fs) => {
            setFile(fs[0] ?? null);
            setPages(null);
          }}
        />
      </div>
      <div className="tool__actions">
        <Button variant="primary" loading={busy} disabled={!file || busy} onClick={run}>
          {busy ? t.splitting : t.split}
        </Button>
        {!file ? <span className="tool__hint">{t.none}</span> : null}
      </div>

      {error ? <p className="tool__error">{error}</p> : null}
      {pages ? (
        <div className="tool__result">
          <p className="tool__hint">{t.done(pages.length)}</p>
          <div className="tool__rows">
            {pages.map((bytes, i) => (
              <div key={i} className="tool__row">
                <span className="tool__row-label">{t.page(i + 1)}</span>
                <DownloadButton
                  bytes={bytes}
                  filename={`page-${i + 1}.pdf`}
                  mime="application/pdf"
                  label={`↓ page-${i + 1}.pdf`}
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </ToolPage>
  );
}
