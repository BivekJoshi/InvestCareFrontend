import PageHero from '@/components/ui/PageHero';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import SectorAllocation from '@/components/sections/SectorAllocation';
import PortfolioGrid from '@/components/sections/PortfolioGrid';
import CallToAction from '@/components/sections/CallToAction';
import { portfolio } from '@/data/portfolio';

export const metadata = {
  title: 'Our Portfolio',
  description:
    'Five active holdings across hospitality, manufacturing, agro-processing and hydropower — Sankalpa Hospitality, Diamond Hill Resort, Classic Industries, Kisan Agrobase and Dobhan Khola Hydropower.',
};

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio Snapshot"
        title="Capital already at work."
        lead="Invest Care holds and is building positions in five companies across hospitality, manufacturing, agro-processing and hydropower — a live portfolio, not a proposal on paper."
        breadcrumb={['Portfolio']}
      />

      <PortfolioGrid
        id="holdings"
        tone="light"
        eyebrow="Holdings"
        title="Portfolio Companies"
        lead="Each holding is chosen for defensible market position, credible management and a clear path to cash generation."
      />

      <SectorAllocation tone="white" />

      <Section id="detail" tone="tint">
        <SectionHeading
          eyebrow="Portfolio Detail"
          title="Portfolio at a Glance"
          lead="A closer look at each holding: what the business is, where it operates, and the metrics that matter."
        />

        <Reveal className="mt-12">
          {/* Table scrolls horizontally on narrow screens rather than squeezing the page. */}
          <div className="overflow-x-auto rounded-2xl border border-forest-100 bg-white shadow-card">
            <table className="w-full min-w-[56rem] border-collapse text-left">
              <caption className="sr-only">
                Invest Care Limited portfolio companies, sectors, profiles and key metrics
              </caption>
              <thead>
                <tr className="bg-forest-900 text-cream">
                  {['Company', 'Sector', 'Profile', 'Key Metrics'].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="px-6 py-5 text-[11px] font-semibold uppercase tracking-[0.16em]"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-forest-100">
                {portfolio.map((item, i) => (
                  <tr key={item.slug} className={i % 2 === 1 ? 'bg-forest-50/60' : 'bg-white'}>
                    <th scope="row" className="px-6 py-6 align-top">
                      <span className="block font-display text-base font-semibold text-forest-900">
                        {item.name}
                      </span>
                      <span className="mt-1 block text-xs font-normal italic text-forest-600">
                        {item.brand}
                      </span>
                    </th>
                    <td className="px-6 py-6 align-top text-sm font-semibold text-forest-700">
                      {item.sector}
                    </td>
                    <td className="max-w-sm px-6 py-6 align-top text-sm leading-relaxed text-forest-800/75">
                      {item.profile}
                    </td>
                    <td className="px-6 py-6 align-top">
                      <ul className="space-y-1.5">
                        {item.metrics.map((metric) => (
                          <li
                            key={metric}
                            className="flex gap-2 text-xs leading-relaxed text-forest-800/70"
                          >
                            <span
                              className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold-500"
                              aria-hidden="true"
                            />
                            {metric}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </Section>

      <CallToAction
        title="Back the next holding."
        body="Promoter capital raised today funds the existing portfolio and a well-advanced acquisition pipeline."
        primary={{ href: '/invest', label: 'The Investment Opportunity' }}
        secondary={{ href: '/contact', label: 'Contact the Board' }}
      />
    </>
  );
}
