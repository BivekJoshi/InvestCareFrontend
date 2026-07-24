'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { EASE, viewportOnce } from '@/lib/motion';

const SIZE = 260;
const STROKE = 42;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP_DEG = 1.6;

/**
 * Animated SVG donut for the target sector allocation.
 * Hovering (or focusing) a segment lifts it and reports the active slug upward.
 */
export default function AllocationDonut({ data, onActiveChange }) {
  const [active, setActive] = useState(null);

  const setHover = (slug) => {
    setActive(slug);
    onActiveChange?.(slug);
  };

  const activeItem = data.find((d) => d.slug === active);

  // Running offset in degrees so segments sit end-to-end starting at 12 o'clock.
  let cursor = 0;

  return (
    <div className="relative mx-auto w-full max-w-[300px]">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full -rotate-90"
        role="img"
        aria-label="Target capital allocation by sector"
      >
        {data.map((item, index) => {
          const rotation = cursor;
          cursor += (item.share / 100) * 360;

          const length = (item.share / 100) * CIRCUMFERENCE;
          const gap = (GAP_DEG / 360) * CIRCUMFERENCE;
          const isActive = active === item.slug;
          const dimmed = active && !isActive;

          return (
            <motion.circle
              key={item.slug}
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={item.color}
              strokeWidth={isActive ? STROKE + 8 : STROKE}
              strokeDasharray={`${Math.max(length - gap, 0)} ${CIRCUMFERENCE}`}
              transform={`rotate(${rotation} ${SIZE / 2} ${SIZE / 2})`}
              initial={{ strokeDashoffset: CIRCUMFERENCE, opacity: 0 }}
              whileInView={{ strokeDashoffset: 0, opacity: dimmed ? 0.35 : 1 }}
              viewport={viewportOnce}
              transition={{
                strokeDashoffset: { duration: 1.1, delay: 0.12 * index, ease: EASE },
                opacity: { duration: 0.3 },
                strokeWidth: { duration: 0.3 },
              }}
              onMouseEnter={() => setHover(item.slug)}
              onMouseLeave={() => setHover(null)}
              className="cursor-pointer"
              style={{ transition: 'stroke-width .3s ease' }}
            />
          );
        })}
      </svg>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-display text-4xl font-bold text-forest-900">
          {activeItem ? `${activeItem.share}%` : '100%'}
        </span>
        <span className="mt-1 max-w-[9rem] text-[11px] uppercase leading-tight tracking-[0.14em] text-forest-600">
          {activeItem ? activeItem.name : 'Target allocation'}
        </span>
      </div>
    </div>
  );
}
