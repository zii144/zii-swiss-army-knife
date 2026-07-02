# Deploying @zii/backend

The backend unlocks **document conversion** (Word/PowerPoint/PDF routes) and an
optional **live FX proxy** for the app. It is stateless and no-retention by
design — bytes stream through and are never stored.

## Quick start (Docker)

From this directory:

```bash
docker compose up
```

| Service | Port | Purpose |
|---------|------|---------|
| Gotenberg | 3000 | LibreOffice document conversion |
| `@zii/backend` | 8787 | `/convert`, `/fx`, `/health` |

Point the app at the backend:

```bash
VITE_BACKEND_URL=http://localhost:8787 pnpm --filter @zii/app dev
```

## What you need

| Route | Worker | Used by |
|-------|--------|---------|
| `POST /convert?from=&to=` | Gotenberg LibreOffice | `docx-to-pdf`, `pptx-to-pdf`, `pdf-to-word` |
| `GET /fx?from=&to=` | Frankfurter (cached) | `currency-convert` live rates |
| `GET /health` | — | load balancer probe |

Supported conversion routes (via Gotenberg):

- `docx` → `pdf`
- `pptx` → `pdf`
- `xlsx` → `pdf`
- `pdf` → `docx` (best-effort; many Gotenberg builds only guarantee office → PDF)

## Run without Docker

1. Start [Gotenberg](https://gotenberg.dev/) locally on port 3000.
2. Start the backend:

```bash
pnpm --filter @zii/backend start
```

Environment variables:

| Variable | Default | Purpose |
|----------|---------|---------|
| `PORT` | `8787` | HTTP listen port |
| `GOTENBERG_URL` | `http://127.0.0.1:3000` | Gotenberg base URL |
| `CORS_ORIGIN` | `*` | Browser origin allowed to call the API |

## Production wiring

Set in Vercel (or your app host):

```
VITE_BACKEND_URL=https://api.your-domain.com
```

Set on the backend host:

```
CORS_ORIGIN=https://your-app-domain.com
GOTENBERG_URL=http://gotenberg:3000
```

Deploy Gotenberg as a sidecar or internal service; expose only `@zii/backend` publicly.

## Health check

```bash
curl -sS http://localhost:8787/health
curl -sS "http://localhost:8787/fx?from=USD&to=EUR"
curl -sS -X POST "http://localhost:8787/convert?from=docx&to=pdf" \
  --data-binary @sample.docx -o out.pdf
```

## Security notes

- Put the backend behind HTTPS and rate limiting in production.
- Do not log request bodies.
- CORS: set `CORS_ORIGIN` to your app origin — avoid `*` in production.

## Programmatic use

```ts
import { createBackendServer, createGotenbergConverter } from '@zii/backend';

const server = createBackendServer({
  fetchEtaRaw: async () => {
    throw new Error('ETA not configured');
  },
  doConvert: createGotenbergConverter(process.env.GOTENBERG_URL!),
  fetchFxRate: async (from, to) => { /* ... */ },
  corsOrigin: process.env.CORS_ORIGIN,
});

server.listen(8787);
```
