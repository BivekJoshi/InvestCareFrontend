import { Plus, TrendingUp } from 'lucide-react';

import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal, { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { getIcon } from '@/components/ui/icon-map';
import { capital } from '@/data/company';
import { portfolio } from '@/data/portfolio';
import { scaleIn } from '@/lib/motion';

export default function TheAsk({ tone = 'light' }) {
  const { current, additional, target, note } = capital.ask;

  return (
    <Section id="the-ask" tone={tone}>
      <SectionHeading
        eyebrow="The Ask"
        title="The Investment Opportunity"
        lead="Invest Care is raising promoter capital to fund an already-active, diversified portfolio and a well-advanced acquisition pipeline."
      />

      <div className="mt-14 grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <Reveal variants={scaleIn}>
          <AskCard label={current.label} value={current.value} variant="soft" />
        </Reveal>

        <Connector icon={Plus} />

        <Reveal variants={scaleIn} delay={0.1}>
          <AskCard label={`+ ${additional.label}`} value={additional.value} variant="primary" />
        </Reveal>

        <Connector icon={TrendingUp} />

        <Reveal variants={scaleIn} delay={0.2}>
          <AskCard label={target.label} value={target.value} variant="deep" />
        </Reveal>
      </div>

      <Reveal className="mt-8">
        <p className="text-sm italic leading-relaxed text-forest-800/70">{note}</p>
      </Reveal>

      <div className="mt-16">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-forest-600">
          Use of Proceeds
        </h3>

        <RevealGroup
          className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
          staggerChildren={0.08}
        >
          {portfolio.map((item) => {
            const Icon = getIcon(item.icon);
            return (
              <RevealItem key={item.slug} className="h-full">
                <div className="flex h-full flex-col items-center rounded-2xl border border-forest-100 bg-white p-6 text-center shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-forest-800 text-cream">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="mt-5 text-sm font-semibold leading-snug text-forest-900">
                    {item.name.replace(/ (Pvt\.|Ltd\.|Limited).*$/, '')}
                  </p>
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-gold-600">
                    {item.sector.split(' & ')[0]}
                  </p>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </Section>
  );
}

function AskCard({ label, value, variant }) {
  const styles = {
    soft: 'border border-forest-100 bg-forest-50 text-forest-900',
    primary: 'bg-forest-600 text-cream shadow-lift',
    deep: 'bg-forest-900 text-cream shadow-lift',
  }[variant];

  const labelColor = variant === 'soft' ? 'text-forest-600' : 'text-gold-400';

  return (
    <div className={`flex h-full flex-col justify-center rounded-2xl p-8 ${styles}`}>
      <p className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${labelColor}`}>
        {label}
      </p>
      <p className="mt-4 font-display text-3xl font-bold leading-none sm:text-4xl">{value}</p>
    </div>
  );
}

function Connector({ icon: Icon }) {
  return (
    <div className="flex items-center justify-center py-1 md:py-0">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-500 text-forest-950 shadow-card">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
    </div>
  );
}
