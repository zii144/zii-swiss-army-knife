import { useState } from 'react';
import { organizePdf, pdfPageCount } from '@zii/compute-wasm/pdf';
import { ToolPage, DownloadButton } from '../components/ToolPage';
import { Button, FileField, TextField } from '../components/ui';
import type { ToolViewProps } from './types';
import { readFileBytes, tr } from './types';

/** Parse a 1-based page list like "3,1,2" or "1-3,5" into 0-based indices. */
function parseOrder(spec: string): number[] {
  const out: number[] = [];
  for (const part of spec.split(',')) {
    const p = part.trim();
    if (!p) continue;
    const range = /^(\d+)-(\d+)$/.exec(p);
    if (range) {
      const a = Number(range[1]);
      const b = Number(range[2]);
      const step = a <= b ? 1 : -1;
      for (let i = a; step > 0 ? i <= b : i >= b; i += step) out.push(i - 1);
    } else if (/^\d+$/.test(p)) {
      out.push(Number(p) - 1);
    }
  }
  return out;
}

const L = {
  en: {
    title: 'Organize PDF pages',
    desc: 'Reorder or delete pages by listing the pages you want to keep, in order. On-device.',
    pick: 'Choose a PDF',
    pages: (n: number) => `${n} page${n === 1 ? '' : 's'}`,
    order: 'Keep pages (in order)',
    hint: 'e.g. 3,1,2 or 1-3,5 — omitted pages are removed',
    apply: 'Apply',
    applying: 'Working…',
    none: 'Choose a PDF.',
    done: 'Reorganized PDF ready.',
    download: 'Download',
  },
  'zh-TW': {
    title: '重整 PDF 頁面',
    desc: '依序列出要保留的頁面來重新排序或刪除頁面，於裝置上處理。',
    pick: '選擇 PDF',
    pages: (n: number) => `${n} 頁`,
    order: '保留頁面（依順序）',
    hint: '例如 3,1,2 或 1-3,5 — 未列出的頁面會被刪除',
    apply: '套用',
    applying: '處理中…',
    none: '請選擇 PDF。',
    done: '重整完成。',
    download: '下載',
  },
};

export default function PdfOrganizeTool({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [file, setFile] = useState<File | null>(null);
  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const [count, setCount] = useState(0);
  const [order, setOrder] = useState('');
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFile = async (f: File | null): Promise<void> => {
    setResult(null);
    setFile(f);
    if (!f) {
      setBytes(null);
      setCount(0);
      return;
    }
    const b = await readFileBytes(f);
    setBytes(b);
    try {
      const n = await pdfPageCount(b);
      setCount(n);
      setOrder(Array.from({ length: n }, (_, i) => i + 1).join(','));
    } catch {
      /* ignore */
    }
  };

  const run = async (): Promise<void> => {
    if (!bytes) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      setResult(await organizePdf(bytes, parseOrder(order)));
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
          onFiles={(fs) => void onFile(fs[0] ?? null)}
        />
      </div>
      {file && count > 0 ? <p className="tool__hint">{t.pages(count)}</p> : null}
      <label className="tool__field">
        <span>{t.order}</span>
        <TextField type="text" value={order} onChange={(e) => setOrder(e.target.value)} />
        <span className="tool__hint">{t.hint}</span>
      </label>
      <div className="tool__actions">
        <Button variant="primary" loading={busy} disabled={!bytes || busy} onClick={run}>
          {busy ? t.applying : t.apply}
        </Button>
        {!file ? <span className="tool__hint">{t.none}</span> : null}
      </div>

      {error ? <p className="tool__error">{error}</p> : null}
      {result ? (
        <div className="tool__result">
          <p className="tool__hint">{t.done}</p>
          <DownloadButton bytes={result} filename="organized.pdf" mime="application/pdf" label={t.download} />
        </div>
      ) : null}
    </ToolPage>
  );
}
