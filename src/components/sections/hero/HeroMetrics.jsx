'use client';

import { motion } from 'framer-motion';

import Counter from '@/components/ui/Counter';
import { motion as motionTokens } from '@/theme';
import { heroMetrics } from './hero.content';

/**
 * Full-width band closing the fold. Numeric entries count up on arrival;
 * everything else (dates, formatted currency) renders as written.
 */
export default function HeroMetrics() {
  return (
    <motion.div
      className="relative z-10 border-t border-white/10 bg-forest-950/50 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: motionTokens.duration.slow, delay: 1.05, ease: motionTokens.ease }}
    >
      {/* `gap-px` over a tinted parent draws the hairlines — cleaner than
          `divide-x`, which strays onto the first cell of each wrapped row. */}
      <dl className="container grid grid-cols-2 gap-px bg-white/10 md:grid-cols-4">
        {heroMetrics.map((metric) => (
          <div
            key={metric.key}
            className="flex flex-col justify-end gap-1.5 bg-forest-950/80 px-5 py-6 transition-colors hover:bg-forest-900/70 md:px-6"
          >
            <dd className="font-display text-2xl font-semibold text-gold-400 md:text-3xl">
              {typeof metric.value === 'number' ? (
                <Counter
                  to={metric.value}
                  decimals={metric.decimals ?? 0}
                  prefix={metric.pad ? '0' : (metric.prefix ?? '')}
                  suffix={metric.suffix ?? ''}
                />
              ) : (
                metric.text
              )}
            </dd>
            <dt className="text-[11px] uppercase leading-tight tracking-label text-forest-200/60">
              {metric.label}
            </dt>
          </div>
        ))}
      </dl>
    </motion.div>
  );
}
