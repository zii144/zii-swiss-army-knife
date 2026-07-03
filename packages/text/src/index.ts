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

export { slugify } from './slug';
export { dedupeLines, sortLines, normalizeText, reverseText, findReplace, shuffleLines, trimLines, removeEmptyLines, numberLines, joinLines, splitToLines, grepLines, indentLines, affixLines } from './lines';
export type { SortLinesOrder } from './lines';
export { extractEmails, extractUrls, extractIpv4, extractNumbers } from './extract';
export { rot13, caesarCipher, jsonEscapeString, jsonUnescapeString, textToBinary, binaryToText, textToHex, hexToText, rot47, unicodeEscape, unicodeUnescape, atbash } from './cipher';
export { wordFrequency, charFrequency } from './freq';
export type { WordCount } from './freq';
export { nanoid } from './nanoid';
export { loremIpsum } from './lorem';
export { toRoman, fromRoman } from './roman';
export { wrapText } from './wrap';
export { morseEncode, morseDecode } from './morse';
export { levenshtein, hammingDistance } from './distance';
export { stripHtml } from './html';
export { repeatText } from './repeat';
export { isPalindrome } from './palindrome';
export { removeDiacritics } from './diacritics';
export { reverseWords, tabsToSpaces, spacesToTabs } from './words';
export { truncateText, padText } from './pad';
export type { PadAlign } from './pad';
export { removeZeroWidth, findZeroWidth } from './invisible';
export { stripMarkdown } from './markdown';
export { soundex } from './soundex';
export { jaccardSimilarity, levenshteinSimilarity } from './similarity';
export { quotedPrintableEncode, quotedPrintableDecode } from './qp';
export { transposeGrid } from './grid';
export { maskEmail, maskEmailsInText } from './mask';
