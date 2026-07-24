import PageHero from '@/components/ui/PageHero';
import TheAsk from '@/components/sections/TheAsk';
import CapitalStructure from '@/components/sections/CapitalStructure';
import Roadmap from '@/components/sections/Roadmap';
import { GlobalContext, NepalOpportunity } from '@/components/sections/MarketContext';
import WhyInvest from '@/components/sections/WhyInvest';
import CallToAction from '@/components/sections/CallToAction';

export const metadata = {
  title: 'The Investment Opportunity',
  description:
    'Invest Care Limited is raising NPR 28.16 Cr in additional promoter capital toward a target of NPR 38.16 Cr, ahead of an IPO application to SEBON by Magh 2083.',
};

export default function InvestPage() {
  return (
    <>
      <PageHero
        eyebrow="The Ask"
        title="Promoter capital, ahead of a planned public offering."
        lead="Invest Care is raising promoter capital to fund an already-active, diversified portfolio and a well-advanced acquisition pipeline — followed by a 25% IPO provision that opens the company to public shareholders."
        breadcrumb={['Invest']}
      />

      <TheAsk tone="light" />
      <CapitalStructure tone="white" />
      <Roadmap tone="tint" />
      <GlobalContext tone="white" />
      <NepalOpportunity tone="tint" />
      <WhyInvest tone="deep" />

      <CallToAction
        title="Join the promoter round."
        body="Allocation is open now. Speak with the board about ticket size, documentation and timelines under the Companies Act and SEBON regulations."
        primary={{ href: '/contact', label: 'Register Your Interest' }}
        secondary={{ href: '/disclaimer', label: 'Read the Disclaimer' }}
      />
    </>
  );
}
