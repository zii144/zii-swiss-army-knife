import { useState } from 'react';
import { mergePdfs } from '../lib/compute';
import { ToolPage, DownloadButton } from '../components/ToolPage';
import { tr, readFileBytes, type ToolViewProps } from './shared';

const L = {
  en: {
    title: 'Merge PDF',
    desc: 'Combine several PDF files into one, in the order you add them. Runs entirely on your device.',
    pick: 'Choose PDF files',
    merge: 'Merge',
    merging: 'Merging…',
    none: 'Add two or more PDF files.',
    selected: (n: number) => `${n} file${n === 1 ? '' : 's'} selected`,
    done: 'Merged PDF ready.',
    download: 'Download merged.pdf',
  },
  'zh-TW': {
    title: '合併 PDF',
    desc: '依加入順序將多個 PDF 合併成一個檔案，完全在裝置上處理。',
    pick: '選擇 PDF 檔案',
    merge: '合併',
    merging: '合併中…',
    none: '請加入兩個以上的 PDF。',
    selected: (n: number) => `已選擇 ${n} 個檔案`,
    done: '合併完成。',
    download: '下載 merged.pdf',
  },
};

export default function PdfMerge({ onBack, lang, backLabel, offlineLabel }: ToolViewProps) {
  const t = tr(L, lang);
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      setResult(await mergePdfs(await Promise.all(files.map(readFileBytes))));
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
        <span>{t.pick}</span>
        <input
          type="file"
          accept="application/pdf,.pdf"
          multiple
          onChange={(e) => {
            setFiles(Array.from(e.target.files ?? []));
            setResult(null);
          }}
        />
      </label>
      {files.length > 0 ? <p className="tool__hint">{t.selected(files.length)}</p> : null}
      <div className="tool__actions">
        <button
          type="button"
          className="tool__primary"
          disabled={files.length < 2 || busy}
          onClick={run}
        >
          {busy ? t.merging : t.merge}
        </button>
        {files.length < 2 ? <span className="tool__hint">{t.none}</span> : null}
      </div>
      {error ? <p className="tool__error">{error}</p> : null}
      {result ? (
        <div className="tool__result">
          <p className="tool__hint">{t.done}</p>
          <DownloadButton
            bytes={result}
            filename="merged.pdf"
            mime="application/pdf"
            label={t.download}
          />
        </div>
      ) : null}
    </ToolPage>
  );
}
