/**
 * Semantic theme layer.
 *
 * Tokens (`tokens.cjs`) describe *what a value is*; this file describes *what
 * a value is for* — the tone a section renders on, the recipe behind a button
 * variant, the colours the WebGL scene paints with. Components import from
 * here (or from the `useTheme()` context when they need runtime state), never
 * from the raw token file.
 */

import tokens from './tokens.cjs';

export const { palette, brandColor, typography, shadow, motion, layout } = tokens;

export const brand = {
  name: 'Invest Care Limited',
  shortName: 'Invest Care',
  tagline: 'Your Capital. Our Commitment.',
  /** Drives the browser chrome colour in `app/layout.jsx`. */
  themeColor: brandColor.primary,
};

/**
 * Background tones every page section can sit on. Each tone carries the full
 * set of foreground decisions with it, so a section never has to guess whether
 * its heading should be dark or light.
 */
export const surfaces = {
  light: {
    section: 'bg-cream text-forest-900',
    heading: 'text-forest-900',
    body: 'text-forest-800/75',
    muted: 'text-forest-800/60',
    invert: false,
  },
  white: {
    section: 'bg-white text-forest-900',
    heading: 'text-forest-900',
    body: 'text-forest-800/75',
    muted: 'text-forest-800/60',
    invert: false,
  },
  tint: {
    section: 'bg-forest-50 text-forest-900',
    heading: 'text-forest-900',
    body: 'text-forest-800/75',
    muted: 'text-forest-800/60',
    invert: false,
  },
  dark: {
    section: 'bg-forest-900 text-forest-50',
    heading: 'text-white',
    body: 'text-forest-100/80',
    muted: 'text-forest-200/60',
    invert: true,
  },
  deep: {
    section: 'bg-forest-950 text-forest-50',
    heading: 'text-white',
    body: 'text-forest-100/80',
    muted: 'text-forest-200/60',
    invert: true,
  },
};

export const DEFAULT_TONE = 'light';

/** Resolves a tone name to its surface recipe, falling back to the default. */
export function surface(tone = DEFAULT_TONE) {
  return surfaces[tone] ?? surfaces[DEFAULT_TONE];
}

/** Button recipes — shared by `<Button>` and anything that has to look like one. */
export const button = {
  base:
    'group inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold ' +
    'transition-all duration-300 focus-visible:outline focus-visible:outline-2 ' +
    'focus-visible:outline-offset-2 focus-visible:outline-gold-500 disabled:opacity-60',
  variants: {
    primary:
      'bg-forest-800 text-cream shadow-card hover:-translate-y-0.5 hover:bg-forest-700 hover:shadow-lift',
    gold: 'bg-gold-500 text-forest-950 shadow-card hover:-translate-y-0.5 hover:bg-gold-400 hover:shadow-lift',
    outline: 'border border-forest-300 text-forest-800 hover:border-forest-700 hover:bg-forest-50',
    ghostLight:
      'border border-white/25 text-cream backdrop-blur-sm hover:border-white/60 hover:bg-white/10',
  },
  sizes: {
    sm: 'px-5 py-2.5',
    md: 'px-7 py-3.5',
    lg: 'px-8 py-4 text-base',
  },
};

/**
 * Colours for the WebGL hero scene. three.js takes raw hex, so this is the one
 * place allowed to hand out literal values — and they still come from tokens.
 */
export const scene = {
  core: palette.forest[700],
  shell: palette.forest[400],
  halo: palette.gold[500],
  orbit: palette.gold[500],
  node: palette.gold[300],
  particles: palette.forest[300],
  light: {
    key: '#e8f5ec',
    warm: palette.gold[500],
    cool: palette.forest[400],
  },
};

/** Everything the `useTheme()` context hands to client components. */
export const theme = {
  brand,
  palette,
  brandColor,
  typography,
  shadow,
  motion,
  layout,
  surfaces,
  button,
  scene,
  surface,
};

export default theme;
