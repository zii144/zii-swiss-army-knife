# @zii/registry

The tool registry and lazy plugin loader at the heart of the Zii utility suite (Module **M1**).

Every tool registers static metadata (`ToolMeta`) plus a `ToolLoader` that lazily `import()`s the
implementation, so the ~200-tool surface stays code-split. The registry is **market-agnostic**: tools
declare the markets they belong to (`tw`/`hk`/`jp`/`en-*`/`global`) and the registry filters/searches.

```ts
import { createRegistry } from '@zii/registry';

const registry = createRegistry();
registry.register(
  { id: 'percentage', name: 'Percentage', category: 'calc', markets: ['global'], offline: true },
  () => import('./percentage'),
);

registry.list('tw');          // tools shown in Taiwan (incl. global)
registry.search('qr', 'jp');  // search within Japan
await registry.load('percentage'); // lazily import the implementation
```

## API

- `createRegistry(): ToolRegistry`
- `ToolRegistry#register(meta, loader)` — throws on duplicate / non-kebab-case id
- `ToolRegistry#has(id)`, `#get(id)`, `#list(market?)`, `#search(query, market?)`, `#load(id)`

## Scripts

`pnpm build` (tsc) · `pnpm typecheck` · `pnpm test` (vitest) · `pnpm lint` (eslint)
