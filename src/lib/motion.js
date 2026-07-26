/**
 * Shared framer-motion variants so animation timing stays consistent site-wide.
 * The curve and durations themselves live in the design system (`@/theme`);
 * this module only composes them into reusable variants.
 */

import { motion as motionTokens } from '@/theme';

export const EASE = motionTokens.ease;
export const DURATION = motionTokens.duration;
export const STAGGER = motionTokens.stagger;

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: EASE } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE } },
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
};

/** Parent wrapper that cascades its children in. */
export const stagger = (staggerChildren = 0.1, delayChildren = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
});

/** Viewport config shared by every scroll-triggered section. */
export const viewportOnce = { once: true, amount: 0.2 };
