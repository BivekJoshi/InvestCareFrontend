'use client';

import { motion } from 'framer-motion';

import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import { capital } from '@/data/company';
import { EASE, slideInRight, viewportOnce } from '@/lib/motion';

const BAR_TONES = {
  deep: 'bg-forest-900',
  primary: 'bg-forest-600',
  muted: 'bg-forest-300',
  gold: 'bg-gold-500',
};

const MAX = Math.max(...capital.bars.map((b) => b.value));

export default function CapitalStructure({ tone = 'white' }) {
  return (
    <Section id="capital-structure" tone={tone}>
      <SectionHeading
        eyebrow="Capital & Ownership"
        title="Capital Structure"
        lead="Invest Care Limited maintains a disciplined capital framework designed to preserve solvency and support sustainable growth ahead of its planned public offering."
      />

      <div className="mt-16 grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
        <div className="space-y-9">
          {capital.bars.map((bar, i) => (
            <div key={bar.label}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-semibold text-forest-800">{bar.label}</p>
                <p className="font-display text-sm font-bold text-forest-900">{bar.display}</p>
              </div>

              <div className="mt-3 h-3.5 w-full overflow-hidden rounded-full bg-forest-50">
                <motion.div
                  className={`h-full rounded-full ${BAR_TONES[bar.tone]}`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(bar.value / MAX) * 100}%` }}
                  viewport={viewportOnce}
                  transition={{ duration: 1.1, delay: 0.12 * i, ease: EASE }}
                />
              </div>
            </div>
          ))}
        </div>

        <Reveal variants={slideInRight}>
          <div className="rounded-2xl bg-forest-900 p-8 text-cream shadow-lift">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-400">
              Promoter Capital Build-Up
            </h3>

            <dl className="mt-8 space-y-7">
              {capital.buildUp.map((row) => (
                <div key={row.label} className="border-b border-white/10 pb-6">
                  <dt className="text-xs text-forest-100/60">{row.label}</dt>
                  <dd className="mt-2 font-display text-2xl font-semibold text-white">
                    {row.value}
                  </dd>
                </div>
              ))}

              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-400">
                  {capital.buildUpTotal.label}
                </dt>
                <dd className="mt-2 font-display text-4xl font-bold text-white">
                  {capital.buildUpTotal.value}
                </dd>
              </div>
            </dl>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
