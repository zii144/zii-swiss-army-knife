import { DICTIONARY, HREFLANG, LANGS, type Lang } from './i18n';
import { CATALOG, getTool, localizedBlurb, localizedName } from './catalog';
import { categoryDescription, categoryKeywords, categoryLabel } from './categories';
import { buildPath, type AppView } from './router';

/** Public origin used for canonical/alternate URLs in prerendered output. */
export const SITE_ORIGIN = 'https://zii.tools';
export const SITE_NAME = 'Zii';
export const SITE_TAGLINE =
  'Privacy-first browser tools for files, PDFs, images, text, calculators, generators, and developer utilities.';
/** PNG social preview — many unfurlers cannot render SVG. */
export const SITE_IMAGE_PATH = '/icon-512.png';
export const SITE_IMAGE = `${SITE_ORIGIN}${SITE_IMAGE_PATH}`;
export const SITE_IMAGE_TYPE = 'image/png';
export const SITE_IMAGE_WIDTH = 512;
export const SITE_IMAGE_HEIGHT = 512;

export interface AltLink {
  hreflang: string;
  href: string;
}

export interface HeadMeta {
  lang: Lang;
  htmlLang: string;
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  alternates: AltLink[];
  /** JSON-LD objects to embed as <script type="application/ld+json">. */
  jsonLd: object[];
}

/** Market → country name for geo-targeting (schema.org areaServed). */
const MARKET_COUNTRY: Readonly<Record<string, string>> = {
  tw: 'Taiwan',
  hk: 'Hong Kong',
  jp: 'Japan',
  'en-us': 'United States',
  'en-gb': 'United Kingdom',
  'en-ca': 'Canada',
  'en-au': 'Australia',
};

/** schema.org Country[] a market-specific tool serves (empty for global tools). */
function areaServedFor(markets: readonly string[] | undefined): object[] {
  if (!markets) return [];
  const seen = new Set<string>();
  const out: object[] = [];
  for (const m of markets) {
    const name = MARKET_COUNTRY[m];
    if (name && !seen.has(name)) {
      seen.add(name);
      out.push({ '@type': 'Country', name });
    }
  }
  return out;
}

const SITE_KEYWORDS = [
  'online tools',
  'browser tools',
  'offline tools',
  'privacy-first tools',
  'file converter',
  'PDF tools',
  'image tools',
  'text tools',
  'calculators',
  'developer tools',
];

function homeTitle(lang: Lang): string {
  const d = DICTIONARY[lang];
  return `${SITE_NAME} — ${d.heroTitleA} ${d.heroTitleB}`.replace(/,$/, '');
}

/** hreflang alternates for a route across every locale, plus x-default (en). */
export function alternatesFor(origin: string, view: AppView, routeId: string | null): AltLink[] {
  const links: AltLink[] = LANGS.map((l) => ({
    hreflang: HREFLANG[l],
    href: origin + buildPath(l, view, routeId),
  }));
  links.push({ hreflang: 'x-default', href: origin + buildPath('en', view, routeId) });
  return links;
}

/** Build all head metadata + structured data for a given route + locale. */
export function buildHead(
  origin: string,
  lang: Lang,
  view: AppView,
  routeId: string | null,
): HeadMeta {
  const d = DICTIONARY[lang];
  const canonical = origin + buildPath(lang, view, routeId);
  const alternates = alternatesFor(origin, view, routeId);
  const base = {
    lang,
    htmlLang: HREFLANG[lang],
    canonical,
    alternates,
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: 'Zii Swiss Army Knife',
    url: origin + buildPath(lang, 'home'),
    description: d.heroSubtitle,
    inLanguage: HREFLANG[lang],
    potentialAction: {
      '@type': 'SearchAction',
      target: `${origin + buildPath(lang, 'tools')}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const publisherJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: origin + buildPath(lang, 'home'),
    logo: `${origin}${SITE_IMAGE_PATH}`,
  };

  if (view === 'tool' && routeId) {
    const tool = getTool(routeId);
    const name = localizedName(routeId, lang);
    const description = localizedBlurb(routeId, lang) || d.heroSubtitle;
    const category = tool?.category;
    const areaServed = areaServedFor(tool?.markets);
    const keywords = [
      name,
      ...(tool?.keywords ?? []),
      ...(category ? [categoryLabel(category, lang), `${category} tool`] : []),
      ...SITE_KEYWORDS.slice(0, 4),
    ];
    return {
      ...base,
      title: `${name} — ${SITE_NAME}`,
      description,
      keywords: Array.from(new Set(keywords)),
      jsonLd: [
        websiteJsonLd,
        {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name,
          alternateName: `${name} — ${SITE_NAME}`,
          applicationCategory: 'UtilitiesApplication',
          applicationSubCategory: category ? categoryLabel(category, lang) : undefined,
          operatingSystem: 'Web',
          description,
          url: canonical,
          image: `${origin}${SITE_IMAGE_PATH}`,
          publisher: { '@type': 'Organization', name: SITE_NAME, url: origin },
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          isAccessibleForFree: true,
          browserRequirements: 'Requires a modern browser with JavaScript enabled.',
          featureList: [
            description,
            'Runs in the browser',
            'No account required',
            tool?.offline ? 'Works offline after loading' : 'Web-based utility',
            'No server-side data retention',
          ],
          inLanguage: HREFLANG[lang],
          keywords: Array.from(new Set(keywords)).join(', '),
          ...(areaServed.length > 0 ? { areaServed } : {}),
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: (() => {
            const items: object[] = [
              {
                '@type': 'ListItem',
                position: 1,
                name: d.navHome,
                item: origin + buildPath(lang, 'home'),
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: d.navTools,
                item: origin + buildPath(lang, 'tools'),
              },
            ];
            if (category) {
              items.push({
                '@type': 'ListItem',
                position: 3,
                name: categoryLabel(category, lang),
                item: origin + buildPath(lang, 'category', category),
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

  if (view === 'category' && routeId) {
    const name = categoryLabel(routeId, lang);
    const description = categoryDescription(routeId, lang);
    const tools = CATALOG.filter((t) => t.category === routeId);
    const keywords = [
      `${name} tools`,
      ...categoryKeywords(routeId),
      ...Array.from(new Set(tools.flatMap((t) => t.keywords))).slice(0, 24),
      ...SITE_KEYWORDS,
    ];

    return {
      ...base,
      title: `${name} tools — ${SITE_NAME}`,
      description,
      keywords: Array.from(new Set(keywords)),
      jsonLd: [
        websiteJsonLd,
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: `${name} tools`,
          description,
          url: canonical,
          isPartOf: {
            '@type': 'WebApplication',
            name: SITE_NAME,
            url: origin + buildPath(lang, 'home'),
          },
          inLanguage: HREFLANG[lang],
        },
        {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `${name} tools`,
          itemListElement: tools.map((t, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: localizedName(t.id, lang),
            description: localizedBlurb(t.id, lang),
            url: origin + buildPath(lang, 'tool', t.id),
          })),
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: d.navHome,
              item: origin + buildPath(lang, 'home'),
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: d.navTools,
              item: origin + buildPath(lang, 'tools'),
            },
            {
              '@type': 'ListItem',
              position: 3,
              name,
              item: canonical,
            },
          ],
        },
      ],
    };
  }

  if (view === 'tools') {
    const keywords = [
      d.catalogTitle,
      ...SITE_KEYWORDS,
      ...Array.from(new Set(CATALOG.flatMap((t) => t.keywords))).slice(0, 30),
    ];
    return {
      ...base,
      title: `${d.catalogTitle} — ${SITE_NAME}`,
      description: d.catalogSubtitle,
      keywords: Array.from(new Set(keywords)),
      jsonLd: [
        websiteJsonLd,
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: d.catalogTitle,
          description: d.catalogSubtitle,
          url: canonical,
          isPartOf: {
            '@type': 'WebApplication',
            name: SITE_NAME,
            url: origin + buildPath(lang, 'home'),
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: d.catalogTitle,
          itemListElement: CATALOG.map((t, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: localizedName(t.id, lang),
            description: localizedBlurb(t.id, lang),
            url: origin + buildPath(lang, 'tool', t.id),
          })),
        },
      ],
    };
  }

  return {
    ...base,
    title: homeTitle(lang),
    description: d.heroSubtitle,
    keywords: SITE_KEYWORDS,
    jsonLd: [
      websiteJsonLd,
      publisherJsonLd,
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: SITE_NAME,
        alternateName: 'Zii Swiss Army Knife',
        url: canonical,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web',
        description: d.heroSubtitle,
        image: `${origin}${SITE_IMAGE_PATH}`,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        isAccessibleForFree: true,
        inLanguage: HREFLANG[lang],
        featureList: [
          'PDF tools',
          'Image conversion and compression',
          'Text cleanup and formatting',
          'Calculators and unit converters',
          'Developer utilities',
          'QR and barcode generators',
          'Regional identity and format validators',
        ],
      },
    ],
  };
}
