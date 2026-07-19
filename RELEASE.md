# Release process

This monorepo is private (`"private": true`). Versions are for **product release hygiene**, not npm publishing.

## Current line

- **0.1.0** — first web-PWA release cut (2026-07-20). See `CHANGELOG.md`.

## How to cut a release

1. Ensure `main` is green (`pnpm verify` + CI `verify`/`e2e`).
2. Move finished notes from `## [Unreleased]` into a new `## [X.Y.Z] — YYYY-MM-DD` section in `CHANGELOG.md`.
3. Bump `version` in the root `package.json` and every `packages/*/package.json` to `X.Y.Z` (keep them in lockstep).
4. Open a PR, merge to `main` after CI.
5. Tag the merge commit: `git tag -a vX.Y.Z -m "vX.Y.Z"` and `git push origin vX.Y.Z`.

## What 0.1.x claims

In scope: static PWA on Vercel (or equivalent), on-device tools, license + high+ production audit gates.

Out of scope until a later line: App Store / Play Store packaging, native-device CI, optional LibreOffice conversion backend as part of the default deploy, live gov-data feeds, Phase 5 AI.

## Quality gates (must stay green)

```bash
pnpm verify   # typecheck · lint · test · build · licenses · prod audit (high+)
pnpm --filter @zii/app test:e2e
```
