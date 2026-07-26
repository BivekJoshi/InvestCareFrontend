'use client';

import { useCallback, useRef } from 'react';
import { motion, useMotionValue, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

import { useTheme } from '@/theme/ThemeProvider';
import HeroBackdrop from './HeroBackdrop';
import HeroIntro from './HeroIntro';
import HeroMetrics from './HeroMetrics';
import HeroRaisePanel from './HeroRaisePanel';

/**
 * The fold.
 *
 * This file owns composition and scroll/pointer choreography only — the copy
 * lives in `hero.content.js` and each band of the layout is its own component,
 * so a change to the headline never means scrolling past the WebGL setup.
 */
export default function Hero() {
  const sectionRef = useRef(null);
  const { hasFinePointer, prefersReducedMotion } = useTheme();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Content drifts up and dissolves as the next section arrives.
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);

  // Normalised pointer position (0-1) driving the spotlight in the backdrop.
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.4);
  const tracksPointer = hasFinePointer && !prefersReducedMotion;

  const handlePointerMove = useCallback(
    (event) => {
      if (!tracksPointer) return;

      const bounds = event.currentTarget.getBoundingClientRect();
      pointerX.set((event.clientX - bounds.left) / bounds.width);
      pointerY.set((event.clientY - bounds.top) / bounds.height);
    },
    [tracksPointer, pointerX, pointerY],
  );

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-forest-950 pt-28 text-cream md:pt-32"
    >
      <HeroBackdrop
        sceneScale={sceneScale}
        pointer={{ x: pointerX, y: pointerY, enabled: tracksPointer }}
      />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="container relative z-10 grid flex-1 content-center gap-12 py-12
                   lg:grid-cols-[1.12fr_0.88fr] lg:items-center lg:gap-14 xl:gap-20"
      >
        <HeroIntro />
        <HeroRaisePanel />
      </motion.div>

      <ScrollCue />
      <HeroMetrics />
    </section>
  );
}

/** Quiet nudge toward the ticker band, desktop only. */
function ScrollCue() {
  return (
    <motion.a
      href="#ticker"
      className="absolute bottom-32 right-8 z-10 hidden flex-col items-center gap-2 text-[10px]
                 uppercase tracking-cue text-forest-200/60 transition-colors hover:text-white xl:flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.3, duration: 0.6 }}
    >
      Scroll
      <motion.span
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ArrowDown className="h-4 w-4" aria-hidden="true" />
      </motion.span>
    </motion.a>
  );
}
