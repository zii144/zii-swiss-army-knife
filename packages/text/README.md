# @zii/text — Text & Data Engine (M8)

Pure TypeScript, offline, deterministic text and data utilities. Every function
runs unchanged in both browsers and Node — only standard JS/Web APIs are used
(no `fs`, no `btoa`/`atob`, no `Buffer`). Zero third-party runtime dependencies.

## Modules

- **width** — `toHalfWidth`, `toFullWidth` (full-width ASCII U+FF01..U+FF5E and
  the ideographic space U+3000 <-> ASCII), `nfkcNormalize` (Unicode NFKC).
- **count** — `countText(s)` returns `{ chars, charsNoSpaces, lines, words,
  byScript: { han, hiragana, katakana, latin, digit, punct, other } }` using
  Unicode code-point ranges.
- **case** — `toCamelCase`, `toSnakeCase`, `toKebabCase`, `toTitleCase`,
  `toSentenceCase`, `toUpperCase`, `toLowerCase`.
- **cjk** — `toSimplified`, `toTraditional` (see note below).
- **format** — `jsonToCsv`, `csvToJson`, `prettyJson`, `base64Encode`,
  `base64Decode` (manual, environment-independent), `urlEncode`, `urlDecode`,
  `htmlEscape`, `htmlUnescape`.
- **diff** — `lineDiff(a, b)` returns line operations
  (`equal` / `add` / `remove`) computed via LCS.

## CJK conversion

`toSimplified` / `toTraditional` use the full [OpenCC](https://github.com/BYVoid/OpenCC)
dataset via `opencc-js` (MIT/Apache, offline) — phrase-aware, not a character
table. `toTraditionalTaiwan` additionally applies Taiwan vocabulary/idioms
(e.g. 软件→軟體, 内存→記憶體, 鼠标→滑鼠, 程序→程式).

## Structured data

- **serial** — `jsonToYaml` / `yamlToJson` (+ string variants) via `yaml` (ISC),
  completing the JSON ↔ CSV ↔ YAML matrix.
- **regex** — `testRegex(pattern, input, flags?)` returns every match with
  positional + named groups; invalid patterns return `{ valid: false }` instead
  of throwing.

## Base64 note

`base64Encode` / `base64Decode` implement the base64 alphabet manually over
UTF-8 bytes produced by `TextEncoder`/`TextDecoder`, so they behave identically
in browsers and Node without relying on `btoa`, `atob`, or `Buffer`.
