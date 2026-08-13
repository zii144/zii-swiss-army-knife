import type { Lang } from '../lib/i18n';
import { LEGAL_CONTACT, LEGAL_SITE, type LegalView } from '../lib/legal';
import { legalDoc } from '../lib/legal-content';

export interface LegalPageProps {
  lang: Lang;
  view: LegalView;
}

function LinkedParagraph({ text }: { text: string }): React.JSX.Element {
  const parts = text.split(LEGAL_CONTACT);
  const nodes: React.ReactNode[] = [];
  parts.forEach((part, i) => {
    const siteParts = part.split(LEGAL_SITE);
    siteParts.forEach((chunk, j) => {
      if (chunk) nodes.push(chunk);
      if (j < siteParts.length - 1) {
        nodes.push(
          <a key={`s${i}-${j}`} href={LEGAL_SITE} rel="noopener noreferrer">
            {LEGAL_SITE}
          </a>,
        );
      }
    });
    if (i < parts.length - 1) {
      nodes.push(
        <a key={`e${i}`} href={`mailto:${LEGAL_CONTACT}`}>
          {LEGAL_CONTACT}
        </a>,
      );
    }
  });
  return <p className="legal__p">{nodes}</p>;
}

/** Lazy legal/about copy — kept out of the home JS chunk. */
export function LegalPage({ lang, view }: LegalPageProps): React.JSX.Element {
  const doc = legalDoc(view, lang);
  return (
    <article className="legal">
      <h1 className="legal__title">{doc.title}</h1>
      {doc.sections.map((section) => (
        <section key={section.heading} className="legal__section">
          <h2 className="legal__h2">{section.heading}</h2>
          {section.paragraphs.map((p) => (
            <LinkedParagraph key={p.slice(0, 48)} text={p} />
          ))}
        </section>
      ))}
    </article>
  );
}
