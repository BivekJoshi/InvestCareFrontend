'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { fadeUp, stagger, viewportOnce } from '@/lib/motion';

/**
 * Scroll-triggered entrance wrapper. Defaults to a subtle fade-up;
 * pass any framer-motion variant to override.
 *
 * A variant's own `transition` wins over the component-level `transition` prop,
 * so the delay is merged into the variant rather than passed alongside it.
 */
export default function Reveal({
  children,
  variants = fadeUp,
  delay = 0,
  className = '',
  as = 'div',
}) {
  const MotionTag = motion[as] ?? motion.div;

  const merged = useMemo(() => {
    if (!delay) return variants;
    return {
      ...variants,
      visible: {
        ...variants.visible,
        transition: { ...(variants.visible?.transition ?? {}), delay },
      },
    };
  }, [variants, delay]);

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={merged}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Cascades direct `<RevealItem>` children in one after another.
 */
export function RevealGroup({
  children,
  className = '',
  staggerChildren = 0.1,
  delayChildren = 0,
  as = 'div',
}) {
  const MotionTag = motion[as] ?? motion.div;

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={stagger(staggerChildren, delayChildren)}
    >
      {children}
    </MotionTag>
  );
}

export function RevealItem({ children, className = '', variants = fadeUp, as = 'div' }) {
  const MotionTag = motion[as] ?? motion.div;

  return (
    <MotionTag className={className} variants={variants}>
      {children}
    </MotionTag>
  );
}
