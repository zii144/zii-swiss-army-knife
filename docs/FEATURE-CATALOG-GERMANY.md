# Zii — Germany Feature Catalog (`de`)

Last updated: 2026-07-12

## Demand basis
Sparkasse / Handelsblatt / Finanzfluss / Stiftung Warentest Brutto-Netto; BMF Lohnsteuer category. Sticky jobs: Brutto→Netto, Einkommensteuer, MwSt, IBAN/PLZ/IdNr, Feiertage, Urlaub, Pendlerpauschale, Abfindung.

## Shipped tools (10)
| Tool | Job | Source refresh |
|------|-----|----------------|
| de-takehome | Brutto-Netto | Jan (SV + Grundfreibetrag) |
| de-income-tax | Einkommensteuer estimate | Jan |
| de-vat | MwSt 19% | Rate changes rare |
| de-iban | IBAN | Stable |
| de-plz | PLZ | Stable |
| de-tax-id | IdNr format | Stable |
| de-holidays | Federal Feiertage | Annual calendar |
| de-vacation | Urlaubsanspruch | Stable statute |
| de-commute | Pendlerpauschale | Rate changes |
| de-severance | Abfindung 1/5 rule | Estimate only |

## Maintenance calendar
- **January:** SV rates, Grundfreibetrag, KV-Zusatz average
- **December:** next-year Feiertage list

## Non-goals
Official BMF Lohnsteuer exact engine, Schufa, ELSTER filing.

## Sources
- https://www.bundesfinanzministerium.de
