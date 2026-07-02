import { useState } from 'react';
import { rotatePdf } from '@zii/compute-wasm/pdf';
import { ToolPage, DownloadButton } from '../components/ToolPage';
import { Button, FileField, Select } from '../components/ui';
import type { ToolViewProps } from './types';
import { readFileBytes, tr } from './types';

const L = {
  en: {
    title: 'Rotate PDF',
    desc: 'Rotate every page of a PDF, on your device. Nothing is uploaded.',
    pick: 'Choose a PDF',
    angle: 'Rotate by',
    rotate: 'Rotate',
    rotating: 'Rotating…',
    none: 'Choose a PDF to rotate.',
    done: 'Rotated PDF ready.',
    download: 'Download',
  },
  'zh-TW': {
    title: '旋轉 PDF',
    desc: '在裝置上旋轉 PDF 的每一頁，完全不上傳。',
    pick: '選擇 PDF',
    angle: '旋轉角度',
    rotate: '旋轉',
    rotating: '旋轉中…',
    none: '請選擇要旋轉的 PDF。',
    done: '旋轉完成。',
    download: '下載',
  },
};

export default function PdfRotateTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [file, setFile] = useState<File | null>(null);
  const [deg, setDeg] = useState('90');
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (): Promise<void> => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      setResult(await rotatePdf(await readFileBytes(file), Number(deg)));
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
      <div className="tool__field">
        <span>{t.angle}</span>
        <Select
          value={deg}
          options={[
            { value: '90', label: '90° ↻' },
            { value: '180', label: '180°' },
            { value: '270', label: '90° ↺' },
          ]}
          onChange={setDeg}
          ariaLabel={t.angle}
        />
      </div>
      <div className="tool__actions">
        <Button variant="primary" loading={busy} disabled={!file || busy} onClick={run}>
          {busy ? t.rotating : t.rotate}
        </Button>
        {!file ? <span className="tool__hint">{t.none}</span> : null}
      </div>

      {error ? <p className="tool__error">{error}</p> : null}
      {result ? (
        <div className="tool__result">
          <p className="tool__hint">{t.done}</p>
          <DownloadButton bytes={result} filename="rotated.pdf" mime="application/pdf" label={t.download} />
        </div>
      ) : null}
    </ToolPage>
  );
}
