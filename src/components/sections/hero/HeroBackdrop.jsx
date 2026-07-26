'use client';

import { motion, useMotionTemplate, useTransform } from 'framer-motion';

import Aurora from '@/components/ui/Aurora';
import HeroScene from '@/components/three/LazyHeroScene';
import { palette } from '@/theme';

/**
 * Every non-content layer of the fold, stacked back to front:
 * aurora wash → blueprint grid → WebGL scene → readability gradients →
 * pointer spotlight → film grain → bottom fade into the ticker band.
 *
 * Kept in its own file so the hero's content components stay readable.
 */
export default function HeroBackdrop({ sceneScale, pointer }) {
  // 8-digit hex keeps the spotlight tied to the gold token instead of a
  // hand-mixed rgba() that would drift if the brand colour changed.
  const spotlightX = useTransform(pointer.x, (value) => `${value * 100}%`);
  const spotlightY = useTransform(pointer.y, (value) => `${value * 100}%`);
  const spotlight = useMotionTemplate`radial-gradient(32rem 32rem at ${spotlightX} ${spotlightY}, ${palette.gold[500]}1f, transparent 68%)`;

  return (
    <>
      <Aurora />

      <div
        className="absolute inset-0 bg-grid-forest bg-[size:64px_64px] opacity-25"
        aria-hidden="true"
      />

      {/* Nudged right on wide screens so the core sits between the two columns
          instead of directly behind the headline. */}
      <motion.div style={{ scale: sceneScale }} className="absolute inset-0 lg:left-[14%]">
        <HeroScene className="pointer-events-none absolute inset-0 opacity-90" />
      </motion.div>

      {/* Left-to-right scrim: keeps the headline legible over the scene. */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-forest-950 via-forest-950/85 to-transparent"
        aria-hidden="true"
      />
      {/* Narrow screens stack the columns, so the scene needs damping everywhere
          rather than only on the left. */}
      <div className="absolute inset-0 bg-forest-950/45 lg:hidden" aria-hidden="true" />
      {/* Vignette so the fold reads as a lit stage rather than a flat panel. */}
      <div
        className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,transparent_35%,rgba(5,26,17,0.75)_100%)]"
        aria-hidden="true"
      />

      {pointer.enabled ? (
        <motion.div
          className="pointer-events-none absolute inset-0 mix-blend-screen"
          style={{ backgroundImage: spotlight }}
          aria-hidden="true"
        />
      ) : null}

      <div className="pointer-events-none absolute inset-0 grain opacity-[0.05]" aria-hidden="true" />
      <div
        className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-forest-950 to-transparent"
        aria-hidden="true"
      />
    </>
  );
}
