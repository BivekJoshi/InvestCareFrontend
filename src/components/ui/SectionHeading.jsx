import { cn } from '@/lib/utils';
import Reveal from './Reveal';

/**
 * Eyebrow + title + optional lead paragraph, matching the profile deck's hierarchy.
 */
export default function SectionHeading({
  eyebrow,
  title,
  lead,
  align = 'left',
  invert = false,
  className = '',
}) {
  const centered = align === 'center';

  return (
    <Reveal
      className={cn(
        'max-w-3xl',
        centered && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow ? (
        <span className={invert ? 'eyebrow-invert' : 'eyebrow'}>{eyebrow}</span>
      ) : null}

      <h2
        className={cn(
          'mt-5 text-3xl font-bold leading-[1.1] text-balance sm:text-4xl md:text-5xl',
          invert ? 'text-white' : 'text-forest-900',
        )}
      >
        {title}
      </h2>

      {lead ? (
        <p
          className={cn(
            'mt-5 text-base leading-relaxed md:text-lg',
            invert ? 'text-forest-100/80' : 'text-forest-800/75',
          )}
        >
          {lead}
        </p>
      ) : null}
    </Reveal>
  );
}
