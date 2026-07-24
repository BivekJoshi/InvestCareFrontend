'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/** Thin reading-progress bar pinned under the header. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 top-0 z-[60] h-0.5 w-full origin-left bg-gold-500"
      aria-hidden="true"
    />
  );
}
