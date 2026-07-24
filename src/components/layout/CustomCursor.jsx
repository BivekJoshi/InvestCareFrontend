'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Trailing ring cursor for fine-pointer devices. It never replaces the native
 * cursor (which stays visible for accessibility) — it just adds a soft ring
 * that grows over interactive elements.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 280, damping: 26, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 280, damping: 26, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    setEnabled(true);

    const move = (event) => {
      x.set(event.clientX);
      y.set(event.clientY);

      const interactive = event.target?.closest?.(
        'a, button, input, select, textarea, [data-cursor="hover"]',
      );
      setActive(Boolean(interactive));
    };

    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[80] h-2 w-2 rounded-full bg-gold-500 mix-blend-difference"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[80] rounded-full border border-gold-500/70"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: active ? 46 : 28,
          height: active ? 46 : 28,
          opacity: active ? 0.9 : 0.45,
        }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      />
    </>
  );
}
