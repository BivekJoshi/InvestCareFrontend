'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

import Counter from '@/components/ui/Counter';
import { getIcon } from '@/components/ui/icon-map';
import { motion as motionTokens } from '@/theme';
import { heroHoldings, heroRaise } from './hero.content';

const { duration, ease } = motionTokens;

/**
 * Right column of the fold: what is being raised, how far it has come, and the
 * holdings the capital already sits behind.
 */
export default function HeroRaisePanel() {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.headline, delay: 0.55, ease }}
    >
      {/* Soft halo so the glass panel lifts off the WebGL scene behind it. */}
      <div
        className="absolute -inset-8 rounded-[3rem] bg-forest-500/10 blur-3xl"
        aria-hidden="true"
      />

      <figure className="ring-gradient relative rounded-3xl bg-forest-950/65 p-6 backdrop-blur-md sm:p-7">
        <figcaption className="flex items-center justify-between gap-4">
          <span className="script text-xl text-forest-200/80">
            {heroRaise.eyebrow}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-500/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-label text-gold-300">
            <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-gold-400" />
            {heroRaise.status}
          </span>
        </figcaption>

        <p className="mt-5 font-display text-[2.5rem] font-bold leading-none text-white">
          <Counter to={heroRaise.target.amount} decimals={2} prefix="NPR " suffix=" Cr" />
        </p>
        <p className="mt-2 text-sm text-forest-200/65">{heroRaise.target.label}</p>

        <ProgressBar percent={heroRaise.progress} />

        <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10">
          {[heroRaise.current, heroRaise.additional].map((entry) => (
            <div key={entry.label} className="bg-forest-950/70 px-4 py-3">
              <dt className="text-[10px] uppercase leading-tight tracking-label text-forest-200/55">
                {entry.label}
              </dt>
              <dd className="mt-1.5 font-display text-lg font-semibold text-cream">{entry.value}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-4 text-[11px] leading-relaxed text-forest-200/50">{heroRaise.note}</p>

        <HoldingsFooter />
      </figure>
    </motion.div>
  );
}

/** Share of the target already paid up. */
function ProgressBar({ percent }) {
  return (
    <div className="mt-6">
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-white/10"
        role="img"
        aria-label={`${percent}% of the target promoter capital is already paid up`}
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-300"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1.3, delay: 1, ease }}
        />
      </div>
      <div className="mt-2 flex justify-between text-[10px] uppercase tracking-label text-forest-200/50">
        <span>{percent}% paid up</span>
        <span>Target {heroRaise.target.value.replace('NPR ', '')}</span>
      </div>
    </div>
  );
}

/**
 * Overlapping sector marks standing in for the live portfolio — richer than a
 * bare count, and it keeps the card compact enough to hold the fold.
 */
function HoldingsFooter() {
  return (
    <Link
      href={heroHoldings.href}
      className="group mt-5 flex items-center gap-3 border-t border-white/10 pt-4"
    >
      <span className="flex -space-x-2" aria-hidden="true">
        {heroHoldings.avatars.map((holding) => {
          const Icon = getIcon(holding.icon);

          return (
            <span
              key={holding.slug}
              title={holding.name}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-forest-800
                         bg-forest-900 text-gold-400 transition-transform duration-300 group-hover:-translate-y-0.5"
            >
              <Icon className="h-3.5 w-3.5" />
            </span>
          );
        })}
      </span>

      <span className="text-xs text-forest-100/70 transition-colors group-hover:text-cream">
        {heroHoldings.summary}
      </span>

      <ArrowUpRight
        className="ml-auto h-4 w-4 shrink-0 text-forest-200/40 transition-all duration-300
                   group-hover:translate-x-0.5 group-hover:text-gold-400"
        aria-hidden="true"
      />
    </Link>
  );
}
