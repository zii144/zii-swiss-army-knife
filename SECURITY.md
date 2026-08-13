# Security

Report security issues for **Zii** (`https://zii.tools`) by email.

**Contact:** [privacy@zii.tools](mailto:privacy@zii.tools)

Please include:

- A description of the issue and the affected URL or tool id
- Steps to reproduce, or a proof of concept that does not include exploit payloads against third parties
- The impact you expect (data exposure, XSS in the PWA shell, supply-chain, etc.)

We do not currently run a paid bug-bounty program. We will acknowledge reports that describe a real vulnerability in this project.

## Scope

In scope: the static PWA at `zii.tools`, this repository, and the optional conversion worker if it is deployed under a `zii.tools` subdomain.

Out of scope: third-party model CDNs, the public Frankfurter FX API, social-engineering, and physical security.

## Public policy

- Machine-readable contact: `https://zii.tools/.well-known/security.txt`
- Privacy: `https://zii.tools/en/privacy`
- Architecture notes: `docs/tech/11-security-and-privacy.md`

Do not file public GitHub issues for unreleased vulnerabilities.
