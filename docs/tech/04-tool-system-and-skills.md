# 04 — The Tool System ("Skills") and the AI/ML Layer

This is the heart of the app: how ~319 tools ("skills") are declared, registered,
localized, market-gated, and lazily loaded — and, separately, where actual **AI/ML**
appears and how the catalog is made **discoverable by AI agents**.

> **Terminology.** The product calls each capability a **"tool."** Because you asked
> about "AI skills," this pack uses **"skill" = one tool** — a self-contained,
> single-purpose capability the app exposes. Be precise about one thing: **the tools are
> deterministic utilities, not LLM prompts.** The genuinely AI/ML skills are a small
> subset (OCR, background removal); the "AI" you'll otherwise see is a *discoverability*
> layer plus a *planned* future phase. All three are documented below.

## 1. Anatomy of a skill (tool)

A tool = **static serializable metadata** + a **lazy loader**. The contract lives in
`packages/registry/src/types.ts`:

```ts
export interface ToolMeta {
  id: string;              // unique, kebab-case (e.g. "jp-furusato")
  name: string;            // display name or i18n key
  category: ToolCategory;  // one of 12
  markets: Market[];       // where it shows; 'global' = everywhere
  offline: boolean;        // true = runs fully on-device, no network
  keywords?: string[];     // free-text search
}
export type ToolLoader = () => Promise<{ default: unknown }>;   // dynamic import → code-split
export interface ToolEntry extends ToolMeta { load: ToolLoader }
```

The registry itself (`packages/registry/src/registry.ts`) is a ~65-line `ToolRegistry`
class over a `Map<string, ToolEntry>`:

- `register(meta, load)` — enforces kebab-case ids and rejects duplicates.
- `list(market?)` — market filter (`global` always included).
- `search(query, market?)` — substring match on id/name/keywords, market-scoped.
- `load(id)` — awaits the loader and returns its `default` export (the lazy path).

The reference implementation is `@zii/hello-tool`: a `ToolMeta` constant + a
`registerHelloTool(registry)` that calls `registry.register(meta, () => import('./hello'))`.
Every real tool follows this shape.

## 2. The single source of truth: `catalog.ts`

The app does **not** register tools by hand-writing `ToolMeta` in 319 places. Instead one
array drives everything: `packages/app/src/lib/catalog.ts` exports
`CATALOG: readonly CatalogTool[]`, where each entry is:

```ts
interface CatalogTool {
  id: string;
  category: ToolCategory;
  offline: boolean;
  keywords: readonly string[];
  name: L10n;      // { en: string } & Partial<Record<Lang, string>>
  blurb: L10n;
  markets?: readonly Market[];   // defaults to ['global']
}
```

Its docstring says it plainly: it "drives the registry metadata, the localized UI labels,
and the SEO prerenderer, so the three never drift apart." From this one array:

- **Registry metadata** — `metaFor(id)` projects a `CatalogTool` → `ToolMeta`.
- **UI labels** — `localizedName(id, lang)` / `localizedBlurb(id, lang)` (with
  `NAME_OVERRIDES` from `tool-names-extra.ts` winning over the catalog).
- **SEO/LLM assets** — the prerenderer reads the same `CATALOG`.

## 3. How a skill is wired (the "tool-screen contract")

`packages/app/src/tools/index.ts` connects catalog → registry → React:

```ts
const LOADERS: Record<string, ViewLoader> = {
  'pdf-merge': () => import('./pdf-merge'),
  'jp-furusato': () => import('./jp-furusato'),
  // …318 entries
};
const APP_TOOLS = CATALOG.filter(t => LOADERS[t.id]).map(t => ({ meta: metaFor(t.id), load: LOADERS[t.id] }));
export const TOOL_VIEWS = /* id → React.lazy(loader) */;
export function registerAppTools(registry) { for (const t of APP_TOOLS) registry.register(t.meta, t.load); }
export function prefetchTool(id) { /* warm the chunk on hover/focus (idempotent) */ }
```

Each tool screen is a **thin React component** that imports engine functions and hands
them to a shared presentational component. Canonical example
(`packages/app/src/tools/tw-national-id.tsx`):

```tsx
import { validateTwNationalId, generateTwNationalId } from '@zii/id';
import { IdTool } from '../components/IdTool';
import { tr } from './types';

const L = { en: {/* strings */}, 'zh-TW': {/* strings */} };

export default function TwNationalIdTool(p: ToolViewProps) {
  const t = tr(L, p.lang);
  return (
    <IdTool {...p} title={t.title} validate={validateTwNationalId}
            generate={generateTwNationalId} placeholder="A123456789" strings={t} />
  );
}
```

The **tool-screen contract** every tool follows: `ToolViewProps` in
(`{ onBack, lang, backLabel, offlineLabel }`) → build a per-tool `LangDict` of strings
→ call an engine (pure function) → render via a shared component (`IdTool`, `ToolPage`,
or the `ui/*` primitives) → any output (a `Blob` download, copied text) stays on device.

**Runtime flow** (`App.tsx`): `Suspense` shows a loading/`loadingEngine` fallback while
`React.lazy` fetches the chunk; an `ErrorBoundary` (keyed on the tool id) isolates a
crashing tool so "the rest of the app is unaffected." If a catalog id has no view module,
the shell renders a graceful "coming soon" `ToolPage`.

## 4. Localization & market gating (two independent axes)

**Language (8 UI languages)** — URL-driven `/{locale}/…`, held in `App.tsx` `lang` state,
resolved by a tiny in-house scaffold (`i18n.ts`, no i18next). Chrome strings come from a
typed `DICTIONARY`; tool names/blurbs, category labels, and market labels are all `L10n`
maps with English required and other locales optional (fallback to English).

**Market (20 + global)** — a tool declares `markets: Market[]`; the registry's
`list/search(market)` includes it only if it lists `global` or the active market. The
shell's market `<Select>` (over `SELECTABLE_MARKETS`) sets the `market` state; region tools
appear only in their market. This is **registry-metadata gating** at the UI layer.

A **second, deeper gating axis** exists in `@zii/locale` for engines: a locale pack's
`tools.enabled: string[]` and `toggles: Record<string, boolean>` select rules/tools by
data. See [`05-engines.md`](05-engines.md) §locale-packs. The maxim: **localization is
config + data, not new code.**

## 5. Code-splitting & the bundle budget

Every tool is a separate dynamic `import()`, so the initial download contains only the
shell — not 319 tools. React is pinned to its own long-cached `vendor-react` chunk. The
catalog component itself is lazy (kept out of the home payload). A build-time gate
(`scripts/check-bundle.mjs`) sums the gzipped **initial** payload (entry + static imports)
and **fails the build above 128 KB gz**. This is what lets "breadth without bloat" scale
to hundreds of skills.

## 6. Where AI / ML actually appears

Be accurate with stakeholders about this. Three distinct things get called "AI":

### (a) On-device ML skills (shipping today)
- **OCR** — `tesseract.js` (`packages/app/src/tools/ocr.tsx`). Runs a downloaded ML model
  in the browser on an uploaded image; no camera, no upload. `offline: false` because the
  model downloads on first use.
- **Background removal** — `@imgly/background-removal` (`bg-remove.tsx`). On-device ML
  segmentation model.

These are real machine-learning capabilities, but they run locally and are a small subset
of the catalog (the vast majority of skills are deterministic algorithms).

### (b) LLM / AI-agent discoverability layer (shipping today)
The build emits machine-readable catalog artifacts so **AI agents and crawlers** can find,
describe, and deep-link individual skills:
- `llms.txt` — machine summary: tools, categories, regions, languages.
- `llms-full.txt` — expanded per-category catalog with keywords and per-locale entrypoints.
- `llms/{category}.txt` — one index per category (12).
- `tools.json` — structured JSON inventory: every tool's id, category, offline flag,
  markets, keywords, and per-language name/description/URLs.
- `ai.txt` — AI/agent access policy pointing at the above, with a privacy note.
- `robots.txt` — explicitly **allows ~16 named AI crawlers** (GPTBot, ClaudeBot,
  PerplexityBot, Google-Extended, Applebot-Extended, CCBot, …).

This is discovery *of* the app *by* AI — not AI *in* the app. See
[`06-frontend-app.md`](06-frontend-app.md) §SEO for how these are generated.

### (c) The planned "AI layer" (Phase 5 — NOT built)
The roadmap reserves an AI phase: natural-language tool routing, on-device receipt/form
field extraction, smart reminder extraction from text, and market-aware guidance. Firm
constraints already written down: it must **degrade gracefully offline**, **never silently
upload PII**, and stay an *enhancement over* the deterministic engines, never a
replacement. **None of this exists yet** — do not represent it as implemented. See
[`12-roadmap-and-directions.md`](12-roadmap-and-directions.md).

## 7. Category taxonomy

12 categories (`ToolCategory`), displayed in this order (`categories.ts` `CATEGORY_ORDER`):
`pdf, image, text, dev, calc, finance, convert, datetime, generator, id, file, daily`. Each
has a localized label (8 languages), an accent color (`CATEGORY_COLOR`), and an SVG icon
(`icons.ts`, shared by React and the string prerenderer). Large categories (dev, text,
convert, generator, finance) split into curated sub-sections via `subcategories.ts` so a
100-tool category stays scannable.
