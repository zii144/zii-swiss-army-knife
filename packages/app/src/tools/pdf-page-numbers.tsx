import { useState } from 'react';
import { addPageNumbers } from '@zii/compute-wasm/pdf';
import { ToolPage, DownloadButton } from '../components/ToolPage';
import { Button, FileField } from '../components/ui';
import type { ToolViewProps } from './types';
import { readFileBytes, tr } from './types';

const L = {
  en: {
    title: 'Add page numbers',
    desc: 'Stamp "n / total" page numbers at the bottom of each page, on your device.',
    pick: 'Choose a PDF',
    apply: 'Add numbers',
    applying: 'Working…',
    none: 'Choose a PDF.',
    done: 'Numbered PDF ready.',
    download: 'Download',
  },
  'zh-TW': {
    title: '加入頁碼',
    desc: '在裝置上於每頁底部加上「n / 總頁數」頁碼。',
    pick: '選擇 PDF',
    apply: '加入頁碼',
    applying: '處理中…',
    none: '請選擇 PDF。',
    done: '頁碼完成。',
    download: '下載',
  },
};

export default function PdfPageNumbersTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (): Promise<void> => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      setResult(await addPageNumbers(await readFileBytes(file)));
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
            setResult(null);
          }}
        />
      </div>
      <div className="tool__actions">
        <Button variant="primary" loading={busy} disabled={!file || busy} onClick={run}>
          {busy ? t.applying : t.apply}
        </Button>
        {!file ? <span className="tool__hint">{t.none}</span> : null}
      </div>

      {error ? <p className="tool__error">{error}</p> : null}
      {result ? (
        <div className="tool__result">
          <p className="tool__hint">{t.done}</p>
          <DownloadButton bytes={result} filename="numbered.pdf" mime="application/pdf" label={t.download} />
        </div>
      ) : null}
    </ToolPage>
  );
}
