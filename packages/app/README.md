# @zii/app — UI System & PWA App Shell (M3)

The web app shell for the Zii Swiss Army Knife suite. It hosts the **tool
registry surface** (the command-palette-style list of tools) and the
progressive-web-app plumbing that every market shares.

## What it does

- **Registry UI** — builds a registry via `createRegistry()` from
  [`@zii/registry`](../registry), registers tools (currently
  `registerHelloTool` from [`@zii/hello-tool`](../hello-tool)), and renders the
  tool list filtered by:
  - a **Market** `<select>` (`global / tw / hk / jp / en-us`), backed by
    `ToolRegistry.list(market)`; and
  - a **search box** that calls `ToolRegistry.search(query, market)`.
- **Dark-mode toggle** — flips an `app--dark` class on the root element; all
  colors are CSS custom properties, so theming is class-driven.
- **In-house i18n** — a plain dictionary (`en`, `zh-TW`) with a `useT(lang)`
  helper and a language switch. No `i18next` dependency on purpose; the
  scaffold is intentionally tiny and fully typed.
- **PWA** — a hand-rolled `public/manifest.webmanifest` and
  `public/sw.js` (app-shell cache). The manifest is linked from `index.html`
  and the service worker is registered from `src/main.tsx` (guarded by a
  `'serviceWorker' in navigator` check). `vite-plugin-pwa` is deliberately
  **not** used — the static files are hand-rolled to avoid build-time risk.

## Layout

```
packages/app/
  index.html              # entry HTML, links the manifest
  vite.config.ts          # @vitejs/plugin-react
  public/
    manifest.webmanifest  # PWA manifest
    sw.js                 # hand-rolled service worker (app-shell cache)
    icon.svg              # app icon
  src/
    main.tsx              # React root + service-worker registration
    App.tsx               # registry UI (market filter, search, dark mode, lang)
    styles.css            # theme via CSS variables
    env.d.ts              # ambient module decl for *.css imports
    lib/
      tools.ts            # PURE: filterTools / formatToolCount / marketLabel
      i18n.ts             # PURE: dictionary + useT()
  test/
    tools.test.ts         # unit tests for the registry-filter logic
    i18n.test.ts          # unit tests for the i18n scaffold
```

Pure, framework-free logic lives in `src/lib/` and is unit-tested with Vitest.
The React component consumes that logic but is not DOM-tested here.

## Scripts

```bash
pnpm --filter @zii/app dev        # vite dev server
pnpm --filter @zii/app build      # vite production build -> dist/
pnpm --filter @zii/app typecheck  # tsc -p tsconfig.json (noEmit)
pnpm --filter @zii/app test       # vitest run
pnpm --filter @zii/app lint       # eslint .
```

## Follow-ups

- **Playwright E2E** is a planned follow-up. Browser binaries cannot be
  installed in the current build sandbox, so end-to-end coverage (driving the
  market filter, search, dark mode, and verifying service-worker registration)
  is deferred until a CI environment with browsers is available. The pure
  logic in `src/lib/` is covered by unit tests in the meantime.
