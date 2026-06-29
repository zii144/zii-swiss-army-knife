import type { ReactNode } from 'react';

export interface ToolPageProps {
  title: string;
  description: string;
  /** Called when the user clicks the back link. */
  onBack: () => void;
  backLabel: string;
  /** Shown as an "offline" pill when true. */
  offline?: boolean;
  offlineLabel: string;
  children: ReactNode;
}

/**
 * Shared layout for a single tool: a back link, a titled header with an
 * offline badge, and a body slot. Every tool page renders inside this template
 * so the chrome stays consistent.
 */
export function ToolPage({
  title,
  description,
  onBack,
  backLabel,
  offline = true,
  offlineLabel,
  children,
}: ToolPageProps): React.JSX.Element {
  return (
    <section className="tool">
      <button type="button" className="tool__back" onClick={onBack}>
        ← {backLabel}
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

/** A reusable download button that turns bytes into a file the user can save. */
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
}): React.JSX.Element {
  const onClick = (): void => {
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
