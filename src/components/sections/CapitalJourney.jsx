'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Binoculars, HandCoins, LineChart, Handshake } from 'lucide-react';

import Section from '@/components/ui/Section';
import TextReveal from '@/components/ui/TextReveal';
import { EASE } from '@/lib/motion';
import { cn } from '@/lib/utils';

const STEPS = [
  {
    icon: Binoculars,
    title: 'Source & screen',
    body: 'We look for defensible market position, credible management and a believable route to cash generation — then price the downside before the upside.',
    detail: 'Six target sectors · founder-led businesses · Nepal-domiciled',
  },
  {
    icon: HandCoins,
    title: 'Deploy with discipline',
    body: 'Capital is committed in tranches against agreed milestones, with Hospitality & Tourism anchoring the book at 40% and the balance spread across five sectors.',
    detail: '40% anchor allocation · tranche-linked release',
  },
  {
    icon: Handshake,
    title: 'Own actively',
    body: 'We take board seats and work alongside management on governance, reporting and operating discipline. Active ownership is the product, not a side effect.',
    detail: 'Board representation · statutory audit · quarterly reporting',
  },
  {
    icon: LineChart,
    title: 'Compound & realise',
    body: 'Holdings are built toward their own listings and liquidity events — KABIL is already targeting an IPO in FY 2084-85 — while Invest Care itself moves toward NEPSE.',
    detail: 'Portfolio IPOs · dividend flow · listing by Magh 2083',
  },
];

/**
 * Scroll-driven explainer. The left panel stays pinned while the right column
 * scrolls; whichever step is in view drives the pinned artwork and counter.
 */
export default function CapitalJourney() {
  const [active, setActive] = useState(0);
  const ActiveIcon = STEPS[active].icon;

  return (
    <Section id="approach" tone="white" className="py-0 md:py-0">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20">
        {/* Pinned panel */}
        <div className="lg:sticky lg:top-32 lg:h-fit lg:py-28">
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

          {/* Live indicator of the step currently in view */}
          <div className="mt-12 hidden lg:block">
            <div className="relative flex h-56 w-56 items-center justify-center">
              <span className="absolute inset-0 rounded-full border border-forest-100" />
              <span className="absolute inset-6 rounded-full border border-forest-100" />
              <motion.span
                className="absolute inset-0 rounded-full border-2 border-transparent border-t-gold-500"
                animate={{ rotate: active * 90 }}
                transition={{ duration: 0.8, ease: EASE }}
              />

              <div className="relative flex flex-col items-center text-center">
                <motion.span
                  key={active}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-forest-800 text-cream"
                >
                  <ActiveIcon className="h-6 w-6" aria-hidden="true" />
                </motion.span>
                <p className="mt-4 font-display text-4xl font-bold text-forest-900">
                  {String(active + 1).padStart(2, '0')}
                  <span className="text-lg text-forest-300">/{String(STEPS.length).padStart(2, '0')}</span>
                </p>
                <motion.p
                  key={`label-${active}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold-600"
                >
                  {STEPS[active].title}
                </motion.p>
              </div>
            </div>
          </div>
        </div>

        {/* Scrolling steps */}
        <ol className="py-16 lg:py-28">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isActive = active === i;

            return (
              <motion.li
                key={step.title}
                className="relative border-l border-forest-100 pb-14 pl-10 last:pb-0"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                onViewportEnter={() => setActive(i)}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <span
                  className={cn(
                    'absolute -left-[13px] top-1 flex h-6 w-6 items-center justify-center rounded-full border-4 border-white transition-colors duration-500',
                    isActive ? 'bg-gold-500' : 'bg-forest-300',
                  )}
                  aria-hidden="true"
                />

                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-500',
                      isActive ? 'bg-forest-800 text-cream' : 'bg-forest-50 text-forest-600',
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-forest-500">
                    Step {String(i + 1).padStart(2, '0')}
                  </p>
                </div>

                <h3 className="mt-5 font-display text-2xl font-semibold text-forest-900 md:text-3xl">
                  {step.title}
                </h3>
                <p className="mt-4 max-w-lg text-base leading-relaxed text-forest-800/70">
                  {step.body}
                </p>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-gold-600">
                  {step.detail}
                </p>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
