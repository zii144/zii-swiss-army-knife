import { useState } from 'react';
import { toSVG } from 'bwip-js/browser';
import { ToolPage, DownloadButton } from '../components/ToolPage';
import { Select, TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { tr } from './types';

const TYPES = [
  { value: 'code128', label: 'Code 128' },
  { value: 'qrcode', label: 'QR Code' },
  { value: 'ean13', label: 'EAN-13' },
  { value: 'ean8', label: 'EAN-8' },
  { value: 'upca', label: 'UPC-A' },
  { value: 'code39', label: 'Code 39' },
  { value: 'datamatrix', label: 'Data Matrix' },
  { value: 'pdf417', label: 'PDF417' },
];

const L = {
  en: {
    title: 'Barcode generator',
    desc: 'Generate barcodes and 2D codes (Code 128, EAN, Data Matrix…) as SVG, on your device.',
    type: 'Symbology',
    text: 'Data',
    download: 'Download .svg',
  },
  'zh-TW': {
    title: '條碼產生器',
    desc: '在裝置上產生條碼與 2D 碼（Code 128、EAN、Data Matrix…）並輸出 SVG。',
    type: '條碼類型',
    text: '資料',
    download: '下載 .svg',
  },
};

export default function BarcodeTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [bcid, setBcid] = useState('code128');
  const [text, setText] = useState('ZII-12345');

  let svg = '';
  let error: string | null = null;
  if (text.trim()) {
    try {
      svg = toSVG({ bcid, text, scale: 3, height: 12, includetext: true, textxalign: 'center' });
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }
  }

  return (
    <ToolPage
      title={t.title}
      description={t.desc}
      onBack={onBack}
      backLabel={backLabel}
      offlineLabel={offlineLabel}
    >
      <div className="tool__field">
        <span>{t.type}</span>
        <Select value={bcid} options={TYPES} onChange={setBcid} ariaLabel={t.type} />
      </div>
      <label className="tool__field">
        <span>{t.text}</span>
        <TextField type="text" value={text} onChange={(e) => setText(e.target.value)} />
      </label>
      {error ? <p className="tool__error">{error}</p> : null}
      {svg ? (
        <div className="tool__result">
          <div
            className="barcode-preview"
            aria-label="barcode"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
          <DownloadButton
            bytes={new TextEncoder().encode(svg)}
            filename={`barcode-${bcid}.svg`}
            mime="image/svg+xml"
            label={t.download}
          />
        </div>
      ) : null}
    </ToolPage>
  );
}
