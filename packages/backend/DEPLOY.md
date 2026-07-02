# Deploying @zii/backend

The backend unlocks **document conversion** (Word/PowerPoint/PDF routes) and an
optional **live FX proxy** for the app. It is stateless and no-retention by
design — bytes stream through and are never stored.

## What you need

| Route | Worker | Used by |
|-------|--------|---------|
| `POST /convert?from=&to=` | LibreOffice via [Gotenberg](https://gotenberg.dev/) or similar | `docx-to-pdf`, `pptx-to-pdf`, `pdf-to-word` |
| `GET /fx?from=&to=` | Optional upstream FX API (Frankfurter, etc.) | `currency-convert` live rates |

Supported `from` / `to` pairs depend on your Gotenberg/LibreOffice setup. Typical
pairs:

- `docx` → `pdf`
- `pptx` → `pdf`
- `pdf` → `docx`

## Minimal Node server

```ts
import { createBackendServer } from '@zii/backend';
import { gotenbergConvert } from './your-gotenberg-adapter'; // you implement

const server = createBackendServer({
  doConvert: gotenbergConvert,
  fetchFxRate: async (from, to) => {
    const res = await fetch(
      `https://api.frankfurter.app/latest?from=${from}&to=${to}`,
    );
    const data = await res.json();
    return data.rates[to];
  },
});

server.listen(8787, () => console.log('backend on :8787'));
```

Wire the app with:

```bash
VITE_BACKEND_URL=https://api.your-domain.com
```

## Docker Compose (Gotenberg + backend)

Example stack — adjust the `doConvert` adapter in your deployment repo to POST
files to Gotenberg's `/forms/libreoffice/convert` endpoint:

```yaml
services:
  gotenberg:
    image: gotenberg/gotenberg:8
    ports:
      - '3000:3000'

  zii-backend:
    build: ./packages/backend
    environment:
      GOTENBERG_URL: http://gotenberg:3000
      PORT: '8787'
    ports:
      - '8787:8787'
    depends_on:
      - gotenberg
```

## Health check

```bash
curl -sS "http://localhost:8787/fx?from=USD&to=EUR"
# → {"rate":0.92,...}

curl -sS -X POST "http://localhost:8787/convert?from=docx&to=pdf" \
  --data-binary @sample.docx -o out.pdf
```

## Security notes

- Put the backend behind HTTPS and rate limiting in production.
- Do not log request bodies.
- CORS: allow only your app origin if the browser calls the backend directly.
