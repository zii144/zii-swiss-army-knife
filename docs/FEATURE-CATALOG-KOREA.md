# Zii — Korea Feature Catalog (`ko`)

Last updated: 2026-07-12

## Demand basis
Saramin / JobKorea salary calculators, Ktoolio, CalcTools, jptcalc, JiniTools BRN validators. Sticky jobs: 실수령액, 4대보험, 퇴직금, 연차, 연장수당, 사업자등록번호, 주민등록번호 (format only), 우편번호, 휴대폰, 부가세.

## Shipped tools (10)
| Tool | Job | Source refresh |
|------|-----|----------------|
| ko-takehome | 실수령액 | Jan (4대보험 + 간이세액 approx) |
| ko-four-insurances | 4대보험 breakdown | Jan |
| ko-severance | 퇴직금 | Labor law stable |
| ko-annual-leave | 연차 / 수당 | Labor Standards Act |
| ko-overtime | 연장·야간·휴일 | Labor Standards Act |
| ko-brn | 사업자등록번호 | Stable checksum |
| ko-rrn | 주민등록번호 format | Stable checksum |
| ko-postal | 우편번호 | Stable |
| ko-phone | 휴대폰 | Stable |
| ko-vat | 부가세 10% | Stable |

## Maintenance calendar
- **January:** NP / HI / LTC / EI employee rates; withholding table approximation

## Non-goals
홈택스 live status, full 연말정산 filing, NFC transit.

## Sources
- https://www.nps.or.kr / https://www.nhis.or.kr / https://www.hometax.go.kr
