import { BriefcaseBusiness, Mail } from 'lucide-react';

import PageHero from '@/components/ui/PageHero';
import Section from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';
import { contact } from '@/data/company';

export const metadata = {
  title: 'Careers',
  description:
    'Career opportunities at Invest Care Limited. There are no open positions at this time — check back for future openings.',
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
        <Reveal className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-forest-100 bg-white p-10 text-center shadow-card md:p-14">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-forest-800 text-cream">
              <BriefcaseBusiness className="h-5 w-5" aria-hidden="true" />
            </span>

            <h2 className="mt-8 text-2xl font-bold text-forest-900 md:text-3xl">
              Currently No Openings
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-forest-800/75 md:text-base">
              We do not have any vacancies at the moment. New positions will be posted on this page
              as they become available.
            </p>

            <div className="mt-9 border-t border-forest-100 pt-8">
              <p className="text-sm leading-relaxed text-forest-800/75">
                If you would still like to be considered for future roles, send your CV to{' '}
                <a
                  href={`mailto:${contact.email}`}
                  className="break-all font-semibold text-forest-700 underline underline-offset-4 hover:text-forest-900"
                >
                  {contact.email}
                </a>
                .
              </p>

              <Button
                href={`mailto:${contact.email}?subject=Career%20Enquiry`}
                variant="primary"
                className="group mt-7"
                withArrow
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                Send Your CV
              </Button>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
