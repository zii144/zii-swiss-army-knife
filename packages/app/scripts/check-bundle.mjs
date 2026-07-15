// Bundle-budget guard. Sums the gzipped size of the initial JS payload (the
// entry chunk plus every chunk it statically imports — i.e. what the browser
// must download before first paint) and fails if it exceeds the budget. This
// enforces the roadmap's "breadth without bloat" guardrail as the catalog grows.

import { gzipSync } from 'node:zlib';
import { readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(here, '..', process.env.ZII_DIST ?? 'dist');
const BUDGET_KB = Number(process.env.ZII_BUNDLE_BUDGET_KB ?? 122); // gzipped

const manifest = JSON.parse(await readFile(join(DIST, '.vite', 'manifest.json'), 'utf8'));

const entry = Object.values(manifest).find((e) => e.isEntry);
if (!entry) {
  console.error('check-bundle: no entry found in manifest');
  process.exit(1);
}

// Collect the entry and all statically-imported chunks (transitively).
const seen = new Set();
const files = [];
function walk(key) {
  if (!key || seen.has(key)) return;
  seen.add(key);
  const chunk = manifest[key];
  if (!chunk) return;
  files.push(chunk.file);
  for (const imp of chunk.imports ?? []) walk(imp);
}
// Manifest keys for imports are chunk keys; find the entry key.
const entryKey = Object.keys(manifest).find((k) => manifest[k].isEntry);
walk(entryKey);

let totalGz = 0;
const rows = [];
for (const file of files) {
  const buf = await readFile(join(DIST, file));
  const gz = gzipSync(buf).length;
  totalGz += gz;
  rows.push([file, buf.length, gz]);
}

const kb = (n) => (n / 1024).toFixed(1);
console.log('Initial JS payload (entry + static imports):');
for (const [file, raw, gz] of rows) {
  console.log(`  ${file.padEnd(38)} ${kb(raw).padStart(7)} KB  gz ${kb(gz).padStart(6)} KB`);
}
console.log(`  ${'TOTAL'.padEnd(38)} ${''.padStart(7)}     gz ${kb(totalGz).padStart(6)} KB`);
console.log(`  budget: ${BUDGET_KB} KB gz`);

if (totalGz > BUDGET_KB * 1024) {
  console.error(
    `\n✗ bundle-budget: initial payload ${kb(totalGz)} KB gz exceeds ${BUDGET_KB} KB budget.`,
  );
  process.exit(1);
}
console.log(`\n✓ bundle-budget: ${kb(totalGz)} KB gz within ${BUDGET_KB} KB budget.`);
