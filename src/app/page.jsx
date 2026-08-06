import Hero from '@/components/sections/hero';
import TickerBand from '@/components/sections/TickerBand';
import BentoOverview from '@/components/sections/BentoOverview';
import StatsBand from '@/components/sections/StatsBand';
import CapitalJourney from '@/components/sections/CapitalJourney';
import SectorAllocation from '@/components/sections/SectorAllocation';
import PortfolioShowcase from '@/components/sections/PortfolioShowcase';
import GlobalStrip from '@/components/sections/GlobalStrip';
import LeadershipStrip from '@/components/sections/LeadershipStrip';
import WhyInvest from '@/components/sections/WhyInvest';
import QuoteParallax from '@/components/sections/QuoteParallax';
import CallToAction from '@/components/sections/CallToAction';

export const metadata = {
  title: 'Invest Care Limited — Your Capital. Our Commitment.',
  description:
    'A Nepali investment holding company with six active portfolio companies across hospitality, manufacturing, agro-processing and hydropower — now raising promoter capital ahead of a planned IPO.',
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <TickerBand />
      <BentoOverview />
      <StatsBand />
      <CapitalJourney />
      <SectorAllocation tone="light" />
      <PortfolioShowcase />
      {/* <GlobalStrip /> */}
      <LeadershipStrip />
      <WhyInvest />
      <QuoteParallax />
      <CallToAction />
    </>
  );
}
