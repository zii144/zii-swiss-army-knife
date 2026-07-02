import { useState } from 'react';
import { backendBaseUrl, backendConvert } from '../lib/backend';
import { ToolPage, DownloadButton } from '../components/ToolPage';
import { Button, FileField } from '../components/ui';
import type { ToolViewProps } from './types';
import { readFileBytes, tr } from './types';

const L = {
  en: {
    title: 'PowerPoint to PDF',
    desc: 'Convert a .pptx file to PDF via the Zii backend worker. Your file is streamed through and not stored.',
    pick: 'Choose a .pptx file',
    convert: 'Convert',
    converting: 'Converting…',
    none: 'Choose a PowerPoint file.',
    done: 'PDF ready.',
    download: 'Download converted.pdf',
    noBackend:
      'Set VITE_BACKEND_URL to a deployed @zii/backend instance with a LibreOffice/Gotenberg worker to use this tool.',
    backend: (url: string) => `Backend: ${url}`,
  },
  'zh-TW': {
    title: 'PowerPoint 轉 PDF',
    desc: '透過 Zii 後端 worker 將 .pptx 轉為 PDF。檔案串流處理，不會留存。',
    pick: '選擇 .pptx 檔案',
    convert: '轉換',
    converting: '轉換中…',
    none: '請選擇 PowerPoint 簡報。',
    done: 'PDF 完成。',
    download: '下載 converted.pdf',
    noBackend: '請設定 VITE_BACKEND_URL 指向已部署的 @zii/backend（含 LibreOffice/Gotenberg worker）。',
    backend: (url: string) => `後端：${url}`,
  },
};

export default function PptxToPdfTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const base = backendBaseUrl();
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
      setResult(await backendConvert(await readFileBytes(file), 'pptx', 'pdf'));
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
      offline={false}
    >
      {base ? (
        <p className="tool__hint">{t.backend(base)}</p>
      ) : (
        <p className="tool__error">{t.noBackend}</p>
      )}
      <div className="tool__field">
        <span>{t.pick}</span>
        <FileField
          accept=".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation"
          buttonLabel={t.pick}
          onFiles={(fs) => {
            setFile(fs[0] ?? null);
            setResult(null);
          }}
        />
      </div>
      <div className="tool__actions">
        <Button variant="primary" loading={busy} disabled={!file || busy || !base} onClick={run}>
          {busy ? t.converting : t.convert}
        </Button>
        {!file ? <span className="tool__hint">{t.none}</span> : null}
      </div>
      {error ? <p className="tool__error">{error}</p> : null}
      {result ? (
        <div className="tool__result">
          <p className="tool__hint">{t.done}</p>
          <DownloadButton
            bytes={result}
            filename="converted.pdf"
            mime="application/pdf"
            label={t.download}
          />
        </div>
      ) : null}
    </ToolPage>
  );
}
