import { cn } from '@/lib/utils';

/**
 * Brand loading state for a route segment that hasn't resolved yet.
 *
 * Deliberately server-rendered and CSS-only: it has to paint the instant the
 * router suspends, so it must not wait on a client bundle of its own.
 *
 * The whole block fades in on a short delay (`animate-fade-in-delayed`) so a
 * navigation that resolves quickly never flashes a loader — the user only ever
 * sees this when the wait is long enough to need explaining.
 */
export default function RouteLoader({ label = 'Loading', className = '' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        // Every route opens on a dark hero — matching it here means the
        // loader reads as the page arriving, not as a white flash.
        'relative flex min-h-[80vh] flex-col items-center justify-center gap-8 overflow-hidden',
        'bg-forest-950 px-6 py-24 text-cream animate-fade-in-delayed',
        className,
      )}
    >
      <div className="absolute inset-0 bg-grid-forest bg-[size:64px_64px] opacity-30" aria-hidden="true" />
      <div
        className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-forest-700/25 blur-[120px]"
        aria-hidden="true"
      />

      <span className="sr-only">{label}…</span>

      <span
        className="relative flex h-24 w-24 items-center justify-center"
        aria-hidden="true"
      >
        {/* Static track + rotating arc, so the mark reads as "working". */}
        <span className="absolute inset-0 rounded-full border-2 border-white/10" />
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-gold-500" />
        <SeedlingMark />
      </span>

      <span className="relative flex flex-col items-center gap-4">
        <span className="script text-2xl text-gold-300" aria-hidden="true">
          {label}
        </span>

        {/* Indeterminate bar — the wait has no measurable progress to report. */}
        <span
          className="relative block h-px w-48 overflow-hidden bg-white/15 sm:w-64"
          aria-hidden="true"
        >
          <span className="absolute inset-y-0 left-0 w-2/5 animate-shimmer bg-gold-500" />
        </span>
      </span>
    </div>
  );
}

/** Line-drawn seedling echoing the Invest Care logo. */
function SeedlingMark() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      className="animate-pulse-soft text-gold-400"
    >
      <path d="M50 74V46" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <path d="M50 52c-13 0-19-7-19-17 11 0 19 7 19 17Z" fill="currentColor" opacity="0.55" />
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
