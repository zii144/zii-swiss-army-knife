# 07 — Design System

A single stylesheet (`packages/app/src/styles.css`, ~2,600 lines) imported once in
`main.tsx`. No CSS framework, no CSS-in-JS, no utility classes — plain **BEM-ish class
names driven by CSS custom properties**. Theming works by overriding variables, so
components never branch on theme.

## Visual identity

> "Blue-sky gradient, lime accent, glassmorphism cards, bold display type." — the header
> comment in `styles.css`.

The aesthetic is a **bright blue sky** page background with a **lime "sun" glow**, content
floating on **frosted-glass cards**, and large confident display typography. It is
deliberately friendly and consumer-facing (not a dev-tool gray).

## Design tokens (`:root`)

All color/spacing/motion is expressed as CSS custom properties so themes are a variable
swap:

| Group | Tokens | Example values |
|-------|--------|----------------|
| Brand | `--lime`, `--lime-strong`, `--ink-pill` | `#c6f24e`, `#b4e636`, `#0c1322` |
| Sky gradient | `--sky-top`, `--sky-mid`, `--sky-low` | `#2b66c4`, `#4d92dc`, `#c4ddf2` |
| Glass surfaces | `--glass`, `--glass-2`, `--glass-border`, `--glass-shadow` | translucent whites + soft shadow |
| Ink / text | `--ink`, `--ink-soft` | `#0b1730`, `#4a586f` |
| Text on blue | `--on-blue`, `--on-blue-soft`, `--on-blue-faint` | white at 97/78/55% |
| Form controls | `--field-bg`, `--menu-bg`, `--option-active`, scrollbar tokens | — |
| Compat aliases | `--bg`, `--fg`, `--muted`, `--border`, `--accent` | used by older tool markup |
| Motion | `--ease-out`, `--ease-in-out`, `--dur-1/2/3` | 140 / 240 / 420 ms |

Font stack: **Inter** → `system-ui` → `-apple-system` → Segoe UI → Roboto → …

## Dark mode

A `.app--dark` class (toggled by the `dark` state in `App.tsx`) **overrides the same custom
properties** — darker ink, deep-night sky stops (`#0a1834`/`#122a52`/`#1b3c6e`), a lighter
accent (`#8cc6ff`), `color-scheme: dark`. Because components read variables, none of them
branch on theme. This is a **manual toggle** (☾/☀ in the nav); there is currently **no
`prefers-color-scheme` auto-detection**.

## Layout & signature effects

- **Fixed full-page background** — a stack of radial gradients (a lime sun glow upper-right,
  a cool counter-glow lower-left, white highlights) over a vertical blue gradient,
  `background-attachment: fixed`.
- **Film grain** — an SVG fractal-noise overlay (`.app::before`, `mix-blend-mode:
  soft-light`) adds tactile texture felt but not seen.
- **Clouds** — a soft cloud band (`.app::after` + the `Clouds` component; the same SVG is
  inlined as `CLOUDS_SVG` in the prerenderer so static pages match).
- **Glassmorphism cards** — `backdrop-filter: blur(...)`, translucent `--glass` fills,
  soft `--glass-shadow`. The hero deck fans cards with per-`nth-child` rotate transforms;
  category hub cards tint per category via `--cat` + `color-mix()`.
- **Tool grid** — `.app__list` auto-fill `minmax(15.5rem, 1fr)`; a sticky tool sidebar
  (`.toolnav`) with themed custom scrollbars; a 3-column footer.
- **Typography** — fluid `clamp()` hero title, weight 800, tight letter-spacing.

## Component styling conventions

- Shared UI primitives (`components/ui/*`) are styled by `.ui-*` classes (`.ui-input`,
  `.ui-textarea`, `.ui-select` with a custom dropdown menu, `.ui-range`, `.ui-file` with a
  signature ＋→✕ rotate on hover, `.ui-btn--primary/ghost`).
- Tool screens share a `.tool*` vocabulary (`.tool__body`, `__field`, `__actions`,
  `__primary`, `__result`, `__rows`, `__stats`, `__group`, `.ztable`, `.diff`, …). Holiday
  lists share a `.tool__list` style.
- **Accent color per category** comes from `CATEGORY_COLOR` in `catalog.ts` (JS, not CSS),
  applied inline as `color` / `--cat` (e.g. `pdf #ef5350`, `image #ab47bc`, `text #26a69a`,
  `dev #8d6e63`).
- **Icons** are pure SVG inner-markup strings in `src/lib/icons.ts`, shared by the React
  `ToolIcon`/`ToolNav` components *and* the string prerenderer, so icons render identically
  in the SPA and the static HTML.

## Accessibility & motion

- Focus states use a visible `outline: 2px solid var(--lime-strong)`.
- `prefers-reduced-motion` is honored (card hover transforms are suppressed).
- Category chips use `role="tablist"` / `aria-selected`; breadcrumbs use
  `aria-label="Breadcrumb"`; the language and market selects expose `aria-label`s.

## Why one stylesheet

Consistency with the "minimal dependencies" philosophy: a design that is entirely
custom-property-driven means new tools inherit the system for free, dark mode costs one
class, and there is no runtime styling cost or framework to bundle — which also keeps the
initial payload under the 128 KB budget.
