import { Mail, MapPin, Phone } from 'lucide-react';

import PageHero from '@/components/ui/PageHero';
import Section from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import MediaFrame from '@/components/ui/MediaFrame';
import ContactForm from '@/components/sections/ContactForm';
import { company, contact } from '@/data/company';
import { slideInLeft, slideInRight } from '@/lib/motion';

export const metadata = {
  title: 'Contact Us',
  description:
    'Reach Invest Care Limited at Fourth Floor, Krishna Tower, New Baneshwor-10, Kathmandu — or contact a director directly.',
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get In Touch"
        title="Contact Us"
        lead="We'd love to hear from you. Whether you're evaluating the promoter round or exploring a partnership, a director will respond personally."
        breadcrumb={['Contact']}
      />

      <Section tone="light">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal variants={slideInLeft} className="space-y-6">
            <InfoCard icon={MapPin} label="Registered Office">
              <p className="text-sm leading-relaxed text-forest-800/75">{contact.office}</p>
            </InfoCard>

            <InfoCard icon={Mail} label="Email">
              <a
                href={`mailto:${contact.email}`}
                className="break-all text-sm font-semibold text-forest-700 underline underline-offset-4 hover:text-forest-900"
              >
                {contact.email}
              </a>
            </InfoCard>

            <InfoCard icon={Phone} label="Phone">
              <ul className="grid gap-3 sm:grid-cols-2">
                {contact.phones.map((person) => (
                  <li key={person.number}>
                    <a
                      href={`tel:+977${person.number}`}
                      className="block text-sm font-semibold text-forest-800 hover:text-forest-600"
                    >
                      {person.number}
                    </a>
                    <span className="text-xs text-forest-600">{person.name}</span>
                  </li>
                ))}
              </ul>
            </InfoCard>

            <div className="rounded-2xl bg-forest-900 p-8 text-cream shadow-lift">
              <p className="script text-2xl text-gold-400">“{company.tagline}”</p>
              <p className="mt-4 text-sm leading-relaxed text-forest-100/70">
                Invest Care Limited · Reg. No. 175982/074/075 · PAN 606875855
              </p>
            </div>
          </Reveal>

          <Reveal variants={slideInRight}>
            <ContactForm />
          </Reveal>
        </div>
      </Section>

      <Section tone="white" className="pt-0">
        <Reveal>
          <MediaFrame
            /* set to "/images/company/office-map.jpg", or swap this frame for an embedded map */
            src={null}
            alt="Map to Krishna Tower, New Baneshwor-10, Kathmandu"
            hint="/images/company/office-map.jpg — wide, 2400×1000"
            ratio="wide"
            sizes="100vw"
          />
        </Reveal>
      </Section>
    </>
  );
}

function InfoCard({ icon: Icon, label, children }) {
  return (
    <div className="flex gap-5 rounded-2xl border border-forest-100 bg-white p-7 shadow-card">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest-800 text-cream">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-forest-600">
          {label}
        </h2>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}
