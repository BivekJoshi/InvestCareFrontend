'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const RATIOS = {
  landscape: 'aspect-[16/10]',
  wide: 'aspect-[21/9]',
  square: 'aspect-square',
  portrait: 'aspect-[4/5]',
};

/**
 * Reserved image slot.
 *
 * Renders the real asset once it exists at `src`; until then (or if the file is
 * missing) it falls back to a branded placeholder that states the expected
 * filename and dimensions, so layout never shifts and hand-off stays obvious.
 */
const PLACEHOLDER_TONES = {
  light: {
    wrap: 'border-forest-300 bg-forest-50',
    icon: 'text-forest-400',
    label: 'text-forest-600',
    hint: 'text-forest-500',
  },
  dark: {
    wrap: 'border-white/15 bg-forest-900/60',
    icon: 'text-forest-300/70',
    label: 'text-forest-100/80',
    hint: 'text-forest-200/50',
  },
};

export default function MediaFrame({
  src,
  alt,
  hint,
  ratio = 'landscape',
  tone = 'light',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  className = '',
  imageClassName = '',
}) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !src || failed;
  const palette = PLACEHOLDER_TONES[tone] ?? PLACEHOLDER_TONES.light;

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-2xl',
        tone === 'dark' ? 'bg-forest-900' : 'bg-forest-100',
        RATIOS[ratio],
        className,
      )}
    >
      {showPlaceholder ? (
        <div
          className={cn(
            'absolute inset-0 flex flex-col items-center justify-center gap-2 border border-dashed p-6 text-center',
            palette.wrap,
          )}
          role="img"
          aria-label={alt}
        >
          <ImageIcon className={cn('h-7 w-7', palette.icon)} aria-hidden="true" />
          <p
            className={cn(
              'text-xs font-semibold uppercase tracking-[0.16em]',
              palette.label,
            )}
          >
            Image slot
          </p>
          {hint ? (
            <p className={cn('max-w-[26ch] text-[11px] leading-relaxed', palette.hint)}>{hint}</p>
          ) : null}
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          onError={() => setFailed(true)}
          className={cn('object-cover transition-transform duration-700', imageClassName)}
        />
      )}
    </div>
  );
}
