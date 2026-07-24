import { CheckCircle2 } from 'lucide-react';

import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import SpotlightCard from '@/components/ui/SpotlightCard';
import Aurora from '@/components/ui/Aurora';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { valueProps } from '@/data/company';
import { cn } from '@/lib/utils';

export default function WhyInvest({ tone = 'deep' }) {
  return (
    <Section id="why-invest" tone={tone}>
      <Aurora intensity="soft" />
      <div className="pointer-events-none absolute inset-0 grain opacity-[0.05]" aria-hidden="true" />

      <SectionHeading
        eyebrow="Value Proposition"
        title="Why Invest With Us?"
        lead="Five reasons the Invest Care thesis holds up under scrutiny — not ambition, but capital already deployed behind a sequenced plan."
        invert
      />

      <RevealGroup
        className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
        staggerChildren={0.09}
      >
        {valueProps.map((prop, i) => (
          <RevealItem key={prop.title} className="h-full">
            <SpotlightCard
              className={cn(
                'flex h-full flex-col rounded-3xl border p-7 transition-transform duration-300 hover:-translate-y-1.5',
                i % 2 === 1
                  ? 'border-white/10 bg-forest-900/70'
                  : 'border-white/10 bg-white/[0.04]',
              )}
              spotlightColor="rgba(201, 162, 39, 0.16)"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-500/15 text-gold-400">
                  <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="font-display text-2xl font-bold text-white/10">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>

              <h3 className="mt-6 font-display text-lg font-semibold leading-snug text-white">
                {prop.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-forest-100/70">{prop.body}</p>
            </SpotlightCard>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
