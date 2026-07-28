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
        {/* h1, matching the prerendered markup this view replaces — the tool
            name is the page's subject, and every tool renders through here. */}
        <h1 className="tool__title">{title}</h1>
        {offline ? <span className="app__badge">{offlineLabel}</span> : null}
      </header>
      <p className="tool__desc">{description}</p>
      <div className="tool__body">{children}</div>
    </section>
  );
}

/**
 * How long a download's object URL is kept alive after the click.
 *
 * The click starts a navigation that the browser services on a later task, so
 * revoking synchronously can cancel the download before it begins. This only
 * has to outlive that hand-off; it is deliberately far shorter than the ~40s
 * the old file-saver libraries used, because the Blob holds a full copy of the
 * bytes and some of these tools produce very large files.
 */
const DOWNLOAD_URL_TTL_MS = 10_000;

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
    a.rel = 'noopener';
    // In the document, because a detached anchor's click is ignored by some
    // engines — notably Firefox, which is also the one most likely to drop the
    // download if the URL is revoked too early.
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), DOWNLOAD_URL_TTL_MS);
  };
  return (
    <button type="button" className="tool__primary" onClick={onClick}>
      {label}
    </button>
  );
}
