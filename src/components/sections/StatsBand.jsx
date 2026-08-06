'use client';

import { useSiteContent } from '@/components/SiteContentProvider';

import { motion } from 'framer-motion';

import Counter from '@/components/ui/Counter';
import Aurora from '@/components/ui/Aurora';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { EASE, fadeUp, viewportOnce } from '@/lib/motion';
import { parseStat } from '@/lib/stat';

/**
 * Proof band between the intro and the strategy sections: four figures that
 * count up on entry, separated by a line that draws itself across the band.
 */
export default function StatsBand() {
  const { content } = useSiteContent();

  // Editors type the figure as they want to read it ("05", "22.17%");
  // `parseStat` splits the number from its decoration so it can animate.
  const STATS = content.landing.stats.map((stat) => ({
    ...parseStat(stat.value),
    label: stat.label,
    note: stat.body,
  }));

  return (
    <section className="relative overflow-hidden bg-forest-950 py-20 text-cream md:py-24">
      <Aurora intensity="soft" />
      <div className="pointer-events-none absolute inset-0 grain opacity-[0.05]" aria-hidden="true" />
      <div className="absolute inset-0 bg-grid-forest bg-[size:56px_56px] opacity-20" aria-hidden="true" />

      <div className="container relative">
        <motion.div
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
        >
          <div>
            <span className="eyebrow-invert">By the numbers</span>
            <h2 className="mt-5 max-w-xl text-3xl font-bold leading-tight text-white sm:text-4xl">
              Not a proposal on paper.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-forest-100/65">
            Every figure below is drawn from live holdings and a board that has already built
            businesses across six sectors.
          </p>
        </motion.div>

        <motion.div
          className="mt-12 h-px w-full origin-left bg-gradient-to-r from-gold-500 via-forest-600 to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 1.2, ease: EASE }}
        />

        <RevealGroup
          className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4"
          staggerChildren={0.12}
        >
          {STATS.map((stat) => (
            <RevealItem key={stat.label}>
              <div className="group">
                <p className="font-display text-5xl font-bold text-gradient-gold md:text-6xl">
                  {stat.text ? (
                    stat.text
                  ) : (
                    <Counter
                      to={stat.to}
                      decimals={stat.decimals ?? 0}
                      prefix={stat.prefix ?? ''}
                      suffix={stat.suffix ?? ''}
                    />
                  )}
                </p>
                <p className="mt-4 text-sm font-semibold text-white">{stat.label}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-forest-200/60">{stat.note}</p>
                <span className="mt-5 block h-px w-10 bg-gold-600/50 transition-all duration-500 group-hover:w-20" />
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
