'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { Binoculars, HandCoins, LineChart, Handshake } from 'lucide-react';

import Section from '@/components/ui/Section';
import TextReveal from '@/components/ui/TextReveal';
import { EASE } from '@/lib/motion';
import { cn } from '@/lib/utils';

const STEPS = [
  {
    id: 'source-screen',
    icon: Binoculars,
    title: 'Source & screen',
    body: 'We look for defensible market position, credible management and a believable route to cash generation — then price the downside before the upside.',
    detail: 'Six target sectors · founder-led businesses · Nepal-domiciled',
  },
  {
    id: 'deploy',
    icon: HandCoins,
    title: 'Deploy with discipline',
    body: 'Capital is committed in tranches against agreed milestones, with Hospitality & Tourism anchoring the book at 40% and the balance spread across five sectors.',
    detail: '40% anchor allocation · tranche-linked release',
  },
  {
    id: 'own-actively',
    icon: Handshake,
    title: 'Own actively',
    body: 'We take board seats and work alongside management on governance, reporting and operating discipline. Active ownership is the product, not a side effect.',
    detail: 'Board representation · statutory audit · quarterly reporting',
  },
  {
    id: 'compound-realise',
    icon: LineChart,
    title: 'Compound & realise',
    body: 'Holdings are built toward their own listings and liquidity events — KABIL is already targeting an IPO in FY 2084-85 — while Invest Care itself moves toward NEPSE.',
    detail: 'Portfolio IPOs · dividend flow · listing by Magh 2083',
  },
];

const TOTAL = String(STEPS.length).padStart(2, '0');
const pad = (n) => String(n).padStart(2, '0');

/**
 * Scroll-driven explainer. The left panel stays pinned while the right column
 * scrolls; whichever step crosses the reading line drives the pinned dial, and
 * the dial doubles as navigation so a reader can jump straight to a step.
 */
export default function CapitalJourney() {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();

  const listRef = useRef(null);
  const stepRefs = useRef([]);

  /**
   * Tracks the step nearest the reading line (40% down the viewport). An
   * observer is used rather than `onViewportEnter` so the dial follows the
   * reader back *up* the list as well as down.
   */
  useEffect(() => {
    const nodes = stepRefs.current.filter(Boolean);
    if (!nodes.length || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number(entry.target.dataset.step));
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  /** Continuous fill for the rail and the dial, tied to the list's scroll. */
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 0.6', 'end 0.6'],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  const progress = reduceMotion ? scrollYProgress : smoothProgress;

  const goToStep = useCallback(
    (index) => {
      stepRefs.current[index]?.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'center',
      });
    },
    [reduceMotion],
  );

  const ActiveIcon = STEPS[active].icon;

  return (
    <Section id="approach" tone="white" className="py-0 md:py-0">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-20">
        {/* Pinned panel */}
        <div className="pt-16 lg:sticky lg:top-32 lg:h-fit lg:py-28">
          <span className="eyebrow">How We Work</span>

          <TextReveal
            text="Four disciplines, applied to every rupee."
            className="mt-6 font-display text-3xl font-bold leading-[1.08] sm:text-4xl md:text-[2.6rem]"
            highlight={['rupee.']}
            highlightClassName="text-gradient-forest"
          />

          <p className="mt-6 max-w-md text-base leading-relaxed text-forest-800/70">
            Invest Care is a holding company, not a fund. We buy into businesses we intend to help
            run — and we stay.
          </p>

          {/* Dial + jump-to navigation, desktop only — mobile gets the sticky bar below. */}
          <div className="mt-10 hidden lg:block">
            <div className="flex items-center gap-5">
              <div className="relative h-20 w-20 shrink-0">
                <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    strokeWidth="4"
                    className="stroke-forest-100"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="stroke-gold-500"
                    style={{ pathLength: progress }}
                  />
                </svg>

                <span className="absolute inset-0 flex items-center justify-center">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={active}
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      transition={{ duration: 0.28, ease: EASE }}
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-forest-800 text-cream"
                    >
                      <ActiveIcon className="h-5 w-5" aria-hidden="true" />
                    </motion.span>
                  </AnimatePresence>
                </span>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-label text-forest-500">
                  Step <span className="tabular-nums text-forest-900">{pad(active + 1)}</span> of{' '}
                  <span className="tabular-nums">{TOTAL}</span>
                </p>
                <p className="mt-1 font-display text-xl font-semibold text-forest-900">
                  {STEPS[active].title}
                </p>
              </div>
            </div>

            <nav aria-label="Capital journey steps" className="mt-8 space-y-1">
              {STEPS.map((step, i) => {
                const isActive = active === i;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => goToStep(i)}
                    aria-current={isActive ? 'step' : undefined}
                    className={cn(
                      'relative flex w-full items-center gap-3 rounded-xl py-2.5 pl-4 pr-3 text-left',
                      'transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2',
                      'focus-visible:ring-gold-500 focus-visible:ring-offset-2',
                      isActive
                        ? 'bg-forest-50 text-forest-900'
                        : 'text-forest-800/60 hover:bg-forest-50/60 hover:text-forest-900',
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="journey-nav-marker"
                        className="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-gold-500"
                        transition={{ duration: 0.35, ease: EASE }}
                        aria-hidden="true"
                      />
                    )}
                    <span
                      className={cn(
                        'text-[11px] font-semibold tabular-nums transition-colors duration-300',
                        isActive ? 'text-gold-600' : 'text-forest-300',
                      )}
                    >
                      {pad(i + 1)}
                    </span>
                    <span className="text-sm font-semibold">{step.title}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Scrolling steps */}
        <div className="pb-16 lg:py-28">
          {/* Mobile progress cue — the pinned dial has no room to live here. */}
          <div className="sticky top-[calc(var(--header-height)+0.75rem)] z-20 mb-8 flex items-center gap-3 rounded-full border border-forest-100 bg-white/90 px-4 py-2.5 shadow-card backdrop-blur lg:hidden">
            <span className="text-[11px] font-semibold tabular-nums text-gold-600">
              {pad(active + 1)}/{TOTAL}
            </span>
            <span className="truncate text-xs font-semibold text-forest-900">
              {STEPS[active].title}
            </span>
            <span className="ml-auto h-1 w-14 shrink-0 overflow-hidden rounded-full bg-forest-100">
              <motion.span
                className="block h-full origin-left rounded-full bg-forest-700"
                style={{ scaleX: progress }}
                aria-hidden="true"
              />
            </span>
          </div>

          <ol ref={listRef} className="relative">
            {/* Rail: static hairline with a scroll-linked fill on top. */}
            <span
              className="absolute bottom-6 left-[9px] top-2 w-px bg-forest-100"
              aria-hidden="true"
            />
            <motion.span
              className="absolute bottom-6 left-[9px] top-2 w-px origin-top bg-gradient-to-b from-forest-700 to-gold-500"
              style={{ scaleY: progress }}
              aria-hidden="true"
            />

            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const isActive = active === i;
              const isPassed = i < active;

              return (
                <motion.li
                  key={step.id}
                  id={`journey-${step.id}`}
                  data-step={i}
                  ref={(node) => {
                    stepRefs.current[i] = node;
                  }}
                  aria-current={isActive ? 'step' : undefined}
                  className="relative scroll-mt-32 pb-6 pl-8 last:pb-0"
                  initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, ease: EASE }}
                >
                  <span
                    className={cn(
                      'absolute left-0 top-8 flex h-[18px] w-[18px] items-center justify-center',
                      'rounded-full border-4 border-white transition-colors duration-500',
                      isActive ? 'bg-gold-500' : isPassed ? 'bg-forest-700' : 'bg-forest-200',
                    )}
                    aria-hidden="true"
                  >
                    {isActive && !reduceMotion && (
                      <span className="absolute h-full w-full animate-ping rounded-full bg-gold-500/40" />
                    )}
                  </span>

                  <div
                    className={cn(
                      'rounded-2xl border p-5 transition-colors duration-500 md:p-6',
                      isActive
                        ? 'border-forest-100 bg-forest-50/60'
                        : 'border-transparent bg-transparent',
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-500',
                          isActive ? 'bg-forest-800 text-cream' : 'bg-forest-50 text-forest-600',
                        )}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-forest-500">
                        Step {pad(i + 1)}
                        <span className="sr-only"> of {STEPS.length}</span>
                      </p>
                    </div>

                    <h3 className="mt-4 font-display text-2xl font-semibold text-forest-900 md:text-3xl">
                      {step.title}
                    </h3>
                    <p className="mt-3 max-w-lg text-base leading-relaxed text-forest-800/70">
                      {step.body}
                    </p>
                    <p
                      className={cn(
                        'mt-5 inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase',
                        'tracking-[0.14em] transition-colors duration-500',
                        isActive
                          ? 'border-gold-500/40 bg-gold-500/10 text-gold-700'
                          : 'border-forest-100 bg-white text-forest-500',
                      )}
                    >
                      {step.detail}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </Section>
  );
}
