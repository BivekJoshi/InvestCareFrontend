const { palette, typography, shadow, motion, layout } = require('./src/theme/tokens.cjs');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    container: {
      center: true,
      padding: layout.container.padding,
      screens: { '2xl': layout.container.max },
    },
    extend: {
      colors: {
        forest: palette.forest,
        gold: palette.gold,
        cream: palette.cream,
      },
      fontFamily: typography.fontFamily,
      spacing: {
        header: layout.headerHeight,
      },
      letterSpacing: {
        eyebrow: typography.tracking.eyebrow,
        label: typography.tracking.label,
        cue: typography.tracking.cue,
      },
      boxShadow: shadow,
      backgroundImage: {
        'grid-forest':
          'linear-gradient(to right, rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.05) 1px, transparent 1px)',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-up': {
          from: { opacity: 0, transform: 'translateY(12px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          from: { transform: 'translateX(-50%)' },
          to: { transform: 'translateX(0)' },
        },
        aurora: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(5%, -7%, 0) scale(1.15)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
        /** Slow sweep across the accented headline word. */
        'sheen-slide': {
          '0%, 65%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(220%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        'fade-up': `fade-up .6s ${motion.easeCss} both`,
        marquee: 'marquee var(--marquee-duration, 38s) linear infinite',
        'marquee-reverse': 'marquee-reverse var(--marquee-duration, 38s) linear infinite',
        aurora: 'aurora var(--aurora-duration, 18s) ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2.4s ease-in-out infinite',
        'spin-slow': 'spin-slow 28s linear infinite',
        sheen: 'sheen-slide 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
