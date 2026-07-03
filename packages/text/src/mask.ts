/** Mask an email address for display (e.g. j***n@example.com). */
export function maskEmail(email: string): string {
  const m = email.trim().match(/^([^@]+)@(.+)$/);
  if (!m) return email;
  const local = m[1]!;
  const domain = m[2]!;
  const masked =
    local.length <= 2
      ? '*'.repeat(local.length)
      : `${local[0]}${'*'.repeat(Math.max(1, local.length - 2))}${local.slice(-1)}`;
  return `${masked}@${domain}`;
}

/** Mask all email addresses in a block of text. */
export function maskEmailsInText(text: string): string {
  return text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, (e) => maskEmail(e));
}
