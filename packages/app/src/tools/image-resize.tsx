import { useState } from 'react';
import { resizeContain, resizeImage, imageSize, type RasterResult } from '../lib/imagekit';
import { ToolPage, DownloadButton } from '../components/ToolPage';
import { Button, FileField, Select, TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { readFileBytes, tr } from './types';

const FORMATS = [
  { value: 'image/png', label: 'PNG', ext: 'png' },
  { value: 'image/jpeg', label: 'JPEG', ext: 'jpg' },
  { value: 'image/webp', label: 'WebP', ext: 'webp' },
];
const PRESETS = [1920, 1080, 512, 256, 128];

const L = {
  en: {
    title: 'Resize image',
    desc: 'Resize an image to exact pixels or fit within a box, on your device.',
    pick: 'Choose an image',
    width: 'Width',
    height: 'Height',
    keep: 'Keep aspect ratio',
    format: 'Format',
    presets: 'Presets (longest side)',
    resize: 'Resize',
    resizing: 'Resizing…',
    none: 'Choose an image to resize.',
    done: (w: number, h: number) => `Result: ${w} × ${h}px`,
    download: 'Download',
  },
  'zh-TW': {
    title: '影像尺寸調整',
    desc: '在裝置上將影像調整為指定像素或縮放至框內。',
    pick: '選擇影像',
    width: '寬',
    height: '高',
    keep: '維持長寬比',
    format: '格式',
    presets: '預設（最長邊）',
    resize: '調整',
    resizing: '調整中…',
    none: '請選擇要調整的影像。',
    done: (w: number, h: number) => `結果：${w} × ${h}px`,
    download: '下載',
  },
};

export default function ImageResizeTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const [width, setWidth] = useState(1080);
  const [height, setHeight] = useState(1080);
  const [keep, setKeep] = useState(true);
  const [format, setFormat] = useState('image/png');
  const [result, setResult] = useState<RasterResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFile = async (file: File | null): Promise<void> => {
    setResult(null);
    if (!file) {
      setBytes(null);
      return;
    }
    const b = await readFileBytes(file);
    setBytes(b);
    try {
      const { width: w, height: h } = await imageSize(b);
      setWidth(w);
      setHeight(h);
    } catch {
      /* ignore */
    }
  };

  const run = async (): Promise<void> => {
    if (!bytes) return;
    setBusy(true);
    setError(null);
    setResult(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    try {
      const out = keep
        ? await resizeContain(bytes, width, height, format)
        : await resizeImage(bytes, width, height, format);
      setResult(out);
      setPreviewUrl(URL.createObjectURL(new Blob([out.bytes as unknown as BlobPart], { type: format })));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const ext = FORMATS.find((f) => f.value === format)?.ext ?? 'png';

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
          accept="image/*"
          buttonLabel={t.pick}
          onFiles={(fs) => void onFile(fs[0] ?? null)}
        />
      </div>
      <div className="tool__inline">
        <label className="tool__field">
          <span>{t.width}</span>
          <TextField type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} />
        </label>
        <label className="tool__field">
          <span>{t.height}</span>
          <TextField type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} />
        </label>
        <div className="tool__field">
          <span>{t.format}</span>
          <Select value={format} options={FORMATS} onChange={setFormat} ariaLabel={t.format} />
        </div>
      </div>
      <label className="tool__check">
        <input type="checkbox" checked={keep} onChange={() => setKeep((k) => !k)} />
        {t.keep}
      </label>
      <div className="tool__field">
        <span>{t.presets}</span>
        <div className="tool__checks">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              className="ui-btn ui-btn--ghost"
              onClick={() => {
                setWidth(p);
                setHeight(p);
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="tool__actions">
        <Button variant="primary" loading={busy} disabled={!bytes || busy} onClick={run}>
          {busy ? t.resizing : t.resize}
        </Button>
        {!bytes ? <span className="tool__hint">{t.none}</span> : null}
      </div>

      {error ? <p className="tool__error">{error}</p> : null}
      {result && previewUrl ? (
        <div className="tool__result">
          <p className="tool__hint">{t.done(result.width, result.height)}</p>
          <img className="tool__preview" src={previewUrl} alt="resized result" />
          <DownloadButton
            bytes={result.bytes}
            filename={`resized.${ext}`}
            mime={format}
            label={t.download}
          />
        </div>
      ) : null}
    </ToolPage>
  );
}
