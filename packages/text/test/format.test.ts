import { describe, it, expect } from 'vitest';
import {
  jsonToCsv,
  csvToJson,
  prettyJson,
  minifyJson,
  cleanCsv,
  base64Encode,
  base64Decode,
  urlEncode,
  urlDecode,
  htmlEscape,
  htmlUnescape,
} from '../src/index';

describe('base64Encode', () => {
  it('encodes "hi" (golden anchor)', () => {
    expect(base64Encode('hi')).toBe('aGk=');
  });

  it('encodes multi-byte UTF-8', () => {
    expect(base64Encode('你好')).toBe('5L2g5aW9');
  });

  it('encodes the empty string', () => {
    expect(base64Encode('')).toBe('');
  });
});

describe('base64Decode', () => {
  it('decodes "aGk=" (golden anchor)', () => {
    expect(base64Decode('aGk=')).toBe('hi');
  });

  it('round-trips arbitrary text', () => {
    const text = 'The quick brown fox 你好 😀!';
    expect(base64Decode(base64Encode(text))).toBe(text);
  });
});

describe('csvToJson', () => {
  it('parses a simple CSV (golden anchor)', () => {
    expect(csvToJson('a,b\n1,2')[0]).toEqual({ a: '1', b: '2' });
  });

  it('handles quoted fields with commas and newlines', () => {
    const rows = csvToJson('name,note\n"Doe, Jane","line1\nline2"');
    expect(rows[0]).toEqual({ name: 'Doe, Jane', note: 'line1\nline2' });
  });

  it('handles escaped quotes', () => {
    const rows = csvToJson('q\n"a ""b"" c"');
    expect(rows[0]).toEqual({ q: 'a "b" c' });
  });

  it('returns an empty array for empty input', () => {
    expect(csvToJson('')).toEqual([]);
  });
});

describe('jsonToCsv', () => {
  it('serializes rows to CSV with a header', () => {
    expect(jsonToCsv([{ a: 1, b: 2 }])).toBe('a,b\n1,2');
  });

  it('quotes fields containing commas', () => {
    expect(jsonToCsv([{ a: 'x,y', b: 'z' }])).toBe('a,b\n"x,y",z');
  });

  it('round-trips with csvToJson', () => {
    const csv = jsonToCsv([{ a: '1', b: '2' }]);
    expect(csvToJson(csv)[0]).toEqual({ a: '1', b: '2' });
  });

  it('returns an empty string for an empty array', () => {
    expect(jsonToCsv([])).toBe('');
  });
});

describe('prettyJson', () => {
  it('pretty-prints with default 2-space indent', () => {
    expect(prettyJson({ a: 1 })).toBe('{\n  "a": 1\n}');
  });

  it('honors a custom indent', () => {
    expect(prettyJson({ a: 1 }, 4)).toBe('{\n    "a": 1\n}');
  });
});

describe('urlEncode / urlDecode', () => {
  it('encodes reserved characters', () => {
    expect(urlEncode('a b&c=d')).toBe('a%20b%26c%3Dd');
  });

  it('round-trips', () => {
    expect(urlDecode(urlEncode('héllo world?x=1'))).toBe('héllo world?x=1');
  });
});

describe('minifyJson', () => {
  it('stringifies without whitespace', () => {
    expect(minifyJson({ a: 1, b: [2, 3] })).toBe('{"a":1,"b":[2,3]}');
  });
});

describe('cleanCsv', () => {
  it('trims fields and drops empty rows', () => {
    const raw = 'name,age\n Ann ,30\n , \nBo,25';
    expect(cleanCsv(raw)).toBe('name,age\nAnn,30\nBo,25');
  });

  it('dedupes full rows', () => {
    const raw = 'id,name\n1,Ann\n1,Ann\n2,Bo';
    expect(cleanCsv(raw)).toBe('id,name\n1,Ann\n2,Bo');
  });
});

describe('htmlEscape / htmlUnescape', () => {
  it('escapes the five significant characters', () => {
    expect(htmlEscape(`<a href="x">'&'</a>`)).toBe(
      '&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;',
    );
  });

  it('round-trips', () => {
    const s = `<b>"Tom" & 'Jerry'</b>`;
    expect(htmlUnescape(htmlEscape(s))).toBe(s);
  });

  it('unescapes numeric entities', () => {
    expect(htmlUnescape('&#65;&#x42;')).toBe('AB');
  });
});
