'use client';

import { useEffect, useRef } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';

/**
 * Counts a numeric value up once the element scrolls into view.
 * Non-numeric strings (e.g. "NPR 4.85 Tn") should use <StatValue> instead.
 */
export default function Counter({ to, decimals = 0, prefix = '', suffix = '', className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const format = (n) => `${prefix}${n.toFixed(decimals)}${suffix}`;

    if (!inView) return;
    if (reduceMotion) {
      node.textContent = format(to);
      return;
    }

    const controls = animate(0, to, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (value) => {
        node.textContent = format(value);
      },
    });

    return () => controls.stop();
  }, [inView, to, decimals, prefix, suffix, reduceMotion]);

  return (
    <span ref={ref} className={className}>
      {`${prefix}${(0).toFixed(decimals)}${suffix}`}
    </span>
  );
}
