import { describe, it, expect } from 'vitest';
import { jsonToYaml, yamlToJson, jsonStringToYaml, yamlToJsonString } from '../src/index';

describe('JSON ⇄ YAML', () => {
  const obj = { name: 'Zii', tags: ['a', 'b'], nested: { n: 1, ok: true } };

  it('serializes an object to YAML and parses it back losslessly', () => {
    const yaml = jsonToYaml(obj);
    expect(yaml).toContain('name: Zii');
    expect(yamlToJson(yaml)).toEqual(obj);
  });

  it('converts a JSON string to YAML', () => {
    const yaml = jsonStringToYaml('{"a":1,"b":[2,3]}');
    expect(yamlToJson(yaml)).toEqual({ a: 1, b: [2, 3] });
  });

  it('converts YAML to a pretty JSON string', () => {
    const json = yamlToJsonString('a: 1\nb:\n  - 2\n  - 3\n');
    expect(JSON.parse(json)).toEqual({ a: 1, b: [2, 3] });
  });

  it('preserves types (numbers, booleans, null)', () => {
    const yaml = jsonToYaml({ x: 1, y: true, z: null });
    expect(yamlToJson(yaml)).toEqual({ x: 1, y: true, z: null });
  });
});
