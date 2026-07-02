import { useState } from 'react';
import { imagesToPdf } from '@zii/compute-wasm/pdf';
import { ToolPage, DownloadButton } from '../components/ToolPage';
import { Button, FileField } from '../components/ui';
import type { ToolViewProps } from './types';
import { readFileBytes, tr } from './types';

const L = {
  en: {
    title: 'Images to PDF',
    desc: 'Combine JPEG or PNG images into one PDF, one page per image. Runs on your device.',
    pick: 'Choose images',
    convert: 'Create PDF',
    converting: 'Creating…',
    none: 'Choose one or more .jpg or .png images.',
    selected: (n: number) => `${n} image${n === 1 ? '' : 's'} selected`,
    done: 'PDF ready.',
    download: 'Download images.pdf',
  },
  'zh-TW': {
    title: '圖片轉 PDF',
    desc: '將 JPEG 或 PNG 合併為 PDF，每張圖片一頁，於裝置上處理。',
    pick: '選擇圖片',
    convert: '建立 PDF',
    converting: '建立中…',
    none: '請選擇一個以上的 .jpg 或 .png 圖片。',
    selected: (n: number) => `已選擇 ${n} 張圖片`,
    done: 'PDF 完成。',
    download: '下載 images.pdf',
  },
};

export default function ImagesToPdfTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (): Promise<void> => {
    if (files.length === 0) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const images = await Promise.all(files.map((f) => readFileBytes(f)));
      setResult(await imagesToPdf(images));
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
          accept="image/jpeg,image/png,.jpg,.jpeg,.png"
          multiple
          buttonLabel={t.pick}
          onFiles={(fs) => {
            setFiles([...fs]);
            setResult(null);
          }}
        />
      </div>
      <div className="tool__actions">
        <Button variant="primary" loading={busy} disabled={files.length === 0 || busy} onClick={run}>
          {busy ? t.converting : t.convert}
        </Button>
        {files.length === 0 ? (
          <span className="tool__hint">{t.none}</span>
        ) : (
          <span className="tool__hint">{t.selected(files.length)}</span>
        )}
      </div>
      {error ? <p className="tool__error">{error}</p> : null}
      {result ? (
        <div className="tool__result">
          <p className="tool__hint">{t.done}</p>
          <DownloadButton bytes={result} filename="images.pdf" mime="application/pdf" label={t.download} />
        </div>
      ) : null}
    </ToolPage>
  );
}
