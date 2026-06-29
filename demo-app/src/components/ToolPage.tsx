import type { ReactNode } from 'react';

export interface ToolPageProps {
  title: string;
  description: string;
  onBack: () => void;
  backLabel: string;
  offlineLabel: string;
  offline?: boolean;
  children: ReactNode;
}

export function ToolPage({
  title,
  description,
  onBack,
  backLabel,
  offlineLabel,
  offline = true,
  children,
}: ToolPageProps) {
  return (
    <section className="tool">
      <button type="button" className="tool__back" onClick={onBack}>
        {backLabel}
      </button>
      <header className="tool__header">
        <h2 className="tool__title">{title}</h2>
        {offline ? <span className="app__badge">{offlineLabel}</span> : null}
      </header>
      <p className="tool__desc">{description}</p>
      <div className="tool__body">{children}</div>
    </section>
  );
}

export function DownloadButton({
  bytes,
  filename,
  mime,
  label,
}: {
  bytes: Uint8Array;
  filename: string;
  mime: string;
  label: string;
}) {
  const onClick = () => {
    const blob = new Blob([bytes as unknown as BlobPart], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <button type="button" className="tool__primary" onClick={onClick}>
      {label}
    </button>
  );
}
