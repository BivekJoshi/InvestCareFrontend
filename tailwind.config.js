/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', lg: '2rem' },
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
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
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'ui-serif', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(5, 26, 17, 0.04), 0 8px 24px -12px rgba(5, 26, 17, 0.14)',
        lift: '0 12px 40px -16px rgba(5, 26, 17, 0.28)',
      },
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
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        'fade-up': 'fade-up .6s ease-out both',
        marquee: 'marquee var(--marquee-duration, 38s) linear infinite',
        'marquee-reverse': 'marquee-reverse var(--marquee-duration, 38s) linear infinite',
        aurora: 'aurora var(--aurora-duration, 18s) ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2.4s ease-in-out infinite',
        'spin-slow': 'spin-slow 28s linear infinite',
      },
    },
  },
  plugins: [],
};
