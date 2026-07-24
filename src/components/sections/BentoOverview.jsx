'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Compass, Eye, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';

import Section from '@/components/ui/Section';
import MediaFrame from '@/components/ui/MediaFrame';
import SpotlightCard from '@/components/ui/SpotlightCard';
import TextReveal from '@/components/ui/TextReveal';
import Button from '@/components/ui/Button';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { company } from '@/data/company';
import { fadeUp, scaleIn } from '@/lib/motion';

/**
 * Asymmetric bento grid replacing a conventional two-column intro: the story,
 * the mission, the vision, the values and a photography slot all read as one
 * composition rather than a stack of rows.
 */
export default function BentoOverview() {
  return (
    <Section id="overview" tone="light">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <motion.span
            className="eyebrow"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Company Overview
          </motion.span>

          <TextReveal
            text="An investment holding company built on disciplined stewardship."
            className="mt-6 font-display text-3xl font-bold leading-[1.08] sm:text-4xl md:text-[2.9rem]"
            highlight={['stewardship.']}
            highlightClassName="text-gradient-forest"
          />
        </div>

        <Button href="/about" variant="outline" className="shrink-0" withArrow>
          About Invest Care
        </Button>
      </div>

      <RevealGroup
        className="mt-14 grid auto-rows-[minmax(0,auto)] gap-5 lg:grid-cols-12"
        staggerChildren={0.08}
      >
        {/* Lead story */}
        <RevealItem className="lg:col-span-7" variants={fadeUp}>
          <SpotlightCard
            className="h-full rounded-3xl border border-forest-100 bg-white p-8 shadow-card md:p-10"
            spotlightColor="rgba(31, 107, 70, 0.09)"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-forest-800 text-cream">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="mt-7 text-base leading-relaxed text-forest-800/80 md:text-lg">
              {company.intro}
            </p>
            <p className="mt-4 text-base leading-relaxed text-forest-800/70">
              {company.introSecondary}
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {['Active ownership', 'Long-term horizon', 'Institutional governance'].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-forest-200 px-4 py-1.5 text-xs font-semibold text-forest-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </SpotlightCard>
        </RevealItem>

        {/* Photography slot + incorporation badge */}
        <RevealItem className="lg:col-span-5" variants={scaleIn}>
          <div className="relative h-full overflow-hidden rounded-3xl">
            <MediaFrame
              /* set to "/images/company/kathmandu-skyline.jpg" once the asset exists */
              src={null}
              alt="Invest Care Limited — Kathmandu operations"
              hint="/images/company/kathmandu-skyline.jpg — landscape, 1600×1200"
              ratio="landscape"
              className="h-full rounded-3xl"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />

            <div className="pointer-events-none absolute bottom-5 left-5 rounded-2xl bg-forest-950/85 p-5 backdrop-blur-sm">
              <p className="font-display text-2xl font-bold text-gold-400">2074 BS</p>
              <p className="mt-1 max-w-[13rem] text-[11px] leading-relaxed text-forest-100/70">
                Incorporated under the Companies Act of Nepal
              </p>
            </div>
          </div>
        </RevealItem>

        {/* Mission */}
        <RevealItem className="lg:col-span-4" variants={fadeUp}>
          <PillarCard icon={Compass} title="Our Mission" body={company.mission} />
        </RevealItem>

        {/* Vision — the visually dominant tile */}
        <RevealItem className="lg:col-span-4" variants={fadeUp}>
          <SpotlightCard
            className="h-full rounded-3xl bg-forest-900 p-8 text-cream shadow-lift"
            spotlightColor="rgba(201, 162, 39, 0.18)"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-500 text-forest-950">
              <Eye className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="mt-7 font-display text-xl font-semibold text-white">Our Vision</h3>
            <p className="mt-4 text-sm leading-relaxed text-forest-100/75">{company.vision}</p>

            <Link
              href="/invest"
              className="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-gold-400 transition-colors hover:text-gold-300"
            >
              How we get there
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </SpotlightCard>
        </RevealItem>

        {/* Values */}
        <RevealItem className="lg:col-span-4" variants={fadeUp}>
          <SpotlightCard
            className="h-full rounded-3xl border border-forest-100 bg-white p-8 shadow-card"
            spotlightColor="rgba(31, 107, 70, 0.09)"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-forest-800 text-cream">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="mt-7 font-display text-xl font-semibold text-forest-900">
              Our Core Values
            </h3>
            <ul className="mt-5 space-y-4">
              {company.values.map((value) => (
                <li key={value.title} className="border-l-2 border-gold-500/60 pl-4">
                  <p className="text-sm font-semibold text-forest-800">{value.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-forest-800/65">{value.body}</p>
                </li>
              ))}
            </ul>
          </SpotlightCard>
        </RevealItem>
      </RevealGroup>
    </Section>
  );
}

function PillarCard({ icon: Icon, title, body }) {
  return (
    <SpotlightCard
      className="h-full rounded-3xl border border-forest-100 bg-forest-50 p-8"
      spotlightColor="rgba(31, 107, 70, 0.1)"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-forest-800 text-cream">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="mt-7 font-display text-xl font-semibold text-forest-900">{title}</h3>
      <p className="mt-4 text-sm leading-relaxed text-forest-800/70">{body}</p>
    </SpotlightCard>
  );
}
