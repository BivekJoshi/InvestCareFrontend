'use client';

import { useSiteContent } from '@/components/SiteContentProvider';

import { useState } from 'react';
import { motion } from 'framer-motion';

import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import AllocationDonut from '@/components/ui/AllocationDonut';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { getIcon } from '@/components/ui/icon-map';
import { fadeUp, slideInRight } from '@/lib/motion';
import { cn, readableOn } from '@/lib/utils';

export default function SectorAllocation({ tone = 'white' }) {
  const { content } = useSiteContent();
  const sectors = content.sectors;
  const [active, setActive] = useState(null);

  return (
    <Section id="sectors" tone={tone}>
      <SectionHeading
        eyebrow="Portfolio Strategy"
        title="Investment Sectors"
        lead="Invest Care allocates capital across six high-conviction sectors. Hospitality & Tourism anchors the portfolio, with the balance diversified across Manufacturing, Pharma, IT, Agriculture, and Hydropower."
      />

      <div className="mt-16 grid items-center gap-14 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <AllocationDonut data={sectors} onActiveChange={setActive} />
        </motion.div>

        <RevealGroup className="space-y-2" staggerChildren={0.08}>
          {sectors.map((sector) => {
            const Icon = getIcon(sector.icon);
            const isActive = active === sector.slug;

            return (
              <RevealItem key={sector.slug} variants={slideInRight}>
                <div
                  onMouseEnter={() => setActive(sector.slug)}
                  onMouseLeave={() => setActive(null)}
                  className={cn(
                    'flex gap-5 rounded-2xl border p-5 transition-all duration-300',
                    isActive
                      ? 'border-forest-200 bg-forest-50 shadow-card'
                      : 'border-transparent hover:border-forest-100',
                  )}
                >
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-transform duration-300"
                    style={{
                      backgroundColor: sector.color,
                      color: readableOn(sector.color),
                      transform: isActive ? 'scale(1.08)' : 'scale(1)',
                    }}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-3">
                      <h3 className="font-display text-lg font-semibold text-forest-900">
                        {sector.name}
                      </h3>
                      <span className="font-display text-lg font-bold text-gold-600">
                        {sector.share}%
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-forest-800/70">
                      {sector.body}
                    </p>
                  </div>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </Section>
  );
}
