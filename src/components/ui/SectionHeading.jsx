import { cn } from '@/lib/utils';
import { surface } from '@/theme';
import Reveal from './Reveal';

/**
 * Eyebrow + title + optional lead paragraph, matching the profile deck's hierarchy.
 *
 * Pass `tone` to inherit the surrounding <Section> tone; `invert` stays
 * supported as a shorthand for the dark surfaces.
 */
export default function SectionHeading({
  eyebrow,
  title,
  lead,
  align = 'left',
  tone,
  invert = false,
  className = '',
}) {
  const centered = align === 'center';
  const palette = surface(tone ?? (invert ? 'deep' : 'light'));

  return (
    <Reveal className={cn('max-w-3xl', centered && 'mx-auto text-center', className)}>
      {eyebrow ? (
        <span className={palette.invert ? 'eyebrow-invert' : 'eyebrow'}>{eyebrow}</span>
      ) : null}

      <h2
        className={cn(
          'mt-5 text-balance text-3xl font-bold leading-[1.1] sm:text-4xl md:text-5xl',
          palette.heading,
        )}
      >
        {title}
      </h2>

      {lead ? (
        <p className={cn('mt-5 text-base leading-relaxed md:text-lg', palette.body)}>{lead}</p>
      ) : null}
    </Reveal>
  );
}
