---
name: zii-swiss-army-knife-blueprint
description: Complete technical blueprint of the Zii Swiss Army Knife project — a multi-market, privacy-first, offline PWA utility suite (~318 on-device tools, 20 markets, 8 languages; pnpm+Turborepo monorepo of pure-TS engines behind a React 19 shell, Capacitor mobile). Use when working on or answering questions about this project's architecture, tech stack, the tool/"skill" system, engines, frontend, design system, testing, build/deploy, mobile, or security — and for recipes to add a tool, add a market, reuse an engine, or deploy.
---

# Zii Swiss Army Knife — Blueprint

This skill is the authoritative, versioned technical documentation for the **Zii Swiss
Army Knife** app. It is the same content as the repo's `docs/tech/` pack (this directory
is a symlink to it) — **one source of truth**, maintained alongside the code by Zii
(developer & architecture manager).

## What the project is (one line)

A multi-market, privacy-first, offline-capable **PWA** bundling **~318 everyday utility
tools** (file/PDF/image/text/calc/convert/date/ID/finance/dev/generators) that all run
**on-device**, localized across **8 UI languages** and gated to **20 country markets**,
built as a **pnpm + Turborepo monorepo** of pure-TypeScript engines behind a **React 19**
shell, wrapped for iOS/Android via **Capacitor**.

## How to use this skill

Start at [`README.md`](README.md) (the versioned index), then open the file for the area
you need. Each file is standalone and cross-linked.

| Need | Read |
|------|------|
| Product vision, scale, current state, all directions | [`01-overview.md`](01-overview.md) |
| Architecture style, layers, data flow (diagrams) | [`02-architecture.md`](02-architecture.md) |
| Exact tech stack + versions | [`03-tech-stack.md`](03-tech-stack.md) |
| The tool/"skill" system + where AI/ML actually is | [`04-tool-system-and-skills.md`](04-tool-system-and-skills.md) |
| The pure-TS engine packages | [`05-engines.md`](05-engines.md) |
| React shell, routing, SSG/prerender, i18n, PWA, SEO | [`06-frontend-app.md`](06-frontend-app.md) |
| Visual design system | [`07-design-system.md`](07-design-system.md) |
| Coding style, conventions, the integrity rule | [`08-coding-style.md`](08-coding-style.md) |
| Testing + CI gates | [`09-testing-and-quality.md`](09-testing-and-quality.md) |
| Build, deploy, mobile (Capacitor) | [`10-build-deploy-mobile.md`](10-build-deploy-mobile.md) |
| Security & privacy posture | [`11-security-and-privacy.md`](11-security-and-privacy.md) |
| Roadmap & every direction | [`12-roadmap-and-directions.md`](12-roadmap-and-directions.md) |
| **Recipes: add a tool / market / engine, deploy** | [`13-portability-playbook.md`](13-portability-playbook.md) |
| Version history of this pack | [`CHANGELOG.md`](CHANGELOG.md) |

## Load-bearing facts (verify against code before asserting)

- Real scale is **~318 tool screens / 319 catalog entries** (`packages/app/src/lib/catalog.ts`),
  **20 markets + `global`**, **8 UI languages**, bundle budget **128 KB gz**. The root
  `README.md`/`ROADMAP.md` are stale ("170 tools / 6 markets / 110 KB") — trust the code.
- **No LLM inference in the product.** "AI" = on-device ML tools (OCR, background removal)
  + an LLM-discoverability layer (`llms.txt`, `tools.json`, `ai.txt`). A natural-language
  AI layer is roadmap-only (Phase 5).
- **No Fastlane, no Maestro** — mobile is Capacitor-only (iOS verified in simulator).
- Engines ship as **raw TypeScript** (`exports: "./src/index.ts"`, no `dist/`).

## Invariants to preserve (see [`13`](13-portability-playbook.md))

On-device by default (no PII off device) · engines stay pure & market-agnostic
(localization is config + data) · every tool code-split & under bundle budget · permissive
licenses only (no AGPL/GPL) · never fabricate authoritative data · one catalog is the
source of truth for registry + UI labels + SEO.
