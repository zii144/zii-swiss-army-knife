#!/usr/bin/env node
/**
 * License-scan quality gate (DEVELOPMENT-PLAN.md §4 guardrail 1).
 * Fails the build if any dependency is AGPL or GPL-only.
 * LGPL is allowed (dynamic linking); dual licenses with a permissive option are allowed.
 *
 * Usage:
 *   node scripts/check-licenses.mjs            # scans ./node_modules
 *   node scripts/check-licenses.mjs --scan DIR # scans an arbitrary tree (used for self-test)
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DENY = [/AGPL/i, /\bGPL-?\d/i];
const PERMISSIVE = /\b(MIT|Apache|BSD|ISC|0BSD|Unlicense|WTFPL|CC0|Python)\b/i;

const licenseOf = (pkg) => {
  if (typeof pkg.license === 'string') return pkg.license;
  if (pkg.license && typeof pkg.license === 'object') return pkg.license.type ?? '';
  if (Array.isArray(pkg.licenses)) return pkg.licenses.map((l) => l.type ?? l).join(' OR ');
  return '';
};

const isDenied = (lic) => {
  const s = String(lic ?? '');
  if (!s) return false;
  if (/LGPL/i.test(s)) return false; // LGPL permitted (kept dynamically linked)
  if (!DENY.some((re) => re.test(s))) return false;
  if (/\bOR\b/i.test(s) && PERMISSIVE.test(s)) return false; // dual-licensed, choose permissive
  return true;
};

const args = process.argv.slice(2);
const scanIdx = args.indexOf('--scan');
const root = scanIdx !== -1 ? args[scanIdx + 1] : 'node_modules';

const offenders = [];
const seen = new Set();

function walk(dir, depth = 0) {
  if (depth > 8 || !existsSync(dir)) return;
  if (dir !== root) {
    const pj = join(dir, 'package.json');
    if (existsSync(pj)) {
      try {
        const pkg = JSON.parse(readFileSync(pj, 'utf8'));
        const key = `${pkg.name}@${pkg.version}`;
        if (pkg.name && !seen.has(key)) {
          seen.add(key);
          if (isDenied(licenseOf(pkg))) offenders.push({ key, license: licenseOf(pkg) });
        }
      } catch {
        /* ignore unreadable package.json */
      }
    }
  }
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    if (e.isDirectory()) walk(join(dir, e.name), depth + 1);
  }
}

walk(root);

if (offenders.length > 0) {
  console.error(`✗ license-scan: ${offenders.length} disallowed (A)GPL package(s):`);
  for (const o of offenders) console.error(`  - ${o.key}: ${o.license}`);
  process.exit(1);
}
console.log(
  `✓ license-scan: scanned ${seen.size} packages under "${root}", no AGPL/GPL-only found.`,
);
