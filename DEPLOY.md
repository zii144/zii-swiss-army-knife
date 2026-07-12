# Deploying Zii

Zii is a static PWA. The build produces a fully prerendered `dist/` (one crawlable
`index.html` per locale, category, and tool, plus `sitemap.xml`, `robots.txt`,
`ai.txt`, `llms.txt`, `llms-full.txt`, category LLM indexes, `tools.json`, and
`opensearch.xml`).
There is no server runtime — any static host works. The canonical target is **Vercel**.

## Vercel (recommended)

The repo ships a [`vercel.json`](./vercel.json) at the root. Import the Git repo in the
Vercel dashboard and it picks up the config automatically — no framework preset needed.

| Setting | Value | Source |
| --- | --- | --- |
| Install command | `pnpm install --frozen-lockfile` | `vercel.json` |
| Build command | `pnpm --filter @zii/app build` | `vercel.json` |
| Output directory | `packages/app/dist` | `vercel.json` |
| Node version | 20.x (or newer) | repo `engines` |
| Package manager | pnpm 9.15 | root `packageManager` |

`framework` is set to `null` so Vercel does not override the output directory with its
Vite preset. `cleanUrls` serves the prerendered `…/index.html` files at extension-less
paths, `/` permanently redirects to `/en`, and a catch-all rewrite falls back to the SPA
shell for any route that has no prerendered file (client-side navigation). Hashed assets
under `/assets/**` are served `immutable` for a year; `sw.js` is served `must-revalidate`
so updates roll out promptly.

### Environment variables

| Variable | Purpose | Default |
| --- | --- | --- |
| `ZII_ORIGIN` | Absolute origin used for canonical URLs, `hreflang` alternates, Open Graph URLs, sitemap entries, and JSON-LD. **Set this to the production domain** (e.g. `https://zii.tools`) in Vercel → Project → Settings → Environment Variables, for all environments. | `https://zii.tools` (from `SITE_ORIGIN` in `src/lib/seo.ts`) |
| `VITE_BACKEND_URL` | Optional `@zii/backend` base URL for document conversion and live FX (e.g. `https://api.zii.tools`). Build-time only — set in Vercel for Production if you deploy the backend. | unset (tools show a setup hint; Frankfurter fallback for FX) |

If `ZII_ORIGIN` is unset the build falls back to the compiled-in `SITE_ORIGIN`, so a
preview deploy still produces valid absolute URLs — they will just point at the
production origin. Set `ZII_ORIGIN` per-environment if preview URLs must be self-canonical.

### Cross-origin isolation (video / audio WASM)

`vercel.json` sets `Cross-Origin-Opener-Policy: same-origin` and
`Cross-Origin-Embedder-Policy: require-corp` so ffmpeg.wasm can use
`SharedArrayBuffer` in production. Third-party embeds that are not CORP-compatible
will not load inside the app shell.

## Optional backend (`@zii/backend`)

Document conversion (Word/PPT → PDF, PDF → Word) and proxied live FX need a deployed
backend worker. See [`packages/backend/DEPLOY.md`](./packages/backend/DEPLOY.md).

Quick local stack:

```bash
cd packages/backend && docker compose up
# → Gotenberg :3000, @zii/backend :8787
pnpm --filter @zii/app dev   # VITE_BACKEND_URL=http://localhost:8787
```

## What the build runs

`pnpm --filter @zii/app build` executes, in order:

1. `vite build` — the SPA bundle (workspace engine packages are consumed as TS source, so
   no separate package build is required).
2. `node scripts/check-bundle.mjs` — enforces the entry bundle budget (fails the build if
   the gzipped entry + its static imports exceed 110 KB).
3. `vite build --ssr src/lib/prerender-entry.ts` — a DOM-free bundle of the locale/SEO
   helpers.
4. `node scripts/prerender.mjs` — emits the per-locale / per-category / per-tool static
   HTML, `sitemap.xml`, `robots.txt`, `ai.txt`, `llms.txt`, `llms-full.txt`, category LLM indexes,
   `tools.json`, and `opensearch.xml` into `dist/`.

## Other static hosts

Any static host works if you replicate the two behaviors `vercel.json` encodes:

- **Directory-index / clean URLs** — serve `…/index.html` for extension-less paths.
- **SPA fallback** — serve the root `index.html` for paths with no matching file so the
  client router can take over.
- **Root redirect (recommended)** — permanently redirect `/` to `/en` to avoid duplicate
  English home URLs.

Netlify: set publish directory to `packages/app/dist`, build command
`pnpm --filter @zii/app build`, and add a `/* /index.html 200` redirect (lowest priority,
after static files). Cloudflare Pages: same build/output; enable
"Single-page application" fallback.

## Local production preview

```bash
pnpm --filter @zii/app build
pnpm --filter @zii/app preview   # serves dist/ on http://localhost:4173
```
