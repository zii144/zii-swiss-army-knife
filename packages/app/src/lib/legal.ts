/** Public legal routes under `/{locale}/{view}`. */

export const LEGAL_VIEWS = ['privacy', 'terms', 'about', 'legal'] as const;
export type LegalView = (typeof LEGAL_VIEWS)[number];

const LEGAL_SET = new Set<string>(LEGAL_VIEWS);

export function isLegalView(view: string): view is LegalView {
  return LEGAL_SET.has(view);
}

/** Operator identity published on the legal pages — no invented street address. */
export const LEGAL_OPERATOR = 'Zii';
export const LEGAL_SITE = 'https://zii.tools';
export const LEGAL_CONTACT = 'privacy@zii.tools';
