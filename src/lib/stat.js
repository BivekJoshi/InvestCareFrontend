/**
 * Turns a display figure from the CMS into props for the animated `Counter`.
 *
 * Editors type what they want to see — "05", "100+", "22.17%", "NPR 4.85 Tn" —
 * and the counter needs the number split from its decoration. Anything that
 * holds no number at all is returned as static text, so a purely verbal stat
 * still renders rather than counting up from nothing.
 *
 *   '05'      → { to: 5,     prefix: '0'                        }
 *   '100+'    → { to: 100,   suffix: '+'                        }
 *   '22.17%'  → { to: 22.17, suffix: '%', decimals: 2           }
 *   'Q3 2026' → { text: 'Q3 2026' }
 */
export function parseStat(display) {
  const value = String(display ?? '').trim();
  // Commas are thousands separators here ("42,000"), never decimal marks —
  // the site writes decimals with a period throughout.
  const match = value.match(/-?\d[\d,]*(?:\.\d+)?/);

  if (!match) return { text: value };

  const raw = match[0];
  const numeric = Number(raw.replace(/,/g, ''));

  if (Number.isNaN(numeric)) return { text: value };

  const [, decimalPart = ''] = raw.split('.');
  const prefix = value.slice(0, match.index);

  return {
    to: numeric,
    // A leading zero is decoration, not magnitude — "05" must not become "5".
    prefix: /^0\d/.test(raw) ? `${prefix}0` : prefix,
    suffix: value.slice(match.index + raw.length),
    decimals: decimalPart.length,
  };
}
