import { Compass, Eye, FileCheck2, ShieldCheck } from 'lucide-react';

import PageHero from '@/components/ui/PageHero';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import MediaFrame from '@/components/ui/MediaFrame';
import Reveal, { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import InvestorCommitment from '@/components/sections/InvestorCommitment';
import CallToAction from '@/components/sections/CallToAction';
import { company, incorporation } from '@/data/company';
import { slideInLeft, slideInRight } from '@/lib/motion';

export const metadata = {
  title: 'About Us',
  description:
    'Invest Care Limited is an investment holding company incorporated under the Companies Act of Nepal, built on disciplined capital stewardship and long-term value creation.',
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Company Overview"
        title="Who We Are"
        lead={company.intro}
        breadcrumb={['About']}
      />

      <Section tone="light">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal variants={slideInLeft}>
            <MediaFrame
              /* set to "/images/company/office-interior.jpg" once the asset exists */
              src={"/images/brand/investcare-vertical-white-on-green.jpg"}
              alt="Invest Care Limited registered office, New Baneshwor"
              hint="/images/company/office-interior.jpg — landscape, 1600×1200"
              ratio="landscape"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </Reveal>

          <Reveal variants={slideInRight}>
            <span className="eyebrow">Our Approach</span>
            <h2 className="mt-5 text-3xl font-bold leading-[1.1] text-balance sm:text-4xl">
              Active ownership, not passive allocation.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-forest-800/75">
              {company.introSecondary}
            </p>
            <p className="mt-4 text-base leading-relaxed text-forest-800/75">
              We combine institutional capital with strategic insight to back promising enterprises,
              unlock hidden potential, and drive growth through focused, responsible engagement —
              working alongside management teams rather than observing from a distance.
            </p>

            <ul className="mt-8 space-y-4">
              {company.values.map((value) => (
                <li key={value.title} className="flex gap-4">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest-800 text-cream">
                    <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-forest-900">{value.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-forest-800/65">{value.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <Section tone="white">
        <RevealGroup className="grid gap-6 md:grid-cols-2" staggerChildren={0.12}>
          <RevealItem className="h-full">
            <div className="h-full rounded-2xl border border-forest-100 bg-forest-50 p-8 md:p-10">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-forest-800 text-cream">
                <Compass className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="mt-6 font-display text-2xl font-semibold text-forest-900">
                Our Mission
              </h2>
              <p className="mt-4 text-base leading-relaxed text-forest-800/75">{company.mission}</p>
            </div>
          </RevealItem>

          <RevealItem className="h-full">
            <div className="h-full rounded-2xl bg-forest-900 p-8 text-cream shadow-lift md:p-10">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-500 text-forest-950">
                <Eye className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="mt-6 font-display text-2xl font-semibold text-white">Our Vision</h2>
              <p className="mt-4 text-base leading-relaxed text-forest-100/75">{company.vision}</p>
            </div>
          </RevealItem>
        </RevealGroup>
      </Section>

      <Section id="incorporation" tone="tint">
        <SectionHeading
          eyebrow="Legal Standing"
          title="Incorporation Details"
          lead={incorporation.summary}
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <Reveal>
            <dl className="divide-y divide-forest-100 overflow-hidden rounded-2xl border border-forest-100 bg-white">
              {incorporation.details.map((row) => (
                <div
                  key={row.label}
                  className="flex flex-col gap-1 px-6 py-5 sm:flex-row sm:items-center sm:gap-8 sm:px-8"
                >
                  <dt className="flex items-center gap-3 text-sm font-semibold text-forest-700 sm:w-56 sm:shrink-0">
                    <span className="h-2 w-2 rounded-full bg-gold-500" aria-hidden="true" />
                    {row.label}
                  </dt>
                  <dd className="text-sm text-forest-800/80">{row.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal variants={slideInRight}>
            <div className="h-full rounded-2xl bg-forest-900 p-8 text-cream shadow-lift">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-forest-700 text-gold-400">
                <FileCheck2 className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-6 font-display text-xl font-semibold text-white">
                Governance Pillars
              </h3>
              <ul className="mt-6 space-y-5">
                {incorporation.governancePillars.map((pillar) => (
                  <li key={pillar} className="flex gap-3">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400"
                      aria-hidden="true"
                    />
                    <span className="text-sm leading-relaxed text-forest-100/75">{pillar}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      <InvestorCommitment tone="white" />
      <CallToAction
        title="Want the full business profile?"
        body="Request the complete Invest Care Limited profile deck, incorporation documents and portfolio financials."
        primary={{ href: '/contact', label: 'Request Documents' }}
        secondary={{ href: '/portfolio', label: 'See the Portfolio' }}
      />
    </>
  );
}
