import { Landmark, Sparkles } from 'lucide-react';

import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal, { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import {
  globalBenchmarks,
  holdingPrinciples,
  nepalMomentum,
  nepalStats,
  nepalWhyNow,
} from '@/data/company';
import { slideInLeft, slideInRight } from '@/lib/motion';

/** Global holding-company benchmarks — the model Invest Care is built on. */
export function GlobalContext({ tone = 'white' }) {
  return (
    <Section id="global" tone={tone}>
      <SectionHeading
        eyebrow="Global Context"
        title="The Global Investment Holding Model"
        lead="Around the world, patient capital deployed into strong operating businesses has built some of the most valuable companies in existence."
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        {globalBenchmarks.map((item, i) => (
          <Reveal key={item.name} variants={i === 0 ? slideInLeft : slideInRight}>
            <article
              className={
                item.featured
                  ? 'h-full rounded-2xl bg-forest-900 p-8 text-cream shadow-lift md:p-10'
                  : 'h-full rounded-2xl border border-forest-100 bg-forest-50 p-8 md:p-10'
              }
            >
              <div className="flex items-center gap-4">
                <span
                  className={
                    item.featured
                      ? 'flex h-12 w-12 items-center justify-center rounded-full bg-gold-500 text-forest-950'
                      : 'flex h-12 w-12 items-center justify-center rounded-full bg-forest-700 text-cream'
                  }
                >
                  <Landmark className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3
                    className={
                      item.featured
                        ? 'font-display text-xl font-semibold text-white'
                        : 'font-display text-xl font-semibold text-forest-900'
                    }
                  >
                    {item.name}
                  </h3>
                  <p
                    className={
                      item.featured ? 'text-xs text-forest-200/70' : 'text-xs text-forest-600'
                    }
                  >
                    {item.country}
                  </p>
                </div>
              </div>

              <p
                className={
                  item.featured
                    ? 'mt-8 font-display text-4xl font-bold text-gold-400 md:text-5xl'
                    : 'mt-8 font-display text-4xl font-bold text-forest-700 md:text-5xl'
                }
              >
                {item.figure}
              </p>
              <p
                className={
                  item.featured
                    ? 'script mt-2 text-lg text-forest-200/70'
                    : 'script mt-2 text-lg text-forest-600'
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
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-14">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-forest-600">
          What Defines a Great Investment Holding Company
        </h3>
      </Reveal>

      <RevealGroup className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" staggerChildren={0.08}>
        {holdingPrinciples.map((principle) => (
          <RevealItem key={principle} className="h-full">
            <div className="flex h-full items-center gap-4 rounded-2xl border border-forest-100 bg-white p-6 shadow-card">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-800 text-cream">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
              </span>
              <p className="text-sm font-semibold leading-snug text-forest-900">{principle}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

/** Nepal macro + regulatory backdrop. */
export function NepalOpportunity({ tone = 'tint' }) {
  return (
    <Section id="market" tone={tone}>
      <SectionHeading
        eyebrow="Nepal Opportunity"
        title="Nepal's Investment Landscape & Opportunity"
        lead="Nepal's capital market is deepening quickly, with regulatory modernization and a widening pipeline of holding and investment companies moving toward public listing."
      />

      <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" staggerChildren={0.08}>
        {nepalStats.map((stat) => (
          <RevealItem key={stat.label} className="h-full">
            <div className="h-full rounded-2xl border border-forest-100 bg-white p-7 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift">
              <p className="font-display text-3xl font-bold text-forest-900">{stat.value}</p>
              <p className="mt-3 text-xs leading-relaxed text-forest-800/65">{stat.label}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Reveal variants={slideInLeft}>
          <div className="h-full rounded-2xl bg-forest-900 p-8 text-cream shadow-lift md:p-10">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-400">
              Regulatory & Government Momentum
            </h3>
            <ul className="mt-7 space-y-5">
              {nepalMomentum.map((point) => (
                <li key={point} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" aria-hidden="true" />
                  <span className="text-sm leading-relaxed text-forest-100/75">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal variants={slideInRight}>
          <div className="h-full rounded-2xl border border-forest-100 bg-white p-8 shadow-card md:p-10">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-forest-600">
              Why Now
            </h3>
            <ul className="mt-7 space-y-5">
              {nepalWhyNow.map((point) => (
                <li key={point} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-forest-600" aria-hidden="true" />
                  <span className="text-sm leading-relaxed text-forest-800/75">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
