import { BarChart3, Handshake, Quote, Scale } from 'lucide-react';

import Section from '@/components/ui/Section';
import Reveal, { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { investorCommitments, investorQuote } from '@/data/company';

const ICONS = [BarChart3, Handshake, Scale];

export default function InvestorCommitment({ tone = 'white' }) {
  return (
    <Section id="commitment" tone={tone}>
      <Reveal className="max-w-3xl">
        <span className="eyebrow">Investor Relations</span>
        <h2 className="mt-5 text-3xl font-bold leading-[1.1] text-balance sm:text-4xl md:text-5xl">
          Our Commitment to Investors
        </h2>
      </Reveal>

      <Reveal className="mt-12">
        <figure className="relative overflow-hidden rounded-2xl bg-forest-900 p-8 text-cream shadow-lift md:p-14">
          <div
            className="absolute inset-0 bg-grid-forest bg-[size:48px_48px] opacity-25"
            aria-hidden="true"
          />
          <Quote
            className="relative h-10 w-10 text-gold-500/60"
            aria-hidden="true"
          />
          <blockquote className="relative mt-6">
            <p className="font-display text-xl italic leading-relaxed text-white md:text-2xl">
              {investorQuote.text}
            </p>
          </blockquote>
          <figcaption className="relative mt-8 text-sm text-gold-400">
            — {investorQuote.attribution}
          </figcaption>
        </figure>
      </Reveal>

      <RevealGroup className="mt-8 grid gap-6 md:grid-cols-3" staggerChildren={0.1}>
        {investorCommitments.map((item, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <RevealItem key={item.title} className="h-full">
              <div className="surface-card h-full">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-forest-800 text-cream">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-6 font-display text-lg font-semibold text-forest-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-forest-800/70">{item.body}</p>
              </div>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </Section>
  );
}
