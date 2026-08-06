import PageHero from '@/components/ui/PageHero';
import Section from '@/components/ui/Section';
import CareerContent from '@/components/sections/CareerContent';
import { jobs } from '@/data/portfolio';

// Metadata is generated at build time, so it reflects the content committed in
// site.json. The page body itself refreshes from the API on load.
export const metadata = {
  title: 'Careers',
  description: jobs.length
    ? `Open positions at Invest Care Limited — ${jobs.map((job) => job.title).join(', ')}.`
    : 'Career opportunities at Invest Care Limited. There are no open positions at this time — check back for future openings.',
};

export default function CareerPage() {
  return (
    <>
      <PageHero
        eyebrow="Work With Us"
        title="Careers"
        lead="We build long-term value with a small, deliberate team. When a role opens, it will be listed here."
        breadcrumb={['Careers']}
      />

      <Section tone="light">
        <CareerContent />
      </Section>
    </>
  );
}
