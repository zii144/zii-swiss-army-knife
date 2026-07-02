// @zii/text — Text & Data Engine (M8). Pure TypeScript, offline, deterministic.
// Runs unchanged in both browsers and Node.

export { toHalfWidth, toFullWidth, nfkcNormalize } from './width';

export { countText } from './count';
export type { TextCounts, ScriptCounts } from './count';

export {
  toCamelCase,
  toSnakeCase,
  toKebabCase,
  toTitleCase,
  toSentenceCase,
  toUpperCase,
  toLowerCase,
} from './case';

export { toSimplified, toTraditional, toTraditionalTaiwan } from './cjk';

export {
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
} from './format';
export type { CleanCsvOptions } from './format';

export { lineDiff } from './diff';
export type { DiffLine, DiffType } from './diff';

export { jsonToYaml, yamlToJson, jsonStringToYaml, yamlToJsonString } from './serial';

export { testRegex } from './regex';
export type { RegexMatch, RegexResult } from './regex';
