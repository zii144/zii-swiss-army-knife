# 11 — Security & Privacy

Privacy is the product's core promise, and it is enforced **architecturally**, not just as
policy text. There is no dedicated `SECURITY.md`/`PRIVACY.md`; the posture lives in
`vercel.json`, `DEVELOPMENT-PLAN.md §4`, `docs/TECH-STACK-PLAN.md §13`, and per-package
READMEs. This doc consolidates it.

## HTTP security headers (`vercel.json`, all routes)

| Header | Value / effect |
|--------|----------------|
| **Content-Security-Policy** | `default-src 'self'`; `object-src 'none'`; `frame-ancestors 'none'`; `base-uri 'self'`; `form-action 'self'`; `script-src 'self' 'wasm-unsafe-eval' blob:`; `worker-src 'self' blob:`; `connect-src 'self' https: data: blob:`; `style-src 'self' 'unsafe-inline'`; `img/media/font-src` self+data/blob; `upgrade-insecure-requests` |
| **Cross-Origin-Opener-Policy** | `same-origin` |
| **Cross-Origin-Embedder-Policy** | `require-corp` |
| **Permissions-Policy** | camera, microphone, geolocation, payment, usb, magnetometer, gyroscope, accelerometer all `()`; `interest-cohort=()` (opt out of FLoC) |
| **X-Content-Type-Options** | `nosniff` |
| **X-Frame-Options** | `DENY` |
| **Referrer-Policy** | `strict-origin-when-cross-origin` |
| **Strict-Transport-Security** | `max-age=31536000; includeSubDomains` |

Notes:
- `script-src` allows **WASM compile** (`'wasm-unsafe-eval'`) and **blob-URL workers**
  but **no remote scripts** — nothing loads third-party JS.
- **COOP + COEP** give cross-origin isolation so `ffmpeg.wasm` can use `SharedArrayBuffer`
  (multi-threaded). Trade-off: non-CORP third-party embeds won't load inside the shell.
- `connect-src 'self' https:` permits on-demand WASM/model CDNs and the Frankfurter FX API.
- These were added 2026-07-11 and **verified in-browser**: the app renders, WASM compiles
  under the policy, blob workers run, and there are **zero CSP violations**.

## How "no PII leaves the device" is actually enforced

1. **Compute is on-device by default.** Engines are pure TypeScript; heavy jobs run as
   client-side WASM (`@zii/compute-wasm`). Sensitive inputs — salary, tax, national ID,
   financial documents — never leave the browser. Only **7 of ~319** catalog tools are
   `offline: false` (the model/network ones: OCR, background-remove, live FX, doc
   conversion, video/audio).
2. **The camera is structurally unavailable.** `Permissions-Policy: camera=()` means nothing
   can call `getUserMedia`; OCR works only on user-uploaded files.
3. **The backend is opt-in and no-retention.** Upload happens only for document conversion /
   live FX, and only if `VITE_BACKEND_URL` is set. The no-retention guarantee is a **tested
   structural invariant** — `retainedCount()` must always return `0` — not a promise.
4. **No gov-auth proxying, no money movement.** (Guardrail §4.8.) The app calculates,
   organizes, and reminds, and **deep-links to official apps** for authenticated services —
   so it never handles credentials or needs payment-institution licensing.
5. **No telemetry, by choice.** The `ErrorBoundary` logs to the console only; crash
   telemetry is "intentionally absent … a deliberate privacy-first choice."
6. **Offline-first.** The hand-rolled service worker + Capacitor packaging mean the app
   works with no network at all.

## Standing security/privacy guardrails (`DEVELOPMENT-PLAN.md §4`)

These are non-negotiable, auto-fail gates in the build loop:

1. **Licensing** — no AGPL; LGPL ffmpeg only; no GPL encoders. Enforced by the license scan.
2. **Privacy / local-first** — pure-TS offline engines; sensitive data on-device and
   encrypted at rest; stateless no-retention backend.
3. **Data integrity** — tax/holiday/FX/insurance values versioned, dated, cited,
   schema-validated, golden-recalculated, and **fail loud** (never fabricated).
4. **Locale-pluggable** — no market logic hard-coded in engines.
5. **WASM discipline** — ffmpeg in a COOP/COEP-isolated worker with a server fallback.
6. **OCR tiering** — native Apple Vision / ML Kit on mobile (planned), tesseract.js web
   fallback only.
7. **NFC reality** — FeliCa transit-balance is a capability-detected bonus, never a launch
   dependency.
8. **No money movement / no gov-auth proxying.**

## Planned hardening (documented, not all implemented)

`docs/TECH-STACK-PLAN.md §13` describes further measures on the roadmap: on-device
encryption of stored sensitive data (WebCrypto-derived keys / SQLCipher-style), optional
**zero-knowledge sync** storing only ciphertext, a regulatory posture across GDPR / UK-GDPR
/ PDPA / PDPO / APPI, SBOM + dependency scanning, and CSP + SRI. Treat these as *direction*,
not shipped features — verify before claiming any specific one is live.

## Supply-chain posture

- **Permissive-only dependency tree** enforced on every build (license scan).
- **Production advisory gate** — `pnpm check:audit` (`pnpm audit --prod --audit-level=high`)
  runs in `pnpm verify` and CI; Dependabot opens weekly npm update PRs
  (`.github/dependabot.yml`).
- **No remote scripts** at runtime (CSP), so no third-party JS supply-chain surface in the
  page.
- Minimal dependency count (hand-rolled router/i18n/SW/backend) reduces attack surface.
- **No secrets in the client.** The static app carries no API keys; the only outbound calls
  are to public/no-auth endpoints (Frankfurter FX) or the user's own optional backend.
