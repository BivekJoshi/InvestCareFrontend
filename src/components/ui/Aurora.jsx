import { cn } from '@/lib/utils';

/**
 * Slow-drifting colour wash used behind dark sections. Three offset blobs at
 * different speeds read as one living gradient without a canvas or a video.
 */
export default function Aurora({ className = '', intensity = 'default' }) {
  const opacity = intensity === 'soft' ? 'opacity-60' : 'opacity-100';

  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', opacity, className)} aria-hidden="true">
      <div
        className="absolute -left-[10%] top-[-15%] h-[38rem] w-[38rem] rounded-full bg-forest-600/30 blur-[140px] animate-aurora"
        style={{ '--aurora-duration': '19s' }}
      />
      <div
        className="absolute right-[-8%] top-[10%] h-[32rem] w-[32rem] rounded-full bg-gold-600/20 blur-[130px] animate-aurora"
        style={{ '--aurora-duration': '24s', animationDelay: '-6s' }}
      />
      <div
        className="absolute bottom-[-20%] left-[30%] h-[34rem] w-[34rem] rounded-full bg-forest-400/20 blur-[150px] animate-aurora"
        style={{ '--aurora-duration': '28s', animationDelay: '-12s' }}
      />
    </div>
  );
}
