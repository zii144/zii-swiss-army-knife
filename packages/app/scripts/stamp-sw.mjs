// Stamp the built service worker's cache name with a content fingerprint of the
// emitted assets, so every deploy that changes any bundle produces a new cache
// name. The SW's `activate` step then purges the previous cache and recaches a
// fresh app shell — without this, the cache-first navigation handler would keep
// serving a stale index.html (and its now-missing hashed chunks) to returning
// visitors. Runs last in the app `build` script, after prerender.

import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(here, '..', process.env.ZII_DIST ?? 'dist');
const SW = join(DIST, 'sw.js');

// Vite already embeds a per-file content hash in every asset filename, so the
// sorted list of those names is a stable fingerprint of the whole payload.
const assets = (await readdir(join(DIST, 'assets'))).sort();
if (assets.length === 0) {
  console.error('stamp-sw: no files in dist/assets — did `vite build` run first?');
  process.exit(1);
}
const hash = createHash('sha256').update(assets.join('\n')).digest('hex').slice(0, 12);

const src = await readFile(SW, 'utf8');
const stamped = src.replace(/zii-shell-[A-Za-z0-9]+/g, `zii-shell-${hash}`);
if (stamped === src) {
  console.error('stamp-sw: no `zii-shell-*` cache token found in dist/sw.js');
  process.exit(1);
}
await writeFile(SW, stamped, 'utf8');
console.log(`stamp-sw: cache name → zii-shell-${hash}`);
