'use client';

import { useRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Card that tracks the cursor with a soft radial highlight. The position is
 * written straight to CSS custom properties, so no React state updates (and no
 * re-renders) happen while the pointer moves.
 */
export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(201, 162, 39, 0.16)',
  as: Tag = 'div',
}) {
  const ref = useRef(null);

  const handleMove = (event) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
    node.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
    node.style.setProperty('--spot-opacity', '1');
  };

  const handleLeave = () => {
    ref.current?.style.setProperty('--spot-opacity', '0');
  };

  return (
    <Tag
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn('group relative overflow-hidden', className)}
      style={{ '--spot-opacity': 0 }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: 'var(--spot-opacity)',
          background: `radial-gradient(320px circle at var(--spot-x) var(--spot-y), ${spotlightColor}, transparent 72%)`,
        }}
      />
      <div className="relative">{children}</div>
    </Tag>
  );
}
