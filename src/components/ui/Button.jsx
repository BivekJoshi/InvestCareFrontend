import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const BASE =
  'group inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold ' +
  'transition-all duration-300 focus-visible:outline focus-visible:outline-2 ' +
  'focus-visible:outline-offset-2 focus-visible:outline-gold-500 disabled:opacity-60';

const VARIANTS = {
  primary:
    'bg-forest-800 text-cream hover:bg-forest-700 shadow-card hover:shadow-lift hover:-translate-y-0.5',
  gold: 'bg-gold-500 text-forest-950 hover:bg-gold-400 shadow-card hover:shadow-lift hover:-translate-y-0.5',
  outline:
    'border border-forest-300 text-forest-800 hover:border-forest-700 hover:bg-forest-50',
  ghostLight:
    'border border-white/25 text-cream hover:border-white/60 hover:bg-white/10 backdrop-blur-sm',
};

const SIZES = {
  sm: 'px-5 py-2.5',
  md: 'px-7 py-3.5',
};

/**
 * Renders a `next/link` when `href` is supplied, otherwise a native button.
 */
export default function Button({
  href,
  children,
  variant = 'primary',
  size = 'md',
  withArrow = false,
  className = '',
  ...props
}) {
  const classes = cn(BASE, VARIANTS[variant], SIZES[size], className);

  const content = (
    <>
      {children}
      {withArrow ? (
        <ArrowRight
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden="true"
        />
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {content}
    </button>
  );
}
