import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';

import Logo from './Logo';
import { footerLinks } from '@/data/navigation';
import { company, contact } from '@/data/company';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-forest-950 text-forest-100">
      <div className="absolute inset-0 bg-grid-forest bg-[size:64px_64px] opacity-30" aria-hidden="true" />
      <div
        className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-forest-700/25 blur-[120px]"
        aria-hidden="true"
      />

      <div className="container relative py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Logo invert />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-forest-200/75">
              {company.intro.split('.')[0]}.
            </p>
            <p className="script mt-6 text-2xl text-gold-400">
              “{company.tagline}”
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {footerLinks.map((group) => (
              <div key={group.heading}>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-400">
                  {group.heading}
                </h3>
                <ul className="mt-5 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="link-underline text-sm text-forest-200/75 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-8 border-t border-white/10 pt-10 sm:grid-cols-3">
          <ContactBlock icon={MapPin} label="Registered Office">
            <p className="text-sm leading-relaxed text-forest-200/75">{contact.office}</p>
          </ContactBlock>

          <ContactBlock icon={Mail} label="Email">
            <a
              href={`mailto:${contact.email}`}
              className="link-underline break-all text-sm text-forest-200/75 hover:text-white"
            >
              {contact.email}
            </a>
          </ContactBlock>

          <ContactBlock icon={Phone} label="Phone">
            <ul className="space-y-1.5">
              {contact.phones.slice(0, 2).map((p) => (
                <li key={p.number}>
                  <a
                    href={`tel:+977${p.number}`}
                    className="link-underline text-sm text-forest-200/75 hover:text-white"
                  >
                    {p.number} <span className="text-forest-300/60">({p.name})</span>
                  </a>
                </li>
              ))}
            </ul>
          </ContactBlock>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-forest-300/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {company.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/disclaimer" className="transition-colors hover:text-white">
              Disclaimer
            </Link>
            <span>Reg. No. 175982/074/075</span>
            <span>PAN 606875855</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ContactBlock({ icon: Icon, label, children }) {
  return (
    <div className="flex gap-4">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-gold-400">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div>
        <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white">{label}</h4>
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
}
