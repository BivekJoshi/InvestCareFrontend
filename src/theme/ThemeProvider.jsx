'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { MotionConfig, useReducedMotion } from 'framer-motion';

import theme from './theme';

const ThemeContext = createContext(null);

/**
 * Media query the hero (and anything else with a pointer-driven flourish) uses
 * to decide whether hover choreography is worth mounting at all.
 */
const FINE_POINTER = '(hover: hover) and (pointer: fine)';

/**
 * Wraps the app in the design system.
 *
 * Two jobs:
 *  1. exposes the static theme to client components through `useTheme()`;
 *  2. resolves the *runtime* half of the theme — reduced-motion and pointer
 *     capability — in one place, so individual components stop each writing
 *     their own `matchMedia` effect.
 *
 * Server components import `@/theme` directly instead; the values are the same
 * object, they just cannot subscribe to the runtime flags.
 */
export default function ThemeProvider({ children }) {
  const prefersReducedMotion = useReducedMotion();
  const [hasFinePointer, setHasFinePointer] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(FINE_POINTER);
    const sync = () => setHasFinePointer(query.matches);

    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  const value = useMemo(
    () => ({
      ...theme,
      /** `useReducedMotion` reports `null` until hydration — treat that as "no". */
      prefersReducedMotion: prefersReducedMotion === true,
      hasFinePointer,
    }),
    [prefersReducedMotion, hasFinePointer],
  );

  return (
    <ThemeContext.Provider value={value}>
      {/*
        `reducedMotion="user"` makes every motion component honour the OS-level
        setting: transform and layout animations are skipped while opacity fades
        still resolve, so content never stays invisible.
      */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme() must be called inside <ThemeProvider>.');
  }

  return context;
}
