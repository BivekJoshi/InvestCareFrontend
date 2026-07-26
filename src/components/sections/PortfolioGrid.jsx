import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import MediaFrame from '@/components/ui/MediaFrame';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { getIcon } from '@/components/ui/icon-map';
import { portfolio, portfolioStats } from '@/data/portfolio';

export default function PortfolioGrid({
  id = 'portfolio',
  tone = 'light',
  eyebrow = 'Portfolio Snapshot',
  title = 'Our Portfolio',
  lead = 'Invest Care holds and is building positions in five companies across hospitality, manufacturing, agro-processing and hydropower.',
  showStats = true,
}) {
  return (
    <Section id={id} tone={tone}>
      <SectionHeading eyebrow={eyebrow} title={title} lead={lead} />

      <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" staggerChildren={0.09}>
        {portfolio.map((item) => (
          <RevealItem key={item.slug}>
            <PortfolioCard item={item} />
          </RevealItem>
        ))}

        {showStats ? (
          <RevealItem>
            <div className="flex h-full flex-col justify-center rounded-2xl bg-forest-900 p-8 text-cream shadow-lift">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-400">
                Portfolio at a Glance
              </h3>
              <dl className="mt-7 space-y-6">
                {portfolioStats.map((stat) => (
                  <div key={stat.label} className="flex items-baseline gap-4">
                    <dt className="sr-only">{stat.label}</dt>
                    <dd className="font-display text-3xl font-bold text-gold-400">{stat.value}</dd>
                    <span className="text-sm text-forest-100/70">{stat.label}</span>
                  </div>
                ))}
              </dl>
            </div>
          </RevealItem>
        ) : null}
      </RevealGroup>
    </Section>
  );
}

function PortfolioCard({ item }) {
  const Icon = getIcon(item.icon);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-forest-100 bg-white shadow-card transition duration-300 hover:-translate-y-1.5 hover:shadow-lift">
      <MediaFrame
        src={item.image}
        alt={item.name}
        hint={item.imageHint}
        ratio="landscape"
        className="rounded-none"
        imageClassName="group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-800 text-cream">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3 className="font-display text-lg font-semibold leading-snug text-forest-900">
              {item.name}
            </h3>
            <p className="script mt-1 text-lg text-forest-600">{item.brand}</p>
          </div>
        </div>

        <p className="mt-5 flex-1 text-sm leading-relaxed text-forest-800/70">{item.summary}</p>

        <div className="mt-6 flex items-center justify-between border-t border-forest-100 pt-4">
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-forest-600">
            {item.sector}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gold-600">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-500" aria-hidden="true" />
            {item.status}
          </span>
        </div>
      </div>
    </article>
  );
}
