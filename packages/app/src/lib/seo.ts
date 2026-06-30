import { DICTIONARY, HREFLANG, LANGS, type Lang } from './i18n';
import { CATALOG, getTool, localizedBlurb, localizedName } from './catalog';
import { categoryLabel } from './categories';
import { buildPath } from './router';

/** Public origin used for canonical/alternate URLs in prerendered output. */
export const SITE_ORIGIN = 'https://zii.tools';
export const SITE_NAME = 'Zii';

export interface AltLink {
  hreflang: string;
  href: string;
}

export interface HeadMeta {
  lang: Lang;
  htmlLang: string;
  title: string;
  description: string;
  canonical: string;
  alternates: AltLink[];
  /** JSON-LD objects to embed as <script type="application/ld+json">. */
  jsonLd: object[];
}

function homeTitle(lang: Lang): string {
  const d = DICTIONARY[lang];
  return `${SITE_NAME} — ${d.heroTitleA} ${d.heroTitleB}`.replace(/,$/, '');
}

/** hreflang alternates for a route across every locale, plus x-default (en). */
export function alternatesFor(origin: string, toolId: string | null): AltLink[] {
  const links: AltLink[] = LANGS.map((l) => ({
    hreflang: HREFLANG[l],
    href: origin + buildPath(l, toolId),
  }));
  links.push({ hreflang: 'x-default', href: origin + buildPath('en', toolId) });
  return links;
}

/** Build all head metadata + structured data for a given route + locale. */
export function buildHead(origin: string, lang: Lang, toolId: string | null): HeadMeta {
  const d = DICTIONARY[lang];
  const canonical = origin + buildPath(lang, toolId);
  const alternates = alternatesFor(origin, toolId);
  const base = {
    lang,
    htmlLang: HREFLANG[lang],
    canonical,
    alternates,
  };

  if (toolId) {
    const name = localizedName(toolId, lang);
    const description = localizedBlurb(toolId, lang) || d.heroSubtitle;
    return {
      ...base,
      title: `${name} — ${SITE_NAME}`,
      description,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: `${name} — ${SITE_NAME}`,
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'Web',
          description,
          url: canonical,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          isAccessibleForFree: true,
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: (() => {
            const cat = getTool(toolId)?.category;
            const items: object[] = [
              {
                '@type': 'ListItem',
                position: 1,
                name: d.navHome,
                item: origin + buildPath(lang, null),
              },
            ];
            if (cat) {
              items.push({
                '@type': 'ListItem',
                position: 2,
                name: categoryLabel(cat, lang),
                item: `${origin}${buildPath(lang, null)}#tools`,
              });
            }
            items.push({
              '@type': 'ListItem',
              position: items.length + 1,
              name,
              item: canonical,
            });
            return items;
          })(),
        },
      ],
    };
  }

  return {
    ...base,
    title: homeTitle(lang),
    description: d.heroSubtitle,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: SITE_NAME,
        url: canonical,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web',
        description: d.heroSubtitle,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        isAccessibleForFree: true,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: d.catalogTitle,
        itemListElement: CATALOG.map((t, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: localizedName(t.id, lang),
          url: origin + buildPath(lang, t.id),
        })),
      },
    ],
  };
}
