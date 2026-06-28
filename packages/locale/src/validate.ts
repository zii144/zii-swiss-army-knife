// Node-only utility (uses fs) — the config-validation gate. NOT exported from the
// browser-safe package entry; imported directly by tests/CI.
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { safeParseLocalePack } from './schema';

export interface ValidationIssue {
  file: string;
  message: string;
}

/** Validate every *.json locale pack in `dir`. Returns issues (empty array = all valid). */
export function validateConfigDir(dir: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    let data: unknown;
    try {
      data = JSON.parse(readFileSync(join(dir, file), 'utf8'));
    } catch (e) {
      issues.push({ file, message: `invalid JSON: ${(e as Error).message}` });
      continue;
    }
    const result = safeParseLocalePack(data);
    if (!result.success) {
      const detail = result.error.issues
        .map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`)
        .join('; ');
      issues.push({ file, message: detail });
    }
  }
  return issues;
}

/** Path to this package's bundled sample data directory. */
export function sampleDataDir(): string {
  return join(dirname(fileURLToPath(import.meta.url)), '..', 'data');
}
