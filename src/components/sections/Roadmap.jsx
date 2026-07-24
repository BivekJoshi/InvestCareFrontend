'use client';

import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';

import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import { roadmap } from '@/data/company';
import { EASE } from '@/lib/motion';

/**
 * Path-to-listing timeline. The connecting line draws itself as the section
 * scrolls through the viewport; milestones alternate above/below on desktop
 * and stack into a single left-aligned rail on mobile.
 */
export default function Roadmap({ tone = 'tint' }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.4'],
  });
  const lineScale = useSpring(scrollYProgress, { stiffness: 90, damping: 28 });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <Section id="roadmap" tone={tone}>
      <SectionHeading
        eyebrow="Path to Listing"
        title="Strategic Roadmap"
        lead="Invest Care's path to listing is clearly sequenced to satisfy SEBON requirements and strengthen investor readiness."
      />

      <div ref={ref} className="mt-16">
        {/* Desktop: horizontal rail */}
        <div className="relative hidden lg:block">
          <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-forest-200" />
          <motion.div
            className="absolute left-0 top-1/2 h-px origin-left -translate-y-1/2 bg-forest-600"
            style={{ scaleX: lineScale, width: '100%' }}
          />

          <ol className="relative grid grid-cols-6">
            {roadmap.map((step, i) => (
              <Milestone key={step.title + step.date} step={step} index={i} above={i % 2 === 0} />
            ))}
          </ol>
        </div>

        {/* Mobile / tablet: vertical rail */}
        <div className="relative lg:hidden">
          <div className="absolute bottom-0 left-[15px] top-2 w-px bg-forest-200" />
          <motion.div
            className="absolute left-[15px] top-2 w-px bg-forest-600"
            style={{ height: lineHeight }}
          />

          <ol className="space-y-9">
            {roadmap.map((step, i) => (
              <motion.li
                key={step.title + step.date}
                className="relative pl-12"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: EASE }}
              >
                <span className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-forest-800 text-[11px] font-bold text-cream">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-600">
                  {step.date}
                </p>
                <h3 className="mt-2 font-display text-lg font-semibold text-forest-900">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-forest-800/70">{step.detail}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}

function Milestone({ step, index, above }) {
  return (
    <motion.li
      className="relative flex min-h-[22rem] flex-col items-center justify-center px-3"
      initial={{ opacity: 0, y: above ? -20 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: EASE }}
    >
      <div
        className={`absolute w-full px-2 text-center ${above ? 'bottom-1/2 mb-10' : 'top-1/2 mt-10'}`}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-600">
          {step.date}
        </p>
        <h3 className="mt-2 font-display text-base font-semibold leading-snug text-forest-900">
          {step.title}
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-forest-800/65">{step.detail}</p>
      </div>

      <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 border-forest-50 bg-forest-800 text-[11px] font-bold text-cream shadow-card">
        {String(index + 1).padStart(2, '0')}
      </span>
    </motion.li>
  );
}
