import { cn } from '@/lib/utils';

/**
 * Infinite ticker. The children are rendered twice and the track is translated
 * exactly -50%, so the loop is seamless with no JS running per frame.
 */
export default function Marquee({
  children,
  reverse = false,
  duration = 38,
  className = '',
  fade = true,
}) {
  const track = (
    <div
      className={cn(
        'flex w-max shrink-0 items-center',
        reverse ? 'animate-marquee-reverse' : 'animate-marquee',
      )}
      style={{ '--marquee-duration': `${duration}s` }}
    >
      {/* Two identical copies: translating the track by exactly -50% wraps seamlessly. */}
      <div className="flex items-center">{children}</div>
      <div className="flex items-center" aria-hidden="true">
        {children}
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        'group relative flex overflow-hidden pause-on-hover',
        fade &&
          '[mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]',
        className,
      )}
    >
      {track}
    </div>
  );
}
