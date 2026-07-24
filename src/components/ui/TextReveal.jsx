'use client';

import { motion } from 'framer-motion';
import { EASE, viewportOnce } from '@/lib/motion';
import { cn } from '@/lib/utils';

/**
 * Reveals a sentence word by word. Each word sits in its own overflow-hidden
 * box so the letters rise from behind a mask rather than simply fading.
 */
export default function TextReveal({
  text,
  as: Tag = 'h2',
  className = '',
  wordClassName = '',
  highlight = [],
  highlightClassName = 'text-gradient-gold',
  delay = 0,
  stagger = 0.045,
  trigger = 'inView',
}) {
  const words = text.split(' ');
  const animateProps =
    trigger === 'mount'
      ? { animate: 'visible' }
      : { whileInView: 'visible', viewport: viewportOnce };

  return (
    <Tag className={cn('flex flex-wrap', className)}>
      <span className="sr-only">{text}</span>

      <motion.span
        aria-hidden="true"
        className="flex flex-wrap"
        initial="hidden"
        {...animateProps}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
        }}
      >
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.12em] pr-[0.26em]">
            <motion.span
              className={cn(
                'inline-block',
                wordClassName,
                highlight.includes(word) && highlightClassName,
              )}
              variants={{
                hidden: { y: '108%', opacity: 0 },
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: { duration: 0.85, ease: EASE },
                },
              }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
