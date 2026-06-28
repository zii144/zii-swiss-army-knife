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

## CJK conversion note

`toSimplified` / `toTraditional` currently use a **small built-in mapping table**
(~45 common characters) to demonstrate the conversion mechanism. The full
[OpenCC](https://github.com/BYVoid/OpenCC) dataset (including multi-character
phrases and regional variants) is a planned follow-up; this package builds the
char-by-char substitution engine that such a dataset would plug into.

## Base64 note

`base64Encode` / `base64Decode` implement the base64 alphabet manually over
UTF-8 bytes produced by `TextEncoder`/`TextDecoder`, so they behave identically
in browsers and Node without relying on `btoa`, `atob`, or `Buffer`.
