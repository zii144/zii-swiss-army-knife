# Zii — Canada Feature Catalog (`en-ca`)

Last updated: 2026-07-12

## Demand basis
Competitor/gov signals: CRA Payroll Deductions Online Calculator (PDOC), CalcCanada, catax.tools, Wealthsimple-style take-home suites. Sticky jobs: take-home (federal + provincial + CPP/CPP2 + EI), GST/HST by province, RRSP/TFSA room, SIN + postal + transit validation.

## Shipped tools (10)
| Tool | Job | Source refresh |
|------|-----|----------------|
| ca-takehome | Gross→net | Jan (CRA rates) |
| ca-income-tax | Federal + provincial estimate | Jan |
| ca-cpp | CPP + CPP2 | Jan (YMPE/YAMPE) |
| ca-ei | EI premiums (QC note) | Jan |
| ca-gst-hst | GST/HST/PST by province | As rates change |
| ca-rrsp | Contribution tax impact | Annual limit |
| ca-tfsa | Room helper | Annual limit |
| ca-postal | Postal code format | Stable |
| ca-transit | Transit + institution | Stable |
| ca-sin | SIN Luhn | Stable |

## Maintenance calendar
- **January:** CPP YMPE/YAMPE, EI rates, federal brackets, BPA
- **Ongoing:** provincial sales-tax rate changes

## Non-goals
Live CRA account lookup, full T1 filing, Quebec QPIP deep modelling beyond EI rate note.

## Sources
- https://www.canada.ca/en/revenue-agency.html
- https://calccanada.ca/
