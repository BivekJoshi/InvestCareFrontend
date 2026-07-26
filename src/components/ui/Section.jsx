import { cn } from '@/lib/utils';
import { DEFAULT_TONE, surface } from '@/theme';

/**
 * Vertical rhythm + background tone wrapper used by every page section.
 * Tones are defined once in `@/theme`, so a section never invents its own
 * background/foreground pairing.
 */
export default function Section({
  id,
  tone = DEFAULT_TONE,
  className = '',
  containerClassName = '',
  children,
}) {
  return (
    <section
      id={id}
      className={cn('relative overflow-hidden py-20 md:py-28', surface(tone).section, className)}
    >
      <div className={cn('container relative', containerClassName)}>{children}</div>
    </section>
  );
}
