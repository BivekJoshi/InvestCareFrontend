'use client';

import { MotionConfig } from 'framer-motion';

/**
 * `reducedMotion="user"` makes every motion component honour the OS-level
 * "reduce motion" setting: transform and layout animations are skipped while
 * opacity fades still resolve, so content never stays invisible.
 */
export default function MotionProvider({ children }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
