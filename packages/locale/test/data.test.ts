import { describe, it, expect } from 'vitest';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { validateConfigDir, sampleDataDir } from '../src/validate';

describe('config-validation gate', () => {
  it('all bundled sample packs are schema-valid', () => {
    expect(validateConfigDir(sampleDataDir())).toEqual([]);
  });

  it('flags an invalid pack loudly', () => {
    const dir = mkdtempSync(join(tmpdir(), 'zii-locale-'));
    writeFileSync(join(dir, 'bad.json'), JSON.stringify({ market: 'tw' })); // missing required fields
    const issues = validateConfigDir(dir);
    expect(issues.length).toBe(1);
    expect(issues[0]?.file).toBe('bad.json');
  });

  it('flags invalid JSON', () => {
    const dir = mkdtempSync(join(tmpdir(), 'zii-locale-'));
    writeFileSync(join(dir, 'broken.json'), '{ not json');
    expect(validateConfigDir(dir)[0]?.message).toMatch(/invalid JSON/);
  });
});
