import { cn } from '@/lib/utils';

const TONES = {
  light: 'bg-cream text-forest-900',
  white: 'bg-white text-forest-900',
  tint: 'bg-forest-50 text-forest-900',
  dark: 'bg-forest-900 text-forest-50',
  deep: 'bg-forest-950 text-forest-50',
};

/**
 * Vertical rhythm + background tone wrapper used by every page section.
 */
export default function Section({
  id,
  tone = 'light',
  className = '',
  containerClassName = '',
  children,
}) {
  return (
    <section
      id={id}
      className={cn('relative overflow-hidden py-20 md:py-28', TONES[tone], className)}
    >
      <div className={cn('container relative', containerClassName)}>{children}</div>
    </section>
  );
}
