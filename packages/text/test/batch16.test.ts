import { describe, it, expect } from 'vitest';
import { soundex } from '../src/soundex';
import { jaccardSimilarity, levenshteinSimilarity } from '../src/similarity';
import { quotedPrintableEncode, quotedPrintableDecode } from '../src/qp';
import { transposeGrid } from '../src/grid';
import { maskEmail, maskEmailsInText } from '../src/mask';
import { extractIpv4, extractNumbers } from '../src/extract';

describe('soundex', () => {
  it('codes Robert', () => {
    expect(soundex('Robert')).toBe('R163');
  });
});

describe('similarity', () => {
  it('scores jaccard and levenshtein', () => {
    expect(jaccardSimilarity('a b', 'b c')).toBeCloseTo(1 / 3);
    expect(levenshteinSimilarity('kitten', 'kitten')).toBe(100);
  });
});

describe('quoted-printable', () => {
  it('round-trips', () => {
    expect(quotedPrintableDecode(quotedPrintableEncode('café'))).toBe('café');
  });
});

describe('transposeGrid', () => {
  it('transposes rows to columns', () => {
    expect(transposeGrid('ab\ncd')).toBe('ac\nbd');
  });
});

describe('mask', () => {
  it('masks emails', () => {
    expect(maskEmail('john@example.com')).toBe('j**n@example.com');
    expect(maskEmailsInText('Contact john@example.com')).toContain('@example.com');
  });
});

describe('extract batch16', () => {
  it('finds ips and numbers', () => {
    expect(extractIpv4('host 192.168.0.1 ok')).toEqual(['192.168.0.1']);
    expect(extractNumbers('a 3.14 b -2')).toEqual([3.14, -2]);
  });
});
