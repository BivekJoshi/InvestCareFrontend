import Link from 'next/link';
import { ArrowUpRight, Briefcase, Building2, TrendingUp, Users } from 'lucide-react';

import Button from '@/components/ui/Button';

export const metadata = {
  title: 'Page Not Found',
  description:
    'The page you requested could not be found. Return to the Invest Care Limited homepage or jump to the investment opportunity.',
  // No `robots` override here — Next.js already emits `noindex` for this route,
  // and declaring it again just duplicates the meta tag.
};

/**
 * Recovery links. Deliberately curated rather than mapped from `navLinks` —
 * someone who has hit a dead end needs the four destinations that matter, each
 * with a reason to click, not the full navigation repeated.
 */
const destinations = [
  {
    href: '/invest',
    label: 'The Opportunity',
    description: 'Capital structure and the path to listing',
    Icon: TrendingUp,
  },
  {
    href: '/portfolio',
    label: 'Portfolio',
    description: 'Holdings across six sectors',
    Icon: Building2,
  },
  {
    href: '/leadership',
    label: 'Leadership',
    description: 'The board and company secretary',
    Icon: Users,
  },
  {
    href: '/career',
    label: 'Careers',
    description: 'Open roles and how we hire',
    Icon: Briefcase,
  },
];

export default function NotFound() {
  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-forest-950 py-28 text-cream">
      <div
        className="absolute inset-0 bg-grid-forest bg-[size:64px_64px] opacity-30"
        aria-hidden="true"
      />
      <div
        className="absolute -left-24 top-0 h-[28rem] w-[28rem] rounded-full bg-forest-700/30 blur-[130px]"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 right-0 h-[26rem] w-[26rem] rounded-full bg-gold-700/20 blur-[130px]"
        aria-hidden="true"
      />

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow-invert animate-fade-up">Off the map</span>

          {/*
            The numerals are decoration — the <h1> below carries the real
            message, so screen readers are not handed a bare "404".
          */}
          <p
            className="mt-8 animate-fade-up font-display text-[6rem] font-bold leading-none
                       tracking-tight text-gold-500 sm:text-[9rem]"
            aria-hidden="true"
          >
            404
          </p>

          <h1 className="mt-4 animate-fade-up text-balance text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            This page isn&rsquo;t in our portfolio.
          </h1>

          <p className="mx-auto mt-6 max-w-xl animate-fade-in-delayed text-sm leading-relaxed text-forest-100/70 sm:text-base">
            The address may have changed, or the page may never have existed. Everything below is
            still exactly where you left it.
          </p>

          <div className="mt-10 flex animate-fade-in-delayed flex-wrap justify-center gap-4">
            <Button href="/" variant="gold" withArrow>
              Back to Home
            </Button>
            <Button href="/contact" variant="ghostLight">
              Contact Us
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-4xl animate-fade-in-delayed">
          <div className="flex items-center gap-4">
            <span className="text-xs uppercase tracking-label text-forest-100/50">
              Or jump straight to
            </span>
            <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
          </div>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {destinations.map(({ href, label, description, Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5
                             backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5
                             hover:border-gold-500/40 hover:bg-white/10"
                >
                  <span className="rounded-xl border border-white/10 bg-forest-900/60 p-2.5 text-gold-400">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>

                  <span className="flex-1">
                    <span className="flex items-center gap-1.5 font-semibold text-white">
                      {label}
                      <ArrowUpRight
                        className="h-4 w-4 text-gold-400 opacity-0 transition-all duration-300
                                   group-hover:translate-x-0.5 group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-forest-100/60">
                      {description}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
