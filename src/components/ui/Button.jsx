import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { button as buttonTheme } from '@/theme';

/**
 * Renders a `next/link` when `href` is supplied, otherwise a native button.
 * Variant and size recipes live in `@/theme` so buttons rendered by hand
 * elsewhere can reuse the exact same classes.
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
  const classes = cn(
    buttonTheme.base,
    buttonTheme.variants[variant] ?? buttonTheme.variants.primary,
    buttonTheme.sizes[size] ?? buttonTheme.sizes.md,
    className,
  );

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
