/**
 * Builds a `tel:` href from a number typed by an editor.
 *
 * Numbers are entered however they read best — "01-4567890", "9851030949",
 * "+977 9851 030949" — so the dial string is derived rather than assumed. A
 * ten-digit local number gets Nepal's country code; anything already carrying
 * a `+` is left alone.
 */
export function telHref(input) {
  const raw = String(input ?? '').trim();
  if (!raw) return '';

  if (raw.startsWith('+')) return `+${raw.slice(1).replace(/\D/g, '')}`;

  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';

  return digits.startsWith('977') ? `+${digits}` : `+977${digits}`;
}
