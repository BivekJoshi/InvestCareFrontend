/**
 * Design tokens — the single source of truth for the Invest Care visual system.
 *
 * Written as CommonJS on purpose: `tailwind.config.js` is evaluated by Node
 * before any bundler exists, so it can only `require()`. Application code
 * should import the semantic layer (`@/theme`) rather than reaching in here,
 * so a token rename stays a one-file change.
 */

/** Raw brand ramps. Nothing in the app should hardcode these hex values. */
const palette = {
  forest: {
    50: '#f0f7f2',
    100: '#dbeee1',
    200: '#b9ddc6',
    300: '#8bc4a2',
    400: '#57a479',
    500: '#33865a',
    600: '#1f6b46',
    700: '#17563a',
    800: '#0f4029',
    900: '#0a2e1f',
    950: '#051a11',
  },
  gold: {
    300: '#e2c76b',
    400: '#d4b04a',
    500: '#c9a227',
    600: '#a8851d',
    700: '#856817',
  },
  cream: '#fbfaf6',
};

/** Named roles, so components ask for intent instead of a shade number. */
const brandColor = {
  primary: palette.forest[800],
  primaryDeep: palette.forest[950],
  accent: palette.gold[500],
  accentSoft: palette.gold[300],
  surface: palette.cream,
  ink: palette.forest[900],
};

const typography = {
  fontFamily: {
    sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    display: ['var(--font-display)', 'ui-serif', 'Georgia', 'serif'],
    /** Flourish face — eyebrows, taglines, accented words. Never body copy. */
    script: ['var(--font-script)', 'ui-serif', 'Apple Chancery', 'cursive'],
  },
  /** Letter-spacing used by the small-caps labels that run through the site. */
  tracking: {
    eyebrow: '0.18em',
    label: '0.16em',
    cue: '0.28em',
  },
};

const shadow = {
  card: '0 1px 2px rgba(5, 26, 17, 0.04), 0 8px 24px -12px rgba(5, 26, 17, 0.14)',
  lift: '0 12px 40px -16px rgba(5, 26, 17, 0.28)',
  glow: '0 0 0 1px rgba(201, 162, 39, 0.18), 0 18px 60px -24px rgba(201, 162, 39, 0.45)',
};

/**
 * Motion tokens. `ease` is the framer-motion array form, `easeCss` the same
 * curve for CSS keyframes — keep them in sync.
 */
const motion = {
  ease: [0.22, 1, 0.36, 1],
  easeCss: 'cubic-bezier(0.22, 1, 0.36, 1)',
  duration: {
    fast: 0.35,
    base: 0.6,
    slow: 0.8,
    headline: 0.95,
  },
  stagger: {
    tight: 0.08,
    base: 0.12,
    loose: 0.16,
  },
};

const layout = {
  headerHeight: '4.5rem',
  container: {
    max: '1280px',
    padding: { DEFAULT: '1.25rem', lg: '2rem' },
  },
};

module.exports = { palette, brandColor, typography, shadow, motion, layout };
