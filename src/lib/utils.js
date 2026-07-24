/**
 * Minimal className joiner — keeps conditional Tailwind lists readable
 * without pulling in an extra dependency.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Picks a legible foreground for a solid hex background using the WCAG
 * relative-luminance formula — keeps icons readable on the lighter sector
 * colours (e.g. #8bc4a2) as well as the dark ones.
 */
export function readableOn(hex) {
  const value = hex.replace('#', '');
  const full =
    value.length === 3
      ? value
          .split('')
          .map((c) => c + c)
          .join('')
      : value;

  const channel = (offset) => {
    const srgb = parseInt(full.slice(offset, offset + 2), 16) / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
  };

  const luminance = 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);
  return luminance > 0.42 ? '#051a11' : '#fbfaf6';
}
