import { useState } from 'react';
import { generateQr } from '@zii/compute-wasm/qr';
import { ToolPage, DownloadButton } from '../components/ToolPage';
import type { ToolViewProps } from './types';
import { tr } from './types';

const L = {
  en: {
    title: 'QR code generator',
    desc: 'Turn any text or URL into a QR code, generated on your device.',
    label: 'Text or URL',
    placeholder: 'https://zii.app',
    generate: 'Generate',
    generating: 'Generating…',
    done: 'QR code ready.',
    download: 'Download qr.png',
  },
  'zh-TW': {
    title: 'QR Code 產生器',
    desc: '將任何文字或網址轉成 QR Code，於裝置上產生。',
    label: '文字或網址',
    placeholder: 'https://zii.app',
    generate: '產生',
    generating: '產生中…',
    done: 'QR Code 完成。',
    download: '下載 qr.png',
  },
};

export default function QrGenerateTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [text, setText] = useState('');
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (): Promise<void> => {
    setBusy(true);
    setError(null);
    setResult(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    try {
      const png = await generateQr(text);
      setResult(png);
      setPreviewUrl(
        URL.createObjectURL(new Blob([png as unknown as BlobPart], { type: 'image/png' })),
      );
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
      <label className="tool__field">
        <span>{t.label}</span>
        <input
          type="text"
          value={text}
          placeholder={t.placeholder}
          onChange={(e) => {
            setText(e.target.value);
            setResult(null);
          }}
        />
      </label>

      <div className="tool__actions">
        <button
          type="button"
          className="tool__primary"
          disabled={text.trim().length === 0 || busy}
          onClick={run}
        >
          {busy ? t.generating : t.generate}
        </button>
      </div>

      {error ? <p className="tool__error">{error}</p> : null}
      {result && previewUrl ? (
        <div className="tool__result">
          <p className="tool__hint">{t.done}</p>
          <img className="tool__preview tool__preview--qr" src={previewUrl} alt="QR code" />
          <DownloadButton bytes={result} filename="qr.png" mime="image/png" label={t.download} />
        </div>
      ) : null}
    </ToolPage>
  );
}
