/** Remove accents and diacritic marks (NFD + strip combining marks). */
export function removeDiacritics(text: string): string {
  return text.normalize('NFD').replace(/\p{M}/gu, '');
}
