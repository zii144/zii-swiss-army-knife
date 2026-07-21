# 07 — Design System (the golden standard)

This is the **authoritative reference and rulebook** for the Zii visual system. Every
new tool, route, component, and style change is measured against it. If code and this
doc disagree, that is a bug in one of them — fix it, don't fork the system.

The system is **token-driven CSS** — no framework, no CSS-in-JS, no utility classes.
Plain BEM-ish class names read values from CSS custom properties, so theming is a
variable swap and **no component ever branches on theme**.

---

## 0. Prime directives (the laws)

1. **Tokens, never literals.** Color, space, type, radius, elevation, blur, z-index and
   motion come from tokens in [`styles/tokens.css`](../../packages/app/src/styles/tokens.css).
   A raw hex or a `1.35rem` in a component rule is a defect. If no token fits, add a
   scale step — don't reintroduce a one-off.
2. **No component branches on theme.** There is no `.app--dark .my-thing { color: … }`.
   Dark mode is *only* a token override block. If you need a per-theme value, make it a
   token and set it in both themes.
3. **Consume the semantic role where one exists** (`--surface`, `--text`, `--color-danger`,
   `--focus-color`); fall back to primitives (`--space-*`, `--radius-*`, `--text-*`) for
   geometry and typography.
4. **Every new control uses the shared primitives** (`components/ui/*`). Don't hand-roll a
   button or input — extend the primitive.
5. **Focus is never removed.** Interactive elements show `outline: var(--focus-width) solid
   var(--focus-color)`. `prefers-reduced-motion` is always honored.
6. **Stay on the glass idiom.** New surfaces are glass (`--surface` fill + `--surface-border`
   + a `--shadow-*` + `backdrop-filter: blur(var(--blur-*))`), not opaque panels.

> **Migration status (2026-07):** the token layer above is the law for all *new* code.
> The existing `components.css` still holds pre-token literals; they are being replaced
> section-by-section (nearest-step, ≤2px drift) under the "normalize" task. New work must
> not add to that debt.

---

## 1. Identity

> "Blue-sky gradient, lime accent, glassmorphism cards, bold display type."

A **bright blue sky** page with a **lime "sun" glow**, content floating on **frosted-glass
cards**, and large confident display type. Deliberately friendly and consumer-facing — not
a dev-tool gray. Signature moves: the fixed multi-radial sky background, a felt-not-seen
film grain, a soft cloud band, the hero card fan, and the 45° `+`→`×` icon rotate on hover.

---

## 2. Architecture — where everything lives

One stylesheet, split into layered files, imported once in `main.tsx` in this order:

| File | `@layer` | Governs |
|------|----------|---------|
| [`styles/tokens.css`](../../packages/app/src/styles/tokens.css) | `tokens` | All custom properties: primitives + semantic roles, light + dark. **Declares the layer order.** |
| [`styles/base.css`](../../packages/app/src/styles/base.css) | `base` | Reset, page background stack, film grain, cloud band. |
| [`styles/components.css`](../../packages/app/src/styles/components.css) | `components` | Nav, hero, catalog, category hub, tool grid, workspace, tool page, `ui` primitives, motion, responsive. |

**Cascade is `@layer`-controlled.** The order is declared once, at the top of `tokens.css`:

```css
@layer tokens, base, components, utilities;
```

Later layers win regardless of source order, so component rules always beat base without
specificity fights, and a future `utilities` layer beats components. Everything is layered —
there are no unlayered rules competing at higher priority.

**Two token tiers** (both in `tokens.css`):
- **Primitives** — the raw scales (`--space-8`, `--text-sm`, `--radius-md`, `--shadow-glow`).
  Numeric/px-suffixed, theme-agnostic. The vocabulary.
- **Semantic** — role tokens (`--surface`, `--text`, `--color-danger`, `--focus-color`) that
  may change per theme. Prefer these where a role exists.

---

## 3. Color

### Brand
| Token | Value | Use |
|-------|-------|-----|
| `--lime` / `--brand` | `#c6f24e` | Primary action fill, brand mark, active accents |
| `--lime-strong` / `--brand-strong` | `#b4e636` | Hover/pressed brand, **focus ring** |
| `--ink-pill` / `--on-brand` | `#0c1322` | Text/glyph **on** a lime surface |

### Sky (page gradient stops)
`--sky-top` `#2b66c4` → `--sky-mid` `#4d92dc` → `--sky-low` `#c4ddf2` (dark: `#0a1834` /
`#122a52` / `#1b3c6e`). Composed into the fixed background in `base.css`.

### Surface & ink (content on glass)
| Semantic | Primitive alias | Light | Use |
|----------|-----------------|-------|-----|
| `--surface` | `--glass` | `rgba(255,255,255,.74)` | Default card fill |
| `--surface-quiet` | `--glass-2` | `rgba(255,255,255,.55)` | Nested/secondary fill |
| `--surface-border` | `--glass-border` | `rgba(255,255,255,.65)` | Glass hairline |
| `--surface-soft` | — | `rgba(0,0,0,.02)` | Zebra / inset wash |
| `--text` | `--ink` / `--fg` | `#0b1730` | Primary text on glass |
| `--text-muted` | `--ink-soft` / `--muted` | `#4a586f` | Secondary text |
| `--border` | — | `rgba(11,23,48,.12)` | De-facto primary border |
| `--accent` | — | `#1769c6` | **Link / info blue** — *not* the action lime |

**Two accents, on purpose:** `--brand` (lime) = primary *action*; `--accent` (blue) = *links
and info*. Don't mix them.

### Text on the blue (outside glass)
`--on-blue` 97% · `--on-blue-soft` 78% · `--on-blue-faint` 55% white.

### Semantic status (feedback)
| Token | Light | Dark | Use |
|-------|-------|------|-----|
| `--color-danger` | `#d62f3c` | `#ff8b94` | Error text/border |
| `--color-danger-text` | `#a3201f` | `#ff8b94` | Danger label on tinted surface |
| `--color-danger-surface` | `rgba(214,47,60,.16)` | `…,.22` | Error/diff-remove fill |
| `--color-success` | `#2e6a16` | `#9fd47a` | Success text/badge |
| `--color-success-surface` | `rgba(99,153,34,.18)` | `…,.24` | Diff-add fill |

These exist so status colors **stop being raw hex** and dark mode needs no structural
override.

### Category color (data-driven, not CSS)
12 categories map to a hex in `CATEGORY_COLOR` (`catalog.ts`), applied inline as `--cat`
or `color`. Category-hub cards derive **everything** from `--cat` via `color-mix()`.

```
pdf #ef5350  image #ab47bc  text #26a69a  calc #42a5f5  convert #5c6bc0
datetime #ec407a  id #7e57c2  finance #66bb6a  generator #ffa726
dev #8d6e63  daily #29b6f6  file #78909c
```

Falls back to `var(--accent)`. **Known constraint:** these are identical in light and dark;
watch contrast when a category tint sits on dark glass. New categories add a step here and
a matching icon in `icons.ts`.

### Form-control surfaces
`--field-bg`, `--menu-bg`, `--option-active`, `--scrollbar-thumb(-hover)` — see tokens.css.

---

## 4. Typography

**Families:** `--font-sans` (Inter → system stack) for everything; `--font-mono` for code,
hashes, and numeric output.

**Size scale** (snaps 25 ad-hoc sizes to a curated ramp; fluid steps for display):

| Token | Size | Use |
|-------|------|-----|
| `--text-2xs` | 0.72rem | counts, micro-labels |
| `--text-xs` | 0.8rem | captions, nav links, chips |
| `--text-sm` | 0.85rem | controls, secondary text |
| `--text-base` | 0.95rem | **body / prose default** |
| `--text-md` | 1.05rem | emphasized body |
| `--text-lg` | 1.15rem | small headings |
| `--text-xl` | 1.35rem | headings |
| `--text-2xl` | 1.45rem | large headings |
| `--text-lead` | `clamp(1rem,1.6vw,1.18rem)` | hero subtitle / lead |
| `--text-display-sm` | `clamp(1.6rem,3vw,2.2rem)` | catalog / section title |
| `--text-display` | `clamp(2.4rem,6vw,4.1rem)` | hero title |

**Weights:** `--weight-semibold` 600 · `--weight-bold` 700 · `--weight-extrabold` 800.
**Leading:** `--leading-tight` 1.1 (display) · `--leading-snug` 1.2 · `--leading-normal`
1.4 (UI) · `--leading-relaxed` 1.55 (prose).
**Tracking:** `--tracking-tight` -0.02em (display/brand) · `--tracking-wide` 0.06em
(uppercase kickers/nav).

---

## 5. Spacing & layout

**Spacing scale** — token number = pixels (÷16 = rem). Off-4px steps (6, 10) are kept so the
app's hand-tuned rhythm snaps with ≤~1px drift. Use for `padding`, `margin`, `gap`.

`--space-0` · `-2` · `-4` · `-6` · `-8` (workhorse) · `-10` · `-12` · `-16` (base unit) ·
`-20` · `-24` (gutter) · `-28` · `-32` · `-40` · `-48`.

Prefer the nearest step; if a value genuinely isn't on the scale, **add a step** rather than
hardcoding.

**Page measures:** `--measure-page` 1140px (nav/hero max width, centered) · `--measure-prose`
820px (hero text column).

**Layout patterns** (intrinsic-first — the app barely uses breakpoints):
- Tool grid: `grid; auto-fill minmax(15.5rem, 1fr)`.
- Category hub: glass card grid tinted per `--cat`.
- Workspace: sticky `.toolnav` rail + main panel.
- Footer: 3-column.

**Breakpoints** (reference tokens `--bp-sm` 480 · `--bp-md` 720 · `--bp-lg` 1024 · `--bp-xl`
1280). CSS custom properties can't be used in a `@media` prelude, so media queries hardcode
the px **with a comment naming the token**. Today `--bp-md` (720px) is the one true
breakpoint; prefer fluid `clamp()` + `auto-fill` grids over adding new ones.

---

## 6. Radius

`--radius-xs` 3px (scrollbars) · `--radius-sm` 10px (chips) · `--radius-md` 12px (inputs,
list items) · `--radius-lg` 16px (cards) · `--radius-xl` 22px (primary tool panel) ·
`--radius-pill` 999px (buttons, pills, toggles) · `--radius-round` 50% (dots).

---

## 7. Elevation & the glass idiom

**Shadow scale** (theme-aware; dark deepens the ambient shadow):
- `--shadow-sm` — small lift (buttons, chips).
- `--shadow-md` (= `--glass-shadow`) — the **resting glass card**.
- `--shadow-lg` — raised / hover / dropdowns.
- `--shadow-glow` — the **lime hover glow**, unified from ~8 drifting literals. Constant
  across themes (it's the accent). Use on primary-action hover.

**Backdrop blur:** `--blur-sm` 6 · `--blur-md` 10 · `--blur-lg` 14 · `--blur-xl` 18.

**A glass surface = ** `background: var(--surface)` + `1px solid var(--surface-border)` +
`box-shadow: var(--shadow-md)` + `backdrop-filter: blur(var(--blur-md))`. That's the recipe
for every card, menu, and panel.

---

## 8. Depth — the information-layer model

Every pixel sits in one of these bands. Use the `--z-*` scale; never invent a z-index.

| Band | `--z-*` | What lives here |
|------|---------|-----------------|
| Decorative | `--z-base` (0) | Fixed sky gradient, film grain, clouds, glow washes |
| Content | `--z-raised` (1) | Hero, catalog, workspace, tool panel, footer |
| Sticky chrome | `--z-sticky` (20) | The top nav |
| Dropdowns | `--z-dropdown` (60) | `ui-select` menu, popovers |
| Overlays | `--z-overlay` (100) | Modals / sheets (future) |
| Toasts | `--z-toast` (200) | Transient notifications (future) |

Conceptually the page is a **stack**: an atmospheric background you never interact with →
glass surfaces that hold content → chrome pinned above → transient overlays on top. Depth is
communicated by **elevation (shadow) + blur**, not by hard borders.

**Content hierarchy inside a surface:** display/heading (`--text-xl`+, `--weight-extrabold`,
`--text`) → body (`--text-base`, `--text`) → supporting (`--text-sm`, `--text-muted`) →
micro/labels (`--text-2xs`, uppercase, `--tracking-wide`). Group with `--space-*` rhythm,
not dividers, wherever possible.

---

## 9. Motion

`--dur-1` 140ms (micro: hover/tap) · `--dur-2` 240ms (menus/cards) · `--dur-3` 420ms
(route/entrance). Easing: `--ease-out` (enter/settle) · `--ease-in-out` (moves).

Entrance animations are defined as `@keyframes` in the components layer (fade-up, menu, pop,
route shell/rail/main/item, spin). **All motion must degrade** under
`prefers-reduced-motion: reduce` (hover transforms suppressed, entrances neutralized).

Signature interactions: hover lift + scale + `--shadow-glow`; the `+`→`×` 45° icon rotate;
the hero card fan resetting to level on hover.

---

## 10. Theming

Dark mode is the `.app--dark` class on the app container, toggled by `App.tsx`. It **only**
overrides tokens (surfaces, ink, sky, status, elevation) + `color-scheme`. Brand lime,
on-blue, spacing, type, radius, blur, z-index and motion are **shared** and not redeclared.

**Adding a theme = one token block.** Because components read tokens, they inherit it free.
Currently a **manual toggle** (☾/☀); there is no `prefers-color-scheme` auto-detect yet
(roadmap). To add one, gate the initial `dark` state on the media query — no CSS change.

---

## 11. Components & state contracts

Shared primitives live in [`components/ui/`](../../packages/app/src/components/ui) and are
the **only** sanctioned way to build a control. Each is a thin wrapper over a `.ui-*` class.

| Primitive | Class | Variants |
|-----------|-------|----------|
| `Button` | `.ui-btn` | `--primary` (lime pill) · `--ghost` (outline pill); `loading` → spinner + `aria-busy` |
| `TextField` | `.ui-input` | `type` passthrough |
| `TextArea` | `.ui-textarea` | `--mono` |
| `Select` | `.ui-select` | `--field` (glass) · `--pill` (translucent on blue); fully custom a11y listbox |
| `RangeSlider` | `.ui-range` | lime `accent-color` |
| `FileField` | `.ui-file` | signature `+`→`×` rotate |
| `Field` | `.tool__field` | label wrapper (`asDiv` for non-label) |

**Every interactive component must define all states:** default · hover · focus-visible
(`--focus-color` ring) · active · disabled · loading (where async) · error
(`--color-danger`). Don't ship a control missing focus or disabled.

> **Consolidation in progress:** two parallel systems exist today — legacy
> `.tool__primary`/`.tool__field`/global `input` rules **and** the `.ui-*` primitives. The
> `.ui-*` primitives are canonical; the legacy path is being merged into them. **Build new
> UI with the primitives only.**

---

## 12. Patterns

**Tool page anatomy** (the `.tool` glass panel): `__back` link (accent) → `__header`
(`__title` + OFFLINE `__badge`) → `__desc` → `__body` (fields) → `__actions`
(`__primary`) → output (`__result` / `__rows` / `__stats` / `.ztable` / `__preview`).
Calculators add `__group` (fieldset) and `__inline`. Diffs use `.diff` + status tokens.

**States a tool must handle:** empty (`.app__empty` / neutral prompt), loading (spinner),
result, and error (`__error`, `--color-danger`). Never leave a dead panel.

**Category accent:** set `style={{ '--cat': categoryColor(cat) }}` on the container and derive
tints via `color-mix(in srgb, var(--cat) N%, …)`. Never inline a category hex directly.

**Icons:** pure SVG inner-markup strings in `icons.ts`, shared by the React `ToolIcon`/
`ToolNav` **and** the string prerenderer, so SPA and static HTML match. Add tool icons there.

---

## 13. Accessibility

- Visible focus: `outline: var(--focus-width) solid var(--focus-color)` +
  `--focus-offset`. Never `outline: none` without an equivalent.
- `prefers-reduced-motion` honored everywhere.
- Custom `Select` is a real listbox (`role`, `aria-activedescendant`, full keyboard nav).
- Category chips: `role="tablist"` / `aria-selected`; breadcrumbs `aria-label="Breadcrumb"`;
  language/market selects expose `aria-label`.
- Target contrast AA on text; re-check category tints on dark glass (known risk).

---

## 14. Governance — the "on-system" checklist

A change is **on-system** when every box is ticked. Use this for PR review of any new tool,
route, or component:

- [ ] No literal colors/space/type/radius/shadow/z-index in component rules — tokens only.
- [ ] Uses a semantic role token where one exists; primitives for geometry/type.
- [ ] No `.app--dark` structural rule — theme differences are tokens.
- [ ] Controls are built from `components/ui/*`, not hand-rolled.
- [ ] All interaction states present (default/hover/focus-visible/active/disabled/loading/error).
- [ ] Focus ring intact; `prefers-reduced-motion` respected.
- [ ] Surfaces follow the glass recipe; radius/elevation from the scales.
- [ ] Category color via `--cat` + `color-mix`, never an inline hex.
- [ ] New icon added to `icons.ts` (renders in SPA + prerender).
- [ ] Copy/labels localized (8 languages) and market-gated where relevant.
- [ ] No regression to the 128 KB gz bundle budget (CSS is uncounted, but keep it lean).

---

## Why one token-driven system

Consistency with the "minimal dependencies" philosophy: a fully custom-property-driven
design means new tools inherit the system for free, a new theme costs one token block, there
is no runtime styling cost or framework to bundle, and the `@layer` split keeps a 2,600-line
stylesheet navigable — all while staying under the 128 KB initial-payload budget.
