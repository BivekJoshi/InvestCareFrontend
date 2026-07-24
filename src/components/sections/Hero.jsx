'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight, ShieldCheck } from 'lucide-react';

import Button from '@/components/ui/Button';
import Magnetic from '@/components/ui/Magnetic';
import Aurora from '@/components/ui/Aurora';
import Counter from '@/components/ui/Counter';
import HeroScene from '@/components/three/LazyHeroScene';
import { getIcon } from '@/components/ui/icon-map';
import { portfolio } from '@/data/portfolio';
import { EASE } from '@/lib/motion';

const HEADLINE = [
  { text: 'Patient capital,', accent: false },
  { text: 'compounding across', accent: false },
  { text: 'Nepal.', accent: true },
];

const HIGHLIGHTS = [
  { value: 5, suffix: '', label: 'Portfolio companies', pad: true },
  { value: 6, suffix: '', label: 'High-conviction sectors', pad: true },
  { value: 38.16, decimals: 2, prefix: 'NPR ', suffix: ' Cr', label: 'Target promoter capital' },
];

// The three cards that float over the WebGL scene on large screens.
const FLOATING = portfolio.slice(0, 3);

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  // Content drifts up and dissolves as the next section arrives.
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-forest-950 pt-28 text-cream md:pt-32"
    >
      <Aurora />
      <div className="absolute inset-0 bg-grid-forest bg-[size:64px_64px] opacity-25" aria-hidden="true" />

      <motion.div style={{ scale: sceneScale }} className="absolute inset-0">
        <HeroScene className="pointer-events-none absolute inset-0 opacity-90" />
      </motion.div>

      <div
        className="absolute inset-0 bg-gradient-to-r from-forest-950 via-forest-950/80 to-transparent"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 grain opacity-[0.05]" aria-hidden="true" />
      <div
        className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-forest-950 to-transparent"
        aria-hidden="true"
      />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="container relative grid gap-12 pb-20 pt-6 lg:grid-cols-[1.32fr_0.88fr] lg:items-center xl:gap-16"
      >
        <div>
          <motion.div
            className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.06] py-1.5 pl-2 pr-5 backdrop-blur-sm"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          >
            <span className="relative flex h-6 w-6 items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-gold-500/25 animate-pulse-soft" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-gold-400" />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-forest-100">
              Promoter round open · Kathmandu, Nepal
            </span>
          </motion.div>

          <h1 className="mt-8 max-w-4xl font-display text-[2.6rem] font-bold leading-[1.02] text-white sm:text-6xl lg:text-[3.7rem] xl:text-[4.25rem]">
            {HEADLINE.map((line, i) => (
              <span key={line.text} className="block overflow-hidden pb-1">
                <motion.span
                  className={line.accent ? 'block text-gradient-gold' : 'block'}
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.95, delay: 0.2 + i * 0.12, ease: EASE }}
                >
                  {line.text}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="mt-7 max-w-xl text-base leading-relaxed text-forest-100/75 md:text-lg"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.62, ease: EASE }}
          >
            Invest Care Limited backs promising Nepali enterprises with institutional capital and
            hands-on ownership — across hospitality, manufacturing, agro-processing, pharma, IT and
            hydropower.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.72, ease: EASE }}
          >
            <Magnetic>
              <Button href="/invest" variant="gold" withArrow>
                The Investment Opportunity
              </Button>
            </Magnetic>
            <Magnetic strength={0.2}>
              <Button href="/portfolio" variant="ghostLight">
                Explore Our Portfolio
              </Button>
            </Magnetic>

            <span className="hidden items-center gap-2 text-xs text-forest-200/60 sm:flex">
              <ShieldCheck className="h-4 w-4 text-gold-500" aria-hidden="true" />
              SEBON-compliant roadmap
            </span>
          </motion.div>

          <motion.dl
            className="mt-14 grid max-w-2xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.86, ease: EASE }}
          >
            {HIGHLIGHTS.map((item) => (
              <div
                key={item.label}
                className="flex flex-col justify-between bg-forest-950/70 px-6 py-5 backdrop-blur-sm"
              >
                <dt className="text-[11px] uppercase leading-tight tracking-[0.16em] text-forest-200/60">
                  {item.label}
                </dt>
                <dd className="mt-3 font-display text-2xl font-semibold text-gold-400">
                  {item.pad ? (
                    <Counter to={item.value} prefix="0" />
                  ) : (
                    <Counter
                      to={item.value}
                      decimals={item.decimals ?? 0}
                      prefix={item.prefix ?? ''}
                      suffix={item.suffix ?? ''}
                    />
                  )}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Floating holding cards — decorative depth layer, desktop only. */}
        <div className="relative hidden h-[30rem] lg:block" aria-hidden="true">
          {FLOATING.map((item, i) => {
            const Icon = getIcon(item.icon);
            const offsets = [
              'right-6 top-2 w-[19rem]',
              'left-0 top-40 w-[17rem]',
              'right-16 bottom-4 w-[18rem]',
            ];

            return (
              <motion.div
                key={item.slug}
                className={`absolute ${offsets[i]}`}
                initial={{ opacity: 0, y: 30, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.9 + i * 0.16, ease: EASE }}
              >
                <div
                  className="ring-gradient animate-float rounded-2xl bg-forest-900/55 p-5 backdrop-blur-md"
                  style={{ animationDelay: `${i * 1.4}s` }}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-gold-400">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {item.name.replace(/ (Pvt\.|Ltd\.|Limited).*$/, '')}
                      </p>
                      <p className="mt-0.5 text-[11px] text-forest-200/60">{item.sector}</p>
                    </div>
                    <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-forest-200/40" />
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-pulse-soft" />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-400">
                      Active holding
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <motion.a
        href="#ticker"
        className="absolute bottom-10 right-8 hidden flex-col items-center gap-2 text-[10px]
                   uppercase tracking-[0.28em] text-forest-200/60 transition-colors
                   hover:text-white lg:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.6 }}
      >
        Scroll
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown className="h-4 w-4" aria-hidden="true" />
        </motion.span>
      </motion.a>
    </section>
  );
}
