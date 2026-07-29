import Marquee from '@/components/ui/Marquee';
import { getIcon } from '@/components/ui/icon-map';
import { sectors } from '@/data/sectors';

const FACTS = [
  'Incorporated 2074 BS',
  'Public Limited Company',
  'SEBON-compliant roadmap',
  'IPO application · Magh 2083',
  '5 active holdings',
  // 'Reg. 175982/074/075',
];

/**
 * Two counter-scrolling rails between the hero and the page body — sectors on
 * top, company facts beneath — that keep the fold alive without adding weight.
 */
export default function TickerBand() {
  return (
    <section id="ticker" className="relative overflow-hidden border-y border-white/5 bg-forest-950 py-7">
      <div className="pointer-events-none absolute inset-0 grain opacity-[0.04]" aria-hidden="true" />

      <Marquee duration={44}>
        {sectors.map((sector) => {
          const Icon = getIcon(sector.icon);
          return (
            <span key={sector.slug} className="flex items-center gap-3 px-8">
              <Icon className="h-4 w-4 text-gold-500" aria-hidden="true" />
              <span className="whitespace-nowrap font-display text-lg font-semibold text-cream/90 sm:text-xl">
                {sector.name}
              </span>
              <span className="font-display text-sm font-bold text-gold-500">{sector.share}%</span>
              <span className="ml-6 h-1 w-1 rounded-full bg-forest-600" aria-hidden="true" />
            </span>
          );
        })}
      </Marquee>

      <Marquee reverse duration={56} className="mt-5 opacity-70">
        {FACTS.map((fact) => (
          <span key={fact} className="flex items-center gap-6 px-7">
            <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.24em] text-forest-200/70">
              {fact}
            </span>
            <span className="h-1 w-1 rounded-full bg-gold-600/60" aria-hidden="true" />
          </span>
        ))}
      </Marquee>
    </section>
  );
}
