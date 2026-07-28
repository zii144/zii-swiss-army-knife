export interface NotFoundProps {
  title: string;
  body: string;
  ctaLabel: string;
  /** Navigate to the tools index. */
  onBrowse: () => void;
}

/**
 * Rendered for any path that does not resolve to a real route. The host
 * rewrites unmatched paths to the SPA with a 200, so this page — plus the
 * `noindex` that `buildHead` pairs with it — is what stops an arbitrary URL
 * from reading as a genuine, indexable tool page.
 */
export function NotFound({ title, body, ctaLabel, onBrowse }: NotFoundProps): React.JSX.Element {
  return (
    <main className="workspace__main">
      <section className="tool">
        <header className="tool__header">
          <h1 className="tool__title">{title}</h1>
        </header>
        <p className="tool__desc">{body}</p>
        <div className="tool__body">
          <button type="button" className="tool__primary" onClick={onBrowse}>
            {ctaLabel}
          </button>
        </div>
      </section>
    </main>
  );
}
