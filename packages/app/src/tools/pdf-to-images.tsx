import { useState } from 'react';
import { canRenderPdfToImages, pdfToImages } from '@zii/compute-wasm/pdf';
import { ToolPage, DownloadButton } from '../components/ToolPage';
import { Button, FileField, Select } from '../components/ui';
import type { ToolViewProps } from './types';
import { readFileBytes, tr } from './types';

const L = {
  en: {
    title: 'PDF to images',
    desc: 'Rasterize each PDF page to PNG or JPEG on your device. Nothing is uploaded.',
    pick: 'Choose a PDF',
    format: 'Output format',
    convert: 'Convert',
    converting: 'Converting…',
    none: 'Choose a PDF file.',
    done: (n: number) => `${n} page${n === 1 ? '' : 's'} ready.`,
    download: (i: number) => `Download page ${i + 1}`,
    unsupported: 'PDF rasterization requires a browser environment.',
  },
  'zh-TW': {
    title: 'PDF 轉圖片',
    desc: '將 PDF 每一頁轉為 PNG 或 JPEG，於裝置上處理，完全不上傳。',
    pick: '選擇 PDF',
    format: '輸出格式',
    convert: '轉換',
    converting: '轉換中…',
    none: '請選擇 PDF 檔案。',
    done: (n: number) => `${n} 頁完成。`,
    download: (i: number) => `下載第 ${i + 1} 頁`,
    unsupported: 'PDF 光栅化需要瀏覽器環境。',
  },
};

export default function PdfToImagesTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [pages, setPages] = useState<Uint8Array[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supported = canRenderPdfToImages();

  const run = async (): Promise<void> => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setPages([]);
    try {
      setPages(await pdfToImages(await readFileBytes(file), { format }));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const ext = format === 'jpeg' ? 'jpg' : 'png';
  const mime = format === 'jpeg' ? 'image/jpeg' : 'image/png';

  return (
    <ToolPage
      title={t.title}
      description={t.desc}
      onBack={onBack}
      backLabel={backLabel}
      offlineLabel={offlineLabel}
    >
      {!supported ? <p className="tool__error">{t.unsupported}</p> : null}
      <div className="tool__field">
        <span>{t.pick}</span>
        <FileField
          accept="application/pdf,.pdf"
          buttonLabel={t.pick}
          onFiles={(fs) => {
            setFile(fs[0] ?? null);
            setPages([]);
          }}
        />
      </div>
      <div className="tool__field">
        <span>{t.format}</span>
        <Select
          value={format}
          options={[
            { value: 'png', label: 'PNG' },
            { value: 'jpeg', label: 'JPEG' },
          ]}
          onChange={(v) => setFormat(v as 'png' | 'jpeg')}
          ariaLabel={t.format}
        />
      </div>
      <div className="tool__actions">
        <Button
          variant="primary"
          loading={busy}
          disabled={!file || busy || !supported}
          onClick={run}
        >
          {busy ? t.converting : t.convert}
        </Button>
        {!file ? <span className="tool__hint">{t.none}</span> : null}
      </div>
      {error ? <p className="tool__error">{error}</p> : null}
      {pages.length > 0 ? (
        <div className="tool__result">
          <p className="tool__hint">{t.done(pages.length)}</p>
          <div className="tool__rows">
            {pages.map((bytes, i) => (
              <div key={i} className="tool__row">
                <DownloadButton
                  bytes={bytes}
                  filename={`page-${i + 1}.${ext}`}
                  mime={mime}
                  label={t.download(i)}
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </ToolPage>
  );
}
