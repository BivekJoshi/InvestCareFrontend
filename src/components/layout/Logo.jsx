import Link from 'next/link';
import { cn } from '@/lib/utils';
import { company } from '@/data/company';

/**
 * Wordmark + seedling glyph. Swap `LogoMark` for the official SVG/PNG
 * (drop it at /public/images/brand/logo.svg) when the asset is available.
 */
export default function Logo({ invert = false, className = '' }) {
  return (
    <Link
      href="/"
      className={cn('group flex items-center gap-3', className)}
      aria-label={`${company.name} — home`}
    >
      <span
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors',
          invert ? 'bg-white/10 text-gold-400' : 'bg-forest-800 text-cream',
        )}
      >
        <LogoMark />
      </span>

      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'font-display text-[15px] font-bold tracking-tight sm:text-base',
            invert ? 'text-white' : 'text-forest-900',
          )}
        >
          Invest Care
        </span>
        <span
          className={cn(
            'mt-1 text-[9px] font-semibold uppercase tracking-[0.22em]',
            invert ? 'text-gold-400' : 'text-forest-500',
          )}
        >
          Limited
        </span>
      </span>
    </Link>
  );
}

function LogoMark() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      className="transition-transform duration-500 group-hover:rotate-6"
    >
      <path d="M50 74V46" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <path
        d="M50 52c-13 0-19-7-19-17 11 0 19 7 19 17Z"
        fill="currentColor"
        opacity="0.55"
      />
      <path d="M50 48c13-2 18-10 17-20-11 1-18 9-17 20Z" fill="currentColor" />
      <path
        d="M24 62c9 10 17 13 26 13s17-3 26-13"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}
