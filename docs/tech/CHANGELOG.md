# Tech Documentation Pack — Changelog

Version history for the `docs/tech/` knowledge pack. This is versioned independently of
the app (`../../CHANGELOG.md`). Format loosely follows Keep a Changelog; versioning is
semantic (patch = corrections, minor = new coverage, major = structural change).

**Maintainer:** Zii — developer & architecture manager.

## [v1.0.0] — 2026-07-16

**Author:** Zii. **Baseline:** repo at commit `91631c0` (main).

### Added — initial complete pack (15 files, ~1,700 lines)
- `SKILL.md` — skill entry point (frontmatter + navigation). This pack is installed as the
  `zii-swiss-army-knife-blueprint` Claude Code skill via a symlink from
  `~/.claude/skills/zii-swiss-army-knife-blueprint` → `docs/tech/`, so the skill and the
  repo pack are the **same files** (one source of truth).
- `README.md` — versioned index + how-to-use + source-of-truth notes.
- `01-overview.md` — vision, scope, current state, scale, all directions.
- `02-architecture.md` — layered/plugin monorepo architecture + mermaid diagrams.
- `03-tech-stack.md` — full stack with exact versions and rationale.
- `04-tool-system-and-skills.md` — the tool/"skill" system (registry, catalog,
  code-split, market gating) + an accurate account of the AI/ML + LLM-discovery layer.
- `05-engines.md` — the pure-TS engine packages deep-dive.
- `06-frontend-app.md` — React shell, routing, SSG/prerender, i18n, PWA, SEO.
- `07-design-system.md` — visual system, tokens, glassmorphism, dark mode.
- `08-coding-style.md` — TS strictness, lint/format, idioms, the no-fabricated-data rule.
- `09-testing-and-quality.md` — Vitest units, Playwright all-tools E2E, CI gates.
- `10-build-deploy-mobile.md` — Turbo/pnpm build, bundle budget, license scan, Vercel,
  Capacitor mobile (and the verified absence of Fastlane/Maestro).
- `11-security-and-privacy.md` — CSP/COOP/COEP, no-PII enforcement, guardrails.
- `12-roadmap-and-directions.md` — every phase (M1–M10 → Phase 5 AI layer) + risks.
- `13-portability-playbook.md` — recipes to add a tool/market/engine, deploy, and add
  mobile automation.

### Notes recorded at v1.0.0 (state of the app on this date)
- Real scale documented from code (root `README.md`/`ROADMAP.md` were stale): **~318 tool
  screens / 319 catalog entries**, **20 markets + `global`**, **8 UI languages**, bundle
  budget **128 KB gz**.
- Clarified that the product has **no LLM inference**; "AI" = on-device ML tools
  (OCR, background removal) + an LLM-discoverability layer (`llms.txt`, `tools.json`).
- Confirmed **no Fastlane and no Maestro**; mobile is Capacitor-only (iOS verified in
  simulator).

<!--
Template for the next entry:

## [vX.Y.Z] — YYYY-MM-DD
**Author:** <name>.
### Added / Changed / Fixed / Removed
- ...
-->
