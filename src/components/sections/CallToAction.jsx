'use client';

import { useSiteContent } from '@/components/SiteContentProvider';
import { Mail, Phone } from 'lucide-react';

import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { telHref } from '@/lib/tel';

export default function CallToAction({
  title = 'Ready to put your capital to work?',
  body = 'The promoter round is open ahead of a planned public offering. Talk to the board about allocation, timelines and documentation.',
  primary = { href: '/contact', label: 'Speak With Us' },
  secondary = { href: '/invest', label: 'Review the Opportunity' },
}) {
  const { content } = useSiteContent();
  const { company, contact } = content;
  return (
    <section className="relative overflow-hidden bg-forest-900 py-20 text-cream md:py-24">
      <div className="absolute inset-0 bg-grid-forest bg-[size:56px_56px] opacity-25" aria-hidden="true" />
      <div
        className="absolute left-1/2 top-full h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-600/20 blur-[120px]"
        aria-hidden="true"
      />

      <Reveal className="container relative flex flex-col items-center text-center">
        <p className="script text-2xl text-gold-400 sm:text-3xl">
          {company.tagline}
        </p>
        <h2 className="mt-6 max-w-2xl text-3xl font-bold leading-tight text-balance text-white sm:text-4xl md:text-5xl">
          {title}
        </h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-forest-100/75">{body}</p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button href={primary.href} variant="gold" withArrow>
            {primary.label}
          </Button>
          <Button href={secondary.href} variant="ghostLight">
            {secondary.label}
          </Button>
        </div>

        {/*
          The direct line, for a visitor who would rather call than fill in a
          form. Each entry is dropped when the CMS has no value for it, so this
          row never renders a dangling icon.
        */}
        {contact.phone || contact.email ? (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-white/10 pt-8 text-sm">
            {contact.phone ? (
              <a
                href={`tel:${telHref(contact.phone)}`}
                className="group flex items-center gap-2.5 text-forest-100/75 transition-colors hover:text-white"
              >
                <Phone className="h-4 w-4 text-gold-400" aria-hidden="true" />
                <span className="font-semibold">{contact.phone}</span>
              </a>
            ) : null}

            {contact.email ? (
              <a
                href={`mailto:${contact.email}`}
                className="group flex items-center gap-2.5 text-forest-100/75 transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4 text-gold-400" aria-hidden="true" />
                <span className="font-semibold">{contact.email}</span>
              </a>
            ) : null}
          </div>
        ) : null}
      </Reveal>
    </section>
  );
}
