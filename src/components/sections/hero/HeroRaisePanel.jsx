'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

import { getIcon } from '@/components/ui/icon-map';
import { motion as motionTokens } from '@/theme';
import { heroPortfolio } from './hero.content';

const { duration, ease, stagger } = motionTokens;

/** Entrance beat for the first holding row; the rest follow it. */
const ROWS_DELAY = 0.75;

/**
 * Right column of the fold: the live portfolio — what the capital already sits
 * behind, one quiet row per holding.
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
      {/* <div
        className="absolute -inset-8 rounded-[3rem] bg-forest-500/10 blur-3xl"
        aria-hidden="true"
      />

      <figure className="ring-gradient relative rounded-3xl bg-forest-950/65 p-6 backdrop-blur-md sm:p-7">
        <figcaption className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
          <span className="script text-xl text-forest-200/80">{heroPortfolio.eyebrow}</span>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-label text-gold-300/90">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
          </span>
        </figcaption>

        <ul className="divide-y divide-white/[0.06]">
          {heroPortfolio.holdings.map((holding, index) => (
            <HoldingRow key={holding.slug} holding={holding} index={index} />
          ))}
        </ul>

        <Link
          href={heroPortfolio.href}
          className="group flex items-center gap-3 border-t border-white/10 pt-4 text-xs
                     text-forest-100/70 transition-colors hover:text-cream"
        >
          {heroPortfolio.cta}
          <span className="text-forest-200/35">·</span>
          <span className="text-forest-200/50">{heroPortfolio.summary}</span>
          <ArrowUpRight
            className="ml-auto h-4 w-4 shrink-0 text-forest-200/40 transition-all duration-300
                       group-hover:translate-x-0.5 group-hover:text-gold-400"
            aria-hidden="true"
          />
        </Link>
      </figure> */}
    </motion.div>
  );
}

/** One holding: mark, trading name, the fact that defines it, and its sector. */
function HoldingRow({ holding, index }) {
  const Icon = getIcon(holding.icon);

  return (
    <motion.li
      className="flex items-center gap-3.5 py-3.5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.base, delay: ROWS_DELAY + index * stagger.tight, ease }}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-gold-400/90">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>

      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-cream">{holding.name}</p>
        <p className="truncate text-[11px] leading-relaxed text-forest-200/50">{holding.detail}</p>
      </div>

      <span className="ml-auto shrink-0 text-[10px] uppercase tracking-label text-forest-200/40">
        {holding.sector}
      </span>
    </motion.li>
  );
}
