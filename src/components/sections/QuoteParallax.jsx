'use client';

import { useSiteContent } from '@/components/SiteContentProvider';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Quote } from 'lucide-react';

import Aurora from '@/components/ui/Aurora';
import Marquee from '@/components/ui/Marquee';
import { EASE, viewportOnce } from '@/lib/motion';

/**
 * Board quote with a scroll-linked parallax backdrop. The sentence brightens
 * word by word as the section passes through the viewport.
 */
export default function QuoteParallax() {
  const { content } = useSiteContent();
  const investorQuote = content.investorQuote;

  // Derived per render — the quote can change when live content arrives.
  const WORDS = (investorQuote.text ?? '').split(' ');

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  const bgY = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);
  const markY = useTransform(scrollYProgress, [0, 1], ['30%', '-30%']);

  return (
    <section ref={ref} className="relative overflow-hidden bg-forest-900 py-24 text-cream md:py-32">
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <Aurora />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 grain opacity-[0.05]" aria-hidden="true" />

      <motion.div
        style={{ y: markY }}
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-[0.045]"
        aria-hidden="true"
      >
        <Marquee duration={70} fade={false}>
          <span className="whitespace-nowrap px-10 font-display text-[9rem] font-bold uppercase leading-none text-white">
            Your Capital · Our Commitment ·
          </span>
        </Marquee>
      </motion.div>

      <div className="container relative">
        <motion.span
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-500/15 text-gold-400"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <Quote className="h-6 w-6" aria-hidden="true" />
        </motion.span>

        <blockquote className="mt-10 max-w-4xl">
          <p className="sr-only">{investorQuote.text}</p>

          <motion.p
            aria-hidden="true"
            className="script text-3xl leading-[1.6] sm:text-4xl md:text-[3.1rem]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.035 } } }}
          >
            {WORDS.map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                className="inline-block pr-[0.28em]"
                variants={{
                  hidden: { opacity: 0.12, y: 6 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.p>
        </blockquote>

        <motion.footer
          className="mt-10 flex items-center gap-4"
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
        >
          <span className="h-px w-12 bg-gold-500" aria-hidden="true" />
          <p className="text-sm text-gold-400">— {investorQuote.attribution}</p>
        </motion.footer>
      </div>
    </section>
  );
}
