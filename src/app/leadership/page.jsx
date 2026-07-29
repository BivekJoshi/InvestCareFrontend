import PageHero from '@/components/ui/PageHero';
import Section from '@/components/ui/Section';
import BoardDirectory from '@/components/sections/BoardDirectory';
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
        <BoardDirectory members={board} />
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
