'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { company } from '@/data/company';
import { EASE } from '@/lib/motion';

const DURATION_MS = 1900;

/**
 * First-paint brand curtain. Runs once per full page load, locks scroll while
 * visible, and is skipped entirely for users who prefer reduced motion.
 */
export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setVisible(false);
      return;
    }

    document.body.style.overflow = 'hidden';

    const started = performance.now();
    let frame;

    const tick = (now) => {
      const pct = Math.min(100, ((now - started) / DURATION_MS) * 100);
      setProgress(pct);
      if (pct < 100) frame = requestAnimationFrame(tick);
      else setVisible(false);
    };

    frame = requestAnimationFrame(tick);

    // rAF is throttled in background tabs; this guarantees the curtain lifts
    // even if the frame loop never advances.
    const failsafe = setTimeout(() => setVisible(false), DURATION_MS + 1200);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(failsafe);
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (!visible) document.body.style.overflow = '';
  }, [visible]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-forest-950"
          exit={{ opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.7, ease: EASE }}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-grid-forest bg-[size:56px_56px] opacity-40" />
          <div className="absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-forest-700/25 blur-[120px]" />

          <motion.div
            className="relative flex flex-col items-center"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <SeedlingMark />

            <p className="mt-8 font-display text-2xl font-semibold tracking-tight text-cream sm:text-3xl">
              {company.name}
            </p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.34em] text-gold-400">
              {company.tagline}
            </p>

            <div className="mt-10 h-px w-56 overflow-hidden bg-white/15 sm:w-72">
              <motion.div
                className="h-full bg-gold-500"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>
            <p className="mt-3 text-[10px] tabular-nums tracking-[0.3em] text-forest-200/70">
              {String(Math.round(progress)).padStart(3, '0')}
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/** Animated line-drawn seedling echoing the Invest Care logo. */
function SeedlingMark() {
  const stroke = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i) => ({
      pathLength: 1,
      opacity: 1,
      transition: { duration: 1.1, delay: 0.15 * i, ease: EASE },
    }),
  };

  return (
    <motion.svg
      width="88"
      height="88"
      viewBox="0 0 100 100"
      fill="none"
      initial="hidden"
      animate="visible"
      className="text-gold-400"
    >
      <motion.circle
        cx="50"
        cy="50"
        r="40"
        stroke="currentColor"
        strokeWidth="2"
        variants={stroke}
        custom={0}
      />
      <motion.path
        d="M50 72V44"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        variants={stroke}
        custom={1}
      />
      <motion.path
        d="M50 50c-12 0-18-6-18-16 10 0 18 6 18 16Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
        variants={stroke}
        custom={2}
      />
      <motion.path
        d="M50 46c12-2 17-9 16-19-10 1-17 8-16 19Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
        variants={stroke}
        custom={3}
      />
      <motion.path
        d="M28 66c8 8 16 10 22 10s14-2 22-10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        variants={stroke}
        custom={4}
      />
    </motion.svg>
  );
}
