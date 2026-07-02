import { useState } from 'react';
import { watermarkPdf } from '@zii/compute-wasm/pdf';
import { ToolPage, DownloadButton } from '../components/ToolPage';
import { Button, FileField, RangeSlider, TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { readFileBytes, tr } from './types';

const L = {
  en: {
    title: 'Watermark PDF',
    desc: 'Stamp a diagonal text watermark across every page, on your device.',
    pick: 'Choose a PDF',
    text: 'Watermark text',
    opacity: 'Opacity',
    apply: 'Apply',
    applying: 'Applying…',
    none: 'Choose a PDF to watermark.',
    done: 'Watermarked PDF ready.',
    download: 'Download',
  },
  'zh-TW': {
    title: 'PDF 浮水印',
    desc: '在裝置上為 PDF 每一頁加上斜向文字浮水印。',
    pick: '選擇 PDF',
    text: '浮水印文字',
    opacity: '不透明度',
    apply: '套用',
    applying: '套用中…',
    none: '請選擇要加浮水印的 PDF。',
    done: '浮水印完成。',
    download: '下載',
  },
};

export default function PdfWatermarkTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(20);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (): Promise<void> => {
    if (!file || !text.trim()) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      setResult(await watermarkPdf(await readFileBytes(file), { text, opacity: opacity / 100 }));
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
      <label className="tool__field">
        <span>{t.text}</span>
        <TextField type="text" value={text} onChange={(e) => setText(e.target.value)} />
      </label>
      <label className="tool__field">
        <span>
          {t.opacity}: {opacity}%
        </span>
        <RangeSlider
          min={5}
          max={80}
          value={opacity}
          onChange={(e) => setOpacity(Number(e.target.value))}
        />
      </label>
      <div className="tool__actions">
        <Button variant="primary" loading={busy} disabled={!file || !text.trim() || busy} onClick={run}>
          {busy ? t.applying : t.apply}
        </Button>
        {!file ? <span className="tool__hint">{t.none}</span> : null}
      </div>

      {error ? <p className="tool__error">{error}</p> : null}
      {result ? (
        <div className="tool__result">
          <p className="tool__hint">{t.done}</p>
          <DownloadButton bytes={result} filename="watermarked.pdf" mime="application/pdf" label={t.download} />
        </div>
      ) : null}
    </ToolPage>
  );
}
