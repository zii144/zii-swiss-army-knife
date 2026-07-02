/** Check whether text reads the same forwards and backwards. */
export function isPalindrome(text: string, ignoreCase = true, ignoreNonAlnum = true): boolean {
  let t = text;
  if (ignoreNonAlnum) t = t.replace(/[^\p{L}\p{N}]/gu, '');
  if (ignoreCase) t = t.toLowerCase();
  return t === [...t].reverse().join('');
}
