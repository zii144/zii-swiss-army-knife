# Zii Swiss Army Knife — Technical Documentation Pack

| | |
|---|---|
| **Version** | `v1.0.0` |
| **Released** | 2026-07-16 |
| **Status** | Current |
| **Author / Architecture Manager** | Zii ([@zii144](https://github.com/zii144)) |
| **Scope** | Whole repo as of commit `91631c0` |
| **Change log** | [`CHANGELOG.md`](CHANGELOG.md) |
| **Installed as skill** | `zii-swiss-army-knife-blueprint` (`~/.claude/skills/` → symlink to this dir) |

> A **portable, self-contained knowledge pack** that completely describes how this
> project is implemented — tech stack, architecture, the tool/"skill" system,
> engines, frontend, design, testing, build/deploy, mobile, security, and every
> future direction. Drop this `docs/tech/` folder into any repo, wiki, or agent
> context and it stands alone, like a skill.

**What this project is, in one line:** a multi-market, privacy-first, offline-capable
**PWA** bundling **~319 everyday utility tools** (file/PDF/image/text/calc/convert/
date/ID/finance/dev/generators) — every tool runs **on-device**, localized across **8
UI languages** and gated to **20 country markets**, built as a **pnpm + Turborepo
monorepo** of pure-TypeScript engines behind a **React 19** shell, and wrapped for
**iOS/Android via Capacitor**.

---

## How to read this pack

Start with `01-overview.md`, then dive into whichever area you need. Each file is
standalone; cross-references use relative links.

| # | File | What it covers |
|---|------|----------------|
| — | [`SKILL.md`](SKILL.md) | Skill entry point (frontmatter + navigation); this pack is installed as the `zii-swiss-army-knife-blueprint` skill |
| — | [`README.md`](README.md) | This index + how to use the pack |
| 01 | [`01-overview.md`](01-overview.md) | Product vision, scope, current state, scale, all "directions" |
| 02 | [`02-architecture.md`](02-architecture.md) | Architecture style, monorepo layers, data flow, diagrams |
| 03 | [`03-tech-stack.md`](03-tech-stack.md) | Full stack with exact versions and why each was chosen |
| 04 | [`04-tool-system-and-skills.md`](04-tool-system-and-skills.md) | The "skills": registry, catalog, code-split, market gating, locale packs, the AI/ML + LLM-discovery layer |
| 05 | [`05-engines.md`](05-engines.md) | The pure-TS engine packages (calc/id/payroll/calendar/text/receipt/compute/reminders) |
| 06 | [`06-frontend-app.md`](06-frontend-app.md) | React shell, routing, SSG/prerender + hydration, i18n, PWA/service worker, SEO |
| 07 | [`07-design-system.md`](07-design-system.md) | Visual system: tokens, glassmorphism, dark mode, component kit |
| 08 | [`08-coding-style.md`](08-coding-style.md) | TS strictness, lint/format, naming, idioms, the no-fabricated-data rule |
| 09 | [`09-testing-and-quality.md`](09-testing-and-quality.md) | Vitest units, Playwright all-tools E2E, CI gates, `pnpm verify` |
| 10 | [`10-build-deploy-mobile.md`](10-build-deploy-mobile.md) | Turbo/pnpm build, bundle budget, license scan, prerender pipeline, Vercel deploy, Capacitor mobile |
| 11 | [`11-security-and-privacy.md`](11-security-and-privacy.md) | CSP/COOP/COEP headers, no-PII posture, offline-first, guardrails |
| 12 | [`12-roadmap-and-directions.md`](12-roadmap-and-directions.md) | Every direction: phases, markets, the planned AI layer, maintenance risks |
| 13 | [`13-portability-playbook.md`](13-portability-playbook.md) | Recipes: add a tool, add a market, reuse an engine elsewhere |
| — | [`CHANGELOG.md`](CHANGELOG.md) | Version history of this pack |

---

## Source-of-truth notes (read before trusting older docs)

The repo's top-level docs (`README.md`, `ROADMAP.md`) were written at earlier
milestones and **lag the code**. This pack is written against the code as of the
latest commit. Where they disagree, the code wins. Notable drifts:

- Root README says **"170 tools"** and **"6 markets"**; the live catalog
  (`packages/app/src/lib/catalog.ts`) has **~319 tool entries** across **20
  markets** (`packages/registry/src/types.ts`).
- Root README quotes a **110 KB gz** bundle budget; the enforced budget is now
  **128 KB gz** (`packages/app/scripts/check-bundle.mjs`, raised in CHANGELOG as
  market packs were added).

Everything in this pack cites the file it came from so you can re-verify.

## Provenance & ownership

- **Author / owner:** Zii — developer of the app and its architecture manager. These
  docs are a first-class, versioned part of the project and are maintained alongside the
  code.
- **How it was produced:** by reading the codebase directly (config, source, scripts, CI)
  plus the repo's own planning docs (`DEVELOPMENT-PLAN.md`, `ROADMAP.md`, `docs/*`,
  `CHANGELOG.md`). No application behavior was changed to produce it.
- **Versioning:** semantic — bump **patch** for corrections, **minor** for new
  sections/coverage, **major** when the pack's structure changes. Record every change in
  [`CHANGELOG.md`](CHANGELOG.md) with a date.

_This pack is versioned independently of the app; see [`CHANGELOG.md`](CHANGELOG.md) for
its history and [`../../CHANGELOG.md`](../../CHANGELOG.md) for the app's._
