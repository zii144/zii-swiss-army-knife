import { htmlUnescape } from './format';

/** Strip HTML tags and decode common entities. */
export function stripHtml(html: string): string {
  const noComments = html.replace(/<!--[\s\S]*?-->/g, '');
  const noTags = noComments.replace(/<[^>]+>/g, '\n');
  return htmlUnescape(noTags)
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
