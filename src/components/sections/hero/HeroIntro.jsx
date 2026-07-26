'use client';

import { motion } from 'framer-motion';
import { CalendarDays, Landmark, ShieldCheck } from 'lucide-react';

import Button from '@/components/ui/Button';
import Magnetic from '@/components/ui/Magnetic';
import { motion as motionTokens } from '@/theme';
import { heroActions, heroBadge, heroHeadline, heroLead, heroTrust } from './hero.content';

const TRUST_ICONS = {
  shield: ShieldCheck,
  landmark: Landmark,
  calendar: CalendarDays,
};

const { duration, ease } = motionTokens;

/** Entrance timings, in the order the eye should travel. */
const BEAT = {
  badge: 0.1,
  headline: 0.2,
  lead: 0.62,
  actions: 0.72,
  trust: 0.84,
};

/** Shared "rise into place" transition. */
const rise = (delay) => ({ duration: duration.slow, delay, ease });

/**
 * Left column of the fold: status badge, headline, lead, calls to action and
 * the credibility row.
 */
export default function HeroIntro() {
  return (
    <div className="max-w-2xl">
      <motion.div
        className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.06] py-1.5 pl-2 pr-5 backdrop-blur-sm"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={rise(BEAT.badge)}
      >
        <span className="relative flex h-6 w-6 items-center justify-center">
          <span className="absolute inset-0 animate-pulse-soft rounded-full bg-gold-500/25" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-gold-400" />
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-eyebrow text-forest-100">
          {heroBadge.status}
          {/* The location is the first thing to go when the badge gets tight. */}
          <span className="mx-2 hidden text-forest-300/50 sm:inline">·</span>
          <span className="hidden text-forest-200/70 sm:inline">{heroBadge.location}</span>
        </span>
      </motion.div>

      <h1 className="mt-7 font-display text-[clamp(2.35rem,4.4vw,3.9rem)] font-bold leading-[1.05] text-white">
        {heroHeadline.map((line, index) => (
          // The script accent overshoots its line box, so every line carries
          // enough bottom padding for the tallest of them.
          <span key={line.text} className="block overflow-hidden pb-2">
            <motion.span
              className="block"
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{
                duration: duration.headline,
                delay: BEAT.headline + index * motionTokens.stagger.base,
                ease,
              }}
            >
              {line.accent ? <AccentWord>{line.text}</AccentWord> : line.text}
            </motion.span>
          </span>
        ))}
      </h1>

      <motion.p
        className="mt-6 max-w-xl text-base leading-relaxed text-forest-100/75 md:text-lg"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={rise(BEAT.lead)}
      >
        {heroLead}
      </motion.p>

      <motion.div
        className="mt-8 flex flex-wrap items-center gap-4"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={rise(BEAT.actions)}
      >
        {heroActions.map((action) => (
          <Magnetic key={action.href} strength={action.magnetic}>
            <Button href={action.href} variant={action.variant} withArrow={action.withArrow}>
              {action.label}
            </Button>
          </Magnetic>
        ))}
      </motion.div>

      <motion.ul
        className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={rise(BEAT.trust)}
      >
        {heroTrust.map((item) => {
          const Icon = TRUST_ICONS[item.icon] ?? ShieldCheck;

          return (
            <li key={item.label} className="flex items-center gap-2 text-xs text-forest-200/65">
              <Icon className="h-4 w-4 text-gold-500" aria-hidden="true" />
              {item.label}
            </li>
          );
        })}
      </motion.ul>
    </div>
  );
}

/** Gold-gradient script word with a slow sheen sweeping across it. */
function AccentWord({ children }) {
  return (
    <span className="relative inline-block">
      {/* Cursive reads optically smaller than the display face — the bump
          keeps the accented word the same visual weight as the lines above. */}
      <span className="script text-gradient-gold pr-2 text-[1.18em] leading-[1.25]">{children}</span>
      <span
        className="pointer-events-none absolute inset-y-0 left-0 w-16 -skew-x-12 animate-sheen
                   bg-gradient-to-r from-transparent via-white/30 to-transparent motion-reduce:hidden"
        aria-hidden="true"
      />
    </span>
  );
}
