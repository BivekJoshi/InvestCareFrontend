'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { EASE } from '@/lib/motion';
import { surface } from '@/theme';

/**
 * Shared masthead for every inner page: breadcrumb, eyebrow, title and lead.
 */
export default function PageHero({ eyebrow, title, lead, breadcrumb = [] }) {
  const palette = surface('deep');

  return (
    <section className="relative overflow-hidden bg-forest-950 pb-20 pt-36 text-cream md:pb-28 md:pt-44">
      <div className="absolute inset-0 bg-grid-forest bg-[size:64px_64px] opacity-30" aria-hidden="true" />
      <div
        className="absolute -left-24 top-0 h-[28rem] w-[28rem] rounded-full bg-forest-700/30 blur-[130px]"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 right-0 h-[26rem] w-[26rem] rounded-full bg-gold-700/20 blur-[130px]"
        aria-hidden="true"
      />

      <div className="container relative">
        <motion.nav
          aria-label="Breadcrumb"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className={`flex flex-wrap items-center gap-1.5 text-xs ${palette.muted}`}
        >
          <Link href="/" className="transition-colors hover:text-white">
            Home
          </Link>
          {breadcrumb.map((crumb) => (
            <span key={crumb} className="flex items-center gap-1.5">
              <ChevronRight className="h-3 w-3" aria-hidden="true" />
              <span className="text-forest-100">{crumb}</span>
            </span>
          ))}
        </motion.nav>

        {eyebrow ? (
          <motion.span
            className="eyebrow-invert mt-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
          >
            {eyebrow}
          </motion.span>
        ) : null}

        <motion.h1
          className={`mt-6 max-w-4xl text-balance text-4xl font-bold leading-[1.05] sm:text-5xl md:text-6xl ${palette.heading}`}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.14, ease: EASE }}
        >
          {title}
        </motion.h1>

        {lead ? (
          <motion.p
            className={`mt-6 max-w-2xl text-base leading-relaxed md:text-lg ${palette.body}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
          >
            {lead}
          </motion.p>
        ) : null}
      </div>
    </section>
  );
}
