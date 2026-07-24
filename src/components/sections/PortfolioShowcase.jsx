'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

import MediaFrame from '@/components/ui/MediaFrame';
import Aurora from '@/components/ui/Aurora';
import { getIcon } from '@/components/ui/icon-map';
import { portfolio, portfolioStats } from '@/data/portfolio';
import { EASE, viewportOnce } from '@/lib/motion';

/**
 * Portfolio showcase.
 *
 * On large screens the section pins and the cards travel horizontally as the
 * page scrolls; below `lg` it degrades to a native scroll-snap carousel, which
 * is both lighter and the interaction touch users expect.
 */
export default function PortfolioShowcase() {
  const ref = useRef(null);
  const trackRef = useRef(null);
  const [travel, setTravel] = useState(0);

  // The sticky panel is one viewport tall, so `end end` lands exactly on the
  // moment it releases — progress 0→1 maps cleanly onto the pinned range.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  // Measure the real overflow rather than guessing a percentage: card widths
  // change at the `xl` breakpoint, so a fixed value would over- or undershoot.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      const overflow = track.scrollWidth - window.innerWidth;
      setTravel(Math.max(0, overflow + 48)); // +48px so the last card clears the gutter
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener('resize', measure);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const x = useTransform(scrollYProgress, [0, 1], [0, -travel]);
  const progress = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <>
      {/* Desktop: pinned horizontal scroll */}
      <section ref={ref} className="relative hidden h-[420vh] bg-forest-950 lg:block">
        <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
          <Aurora intensity="soft" />
          <div className="pointer-events-none absolute inset-0 grain opacity-[0.05]" aria-hidden="true" />

          <div className="container relative flex shrink-0 items-end justify-between pb-8 pt-28">
            <div>
              <span className="eyebrow-invert">Portfolio Snapshot</span>
              <h2 className="mt-5 font-display text-4xl font-bold text-white xl:text-5xl">
                Five holdings, four sectors.
              </h2>
            </div>

            <div className="flex items-end gap-10">
              {portfolioStats.map((stat) => (
                <div key={stat.label} className="text-right">
                  <p className="font-display text-3xl font-bold text-gold-400">{stat.value}</p>
                  <p className="mt-1 max-w-[9rem] text-[11px] leading-tight text-forest-200/60">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex flex-1 items-center">
            <motion.ul
              ref={trackRef}
              style={{ x }}
              className="flex w-max gap-7 pl-[max(2rem,calc((100vw-1280px)/2))]"
            >
              {portfolio.map((item, i) => (
                <li key={item.slug} className="w-[26rem] shrink-0 xl:w-[29rem]">
                  <ShowcaseCard item={item} index={i} />
                </li>
              ))}

              <li className="flex w-[24rem] shrink-0 items-center">
                <ClosingPanel />
              </li>
            </motion.ul>
          </div>

          {/* Horizontal progress rail */}
          <div className="container relative shrink-0 pb-10 pt-8">
            <div className="h-px w-full bg-white/10">
              <motion.div style={{ width: progress }} className="h-full bg-gold-500" />
            </div>
            <p className="mt-4 text-[10px] uppercase tracking-[0.28em] text-forest-200/50">
              Scroll to explore the portfolio
            </p>
          </div>
        </div>
      </section>

      {/* Mobile / tablet: scroll-snap carousel */}
      <section className="relative overflow-hidden bg-forest-950 py-20 lg:hidden">
        <Aurora intensity="soft" />
        <div className="container relative">
          <span className="eyebrow-invert">Portfolio Snapshot</span>
          <h2 className="mt-5 font-display text-3xl font-bold text-white sm:text-4xl">
            Five holdings, four sectors.
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-forest-100/70">
            Invest Care holds and is building positions across hospitality, manufacturing,
            agro-processing and hydropower.
          </p>
        </div>

        <ul className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {portfolio.map((item, i) => (
            <li key={item.slug} className="w-[19rem] shrink-0 snap-center sm:w-[22rem]">
              <ShowcaseCard item={item} index={i} />
            </li>
          ))}
          <li className="w-[19rem] shrink-0 snap-center sm:w-[22rem]">
            <ClosingPanel />
          </li>
        </ul>

        <div className="container mt-6 flex gap-6">
          {portfolioStats.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-2xl font-bold text-gold-400">{stat.value}</p>
              <p className="mt-1 text-[10px] leading-tight text-forest-200/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function ShowcaseCard({ item, index }) {
  const Icon = getIcon(item.icon);

  return (
    <motion.article
      className="group ring-gradient h-full overflow-hidden rounded-3xl bg-forest-900/60 backdrop-blur-md"
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.7, delay: (index % 3) * 0.08, ease: EASE }}
    >
      <div className="relative">
        <MediaFrame
          src={item.image}
          alt={item.name}
          hint={item.imageHint}
          ratio="landscape"
          tone="dark"
          className="rounded-none"
          imageClassName="group-hover:scale-[1.06]"
          sizes="(max-width: 1024px) 80vw, 29rem"
        />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-forest-950/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-400 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-gold-500 animate-pulse-soft" />
          {item.status}
        </span>
      </div>

      <div className="p-7">
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-gold-400">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3 className="font-display text-lg font-semibold leading-snug text-white">
              {item.name}
            </h3>
            <p className="mt-1 text-xs italic text-forest-200/60">{item.brand}</p>
          </div>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-forest-100/70">{item.summary}</p>

        <ul className="mt-6 space-y-2 border-t border-white/10 pt-5">
          {item.metrics.slice(0, 3).map((metric) => (
            <li key={metric} className="flex gap-2.5 text-xs leading-relaxed text-forest-200/65">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold-500" aria-hidden="true" />
              {metric}
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}

function ClosingPanel() {
  return (
    <div className="w-full rounded-3xl border border-gold-600/30 bg-gold-500/[0.07] p-9 backdrop-blur-md">
      <p className="font-display text-2xl font-semibold leading-snug text-white">
        The next holding is already in the pipeline.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-forest-100/70">
        Promoter capital raised today funds the live portfolio and a well-advanced acquisition
        pipeline.
      </p>
      <Link
        href="/portfolio"
        className="group mt-8 inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-forest-950 transition-transform duration-300 hover:-translate-y-0.5"
      >
        See full portfolio
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </div>
  );
}
