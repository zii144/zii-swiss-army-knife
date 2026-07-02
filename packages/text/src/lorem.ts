const WORDS = [
  'lorem',
  'ipsum',
  'dolor',
  'sit',
  'amet',
  'consectetur',
  'adipiscing',
  'elit',
  'sed',
  'do',
  'eiusmod',
  'tempor',
  'incididunt',
  'ut',
  'labore',
  'et',
  'dolore',
  'magna',
  'aliqua',
  'enim',
  'ad',
  'minim',
  'veniam',
  'quis',
  'nostrud',
  'exercitation',
  'ullamco',
  'laboris',
  'nisi',
  'aliquip',
  'ex',
  'ea',
  'commodo',
  'consequat',
  'duis',
  'aute',
  'irure',
  'in',
  'reprehenderit',
  'voluptate',
  'velit',
  'esse',
  'cillum',
  'fugiat',
  'nulla',
  'pariatur',
  'excepteur',
  'sint',
  'occaecat',
  'cupidatat',
  'non',
  'proident',
  'sunt',
  'culpa',
  'qui',
  'officia',
  'deserunt',
  'mollit',
  'anim',
  'id',
  'est',
  'laborum',
] as const;

/** Deterministic word pick from a numeric seed (for tests). */
function wordAt(index: number): string {
  return WORDS[index % WORDS.length] ?? 'lorem';
}

/** Generate `paragraphs` of lorem ipsum placeholder text. */
export function loremIpsum(paragraphs: number, wordsPerParagraph = 50): string {
  const pCount = Math.max(1, Math.min(20, Math.trunc(paragraphs)));
  const wCount = Math.max(5, Math.min(200, Math.trunc(wordsPerParagraph)));
  const out: string[] = [];
  let wi = 0;
  for (let p = 0; p < pCount; p += 1) {
    const words: string[] = [];
    for (let w = 0; w < wCount; w += 1) {
      words.push(wordAt(wi));
      wi += 1;
    }
    words[0] = (words[0] ?? 'lorem').charAt(0).toUpperCase() + (words[0] ?? 'lorem').slice(1);
    out.push(`${words.join(' ')}.`);
  }
  return out.join('\n\n');
}
