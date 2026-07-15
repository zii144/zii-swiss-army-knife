# Zii — France Feature Catalog (`fr`)

Last updated: 2026-07-12

## Demand basis
Official URSSAF mon-entreprise brut/net simulator; bulletin-paie.com 2026 rates. Sticky jobs: brut→net, coût employeur, PAS, TVA, RIB→IBAN, SIREN/SIRET, NIR, code postal, jours fériés, congés payés.

## Shipped tools (10)
| Tool | Job | Source refresh |
|------|-----|----------------|
| fr-brut-net | Brut → net (+ PAS) | Jan (PMSS / cotisations) |
| fr-employer-cost | Coût employeur | Jan |
| fr-pas | PAS amount | User rate / neutre |
| fr-tva | TVA 20% | Rate changes rare |
| fr-iban-rib | RIB → IBAN | Stable |
| fr-siren-siret | SIREN/SIRET Luhn | Stable |
| fr-nir | NIR + clé 97 | Stable |
| fr-code-postal | Code postal | Stable |
| fr-holidays | Jours fériés | Annual (+ Alsace) |
| fr-conges | Congés payés accrual | Stable statute |

## Maintenance calendar
- **January:** PMSS, cotisation approx rates, taux neutre bands
- **December:** next-year jours fériés

## Non-goals
Full impôts.gouv déclaration, live SIRENE API status, URSSAF account.

## Sources
- https://www.urssaf.fr / https://mon-entreprise.urssaf.fr
- https://www.service-public.fr
