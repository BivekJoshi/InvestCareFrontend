'use client';

import { motion } from 'framer-motion';
import { Globe2 } from 'lucide-react';

import Section from '@/components/ui/Section';
import SpotlightCard from '@/components/ui/SpotlightCard';
import TextReveal from '@/components/ui/TextReveal';
import Button from '@/components/ui/Button';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { globalBenchmarks, holdingPrinciples } from '@/data/company';
import { EASE, viewportOnce } from '@/lib/motion';

/**
 * Positions Invest Care against the global holding-company model, then lists
 * the four traits the model depends on.
 */
export default function GlobalStrip() {
  return (
    <Section id="model" tone="tint">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:items-end lg:gap-20">
        <div>
          <span className="eyebrow">Global Context</span>
          <TextReveal
            text="A model proven at trillion-dollar scale."
            className="mt-6 font-display text-3xl font-bold leading-[1.08] sm:text-4xl md:text-[2.6rem]"
            highlight={['trillion-dollar']}
            highlightClassName="text-gradient-forest"
          />
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-md text-base leading-relaxed text-forest-800/70">
            Around the world, patient capital deployed into strong operating businesses has built
            some of the most valuable companies in existence. Invest Care applies the same
            playbook — at Nepal's scale, in Nepal's sectors.
          </p>
          <Button href="/invest#global" variant="outline" className="shrink-0" withArrow>
            The full case
          </Button>
        </div>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        {globalBenchmarks.map((item, i) => (
          <motion.article
            key={item.name}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
          >
            <SpotlightCard
              className={
                item.featured
                  ? 'h-full rounded-3xl bg-forest-900 p-8 text-cream shadow-lift md:p-10'
                  : 'h-full rounded-3xl border border-forest-100 bg-white p-8 md:p-10'
              }
              spotlightColor={
                item.featured ? 'rgba(201, 162, 39, 0.18)' : 'rgba(31, 107, 70, 0.09)'
              }
            >
              <div className="flex items-center gap-4">
                <span
                  className={
                    item.featured
                      ? 'flex h-11 w-11 items-center justify-center rounded-full bg-gold-500 text-forest-950'
                      : 'flex h-11 w-11 items-center justify-center rounded-full bg-forest-700 text-cream'
                  }
                >
                  <Globe2 className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3
                    className={
                      item.featured
                        ? 'font-display text-lg font-semibold text-white'
                        : 'font-display text-lg font-semibold text-forest-900'
                    }
                  >
                    {item.name}
                  </h3>
                  <p
                    className={item.featured ? 'text-xs text-forest-200/70' : 'text-xs text-forest-600'}
                  >
                    {item.country}
                  </p>
                </div>
              </div>

              <p
                className={
                  item.featured
                    ? 'mt-8 font-display text-4xl font-bold text-gradient-gold md:text-5xl'
                    : 'mt-8 font-display text-4xl font-bold text-forest-700 md:text-5xl'
                }
              >
                {item.figure}
              </p>
              <p
                className={
                  item.featured
                    ? 'mt-2 text-xs italic text-forest-200/70'
                    : 'mt-2 text-xs italic text-forest-600'
                }
              >
                {item.caption}
              </p>

              <ul className="mt-8 space-y-4">
                {item.points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span
                      className={
                        item.featured
                          ? 'mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400'
                          : 'mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-forest-600'
                      }
                      aria-hidden="true"
                    />
                    <span
                      className={
                        item.featured
                          ? 'text-sm leading-relaxed text-forest-100/75'
                          : 'text-sm leading-relaxed text-forest-800/75'
                      }
                    >
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          </motion.article>
        ))}
      </div>

      <RevealGroup className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" staggerChildren={0.08}>
        {holdingPrinciples.map((principle, i) => (
          <RevealItem key={principle} className="h-full">
            <div className="group flex h-full items-center gap-4 rounded-2xl border border-forest-100 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
              <span className="font-display text-2xl font-bold text-forest-200 transition-colors duration-300 group-hover:text-gold-500">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="text-sm font-semibold leading-snug text-forest-900">{principle}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
