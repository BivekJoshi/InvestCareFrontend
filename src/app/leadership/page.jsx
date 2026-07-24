import PageHero from '@/components/ui/PageHero';
import Section from '@/components/ui/Section';
import MediaFrame from '@/components/ui/MediaFrame';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import InvestorCommitment from '@/components/sections/InvestorCommitment';
import CallToAction from '@/components/sections/CallToAction';
import { board } from '@/data/board';

export const metadata = {
  title: 'Board of Directors',
  description:
    "Invest Care Limited's Board of Directors combines decades of leadership experience across pharmaceuticals, engineering, hospitality, hydropower, audit and capital markets.",
};

export default function LeadershipPage() {
  return (
    <>
      <PageHero
        eyebrow="Leadership & Governance"
        title="Board of Directors"
        lead="Our Board of Directors combines decades of leadership experience to guide Invest Care's strategic vision and uphold strong corporate governance."
        breadcrumb={['Leadership']}
      />

      <Section tone="light">
        <RevealGroup className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3" staggerChildren={0.08}>
          {board.map((member) => (
            <RevealItem key={member.slug} className="h-full">
              <DirectorCard member={member} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <InvestorCommitment tone="white" />
      <CallToAction
        title="Talk directly to the board."
        body="Invest Care's directors are personally available to prospective promoter investors. Reach out and we will arrange a meeting."
        primary={{ href: '/contact', label: 'Arrange a Meeting' }}
        secondary={{ href: '/invest', label: 'The Opportunity' }}
      />
    </>
  );
}

function DirectorCard({ member }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-forest-100 bg-white shadow-card transition duration-300 hover:-translate-y-1.5 hover:shadow-lift">
      <MediaFrame
        src={member.image}
        alt={member.name}
        hint="/images/board/[slug].jpg — 800×1000, plain background"
        ratio="portrait"
        className="rounded-none"
        imageClassName="group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />

      <div className="flex flex-1 flex-col p-7">
        <h2 className="font-display text-lg font-semibold leading-snug text-forest-900">
          {member.name}
        </h2>
        <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-600">
          {member.role}
        </p>
        <p className="mt-4 text-xs font-semibold text-forest-700">{member.credentials}</p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-forest-800/70">{member.bio}</p>
      </div>
    </article>
  );
}
