/**
 * Structured-data interchange: JSON ⇄ YAML, powered by `yaml` (ISC). Pure,
 * offline, deterministic; identical in browser and Node. CSV lives in
 * `format.ts`; together they cover the JSON ↔ CSV ↔ YAML matrix.
 */
import { parse as yamlParse, stringify as yamlStringify } from 'yaml';

/** Serialize any JSON-compatible value to YAML text. */
export function jsonToYaml(value: unknown, indent = 2): string {
  return yamlStringify(value, { indent });
}

/** Parse YAML text into a JavaScript value. */
export function yamlToJson(yaml: string): unknown {
  return yamlParse(yaml);
}

/** Convert a JSON string directly to YAML text. */
export function jsonStringToYaml(json: string, indent = 2): string {
  return jsonToYaml(JSON.parse(json), indent);
}

/** Convert YAML text directly to a pretty-printed JSON string. */
export function yamlToJsonString(yaml: string, indent = 2): string {
  return JSON.stringify(yamlParse(yaml), null, indent);
}
