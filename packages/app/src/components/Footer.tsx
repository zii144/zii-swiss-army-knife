import { CATALOG, localizedName } from '../lib/catalog';
import { LANGS, LANG_LABELS, useT } from '../lib/i18n';
import type { Lang } from '../lib/i18n';
import { Logo } from './Logo';

export interface FooterProps {
  lang: Lang;
  onOpenTool: (id: string) => void;
  onLang: (lang: Lang) => void;
}

/** Site footer: brand, internal tool links, language links, and a legal bar. */
export function Footer({ lang, onOpenTool, onLang }: FooterProps): React.JSX.Element {
  const t = useT(lang);
  const year = new Date().getFullYear();
  const topTools = CATALOG.slice(0, 6);

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <div className="footer__logo">
            <span className="app__brand-mark">
              <Logo />
            </span>
            <span className="footer__name">{t('brand')}</span>
          </div>
          <p className="footer__tagline">{t('heroKicker')}</p>
          <p className="footer__note">{t('rated')}</p>
        </div>

        <nav className="footer__col" aria-label={t('navTools')}>
          <h2 className="footer__heading">{t('navTools')}</h2>
          <ul className="footer__list">
            {topTools.map((tool) => (
              <li key={tool.id}>
                <button type="button" className="footer__link" onClick={() => onOpenTool(tool.id)}>
                  {localizedName(tool.id, lang)}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="footer__col" aria-label={t('footerLanguages')}>
          <h2 className="footer__heading">{t('footerLanguages')}</h2>
          <ul className="footer__list footer__list--langs">
            {LANGS.map((l) => (
              <li key={l}>
                <button
                  type="button"
                  className={`footer__link${l === lang ? ' is-current' : ''}`}
                  aria-current={l === lang ? 'true' : undefined}
                  onClick={() => onLang(l)}
                >
                  {LANG_LABELS[l]}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="footer__bar">
        <span>© {year} Zii</span>
        <span aria-hidden="true">·</span>
        <span>{t('rated')}</span>
      </div>
    </footer>
  );
}
